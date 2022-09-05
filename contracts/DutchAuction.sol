// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenid
    ) external ;

}


contract DutchAuction {

    IERC721 public immutable nft;

    address public immutable seller;
    uint private constant DURATION = 7 days;
    uint public immutable tokenid;
    uint public immutable startingPrice;
    uint public immutable startAt;
    uint public immutable expiresAt;
    uint public immutable discountRate;

    constructor(
        address _seller,
        address _nftContract,
        uint _startingPrice,
        uint _discountRate,
        uint _tokenid
    ) {
        seller = payable(_seller);
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;

        require(_startingPrice >= _discountRate * DURATION, "starting price error");

        nft = IERC721(_nftContract);
        tokenid = _tokenid;
    }

    function getPrice() public view returns(uint){
        uint timeElapsed = block.timestamp - startAt;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy() external payable {
        require(block.timestamp < expiresAt,"auction expired");
        uint price = getPrice();
        require(msg.value >= price, "value error");

        nft.transferFrom(seller,msg.sender,tokenid);
        uint refund = msg.value - price;
        if(refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(payable(seller));
    }   

}
