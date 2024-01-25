import * as hre from "hardhat";

let addressToken: string;
async function main() {
  const [owner] = await hre.ethers.getSigners();
  addressToken = "0x3A535795892d1bBf201956B5aE8cd0EEe0562729";

  console.log("Deploying contract with the account: ", owner.address);
  const airdropContract = await hre.ethers.deployContract("Airdrop", [
    addressToken,
    owner.address,
  ]);
  await airdropContract.waitForDeployment();

  console.log(
    "Smart contract airdrop deployed successfully to: ",
    airdropContract.target
  );
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
