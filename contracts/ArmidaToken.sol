// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Armida Collector Token
 * @dev Special edition tokens for collectors, machines, and AI agents.
 * Unique capability: Storage of high-entropy quantum-encrypted chain keys.
 */
contract ArmidaToken is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct EncryptedKey {
        string payload;
        string iv;
        string tag;
        string protocol;
    }

    // Mapping from tokenId to its quantum-encrypted chain key
    mapping(uint256 => EncryptedKey) private _encryptedKeys;

    event KeyStored(uint256 indexed tokenId, string protocol);

    constructor(address initialOwner) 
        ERC721("Armida Collector", "ARMIDA") 
        Ownable(initialOwner)
    {}

    /**
     * @dev Mints a new Armida token with an optional encrypted key.
     */
    function safeMint(
        address to, 
        string memory uri,
        string memory payload,
        string memory iv,
        string memory tag,
        string memory protocol
    ) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        if (bytes(payload).length > 0) {
            _encryptedKeys[tokenId] = EncryptedKey(payload, iv, tag, protocol);
            emit KeyStored(tokenId, protocol);
        }
    }

    /**
     * @dev Retrieves the encrypted key associated with a token.
     * Only the token owner or the contract owner can access this metadata.
     */
    function getEncryptedKey(uint256 tokenId) public view returns (EncryptedKey memory) {
        require(ownerOf(tokenId) == msg.sender || owner() == msg.sender, "Caller is not owner nor approved");
        return _encryptedKeys[tokenId];
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
