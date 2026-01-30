"use client";
import { RefreshCcw } from 'lucide-react';

interface AdminHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminHeader({ loading, onRefresh }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Command Center</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
          Glacia<span className="text-emerald-500">Admin</span>
        </h1>
      </div>
      
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
      >
        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
        {loading ? "Syncing..." : "Refresh Data"}
      </button>
    </div>
  );
}