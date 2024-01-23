import { expect } from "chai";
import { ethers } from "hardhat";
import { Airdrop } from "../typechain-types";
import { HusKyToken } from "../typechain-types";
import { Signer } from "ethers";

describe("Airdrop contract", function () {
  let airdrop: Airdrop;
  let owner;
  let recipient1: Signer;
  let recipient2: Signer;
  let huskyToken: HusKyToken;

  before(async function () {
    const HuskyToken = await ethers.getContractFactory("HusKyToken");
    [owner] = await ethers.getSigners();

    huskyToken = await HuskyToken.deploy(owner.address);

    const Airdrop = await ethers.getContractFactory("Airdrop");
    [owner, recipient1, recipient2] = await ethers.getSigners();
    console.log(recipient1);
    airdrop = await Airdrop.deploy(huskyToken.target, owner.address);
    console.log("Smart contract successfully deployed");
  });

  it("Should drop tokens to recipients", async function () {
    const recipientAddresses = [
      await recipient1.getAddress(),
      await recipient2.getAddress(),
    ];
    const amounts = [100, 200];

    await huskyToken.approve(airdrop.target, 500);

    await airdrop.dropTokens(recipientAddresses, amounts);

    const balanceRecipient1 = await huskyToken.balanceOf(recipientAddresses[0]);
    const balanceRecipient2 = await huskyToken.balanceOf(recipientAddresses[1]);

    expect(balanceRecipient1).to.equal(100);
    expect(balanceRecipient2).to.equal(200);
  });

  it("Should drop ether to recipients", async function () {
    const recipientAddresses = [
      await recipient1.getAddress(),
      await recipient2.getAddress(),
    ];
    const amounts = [1, 2];

    await airdrop.dropEther(recipientAddresses, amounts, { value: 3 });

    const balanceRecipient1 = await ethers.provider.getBalance(
      recipientAddresses[0]
    );
    const balanceRecipient2 = await ethers.provider.getBalance(
      recipientAddresses[1]
    );

    expect(balanceRecipient1).to.equal(1);
    expect(balanceRecipient2).to.equal(2);
  });
});
