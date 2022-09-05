// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenid
    ) external ;

}

interface IERC20 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external ;

}




contract DutchAuctionV2 {

    IERC721 public immutable nft;
    IERC20  public immutable token;

    address public immutable seller;

    address public tokenContract;
    address public protocolFeeRecipient;
    uint    public protocolFee;

    uint    private constant DURATION = 7 days;
    uint    public immutable tokenid;
    uint    public immutable startingPrice;
    uint    public immutable startAt;
    uint    public immutable expiresAt;
    uint    public immutable discountRate;

    //设置卖方，nft合约地址，20代币合约地址，初始拍卖价格，折扣降低速率，图片id，手续费，接受手续费地址
    constructor(
        address _seller,
        address _nftContract,
        address _tokenContract,
        uint    _startingPrice,
        uint    _discountRate,
        uint    _tokenid,
        address _protocolFeeAddress,
        uint    _protocolFee
    ) {
        seller = payable(_seller);
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;

        require(_startingPrice >= _discountRate * DURATION, "starting price error");

        nft = IERC721(_nftContract);
        tokenContract = _tokenContract;
        token = IERC20(_tokenContract);
        tokenid = _tokenid;

        protocolFeeRecipient = _protocolFeeAddress;
        protocolFee = _protocolFee;
    }

    //获取价格
    function getPrice() public view returns(uint){
        uint timeElapsed = block.timestamp - startAt;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }
    //如果token地址为0地址，转主币，最后销毁把合约的所有value
    function buy() external payable {
        require(block.timestamp < expiresAt,"auction expired");
        uint price = getPrice();
        uint calculatedProtocolFee = protocolFee * price;
        uint sellerFee = price - calculatedProtocolFee;

        if (tokenContract == address(0)){

        require(msg.value >= price, "value error");
        payable(protocolFeeRecipient).transfer(calculatedProtocolFee);
        nft.transferFrom(seller,msg.sender,tokenid);
        uint refund = msg.value - price;


        if(refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        }
        else {
            token.transferFrom(msg.sender,seller,sellerFee);
            token.transferFrom(msg.sender,protocolFeeRecipient,calculatedProtocolFee);
            nft.transferFrom(seller,msg.sender,tokenid);
        }
        selfdestruct(payable(seller));
    }   

}
