# 🧬 AlterEgo Chain

**[Live App →](https://alterego-pi.vercel.app/)**

A web experiment where you can create AI-powered clones of yourself, track their evolution through branching timelines, and anchor their identity on the blockchain using Soulbound Tokens and NFTs.

---

## 🌱 What Is AlterEgo Chain?

AlterEgo Chain lets you explore alternate versions of your personality by generating introspective "clones"—AI agents that you can chat with and evolve. These clones form a dynamic tree of consciousness, allowing you to:

- Reflect on "what if" scenarios (future, parallel, or unknown versions of yourself),
- Preserve their evolution permanently,
- Own their lineage cryptographically.

---

## 🧾 Why Blockchain?

### 🧬 Seed as Soulbound Token (SBT)
Instead of storing your "seed of identity" on a centralized backend, we mint it as a **non-transferable Soulbound Token (SBT)** on-chain.

**Benefits:**
- **Proof of Origin:** Immutable record of your original identity.
- **Ownership:** Only you can claim the seed; it can’t be transferred or forged.
- **Composability:** Future dApps or clones can verify and react to your seed.

### 🤖 Clones as NFTs (ERC-721)
Each clone is minted as an **evolving NFT**, with metadata stored on IPFS. These NFTs don't just represent images—they encapsulate:

- Creator wallet address,
- Parent Clone ID and Seed Token,
- Forking condition (e.g., "Explore my future"),
- Content hash from the clone’s key conversation (stored on IPFS),
- Timestamp and attributes.

This builds an **on-chain genealogy**—a public lineage from your Seed Token → Base Clone → All Forked Versions.

---

## 🧠 App Features

- 🧪 Create a **base clone** from a written personality description.
- 🔁 Continue existing clones in chat.
- 🌐 Branch into alternate clones:
  - **Future**: Project your evolution.
  - **Parallel**: Imagine a different life path.
  - **Unknown**: Let randomness decide.
- 🕸️ View all clones in an **interactive graph**.
- 💬 Converse in real time using Gemini 2.5 Flash (via API).
- 🔒 No login required—just you and your digital minds (for now!).

> ⚠️ **Note:** Current version runs off-chain. Blockchain integration is implemented and tested on Sepolia but not yet linked to UI.

---

## 🔗 Smart Contracts (Deployed on Sepolia)

The smart contracts are live and tested, structured in a modular way:

### 1. `Clones.sol` (ERC-721 Clone NFTs)

- Standard NFT (OpenZeppelin)
- Only Factory can mint (`mintClone`)
- Token metadata points to IPFS
- Includes `setMinter(address)` and `Ownable`

📂 `blockchain/contracts/Clones.sol`

---

### 2. `Identity.sol` (Seed SBTs)

- ERC-721 with disabled transfers (Soulbound)
- One identity per address
- Only Factory can mint (`mintIdentity`)
- Includes `setMinter(address)` and `Ownable`

📂 `blockchain/contracts/Identity.sol`

---

### 3. `Factory.sol` (Orchestrator)

- Central controller of clone and seed creation
- Interfaces with both contracts
- Handles:
  - `createIdentity`
  - `createBaseClone`
  - `createBranchClone`
  - `setPermissions`

📂 `blockchain/contracts/Factory.sol`

---

## 🧠 Technologies Used

| Frontend             | Backend             | Blockchain        |
|----------------------|---------------------|-------------------|
| React 18 + Vite      | Express.js + Node   | Solidity + Hardhat |
| TailwindCSS          | TypeScript          | OpenZeppelin      |
| react-force-graph-2d | Gemini API (2.5)    | IPFS (for metadata) |

---

## 🔮 Roadmap

- [x] Create / Continue / Fork clones with Gemini  
- [x] Clone lineage visualization  
- [x] NFT/SBT smart contract deployment  
- [ ] IPFS upload of conversations and metadata  
- [ ] On-chain minting via UI  
- [ ] ENS-based identity linking  
- [ ] Token-gated clone interactions  

---

## 📜 License

MIT — open for experimentation, remixing, and feedback.

---

## 🧠 Author

Made by **Chonp BA** — inspired by identity, imagination, and cryptographic permanence.