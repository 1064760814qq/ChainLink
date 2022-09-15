// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";


contract FreeCity721 is
    Initializable,
    OwnableUpgradeable,
    ERC721EnumerableUpgradeable
{   
    using  Strings for uint256;
    uint256 public curblindBoxIndex;
    uint256 public blindBoxTotal;
        

    string private _baseBlindUri;

    mapping (uint256 => string) private _tokenURIs;

    address private openSea;
    address public FreeCity;

    bool public  _openBlind;


    function initialize(string memory name, string memory symbol,string memory blindBaseUri)
        public
        virtual
        initializer
    {
        __Ownable_init();
        __ERC721_init_unchained(name, symbol);
        setBlindBaseURI(blindBaseUri);
    }



    modifier onlyFreeCity() {
        _onlyFreeCity();
        _;
    }

    function _onlyFreeCity() private view{
        require(msg.sender == FreeCity, "sender must be bridge contract");
    }

    // function setBlindBoxTotal(uint256 _blindBoxTotal)external onlyOwner {
    //     blindBoxTotal = _blindBoxTotal;
    // }

    function openBlindSwitch() public onlyOwner {
        _openBlind = true;
    }

    function setFreeCity(address _freeCity) external onlyOwner {
        FreeCity = _freeCity;
    }



    function burn(uint256 tokenId) public  {
        super._burn(tokenId);
    }

    function tokensOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function mint(address to, uint tokenid,string memory tokenUri)  public onlyFreeCity(){
        _mint(to,tokenid);

        blindBoxTotal++;

        if(_openBlind){
        _tokenURIs[tokenid] = tokenUri;
        }
    }


     function openBlindBox(string memory _tokenUrl)
        external
        onlyOwner()
    {
        openBlindSwitch();
        uint end;
        if (blindBoxTotal <= 100) {
            end = blindBoxTotal;
        } else if (curblindBoxIndex + 100 > blindBoxTotal) {
            end = blindBoxTotal;
        } else {
            end = curblindBoxIndex + 100;
        }
        for (uint256 i = curblindBoxIndex; i < end; i++) {
            _tokenURIs[i] = string(abi.encodePacked(_tokenUrl));
        }
        curblindBoxIndex = end;
    }

    function updateTokenUri(uint256 tokenId, string memory _tokenUrl)
        external
        onlyOwner()
    {
        require(_exists(tokenId));
        _tokenURIs[tokenId] = _tokenUrl;
    }

    function setBlindBaseURI(string memory blindUri) public onlyOwner {
        _baseBlindUri = blindUri;
    }

    function tokenURI(uint256 tokenId) public view  override returns (string memory) {
        require(_exists(tokenId));

        if(!_openBlind) {
            return _baseBlindUri;
        }

        string memory baseURI = _tokenURIs[tokenId];
        return string(abi.encodePacked(baseURI, (tokenId.toString()),".json"));
     }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            ERC721EnumerableUpgradeable
        )
        returns (bool)
    {
        return
            interfaceId == type(IERC721EnumerableUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function setOpenSea(address _openSea)
        external
        onlyOwner
    {
        openSea = _openSea;
    }


    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override(ERC721Upgradeable, IERC721Upgradeable)
        returns (bool isOperator)
    {
        // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        // for Polygon's Mumbai testnet, use 0xff7Ca10aF37178BdD056628eF42fD7F799fAc77c
        if (openSea != address(0) && _operator == openSea) {
            return true;
        }
        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721Upgradeable.isApprovedForAll(_owner, _operator);
    }



    
}

