const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx } = require("./utils");
const key = process.env.key;

const mintNft = new Command("mint-nft")
  .description("MINT NFT")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--id <number>", "tokenId", 2)
  .option(
    "--to <address>",
    "addr",
    "0xF94e4af78b3f222fa0F8Be0F47b6Ec6960866E0b"
  )
  .action(async function (args) {
    console.log(args);
    await setupParentArgs(args, args);
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
const setEveryNftMintPrice = new Command("set-price")
  .description("Set sale price")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--price <number>", "price", [200, 190, 180, 170, 160, 150])
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const setNftMintPrice = await nftInstance.setEveryNftMintPrice(args.price);
    await waitForTx(args.provider, setNftMintPrice.hash);
    const mintPrice = await nftInstance.getMintPrice(constants.ACCOUNT);
    console.log("---mintPrice:", mintPrice);
  });

const setTotal = new Command("set-total")
  .description("Set Total Supply")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--total <number>", "totalSupply", 2000)
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const setTotalSupply = await nftInstance.setTotalSupply(args.total);
    await waitForTx(args.provider, setTotalSupply.hash);
    const totalSupply = await nftInstance.totalSupply();
    console.log("---totalSupply:", totalSupply);
  });

const setFreeCityContract = new Command("set-free-city")
  .description("Set FreeCity Contract")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--total <number>", "totalSupply", 2000)
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const setTotalSupply = await nftInstance.setFreeCityContract(args.total);
    await waitForTx(args.provider, setTotalSupply.hash);
  });

const pushArr = new Command("push-arr")
  .description("push random arr")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--arr [number]", "Random Arr", [1, 2, 1, 1, 2, 1, 1])
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const pushArr = await nftInstance.pushArr(args.arr);
    await waitForTx(args.provider, pushArr.hash);
    const Arr2 = await nftInstance.getArr(2);
    console.log("---Arr2:", Arr2);
  });

const withDraw = new Command("withDraw")
  .description("withDraw Funds")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--to <address>", "withDraw Arr", constants.ACCOUNT)
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const withDraw = await nftInstance.withDraw(args.to);
    await waitForTx(args.provider, withDraw.hash);
  });

const setOpenSea = new Command("set-opensea")
  .description("set OpenSea")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants[key].NFT_1155_ADDRESS
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].NFT_PRIVATE_KEY
  )
  .option("--to <address>", "set opensea", "0x00")
  .action(async function (args) {
    await setupParentArgs(args, args);

    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const setOpenSea = await nftInstance.setOpenSea(args.to);
    await waitForTx(args.provider, setOpenSea.hash);
  });

const adminCmd = new Command("NNFT");
adminCmd.addCommand(mintNft);
adminCmd.addCommand(setEveryNftMintPrice);
adminCmd.addCommand(setTotal);
adminCmd.addCommand(setFreeCityContract);
adminCmd.addCommand(pushArr);
adminCmd.addCommand(withDraw);
adminCmd.addCommand(setOpenSea);

module.exports = adminCmd;
