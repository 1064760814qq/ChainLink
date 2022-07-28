import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying
  const accounts = await ethers.provider.listAccounts();
  console.log(accounts[0]);
  const Voice721 = await ethers.getContractFactory("Voice721");
  const instance = await upgrades.deployProxy(Voice721, [
    "FCM",
    "FCM",
    "https://ipfs.gamehualing.com/ipfs/",
  ]);
  await instance.deployed();

  console.log("Voice721 deployed to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
