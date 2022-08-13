import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying
  const VoiceErc20 = await ethers.getContractFactory("VoiceErc20");
  const instance = await upgrades.deployProxy(VoiceErc20, ["FCR", "FCR"]);
  await instance.deployed();

  console.log("erc20 to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
