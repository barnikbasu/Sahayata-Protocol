import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState({ food: 0, med: 0 });

    async function fetchAuditData() {
        const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
        const contract = new ethers.Contract("CONTRACT_ADDR", ABI, provider);
        const food = await contract.totalSpentByCategory(1);
        const med = await contract.totalSpentByCategory(2);
        setStats({ food: ethers.formatEther(food), med: ethers.formatEther(med) });
    }

    return (
        <div className="p-10 bg-gray-900 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6">ReliefFlow Audit Portal</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-green-800 rounded-lg">
                    <p>Total Food Aid Spent</p>
                    <h2 className="text-3xl">${stats.food}</h2>
                </div>
                <div className="p-6 bg-blue-800 rounded-lg">
                    <p>Total Medical Aid Spent</p>
                    <h2 className="text-3xl">${stats.med}</h2>
                </div>
            </div>
        </div>
    );
}
