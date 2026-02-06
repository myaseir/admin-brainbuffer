"use client";
import { X, ShieldAlert, Swords, Clock, Trophy, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AuditModalProps {
  matchId: string;
  onClose: () => void;
}

export default function AuditModal({ matchId, onClose }: AuditModalProps) {
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchAudit = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/match/${matchId}/audit`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setMatchData(data);
      } catch (error) {
        console.error("Audit Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) fetchMatchAudit();
  }, [matchId]);

  if (!matchId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <Swords size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Match Auditor</h3>
              <p className="text-[10px] text-slate-400 font-bold font-mono">{matchId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving Match Logs...</p>
            </div>
          ) : matchData ? (
            <div className="space-y-8">
              
              {/* Score Comparison Bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Player 1</p>
                    <p className="text-lg font-black text-slate-800">@{matchData.p1_name || 'User'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Player 2</p>
                    <p className="text-lg font-black text-slate-800">@{matchData.p2_name || 'Opponent'}</p>
                  </div>
                </div>

                <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${(matchData.p1_score / (matchData.p1_score + matchData.p2_score || 1)) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex justify-between items-center px-4 font-black text-[10px] text-white pointer-events-none">
                    <span>{matchData.p1_score} PTS</span>
                    <span className="text-slate-800">{matchData.p2_score} PTS</span>
                  </div>
                </div>
              </div>

              {/* Match Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailCard icon={<Clock size={14}/>} label="Duration" value={matchData.duration || "N/A"} />
                <DetailCard 
                    icon={<ShieldAlert size={14}/>} 
                    label="Status" 
                    value={matchData.status} 
                    highlight={matchData.status === 'OPPONENT_FLED'} 
                />
                <DetailCard icon={<Trophy size={14}/>} label="Stake" value={`${matchData.stake} PKR`} />
                <DetailCard icon={<AlertTriangle size={14}/>} label="Winner ID" value={matchData.winner_id?.substring(0,8) || "Draw"} />
              </div>

              {/* 👇 UPDATED VERDICT SECTION 👇 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">System Verdict</h4>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  The match concluded with a {matchData.status === 'NORMAL' ? 'standard finish' : 'disconnection'}. 
                  System Profit: <span className="text-emerald-600 font-bold">10 PKR</span> 
                </p>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 uppercase text-xs font-black">Match record not found in database.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, highlight = false }: any) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
      </div>
      <p className={`text-sm font-black ${highlight ? 'text-red-600' : 'text-slate-800'} uppercase tracking-tight`}>
        {value}
      </p>
    </div>
  );
}