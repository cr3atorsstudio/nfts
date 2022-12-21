import { ethers } from "hardhat";

async function main() {
    const NFT = await ethers.getContractFactory("CreatorsStudioNFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    console.log(`Contract deployed to address: ${nft.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        process.exit(1);
    });