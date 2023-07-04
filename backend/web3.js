const Web3 = require("web3");

const htlcAbi = require("./abi/htlc.json");
const erc20Abi = require("./abi/erc20.json");

// Initialize Web3 instances
const web3Sepolia = new Web3(new Web3.providers.HttpProvider(process.env.SEPOLIA_RPC));
const web3Matic = new Web3(new Web3.providers.HttpProvider(process.env.POLYGON_RPC));

// Contract addresses
const contractMaticAddr = process.env.HTLC_MATIC_CONTRACT_ADDRESS;
const contractSepoliaAddr = process.env.HTLC_SEPOLIA_CONTRACT_ADDRESS;

module.exports = {
  htlcAbi,
  erc20Abi,
  web3Sepolia,
  web3Matic,
  contractMaticAddr,
  contractSepoliaAddr,
};
