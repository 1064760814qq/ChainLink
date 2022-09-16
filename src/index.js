const { Command } = require("commander");
const program = new Command();
const constants = require("./constants");

require("dotenv").config();
const nft = require("./NFTCmd");
const erc = require("./ERCCmd");
const en1155 = require("./NFT1155CMD");
const native = require("./NativeCmd");

const key = process.env.key;
program.option("--url <value>", "URL to connect to", constants[key].URL);

program.option("--jsonWallet <path>", "(Optional) Encrypted JSON wallet");

program.option(
  "--jsonWalletPassword <value>",
  "(Optional) Password for encrypted JSON wallet"
);
program.option("--gasLimit <value>", "Gas limit for transactions", "610000");
program.option(
  "--gasPrice <value>",
  "Gas limit for transactions",
  "460000000000"
);
program.option("--networkId <value>", "Network Id", constants[key].NETWORK_ID);

program.allowUnknownOption(false);
program.addCommand(nft);
program.addCommand(erc);
program.addCommand(en1155);
program.addCommand(native);

const run = async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (e) {
    console.log({ e });
  }
};

if (process.argv && process.argv.length <= 2) {
  program.help();
} else {
  run();
}
