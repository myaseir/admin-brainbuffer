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
  Download 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MetricGrid({ stats, health, onReset }) {
  const [isResetting, setIsResetting] = useState(false);

  if (!stats || !health) return null;

  // --- 1. DOWNLOAD LOGIC (CSV Generation) ---
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
      ["Export Date", new Date().toLocaleString(), "Log Data"]
    ];

    // Convert array to CSV string
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BrainBuffer_Financial_Summary_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Financial summary exported!");
  };

  // --- 2. RESET LOGIC ---
  const handleResetClick = async () => {
    const confirm = window.confirm(
      "CRITICAL: Are you sure you want to reset Inflow, Outflow, and Profit? User accounts and balances will remain, but transactional history will be wiped."
    );
    if (!confirm) return;

    setIsResetting(true);
    try {
      await onReset(); // Triggers the fetch in your parent page.tsx
      toast.success("Financial metrics reset successfully");
    } catch (error) {
      toast.error("Reset failed. Check backend connection.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* --- TOP BAR: ACTION CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Lifecycle</p>
          <p className="text-xs font-bold text-slate-600">
            Last Finance Audit: <span className="text-emerald-600">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Download CSV Button */}
          <button 
            onClick={downloadFinancialSummary}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Download size={14} />
            Export Summary
          </button>

          {/* Reset Action Button */}
          <button 
            onClick={handleResetClick}
            disabled={isResetting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RotateCcw size={14} className={isResetting ? "animate-spin" : ""} />
            {isResetting ? "Wiping Data..." : "Reset Financials"}
          </button>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. 💰 NET PROFIT */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Profit</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Platform Net</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            PKR {stats.net_profit?.toLocaleString() || 0}
          </h3>
          <p className="text-[9px] text-slate-400 mt-2 italic">Calculated from match commissions</p>
        </div>

        {/* 2. 📉 TOTAL DEPOSITS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-50 rounded-2xl group-hover:scale-110 transition-transform">
              <ArrowDownRight className="text-violet-600" size={24} />
            </div>
            <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Inflow</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Collected</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            PKR {stats.gross_collections?.toLocaleString() || 0}
          </h3>
          <p className="text-[9px] text-slate-400 mt-2 italic">Total since last reset</p>
        </div>

        {/* 3. 📈 TOTAL WITHDRAWALS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-2xl group-hover:scale-110 transition-transform">
              <ArrowUpRight className="text-orange-600" size={24} />
            </div>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Outflow</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Payouts</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            PKR {stats.total_payouts?.toLocaleString() || 0}
          </h3>
          <p className="text-[9px] text-slate-400 mt-2 italic">Total since last reset</p>
        </div>

        {/* 4. 🏦 SYSTEM LIQUIDITY */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 rounded-2xl">
               <Wallet className="text-blue-600" size={24} />
             </div>
           </div>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">User Holdings</p>
           <h3 className="text-2xl font-black text-slate-900 mt-1">
             PKR {stats.system_liquidity?.toLocaleString() || 0}
           </h3>
        </div>

        {/* 5. 👥 REGISTERED USERS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-indigo-50 rounded-2xl">
               <Users className="text-indigo-600" size={24} />
             </div>
           </div>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Players</p>
           <h3 className="text-2xl font-black text-slate-900 mt-1">
             {health.database?.total_registered || 0} Users
           </h3>
        </div>

        {/* 6. 🟢 LIVE ONLINE */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative">
          <div className="absolute top-6 right-6 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <div className="p-3 bg-green-50 w-fit rounded-2xl mb-4">
            <Gamepad2 className="text-green-600" size={24} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Live Now</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {health.real_time?.total_players_online || 0} Online
          </h3>
        </div>

      </div>
    </div>
  );
}