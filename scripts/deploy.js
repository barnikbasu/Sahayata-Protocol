const hre = require("hardhat");

async function main() {
  console.log("--- Starting Sahayata Deployment ---");

  // Deploying the Registry (The brain for whitelisting)
  const TrustFactory = await hre.ethers.getContractFactory("AidTrust");
  const trust = await TrustFactory.deploy();
  await trust.waitForDeployment();
  const trustAddress = await trust.getAddress();
  console.log(`1. AidTrust deployed at: ${trustAddress}`);

  // Deploying the Token (The programmable money)
  const CoinFactory = await hre.ethers.getContractFactory("SahayataCoin");
  const coin = await CoinFactory.deploy(trustAddress);
  await coin.waitForDeployment();
  const coinAddress = await coin.getAddress();
  console.log(`2. SahayataCoin deployed at: ${coinAddress}`);

  console.log("--- Deployment Finished Successfully ---");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
