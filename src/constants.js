module.exports.NFT_MINT_ADDRESS = "0x9AEd59261BdF0Aa334F1790881176c7F962D4337";
module.exports.ADMIN = "0x9AEd59261BdF0Aa334F1790881176c7F962D4337";
module.exports.NFT_PRIVATE_KEY =
  "0x60936fbda7fbe784c08e8c83a75b20235ac75699dedfb461f6c4c8c86b2d76f2";

module.exports.FCC_CONTRACT = "0xDA646fB88a6B49577BC091D6aA272acA27563A25";
module.exports.FCR_CONTRACT = "0x2d1867B43aD5909df470de139b1b3D908CfdB030";
module.exports.USDT_CONTRACT = "0x183495240bA5f24a2E4d8c130a3C5b40bAb6c9A4";
module.exports.NFT_CONTRACT_ADDRESS =
  "0x8266F2DE6e0672471267A8d864fdB6Ce5fE203a6";
module.exports.ERC20_CONTRACT_ADDRESS =
  "0xD4e6EA5fA471f6EA43ce9Fdd8F1632ffAD54f52F";

module.exports.NFT_1155_ADDRESS = "0x4ED554E4b507eF8bf8E32Cc8738dab6c225CE6B0";
// module.exports.URL = "https://rpc-mumbai.maticvigil.com";
module.exports.URL =
  "https://goerli.infura.io/v3/ff2efa316ea244268597e5eae99a4b3d";
module.exports.NETWORK_ID = 5;
module.exports.ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
module.exports.DEFAULT_MINT_TO = "0x9AEd59261BdF0Aa334F1790881176c7F962D4337";

const CONTRACT_PATH = "../artifacts/contracts";
const ContractABIs = {
  NFT: require(CONTRACT_PATH + "/FreeCityGame.sol/FreeCityGame.json"),
  ERC20: require(CONTRACT_PATH + "/VoiceERC20.sol/VoiceERC20.json"),
  N1155: require(CONTRACT_PATH + "/VoiceBenefitCard.sol/VoiceBenefitCard.json"),
};

module.exports.ContractABIs = ContractABIs;
