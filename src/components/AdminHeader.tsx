"use client";
import { RefreshCcw } from 'lucide-react';

interface AdminHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminHeader({ loading, onRefresh }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 md:mb-10">
      <div>
        {/* Live Indicator */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Live Command Center
          </span>
        </div>
        
        {/* Title - Smaller text on mobile to prevent wrapping */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
          BrainBuffer<span className="text-emerald-500">Admin</span>
        </h1>
      </div>
      
      {/* Button - Full width on mobile for better ergonomics */}
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 md:py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-70"
      >
        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
        <span className="uppercase tracking-wider">
          {loading ? "Syncing..." : "Refresh Data"}
        </span>
      </button>
    </div>
  );
}