"use client";

import { useState, useEffect } from 'react';
import { Trophy, ChevronDown, RefreshCcw } from 'lucide-react';

export default function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initial Fetch
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async (isLoadMore = false) => {
    setLoading(true);
    const currentSkip = isLoadMore ? skip + 10 : 0;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const res = await fetch(
        `${baseUrl}/api/admin/referral-leaderboard?skip=${currentSkip}&limit=10`,
        {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.data && Array.isArray(result.data)) {
        if (isLoadMore) {
          setLeaderboard(prev => {
            // 1. Create a Set of existing IDs for lightning fast lookup
            const existingIds = new Set(prev.map(u => u._id));
            // 2. Filter new data to exclude any IDs already in state
            const uniqueNewData = result.data.filter(u => !existingIds.has(u._id));
            return [...prev, ...uniqueNewData];
          });
          setSkip(currentSkip);
        } else {
          // 3. For initial load, still ensure the data itself is unique
          const uniqueInitial = result.data.filter((user, index, self) =>
            index === self.findIndex((u) => u._id === user._id)
          );
          setLeaderboard(uniqueInitial);
          setSkip(0);
        }
        
        // If we got fewer than 10 items, there is no more data to load
        setHasMore(result.data.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
            <Trophy size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">Top Growth</p>
            <p className="text-lg md:text-xl font-black text-slate-900 truncate">
              {leaderboard.length > 0 ? leaderboard[0].username : '---'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">Referral Leaderboard</h2>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Ranked by Total PKR Earned</p>
          </div>
          <button 
            onClick={() => fetchLeaderboard(false)} 
            disabled={loading}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 self-end sm:self-auto"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Scrollable Table Wrapper to prevent mobile overlapping */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 md:px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rank</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Commander</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Referrals</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Total Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaderboard.map((user, index) => (
                <tr key={`leader-row-${user._id}-${index}`} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 uppercase text-sm truncate">{user.username}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5 text-center">
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black">
                      {user.referral_count}
                    </span>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5 text-right">
                    <p className="font-black text-slate-900 text-sm whitespace-nowrap">
                      {(user.total_earned || 0).toLocaleString()} <span className="text-green-500">PKR</span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && leaderboard.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">
              No data found
            </div>
          )}
        </div>

        {/* Load More Section */}
        {hasMore && leaderboard.length > 0 && (
          <div className="p-6 md:p-8 bg-slate-50/30 text-center border-t border-slate-50">
            <button 
              onClick={() => fetchLeaderboard(true)}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-green-400 hover:text-green-600 transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {loading ? <RefreshCcw size={14} className="animate-spin" /> : <ChevronDown size={16} />}
              Show Further More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}