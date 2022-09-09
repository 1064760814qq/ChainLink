const { ethers} = require("hardhat")
const constants = require("./constants");


async function exec() {
    const FreeCityGame_v2 = await ethers.getContractFactory('FreeCityGame_v2')
    const VoiceBenefitCard = await ethers.getContractFactory('VoiceBenefitCard')



    const FreeCityGameContract = FreeCityGame_v2.attach(constants.FreeCityADDRESS);
    const CardContract = VoiceBenefitCard.attach(constants.NFT_1155_ADDRESS);

    
    
    await FreeCityGameContract.setWhiteListAddress(constants.NFT_1155_ADDRESS);


  }

  
exec().then(() => process.exit(0)).catch(error => {
    console.error(error)
    process.exit(1)
  });