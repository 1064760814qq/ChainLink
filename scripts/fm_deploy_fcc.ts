import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying
  const FCC = await ethers.getContractFactory("FCC");
  const instance = await FCC.deploy();
  await instance.deployed();

  console.log("erc20 to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
