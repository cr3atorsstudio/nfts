import { ethers, network } from "hardhat";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Sample contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("CreatorsStudioNFT");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const name = "SampleContract";
    const symbol = "SAMPLE";
    const url = "https://example.com";

    const hardhatToken = await Token.deploy(url);

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
      const amount = 1;

      const mintTx = await hardhatToken.connect(addr1).mint(0, amount);
      await mintTx.wait();
      const mintTx1 = await hardhatToken.connect(addr1).mint(1, amount);
      await mintTx1.wait();

      expect(await hardhatToken.balanceOf(addr1.address, 0)).to.be.equal(
        amount
      );
      expect(await hardhatToken.balanceOf(addr1.address, 1)).to.be.equal(
        amount
      );
    });

    describe("Max supply", () => {
      it("raise error when mint over creators supply limit", async () => {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );
        const mintTx = await hardhatToken
          .connect(owner)
          .mintBatch(addr1.address, [0], [100], []);
        await mintTx.wait();

        const secondAmount = 1;

        await expect(
          hardhatToken.connect(addr2).mint(0, secondAmount)
        ).to.be.rejectedWith(/Max token supply reached/);
      });

      it("raise error when mint over supporters supply limit", async () => {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );
        const mintTx = await hardhatToken
          .connect(owner)
          .mintBatch(addr1.address, [1], [100], []);
        await mintTx.wait();

        const secondAmount = 1;

        await expect(
          hardhatToken.connect(addr1).mint(1, secondAmount)
        ).to.be.rejectedWith(/Max token supply reached/);
      });
    });

    describe("Max supply of wallet", () => {
      it("user can mint creator token and supporter token", async () => {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );
        const now = Math.round(Date.now() / 1000);
        const firstAmount = 1;

        const mintTx = await hardhatToken.connect(addr1).mint(0, firstAmount);
        await mintTx.wait();
        expect(await hardhatToken.balanceOf(addr1.address, 0)).to.be.equal(
          firstAmount
        );

        const secondAmount = 1;
        const secondMintTx = await hardhatToken
          .connect(addr1)
          .mint(1, secondAmount);
        await secondMintTx.wait();
        expect(await hardhatToken.balanceOf(addr1.address, 0)).to.be.equal(
          secondAmount
        );
      });

      it("raise error when mint over creators supply limit", async () => {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );
        const now = Math.round(Date.now() / 1000);
        const firstAmount = 1;

        const mintTx = await hardhatToken.connect(addr1).mint(0, firstAmount);
        await mintTx.wait();
        expect(await hardhatToken.balanceOf(addr1.address, 0)).to.be.equal(
          firstAmount
        );

        const secondAmount = 1;

        await expect(
          hardhatToken.connect(addr1).mint(0, secondAmount)
        ).to.be.rejectedWith(/Max supply of wallet reached/);
      });

      it("raise error when mint over supporters supply limit", async () => {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );
        const now = Math.round(Date.now() / 1000);
        const firstAmount = 1;

        const mintTx = await hardhatToken.connect(addr1).mint(1, firstAmount);
        await mintTx.wait();
        expect(await hardhatToken.balanceOf(addr1.address, 1)).to.be.equal(
          firstAmount
        );

        const secondAmount = 1;

        await expect(
          hardhatToken.connect(addr1).mint(1, secondAmount)
        ).to.be.rejectedWith(/Max supply of wallet reached/);
      });
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
      expect(await getBalance(addr2.address)).to.eq("10000000000000000000000");
    });
  });
});
