import { ethers } from "ethers";

export const getSignerAddress = async function (
  privateKey: string
): Promise<string> {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const signerAddress = await wallet.getAddress();

    console.log("Signer address: " + signerAddress);
    return signerAddress;
  } catch (error) {
    console.error("Error: ", error);
  }
  return "";
};
