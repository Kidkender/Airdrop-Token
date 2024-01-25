import * as hre from "hardhat";

let addressToken: string;

async function main() {
  const [owner] = await hre.ethers.getSigners();
  addressToken = "0x3A535795892d1bBf201956B5aE8cd0EEe0562729";
  console.log("Deploying contract with the account: ", owner.address);
  const tokenContract = await hre.ethers.deployContract("Token", [
    addressToken,
    owner.address,
  ]);
  await tokenContract.waitForDeployment();

  console.log(
    "Smart contract token deployed successfully to: ",
    tokenContract.target
  );
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
