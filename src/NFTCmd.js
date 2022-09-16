const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx } = require("./utils");
require("dotenv").config();
// const key = process.env.key;
const key = "test2";
const meta = require("./meta.json");
const uri =
  "https://ipfs.gamehualing.com/ipns/k51qzi5uqu5dm0deqirwcqma122cvhsmowf3yyks5acxscmg6t1nrxslo5jgrf/";

// eslint-disable-next-line no-unused-vars
// const generateMeta = function (level, quality, mintTimes, no, tokenId) {
//   meta.attributes.forEach((trait) => {
//     if (trait.trait_type === "level") {
//       trait.value = level;
//     } else if (trait.trait_type === "quality") {
//       trait.value = quality;
//     } else if (trait.trait_type === "mint times") {
//       trait.value = mintTimes;
//     } else if (trait.trait_type === "number") {
//       trait.value = no;
//     }
//   });
//   meta.image = uri + tokenId + ".json";
// };

// eslint-disable-next-line no-unused-vars
// const uploadIpfs = new Command("uploadIpfs");

const mintNft = new Command("mint-nft")
  .description("Mint 721 nft")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address", constants.DEFAULT_MINT_TO)
  .option("--q [number]", "quality", 1)
  .option(
    "--uri <value>",
    "uri",
    "https://vio.infura-ipfs.io/ipfs/QmUfd8dzupN5GNP8d7ijfDe37Ep5ZKGHZ3RQDBJbqz4iP4/1.json"
  )
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---before mint", tx.toString());

    const tx1 = await nftInstance["mint(address,uint256,string)"](
      args.to,
      args.q,
      args.uri
    );
    await waitForTx(args.provider, tx1.hash);

    const tx2 = await nftInstance.balanceOf(args.to);
    console.log("---after mint", tx2);
  });

const SynthesisNft = new Command("synthesis-nft")
  .description("synthesis nft ")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--p <number>", "parent", 1)
  .option("--m <number>", "mother", 2)
  .option("--q <value>", "quality", 1)
  .option("--to <address>", "address", constants.DEFAULT_MINT_TO)
  .option("--uri <value>", "uri", uri)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx2 = await nftInstance.balanceOf(args.to);
    console.log("---before synthesis", tx2);

    const tx1 = await nftInstance[
      "synthesis(uint256,uint256,uint256,address,string)"
    ](args.p, args.m, args.q, args.to, args.uri);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---after synthesis", tx);
  });

const mintBatchNft = new Command("mint-batch-nft")
  .description("mint-batch-nft")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .option("--end <number>", "tokenid", 20)
  .option("--to <address>", "address", constants[key].ADMIN)
  .option("--quality <number>", "quality", 1)
  .option("--uri <value>", "uri", uri)
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);
    let i = args.id * 1;
    while (i <= args.end * 1) {
      await (async function (i) {
        const tx1 = await nftInstance["mint(address,uint256,string)"](
          args.to,
          args.quality,
          args.uri + "/" + i + ".json"
        );
        await waitForTx(args.provider, tx1.hash);
      })(i);
      i++;
    }

    //   await waitForTx(args.provider, tx.hash)
  });

const setBlindBoxBaseUrl = new Command("set-blind-uri")
  .description("set blind uri")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--uri <value>", "uri")
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.contract} as a admin.`);

    const tx1 = await nftInstance.setBlindBoxBaseUrl(args.uri);
    await waitForTx(args.provider, tx1.hash);

    const uri = await nftInstance.tokenURI(args.id);
    console.log("---", uri);
    const tx = await nftInstance.balanceOf(constants.ADMIN, args.id);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const transferNft = new Command("transfer")
  .description("transfer")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id [number]", "id", 1)
  .option("--to [address]", "to", "")
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.contract} as a admin.`);

    console.log("---before transfer ");
    const tx1 = await nftInstance.transfer(args.to, args.id);
    await waitForTx(args.provider, tx1.hash);
    console.log("---transfer success");
    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
  });

const burnNft = new Command("burn-nft")
  .description("burn nft ")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--start [number]", "start", 1)
  .option("--end  [number]", "end", 70)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    console.log("burn start", args.start, args.end);
    let i = args.start * 1;
    while (i <= args.end * 1) {
      await (async function (i) {
        const tx1 = await nftInstance.burn(i);
        await waitForTx(args.provider, tx1.hash);
      })(i);
      i++;
      console.log("burn ", i);
    }

    //   await waitForTx(args.provider, tx.hash)
  });

const depositNft = new Command("deposit-nft")
  .description("deposit nft")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id [number]", "tokenid", 3)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.contract} as a admin.`);

    const tx1 = await nftInstance.deposit(args.id, 12321);
    console.log(tx1.hash.toString());
    await waitForTx(args.provider, tx1.hash);
  });

const queryTokenUri = new Command("query")
  .description("query token uri")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    const owner = await nftInstance.ownerOf(args.id);
    console.log(owner);

    const uri = await nftInstance.tokenURI(args.id);
    console.log("---", uri);

    const meta = await nftInstance.metaMutData(args.id);
    console.log("---", meta.toString());
  });

const withdraw = new Command("withdraw")
  .description("withdraw nft")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address", constants[key].ADMIN)
  .option("--id <number>", "tokenid", 1)
  .option("--life <number>", "life", 1)
  .option("--grade <number>", "grade", 1)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    const tx1 = await nftInstance["withdraw(address,uint256,uint128,uint128)"](
      args.to,
      args.id,
      args.life,
      args.grade
    );
    await waitForTx(args.provider, tx1.hash);
  });

const openBlindBox = new Command("open-blind-box")
  .description("open blind box")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--baseUri <value>", "baseUri")
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.admin} as a admin.`);

    const total = await nftInstance.totalSupply();
    let openTimes;
    total % 100 != 0
      ? (openTimes = total / 100 + 1)
      : (openTimes = total / 100);
    for (let i = 0; i < openTimes; i++) {
      const tx1 = await nftInstance.openBlindBox(args.baseUri);
      await waitForTx(args.provider, tx1.hash);
    }
  });

const queryTokensOfOwner = new Command("query-all")
  .description("query account's all nfts")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--owner <address>", "address", constants[key].ADMIN)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tokens = await nftInstance.tokensOfOwner(args.owner);
    console.log("---", tokens.toString());
  });

const hasMintRole = new Command("query-role")
  .description("query role ")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--owner <address>", "address", constants[key].ADMIN)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.admin} as a admin.`);

    const tokens = await nftInstance.hasRole(
      "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
      args.owner
    );

    console.log("---is hasMintRole?", tokens.toString());
  });

const grantMintRole = new Command("grant-mint-role")
  .description("grant mint role")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address", constants[key].ADMIN)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.admin} as a admin.`);

    const tx1 = await nftInstance.grantMintRole(args.to);
    await waitForTx(args.provider, tx1.hash);
  });

const startNewBlindBox = new Command("set-new-blind-box")
  .description("set new blind box")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--total <number>", "total", 2000)
  .option("--date <number>", "date", 30)
  .option(
    "--baseuri <value>",
    "baseUri",
    "https://ipfs.gamehualing.com/ipns/k51qzi5uqu5dm0deqirwcqma122cvhsmowf3yyks5acxscmg6t1nrxslo5jgrf/"
  )
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.startNewBlindBox(
      args.total,
      args.date,
      args.baseuri
    );
    await waitForTx(args.provider, tx1.hash);
  });

const setWhiteListAddress = new Command("set-wl")
  .description("grant mint role")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--to <address>", "NFT1155 contract", constants[key].NFT_1155_ADDRESS)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.setWhiteListAddress(args.to);
    await waitForTx(args.provider, tx1.hash);
  });

const updateBlindBox = new Command("update-total")
  .description("update total ")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--total <number>", "total", 3000)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.updateBlindBox(args.total);
    await waitForTx(args.provider, tx1.hash);
  });

const exchangeNft = new Command("exchange")
  .description("exchange ")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenId", 1)
  .option("--to <address>", "address", constants.DEFAULT_MINT_TO)
  .option("--life <number>", "life", 2)
  .option("--grade <number>", "grade", 1)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.admin} as a admin.`);
    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);

    const tx1 = await nftInstance["exchange(uint256,address,uint128,uint128)"](
      args.id,
      args.to,
      args.life,
      args.grade
    );
    await waitForTx(args.provider, tx1.hash);

    const tx2 = await nftInstance.balanceOf(args.to);
    console.log("---", tx2);
  });

const isStaking = new Command("is-staking")
  .description("isStaking")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "tokenid", 1)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.isStaking(args.id);
    console.log(tx1);
    // await waitForTx(args.provider, tx1.hash);
  });

const transferFromNFT = new Command("transfer-from")
  .description("transferFrom_")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--from <address>", "from_address", constants[key].ADMIN)
  .option("--to <address>", "to_address", constants[key].ADMIN)
  .option("--id <number>", "id", 1)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    // console.log(args.from,args.to,args.id)

    const tx1 = await nftInstance.transferFrom(args.from, args.to, args.id);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx.toString());
  });

const updateTokenUri = new Command("update-token-uri")
  .description("updateTokenUri")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "id", 1)
  .option("--tokenuri <value>", "tokenUri")
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.updateTokenUri(args.id, args.tokenuri);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.tokenURI(args.id);
    console.log("---", tx.toString());
  });

const updateMutData = new Command("update-Mut-data")
  .description("updateMutData")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--id <number>", "id", 1)
  .option("--life <number>", "life", 1)
  .option("--grade <number>", "grade", 1)
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.updateMutData(args.id, args.life, args.grade);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.metaMutData(args.id);
    console.log("---", tx.toString());
  });

const setOpenSea = new Command("set-openSea")
  .description("setOpenSea")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--openSea <address>", "openSea")
  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );

    const tx1 = await nftInstance.setOpenSea(args.openSea);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.getOpenSea();
    console.log("---", tx.toString());
  });

const safeTransferNft = new Command("safe-transfer")
  .description("safeTransferNft")
  .option("--url <value>", "URL to connect to", constants[key].URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "NFT contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--from <address>", "from", constants[key].ADMIN)
  .option("--to <address>", "to")
  .option("--id [number]", "id", 1)

  .action(async function (args) {
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.NFT.abi,
      args.wallet
    );
    // console.log(`Adding ${args.contract} as a admin.`);

    const tx1 = await nftInstance.safeTransferFrom(args.from, args.to, args.id);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
  });

const NFTCmd = new Command("NFT");
NFTCmd.addCommand(burnNft);
NFTCmd.addCommand(grantMintRole);
NFTCmd.addCommand(setWhiteListAddress);
NFTCmd.addCommand(startNewBlindBox);
NFTCmd.addCommand(openBlindBox);
NFTCmd.addCommand(updateBlindBox);
NFTCmd.addCommand(setBlindBoxBaseUrl);
NFTCmd.addCommand(mintNft);
NFTCmd.addCommand(SynthesisNft);
NFTCmd.addCommand(depositNft);
NFTCmd.addCommand(exchangeNft);
NFTCmd.addCommand(transferFromNFT);
NFTCmd.addCommand(isStaking);
NFTCmd.addCommand(transferNft);
NFTCmd.addCommand(safeTransferNft);
NFTCmd.addCommand(withdraw);
NFTCmd.addCommand(setOpenSea);
NFTCmd.addCommand(updateTokenUri);
NFTCmd.addCommand(updateMutData);
NFTCmd.addCommand(queryTokenUri);
NFTCmd.addCommand(queryTokensOfOwner);
NFTCmd.addCommand(mintBatchNft);
NFTCmd.addCommand(hasMintRole);

module.exports = NFTCmd;
