// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "./Ownable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";
import "./libraryStruct.sol";


contract FreeCityGame_v2 is Ownable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    using EnumerableSet for EnumerableSet.VoiceAttr;
    
    using EnumerableSet for EnumerableSet.Claim;

    IERC721EnumerableUpgradeable private _FCG;

    mapping(uint256 => EnumerableSet.VoiceAttr) private voiceAttrs;

    mapping(uint256 => bool) private freeCityPool;

    mapping(uint256 => EnumerableSet.Claim) private claims;

    mapping(uint256 => address) private _owners;

    mapping(uint256 => string) private _tokenURIs;

    mapping(address => bool) public isAllowlistAddress;

    mapping(address => EnumerableSet.VoiceAttr) private preSales;

    mapping(uint256 => uint256) private blindBoxs;

    address private openSea;
    address private whilteAddress;
    address private FreeCityGame721;


    uint256 private blindBoxTotal;
    uint256 private blindBoxCurrentData;
    uint256 private blindBoxEndDay;
    uint256 private curblindBoxIndex;

    string  private blindBoxBaseUrl;
    string  private _baseTokenURI;

    bool private _openBlind;

    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    CountersUpgradeable.Counter private _tokenIdTracker;
    event Deposit(address indexed, uint256 indexed, uint256);
    event Exchange(address indexed, address indexed, uint256);
    event Mint(address indexed, address indexed, uint256);
    event Synthesis(uint256 indexed, uint256, uint256);
    event Withdraw(address indexed, uint256);
    event Open(uint256 indexed, uint256);
    event StartBlind(uint256 indexed, uint256 indexed, string);
    event BatchMint(uint256 indexed);

    function init(address FCG721Contract,uint256 total,uint256 date,string memory _baseUri,address _whilteAddress) public onlyOwner(){
        setToken(FCG721Contract);
        startNewBlindBox(total,date,_baseUri);
        setWhiteListAddress(_whilteAddress);
    }


    function setToken(address FCGContract) public onlyOwner() {
        FreeCityGame721 = FCGContract;
        _FCG = IERC721EnumerableUpgradeable(FCGContract);
    }


    function tokensOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = _FCG.balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = _FCG.tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }


    function mintData(address buyer, uint tokenId,string memory _tokenURI)
        internal
        pure
        returns(bytes memory)
    {
        return abi.encodeWithSignature("mint(address,uint256,string)", buyer, tokenId,_tokenURI);
    }

    function transferFromData(address buyer, address seller, uint tokenId)
        internal
        pure
        returns(bytes memory)
    {
        return abi.encodeWithSignature("transferFrom(address,address,uint256)", seller, buyer, tokenId);
    }
    

    function callExecute(address dest,bytes memory data)
    internal
    returns (bool result)
    {
        bytes memory tmp;
        (result, tmp) = dest.call(data);
        return result;
    }


    function allowlistAddresses(address[] calldata wAddresses)
        external
        onlyOwner()
    {
        for (uint256 i = 0; i < wAddresses.length; i++) {
            isAllowlistAddress[wAddresses[i]] = true;
        }
    }

    function _baseURI() internal view   returns (string memory) {
        return _baseTokenURI;
    }

    function setWhiteListAddress(address first)
        public
        onlyOwner()
    {
        require(blindBoxEndDay != 0);
        whilteAddress = first;
    }

    function startNewBlindBox(
        uint256 total,
        uint256 date,
        string memory _baseUri
    ) public onlyOwner() {
        blindBoxTotal = total;
        blindBoxCurrentData = 0;
        blindBoxEndDay = block.timestamp + date * 86400; 
        blindBoxBaseUrl = _baseUri;
        emit StartBlind(blindBoxTotal, blindBoxEndDay, blindBoxBaseUrl);
    }

    function openBlindBox(string memory _tokenUrl)
        public
        onlyOwner()
    {
        uint256 end;
        if (blindBoxTotal <= 100) {
            end = blindBoxTotal;
        } else if (curblindBoxIndex + 100 > blindBoxTotal) {
            end = blindBoxTotal;
        } else {
            end = curblindBoxIndex + 100;

        for (uint256 i = curblindBoxIndex; i < end; i++) {
            voiceAttrs[blindBoxs[i]].tokenURI = string(
                abi.encodePacked(_tokenUrl, "/", blindBoxs[i], ".json")
            );
        }
        curblindBoxIndex = end;
        emit Open(curblindBoxIndex, blindBoxTotal);
    }
    }

    function batchOpenBlindBox(string memory _tokenUrl)
        external
        onlyOwner()
    {
        if(!_openBlind){
            _openBlind = !_openBlind;
        }
        uint256 end;
        uint tokenid_end = _tokenIdTracker.current();
        if (tokenid_end <= 100) {
            end = tokenid_end;
        } else if (curblindBoxIndex + 100 > tokenid_end) {
            end = tokenid_end;
        } else {
            end = curblindBoxIndex + 100;
        }
        for (uint256 i = curblindBoxIndex; i < end; i++) {
            voiceAttrs[blindBoxs[i]].tokenURI = string(
                abi.encodePacked(_tokenUrl, "/", blindBoxs[i], ".json")
            );

        }
        curblindBoxIndex = end;
        emit Open(curblindBoxIndex, tokenid_end);
    }

    function openAllBox(string memory _tokenUrl)
        external
        onlyOwner()
    {
        for (uint256 i = curblindBoxIndex; i < blindBoxTotal; i++) {
            voiceAttrs[blindBoxs[i]].tokenURI = string(
                abi.encodePacked(_tokenUrl, "/", blindBoxs[i], ".json")
            );
        }
        emit Open(curblindBoxIndex, blindBoxTotal);
    }

    function updateBlindBox(uint256 _blindBoxTotal)
        external
        onlyOwner()
    {
        blindBoxTotal = _blindBoxTotal;
    }



    function setFreeCityGame721(address _FreeCityGame721) external onlyOwner() {
        FreeCityGame721 = _FreeCityGame721;
    }

    function _executeMint(address _account,uint _tokenid,string memory _tokenURI) internal {
        bytes memory callData = mintData(_account,_tokenid,_tokenURI);
        require(callExecute(FreeCityGame721,callData),"er");
    }

    function _executeTransfer(address seller,address buyer,uint _tokenid) internal {
        bytes memory callData = transferFromData(seller,buyer,_tokenid);
        require(callExecute(FreeCityGame721,callData),"er");
    }


    function _exists(uint tokenId) public view returns(bool){
         return _owners[tokenId] != address(0);
    }


    function batchMint(address[] memory tos, uint256[] memory qualities)
        external
    {
        require(msg.sender == whilteAddress);
        require(
            blindBoxTotal > 0 && blindBoxCurrentData <= blindBoxTotal,
            "n2"
        );
        require(block.timestamp <= blindBoxEndDay);
        require(tos.length == qualities.length);
        for (uint256 i = 0; i < tos.length; i++) {
            uint256 count = _tokenIdTracker.current();
            _executeMint(tos[i], count,blindBoxBaseUrl);
            _owners[count] = tos[i];
            blindBoxCurrentData = blindBoxCurrentData + 1;
            blindBoxs[blindBoxCurrentData] = count;
            voiceAttrs[count] = EnumerableSet.VoiceAttr(
                0,
                0,
                0,
                qualities[i],
                0,
                _msgSender(),
                blindBoxBaseUrl
            );
            _tokenIdTracker.increment();
        }
        emit BatchMint(tos.length);
    }

    function preMint(address to, uint256 quality) external {
        require(msg.sender == whilteAddress);
        require(
            blindBoxTotal > 0 && blindBoxCurrentData <= blindBoxTotal,
            "n2"
        );
        require(block.timestamp <= blindBoxEndDay);
        uint tokenid = _tokenIdTracker.current();
        _executeMint(to, tokenid,blindBoxBaseUrl);
        _owners[tokenid] = to;
        blindBoxCurrentData = blindBoxCurrentData + 1;
        blindBoxs[blindBoxCurrentData] = _tokenIdTracker.current();
        voiceAttrs[_tokenIdTracker.current()] = EnumerableSet.VoiceAttr(
            0,
            0,
            0,
            quality,
            0,
            _msgSender(),
            blindBoxBaseUrl
        );
        _tokenIdTracker.increment();
    }

    function setBlindBoxBaseUrl(string memory _blindBoxBaseUri) external onlyOwner(){
        blindBoxBaseUrl = _blindBoxBaseUri;
    }

    function getBlindBoxBaseUrl() external view returns (string memory) {
        return blindBoxBaseUrl;
    }

    function blindBox(address to) external view {
        require(isAllowlistAddress[to]);
    }

    function mint(
        address to,
        uint256 quality,
        string calldata _tokenURI
    ) external onlyOwner(){
        _executeMint(to, _tokenIdTracker.current(),_tokenURI);
        _owners[_tokenIdTracker.current()] = to;
        voiceAttrs[_tokenIdTracker.current()] = EnumerableSet.VoiceAttr(
            0,
            0,
            0,
            quality,
            0,
            _msgSender(),
            _tokenURI
        );
        _tokenIdTracker.increment();
    }

    function synthesis(
        uint256 parent,
        uint256 mother,
        uint256 quality,
        address to,
        string calldata _tokenURI
    ) external onlyOwner(){
        require(freeCityPool[parent] && freeCityPool[mother]);
        require(voiceAttrs[parent].life < uint8(8));
        require(voiceAttrs[mother].life < uint8(8));
        unchecked {
            voiceAttrs[parent].life = voiceAttrs[parent].life + 1;
            voiceAttrs[mother].life = voiceAttrs[mother].life + 1;
        }
        uint256 id = _tokenIdTracker.current();
        _executeMint(to, id,_tokenURI);
        _owners[id] = to;
        voiceAttrs[id] = EnumerableSet.VoiceAttr(
            0,
            0,
            parent,
            quality,
            mother,
            _msgSender(),
            _tokenURI
        );
        freeCityPool[id] = true;
        _tokenIdTracker.increment();
        emit Synthesis(id, parent, mother);
    }

    function deposit(uint256 tokenId, uint256 userId) public  {
        require(_exists(tokenId));
        require(freeCityPool[tokenId] == false);
        // require(_FCG.isApprovedForAll(_msgSender(), address(this)));
        address owner = _FCG.ownerOf(tokenId);
        require(owner == msg.sender);
        freeCityPool[tokenId] = true;
        emit Deposit(_msgSender(), userId, tokenId);
    }

    function exchange(
        uint256 tokenId,
        address to,
        uint128 life,
        uint128 grade
    ) external onlyOwner(){
        require(freeCityPool[tokenId] == true);
        address owner = _FCG.ownerOf(tokenId);
        voiceAttrs[tokenId].life = life;
        voiceAttrs[tokenId].grade = grade;
        _executeTransfer(owner, to, tokenId);
        _owners[tokenId] = to;
        emit Exchange(owner, to, tokenId);
    }

    function isStaking(uint256 tokenId) external view returns (bool) {
        return freeCityPool[tokenId];
    }


    function transfer(address to, uint256 _tokenId) external {
        require(freeCityPool[_tokenId] == false);
        _executeTransfer(msg.sender, to, _tokenId);
        _owners[_tokenId] = to;
    }

    function withdraw(
        address to,
        uint256 tokenId,
        uint128 life,
        uint128 grade
    ) external onlyOwner() {
        require(_exists(tokenId));
        require(freeCityPool[tokenId] == true);
        voiceAttrs[tokenId].life = life;
        voiceAttrs[tokenId].grade = grade;
        address owner = _FCG.ownerOf(tokenId);
        if (owner != to) {
            _executeTransfer(owner, to, tokenId);
            _owners[tokenId] = to;
        }
        freeCityPool[tokenId] = false;
        delete freeCityPool[tokenId];
        emit Withdraw(to, tokenId);
    }

    function setOpenSea(address _openSea)
        external
        onlyOwner()
    {
        openSea = _openSea;
    }

    function getOpenSea() external view returns (address) {
        return openSea;
    }

    function claim(uint256 tokenId) external {
        require(_exists(tokenId));
        require(claims[tokenId].end < block.number);
        require(claims[tokenId].to == _msgSender());
        delete freeCityPool[tokenId];
        emit Withdraw(claims[tokenId].to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        require(_exists(tokenId));
        if(!_openBlind){
            return blindBoxBaseUrl;
        }
        else return voiceAttrs[tokenId].tokenURI;
    }

    function updateTokenUri(uint256 tokenId, string memory _tokenUrl)
        external
        onlyOwner()
    {
        require(_exists(tokenId));
        voiceAttrs[tokenId].tokenURI = _tokenUrl;
    }

    function updateMutData(
        uint256 tokenId,
        uint128 life,
        uint128 grade
    ) external onlyOwner() {
        require(_exists(tokenId), "n1");
        voiceAttrs[tokenId].life = life;
        voiceAttrs[grade].life = grade;
    }

    function metaMutData(uint256 _tokenId)
        external
        view
        returns (
            uint128 life,
            uint128 grade,
            bool status,
            string memory uri
        )
    {
        require(_exists(_tokenId), "n1");
        return (
            voiceAttrs[_tokenId].life,
            voiceAttrs[_tokenId].grade,
            freeCityPool[_tokenId],
            tokenURI(_tokenId)
        );
    }

    function getParents(uint256 _tokenId)
        public
        view
        returns (uint256, uint256)
    {
        return (voiceAttrs[_tokenId].parent, voiceAttrs[_tokenId].mother);
    }





    

    
}

