/** @type import('hardhat/config').HardhatUserConfig */
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";

dotenv.config();
const {
  TESTNET_API_URL,
  TESTNET_PRIVATE_KEY,
  MAINNET_API_URL,
  MAINNET_PRIVATE_KEY,
} = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    testnet: {
      url: TESTNET_API_URL,
      accounts: TESTNET_PRIVATE_KEY !== undefined ? [TESTNET_PRIVATE_KEY] : [],
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: MAINNET_PRIVATE_KEY !== undefined ? [MAINNET_PRIVATE_KEY] : [],
    },
  },
};

export default config;
