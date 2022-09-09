const { ethers} = require("hardhat")
const constants = require("./constants");
  async function exec() {
    const FreeCityGame_v2 = await ethers.getContractFactory('FreeCityGame_v2')
    const VoiceBenefitCard = await ethers.getContractFactory('VoiceBenefitCard')



    const FreeCityGameContract = FreeCityGame_v2.attach(constants.FreeCityADDRESS);
    const CardContract = VoiceBenefitCard.attach(constants.NFT_1155_ADDRESS);

      //这个是价格，现在是goerli测试网，0.03,0.02,0.01,0.01,0.01,0.01ETH 对应6种不同的等级，
      //真实应该是200,190,180这样
      var total = 2000;
      const info1 = await CardContract.init(total,[3,2,1,1,1,1]);

      
      var name = "FCG" 
      var symbol = "FCG" 
      await FreeCityGameContract.initialize(name,symbol); 
      

      // if(info1){
      //   await CardContract.setFreeCityContract(constants.FreeCityADDRESS)
      //   await CardContract.pushArr([1,2,2,1,1,1,1,2,2,1,1,1,1,2,2,1,1,1]) //fs 读取文档 批量
      // }
    
  
  }

  
exec().then(() => process.exit(0)).catch(error => {
    console.error(error)
    process.exit(1)
  });