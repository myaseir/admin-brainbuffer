"use client";
import { Server, Trophy } from 'lucide-react';

export default function SystemHealth({ health, stats }: { health: any, stats: any }) {
  // Helper to determine if DB is healthy based on string response
  const isDbOnline = health?.database?.status === "Online";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. SERVER INFRASTRUCTURE */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <Server size={16} /> Server Infrastructure
        </h2>
        <div className="space-y-4">
          <HealthRow 
            label="Database Status" 
            value={isDbOnline ? "Operational" : "Offline"} 
            success={isDbOnline} 
          />
          <HealthRow 
            label="Total Registered" 
            // 🛑 FIXED: Matches backend key 'total_registered'
            value={`${health?.database?.total_registered || 0} Users`} 
          />
          <HealthRow 
            label="Backend Version" 
            value="v1.0.0 (FastAPI)" 
          />
          <HealthRow 
            label="Environment" 
            value="Production" 
          />
        </div>
      </div>

      {/* 2. FINANCIAL OVERVIEW */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
          <Trophy size={16} /> Financial Overview
        </h2>
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-800 pb-4">
            <span className="text-slate-400 text-xs font-bold uppercase">Gross Collected</span>
            <span className="text-xl font-black">{stats?.gross_collections?.toLocaleString() || 0} PKR</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-800 pb-4">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Payouts</span>
            <span className="text-xl font-black text-red-400">-{stats?.total_payouts?.toLocaleString() || 0} PKR</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <span className="text-emerald-500 text-xs font-black uppercase">Net Revenue</span>
            <span className="text-3xl font-black text-emerald-400">{stats?.net_profit?.toLocaleString() || 0} PKR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, value, success = true }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
      <span className={`text-xs font-black uppercase ${success ? 'text-slate-900' : 'text-red-500'}`}>{value}</span>
    </div>
  );
}