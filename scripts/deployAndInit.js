const { ethers, upgrades  } = require("hardhat")
const { setupParentArgs, waitForTx, expandDecimals } = require("./utils");


const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/6b1c0a034c7b40eda30bbc26714afea5");
async function main() {
  
  const FreeCityGame_v2 = await ethers.getContractFactory('FreeCityGame_v2')
  const VoiceBenefitCard = await ethers.getContractFactory('VoiceBenefitCard')
  console.log('Deploying FreeCityGame_v2...')
  const FreeCityGame_v2ontract = await FreeCityGame_v2.deploy()
  await FreeCityGame_v2ontract.deployed();


  console.log('FreeCityGame_v2 to:', FreeCityGame_v2ontract.address)

  console.log('Deploying VoiceBenefitCard...')

  const VoiceContract = await VoiceBenefitCard.deploy()
  await VoiceContract.deployed()
  console.log('VoiceBenefitCard to:', VoiceContract.address)

  var FCGAddress = FreeCityGame_v2ontract.address;
  var NFT1155Address = VoiceContract.address;





    const FreeCityGameContract = FreeCityGame_v2.attach(FCGAddress);
    const CardContract = VoiceBenefitCard.attach(NFT1155Address);

      //这个是价格，现在是goerli测试网，0.006,0.005,0.004,0.003,0.002,0.001ETH 对应6种不同的等级，
      var total = 2000;
    const cardInit = await CardContract.init(total,
        [
        6*10**15,
        5*10**15,
        4*10**15,
        3*10**15,
        2*10**15,
        1*10**15]
        );
      console.log("cardInit---hash:",cardInit.hash)
      await waitForTx(provider, cardInit.hash);
      
      var name = "FCG" 
      var symbol = "FCG" 
      const FCGInit = await FreeCityGameContract.initialize(name,symbol); 
      console.log("FCGInit---hash:",FCGInit.hash)
      await waitForTx(provider, FCGInit.hash);

 
    



  const setFCC = await CardContract.setFreeCityContract(FCGAddress);
  console.log("setFCC---hash:",setFCC.hash)
  await waitForTx(provider, setFCC.hash);
// await FreeCityGameContract.grantMintRole('0x4d2e1a38d07eadf5c62cfdaf93547dae09f1ef83');
  var total = 2000
  var data = 30
  var _baseUri = "https://nft-polygon-txt-1258380815.cos.ap-nanjing.myqcloud.com/FreeCity/1.json" //所有的盲盒都走这个json
  const startNBB =await FreeCityGameContract.startNewBlindBox(total,data,_baseUri); //顺序不能错位
  console.log("startNBB---hash:",startNBB.hash)
  await waitForTx(provider, startNBB.hash);




  const setWhiteAddress = await FreeCityGameContract.setWhiteListAddress(NFT1155Address);
  console.log("setWhiteAddress---hash:",setWhiteAddress.hash);
  await waitForTx(provider, setWhiteAddress.hash);





    var Value = await CardContract.getMintPrice('0x9AEd59261BdF0Aa334F1790881176c7F962D4337')
    var numberOfTokens = 1
    var totalValueString = (Value * numberOfTokens).toString();
    var totalValue = ethers.BigNumber.from(totalValueString)
    
    const preSale = await CardContract.preSale(numberOfTokens,{value:totalValue});
    console.log("preSale---hash:",preSale.hash)

}
  


main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
});