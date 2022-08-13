import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying

  const FreeCityGame = await ethers.getContractFactory("FreeCityGame_v1");
  const instance = await upgrades.upgradeProxy(
    "0x8266F2DE6e0672471267A8d864fdB6Ce5fE203a6",
    FreeCityGame,
    {}
  );
  // const instance = await upgrades.deployProxy(FreeCityGame, ["FCM", "FCM"]);
  // await instance.deployed();

  console.log("Voice721 deployed to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
