import React from 'react';
import { Users, Store } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ParticipantRegistryProps {
  beneficiaries: any[];
  merchants: any[];
  type: 'beneficiaries' | 'merchants';
}

export const ParticipantRegistry: React.FC<ParticipantRegistryProps> = ({ beneficiaries, merchants, type }) => {
  if (type === 'beneficiaries') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Beneficiary Registry</h2>
          <Button size="sm" className="bg-slate-900 font-bold px-4">Register New</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beneficiaries.map((b: any) => (
            <Card key={b.id} className="bg-white border-slate-200 rounded-xl shadow-sm group hover:border-emerald-200 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                       <Users size={18} />
                    </div>
                    <div>
                       <CardTitle className="text-base font-bold text-slate-800">{b.name}</CardTitle>
                       <CardDescription className="font-mono text-[9px] uppercase tracking-widest leading-none">ID: {b.id}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none text-[9px] uppercase font-bold tracking-widest">Verified</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Aid Balance</p>
                     <p className="text-lg font-bold font-mono text-emerald-600">₹ {b.balance}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Allocation</p>
                     <p className="text-sm font-bold text-slate-700">{b.aidType}</p>
                   </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                    <span>Daily Cap Usage</span>
                    <span className="text-slate-700">{b.spentToday} / {b.dailyLimit} INR</span>
                  </div>
                  <Progress value={(b.spentToday / b.dailyLimit) * 100} className="h-1.5 bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
       <h2 className="text-xl font-bold tracking-tight text-slate-800">Essential Merchants</h2>
       <Button size="sm" variant="outline" className="border-slate-200 bg-white font-bold px-4">Add Merchant</Button>
     </div>
     <Card className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
       <Table>
         <TableHeader className="bg-slate-50/50">
           <TableRow className="hover:bg-transparent border-slate-100">
             <TableHead className="px-6 text-[10px] uppercase font-bold text-slate-400">Merchant Name</TableHead>
             <TableHead className="text-[10px] uppercase font-bold text-slate-400">Category</TableHead>
             <TableHead className="text-[10px] uppercase font-bold text-slate-400">Wallet Link</TableHead>
             <TableHead className="text-[10px] uppercase font-bold text-slate-400">Status</TableHead>
             <TableHead className="text-right px-6 text-[10px] uppercase font-bold text-slate-400">Action</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {merchants.map((m: any) => (
             <TableRow key={m.id} className="border-slate-50 hover:bg-slate-50/50">
               <TableCell className="px-6 font-bold text-slate-800 text-sm">{m.name}</TableCell>
               <TableCell>
                 <Badge className="bg-slate-100 text-slate-700 border-none font-bold text-[9px] uppercase px-2">{m.category}</Badge>
               </TableCell>
               <TableCell className="font-mono text-[10px] text-slate-400">{m.address}</TableCell>
               <TableCell>
                 <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   Whitelist
                 </div>
               </TableCell>
               <TableCell className="text-right px-6">
                 <Button variant="ghost" size="sm" className="text-xs text-emerald-600 font-bold">Details</Button>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </Card>
    </div>
  );
};
