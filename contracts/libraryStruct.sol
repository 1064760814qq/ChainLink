// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library EnumerableSet {



    struct VoiceAttr {
        uint128 life;
        uint128 grade;
        uint256 parent;
        uint256 quality;
        uint256 mother;
        address creator;
        string tokenURI;
    }

      struct Claim {
        address to;
        uint256 tokenId;
        uint256 end;
    }



}