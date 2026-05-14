const hre = require("hardhat");

async function main() {
  console.log("Starting Sahayata Protocol Deployment...");

  const AidTrust = await hre.ethers.getContractFactory("AidTrust");
  const aidTrust = await AidTrust.deploy();
  await aidTrust.waitForDeployment();
  console.log(`AidTrust deployed to: ${await aidTrust.getAddress()}`);

  const SahayataCoin = await hre.ethers.getContractFactory("SahayataCoin");
  const sahayataCoin = await SahayataCoin.deploy(await aidTrust.getAddress());
  await sahayataCoin.waitForDeployment();
  console.log(`SahayataCoin deployed to: ${await sahayataCoin.getAddress()}`);

  console.log("Deployment complete. Syncing with dashboard...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
