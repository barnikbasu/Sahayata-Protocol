const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sahayata System Logic", function () {
  let trust, coin, admin, victim, randomPerson, shop;

  beforeEach(async function () {
    [admin, victim, randomPerson, shop] = await ethers.getSigners();

    const Trust = await ethers.getContractFactory("AidTrust");
    trust = await Trust.deploy();

    const Coin = await ethers.getContractFactory("SahayataCoin");
    coin = await Coin.deploy(await trust.getAddress());

    // Setup: Victim is registered, Shop is category 1 (Food)
    await trust.onboardVictims([victim.address]);
    await trust.addLocalVendor(shop.address, 1);
    await coin.distributeAid(victim.address, ethers.parseUnits("100", 18));
  });

  it("Should allow victim to spend at a verified shop", async function () {
    await expect(coin.connect(victim).transfer(shop.address, ethers.parseUnits("10", 18)))
      .to.emit(coin, "Transfer");
  });

  it("Should REJECT spending at a non-verified address", async function () {
    // This is the core 'Anti-Leakage' test
    await expect(
      coin.connect(victim).transfer(randomPerson.address, ethers.parseUnits("10", 18))
    ).to.be.revertedWith("BLOCK: Recipient is not a registered Relief Shop");
  });

  it("Should enforce the Daily Spending Limit", async function () {
    // Try to spend 60 tokens (Daily limit is 50 in our contract)
    await expect(
      coin.connect(victim).transfer(shop.address, ethers.parseUnits("60", 18))
    ).to.be.revertedWith("EXCEEDED: You hit your daily aid cap");
  });
});
