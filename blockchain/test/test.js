const { expect } = require("chai");
const hre = require("hardhat");
require("dotenv").config();

describe("Identity and Clones System (already deployed contracts)", function () {
  let owner, user1, user2;
  let factory, clones, identity;

  before(async function () {
    const provider = hre.ethers.provider;

    owner = new hre.ethers.Wallet(process.env.YOUR_PRIVATE_KEY, provider);
    user1 = new hre.ethers.Wallet(process.env.PRIVATE_KEY_USER1, provider);
    user2 = new hre.ethers.Wallet(process.env.PRIVATE_KEY_USER2, provider);

    // Use addresses of already deployed contracts
    const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;
    const CLONES_ADDRESS = process.env.CLONES_ADDRESS;
    const IDENTITY_ADDRESS = process.env.IDENTITY_ADDRESS;

    if (!FACTORY_ADDRESS || !CLONES_ADDRESS || !IDENTITY_ADDRESS) {
      throw new Error("You must define FACTORY_ADDRESS, CLONES_ADDRESS, and IDENTITY_ADDRESS in the .env file");
    }

    // Instantiate contracts using ethers v6
    factory = await hre.ethers.getContractAt("Factory", FACTORY_ADDRESS, owner);
    clones = await hre.ethers.getContractAt("Clones", CLONES_ADDRESS, owner);
    identity = await hre.ethers.getContractAt("Identity", IDENTITY_ADDRESS, owner);
  });

  it("A user can only create their SBT identity once", async function () {
    const initialBalance = await identity.balanceOf(user1.address);
    
    if (initialBalance.toString() === "0") {
      // User doesn't have identity yet - test normal flow
      await expect(factory.connect(user1).createIdentity("cid1"))
        .to.emit(factory, "IdentityCreated");
      
      // Now try to create another - should fail
      await expect(factory.connect(user1).createIdentity("cid2"))
        .to.be.revertedWith("You already have an identity");
    } else {
      // User already has identity - test that they can't create another
      await expect(factory.connect(user1).createIdentity("cid2"))
        .to.be.revertedWith("You already have an identity");
      
      console.log("    ℹ User1 already had an identity, tested only duplicate creation prevention");
    }
  });

  it("The SBT is neither transferable nor approvable", async function () {
    // Ensure user1 has an identity
    const balance = await identity.balanceOf(user1.address);
    let identityTokenId;
    
    if (balance.toString() === "0") {
      const tx = await factory.connect(user1).createIdentity("cid1");
      const receipt = await tx.wait();
      
      // Get token ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === "IdentityCreated";
        } catch (e) {
          return false;
        }
      });
      
      if (event) {
        const parsed = factory.interface.parseLog(event);
        identityTokenId = parsed.args.tokenId;
      } else {
        // Fallback: assume it's the first token for this user
        identityTokenId = 1;
      }
    } else {
      // User already has identity, need to find the token ID
      // For simplicity, we'll try common IDs or use a method to find it
      identityTokenId = 1; // This might need adjustment based on your setup
      
      // Try to verify the token exists
      try {
        await identity.ownerOf(identityTokenId);
      } catch (e) {
        // If token 1 doesn't exist, try other IDs
        for (let i = 1; i <= 10; i++) {
          try {
            const owner = await identity.ownerOf(i);
            if (owner === user1.address) {
              identityTokenId = i;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
    
    // Test that transfers are not allowed
    await expect(identity.connect(user1).transferFrom(user1.address, user2.address, identityTokenId))
      .to.be.revertedWith("This identity token is not transferable.");
    
    await expect(identity.connect(user1).approve(user2.address, identityTokenId))
      .to.be.revertedWith("This identity token is not transferable.");
    
    await expect(identity.connect(user1).setApprovalForAll(user2.address, true))
      .to.be.revertedWith("This identity token is not transferable.");
  });

  it("A user without an SBT cannot create base clones", async function () {
    // Verify that user2 doesn't have identity
    const balance = await identity.balanceOf(user2.address);
    expect(balance).to.equal(0);
    
    // Try to create a clone without identity - should fail
    await expect(factory.connect(user2).createBaseClone("cid1"))
      .to.be.revertedWith("You must have an identity");
  });

  it("A user with an SBT can create base clones", async function () {
    // Ensure user1 has identity
    let identityBalance = await identity.balanceOf(user1.address);
    if (identityBalance.toString() === "0") {
      await factory.connect(user1).createIdentity("cid1");
    }
    
    // Create a base clone - should work
    const tx = await factory.connect(user1).createBaseClone("cid2");
    const receipt = await tx.wait();
    
    // Verify the event was emitted
    const event = receipt.logs.find(log => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed.name === "BaseCloneCreated";
      } catch (e) {
        return false;
      }
    });
    
    expect(event).to.not.be.undefined;
    console.log("    ✓ Base clone created successfully");
  });

  it("Only the owner of a clone can fork it", async function () {
    // Ensure user1 has identity
    let identityBalance = await identity.balanceOf(user1.address);
    if (identityBalance.toString() === "0") {
      await factory.connect(user1).createIdentity("cid1");
    }
    
    // Ensure user1 has at least one clone
    let cloneBalance = await clones.balanceOf(user1.address);
    let cloneTokenId;
    
    if (cloneBalance.toString() === "0") {
      const tx = await factory.connect(user1).createBaseClone("cid2");
      const receipt = await tx.wait();
      
      // Get token ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === "BaseCloneCreated";
        } catch (e) {
          return false;
        }
      });
      
      if (event) {
        const parsed = factory.interface.parseLog(event);
        cloneTokenId = parsed.args.tokenId;
      } else {
        // Fallback: find first clone owned by user1
        for (let i = 1; i <= 10; i++) {
          try {
            const owner = await clones.ownerOf(i);
            if (owner === user1.address) {
              cloneTokenId = i;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
    } else {
      // Find an existing clone owned by user1
      for (let i = 1; i <= 10; i++) {
        try {
          const owner = await clones.ownerOf(i);
          if (owner === user1.address) {
            cloneTokenId = i;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    if (!cloneTokenId) {
      throw new Error("Could not find or create a clone for user1");
    }
    
    console.log(`    ℹ Using clone token ID: ${cloneTokenId}`);
    
    // Ensure user2 has an identity (required for creating clones)
    let user2IdentityBalance = await identity.balanceOf(user2.address);
    if (user2IdentityBalance.toString() === "0") {
      await factory.connect(user2).createIdentity("cid_user2");
    }
    
    // Test that user2 cannot fork user1's clone
    await expect(factory.connect(user2).createBranchClone(cloneTokenId, "cid3"))
      .to.be.revertedWith("You are not the owner of the parent clone");
    
    // Test that user1 can fork their own clone
    // Use a more explicit approach to avoid receipt issues
    try {
      const tx = await factory.connect(user1).createBranchClone(cloneTokenId, "cid3");
      const receipt = await tx.wait();
      
      // Verify the event was emitted
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === "BranchCloneCreated";
        } catch (e) {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
      
      if (event) {
        const parsed = factory.interface.parseLog(event);
        console.log(`    ✓ Branch clone created with ID: ${parsed.args.newTokenId}`);
      }
    } catch (error) {
      console.log(`    ✗ Error creating branch clone: ${error.message}`);
      throw error;
    }
  });

  it("Token metadata is correctly stored and retrievable", async function () {
    // Ensure user1 has identity
    let identityBalance = await identity.balanceOf(user1.address);
    let identityTokenId;
    
    if (identityBalance.toString() === "0") {
      const tx = await factory.connect(user1).createIdentity("cid1");
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === "IdentityCreated";
        } catch (e) {
          return false;
        }
      });
      
      if (event) {
        const parsed = factory.interface.parseLog(event);
        identityTokenId = parsed.args.tokenId;
      }
    } else {
      // Find existing identity token
      for (let i = 1; i <= 10; i++) {
        try {
          const owner = await identity.ownerOf(i);
          if (owner === user1.address) {
            identityTokenId = i;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    // Ensure user1 has clone
    let cloneBalance = await clones.balanceOf(user1.address);
    let cloneTokenId;
    
    if (cloneBalance.toString() === "0") {
      const tx = await factory.connect(user1).createBaseClone("cid2");
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === "BaseCloneCreated";
        } catch (e) {
          return false;
        }
      });
      
      if (event) {
        const parsed = factory.interface.parseLog(event);
        cloneTokenId = parsed.args.tokenId;
      }
    } else {
      // Find existing clone token
      for (let i = 1; i <= 10; i++) {
        try {
          const owner = await clones.ownerOf(i);
          if (owner === user1.address) {
            cloneTokenId = i;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    // Verify metadata can be retrieved
    if (identityTokenId) {
      const identityURI = await identity.tokenURI(identityTokenId);
      expect(identityURI).to.include("ipfs://");
      console.log(`    ✓ Identity token ${identityTokenId} URI: ${identityURI}`);
    }
    
    if (cloneTokenId) {
      const cloneURI = await clones.tokenURI(cloneTokenId);
      expect(cloneURI).to.include("ipfs://");
      console.log(`    ✓ Clone token ${cloneTokenId} URI: ${cloneURI}`);
    }
  });

  it("Only the owner can change the minter in Clones and Identity", async function () {
    // Test that non-owner cannot change minter
    await expect(clones.connect(user1).setMinter(user2.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
    
    await expect(identity.connect(user1).setMinter(user2.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });
});