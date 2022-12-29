import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("CreatorsStudioNFT");
  const nft = await NFT.deploy(
    "ipfs://QmPDH1NjE8GJM1wsKF9tc6kStyhGFKLjHarL1qaM3k8y9m/{id}.json"
  );
  await nft.deployed();

  console.log(`Contract deployed to address: ${nft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1);
  });
