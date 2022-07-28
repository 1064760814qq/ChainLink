const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx } = require("./utils");

const meta = require("./meta.json");
const uri =
  "https://ipfs.gamehualing.com/ipns/k51qzi5uqu5dm0deqirwcqma122cvhsmowf3yyks5acxscmg6t1nrxslo5jgrf/";

// eslint-disable-next-line no-unused-vars
const generateMeta = function (level, quality, mintTimes, no, tokenId) {
  meta.attributes.forEach((trait) => {
    if (trait.trait_type === "level") {
      trait.value = level;
    } else if (trait.trait_type === "quality") {
      trait.value = quality;
    } else if (trait.trait_type === "mint times") {
      trait.value = mintTimes;
    } else if (trait.trait_type === "number") {
      trait.value = no;
    }
  });
  meta.image = uri + tokenId + ".json";
};

// eslint-disable-next-line no-unused-vars
const uploadIpfs = new Command("uploadIpfs");

const mintNft = new Command("mint-nft")
  .description("Adds an admin")
  .option("--admin <address>", "admin contract address", constants.ADMIN)
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address", constants.DEFAULT_MINT_TO)
  .option("--uri <value>", "uri")
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    const ba = await args.wallet.getBalance(constants.ADMIN);
    console.log("---", ba.toString());
    const tx1 = await nftInstance["mint(address,uint256,string,uint32)"](
      args.to,
      123343,
      1223
    );
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const mintBatchNft = new Command("mint-batch-nft")
  .description("Adds an admin")
  .option("--admin <address>", "admin contract address", constants.ADMIN)
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
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
    constants.NFT_CONTRACT_ADDRESS
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
const transferNft = new Command("transfer-nft")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--id [number]", "id", 1)
  .option("--to <address>", "to")
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
    const tx1 = await nftInstance.transfer(args.to, args.id);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const queryTokenUri = new Command("query")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
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

    //   let tx1 =await nftInstance.setURI(args.id,args.uri);
    //   await waitForTx(args.provider, tx1.hash)

    const uri = await nftInstance.ownerOf(args.id);
    console.log("---", uri);

    //   await waitForTx(args.provider, tx.hash)
  });

const setBaseUri = new Command("base-uri")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
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

const NFTCmd = new Command("NFT");
NFTCmd.addCommand(mintNft);
NFTCmd.addCommand(setTokenUri);
NFTCmd.addCommand(setBaseUri);
NFTCmd.addCommand(queryTokenUri);
NFTCmd.addCommand(mintBatchNft);
NFTCmd.addCommand(transferNft);
module.exports = NFTCmd;
