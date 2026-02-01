"use client";
import { DollarSign, Users, ArrowUpRight, ArrowDownRight, Wallet, Activity, Gamepad2 } from 'lucide-react';

export default function MetricGrid({ stats, health }: { stats: any, health: any }) {
  if (!stats || !health) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {/* 1. 💰 NET PROFIT (Commission) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <DollarSign className="text-emerald-600" size={24} />
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Commission</span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Platform Profit</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          PKR {stats.net_profit?.toLocaleString() || 0}
        </h3>
      </div>

      {/* 2. 🏦 SYSTEM LIQUIDITY */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <Wallet className="text-blue-600" size={24} />
          </div>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Liability</span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">User Holdings</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          PKR {stats.system_liquidity?.toLocaleString() || 0}
        </h3>
      </div>

      {/* 3. 👥 TOTAL REGISTERED USERS */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <Users className="text-indigo-600" size={24} />
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Community</span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Registered</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {/* 🛑 FIXED: Matches backend key 'total_registered' */}
          {health.database?.total_registered || 0} Users
        </h3>
      </div>

      {/* 4. 📉 TOTAL DEPOSITS */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-violet-50 rounded-2xl">
            <ArrowDownRight className="text-violet-600" size={24} />
          </div>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Inflow</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          PKR {stats.gross_collections?.toLocaleString() || 0}
        </h3>
      </div>

      {/* 5. 📈 TOTAL WITHDRAWALS */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-orange-50 rounded-2xl">
            <ArrowUpRight className="text-orange-600" size={24} />
          </div>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Outflow</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          PKR {stats.total_payouts?.toLocaleString() || 0}
        </h3>
      </div>

      {/* 6. 🟢 LIVE ONLINE (Matchmaking) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Glowing Dot Animation */}
        <div className="absolute top-6 right-6 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-50 rounded-2xl">
            <Gamepad2 className="text-green-600" size={24} />
          </div>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Live Matchmaking</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {/* 🛑 FIXED: Matches backend key 'real_time' */}
          {health.real_time?.total_players_online || 0} Online
        </h3>
      </div>
      
    </div>
  );
}