// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";

contract Usdt is ERC20PresetMinterPauserUpgradeable{
       function decimals() public view  override returns (uint8) {
        return 9;
    }

}