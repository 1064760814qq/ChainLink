
const { ethers} = require("hardhat")
const constants = require("./constants");


async function exec() {

    const VoiceBenefitCard = await ethers.getContractFactory('VoiceBenefitCard')


    const CardContract = VoiceBenefitCard.attach(constants.NFT_1155_ADDRESS);
    var Value = await CardContract.getMintPrice('0x4d2e1a38d07eadf5c62cfdaf93547dae09f1ef83')
    var numberOfTokens = 2
    var totalValueString = (Value * numberOfTokens).toString();
    var totalValue = ethers.BigNumber.from(totalValueString)
    
    await CardContract.preSale(numberOfTokens,{value:totalValue});

  }

  
exec().then(() => process.exit(0)).catch(error => {
    console.error(error)
    process.exit(1)
  });