const { ethers} = require("hardhat")
const constants = require("./constants");

  async function exec() {
    const FreeCityGame_v2 = await ethers.getContractFactory('FreeCityGame_v2')
    const VoiceBenefitCard = await ethers.getContractFactory('VoiceBenefitCard')



    const FreeCityGameContract = FreeCityGame_v2.attach(constants.FreeCityADDRESS);
    const CardContract = VoiceBenefitCard.attach(constants.NFT_1155_ADDRESS);

       
    await CardContract.setFreeCityContract(constants.FreeCityADDRESS);

    await FreeCityGameContract.grantMintRole('0x4d2e1a38d07eadf5c62cfdaf93547dae09f1ef83');
    var total = 2000
    var data = 30
    var _baseUri = "https://nft-polygon-txt-1258380815.cos.ap-nanjing.myqcloud.com/FreeCity/1.json" //所有的盲盒都走这个json
    await FreeCityGameContract.startNewBlindBox(total,data,_baseUri); //顺序不能错位

  
  }

  
exec().then(() => process.exit(0)).catch(error => {
    console.error(error)
    process.exit(1)
  });