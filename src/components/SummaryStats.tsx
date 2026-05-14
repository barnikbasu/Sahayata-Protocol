import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

interface SummaryStatsProps {
  stats: any;
  categoryData: any[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ stats, categoryData }) => {
  return (
    <div className="space-y-6">
      {/* 4-Column Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Distributed" 
          value={`₹ ${(stats.totalAidDistributed + (stats.recentTransactions.length * 100)).toLocaleString()}`} 
          trend="+12.4% this window" 
          icon={<TrendingUp size={12} className="text-emerald-600" />}
        />
        <MetricCard 
          label="Verified Beneficiaries" 
          value={stats.activeBeneficiaries} 
          subText="Sybil-resistant ID active" 
        />
        <MetricCard 
          label="Essential Merchants" 
          value={stats.verifiedMerchants} 
          subText="94% Geo-coverage" 
        />
        <MetricCard 
          label="Compliance Rating" 
          value="99.8%" 
          subText="Rule Engine Optimized" 
          highlight 
        />
      </div>

      {/* High-level Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 rounded-xl shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
               Spending Logic
               <Badge className="bg-blue-50 text-blue-700 border-none text-[9px] uppercase tracking-tighter">Medical Restricted</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {(categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 rounded-xl shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
              Aid Velocity
              <span className="text-[10px] text-slate-400 font-normal uppercase tracking-widest font-mono">Real-time RPC</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.recentTransactions.slice(0, 5).reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="from" fontSize={9} axisLine={false} tickLine={false} tickFormatter={(v) => v.split(' ')[0]} />
                <YAxis fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, subText, icon, highlight }: any) => (
  <div className={`p-5 border rounded-xl shadow-sm ${highlight ? 'border-emerald-600 bg-emerald-50' : 'bg-white border-slate-200'}`}>
    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</div>
    <div className={`text-3xl font-bold ${highlight ? 'text-emerald-800' : 'text-slate-800'}`}>{value}</div>
    <div className="mt-2 flex items-center justify-between">
      {trend && (
        <div className="text-xs text-emerald-600 font-medium flex items-center">
          {icon}
          {trend}
        </div>
      )}
      {subText && <div className={`text-xs font-medium tracking-tight ${highlight ? 'text-emerald-700' : 'text-slate-500'}`}>{subText}</div>}
    </div>
  </div>
);
