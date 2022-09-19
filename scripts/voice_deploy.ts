import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying

  const FreeCityGame = await ethers.getContractFactory("FreeCityGame");
  const instance = await upgrades.deployProxy(FreeCityGame, ["FCM", "FCM"]);
  await instance.deployed();

  console.log("FreeCityGame_v2 deployed to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
