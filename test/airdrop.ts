import { expect } from "chai";
import { ethers } from "hardhat";
import * as etherjs from "ethers";
import { Airdrop } from "../typechain-types";
import { HusKyToken } from "../typechain-types";
import { Signer } from "ethers";

describe("Airdrop contract", function () {
  let airdrop: Airdrop;
  let owner:any;
  let recipient1: string;
  let recipient2: string;
  let huskyToken: HusKyToken;
  
  const erc20Abi = [
      "function balanceOf(address) view returns (uint256)"
  ];

  before(async function () {
    const HuskyToken = await ethers.getContractFactory("Token");
    [owner] = await ethers.getSigners();

    huskyToken = await HuskyToken.deploy(owner.address);

    const Airdrop = await ethers.getContractFactory("Airdrop");
    [owner] = await ethers.getSigners();
     
    recipient1 = "0x4B45E8B958aaeB509E1264c6e4Ac45F9C7f991A2";
    recipient2 = "0x7e8E1A59445bA9BC4103563858dD276bD0369944";
    
    airdrop = await Airdrop.deploy(huskyToken.target, owner.address);
    console.log("Smart contract successfully deployed");
  });

  it("Should airdrop tokens to recipients", async function () {
    const recipientAddresses = [recipient1, recipient2];
    const amounts = [100, 200];

    await huskyToken.approve(airdrop.target, 500);
    await airdrop.airdropTokens(recipientAddresses, amounts);

    const balanceRecipient1 = await huskyToken.balanceOf(recipientAddresses[0]);
    const balanceRecipient2 = await huskyToken.balanceOf(recipientAddresses[1]);
    
    console.log(balanceRecipient1);
    console.log(balanceRecipient2);

    expect(balanceRecipient1.toString()).to.equal("100");
    expect(balanceRecipient2.toString()).to.equal("200");
  });

  it("Should airdrop ether to recipients", async function () {
    const recipientAddresses =[recipient1, recipient2];
    const amounts = [1, 2];

    await airdrop.airdropEther(recipientAddresses, amounts, { value: 3 });

    const balanceRecipient1 = await ethers.provider.getBalance(
      recipientAddresses[0]
    );
    const balanceRecipient2 = await ethers.provider.getBalance(
      recipientAddresses[1]
    );

    expect(balanceRecipient1.toString()).to.equal("6");
    expect(balanceRecipient2.toString()).to.equal("12");
  });
});
