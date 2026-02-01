"use client";
import { Wallet, CheckCircle2, XCircle, Clock, ArrowUpRight } from 'lucide-react';

interface WithdrawalTableProps {
  data: any[];
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

export default function WithdrawalTable({ data, onAction }: WithdrawalTableProps) {
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 mb-8 text-white shadow-xl border border-slate-800">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
        <Wallet size={16} className="text-emerald-500" /> Pending Payouts
      </h2>

      {/* --- Desktop Table View --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-600 uppercase border-b border-slate-800">
              <th className="pb-4 pl-4">User</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Account Details</th>
              <th className="pb-4 text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((w) => (
              <tr key={w._id} className="text-sm hover:bg-slate-800/50 transition-colors">
                <td className="py-4 pl-4 font-bold">
                    @{w.username || 'Unknown'}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-medium">
                        <Clock size={10} /> {formatDate(w.created_at)}
                    </div>
                </td>
                <td className="py-4 font-black text-emerald-400">
                    {Number(w.amount).toLocaleString()} PKR
                </td>
                <td className="py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{w.method}</span>
                  <span className="text-white font-mono text-base font-bold tracking-wide">{w.account_number}</span>
                  <span className="block text-[11px] text-slate-500 font-bold uppercase mt-1">{w.account_name}</span>
                </td>
                <td className="py-4 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <ActionButtons onAction={onAction} id={w._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Card View --- */}
      <div className="md:hidden space-y-4">
        {data.map((w) => (
          <div key={w._id} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-emerald-400 font-black text-lg">
                  {Number(w.amount).toLocaleString()} <span className="text-[10px]">PKR</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                  <Clock size={10} /> {formatDate(w.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-300">@{w.username}</div>
                <div className="text-[9px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-400 mt-1 inline-block uppercase">
                  {w.method}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-3 mb-5 border border-slate-700/50">
              <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Destination Account</div>
              <div className="text-white font-mono font-bold tracking-wider mb-1">{w.account_number}</div>
              <div className="text-[11px] text-emerald-500/80 font-bold uppercase">{w.account_name}</div>
            </div>

            <div className="flex gap-3">
              <ActionButtons onAction={onAction} id={w._id} fullWidth />
            </div>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
          <div className="text-center py-10">
              <p className="text-xs text-slate-600 font-black uppercase tracking-widest italic">
                  No pending withdrawals
              </p>
          </div>
      )}
    </div>
  );
}

function ActionButtons({ onAction, id, fullWidth = false }: { 
    onAction: (id: string, a: 'approve' | 'reject') => void, 
    id: string,
    fullWidth?: boolean 
  }) {
    const btnClass = fullWidth ? "flex-1 justify-center py-3" : "p-2";
    
    return (
      <>
        <button 
          onClick={() => onAction(id, 'approve')} 
          className={`flex items-center gap-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 ${btnClass}`}
          title="Mark Paid"
        >
          <CheckCircle2 size={18} />
          {fullWidth && <span className="text-xs font-bold uppercase">Approve</span>}
        </button>
        <button 
          onClick={() => onAction(id, 'reject')} 
          className={`flex items-center gap-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 ${btnClass}`}
          title="Reject & Refund"
        >
          <XCircle size={18} />
          {fullWidth && <span className="text-xs font-bold uppercase">Reject</span>}
        </button>
      </>
    );
}