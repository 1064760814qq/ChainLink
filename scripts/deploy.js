const { ethers, upgrades  } = require("hardhat")

// //主函数
async function main() {
  const FreeCityGame_v2 = await ethers.getContractFactory('FreeCityGame_v2')
  console.log('Deploying FreeCityGame_v2...')
  // const demo = await upgrades.deployProxy(Demo, [300], { initializer:  'setScore' })
  const FreeCityGame_v2ontract = await FreeCityGame_v2.deploy()
  
  await FreeCityGame_v2ontract.deployed();
  console.log('FreeCityGame_v2 to:', FreeCityGame_v2ontract.address)

  const VoiceBenefitCard = await ethers.getContractFactory('VoiceBenefitCard')
  console.log('Deploying VoiceBenefitCard...')
  // const demo = await upgrades.deployProxy(Demo, [300], { initializer:  'setScore' })
  const VoiceContract = await VoiceBenefitCard.deploy()
  await VoiceContract.deployed()
  console.log('VoiceBenefitCard to:', VoiceContract.address)


}



//执行可升级合约部署
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
});