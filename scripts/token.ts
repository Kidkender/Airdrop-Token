import { expect } from "chai";
import { ethers } from "hardhat";
import { getSignerAddress } from "../utils/address";
describe("Token contract", function () {
  const privateKey = process.env.PRIVATE_KEY || "";

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const owner = await getSignerAddress(privateKey);

    const hardhatToken = await ethers.deployContract("HusKyToken");
    const ownerBalance = await hardhatToken.balanceOf(owner);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
