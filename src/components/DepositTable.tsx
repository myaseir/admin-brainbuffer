"use client";
import { Search, Copy, CheckCircle2, XCircle, Phone, Clock } from 'lucide-react';

interface Deposit {
  _id: string;
  trx_id: string;
  username: string;
  full_name: string;
  sender_number: string; // 👈 Critical for matching SMS
  amount: number;
  created_at: string;
}

interface DepositTableProps {
  data: Deposit[];
  onAction: (trxId: string, action: 'approve' | 'reject') => void;
}

export default function DepositTable({ data, onAction }: DepositTableProps) {
  
  // Helper to format date
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 mb-10 border border-slate-100 shadow-sm overflow-hidden">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
        <Search size={16} /> Deposit Queue (Verification)
      </h2>
      <div className="overflow-x-auto">
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
                
                {/* 1. User Info */}
                <td className="py-4 pl-4 font-bold text-slate-700">
                  @{d.username}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <Clock size={10} /> {formatDate(d.created_at)}
                  </div>
                </td>

                {/* 2. Sender Info (Critical for Verification) */}
                <td className="py-4">
                  <div className="text-xs font-black text-slate-800 uppercase">{d.full_name}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                    <Phone size={10} /> {d.sender_number}
                  </div>
                </td>

                {/* 3. Amount */}
                <td className="py-4 font-black text-emerald-600">
                  {d.amount.toLocaleString()} PKR
                </td>

                {/* 4. TRX ID with Copy */}
                <td className="py-4">
                  <button 
                    onClick={() => navigator.clipboard.writeText(d.trx_id)} 
                    className="group flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold hover:bg-slate-200 transition-all active:scale-95"
                    title="Click to copy"
                  >
                    {d.trx_id} 
                    <Copy size={10} className="text-slate-400 group-hover:text-slate-600" />
                  </button>
                </td>

                {/* 5. Actions */}
                <td className="py-4 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onAction(d.trx_id, 'approve')} 
                      className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Approve"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button 
                      onClick={() => onAction(d.trx_id, 'reject')} 
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-slate-300 font-black uppercase italic tracking-widest">
              No pending deposits
            </p>
          </div>
        )}
      </div>
    </div>
  );
}