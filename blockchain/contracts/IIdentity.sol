// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IIdentity {
    function mintIdentity(address to, string memory metadataCID) external returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function setMinter(address _minter) external;
}