# ✅ System ready and organized for Sepolia testnet

---

## 1. `Clones.sol` Contract (ERC-721)

**Location:** `blockchain/contracts/Clones.sol`

**Features:**
- ERC-721 standard (OpenZeppelin)
- Only Factory can mint (`mintClone`)
- Auto-incrementing `tokenId`
- Metadata stored on IPFS via CID
- `setMinter(address)` function for permissions
- `Ownable`

---

## 2. `Identity.sol` Contract (SBT)

**Location:** `blockchain/contracts/Identity.sol`

**Features:**
- ERC-721 with transfers and approvals disabled (SBT)
- Only Factory can mint (`mintIdentity`)
- Only one identity per address
- `setMinter(address)` function for permissions
- `Ownable`

---

## 3. `Factory.sol` Contract (Orchestrator)

**Location:** `blockchain/contracts/Factory.sol`

**Features:**
- Orchestrates creation of SBTs and clones
- Uses `IClones` and `IIdentity` interfaces
- Functions: `createIdentity`, `createBaseClone`, `createBranchClone`, `setPermissions`
- Only the owner can call `setPermissions`

**Interfaces:**
- `blockchain/contracts/IClones.sol`
- `blockchain/contracts/IIdentity.sol`

**Environment variables used:**
- `CLONES_ADDRESS`
- `IDENTITY_ADDRESS`

---

## 4. Configuration and environment variables

**File:** `blockchain/.env`

**Variables:**
- `YOUR_PRIVATE_KEY`
- `SEPOLIA_RPC_URL`
- `ETHERSCAN_API_KEY`
- `CLONES_ADDRESS`
- `IDENTITY_ADDRESS`

---

## 5. Hardhat and dotenv

- `blockchain/hardhat.config.js` already includes:  
  ```js
  require("dotenv").config();