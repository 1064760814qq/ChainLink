const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx, expandDecimals } = require("./utils");
const transfer = new Command("transfer")
  .description("Adds an admin")
  .option("--to <address>", "address")
  .option("--amount <amount>", "amount", 100)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const wallet = new ethers.Wallet(constants.NFT_PRIVATE_KEY, args.provider);
    const tx1 = await wallet.sendTransaction({
      to: "0xa6e9eBdca4Ed1a38da7F070afC306FF9C94FC54B",
      value: ethers.utils.parseEther("0.1"),
    });
    console.log(tx1);
    //   await waitForTx(args.provider, tx.hash)
  });
const NATIVECmd = new Command("NATIVE");
NATIVECmd.addCommand(transfer);
module.exports = NATIVECmd;
