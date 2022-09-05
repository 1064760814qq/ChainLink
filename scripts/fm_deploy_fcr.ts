import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying
  const FCR = await ethers.getContractFactory("FCR");
  const instance = await FCR.deploy();
  await instance.deployed();

  console.log("erc20 to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
