"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import AdminHeader from '@/src/components/AdminHeader';
import MetricGrid from '@/src/components/MetricGrid';
import WithdrawalTable from '@/src/components/WithdrawalTable';
import DepositTable from '@/src/components/DepositTable';
import ActivityChart from '@/src/components/ActivityChart';
import SystemHealth from '@/src/components/SystemHealth';
// 👇 1. Import the Leaderboard Component
import AdminLeaderboard from '@/src/components/AdminLeaderboard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [peakData, setPeakData] = useState<any[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  // 👇 2. State for Leaderboard
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return { "Content-Type": "application/json" };
    
    const token = localStorage.getItem('token');
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders() as any;
      
      // 👇 3. Fetch Leaderboard Data
      const [revRes, healthRes, peakRes, depRes, withRes, leadRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/revenue/today`, { headers }),
        fetch(`${API_BASE}/api/admin/health`, { headers }),
        fetch(`${API_BASE}/api/admin/stats/peak-times`, { headers }),
        fetch(`${API_BASE}/api/admin/deposits/pending`, { headers }),
        fetch(`${API_BASE}/api/admin/withdrawals/pending`, { headers }),
        fetch(`${API_BASE}/api/leaderboard/stats`, { headers }) // 👈 New Endpoint
      ]);

      if (revRes.status === 401 || revRes.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        throw new Error("Session Expired");
      }

      if (!revRes.ok) throw new Error("Server Error");

      setStats((await revRes.json()).metrics);
      setHealth(await healthRes.json());
      setPeakData(await peakRes.json());
      setPendingDeposits((await depRes.json()).pending_deposits || []);
      setPendingWithdrawals(await withRes.json() || []);
      // 👇 4. Set Leaderboard Data
      setLeaderboardData(await leadRes.json());
      
    } catch (err: any) {
      if (err.message !== "Session Expired") {
        setError(err.message || "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    endpoint: 'deposit' | 'withdrawal', 
    id: string, 
    action: 'approve' | 'reject'
  ) => {
    try {
      const headers = getAuthHeaders() as any;
      const res = await fetch(`${API_BASE}/api/admin/${endpoint}/${id}/${action}`, {
        method: 'POST',
        headers: headers
      });

      if (res.ok) {
        alert(`${endpoint} ${action} successful!`);
        fetchData(); 
      } else {
        alert("Action failed.");
      }
    } catch (err: any) { 
      alert("Connection Error"); 
    }
  };

  useEffect(() => { 
    if (localStorage.getItem('token')) {
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
      <div className="max-w-6xl mx-auto">
        <AdminHeader loading={loading} onRefresh={fetchData} />
        
        {/* Tables */}
        <WithdrawalTable 
          data={pendingWithdrawals} 
          onAction={(id: string, action: 'approve' | 'reject') => handleAction('withdrawal', id, action)} 
        />
        
        <DepositTable 
          data={pendingDeposits} 
          onAction={(id: string, action: 'approve' | 'reject') => handleAction('deposit', id, action)} 
        />

        {/* Metrics & Charts */}
        <MetricGrid stats={stats} health={health} />
        <ActivityChart data={peakData} />
        <SystemHealth health={health} stats={stats} />

        {/* 👇 5. Leaderboard (Added at the end) */}
        <div className="mt-8">
            <AdminLeaderboard data={leaderboardData} />
        </div>
      </div>
    </div>
  );
}