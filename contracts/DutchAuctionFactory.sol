// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DutchAuctionV2.sol";

contract DutchAuctionFactory {
    address[] public auctionAddresses;
    address public admin;

    event AuctionCreated(
        address indexed _auctionAddress,
        address indexed _client
    );

    constructor(address _admin) {
        admin = _admin;
    }

    function createAuction(
        address _seller,
        address _nftContract,
        address _tokenContract,
        uint    _startingPrice,
        uint    _discountRate,
        uint    _tokenid,
        address _protocolFeeAddress,
        uint    _protocolFee
    ) external onlyAdmin returns (address) {
        DutchAuctionV2 auction = new DutchAuctionV2(
                _seller,
                _nftContract,
                _tokenContract,
                _startingPrice,
                _discountRate,
                _tokenid,
                _protocolFeeAddress,
                _protocolFee
        );

        auctionAddresses.push(address(auction));
        emit AuctionCreated(address(auction), _seller);
        return address(auction);
    }

    function getAuctions() external view returns (address[] memory) {
        return auctionAddresses;
    }

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can create");
        _;
    }
}