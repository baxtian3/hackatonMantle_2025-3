// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IClones {
    function mintClone(address to, string memory metadataCID) external returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function setMinter(address _minter) external;
}