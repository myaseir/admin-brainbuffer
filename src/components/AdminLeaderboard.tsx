import { Trophy, TrendingUp, Wallet } from 'lucide-react';

interface Player {
  username: string;
  total_wins: number;
  wallet_balance: number;
}

interface LeaderboardData {
  top_players: Player[];
  global_stats: {
    total_pool: number;
    currency: string;
  };
}

export default function AdminLeaderboard({ data }: { data: LeaderboardData | null }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
      
      {/* HEADER section with Total Pool */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-100 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                    <Trophy size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">
                    Top Players
                </h2>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">
                Highest performing users
            </p>
        </div>

        <div className="mt-4 md:mt-0 text-right">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                Total Economy Pool
            </p>
            <div className="flex items-center justify-end gap-2 text-emerald-600">
                <Wallet size={20} />
                <span className="text-2xl font-black">
                    {data.global_stats.currency} {data.global_stats.total_pool.toLocaleString()}
                </span>
            </div>
        </div>
      </div>

      {/* TABLE section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-4 pl-4">Rank</th>
              <th className="pb-4">User</th>
              <th className="pb-4">Total Wins</th>
              <th className="pb-4 text-right pr-4">Wallet Balance</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700">
            {data.top_players.map((player, index) => (
              <tr key={index} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                <td className="py-4 pl-4">
                    <span className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-xs
                        ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                          index === 1 ? 'bg-slate-200 text-slate-600' : 
                          index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}
                    `}>
                        #{index + 1}
                    </span>
                </td>
                <td className="py-4">
                    <span className="group-hover:text-emerald-600 transition-colors">
                        {player.username || 'Unknown'}
                    </span>
                </td>
                <td className="py-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-slate-300" />
                        {player.total_wins || 0}
                    </div>
                </td>
                <td className="py-4 text-right pr-4 font-black text-slate-900">
                  {/* 🛑 FIXED: Added safety check (|| 0) to prevent crash on undefined balance */}
                  {data.global_stats.currency} {(player.wallet_balance || 0).toLocaleString()}
                </td>
              </tr>
            ))}
            
            {data.top_players.length === 0 && (
                <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs uppercase">
                        No players found
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}