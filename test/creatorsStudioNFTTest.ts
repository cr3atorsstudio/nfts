import { ethers, network } from "hardhat";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Sample contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("CreatorsStudioNFT");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const name = "SampleContract";
    const symbol = "SAMPLE";
    const url = "https://example.com";

    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  async function getBalance(address: string) {
    const balance = await ethers.provider.getBalance(address);
    return balance.toString();
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("Test mint", () => {
    it("user can mint", async () => {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      const now = Math.round(Date.now() / 1000);
      const amount = 5;

      const mintTx = await hardhatToken.connect(addr1).mint(0, amount);
      await mintTx.wait();
      expect(
        await hardhatToken.balanceOf(hardhatToken, addr1.address)
      ).to.be.equal(amount);
    });

    it("user can't mint more than 10 at several times", async () => {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      const now = Math.round(Date.now() / 1000);
      const firstAmount = 9;

      const mintTx = await hardhatToken.connect(addr1).mint(0, firstAmount);
      await mintTx.wait();
      expect(
        await hardhatToken.balanceOf(hardhatToken, addr1.address)
      ).to.be.equal(firstAmount);

      const secondAmount = 9;

      await expect(
        hardhatToken.connect(addr1).publicSaleMint(addr1.address, secondAmount)
      ).to.be.rejectedWith(/Max token supply reached/);
    });
  });

  describe("Test setURL", () => {
    it("raise error not owner call the function", async () => {
      const newURL = "https://fugafuta.com";
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await expect(
        hardhatToken.connect(addr1).setURI(newURL)
      ).to.be.rejectedWith(/Ownable: caller is not the owner/);
    });

    it("owner can call the function", async () => {
      const newURL = "https://fugafuta.com";
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      const mintTx = await hardhatToken.connect(owner).setURI(newURL);
      mintTx.wait();
      expect(await hardhatToken.connect(owner).uri(1)).to.be.equal(
        "https://fugafuta.com"
      );
    });
  });

  describe("Test withdraw", () => {
    it("raise error not owner call the function", async () => {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await expect(hardhatToken.connect(addr1).withdraw()).to.be.rejectedWith(
        /Ownable: caller is not the owner/
      );
    });

    it("owner can call the function", async () => {
      const { Token, hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      expect(await getBalance(addr2.address)).to.eq("10000000000000000000000");

      //withdraw
      await hardhatToken.connect(owner).withdraw();
      expect(await getBalance(hardhatToken.address)).to.eq("0");
      expect(await getBalance(addr2.address)).to.eq("10000400000000000000000");
    });
  });
});