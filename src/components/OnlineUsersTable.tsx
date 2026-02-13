"use client";
import { useState, useEffect } from 'react';
import { 
  Users, 
  RefreshCcw, 
  Wifi, 
  WifiOff,
  MousePointer2 
} from 'lucide-react';
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
  const [hasFetched, setHasFetched] = useState(false); // Track if we have clicked yet
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchOnlineUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!baseUrl) {
        toast.error("API URL Configuration Missing");
        return;
      }

      const cleanUrl = `${baseUrl.replace(/\/+$/, "")}/api/admin/online-players/list`;

      const res = await fetch(cleanUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store' 
      });
      
      if (res.ok) {
        const data = await res.json();
        const rawPlayers: OnlineUser[] = data.online_players || [];

        // Deduplicate
        const uniquePlayers = rawPlayers.reduce((acc: OnlineUser[], current) => {
          const x = acc.find(item => item.user_id === current.user_id);
          if (!x) return acc.concat([current]);
          return new Date(current.connected_at) > new Date(x.connected_at) 
            ? acc.map(item => item.user_id === current.user_id ? current : item)
            : acc;
        }, []);

        setUsers(uniquePlayers);
        setLastUpdated(new Date());
        setHasFetched(true);
      }
    } catch (error: any) {
      console.error("❌ Fetch Error:", error.message);
      toast.error("Server connection failed");
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-xs text-slate-400 font-medium pl-1">
            Manual Sync Mode • {hasFetched ? "Click to refresh current sessions" : "Data will load on demand"}
          </p>
        </div>

        <button 
          onClick={fetchOnlineUsers}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Fetching..." : hasFetched ? "Sync Again" : "Check Online Players"}
        </button>
      </div>

      {/* TABLE / PLACEHOLDER */}
      <div className="overflow-x-auto min-h-[300px] flex flex-col">
        {!hasFetched ? (
          /* INITIAL STATE: NO PRESSURE ON DB */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
              <MousePointer2 className="text-indigo-400 animate-bounce" size={28} />
            </div>
            <h4 className="text-slate-700 font-bold mb-1">System on Standby</h4>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto">
              Click the button above to query the live Redis session state.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Player Identity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Start</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <WifiOff size={32} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-sm font-medium">No players found in lobby</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={`${user.user_id}-${user.connected_at}`} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                          {user.username?.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400" suppressHydrationWarning>
                      {isMounted && user.connected_at ? new Date(user.connected_at).toLocaleTimeString() : '--:--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase border border-green-100">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* FOOTER */}
      {hasFetched && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Count: {users.length}
          </span>
          <span className="text-[10px] font-bold text-slate-300" suppressHydrationWarning>
            Synced at: {isMounted && lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}
          </span>
        </div>
      )}
    </div>
  );
}