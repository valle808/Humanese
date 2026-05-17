// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title ValleToken
 * @dev ERC-20 Smart Contract for the OMEGA Ecosystem (Humanese)
 * Fixed total supply of 100,000,000 tokens minted to the deployer at genesis.
 * Burnable to allow for deflationary supply mechanics.
 */
contract ValleToken is ERC20, ERC20Burnable {
    constructor() ERC20("VALLE", "VALLE") {
        // Mint 100 million tokens (with 18 decimal places)
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }
}
