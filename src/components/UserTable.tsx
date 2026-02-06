"use client";
import { useState, useEffect } from 'react';
import { Search, User, Wallet, Trophy, History, Edit3, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserData {
  _id: string;
  username: string;
  email: string;
  wallet_balance: number;
  total_wins: number;
  total_matches: number;
  referral_code: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // 👈 Added state for total pages

const fetchUsers = async () => {
  setLoading(true);
  const token = localStorage.getItem('token');
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?page=${page}&search=${searchTerm}`;
    console.log("Fetching URL:", url); // 👈 Debug Log 1

    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    
    console.log("Backend Response:", data); // 👈 Debug Log 2
    
    if (res.ok) {
      setUsers(data.users || []);
      setTotalPages(data.total_pages || 1); 
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    toast.error("Failed to fetch users");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
            <User size={16} /> User Management
          </h2>
          <p className="text-xs text-slate-500 font-bold">Audit and manage player profiles</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search username..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on new search
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="pb-4 pl-4">Player</th>
              <th className="pb-4">Wallet Balance</th>
              <th className="pb-4">Stats</th>
              <th className="pb-4 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse uppercase">Syncing Database...</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-5 pl-4">
                  <div className="font-black text-slate-800">@{user.username}</div>
                  <div className="text-[10px] text-slate-400 font-bold lowercase">{user.email}</div>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-2 text-emerald-600 font-black">
                    <Wallet size={14} />
                    PKR {(user.wallet_balance || 0).toLocaleString()}
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      <Trophy size={14} className="text-amber-500" /> {user.total_wins}
                    </div>
                    <div className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-black text-slate-400 uppercase">
                      Code: {user.referral_code}
                    </div>
                  </div>
                </td>
                <td className="py-5 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><History size={16} /></button>
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                    <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><ShieldAlert size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 🔄 UPDATED PAGINATION CONTROLS */}
      <div className="mt-8 flex justify-center items-center gap-6">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
          >
              <ChevronLeft size={14} /> Prev
          </button>
          
          <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Page {page} <span className="mx-2 text-slate-200">/</span> {totalPages}
          </span>
          
          <button 
            disabled={page >= totalPages} // 👈 Logic added here
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
          >
              Next <ChevronRight size={14} />
          </button>
      </div>
    </div>
  );
}