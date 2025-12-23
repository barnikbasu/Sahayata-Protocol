import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ShieldCheck, HeartPulse, ShoppingBasket, Activity } from 'lucide-react';

const COIN_ADDRESS = "0xYourDeployedCoinAddress"; 

const SAHAYATA_ABI = [
    "function totalFoodDistributed() public view returns (uint256)",
    "function totalMedsDistributed() public view returns (uint256)",
    "function spentToday(address) public view returns (uint256)",
    "function DAILY_LIMIT() public view returns (uint256)",
    "function balanceOf(address) public view returns (uint256)"
];

export default function Home() {
    const [auditData, setAuditData] = useState({ food: '0', meds: '0' });
    const [account, setAccount] = useState("");
    const [userStats, setUserStats] = useState({ balance: '0', spent: '0' });

    // Connect logic
    const connect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
    };

    // THE AUDIT TRAIL LOGIC - Vital for points!
    const refreshAudit = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(COIN_ADDRESS, SAHAYATA_ABI, provider);
            const f = await contract.totalFoodDistributed();
            const m = await contract.totalMedsDistributed();
            setAuditData({ food: ethers.formatEther(f), meds: ethers.formatEther(m) });
            
            if(account) {
                const b = await contract.balanceOf(account);
                const s = await contract.spentToday(account);
                setUserStats({ balance: ethers.formatEther(b), spent: ethers.formatEther(s) });
            }
        } catch (err) { console.log("Contract not found on this network yet."); }
    };

    useEffect(() => { refreshAudit(); }, [account]);

    return (
        <div className="min-h-screen">
            {/* Nav */}
            <nav className="p-6 bg-white border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" />
                    <span className="font-bold text-xl tracking-tight">SAHAYATA PROTOCOL</span>
                </div>
                <button onClick={connect} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">
                    {account ? `${account.slice(0,6)}...` : "Connect Wallet"}
                </button>
            </nav>

            <main className="max-w-4xl mx-auto p-8">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900">Transparency Portal</h1>
                    <p className="text-slate-500">Real-time public audit of disaster relief distribution.</p>
                </div>

                {/* Audit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg"><ShoppingBasket className="text-orange-600"/></div>
                            <h3 className="font-bold text-slate-700">Food Aid</h3>
                        </div>
                        <p className="text-4xl font-bold">{auditData.food} <span className="text-sm text-slate-400">SAH</span></p>
                        <p className="text-xs text-slate-400 mt-2">Allocated to verified grocery vendors</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg"><HeartPulse className="text-red-600"/></div>
                            <h3 className="font-bold text-slate-700">Medical Aid</h3>
                        </div>
                        <p className="text-4xl font-bold">{auditData.meds} <span className="text-sm text-slate-400">SAH</span></p>
                        <p className="text-xs text-slate-400 mt-2">Allocated to verified pharmacies</p>
                    </div>
                </div>

                {/* Victim Status */}
                {account && (
                    <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
                        <div className="flex items-center gap-2 mb-6 text-blue-400">
                            <Activity size={20}/>
                            <span className="text-sm font-bold uppercase tracking-widest">Beneficiary Status</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-slate-400 text-sm">Your Balance</p>
                                <p className="text-5xl font-light">{userStats.balance} <span className="text-xl">SAH</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Spent Today</p>
                                <p className="text-xl font-bold text-blue-400">{userStats.spent} / 50 SAH</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
