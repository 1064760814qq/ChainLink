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
  .description("MINT NFT")
  .option(
    "--contract <address>",
    "NFT1155 contract address",
    constants.NFT_1155_ADDRESS,
  )
  .option("--url <value>", "URL to connect to", constants.URL)
  .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
  .option("--id <number>", "tokenId", 2)
  .option("--to <address>", "addr", '0xF94e4af78b3f222fa0F8Be0F47b6Ec6960866E0b')
  .action(async function (args) {
    console.log(args)
    await setupParentArgs(args, args);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.N1155.abi,
      args.wallet
    );

    const tx1 = await nftInstance.mint(
        args.to,
        args.id
      );
    await waitForTx(args.provider, tx1.hash);
    const uri = await nftInstance.tokenURI(args.id);
    console.log("---", uri);

  });


const setEveryNftMintPrice = new Command("set-price")
        .description("Set sale price")
        .option(
          "--contract <address>",
          "NFT1155 contract address",
          constants.NFT_1155_ADDRESS
        )
        .option("--url <value>", "URL to connect to", constants.URL)
        .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
        .option("--price <number>", "price", [200,190,180,170,160,150])
        .action(async function (args) {
          await setupParentArgs(args, args);

          const nftInstance = new ethers.Contract(
            args.contract,
            constants.ContractABIs.N1155.abi,
            args.wallet
          );


          const setNftMintPrice = await nftInstance.setEveryNftMintPrice(args.price);
          await waitForTx(args.provider, setNftMintPrice.hash);
          const mintPrice       = await nftInstance.getMintPrice(constants.ACCOUNT);
          console.log("---mintPrice:", mintPrice);
          });


const setTotal = new Command("set-total")
        .description("Set Total Supply")
        .option(
          "--contract <address>",
          "NFT1155 contract address",
          constants.NFT_1155_ADDRESS
        )
        .option("--url <value>", "URL to connect to", constants.URL)
        .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
        .option("--total <number>", "totalSupply", 2000)
        .action(async function (args) {
          await setupParentArgs(args, args);

          const nftInstance = new ethers.Contract(
            args.contract,
            constants.ContractABIs.N1155.abi,
            args.wallet
          );


          const setTotalSupply = await nftInstance.setTotalSupply(
            args.total,
          );
          await waitForTx(args.provider, setTotalSupply.hash);
          const totalSupply = await nftInstance.totalSupply();
          console.log("---totalSupply:", totalSupply);

          });

  
const setFreeCityContract = new Command("set-free-city")
    .description("Set FreeCity Contract")
    .option(
      "--contract <address>",
      "NFT1155 contract address",
      constants.NFT_1155_ADDRESS
    )
    .option("--url <value>", "URL to connect to", constants.URL)
    .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
    .option("--total <number>", "totalSupply", 2000)
    .action(async function (args) {
      await setupParentArgs(args, args);
  
      const nftInstance = new ethers.Contract(
        args.contract,
        constants.ContractABIs.N1155.abi,
        args.wallet
      );
  
  
      const setTotalSupply = await nftInstance.setFreeCityContract(
        args.total,
      );
      await waitForTx(args.provider, setTotalSupply.hash);
      });



const pushArr = new Command("push-arr")
      .description("push random arr")
      .option(
        "--contract <address>",
        "NFT1155 contract address",
        constants.NFT_1155_ADDRESS
      )
      .option("--url <value>", "URL to connect to", constants.URL)
      .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
      .option("--arr [number]", "Random Arr", [1,2,1,1,2,1,1])
      .action(async function (args) {
        await setupParentArgs(args, args);
    
        const nftInstance = new ethers.Contract(
          args.contract,
          constants.ContractABIs.N1155.abi,
          args.wallet
        );
    
    
        const pushArr = await nftInstance.pushArr(
          args.arr,
        );
        await waitForTx(args.provider, pushArr.hash);
        const Arr2 = await nftInstance.getArr(2);
        console.log("---Arr2:", Arr2)
        });


const withDraw = new Command("withDraw")
        .description("withDraw Funds")
        .option(
          "--contract <address>",
          "NFT1155 contract address",
          constants.NFT_1155_ADDRESS
        )
        .option("--url <value>", "URL to connect to", constants.URL)
        .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
        .option("--to <address>", "withDraw Arr", constants.ACCOUNT)
        .action(async function (args) {
          await setupParentArgs(args, args);
      
          const nftInstance = new ethers.Contract(
            args.contract,
            constants.ContractABIs.N1155.abi,
            args.wallet
          );
      
      
          const withDraw = await nftInstance.withDraw(
            args.to,
          );
          await waitForTx(args.provider, withDraw.hash);
      
          });



const setOpenSea = new Command("set-opensea")
          .description("set OpenSea")
          .option(
            "--contract <address>",
            "NFT1155 contract address",
            constants.NFT_1155_ADDRESS
          )
          .option("--url <value>", "URL to connect to", constants.URL)
          .option("--privateKey <value>","Private key to use",constants.NFT_PRIVATE_KEY)
          .option("--to <address>", "set opensea", '0x00')
          .action(async function (args) {
            await setupParentArgs(args, args);
        
            const nftInstance = new ethers.Contract(
              args.contract,
              constants.ContractABIs.N1155.abi,
              args.wallet
            );
        
        
            const setOpenSea = await nftInstance.setOpenSea(
              args.to,
            );
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
