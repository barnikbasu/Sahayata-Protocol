import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Wallet,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from './components/Sidebar';
import { SummaryStats } from './components/SummaryStats';
import { TransactionList } from './components/TransactionList';
import { ParticipantRegistry } from './components/ParticipantRegistry';
import { ProtocolSimulator } from './components/ProtocolSimulator';

// Layout and routing handled in this main entry point
// State synced with mock node /server.ts

export default function App() {
  const [stats, setStats] = useState<any>(null);
  const [participants, setParticipants] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/stats');
      const partsRes = await fetch('/api/participants');
      if (statsRes.ok && partsRes.ok) {
        setStats(await statsRes.json());
        setParticipants(await partsRes.json());
      }
    } catch (e) {
      // Quiet fail to avoid UI noise in dev
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats || !participants) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-xl animate-pulse">
              <Heart size={28} />
           </div>
           <p className="font-bold text-slate-800 tracking-tight">Syncing Sahayata Network...</p>
        </div>
      </div>
    );
  }

  const categoryData = stats.recentTransactions.reduce((acc: any[], tx: any) => {
    const existing = acc.find((i: any) => i.name === tx.category);
    if (existing) existing.value += tx.amount;
    else acc.push({ name: tx.category, value: tx.amount });
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* App Header */}
      <header className="h-16 border-b border-slate-200 px-8 bg-white sticky top-0 z-50 flex items-center shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center shadow-lg text-white">
              <Heart size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-800">Sahayata<span className="text-emerald-600">Protocol</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Polygon Amoy Connected
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <button className="hover:text-emerald-600 hidden lg:block">Docs</button>
              <button className="hover:text-emerald-600 hidden lg:block">Audit</button>
              <Button size="sm" className="bg-slate-900 text-white rounded-lg hover:bg-slate-800 border-none transition-all">
                <Wallet size={16} className="mr-2" />
                NGO Portal
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Layout */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setIsSimulating={setIsSimulating} 
        />

        <div className="md:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SummaryStats stats={stats} categoryData={categoryData} />
                <TransactionList transactions={stats.recentTransactions} />
              </motion.div>
            )}

            {activeTab === 'participants' && (
              <motion.div 
                key="participants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <ParticipantRegistry 
                  beneficiaries={participants.beneficiaries} 
                  merchants={participants.merchants} 
                  type="beneficiaries" 
                />
              </motion.div>
            )}

            {activeTab === 'merchants' && (
              <motion.div 
                key="merchants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <ParticipantRegistry 
                  beneficiaries={participants.beneficiaries} 
                  merchants={participants.merchants} 
                  type="merchants" 
                />
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div 
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800">Decentralized Governance</h2>
                   <div className="flex gap-2">
                     <Button size="sm" variant="outline" className="gap-2 border-slate-200 bg-white" onClick={() => {
                        fetch('/api/tests').then(r => r.json()).then(data => {
                          // Standard browser report for proof of audit
                          console.log("Full Audit Trail Log:", data);
                        });
                     }}>
                       <ShieldCheck size={14} className="text-emerald-600" /> Protocol Audit
                     </Button>
                     <Button size="sm" variant="outline" className="gap-2 border-slate-200 bg-white">
                       <ArrowUpRight size={14} /> RPC Logs
                     </Button>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricBox label="Validation Layer" metrics={[{l: "Merkle Root", v: "0x8a2f...1e34"}, {l: "L2 Sync", v: "Healthy"}]} />
                  <MetricBox label="Smart Compliance" metrics={[{l: "Engine Logic", v: "v1.0.4-Active"}, {l: "Oracle", v: "Settled"}]} emerald />
                  <MetricBox label="Network Consensus" metrics={[{l: "Nodes", v: "12 Active"}, {l: "Bridge", v: "Active"}]} />
                </div>

                <Card className="border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Raw Ledger Output</h3>
                     <span className="text-[10px] font-mono text-slate-400">HASH: 0x82...c09</span>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                       {stats.recentTransactions.map((tx: any, i: number) => (
                         <div key={tx.id} className="flex gap-4 p-4 rounded-xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50/30 transition-all group">
                            <div className="flex flex-col items-center">
                               <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-emerald-900/10">
                                 #{stats.recentTransactions.length - i}
                               </div>
                               <div className="w-[1.5px] flex-1 bg-slate-100 mt-3 group-last:hidden" />
                            </div>
                            <div className="flex-1 space-y-2">
                               <div className="flex justify-between items-start">
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-800">{tx.from} <span className="text-slate-300 font-normal mx-1">&rarr;</span> {tx.to}</p>
                                    <p className="text-[9px] text-slate-400 font-mono tracking-tight leading-none uppercase">Settled: {tx.timestamp.substring(0, 10)}</p>
                                  </div>
                                  <p className="text-sm font-mono font-bold text-slate-900">₹ {tx.amount.toLocaleString()}</p>
                               </div>
                               <div className="flex justify-between items-center">
                                  <div className="flex gap-2">
                                     <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] h-4 uppercase font-bold tracking-widest px-1.5">Rule Pass</Badge>
                                     <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] h-4 uppercase font-bold tracking-widest px-1.5">Mined</Badge>
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-300">Tx: {tx.id.substring(0, 10)}...</span>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ProtocolSimulator 
        isOpen={isSimulating} 
        onClose={() => setIsSimulating(false)}
        beneficiaries={participants.beneficiaries}
        merchants={participants.merchants}
        onSuccess={fetchData}
        lastError={lastError}
        setLastError={setLastError}
      />

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-200 mt-12 flex flex-col sm:flex-row justify-between items-center gap-8">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
              <Heart size={16} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest underline decoration-emerald-200 decoration-2 underline-offset-4">Sahayata Protocol Node &middot; India Relief 2026</p>
         </div>
         <div className="flex gap-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <a href="#" className="hover:text-emerald-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Governance</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Grant Portal</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Status</a>
         </div>
      </footer>
    </div>
  );
}

const MetricBox = ({ label, metrics, emerald }: any) => (
  <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
       <CardTitle className={`text-[10px] font-bold uppercase tracking-widest ${emerald ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-4">
       {metrics.map((m: any, i: number) => (
          <div key={i}>
            <p className="text-[9px] uppercase font-bold text-slate-400 leading-none mb-1">{m.l}</p>
            <p className="text-xs font-bold font-mono">{m.v}</p>
          </div>
       ))}
    </CardContent>
  </Card>
);
