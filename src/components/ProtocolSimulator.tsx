import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export const ProtocolSimulator = ({ 
  isOpen, 
  onClose, 
  beneficiaries, 
  merchants, 
  onSuccess,
  lastError,
  setLastError
}: any) => {
  const [targetBeneficiary, setTargetBeneficiary] = useState(beneficiaries[0]?.id || '');
  const [targetMerchant, setTargetMerchant] = useState(merchants[0]?.id || '');
  const [amount, setAmount] = useState('100');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSpend = async () => {
    setIsPending(true);
    setLastError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaryId: targetBeneficiary,
          merchantId: targetMerchant,
          amount: parseFloat(amount)
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        setLastError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (e) {
      setLastError("Protocol Error: Connection to RPC node failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border-slate-200 rounded-2xl shadow-2xl p-0 overflow-hidden border-none outline-none">
        <div className="bg-slate-900 px-6 py-8 text-white relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
           <DialogHeader>
             <DialogTitle className="text-xl font-bold tracking-tight">Execute Protocol Transaction</DialogTitle>
             <DialogDescription className="text-slate-400 text-xs mt-1 leading-relaxed">
               This will trigger the <code className="text-emerald-400 text-[10px] font-mono">SahayataCoin.sol::spend()</code> method on-chain. Spending rules will be enforced by the Smart Contract.
             </DialogDescription>
           </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Beneficiary Wallet</label>
              <Select value={targetBeneficiary} onValueChange={setTargetBeneficiary}>
                <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 font-medium focus:ring-emerald-500/20 text-sm">
                  <SelectValue placeholder="Select Beneficiary" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  {beneficiaries.map((b: any) => (
                    <SelectItem key={b.id} value={b.id} className="text-xs font-bold py-3 hover:bg-emerald-50 cursor-pointer">
                      {b.name} <span className="text-slate-400 font-normal ml-2 font-mono">[{b.aidType}]</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Merchant</label>
              <Select value={targetMerchant} onValueChange={setTargetMerchant}>
                <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 font-medium focus:ring-emerald-500/20 text-sm">
                  <SelectValue placeholder="Select Merchant" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl shadow-xl">
                  {merchants.map((m: any) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs font-bold py-3 hover:bg-emerald-50 cursor-pointer">
                      {m.name} <span className="text-slate-400 font-normal ml-2 font-mono">({m.category})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transfer Amount (INR)</label>
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                 <Input 
                   type="number" 
                   value={amount} 
                   onChange={(e) => setAmount(e.target.value)}
                   className="bg-slate-50 border-slate-200 rounded-xl h-12 pl-8 font-mono font-bold focus:ring-emerald-500/20"
                 />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {lastError && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 rounded-xl py-3 border-none shadow-sm">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-xs font-bold uppercase tracking-wider mb-1">On-Chain Rule Rejection</AlertTitle>
                <AlertDescription className="text-xs font-medium">{lastError}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-emerald-50 border-emerald-100 text-emerald-900 rounded-xl py-3 border-none shadow-sm shadow-emerald-200/50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-xs font-bold uppercase tracking-wider mb-1">Consensus Reached</AlertTitle>
                <AlertDescription className="text-xs font-medium">Transaction confirmed on Polygon Amoy. Ledger updated.</AlertDescription>
              </Alert>
            )}
          </AnimatePresence>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-3">
             <Info size={16} className="text-slate-400 shrink-0" />
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Our protocol matches the beneficiary's aid category with the merchant's category. If they mismatch, or if the beneficiary exceeds their daily cap, the EVM will revert the transaction.
             </p>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 mt-0">
          <Button variant="ghost" onClick={onClose} className="rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</Button>
          <Button 
            onClick={handleSpend} 
            disabled={isPending || success}
            className={`min-w-[140px] rounded-lg text-xs font-bold py-5 h-auto transition-all ${
              success ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isPending ? "Mincing Block..." : success ? "Confirmed" : "Confirm Settlement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
