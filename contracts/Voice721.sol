// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";

contract FreeCity is
    Initializable,
    ContextUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC2981Upgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    //nft的属性
    // life 生命剩余值 挖矿次数
    // grade 等级
    // quality r s ssr

    struct VoiceAttr {
        uint128 life;
        uint128 grade;
        uint256 parent;
        uint256 quality;
        uint256 mother;
        address creator;
        string  tokenURI;
    }
    struct Claim {
        address to;
        uint256 tokenId;
        uint256 end;
    }
    uint256 public constant MAXMINTLIMIT = 8;
    uint256 public constant BLOCKCLAIN = 6171;
    //tokenId => token 属性
    mapping(uint256 => VoiceAttr) private voiceAttrs;

    mapping(uint256 => bool) private freeCityPool;

    mapping(uint256 => Claim) private claims;

    // tokenid =>hash

    mapping(uint256 => string) private _tokenURIs;
    //预售

    mapping(address=>VoiceAttr) private preSales;



    address private whilteAddress;

    uint256 public start;


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    event Despoit(address indexed, uint256);
    event Exchange(address, address, uint256);
    event Mint(address, address, uint256);
    event Synthesis(uint256 indexed, uint256, uint256);
    event Withdraw(address indexed, uint256);
    event Find(address, address indexed, uint256);

    function initialize(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) public virtual initializer {
        __Voice721_init(name, symbol, baseTokenURI);
        __ERC2981_init_unchained();
        __AccessControl_init_unchained();
    }

    string private _baseTokenURI;

    function __Voice721_init(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) internal onlyInitializing {
        __ERC721_init_unchained(name, symbol);
        ____Voice721_init_init_unchained(name, symbol, baseTokenURI);
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }

    function ____Voice721_init_init_unchained(
        string memory,
        string memory,
        string memory baseTokenURI
    ) internal onlyInitializing {
        _baseTokenURI = baseTokenURI;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function allOwner(uint256 parent, uint256 mother) internal returns (bool) {
        return
            _isApprovedOrOwner(_msgSender(), parent) &&
            _isApprovedOrOwner(_msgSender(), mother);
    }

    function grantMintRole(address to) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "n1");
        _grantRole(MINTER_ROLE, to);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function exist(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function setWhilteAddress(address first) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(start !=0,"n1");
        require(AddressUpgradeable.isContract(first),"n2");
        whilteAddress=first;
    }


 
   function preMint(address to,  uint256 tokenId, uint256 quality,string calldata tokenURI) public{
     require(msg.sender==whilteAddress,"n1" );
      _mint(to, tokenId);
        voiceAttrs[tokenId] = VoiceAttr(0, 0, 0, quality,0, _msgSender(),tokenURI);
   
   }
    //1010101010101010101
    /**
     *  tokenData 按照NFT属性生成tokenid和图片
     * 第一位 1-5 ,表示 品质
     * 后面每两位表示一个部位，总长度19位
     *
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 quality,
        string calldata tokenURI
    ) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "n2");
        // can be burned (destroyed), so we need a separate counter.
        _mint(to, tokenId);
        voiceAttrs[tokenId] = VoiceAttr(0, 0, 0, quality,0, _msgSender(),tokenURI);
    }

    function synthesis(
        uint256 parent,
        uint256 mother,
        uint256 tokenId,
        uint256 quality,
        address to,
        string calldata tokenURI
    ) public {
        require(freeCityPool[parent] && freeCityPool[mother], "n1");
        require(hasRole(MINTER_ROLE, _msgSender()), "n2");
        require(voiceAttrs[parent].life < MAXMINTLIMIT, "n3");
        require(voiceAttrs[mother].life < MAXMINTLIMIT, "n3");
        unchecked {
            voiceAttrs[mother].life = voiceAttrs[mother].life + 1;
            voiceAttrs[mother].life = voiceAttrs[mother].life + 1;
        }
        _mint(to, tokenId);
        voiceAttrs[tokenId] = VoiceAttr(0, 0, parent,quality, mother, _msgSender(),tokenURI);
        emit Synthesis(tokenId, parent, mother);
    }

    function despoit(uint256 tokenId) external nonReentrant {
        require(_exists(tokenId), "n1");
        require(freeCityPool[tokenId] == false, "n2");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "n3");
        freeCityPool[tokenId] = true;
        emit Despoit(_msgSender(), tokenId);
    }

    function exchange(
        uint256 tokenId,
        address to,
        uint128 life,
        uint128 grade
    ) external {
        require(hasRole(MINTER_ROLE, msg.sender), "n1");
        require(freeCityPool[tokenId] == true, "n2");
        _approve(msg.sender, tokenId);
        address owner = ERC721Upgradeable.ownerOf(tokenId);
        voiceAttrs[tokenId].life = life;
        voiceAttrs[tokenId].grade = grade;
        _transfer(msg.sender, to, tokenId);
        emit Exchange(owner, to, tokenId);
    }

    /**
     *  do not stake status
     */
    function transfer(address to, uint256 tokenId) external {
        require(freeCityPool[tokenId] == false, "n1");
        _transfer(msg.sender, to, tokenId);
    }

    function withdraw(address to, uint256 tokenId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_exists(tokenId), "nonexistent token");
        require(freeCityPool[tokenId] == true, "n1");
        require(claims[tokenId].end == 0, "n3");
        address owner = ERC721Upgradeable.ownerOf(tokenId);
        if (owner != to) {
            claims[tokenId] = Claim(to, tokenId, block.number + BLOCKCLAIN);
            emit Find(owner, to, tokenId);
        } else {
            freeCityPool[tokenId] = false;
            delete freeCityPool[tokenId];
            emit Withdraw(to, tokenId);
        }
    }

    function claim(uint256 tokenId) external {
        require(_exists(tokenId), "n1");
        require(claims[tokenId].end < block.number, "n2");
        require(claims[tokenId].to == _msgSender(), "n3");
        freeCityPool[tokenId] = false;
        delete freeCityPool[tokenId];
        emit Withdraw(claims[tokenId].to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory tokenURI)
    {
        require(_exists(tokenId), "nonexistent token");
        tokenURI = voiceAttrs[tokenId].tokenURI;
    }
    function updateMutData(
        uint256 tokenId,
        uint128 life,
        uint128 grade
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_exists(tokenId), "n1");
        voiceAttrs[tokenId].life = life;
        voiceAttrs[grade].life = grade;
    }

    function metaMutData(uint256 tokenId)
        public
        view
        returns (
            uint128 life,
            uint128 grade,
            string memory uri
        )
    {
        require(_exists(tokenId), "n1");
        return (
            voiceAttrs[tokenId].life,
            voiceAttrs[tokenId].grade,
            tokenURI(tokenId)
        );
    }

    /**
     * @notice Sets the royalty information that all ids in this contract will default to.
     *
     * Requirements:
     *
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator.
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**
     * @notice Sets the royalty information for a specific token id, overriding the global default.
     *
     * Requirements:
     *
     * - `tokenId` must be already minted.
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator.
     */
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            AccessControlEnumerableUpgradeable,
            ERC721EnumerableUpgradeable,
            ERC2981Upgradeable
        )
        returns (bool)
    {
        return
            interfaceId ==
            type(AccessControlEnumerableUpgradeable).interfaceId ||
            interfaceId == type(IERC721EnumerableUpgradeable).interfaceId ||
            interfaceId == type(ERC2981Upgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
        require(!paused(), "pause tx");
    }

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {}

    uint256[48] private __gap;
}
