"use client";
import { useMemo } from 'react'; // 👈 Added for data processing
import { Clock, BarChart3 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';

export default function ActivityChart({ data }: { data: any[] }) {
  
  // 🔄 PROCESS DATA: Fill missing hours (0-23) so the chart shows a full day
  const processedData = useMemo(() => {
    if (!data) return [];

    // 1. Create a map of existing data for fast lookup
    // Backend sends "hour": "14" (string), so we parse it to int
    const dataMap = new Map();
    data.forEach(item => {
      const hourInt = parseInt(item.hour, 10);
      dataMap.set(hourInt, item.matches);
    });

    // 2. Generate a full 24-hour array (0 to 23)
    const fullDayData = [];
    for (let i = 0; i < 24; i++) {
      fullDayData.push({
        hour: i, // Keep as number for sorting/formatting
        matches: dataMap.get(i) || 0 // Default to 0 if no matches found
      });
    }
    return fullDayData;
  }, [data]);

  // 🛡️ Safety Check: Only show empty state if data prop was truly null/undefined
  if (!data) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10 h-[400px] flex flex-col items-center justify-center text-slate-300">
        <BarChart3 size={48} className="mb-4 opacity-50" />
        <p className="text-xs font-black uppercase tracking-widest">Loading Activity...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
        <Clock size={16} /> Peak Activity (UTC Hourly)
      </h2>
      
      {/* Chart Container */}
      <div className="h-[300px] w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="hour" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} 
              // Format 0 -> 00:00, 14 -> 14:00
              tickFormatter={(val) => `${val.toString().padStart(2, '0')}:00`} 
              interval={3} // Show label every 3 hours to avoid clutter
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#94a3b8'}} 
              allowDecimals={false} // Only show whole numbers for matches
            />
            
            <Tooltip 
              cursor={{fill: '#f8fafc'}} 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
              // Custom formatter for Tooltip label
              labelFormatter={(val) => `${val.toString().padStart(2, '0')}:00 UTC`}
            />
            
            <Bar 
              dataKey="matches" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
              activeBar={{ fill: '#059669' }} // Darker green on hover
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}