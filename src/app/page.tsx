"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import AdminHeader from '@/src/components/AdminHeader';
import MetricGrid from '@/src/components/MetricGrid';
import WithdrawalTable from '@/src/components/WithdrawalTable';
import DepositTable from '@/src/components/DepositTable';
import SystemHealth from '@/src/components/SystemHealth';
import AdminLeaderboard from '@/src/components/AdminLeaderboard';
// 👇 1. Uncomment the import
import ActivityChart from '@/src/components/ActivityChart';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type HeaderType = Record<string, string>;

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState(null);
  // 👇 2. Add state for Peak Data
  const [peakData, setPeakData] = useState([]); 
  
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      
      // 👇 3. Include the peak-times endpoint in the fetch
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
      // 👇 4. Set the peak data
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
      <div className="max-w-6xl mx-auto">
        <AdminHeader loading={loading} onRefresh={fetchData} />
        
        <WithdrawalTable 
          data={pendingWithdrawals} 
          onAction={(id: string, action: 'approve' | 'reject') => handleAction('withdrawal', id, action)} 
        />
        
        <DepositTable 
          data={pendingDeposits} 
          onAction={(id: string, action: 'approve' | 'reject') => handleAction('deposit', id, action)} 
        />

        <MetricGrid stats={stats} health={health} />
        
        {/* 👇 5. Render the Activity Chart */}
        <ActivityChart data={peakData} />
        
        <SystemHealth health={health} stats={stats} />

        <div className="mt-8">
            <AdminLeaderboard data={leaderboardData} />
        </div>
      </div>
    </div>
  );
}