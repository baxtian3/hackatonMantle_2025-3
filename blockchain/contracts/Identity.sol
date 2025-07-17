// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Identity - User identity Soulbound Token (SBT)
/// @notice Only the Factory contract can mint. Non-transferable.
contract Identity is ERC721, Ownable {
    address public minter;
    mapping(address => bool) private _hasIdentity;
    mapping(uint256 => string) private _tokenCIDs;
    uint256 private _tokenIdCounter;

    event MinterChanged(address indexed newMinter);
    event IdentityMinted(address indexed to, uint256 indexed tokenId, string metadataCID);

    modifier onlyMinter() {
        require(msg.sender == minter, "Only the authorized minter can mint");
        _;
    }

    constructor() ERC721("Identity", "ID") {}

    /// @notice Sets the minter address (Factory)
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Minter cannot be address(0)");
        minter = _minter;
        emit MinterChanged(_minter);
    }

    /// @notice Mints an identity SBT. Only one per address.
    function mintIdentity(address to, string memory metadataCID) external onlyMinter returns (uint256) {
        require(!_hasIdentity[to], "Identity already exists for this address");
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _hasIdentity[to] = true;
        _tokenCIDs[newTokenId] = metadataCID;
        emit IdentityMinted(to, newTokenId, metadataCID);
        return newTokenId;
    }

    /// @notice Returns the metadata CID of a token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked("ipfs://", _tokenCIDs[tokenId]));
    }

    // --- Soulbound: transfer and approval functions reverted ---
    function approve(address, uint256) public pure override {
        revert("This identity token is not transferable.");
    }
    function setApprovalForAll(address, bool) public pure override {
        revert("This identity token is not transferable.");
    }
    function transferFrom(address, address, uint256) public pure override {
        revert("This identity token is not transferable.");
    }
    function safeTransferFrom(address, address, uint256) public pure override {
        revert("This identity token is not transferable.");
    }
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("This identity token is not transferable.");
    }
}