// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Clones - ERC-721 NFT for user clones
/// @notice Only the Factory contract can mint new clones
contract Clones is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    address public minter;
    mapping(uint256 => string) private _tokenCIDs;

    event MinterChanged(address indexed newMinter);
    event CloneMinted(address indexed to, uint256 indexed tokenId, string metadataCID);

    modifier onlyMinter() {
        require(msg.sender == minter, "Only the authorized minter can mint");
        _;
    }

    constructor() ERC721("Clones", "CLON") {}

    /// @notice Sets the minter address (Factory)
    /// @param _minter Address of the Factory contract
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Minter cannot be address(0)");
        minter = _minter;
        emit MinterChanged(_minter);
    }

    /// @notice Mints a new clone NFT
    /// @param to Address that will receive the clone
    /// @param metadataCID CID of the metadata in IPFS
    function mintClone(address to, string memory metadataCID) external onlyMinter returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _tokenCIDs[newTokenId] = metadataCID;
        emit CloneMinted(to, newTokenId, metadataCID);
        return newTokenId;
    }

    /// @notice Returns the metadata CID of a token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked("ipfs://", _tokenCIDs[tokenId]));
    }
}