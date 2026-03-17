// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Identity Registry
 * @dev A simplified identity registry for the VALLE ecosystem.
 * In a production ERC-3643 setup, this would interface with ONCHAINID.
 */
contract IdentityRegistry {
    address public owner;
    mapping(address => bool) public verifiedIdentities;

    event IdentityVerified(address indexed user);
    event IdentityRemoved(address indexed user);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function verifyIdentity(address _user) external onlyOwner {
        verifiedIdentities[_user] = true;
        emit IdentityVerified(_user);
    }

    function removeIdentity(address _user) external onlyOwner {
        verifiedIdentities[_user] = false;
        emit IdentityRemoved(_user);
    }

    function isVerified(address _user) external view returns (bool) {
        return verifiedIdentities[_user];
    }
}
