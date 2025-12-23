# 🇮🇳 Sahayata: Programmable Disaster Relief System

### The Problem
Traditional aid distribution suffers from "The Last Mile" leakage. Donors don't know if their $100 bought medicine or was siphoned off by middlemen.

### Our Solution
Sahayata (meaning "Help") is a stablecoin-based relief protocol that ensures **100% Transparency**.
- **Spending Controls:** Victims can only spend tokens at verified local vendors (Grocery/Medical).
- **Daily Caps:** Prevents account draining and ensures long-term survival.
- **Real-time Audit:** A public dashboard for donors to see exactly where every Rupee goes.

### Tech Stack
- **Smart Contracts:** Solidity (ERC-20 + Custom Logic)
- **Network:** Polygon Amoy Testnet
- **Frontend:** Next.js + Tailwind CSS + Ethers.js
- **UX:** Gasless-ready architecture logic.

### How to Run
1. `npm install`
2. `npx hardhat run scripts/deploy.js --network amoy`
3. `cd frontend && npm run dev`
