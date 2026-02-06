"use client";
import { useState, useEffect } from 'react';
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

// New Feature Components
import AdminRequests from '@/src/components/AdminRequests';
import UserTable from '@/src/components/UserTable';
import GlobalAnnouncement from '@/src/components/GlobalAnnouncement';
import AuditModal from '@/src/components/AuditModal';

// --- 🚀 NEW REFERRAL LEADERBOARD ---
import ReferralLeaderboard from '@/src/components/ReferralLeaderboard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type HeaderType = Record<string, string>;

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [peakData, setPeakData] = useState([]); 
  
  // Modal State for Auditing
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): HeaderType => {
    const headers: HeaderType = { 
      "Content-Type": "application/json" 
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleFinancialReset = async () => {
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/system/reset-finances`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      fetchData(); 
    } else {
      const errorData = await res.json();
      console.error("Reset failed:", errorData);
      throw new Error("Reset failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      
      const [revRes, healthRes, depRes, withRes, leadRes, peakRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/revenue/today`, { headers }),
        fetch(`${API_BASE}/api/admin/health`, { headers }),
        fetch(`${API_BASE}/api/admin/deposits/pending`, { headers }),
        fetch(`${API_BASE}/api/admin/withdrawals/pending`, { headers }),
        fetch(`${API_BASE}/api/leaderboard/stats`, { headers }),
        fetch(`${API_BASE}/api/admin/stats/peak-times`, { headers }) 
      ]);

      if (revRes.status === 401 || revRes.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        throw new Error("Session Expired");
      }

      if (!revRes.ok) throw new Error("Server Error");

      setStats((await revRes.json()).metrics);
      setHealth(await healthRes.json());
      
      const depData = await depRes.json();
      setPendingDeposits(depData.pending_deposits || []);

      const withData = await withRes.json();
      setPendingWithdrawals(withData.pending_withdrawals || []);
      
      setLeaderboardData(await leadRes.json());
      setPeakData(await peakRes.json() || []);
      
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
      let url = "";
      if (endpoint === 'deposit') {
         url = `${API_BASE}/api/admin/deposit/${id}/${action}`;
      } else {
         url = `${API_BASE}/api/admin/withdraw/${id}/${action}`;
      }

      const res = await fetch(url, { method: 'POST', headers: headers });

      if (res.ok) {
        alert(`${endpoint} ${action} successful!`);
        fetchData(); 
      } else {
        const errData = await res.json();
        alert(`Action failed: ${errData.detail || "Unknown error"}`);
      }
    } catch (err) { 
      alert("Connection Error"); 
    }
  };

  useEffect(() => { 
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        fetchData(); 
    }
  }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <ShieldCheck size={48} className="mx-auto text-red-500" />
        <h1 className="text-xl font-black text-slate-800 uppercase">{error}</h1>
        <button onClick={fetchData} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Global Announcement */}
        <AdminHeader loading={loading} onRefresh={fetchData} />
        <GlobalAnnouncement />
        
        {/* --- PRIORITY 1: FINANCIAL REQUESTS --- */}
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

        {/* --- PRIORITY 2: USER & REFERRAL MANAGEMENT --- */}
        <div className="space-y-12 my-8">
            <UserTable />
            {/* 🎯 Referral Leaderboard placed here to keep User stats together */}
            <ReferralLeaderboard />
        </div>

        {/* --- PRIORITY 3: SUPPORT REQUESTS --- */}
        <div className="my-8">
            <AdminRequests onAuditMatch={(matchId: string) => setSelectedMatchId(matchId)} />
        </div>

        {/* --- PRIORITY 4: METRICS & HEALTH --- */}
        <MetricGrid 
          stats={stats} 
          health={health} 
          onReset={handleFinancialReset}
        />
        
        <ActivityChart data={peakData} />
        
        <SystemHealth health={health} stats={stats} />

        {/* --- PRIORITY 5: SKILL LEADERBOARD --- */}
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