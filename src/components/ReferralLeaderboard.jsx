"use client";

import { useState, useEffect } from 'react';
import { Users, Trophy, DollarSign, ChevronDown, RefreshCcw, Search } from 'lucide-react';

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
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/referral-leaderboard?skip=${currentSkip}&limit=10`);
      const result = await res.json();
      
      if (result.data && result.data.length > 0) {
        if (isLoadMore) {
          setLeaderboard(prev => [...prev, ...result.data]);
          setSkip(currentSkip);
        } else {
          setLeaderboard(result.data);
          setSkip(0);
        }
        // If we got less than 10, there's no more data to load
        if (result.data.length < 10) setHasMore(false);
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
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Top Growth</p>
            <p className="text-xl font-black text-slate-900">{leaderboard[0]?.username || '---'}</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Referral Leaderboard</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ranked by Total PKR Earned</p>
          </div>
          <button onClick={() => fetchLeaderboard(false)} className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rank</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Commander</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Referrals</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Total Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaderboard.map((user, index) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div>
                      <p className="font-black text-slate-900 uppercase text-sm">{user.username}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-black">
                      {user.referral_count}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="font-black text-slate-900 text-sm">{user.total_earned.toLocaleString()} <span className="text-green-500">PKR</span></p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Section */}
        {hasMore && (
          <div className="p-8 bg-slate-50/30 text-center border-t border-slate-50">
            <button 
              onClick={() => fetchLeaderboard(true)}
              disabled={loading}
              className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-green-400 hover:text-green-600 transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center gap-2 mx-auto"
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