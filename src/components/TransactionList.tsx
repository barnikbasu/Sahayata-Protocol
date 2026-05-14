import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  category: string;
  timestamp: string;
  status: string;
}

export const TransactionList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  return (
    <Card className="bg-white border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <CardTitle className="text-base font-bold text-slate-800">Immutable Audit Trail</CardTitle>
          <p className="text-[11px] text-slate-500">Real-time transaction stream from Polygon Smart Contracts</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search Tx..." className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hidden sm:block" />
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 shadow-none">Export CSV</Button>
        </div>
      </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400">Timestamp</TableHead>
              <TableHead className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400">Beneficiary</TableHead>
              <TableHead className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400">Merchant</TableHead>
              <TableHead className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400">Amount</TableHead>
              <TableHead className="px-6 py-3 text-right text-[10px] uppercase font-bold text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-slate-50 hover:bg-slate-50/80 transition-colors">
                <TableCell className="px-6 py-4 text-[10px] text-slate-400 font-mono">
                   {tx.timestamp.substring(11, 16)} UTC
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-slate-700 text-sm">{tx.from}</TableCell>
                <TableCell className="px-6 py-4">
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${tx.category === 'Medical' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {tx.category[0]}
                      </span>
                      {tx.to}
                   </div>
                </TableCell>
                <TableCell className="px-6 py-4 font-bold text-slate-800 text-sm">
                  ₹ {tx.amount.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase tracking-tighter">
                    Compliant
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
