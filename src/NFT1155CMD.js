const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx, expandDecimals } = require("./utils");

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
const mintNft = new Command("mint-nft")
  .description("Adds an admin")
  .option(
    "--admin <address>",
    "admin contract address",
    constants.NFT_MINT_ADDRESS
  )
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_1155_ADDRESS
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
      "0x6f95718d05333cddc92f39aec83c1f4ecb832d9e",
      2,
      "0xce49fe220bf580a8ad76c0da4036ad222e01a0293060737241ed12a7308b6dd5",
      "0x1c",
      "0xf38ed7d33ceeaf44947a9d9e1cb99c2da4821e7a9318369e81e5abedc806e1f1",
      "0x740fddf587b1304cfba648f694b30b2b02a5db859c986647373fe1521a273c80"
    );
    await waitForTx(args.provider, tx1.hash);
    //   let tx1 =await nftInstance.mint(constants.ADMIN,1,100,'0x00');
    //   await waitForTx(args.provider, tx1.hash)

    const uri = await nftInstance.tokenURI(args.id);
    console.log("---", uri);
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
