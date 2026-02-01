"use client";
import { Search, Copy, CheckCircle2, XCircle, Phone, Clock, User, CreditCard } from 'lucide-react';

interface Deposit {
  _id: string;
  trx_id: string;
  username: string;
  full_name: string;
  sender_number: string;
  amount: number;
  created_at: string;
}

interface DepositTableProps {
  data: Deposit[];
  onAction: (trxId: string, action: 'approve' | 'reject') => void;
}

export default function DepositTable({ data, onAction }: DepositTableProps) {
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    // Optional: Add a toast notification here
  };

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 mb-10 border border-slate-100 shadow-sm overflow-hidden">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
        <Search size={16} /> Deposit Queue (Verification)
      </h2>

      {/* --- Desktop View (Table) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
              <th className="pb-4 pl-4">User Details</th>
              <th className="pb-4">Sender Info</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">TRX ID</th>
              <th className="pb-4 text-right pr-4">Verify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((d) => (
              <tr key={d.trx_id} className="text-sm hover:bg-slate-50 transition-colors">
                <td className="py-4 pl-4 font-bold text-slate-700">
                  @{d.username}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <Clock size={10} /> {formatDate(d.created_at)}
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-xs font-black text-slate-800 uppercase">{d.full_name}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                    <Phone size={10} /> {d.sender_number}
                  </div>
                </td>
                <td className="py-4 font-black text-emerald-600">
                  {d.amount.toLocaleString()} PKR
                </td>
                <td className="py-4">
                  <button 
                    onClick={() => copyToClipboard(d.trx_id)} 
                    className="group flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold hover:bg-slate-200 transition-all active:scale-95"
                  >
                    {d.trx_id} 
                    <Copy size={10} className="text-slate-400 group-hover:text-slate-600" />
                  </button>
                </td>
                <td className="py-4 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <ActionButtons onAction={onAction} trxId={d.trx_id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile View (Card List) --- */}
      <div className="md:hidden space-y-4">
        {data.map((d) => (
          <div key={d.trx_id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm font-bold text-slate-700">@{d.username}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={10} /> {formatDate(d.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-600">{d.amount.toLocaleString()} PKR</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-black text-slate-400">Sender</div>
                <div className="text-[11px] font-bold text-slate-800 truncate">{d.full_name}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Phone size={10} /> {d.sender_number}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-black text-slate-400">TRX ID</div>
                <button 
                  onClick={() => copyToClipboard(d.trx_id)}
                  className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-mono font-bold active:bg-slate-100"
                >
                  {d.trx_id.substring(0, 8)}... <Copy size={8} />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <ActionButtons onAction={onAction} trxId={d.trx_id} fullWidth />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xs text-slate-300 font-black uppercase italic tracking-widest">
            No pending deposits
          </p>
        </div>
      )}
    </div>
  );
}

// Sub-component for buttons to keep code DRY
function ActionButtons({ onAction, trxId, fullWidth = false }: { 
  onAction: (id: string, a: 'approve' | 'reject') => void, 
  trxId: string,
  fullWidth?: boolean 
}) {
  const btnClass = fullWidth ? "flex-1 justify-center py-3" : "p-2";
  
  return (
    <>
      <button 
        onClick={() => onAction(trxId, 'approve')} 
        className={`flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95 ${btnClass}`}
      >
        <CheckCircle2 size={18} />
        {fullWidth && <span className="text-xs font-bold uppercase">Approve</span>}
      </button>
      <button 
        onClick={() => onAction(trxId, 'reject')} 
        className={`flex items-center gap-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 ${btnClass}`}
      >
        <XCircle size={18} />
        {fullWidth && <span className="text-xs font-bold uppercase">Reject</span>}
      </button>
    </>
  );
}