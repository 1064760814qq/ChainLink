/* eslint-disable no-unused-vars */
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { emit } from "process";
const COIN_ADDRESS = "0x0000000000000000000000000000000000000000";
describe("voice", function () {
  let ContractOwner: { address: any };
  let user1: { address: any };
  let user2: { address: any };
  let user3: { address: any };
  beforeEach(async function () {
    [ContractOwner, user1, user2] = await ethers.getSigners();
    const block = await ethers.provider.getBlockNumber();
    this.accounts = await ethers.provider.listAccounts();
    console.log(block);
    const FreeCityGame = await ethers.getContractFactory("FreeCityGame");
    // this.voice = await Voice721.attach(
    //   "0xe6555e13D891927619f0DBD59eb131ea22110180"
    // );
    this.voice = await upgrades.deployProxy(FreeCityGame, ["FCM", "FCM"]);
    await this.voice.deployed();

    console.log("Voice721 deployed to:", this.voice.address);
  });

  xit("it should init contract success", async function () {
    const name = await this.voice.name();
    expect(name.toString()).to.equal("FCM");
  });

  xit("it should mint success", async function () {
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 1);
    const owner = await this.voice["ownerOf(uint256)"](1);
    expect(owner).to.equal(this.accounts[1]);
    const balance = await this.voice.balanceOf(this.accounts[1]);
    expect(balance).to.equal(1);
    const vocieAtt = await this.voice.metaMutData(1);
    expect(vocieAtt[0]).to.equal("0");
    expect(vocieAtt[1]).to.equal("0");
    expect(vocieAtt[2]).to.equal("test");
  });

  xit("it should despoit success", async function () {
    console.log(this.accounts[1]);
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 1);
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 2);

    const owner = await this.voice["ownerOf(uint256)"](1);
    expect(owner).to.equal(this.accounts[1]);
    const balance = await this.voice.balanceOf(this.accounts[1]);
    expect(balance).to.equal(2);

    await expect(this.voice.connect(user1)["despoit(uint256)"](1))
      .to.emit(this.voice, "Despoit")
      .withArgs(user1.address, 1);

    expect(await this.voice["isStaking(uint256)"](1)).to.equal(true);

    await expect(
      this.voice.connect(user1)["transfer(address,uint256)"](user2.address, 1)
    ).revertedWith("n1");

    await expect(this.voice.withdraw(user1.address, 1))
      .to.emit(this.voice, "Withdraw")
      .withArgs(user1.address, 1);

    expect(await this.voice["isStaking(uint256)"](1)).to.equal(false);
    console.log("check owner");
    await expect(
      this.voice.connect(user1)["transfer(address,uint256)"](user2.address, 1)
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(user1.address, user2.address, 1);

    // const balance2 = await this.voice.balanceOf(user2.address);
    // console.log(balance2);
    const newOwner = await this.voice["ownerOf(uint256)"](1);
    expect(newOwner).to.equal(user2.address);
  });

  xit("it should synthesis success", async function () {
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 1);
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 2);

    await expect(this.voice.connect(user1)["despoit(uint256)"](1))
      .to.emit(this.voice, "Despoit")
      .withArgs(user1.address, 1);

    expect(await this.voice["isStaking(uint256)"](1)).to.equal(true);
    await expect(this.voice.connect(user1)["despoit(uint256)"](2))
      .to.emit(this.voice, "Despoit")
      .withArgs(user1.address, 2);

    expect(await this.voice["isStaking(uint256)"](2)).to.equal(true);

    await expect(
      this.voice.synthesis(
        1,
        2,
        ethers.utils.formatBytes32String("R"),
        user1.address,
        "test2"
      )
    )
      .to.emit(this.voice, "Synthesis")
      .withArgs(4, 1, 2);
  });
  xit("it should exchange success", async function () {
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 1);
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 2);

    await expect(this.voice.connect(user1)["despoit(uint256)"](1))
      .to.emit(this.voice, "Despoit")
      .withArgs(user1.address, 1);

    await expect(this.voice.exchange(1, user2.address, 2, 2))
      .to.emit(this.voice, "Exchange")
      .withArgs(this.accounts[1], user2.address, 1);

    expect(await this.voice["isStaking(uint256)"](1)).to.equal(true);
    const newOwner = await this.voice["ownerOf(uint256)"](1);
    expect(newOwner).to.equal(user2.address);
  });

  xit("it should withdraw success", async function () {
    await expect(
      this.voice["mint(address,bytes32,string)"](
        this.accounts[1],
        ethers.utils.formatBytes32String("R"),
        "test"
      )
    )
      .to.emit(this.voice, "Transfer")
      .withArgs(COIN_ADDRESS, this.accounts[1], 1);
    await expect(this.voice.connect(user1)["despoit(uint256)"](1))
      .to.emit(this.voice, "Despoit")
      .withArgs(user1.address, 1);
    expect(await this.voice["isStaking(uint256)"](1)).to.equal(true);
    await expect(this.voice["withdraw(address,uint256)"](user1.address, 1))
      .to.emit(this.voice, "Withdraw")
      .withArgs(user1.address, 1);
    expect(await this.voice["isStaking(uint256)"](1)).to.equal(false);

    await expect(this.voice.connect(user1)["despoit(uint256)"](1))
      .to.emit(this.voice, "Despoit")
      .withArgs(user1.address, 1);

    expect(await this.voice["isStaking(uint256)"](1)).to.equal(true);
    await expect(this.voice.exchange(1, user2.address, 2, 2))
      .to.emit(this.voice, "Exchange")
      .withArgs(user1.address, user2.address, 1);
    await expect(this.voice.withdraw(user2.address, 1))
      .to.emit(this.voice, "Withdraw")
      .withArgs(user2.address, 1);
    expect(await this.voice["isStaking(uint256)"](1)).to.equal(false);
  });
  it("it should start blindbox success", async function () {
    await expect(
      this.voice.startNewBlindBox(
        1000,
        3,
        "https://bafybeihxugw2qnzsqrr75tmrirjndisivytl6idqooqks6blbl2fbcrg34.ipfs.infura-ipfs.io/N.png"
      )
    ).to.emit(this.voice, "StartBlind");

    expect(await this.voice.blindBoxTotal()).to.equal(1000);

    console.log(await this.voice.blindBoxEndDay());
    await this.voice.setWhiteListAddress(ContractOwner.address);
    const addresses = [];
    const qualities = [];
    for (let i = 1; i < 31; i++) {
      addresses.push(
        ethers.utils.hexZeroPad(ethers.BigNumber.from(i).toHexString(), 20)
      );
      qualities.push(ethers.utils.formatBytes32String("R"));
    }

    await expect(this.voice.batchMint(addresses, qualities)).to.emit(
      this.voice,
      "BatchMint"
    );

    expect(await this.voice.blindBoxCurrentData()).to.equal(30);
  });
});
