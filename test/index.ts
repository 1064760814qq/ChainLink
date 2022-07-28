import { expect } from "chai";
import { ethers } from "hardhat";

function convertBlockNum(num: number) {
  const big = ethers.BigNumber.from("" + num);
  const str = big.toHexString();
  let index = 0;
  for (let i = 2; i < str.length; i++) {
    if (str[i] !== "0") {
      index = i;
      break;
    }
  }
  if (index === 0) {
    return str;
  } else {
    return str.substring(0, 2) + str.substring(index);
  }
}

describe("Greeter", function () {
  // eslint-disable-next-line no-unused-vars

  beforeEach(async () => {
    const block = await ethers.provider.getBlockNumber();
    console.log(block);
  });

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    this.greeter = await Greeter.deploy("Hello, world!");
    await this.greeter.deployed();

    expect(await this.greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await this.greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await this.greeter.greet()).to.equal("Hola, mundo!");
  });
});

it("should add block", async function () {
  const value = 10000 - 1;
  // 快速推进到100000区块前一个
  console.log(await ethers.provider.getBlockNumber());
  await ethers.provider.send("hardhat_mine", [convertBlockNum(value)]);
  console.log(await ethers.provider.getBlockNumber());
});
