import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { inputFile } from "hardhat/internal/core/params/argumentTypes";

describe("voice", function () {
  const tokenId = "1010101010101010110";

  beforeEach(async function () {
    const block = await ethers.provider.getBlockNumber();
    this.accounts = await ethers.provider.listAccounts();
    console.log(block);
  });

  it("it should init contract success", async function () {
    const Voice721 = await ethers.getContractFactory("Voice721");
    this.voice = await Voice721.attach(
      "0xe6555e13D891927619f0DBD59eb131ea22110180"
    );
    console.log(this.voice.address);
  });

  it("it should mint nft success", async function () {
    //   const name = await this.voice.name();
    //   expect(name.toString()).to.equal("NFTVoice");
    //   const accounts = await ethers.provider.listAccounts();
    //   const balance = await this.voice.balanceOf(accounts[0]);
    //   console.log(balance.toString());
    //   await this.voice["mint(address,uint256,string)"](
    //     accounts[0],
    //     ethers.BigNumber.from(tokenId),
    //     tokenId
    //   );
    // const owner = await this.voice.ownerOf(ethers.BigNumber.from(tokenId));
    // console.log(owner);
    //   console.log(accounts);
    //   // await this.voice.setApprovalForAll(accounts[1], true);
    //   const td = await this.voice.tokenOfOwnerByIndex(
    //     accounts[0],
    //     ethers.BigNumber.from("1")
    //   );
    //   console.log("tokenOfOwnerByIndex", td.toString());
    //   // const balance2 = await this.voice.balanceOf(accounts[0]);
    //   // expect(balance2.toString()).to.equal("2");
  });

  it("grant mint role", async function () {
    // await this.voice.grantMintRole(
    //   "0xf5348b0D6eb820691F794f6b37e4CE3b4bBA2061"
    // );
    // console.log(this.accounts[1]);
    // console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("2321312")));
    //   console.log("start");
    // await this.voice["mint(address,uint256,string,uint32)"](
    //   "0xa6e9eBdca4Ed1a38da7F070afC306FF9C94FC54B",
    //   ethers.BigNumber.from(tokenId),
    //   "QmfTJ6Gtu35GyNceaagHfseWwhC4n1BAnotMPXEWNscG3C",
    //   ethers.BigNumber.from("12041122")
    // );

    const curtokenId = "1010101010101010110";
    await this.voice["transfer(address,uint256)"](
      "0xf5348b0D6eb820691F794f6b37e4CE3b4bBA2061",
      ethers.BigNumber.from(curtokenId)
    );
    //   const hash = await this.voice.hashOf(ethers.BigNumber.from(tokenId));
    //   console.log(hash.toString());
  });

  // it("query token uri", async function () {
  //   const url = await this.voice.tokenURI(ethers.BigNumber.from(tokenId));
  //   console.log(url);
  //   // console.log("uri", td);
  // });

  // it("despoit should success", async function () {
  //   await this.voice["despoit(uint256,address,string)"](
  //     ethers.BigNumber.from(tokenId),
  //     "0xf5348b0D6eb820691F794f6b37e4CE3b4bBA2061",
  //     "2312321"
  //   );
  // });
});
