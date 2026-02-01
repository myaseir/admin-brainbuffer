"use client";
import { Wallet, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface WithdrawalTableProps {
  data: any[];
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

export default function WithdrawalTable({ data, onAction }: WithdrawalTableProps) {
  
  // Helper to format date
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-8 text-white shadow-xl border border-slate-800">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
        <Wallet size={16} className="text-emerald-500" /> Pending Payouts
      </h2>
      <div className="overflow-x-auto">
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
                
                {/* 1. User Info with Date */}
                <td className="py-4 pl-4 font-bold">
                    @{w.username || 'Unknown'}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-medium">
                        <Clock size={10} /> {formatDate(w.created_at)}
                    </div>
                </td>
                
                {/* 2. Formatted Amount */}
                <td className="py-4 font-black text-emerald-400">
                    {Number(w.amount).toLocaleString()} PKR
                </td>
                
                {/* 3. Account Details */}
                <td className="py-4 text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{w.method}</span>
                  <span className="text-white font-mono text-base font-bold tracking-wide">{w.account_number}</span>
                  <span className="block text-[11px] text-slate-500 font-bold uppercase mt-1">{w.account_name}</span>
                </td>
                
                {/* 4. Actions */}
                <td className="py-4 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => onAction(w._id, 'approve')} 
                        className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                        title="Mark Paid"
                    >
                        <CheckCircle2 size={18}/>
                    </button>
                    <button 
                        onClick={() => onAction(w._id, 'reject')} 
                        className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        title="Reject & Refund"
                    >
                        <XCircle size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
            <div className="text-center py-10">
                <p className="text-xs text-slate-600 font-black uppercase tracking-widest italic">
                    No pending withdrawals
                </p>
            </div>
        )}
      </div>
    </div>
  );
}