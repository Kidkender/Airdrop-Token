import { expect } from "chai";
import { ethers } from "hardhat";
import { Airdrop, Token } from "../typechain-types";
import { Signer } from "ethers";

describe("Airdrop contract", function () {
  let airdrop: Airdrop;
  let owner: Signer;
  let recipient1: string;
  let recipient2: string;
  let huskyToken: Token;

  before(async function () {
    const HuskyToken = await ethers.getContractFactory("Token");
    [owner] = await ethers.getSigners();
    recipient1 = "0x4B45E8B958aaeB509E1264c6e4Ac45F9C7f991A2";
    recipient2 = "0x7e8E1A59445bA9BC4103563858dD276bD0369944";

    huskyToken = await HuskyToken.deploy(owner.getAddress());

    await huskyToken.waitForDeployment();
    console.log(
      "Token smart contract successfully deployed: ",
      huskyToken.target
    );

    const Airdrop = await ethers.getContractFactory("Airdrop");

    airdrop = await Airdrop.deploy(huskyToken.target, owner.getAddress());
    await airdrop.waitForDeployment();
    console.log(
      "Aidrdrop Smart contract successfully deployed: ",
      airdrop.target
    );
    return { airdrop, huskyToken };
  });

  it("Should airdrop tokens to recipients", async function () {
    const recipientAddresses = [recipient1, recipient2];
    const amounts = [100, 200];

    const ownerBalance = await huskyToken.balanceOf(owner.getAddress());
    console.log("Owner balance: ", ownerBalance);

    const approvalResult = await huskyToken.transfer(airdrop.target, 500);
    await approvalResult.wait();

    const airdropBalance = await huskyToken.balanceOf(airdrop.target);
    console.log("Airdrop balance: " + airdropBalance.toString());

    const inititalRecipient1 = await huskyToken.balanceOf(
      recipientAddresses[0]
    );
    console.log("Balance berore airdrop: ", inititalRecipient1);
    const airdropTokenResult = await airdrop.airdropTokens(
      recipientAddresses,
      amounts
    );
    await airdropTokenResult.wait();
    console.log("Airdrop result: " + airdropTokenResult);
    const balanceRecipient1 = await huskyToken.balanceOf(recipientAddresses[0]);

    const balanceRecipient2 = await huskyToken.balanceOf(recipientAddresses[1]);

    console.log(balanceRecipient1);
    console.log(balanceRecipient2);

    expect(balanceRecipient1.toString()).to.equal("100");
    expect(balanceRecipient2.toString()).to.equal("200");
  });

  it("Should airdrop ether to recipients", async function () {
    const recipientAddresses = [recipient1, recipient2];
    const amounts = [1, 2];

    await airdrop.airdropEther(recipientAddresses, amounts, { value: 3 });

    const balanceRecipient1 = await ethers.provider.getBalance(
      recipientAddresses[0]
    );
    const balanceRecipient2 = await ethers.provider.getBalance(
      recipientAddresses[1]
    );

    expect(balanceRecipient1.toString()).to.equal("27");
    expect(balanceRecipient2.toString()).to.equal("54");
  });
});
