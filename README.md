# 🛡️ Sahayata Protocol: Programmable Disaster Relief

**Track:** Social Impact / DeFi & RWA  
**Project Status:** Functional Prototype (Polygon Amoy Testnet)

## 📌 Description: The Sahayata Protocol
Sahayata is a decentralized, programmable stablecoin system designed to eliminate "Last Mile" leakage in disaster relief. Unlike traditional cash transfers that are slow and opaque, Sahayata utilizes smart contract-enforced spending controls to ensure aid reaches verified beneficiaries and is spent exclusively at authorized essential-goods vendors (e.g., pharmacies and grocery stores). By programming the money itself, we move disaster relief from a "leap of faith" to a "cryptographic certainty."

## ⚠️ The Problem Statement
Traditional relief systems lose up to 30% of funds to administrative friction or corruption. Donors often have no way to verify if their contributions were spent on essentials. Our solution replaces cash with programmable stablecoins featuring on-chain whitelisting and category-based limits, ensuring 100% utility and providing a tamper-proof audit trail.

## 🚀 Key Features
* **Beneficiary Whitelisting:** Identity management via `AidTrust.sol` to ensure only verified victims receive aid.
* **Category-Based Spending:** Smart contracts restrict transfers so that "Food Aid" cannot be diverted to non-essential items.
* **Daily Spending Caps:** On-chain logic to prevent fund-draining and ensure sustainable liquidity during a crisis.
* **Public Audit Trail:** A live transparency dashboard fetching on-chain metrics to show real-time impact to donors.

## 🏗️ Technical Architecture
1. **Onboarding:** NGOs verify victims and merchants on `AidTrust.sol`.
2. **Distribution:** Stablecoins are minted to victims' wallets.
3. **Execution:** `SahayataCoin.sol` intercepts transactions to verify the merchant category and check daily limits.
4. **Transparency:** Frontend provides real-time data on distribution velocity and category-wise spending.

## ⚙️ Local Setup & Execution
1. Install dependencies: `npm install`
2. Run local node: `npx hardhat node`
3. Deploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
4. Start frontend: `npm run dev`
