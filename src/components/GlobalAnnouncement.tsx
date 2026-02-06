"use client";
import { useState } from 'react';
import { Megaphone, Send, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GlobalAnnouncement() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: message.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Broadcast sent to ${data.sent_to} players!`);
        setMessage("");
      } else {
        toast.error(data.detail || "Broadcast failed");
      }
    } catch (error) {
      toast.error("Connection error to broadcast service");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 mb-8 text-white border border-slate-800 shadow-xl overflow-hidden relative group">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
            <Megaphone size={14} className="animate-bounce" /> Live System Broadcast
          </h2>
          <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-lg">
            <Zap size={10} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Real-time WebSocket</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Type a message to push to all online players (e.g., 'Maintenance in 5 mins')..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
          />
          <button 
            onClick={handleBroadcast}
            disabled={isSending}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-900 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} /> 
                <span>Broadcast</span>
              </>
            )}
          </button>
        </div>
        
        <p className="mt-3 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
          Note: This message will appear instantly on the mobile app lobby for all active connections.
        </p>
      </div>
    </div>
  );
}