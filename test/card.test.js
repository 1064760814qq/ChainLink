//demo-v2.test.js
const { expect } = require('chai') 
const { ethers, upgrades} = require('hardhat') 

describe('VoiceBenefitCard合约测试', () => {

  

  before(async () => {

    const VoiceBenefitCardContract = await ethers.getContractFactory('VoiceBenefitCard')

    this.CardContract = await VoiceBenefitCardContract.deploy()
  });

  it('测试-设置5个tokenId的价格', async () => {
    await this.CardContract.setEveryNftMintPrice([1000,2000,3333,40000,55555]) 
    const arrayMintPrice = await this.CardContract.getMintPrice()
    // console.log(arrayMintPrice)
    expect(arrayMintPrice[0].toString()).to.be.equal('1000') 
  })


  it('测试-单个设置tokenId的价格', async () => {

    await this.CardContract.setSingleNftMintPrice(1,500) 
    await this.CardContract.setSingleNftMintPrice(2,800)
    await this.CardContract.setSingleNftMintPrice(3,999)
    await this.CardContract.setSingleNftMintPrice(4,1111)
    await this.CardContract.setSingleNftMintPrice(5,1555)
    const arrayMintPrice = await this.CardContract.getMintPrice()
    // ethers.utils.parseEther
    // console.log(arrayMintPrice)
    expect(arrayMintPrice[0].toString()).to.be.equal('500') 
    expect(arrayMintPrice[1].toString()).to.be.equal('800') 
  })


  it('测试-销售', async () => {

    await this.CardContract.preSale(1,'ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png',{value:500})
    await this.CardContract.preSale(2,'ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png',{value:800})
    await this.CardContract.preSale(2,'ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png',{value:800})
    await this.CardContract.preSale(4,'ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png',{value:1111})
    await this.CardContract.preSale(5,'ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png',{value:1555})
    await this.CardContract.preSale(3,'ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png',{value:999})
    const arrayMintPrice = await this.CardContract.getMintPrice()
    expect(arrayMintPrice[0].toString()).to.be.equal('500') 
  })




})

