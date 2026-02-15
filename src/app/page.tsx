"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

// Core Components
import AdminHeader from '@/src/components/AdminHeader';
import MetricGrid from '@/src/components/MetricGrid';
import WithdrawalTable from '@/src/components/WithdrawalTable';
import DepositTable from '@/src/components/DepositTable';
import SystemHealth from '@/src/components/SystemHealth';
import AdminLeaderboard from '@/src/components/AdminLeaderboard';
import ActivityChart from '@/src/components/ActivityChart';
import MaintenanceControl from '@/src/components/MaintenanceControl';
// New Feature Components
import AdminRequests from '@/src/components/AdminRequests';
import UserTable from '@/src/components/UserTable';
import GlobalAnnouncement from '@/src/components/GlobalAnnouncement';
import AuditModal from '@/src/components/AuditModal';
import BotToggle from '@/src/components/BotToggle';
import ReferralDetails from '@/src/components/ReferralDetails'; 
import OnlineUsersTable from '@/src/components/OnlineUsersTable';
import ReferralLeaderboard from '@/src/components/ReferralLeaderboard';

// 🚀 NEW COMPONENT
import ActiveMatchesTable from '@/src/components/ActiveMatchesTable';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type HeaderType = Record<string, string>;

// Match Interface for Type Safety
interface Match {
  id: string;
  p1_name: string;
  p2_name: string;
  stake: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [peakData, setPeakData] = useState([]); 
  
  // 🚀 NEW STATE FOR LIVE MATCHES
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingReferralsFor, setViewingReferralsFor] = useState<{id: string, name: string} | null>(null);

  const getAuthHeaders = (): HeaderType => {
    const headers: HeaderType = { "Content-Type": "application/json" };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleFinancialReset = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/admin/system/reset-finances`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    if (res.ok) fetchData();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  // --- 🔄 THE GLOBAL REFRESH LOGIC ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      
      // Promise.all ensures all data refreshes simultaneously
      const [revRes, healthRes, depRes, withRes, leadRes, peakRes, matchRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/revenue/today`, { headers }),
        fetch(`${API_BASE}/api/admin/health`, { headers }),
        fetch(`${API_BASE}/api/admin/deposits/pending`, { headers }),
        fetch(`${API_BASE}/api/admin/withdrawals/pending`, { headers }),
        fetch(`${API_BASE}/api/leaderboard/stats`, { headers }),
        fetch(`${API_BASE}/api/admin/stats/peak-times`, { headers }),
        fetch(`${API_BASE}/api/admin/active-matches/details`, { headers }) // 🚀 Fetching match details
      ]);

      if (revRes.status === 401 || revRes.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        throw new Error("Session Expired");
      }

      if (!revRes.ok) throw new Error("Server Error");

      const revData = await revRes.json();
      setStats(revData.metrics);
      setHealth(await healthRes.json());
      setPendingDeposits((await depRes.json()).pending_deposits || []);
      setPendingWithdrawals((await withRes.json()).pending_withdrawals || []);
      setLeaderboardData(await leadRes.json());
      setPeakData(await peakRes.json() || []);
      
      // 🚀 Populate Live Matches
      const matchData = await matchRes.json();
      setActiveMatches(matchData.active_matches || []);
      
    } catch (err: any) {
      const message = err?.message || "An unknown error occurred";
      if (message !== "Session Expired") setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (endpoint: string, id: string, action: string) => {
    try {
      const headers = getAuthHeaders();
      const url = endpoint === 'deposit' 
        ? `${API_BASE}/api/admin/deposit/${id}/${action}`
        : `${API_BASE}/api/admin/withdraw/${id}/${action}`;

      const res = await fetch(url, { method: 'POST', headers: headers });
      if (res.ok) {
        alert(`${endpoint} ${action} successful!`);
        fetchData(); 
      }
    } catch (err) { alert("Connection Error"); }
  };

  useEffect(() => { 
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        fetchData(); 
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Global Announcement */}
        <AdminHeader loading={loading} onRefresh={fetchData} />
        <GlobalAnnouncement />
        
        <div className="my-4 flex gap-4">
          <MaintenanceControl />
          <BotToggle />
        </div>
        
        {/* --- FINANCIAL REQUESTS --- */}
        <div className="space-y-8">
            <WithdrawalTable 
              data={pendingWithdrawals} 
              onAction={(id: string, action: 'approve' | 'reject') => handleAction('withdrawal', id, action)} 
            />
            <DepositTable 
              data={pendingDeposits} 
              onAction={(id: string, action: 'approve' | 'reject') => handleAction('deposit', id, action)} 
            />
        </div>

        {/* --- USER & REFERRAL MANAGEMENT --- */}
        <div className="space-y-12 my-8">
          <UserTable />
          {viewingReferralsFor ? (
              <ReferralDetails 
                  referrerId={viewingReferralsFor.id} 
                  referrerName={viewingReferralsFor.name}
                  onBack={() => setViewingReferralsFor(null)} 
              />
          ) : (
              <ReferralLeaderboard 
                onViewDetails={(id: string, name: string) => setViewingReferralsFor({ id, name })} 
              />
          )}
        </div>

        {/* --- SUPPORT REQUESTS --- */}
        <div className="my-8">
            <AdminRequests onAuditMatch={(matchId: string) => setSelectedMatchId(matchId)} />
        </div>

        {/* --- LIVE MONITORING SECTION --- */}
       

        {/* --- METRICS & HEALTH --- */}
        <MetricGrid 
          stats={stats} 
          health={health} 
          onReset={handleFinancialReset}
          onRefresh={fetchData} 
        />
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <OnlineUsersTable />
            
        </div>
        <ActivityChart data={peakData} />
        <SystemHealth health={health} stats={stats} />

        {/* --- LEADERBOARD --- */}
        <div className="mt-8">
            <AdminLeaderboard data={leaderboardData} />
        </div>

        {/* --- MODALS --- */}
        {selectedMatchId && (
          <AuditModal 
            matchId={selectedMatchId} 
            onClose={() => setSelectedMatchId(null)} 
          />
        )}
      </div>
    </div>
  );
}