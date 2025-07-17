// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IClones.sol";
import "./IIdentity.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Factory - Core of the identity and clones system
/// @notice Orchestrates the creation of SBTs and clones, and manages minting permissions
contract Factory is Ownable {
    IClones public clones;
    IIdentity public identity;

    event IdentityCreated(address indexed user, uint256 tokenId, string metadataCID);
    event BaseCloneCreated(address indexed user, uint256 tokenId, string metadataCID);
    event BranchCloneCreated(address indexed user, uint256 parentId, uint256 newTokenId, string metadataCID);
    event PermissionsSet(address indexed factory, address clones, address identity);

    constructor(address _clones, address _identity) {
        require(_clones != address(0) && _identity != address(0), "Invalid addresses");
        clones = IClones(_clones);
        identity = IIdentity(_identity);
    }

    /// @notice Allows the owner to set minting permissions on Clones and Identity
    function setPermissions() external onlyOwner {
        clones.setMinter(address(this));
        identity.setMinter(address(this));
        emit PermissionsSet(address(this), address(clones), address(identity));
    }

    /// @notice Creates an identity SBT for the user
    function createIdentity(string memory metadataCID) external {
        require(identity.balanceOf(msg.sender) == 0, "You already have an identity");
        uint256 tokenId = identity.mintIdentity(msg.sender, metadataCID);
        emit IdentityCreated(msg.sender, tokenId, metadataCID);
    }

    /// @notice Creates a base clone for the user (requires SBT)
    function createBaseClone(string memory metadataCID) external {
        require(identity.balanceOf(msg.sender) > 0, "You must have an identity");
        uint256 tokenId = clones.mintClone(msg.sender, metadataCID);
        emit BaseCloneCreated(msg.sender, tokenId, metadataCID);
    }

    /// @notice Creates a branch clone from an existing clone
    function createBranchClone(uint256 parentId, string memory metadataCID) external {
        require(clones.ownerOf(parentId) == msg.sender, "You are not the owner of the parent clone");
        uint256 tokenId = clones.mintClone(msg.sender, metadataCID);
        emit BranchCloneCreated(msg.sender, parentId, tokenId, metadataCID);
    }
}