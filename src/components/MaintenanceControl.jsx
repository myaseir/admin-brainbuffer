"use client";
import React, { useState, useEffect } from 'react';
import { Power, Loader2 } from 'lucide-react';

export default function MaintenanceControl() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/system/status`)
      .then(res => res.json())
      .then(data => {
        setIsEnabled(data.maintenance);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
  setUpdating(true);
  try {
    // Get the SAME token your dashboard uses
    const token = localStorage.getItem('token'); 
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/system/maintenance/toggle`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status: !isEnabled })
    });

    if (res.status === 401) {
      alert("Unauthorized: You do not have Admin privileges.");
      return;
    }

    if (res.ok) {
      setIsEnabled(!isEnabled);
    }
  } catch (err) {
    alert("Connection Error");
  } finally {
    setUpdating(false);
  }
};

  if (loading) return (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin text-slate-500" size={32} />
    </div>
  );

  return (
    <div className={`p-5 md:p-6 rounded-3xl border transition-all duration-300 ${
      isEnabled ? 'bg-amber-500/10 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.05)]' : 'bg-slate-900 border-slate-800'
    }`}>
      {/* 📱 Mobile: Stacked (flex-col) | 💻 Desktop: Side-by-Side (flex-row) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
              System Control
            </h3>
            {isEnabled && (
              <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded-full animate-pulse tracking-widest">
                LOCKED
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            {isEnabled 
              ? "App is restricted. Only authorized personnel can access match logic." 
              : "App is operational. Users are currently playing and withdrawing."}
          </p>
        </div>

        {/* 📱 Full-width button on mobile for easier tapping */}
        <button
          onClick={handleToggle}
          disabled={updating}
          className={`relative h-14 md:h-12 w-full md:w-36 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
            isEnabled 
              ? 'bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
              : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
          }`}
        >
          {updating ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Power size={20} />
              {isEnabled ? "WAKE UP" : "SHUT DOWN"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}