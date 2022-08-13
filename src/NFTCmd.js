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

    // const ba = await args.wallet.getBalance(constants.ADMIN);
    // console.log("---", ba.toString());
    const tx1 = await nftInstance["mint(address,uint256,string)"](
      args.to,
      1,
      args.uri
    );
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const SynthesisNft = new Command("synthesis-nft")
  .description("Adds an admin")
  .option("--admin <address>", "admin contract address", constants.ADMIN)
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--p <number>", "parent", 1)
  .option("--m <number>", "mother", 2)
  .option("--q <value>", "quality", 1)
  .option("--to <address>", "address", constants.DEFAULT_MINT_TO)
  .option("--uri <value>", "uri", uri)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    // const ba = await args.wallet.getBalance(constants.ADMIN);
    // console.log("---", ba.toString());
    const tx1 = await nftInstance[
      "synthesis(uint256,uint256,uint256,address,string)"
    ](1, 2, 1, args.to, args.uri);
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

const depositNft = new Command("deposit-nft")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--id [number]", "id", 1)
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
    const tx1 = await nftInstance.deposit(args.id, "12321");
    console.log(tx1.hash.toString());
    await waitForTx(args.provider, tx1.hash);

    // const tx = await nftInstance.balanceOf(constants.ADMIN, args.id);
    // console.log("---", tx);
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

    const owner = await nftInstance.ownerOf(args.id);
    console.log(owner);

    const uri = await nftInstance.tokenURI(args.id);
    console.log("---", uri);

    const meta = await nftInstance.metaMutData(args.id);
    console.log("---", meta.toString());

    //   await waitForTx(args.provider, tx.hash)
  });
const withdraw = new Command("withdraw")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .option("--to <address>", "address", constants.ADMIN)
  .option("--life <number>", "life", 1)
  .option("--grade <number>", "grade", 1)
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

    const tx1 = await nftInstance["withdraw(address,uint256,uint128,uint128)"](
      args.to,
      args.id,
      args.life,
      args.grade
    );
    await waitForTx(args.provider, tx1.hash);
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

const queryAllNft = new Command("query-all")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--owner <address>", "address", constants.ADMIN)
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

    const tokens = await nftInstance.tokensOfOwner(args.owner);

    console.log("---", tokens.toString());
    //   await waitForTx(args.provider, tx.hash)
  });

const grantMintRole = new Command("grant-mint-role")
  .description("Adds an admin")
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants.NFT_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address", constants.ADMIN)
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

    const tx1 = await nftInstance.grantMintRole(args.to);
    await waitForTx(args.provider, tx1.hash);

    //   await waitForTx(args.provider, tx.hash)
  });

const NFTCmd = new Command("NFT");
NFTCmd.addCommand(depositNft);
NFTCmd.addCommand(mintNft);
NFTCmd.addCommand(setTokenUri);
NFTCmd.addCommand(setBaseUri);
NFTCmd.addCommand(queryTokenUri);
NFTCmd.addCommand(mintBatchNft);
NFTCmd.addCommand(transferNft);
NFTCmd.addCommand(SynthesisNft);
NFTCmd.addCommand(queryAllNft);
NFTCmd.addCommand(grantMintRole);
NFTCmd.addCommand(withdraw);

module.exports = NFTCmd;
