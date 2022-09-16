const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx, expandDecimals } = require("./utils");
const key = process.env.key;
function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
const mintNft = new Command("mint-nft")
  .description("Adds an admin")
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].ADMIN_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--id <number>", "tokenId", 1)
  .option("--uri <value>", "uri")
  .option("--amount <amount>", "amount", 100)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    console.log(`Adding ${args.admin} as a admin.`);
    // const uri1 = await nftInstance.uri(args.id);

    // console.log("---", uri1);
    const tx1 = await nftInstance.airdrop(
      "0x3a01248aAE0711440676E47F2262f51080f9E37d",
      2,
      "0xbbf8cc9494f4662b8638f5eedaa6ea0e49108e49d5cb63c7868a4b77fd96108f",
      "0x1c",
      "0x2a023d33331c3e1831028d5b7914b34278be86b09e429fb1e1a9b767da0f4dee",
      "0x5f1d78dfd8fb08c8c6b0216b5e761a53e5e82890bfcb8d70d9b618e4cec067ba",
      {
        // The maximum units of gas for the transaction to use
        gasLimit: 2300000,

        // The price (in wei) per unit of gas
        gasPrice: ethers.utils.parseUnits("1900.0", "gwei"),
      }
    );
    await waitForTx(args.provider, tx1.hash);
    //   let tx1 =await nftInstance.mint(constants.ADMIN,1,100,'0x00');
    //   await waitForTx(args.provider, tx1.hash)

    const tx = await nftInstance.balanceOf(constants.ADMIN, args.id);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });
const mintBatchNft = new Command("mint-batch-nft")
  .description("Adds an admin")
  .option("--admin <address>", "admin contract address", constants.ADMIN)
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .option("--end <number>", "tokenid", 20)
  .option("--amount <amount>", "amount", 100)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);
    let i = args.id * 1;
    while (i <= args.end * 1) {
      await (async function (i) {
        await sleep(2000);
        const tx1 = await nftInstance.mint(
          constants.ADMIN,
          i,
          args.amount,
          "0x00"
        );
        await waitForTx(args.provider, tx1.hash);

        const tx2 = await nftInstance.setURI(i, i + ".png");
        await waitForTx(args.provider, tx2.hash);
        //   let tx1 =await nftInstance.mint(constants.ADMIN,1,100,'0x00');
        //   await waitForTx(args.provider, tx1.hash)
        const uri = await nftInstance.uri(i);
        console.log("---", uri);
        const tx = await nftInstance.balanceOf(constants.ADMIN, i);
        console.log("---", tx);
      })(i);
      i++;
    }

    //   await waitForTx(args.provider, tx.hash)
  });

const setTokenUri = new Command("token-uri")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .option("--uri <value>", "uri")
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.contract} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)

    const tx1 = await nftInstance.setURI(args.id, args.uri);
    await waitForTx(args.provider, tx1.hash);

    const uri = await nftInstance.uri(args.id);
    console.log("---", uri);
    const tx = await nftInstance.balanceOf(constants.ADMIN, args.id);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const queryBalance = new Command("query-balance")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_1155_ADDRESS
  )
  .option("--address [address]", "address", constants.ADMIN)
  .option("--id [number]", "id", 1)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );
    console.log(`Adding ${args.address} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)
    const balance = await nftInstance.balanceOf(args.address, args.id);
    console.log("---", balance);
    //   await waitForTx(args.provider, tx.hash)
  });

const setMintAmount = new Command("set-MintAmount")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_1155_ADDRESS
  )
  .option("--amount <amount>", "amount", 102)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );
    console.log(`Adding ${args.amount} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)
    const balance = await nftInstance.setMintAmount(
      expandDecimals(args.amount, 18)
    );
    console.log("---", balance);
    //   await waitForTx(args.provider, tx.hash)
  });

const transferNft = new Command("transfer-nft")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.CONTRACT_ADDRESS
  )
  .option("--ids [number]", "ids", 1)
  .option("--from <address>", "admin contract address", constants.ADMIN)
  .option("--amounts [amount]", "amounts", 1)
  .option("--to <address>", "to")
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );
    console.log(`Adding ${args.contract} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)
    const tx1 = await nftInstance.safeTransferFrom(
      args.from,
      args.to,
      args.ids,
      args.amounts,
      "0x00"
    );
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to, args.ids);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const queryTokenUri = new Command("query-uri")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NN1155FT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)

    //   let tx1 =await nftInstance.setURI(args.id,args.uri);
    //   await waitForTx(args.provider, tx1.hash)

    const uri = await nftInstance.uri(args.id);
    console.log("---", uri);
    const tx = await nftInstance.balanceOf(constants.ADMIN, args.id);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const setBaseUri = new Command("base-uri")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .option("--baseUri <value>", "baseUri")
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)

    const tx1 = await nftInstance.setBaseUri(args.baseUri);
    await waitForTx(args.provider, tx1.hash);

    const uri = await nftInstance.uri(args.id);
    console.log("---", uri);
    const tx = await nftInstance.balanceOf(constants.ADMIN, args.id);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const adminCmd = new Command("NNFT");
adminCmd.addCommand(mintNft);
adminCmd.addCommand(setTokenUri);
adminCmd.addCommand(setBaseUri);
adminCmd.addCommand(queryTokenUri);
adminCmd.addCommand(queryBalance);
adminCmd.addCommand(setMintAmount);
adminCmd.addCommand(mintBatchNft);
adminCmd.addCommand(transferNft);
module.exports = adminCmd;
