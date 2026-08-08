import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsSection = ({ history = [] }) => {
  const safeHistory = Array.isArray(history) ? history : [];

  if (safeHistory.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8 shadow-xl text-center">
        <h3 className="text-xl font-bold text-white mb-2">📊 Inspection Analytics</h3>
        <p className="text-slate-400 text-sm">No inspection history yet. Upload an image to analyze!</p>
      </div>
    );
  }

  const totalInspections = safeHistory.length;
  const highCount = safeHistory.filter(h => h?.severity?.toLowerCase() === 'high').length;
  const mediumCount = safeHistory.filter(h => h?.severity?.toLowerCase() === 'medium').length;
  const lowCount = safeHistory.filter(h => h?.severity?.toLowerCase() === 'low').length;

  const chartData = [
    { name: 'High Severity', count: highCount, color: '#ef4444' },
    { name: 'Medium Severity', count: mediumCount, color: '#f59e0b' },
    { name: 'Low Severity', count: lowCount, color: '#10b981' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        📊 Inspection Analytics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-semibold uppercase">Total Inspections</p>
          <p className="text-3xl font-extrabold text-white mt-1">{totalInspections}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-xs font-semibold uppercase">High Damage Cases</p>
          <p className="text-3xl font-extrabold text-red-400 mt-1">{highCount}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-400 text-xs font-semibold uppercase">Minor Damage Cases</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{lowCount + mediumCount}</p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsSection;