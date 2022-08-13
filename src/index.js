const { Command } = require("commander");
const program = new Command();
const constants = require("./constants");

const nft = require("./NFTCmd");
const erc = require("./ERCCmd");
const en1155 = require("./NFT1155CMD");
const native = require("./NativeCmd");

program.option("--url <value>", "URL to connect to", constants.URL);
program.option(
  "--privateKey <value>",
  "Private key to use",
  constants.NFT_PRIVATE_KEY
);
program.option("--jsonWallet <path>", "(Optional) Encrypted JSON wallet");
program.option(
  "--jsonWalletPassword <value>",
  "(Optional) Password for encrypted JSON wallet"
);
program.option("--gasLimit <value>", "Gas limit for transactions", "610000");
program.option(
  "--gasPrice <value>",
  "Gas limit for transactions",
  "46000000000"
);
program.option("--networkId <value>", "Network Id", constants.NETWORK_ID);

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
