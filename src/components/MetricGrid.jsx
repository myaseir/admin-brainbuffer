"use client";
import { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Gamepad2, 
  RotateCcw, 
  Download,
  Activity,
  RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Added onRefresh to the props
export default function MetricGrid({ stats, health, onReset, onRefresh }) {
  const [isResetting, setIsResetting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!stats || !health) return null;

  // --- 1. REFRESH LOGIC ---
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Calling the refresh function passed from page.tsx
      await onRefresh();
      toast.success("Real-time metrics updated");
    } catch (error) {
      toast.error("Failed to sync live data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // --- 2. DOWNLOAD LOGIC ---
  const downloadFinancialSummary = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const csvRows = [
      ["Metric", "Value (PKR/Count)", "Category"],
      ["Net Profit (Commission)", stats.net_profit || 0, "Revenue"],
      ["Total Inflow (Deposits)", stats.gross_collections || 0, "Cash Flow"],
      ["Total Outflow (Withdrawals)", stats.total_payouts || 0, "Cash Flow"],
      ["System Liquidity (User Balances)", stats.system_liquidity || 0, "Liability"],
      ["Total Registered Users", health.database?.total_registered || 0, "Community"],
      ["Live Players Online", health.real_time?.total_players_online || 0, "Activity"],
      ["Active Matches", health.real_time?.active_matches || 0, "Activity"],
      ["Export Date", new Date().toLocaleString(), "Log Data"]
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GlaciaLabs_Financial_Audit_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Financial summary exported!");
  };

  // --- 3. RESET LOGIC ---
  const handleResetClick = async () => {
    const confirm = window.confirm(
      "CRITICAL: Reset Inflow, Outflow, and Profit? This will wipe transactional history from the dashboard metrics."
    );
    if (!confirm) return;

    setIsResetting(true);
    try {
      await onReset(); 
      toast.success("Financial metrics reset successfully");
    } catch (error) {
      toast.error("Reset failed. Check admin permissions.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* --- TOP BAR: ACTION CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Glacia Labs • Financial Audit</p>
          <p className="text-xs font-bold text-slate-600">
            Current Status: <span className={health.database?.status === "Online" ? "text-emerald-600" : "text-red-500"}>
              {health.database?.status || "Checking..."}
            </span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* NEW REFRESH BUTTON */}
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Syncing..." : "Sync Live Stats"}
          </button>

          <button 
            onClick={downloadFinancialSummary}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Download size={14} />
            Export Summary
          </button>

          <button 
            onClick={handleResetClick}
            disabled={isResetting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RotateCcw size={14} className={isResetting ? "animate-spin" : ""} />
            {isResetting ? "Wiping..." : "Reset Metrics"}
          </button>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. 💰 NET PROFIT */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Net Profit</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            PKR {stats.net_profit?.toLocaleString() || 0}
          </h3>
        </div>

        {/* 2. 🏦 SYSTEM LIQUIDITY */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">User Holdings</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            PKR {stats.system_liquidity?.toLocaleString() || 0}
          </h3>
        </div>

        {/* 3. 👥 TOTAL USERS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="text-indigo-600" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Registered</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {health.database?.total_registered || 0} Users
          </h3>
        </div>

        {/* 4. 🟢 LIVE ONLINE */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group">
          <div className="absolute top-6 right-6 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <div className="p-3 bg-green-50 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <Gamepad2 className="text-green-600" size={24} />
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Players Online</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {health.real_time?.total_players_online || 0} Live
          </h3>
        </div>

        {/* 5. ⚔️ ACTIVE MATCHES */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity className="text-rose-600" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Active Matches</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {health.real_time?.active_matches || 0} In-Game
          </h3>
        </div>

        {/* 6. 📉 INFLOW/OUTFLOW COMPACT */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 lg:col-span-3 flex items-center justify-around">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Inflow</p>
            <p className="text-sm font-black text-violet-600 flex items-center gap-1">
              <ArrowDownRight size={14} /> PKR {stats.gross_collections?.toLocaleString() || 0}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-slate-100" />
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outflow</p>
            <p className="text-sm font-black text-orange-600 flex items-center gap-1">
              <ArrowUpRight size={14} /> PKR {stats.total_payouts?.toLocaleString() || 0}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}