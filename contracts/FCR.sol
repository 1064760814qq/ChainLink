// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";


contract FCR is
    Initializable,
    ContextUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");



    function initialize(string memory name, string memory symbol)
        public
        virtual
        initializer
    {

        __ERC20_init(name,symbol);
        __ERC20Pausable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());

    }

    event Withdraw(address user, uint256 amount);


    receive() external payable {}


    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
        emit Withdraw(msg.sender,(address(this).balance));
    }

    function withdrawToken(IERC20Upgradeable token) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Withdraw(msg.sender,token.balanceOf(address(this)));
    }

    function burn(uint256 amount) public override(ERC20BurnableUpgradeable) {
        super._burn(_msgSender(), amount);
    }

    function grantMintRole(address to) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "n1");
        _grantRole(MINTER_ROLE, to);
    }



    function BatchTransfer(address[] memory accounts, uint256[] memory amounts)
        public
        onlyRole(MINTER_ROLE)
        nonReentrant
    {
        require(accounts.length == amounts.length,"length is invalid");
        for (uint256 index = 0; index < accounts.length; index++) {
            super._transfer(address(this), accounts[index],amounts[index]);
        }
    }

    function BatchMint(address[] memory accounts, uint256[] memory amounts)
        public
        onlyRole(MINTER_ROLE)
        nonReentrant
    {
        require(accounts.length == amounts.length,"length is invalid");
        for (uint256 index = 0; index < accounts.length; index++) {
            super._mint(accounts[index],amounts[index]);
        }
    }


    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    )
        internal
        override(
            ERC20Upgradeable,
            ERC20PausableUpgradeable
        )
    {
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
