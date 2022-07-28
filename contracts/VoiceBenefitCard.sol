// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/presets/ERC1155PresetMinterPauserUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface FreeCity{
function preMint(address to,  uint256 tokenId, uint256 quality,string memory uri) external;

}

contract VoiceBenefitCard is OwnableUpgradeable,ERC1155PresetMinterPauserUpgradeable{

     // 用户拥有的tokenId,用户只能拥有一种类型的token
   mapping(address=>uint256)  ownTokenId;

   address private freeCity;
   uint256 private mintAmount;

   mapping(uint256=>string) tokenMapUri;

   event PreMint(address,uint256,uint256);

 function init() public  initializer  {
                super.initialize("");
                 __Ownable_init();
           tokenMapUri[1]="https://bafybeihxugw2qnzsqrr75tmrirjndisivytl6idqooqks6blbl2fbcrg34.ipfs.infura-ipfs.io/N.png";
           tokenMapUri[2]="https://bafybeihxugw2qnzsqrr75tmrirjndisivytl6idqooqks6blbl2fbcrg34.ipfs.infura-ipfs.io/R.png";
           tokenMapUri[3]="https://bafybeihxugw2qnzsqrr75tmrirjndisivytl6idqooqks6blbl2fbcrg34.ipfs.infura-ipfs.io/SR.png";
           tokenMapUri[4]="https://bafybeihxugw2qnzsqrr75tmrirjndisivytl6idqooqks6blbl2fbcrg34.ipfs.infura-ipfs.io/SSR.png";
           tokenMapUri[5]="https://bafybeihxugw2qnzsqrr75tmrirjndisivytl6idqooqks6blbl2fbcrg34.ipfs.infura-ipfs.io/UR.png";
    }

function mint(address to, uint256 id, bytes memory data) public  onlyOwner() {
          require(id > 0 && id < 6,"id error");
          require(ownTokenId[to]==0,"only an card");
          super.mint(to, id, 1, data);
          ownTokenId[to]=id;
}

    function uri(uint256 id) public view  override returns(string memory){
        return tokenMapUri[id];
    }

    function setMintAmount(uint256 _amount) external onlyOwner(){
          mintAmount =_amount;
    }

    function setFreeCityContract(address _freeCity) public onlyOwner(){ 
       freeCity = _freeCity;
    }

    function preSale(uint256 tokenId,string memory uri) public payable{
      require(ownTokenId[msg.sender]>0 && balanceOf(msg.sender, ownTokenId[msg.sender])>0,"only an card");
      require(msg.value == mintAmount,"not  sufficient amount");
       FreeCity(freeCity).preMint(msg.sender,tokenId, ownTokenId[msg.sender],uri);
       emit PreMint(msg.sender,tokenId,ownTokenId[msg.sender]);
    }
    function withDraw(address to) public onlyOwner(){
        payable(to).transfer(address(this).balance);
    }


}