"use client";
import { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCcw, WifiOff, MousePointer2, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OnlineUser {
  user_id: string;
  username: string;
  email: string;
  connected_at: string;
}

export default function OnlineUsersTable() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchOnlineUsers = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token'); 
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!baseUrl) return;

      const cleanUrl = `${baseUrl.replace(/\/+$/, "")}/api/admin/online-players/list`;

      const res = await fetch(cleanUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store' 
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Support both {online_players: []} and direct array responses
        const rawPlayers = data.online_players || (Array.isArray(data) ? data : []);

        setUsers(rawPlayers);
        setLastUpdated(new Date());
        setHasFetched(true);
      } else {
        console.error("Server Error:", data.detail || "Unknown error");
      }
    } catch (error: any) {
      console.error("❌ Fetch Error:", error.message);
      if (!isAutoRefresh) toast.error("Failed to sync player list");
    } finally {
      if (!isAutoRefresh) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched) return;
    const interval = setInterval(() => fetchOnlineUsers(true), 30000);
    return () => clearInterval(interval);
  }, [hasFetched, fetchOnlineUsers]);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Users className="text-indigo-600" size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Lobby Monitor</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium pl-1 flex items-center gap-1">
            <Clock size={12} />
            {hasFetched ? `Last updated: ${lastUpdated?.toLocaleTimeString()}` : "Ready to monitor"}
          </p>
        </div>

        <button 
          onClick={() => fetchOnlineUsers(false)}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Syncing..." : "Refresh List"}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto min-h-[300px]">
        {!hasFetched && !isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
             <MousePointer2 className="text-indigo-200 mb-4 animate-bounce" size={40} />
             <p className="text-slate-400 font-bold">Click Refresh to Load Players</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-slate-300">
                    <WifiOff className="mx-auto mb-2 opacity-20" size={40} />
                    No players currently in lobby
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}