const ERC721A = artifacts.require("ERC721A");

const truffleAssert = require("truffle-assertions");
const BN = require("bn.js");

const balance = web3.utils.toWei;

function toBN(number) {
  return new BN(number);
}

const MAX_UINT256 = new BN("2").pow(new BN("256")).sub(new BN("1"));

contract("ERC721A", async (accounts) => {
  const OWNER = accounts[0]; //also ADMIN
  const USER1 = accounts[1];
  const USER2 = accounts[2];
  const USER3 = accounts[3];

  const WALLET_A = accounts[4];
  const WALLET_B = accounts[5];

  const SIGNER = accounts[6];

  const USER4_PRIVATE_KEY = "6e5361dbc56af2967d7bba31ce5e40039fd9fb05de74c9633eb9de95257622a8";

  let erc721A;

  //Parameters to create an issue
  const price = 100000000000000000; // 0.1 ether
  const uri = "http://aaa/";
  const _name = "Test";
  const _symbol = "TT";

  beforeEach(async () => {
    erc721A = await ERC721A.new(_name, _symbol);
  });

  describe("setup", () => {
    it("should have correct name and symbol", async () => {
      const name = await erc721A.name();

      const symbol = await erc721A.symbol();
      assert.equal(_name, name);

      assert.equal(_symbol, symbol);
    });

    it("should not allow mint 0 tokens", async () => {
      await truffleAssert.reverts(erc721A.mint(USER1, 0, { from: USER1 }));
    });

    it("should be able to mint", async () => {
      let tx = await erc721A.mint(USER1, 1, { from: USER1 });
      console.log("mint cost = ", tx.receipt.gasUsed);
      tx = await erc721A.mint(USER1, 100, { from: USER1 });
      console.log("mint cost = ", tx.receipt.gasUsed);

      tx = await erc721A.mint(USER2, 1, { from: USER2 });
      console.log("mint cost = ", tx.receipt.gasUsed);

      tx = await erc721A.mint(USER2, 100, { from: USER2 });
      console.log("mint cost = ", tx.receipt.gasUsed);
    });

    it("should be able to mint and use signature", async () => {
      await erc721A.setSigner(OWNER); // but can be any address

      // private key of Owner to sign
      const privateKey = "9c201a2e1dece883650009446514ca23fe84ea7be9b6f5352aa277b67ec654d5";

      const _quantity = 10;

      let hashInfo = web3.utils.soliditySha3(_quantity, USER3);
      let result = web3.eth.accounts.sign(hashInfo, privateKey);

      let hash = web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32", hashInfo);
      assert.equal(result.messageHash, hash);

      let tx = await erc721A.mintSigned(result.signature, USER3, 10, { from: USER3 });
      console.log("mint cost = ", tx.receipt.gasUsed);

      // it is going to fail because quantity is not 10, but 1. And 
      // it was signed to mint 10.
      await truffleAssert.reverts(erc721A.mintSigned(result.signature, USER3, 1, { from: USER3 }));
      
    });
  });
});
