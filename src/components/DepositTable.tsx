"use client";
import { Search, Copy, CheckCircle2, XCircle } from 'lucide-react';

interface DepositTableProps {
  data: any[];
  onAction: (trxId: string, action: 'approve' | 'reject') => void;
}

export default function DepositTable({ data, onAction }: DepositTableProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 mb-10 border border-slate-100 shadow-sm overflow-hidden">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
        <Search size={16} /> Deposit Queue (Verification)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
              <th className="pb-4">Sender</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">TRX ID</th>
              <th className="pb-4 text-right">Verify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((d) => (
              <tr key={d.trx_id} className="text-sm">
                <td className="py-4 font-bold text-slate-700">@{d.username} <span className="block text-[10px] text-slate-400 uppercase font-black">{d.full_name}</span></td>
                <td className="py-4 font-black text-emerald-600">{d.amount} PKR</td>
                <td className="py-4">
                  <button onClick={() => navigator.clipboard.writeText(d.trx_id)} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold hover:bg-emerald-50 transition-all">
                    {d.trx_id} <Copy size={12} className="text-slate-400" />
                  </button>
                </td>
                <td className="py-4 text-right flex justify-end gap-2">
                  <button onClick={() => onAction(d.trx_id, 'approve')} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={18} /></button>
                  <button onClick={() => onAction(d.trx_id, 'reject')} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <p className="text-center py-6 text-xs text-slate-300 font-black uppercase italic tracking-widest">No deposits to verify</p>}
      </div>
    </div>
  );
}