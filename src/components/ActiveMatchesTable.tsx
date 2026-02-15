"use client";
import { 
  Gamepad2, 
  Swords, 
  Clock, 
  Activity 
} from 'lucide-react';

// 1. Define the structure of a Match object
interface Match {
  id: string;
  p1_name: string;
  p2_name: string;
  stake: number;
}

// 2. Apply the interface to the props
interface ActiveMatchesTableProps {
  matches: Match[];
}

export default function ActiveMatchesTable({ matches = [] }: ActiveMatchesTableProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-xl">
            <Activity className="text-rose-600" size={20} />
          </div>
          <h3 className="text-lg font-black text-slate-800">Live Match Monitor</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Match ID</th>
              <th className="px-6 py-4 text-center">Contenders</th>
              <th className="px-6 py-4">Stake (PKR)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {matches.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                  <Activity size={32} className="mx-auto mb-3 opacity-20" />
                  No active matches at the moment.
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                    {match.id ? match.id.slice(-8) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-sm font-bold text-slate-700">{match.p1_name}</span>
                      <Swords size={14} className="text-rose-400 animate-pulse" />
                      <span className="text-sm font-bold text-slate-700">{match.p2_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-emerald-600">
                      PKR {match.stake?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase border border-amber-100">
                      In-Game
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}