import { ethers as web3 } from "ethers";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";

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

const getCallData = function (
  total: web3.BigNumber,
  receiveLen: web3.BigNumber,
  recipient: Address
) {
  return (
    "0x" +
    ethers.utils.hexZeroPad(total.toHexString(), 32).substr(2) + // Deposit Amount        (32 bytes)
    ethers.utils.hexZeroPad(receiveLen.toHexString(), 32).substr(2) +
    recipient.substr(2)
  );
};

describe("VoiceErc20", function () {
  // eslint-disable-next-line no-unused-vars

  beforeEach(async () => {
    const block = await ethers.provider.getBlockNumber();
    console.log(block);
  });

  it("Should mint success", async function () {
    const VoiceErc20 = await ethers.getContractFactory("VoiceErc20");
    this.voiceErc20 = await VoiceErc20.attach(
      "0xEb58089C232a3ca2D5B00844629493B1098ba6aF"
    );
    // this.voiceErc20 = await upgrades.deployProxy(VoiceErc20, [
    //   "Voice",
    //   "Voice",
    // ]);
    // await this.voiceErc20.deployed();
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts[0]);

    const args = getCallData(
      ethers.BigNumber.from("200"),
      ethers.BigNumber.from(32),
      "0xEb58089C232a3ca2D5B00844629493B1098ba6aF"
    );
    //
    console.log(args);
    console.log(
      "0x" +
        ethers.utils
          .hexZeroPad(
            ethers.BigNumber.from("1010101010101010101").toHexString(),
            32
          )
          .substr(2)
    );
    // await this.voiceErc20["mint(address,uint256)"](
    //   "0x0803D9ACf8136b7b5283F31f7E793270C6c14f98",
    //   ethers.utils.parseEther("1000000")
    // );
    // const balance2 = await this.voiceErc20.balanceOf(
    //   "0xE163Edf6304504B02c894C232Ec78627FdFFFE6f"
    // );
    // console.log(balance2.toString());
  });
});

// it("should add block", async function () {
//   const value = 10000 - 1;
//   // 快速推进到100000区块前一个
//   console.log(await ethers.provider.getBlockNumber());
//   await ethers.provider.send("hardhat_mine", [convertBlockNum(value)]);
//   console.log(await ethers.provider.getBlockNumber());
// });
