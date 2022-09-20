//demo-v2.test.js
const { expect } = require('chai') 
const { ethers, upgrades} = require('hardhat') 

describe('VoiceBenefitCard合约测试', () => {

  
//部署麦克风合约与盲盒NFT FreeCityGame的合约
  before(async () => {

    const VoiceBenefitCardContract = await ethers.getContractFactory('VoiceBenefitCard')
    const FreeCityGame_v2 = await ethers.getContractFactory('FreeCityGame_v2')


    // const block = await ethers.provider.getBlockNumber();
    this.accounts = await ethers.provider.listAccounts();
    const [owner, otherAccount] = await ethers.getSigners();
    

    this.CardContract = await VoiceBenefitCardContract.deploy()
    this.FreeCityGameContract = await FreeCityGame_v2.deploy()
  });


  it('CardContract & FreeCityGame Init', async () => {
    const admin =  this.accounts[0];
    const user1 =  this.accounts[1];
    const user2 =  this.accounts[2];
    var total = 2000; //盲盒的总量
    await this.CardContract.init(total,[60,50,40,30,20,10]);
    // console,log(this.FreeCityGameContract.address)
    await this.CardContract.setFreeCityContract(this.FreeCityGameContract.address)
  

    
 
    var data = 30; //开放盲盒开卖的时长
    var _baseUri = "https://motor-nft.s3.ap-southeast-1.amazonaws.com/info/file/0.json" //所有的盲盒都走这个json
    var _white = this.CardContract.address
    var name = "FCG" //再商量
    var symbol = "FCG" //再商量
    await this.FreeCityGameContract.initialize(name,symbol); //一定是第一位
    await this.FreeCityGameContract.startNewBlindBox(total,data,_baseUri); //顺序不能错位
    await this.FreeCityGameContract.setWhiteListAddress(_white);
   
  })

  it('测试-买盲盒', async () => {
    // const [owner, otherAccount] = await ethers.getSigners();
    var numberOfTokens = 3
    await this.CardContract.mint(this.accounts[0],1);
    var adminMintValue = await this.CardContract.getMintPrice(this.accounts[0]);

    // var totalValue = (adminMintValue * numberOfTokens).toLocaleString();
    // var totalValue = new ethers.utils.bigNumberify(adminMintValue * numberOfTokens).mul('0x3b9aca00')
    var totalValueString = (adminMintValue * numberOfTokens).toString();
    var totalValue = ethers.BigNumber.from(totalValueString)


    await this.CardContract.preSale(numberOfTokens,{value:totalValue});
    // var otherSingleValue = await this.CardContract.getMintPrice(this.accounts[0]);
    // var otherAccountValue = (otherSingleValue * numberOfTokens).toString();
    // var otherSingleValueBig = ethers.BigNumber.from(otherAccountValue)

    // await this.CardContract.connect(otherAccount).preSale(numberOfTokens,{value:otherSingleValueBig})

    const tokenURI1 = await this.FreeCityGameContract.tokenURI(1);

    const tokenURI2 = await this.FreeCityGameContract.tokenURI(2);
    // const tokenURI5 = await this.FreeCityGameContract.tokenURI(5);


    await expect(this.CardContract.connect(this.accounts[0]).preSale(numberOfTokens,{value:500}))
    
    expect(tokenURI1.toString()).to.be.equal('https://motor-nft.s3.ap-southeast-1.amazonaws.com/info/file/0.json') 
    expect(tokenURI2.toString()).to.be.equal('https://motor-nft.s3.ap-southeast-1.amazonaws.com/info/file/0.json') 
    // expect(tokenURI5.toString()).to.be.equal('https://motor-nft.s3.ap-southeast-1.amazonaws.com/info/file/0.json') 

  })

  it('测试-开盲盒', async () => {
    
    //后端 批量开盲盒
    var total = await this.FreeCityGameContract.totalSupply()

    var openTimes;
    ((total % 100) != 0 ) ? openTimes = ((total / 100) +1) : openTimes = (total / 100)
    for (var i=0;i<openTimes;i++){
    await this.FreeCityGameContract.openBlindBox('https://nft-polygon-txt-1258380815.cos.ap-nanjing.myqcloud.com/FreeCity');
  }
    const tokenURI1 = await this.FreeCityGameContract.tokenURI(1);
    const tokenURI2 = await this.FreeCityGameContract.tokenURI(2);

   expect(tokenURI1.toString()).to.be.equal('https://nft-polygon-txt-1258380815.cos.ap-nanjing.myqcloud.com/FreeCity/1.json')
   expect(tokenURI2.toString()).to.be.equal('https://nft-polygon-txt-1258380815.cos.ap-nanjing.myqcloud.com/FreeCity/2.json')


  })


  it('测试-mint', async () => {
    
    var _tokenURI = "https://nft-polygon-txt/matic/"
    for (var i=0;i<8;i++){
      var nftTokenURI = _tokenURI + i +".json";
      await this.FreeCityGameContract.mint(this.accounts[0],2,nftTokenURI);
    }

    const vocieAtt_10 = await this.FreeCityGameContract.tokenURI(10);
    // const vocieAtt2 = await this.FreeCityGameContract.metaMutData(2);
    expect(vocieAtt_10.toString()).to.be.equal('https://nft-polygon-txt/matic/6.json')


  })

  // // it('测试-批量mint', async () => {
  //   //批量mint 需要白名单地址才能，不是很理解这里为什么不让项目方直接mint。好像本意是另外的合约来批量mint？
  // //   var _tokenURI = "https://nft-polygon-txt/matic/"
  // //   var tos = [
  // //     this.accounts[1],
  // //     this.accounts[1],
  // //     this.accounts[2],
  // //     this.accounts[3],
  // //   ]
  // //   var qualities = [
  // //     1,2,2,3
  // //   ]
  // //   await this.FreeCityGameContract.batchMint(tos,qualities);
  

  // //   const vocieAtt_10 = await this.FreeCityGameContract.tokenURI(10);
  // //   // const vocieAtt2 = await this.FreeCityGameContract.metaMutData(2);
  // //   expect(vocieAtt_10.toString()).to.be.equal('https://nft-polygon-txt/matic/6.json')


  // // })



  // it('测试-合成', async () => {
    
  //   //先deposit  1和2 号NFT
  //   await this.FreeCityGameContract.deposit(1,1);
  //   await this.FreeCityGameContract.deposit(2,1);
  //   await this.FreeCityGameContract.synthesis(1,2,3,this.accounts[0], "https://nft-polygon-txt/matic/888.json")
  //   const vocieAtt_11 = await this.FreeCityGameContract.tokenURI(12);

  //   expect(vocieAtt_11.toString()).to.be.equal('https://nft-polygon-txt/matic/888.json')

  // })


  // it('测试-transfer', async () => {
  //   var fromTransAddress2 = this.accounts[0];
  //   //质押状态不能再转出，如果不是质押状态可以转出
  //   await this.FreeCityGameContract.transferFrom(this.accounts[0],this.accounts[1],1);
  //   await this.FreeCityGameContract.transferFrom(this.accounts[0],this.accounts[1],2);
  //   // await this.FreeCityGameContract.safeTransferFrom(this.accounts[0],this.accounts[1],2);

  //   var address2 =   await this.FreeCityGameContract.ownerOf(1);
  //   var address22 =   await this.FreeCityGameContract.ownerOf(2);

  //   expect(address2.toString()).to.be.equal(this.accounts[1])
  //   expect(address22.toString()).to.be.equal(this.accounts[1])
  // })


  //  it('测试-质押状态', async () => {
    

  //   var bool_1 = await this.FreeCityGameContract.isStaking(1);
  //   var bool_3 = await this.FreeCityGameContract.isStaking(3);
  //   console.log(bool_3)

  //   // await this.FreeCityGameContract.deposit(2,1);
  //   // await this.FreeCityGameContract.synthesis(1,2,3,this.accounts[0], "https://nft-polygon-txt/matic/888.json")
  //   // const vocieAtt_11 = await this.FreeCityGameContract.tokenURI(11);
  //   // // const vocieAtt2 = await this.FreeCityGameContract.metaMutData(2);

  //   expect(bool_1.toString()).to.be.equal('true')
  //   expect(bool_3.toString()).to.be.equal('false')

  // })

  // //专门测试不成功案例，revertedWith,因为4号还没有质押
  // // it('测试-exchange', async () => {
    

  // //   await this.FreeCityGameContract.exchange(4,this.accounts[3],3,4);
  // //   var ownerOf4 = this.FreeCityGameContract.ownerOf(4)
  // //   console.log(ownerOf4)

  // //   // await this.FreeCityGameContract.deposit(2,1);
  // //   // await this.FreeCityGameContract.synthesis(1,2,3,this.accounts[0], "https://nft-polygon-txt/matic/888.json")
  // //   // const vocieAtt_11 = await this.FreeCityGameContract.tokenURI(11);
  // //   // // const vocieAtt2 = await this.FreeCityGameContract.metaMutData(2);

  // //   expect(ownerOf4.toString()).to.be.revertedWith('n3')


  // // })

  // it('测试-exchange', async () => {
    
  //   await this.FreeCityGameContract.deposit(4,4);
  //   await this.FreeCityGameContract.exchange(4,this.accounts[3],3,4);
  //   var ownerOf4 = await this.FreeCityGameContract.ownerOf(4)
  //   var info = await this.FreeCityGameContract.metaMutData(4)
  //   console.log(info)


  //   // await this.FreeCityGameContract.deposit(2,1);
  //   // await this.FreeCityGameContract.synthesis(1,2,3,this.accounts[0], "https://nft-polygon-txt/matic/888.json")
  //   // const vocieAtt_11 = await this.FreeCityGameContract.tokenURI(11);
  //   // // const vocieAtt2 = await this.FreeCityGameContract.metaMutData(2);

  //   expect(ownerOf4.toString()).to.be.equal(this.accounts[3])
  //   expect(info[0].toString()).to.be.equal('3')//life
  //   expect(info[1].toString()).to.be.equal('4')//grade


  // })

  // it('测试-withdraw', async () => {
    
  //   await this.FreeCityGameContract.deposit(5,5);
  //   await this.FreeCityGameContract.withdraw(this.accounts[0],5,6,6);
  //   var ownerOf5 = await this.FreeCityGameContract.ownerOf(5)
  //   var info = await this.FreeCityGameContract.metaMutData(5)
  //   console.log(info)


  //   // await this.FreeCityGameContract.deposit(2,1);
  //   // await this.FreeCityGameContract.synthesis(1,2,3,this.accounts[0], "https://nft-polygon-txt/matic/888.json")
  //   // const vocieAtt_11 = await this.FreeCityGameContract.tokenURI(11);
  //   // // const vocieAtt2 = await this.FreeCityGameContract.metaMutData(2);
  //   await this.FreeCityGameContract.deposit(5,5);


  //   expect(ownerOf5.toString()).to.be.equal(this.accounts[0])


  //   // expect(info[0].toString()).to.be.equal('3')//life
  //   // expect(info[1].toString()).to.be.equal('4')//grade


  // })

  // // //这个to 没有被赋值 不会成功。
  // // it('测试-claim', async () => {
    
  // //   // await this.FreeCityGameContract.deposit(5,5);
  // //   await this.FreeCityGameContract.claim(5);
  // //   await this.FreeCityGameContract.deposit(5,5);


  // //   expect(ownerOf5.toString()).to.be.revertedWith('')


  // // })

  

  






})

