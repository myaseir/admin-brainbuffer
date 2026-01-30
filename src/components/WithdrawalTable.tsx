"use client";
import { Wallet, CheckCircle2, XCircle } from 'lucide-react';

interface WithdrawalTableProps {
  data: any[];
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

export default function WithdrawalTable({ data, onAction }: WithdrawalTableProps) {
  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-8 text-white shadow-xl border border-slate-800">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
        <Wallet size={16} className="text-emerald-500" /> Pending Payouts
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-600 uppercase border-b border-slate-800">
              <th className="pb-4">User</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Account Details</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((w) => (
              <tr key={w._id} className="text-sm">
                <td className="py-4 font-bold">@{w.username}</td>
                <td className="py-4 font-black text-emerald-400">{w.amount} PKR</td>
                <td className="py-4 text-slate-400">
                  {w.method}: <span className="text-white font-mono">{w.account_number}</span>
                  <span className="block text-[10px] opacity-50">{w.account_name}</span>
                </td>
                <td className="py-4 text-right flex justify-end gap-2">
                  <button onClick={() => onAction(w._id, 'approve')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={16}/></button>
                  <button onClick={() => onAction(w._id, 'reject')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><XCircle size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <p className="text-center py-6 text-xs text-slate-600 font-bold uppercase tracking-widest italic">No pending withdrawals</p>}
      </div>
    </div>
  );
}