// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/presets/ERC1155PresetMinterPauserUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface FreeCity{
function preMint(address to,  uint256 quality) external;

}

contract VoiceBenefitCard is OwnableUpgradeable,ERC1155PresetMinterPauserUpgradeable{

    using ECDSAUpgradeable for bytes32;
    address private openSea;

     
    mapping(address=>uint256)  ownTokenId;

    address private freeCity;
    
    mapping(address => uint256) public mintTotal;

    mapping(uint256=>string) tokenMapUri;

    uint256[5] private mintPrice;

    event PreMint(address,uint256,uint256);

    function init() public  initializer  {
                super.initialize("");
                 __Ownable_init();
           tokenMapUri[1]="https://vio.infura-ipfs.io/ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/N.png";
           tokenMapUri[2]="https://vio.infura-ipfs.io/ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/R.png";
           tokenMapUri[3]="https://vio.infura-ipfs.io/ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/SR.png";
           tokenMapUri[4]="https://vio.infura-ipfs.io/ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/SSR.png";
           tokenMapUri[5]="https://vio.infura-ipfs.io/ipfs/Qmf1JQ9yN71haWAmg3Abyz2emD3Dpp7ZEwL9eTqzoJq26A/UR.png";
    }

    function airdrop(address to, uint256 id,bytes32 _hash,uint8 v,bytes32 r,bytes32 s)public {
        require(keccak256(abi.encode(to,id))==_hash,"n1");
        require(ecrecover(_hash, v, r, s)==owner(),"n2");
        require(id > 0 && id < 6,"n3");
        require(ownTokenId[to]==0,"n4");
         _mint(to, id, 1, "");
         ownTokenId[to]=id;
    }   

    function isApprovedToMint(bytes32 _hash, bytes memory signature) internal view returns (bool) {
       (address recovered, ECDSAUpgradeable.RecoverError error) = ECDSAUpgradeable.tryRecover(_hash, signature);
        return error == ECDSAUpgradeable.RecoverError.NoError && recovered == owner();
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override  onlyOwner() {
             require(id > 0 && id < 6,"id error");
             require(ownTokenId[to]==0,"only an card");
             super.mint(to, id, 1, "");
              ownTokenId[to]=id;
    }

    function tokenURI(uint256 id) public view  returns(string memory){
        return tokenMapUri[id];
    }

    function setFreeCityContract(address _freeCity) public onlyOwner(){ 
       freeCity = _freeCity;
    }

    function getFreeCityContract() view external returns(address) {
      return freeCity;
    }

    function setEveryNftMintPrice(uint256[5] memory mintPrices) external onlyOwner(){
        for (uint256 i = 0; i < mintPrices.length; i++) {
            mintPrice[i] = mintPrices[i];
        }
    }

    function setSingleNftMintPrice(uint256 id,uint256 mintSinglePrice) external onlyOwner(){
        require(id > 0 && id < 6,"id error");
        mintPrice[id-1] = mintSinglePrice;
    }

    function  getMintPrice() external view returns(uint256[5] memory ){
          return mintPrice;
    }


  function preSale(uint256 tokenId) public payable{
      require(ownTokenId[msg.sender]>0 && balanceOf(msg.sender, ownTokenId[msg.sender])>0,"only an card");
      require(msg.value == mintPrice[tokenId-1],"not  sufficient amount");
      require(mintTotal[msg.sender]+1 <= uint8(5),"Exceeded times");
       FreeCity(freeCity).preMint(msg.sender,ownTokenId[msg.sender]);
       mintTotal[msg.sender] = mintTotal[msg.sender]+1;
       emit PreMint(msg.sender,tokenId,ownTokenId[msg.sender]);
    }
    
    function withDraw(address to) public onlyOwner(){
        payable(to).transfer(address(this).balance);
    }


    function setOpenSea(address _openSea)
        external
        onlyOwner()
    {
        openSea = _openSea;
    }

    function getOpenSea() public view returns (address) {
        return openSea;
    }

    /**
     * Override isApprovedForAll to auto-approve OS's proxy contract
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override(ERC1155Upgradeable)
        returns (bool isOperator)
    {
        // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        // for Polygon's Mumbai testnet, use 0xff7Ca10aF37178BdD056628eF42fD7F799fAc77c
        if (openSea != address(0) && _operator == openSea) {
            return true;
        }
        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC1155Upgradeable.isApprovedForAll(_owner, _operator);
    }

}
