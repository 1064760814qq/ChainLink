import { ethers, upgrades } from "hardhat";

async function main() {
  // Deploying
  const accounts = await ethers.provider.listAccounts();
  console.log(accounts[0]);
  const VoiceBenefitCard = await ethers.getContractFactory("VoiceBenefitCard");
  const instance = await upgrades.deployProxy(
    VoiceBenefitCard,
    [
      2000,
      [
        "15000000000000000",
        "16000000000000000",
        "17000000000000000",
        "18000000000000000",
        "19000000000000000",
        "20000000000000000",
      ],
    ],
    {
      initializer: "init",
    }
  );
  await instance.deployed();

  console.log("Voice1155 deployed to:", instance.address);

  // Upgrading
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");
  //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();
