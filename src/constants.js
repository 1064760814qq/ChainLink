module.exports.NFT_MINT_ADDRESS = "0x9AEd59261BdF0Aa334F1790881176c7F962D4337";
module.exports.ADMIN = "0x9AEd59261BdF0Aa334F1790881176c7F962D4337";
module.exports.NFT_PRIVATE_KEY =
  "0x60936fbda7fbe784c08e8c83a75b20235ac75699dedfb461f6c4c8c86b2d76f2";

module.exports.NFT_CONTRACT_ADDRESS =
  "0xE0BDbb675Ad293C406Efc0cCd60248c5B9035825";
module.exports.ERC20_CONTRACT_ADDRESS =
  "0xD4e6EA5fA471f6EA43ce9Fdd8F1632ffAD54f52F";

module.exports.NFT_1155_ADDRESS = "0x0b0ad152139be709D06535aA9eDd152E561dE32D";
// module.exports.URL = "https://rpc-mumbai.maticvigil.com";
module.exports.URL =
  "https://rinkeby.infura.io/v3/ff2efa316ea244268597e5eae99a4b3d";
module.exports.NETWORK_ID = 4;
module.exports.ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
module.exports.DEFAULT_MINT_TO = "0x9AEd59261BdF0Aa334F1790881176c7F962D4337";

const CONTRACT_PATH = "../artifacts/contracts";
const ContractABIs = {
  NFT: require(CONTRACT_PATH + "/Voice721.sol/FreeCity.json"),
  ERC20: require(CONTRACT_PATH + "/VoiceERC20.sol/VoiceERC20.json"),
  N1155: require(CONTRACT_PATH + "/VoiceBenefitCard.sol/VoiceBenefitCard.json"),
};

module.exports.ContractABIs = ContractABIs;
