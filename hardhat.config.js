require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    sources: "./backend/blockchain",
    artifacts: "./artifacts"
  },
  networks: {
    blockdag: {
      url: 'https://test-rpc.primordial.bdagscan.com/', // Replace with actual BlockDAG RPC
      chainId: 1043, // Replace with BlockDAG's chain ID
      accounts: [] // No private key needed for frontend deployment
    }
  }
};
