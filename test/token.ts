import { expect } from "chai";
import { ethers } from "hardhat";
import { HusKyToken } from "../typechain-types"; // Update the path based on your project structure

describe("HusKyToken contract", function () {
  let huskyToken: HusKyToken;
  let owner: any;

  before(async function () {
    const HuskyToken = await ethers.getContractFactory("HusKyToken");
    [owner] = await ethers.getSigners();
    huskyToken = await HuskyToken.deploy(owner.address);
    console.log("HuskyToken deployed successfully");
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await huskyToken.balanceOf(owner.address);
    expect(await huskyToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should have correct name and symbol", async function () {
    const name = await huskyToken.name();
    const symbol = await huskyToken.symbol();

    expect(name).to.equal("Husky Token");
    expect(symbol).to.equal("HKT");
  });
});
