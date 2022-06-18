

const {expect } = require("chai");

describe("Mafia Monkeys Contract Tests", ()=> {
  let contract, owner, provider;
  
  beforeEach(async ()=> {
    const nftContractFactory = await hre.ethers.getContractFactory('MafiaMonkeysNFT');
    const nftContract = await nftContractFactory.deploy();
    contract = await nftContract.deployed();
    [owner] = await hre.ethers.getSigners();
    provider = await hre.ethers.getDefaultProvider()
  })

  it("Should deploy the Contract", async ()=> {
    expect(contract).not.null
  });
  
  it("Mint Price should be greater than 0", async ()=> {
    expect(await contract.getMintPrice()).be.above(0)
  })

  it("Should mint one NFT and deposit funds in the Contract", async ()=> {
    let oldContractBalance = await contract.contractBalance();
    let txn = await contract.makeAnEpicNFT({value: ethers.utils.parseEther("0.5")})
    await txn.wait()
    let newContractBalance = await contract.contractBalance();
    expect(oldContractBalance.toString()).not.to.equal(newContractBalance.toString())
  });



})