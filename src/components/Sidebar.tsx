import React from 'react';
import { LayoutDashboard, Users, Store, History, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsSimulating: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, setIsSimulating }) => {
  return (
    <aside className="md:col-span-3 space-y-4">
      <Card className="bg-white border-slate-200 rounded-xl shadow-sm">
        <CardContent className="p-2 space-y-1">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavButton active={activeTab === 'participants'} onClick={() => setActiveTab('participants')} icon={<Users size={18} />} label="Registry" />
          <NavButton active={activeTab === 'merchants'} onClick={() => setActiveTab('merchants')} icon={<Store size={18} />} label="Merchants" />
          <NavButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<History size={18} />} label="Audit Trail" />
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900 text-white rounded-xl shadow-lg border-none overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
         <CardHeader className="pb-3 relative">
           <CardTitle className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Protocol Simulation</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4 relative">
           <p className="text-xs text-slate-400 leading-relaxed italic">Test smart contract spending rules and daily limits in real-time.</p>
           <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none text-xs font-bold py-5 rounded-lg shadow-emerald-900/40 shadow-sm" onClick={() => setIsSimulating(true)}>
             <Plus size={14} className="mr-2" /> Execute New Tx
           </Button>
         </CardContent>
      </Card>
    </aside>
  );
};

const NavButton = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
    }`}
  >
    <span className={active ? 'text-emerald-400' : ''}>{icon}</span>
    {label}
  </button>
);
