/** @type import('hardhat/config').HardhatUserConfig */

const {
  TESTNET_API_URL,
  TESTNET_PRIVATE_KEY,
  MAINNET_API_URL,
  MAINNET_PRIVATE_KEY,
} = process.env;

module.exports = {
  solidity: "0.8.17",
  // defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    testnet: {
      url: TESTNET_API_URL,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: [MAINNET_PRIVATE_KEY]
    }
  }
};
