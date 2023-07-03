require("dotenv").config();
const { SwapRequest } = require("./utils");

/** Express JS and CORS configrations */
var express = require("express");
const cors = require("cors");
var app = express();
app.use(cors());
app.use(express.json());

const Web3 = require("web3");
const htlcAbi = require("./abi/htlc.json");
const erc20Abi = require("./abi/erc20.json");

//const web3Bsc = new Web3(new Web3.providers.HttpProvider(process.env.BSC_RPC));
const web3Sepolia = new Web3(
  new Web3.providers.HttpProvider(process.env.SEPOLIA_RPC)
);
const web3Matic = new Web3(
  new Web3.providers.HttpProvider(process.env.POLYGON_RPC)
);

const contractMaticAddr = process.env.HTLC_MATIC_CONTRACT_ADDRESS;
const contractSepoliaAddr = process.env.HTLC_SEPOLIA_CONTRACT_ADDRESS;

/**
 * Generates the hash for the provided secret key
 */
app.post("/generatehash", async (req, res) => {
  const { secret } = req.body;

  const htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);

  const generatedHash = await htlcContract.methods.generateHash(secret).call();

  if (generatedHash) {
    return res.status(200).json({ hash: generatedHash });
  } else {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get the number of tokens that the Murabah router is allowed to spend
 */
app.get("/approve/allowance", async (req, res) => {
  const { networkId, userAddress, tokenAddress } = req.query;

  let tokenContract;
  let htlcContractAddr;
  if (networkId == 11155111) {
    tokenContract = new web3Sepolia.eth.Contract(erc20Abi, tokenAddress);
    htlcContractAddr = contractSepoliaAddr;
  } else {
    tokenContract = new web3Matic.eth.Contract(erc20Abi, tokenAddress);
    htlcContractAddr = contractMaticAddr;
  }

  const allowance = await tokenContract.methods
    .allowance(userAddress, htlcContractAddr)
    .call();
  if (allowance) {
    return res.status(200).json({ allowance: allowance });
  } else {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Generate data for calling the token contract in order to allow the Murabah router for spend funds
 */
app.get("/approve/transaction", async (req, res) => {
  const { networkId, tokenAddress, amount } = req.query;

  let tokenContract;
  let htlcContractAddr;
  if (networkId == 11155111) {
    tokenContract = new web3Sepolia.eth.Contract(erc20Abi, tokenAddress);
    htlcContractAddr = contractSepoliaAddr;
  } else {
    tokenContract = new web3Matic.eth.Contract(erc20Abi, tokenAddress);
    htlcContractAddr = contractMaticAddr;
  }

  const tx = await tokenContract.methods.approve(htlcContractAddr, amount);
  const encodedABI = await tx.encodeABI();

  if (encodedABI) {
    return res.status(200).json({
      to: tokenAddress,
      data: encodedABI,
    });
  } else {
    return res.status(400).json({ error: "encodeABI error" });
  }
});

/**
 * Creates a swap request for a user with the hashed secret
 *
 */
app.post("/createSwapRequest", async (req, res) => {
  console.log("createSwapRequest", req.body);
  const { hash, amount, token, lockTime, networkId } = req.body;

  let htlcContract;
  let htlcContractAddr;
  if (networkId == 11155111) {
    htlcContract = new web3Sepolia.eth.Contract(htlcAbi, contractSepoliaAddr);
    htlcContractAddr = contractSepoliaAddr;
  } else {
    htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);
    htlcContractAddr = contractMaticAddr;
  }

  const tx = await htlcContract.methods.lockTokens(
    hash,
    amount,
    token,
    lockTime
  );
  const encodedABI = await tx.encodeABI();

  if (encodedABI) {
    return res.status(200).json({
      to: htlcContractAddr,
      data: encodedABI,
    });
  } else {
    return res.status(400).json({ error: "encodeABI error" });
  }
});

/**
 * Fetch all the active swap request
 */
app.get("/getActiveSwapRequests", async (req, res) => {
  const { userAddress } = req.query;

  const htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);

  const swapCount = await htlcContract.methods.getSwapCount().call(); // Get the total number of swaps

  const activeSwaps = [];

  for (let i = 0; i < swapCount; i++) {
    const swapByIndex = await htlcContract.methods.getSwapByIndex(i).call(); // Get the swap hash at index i
    const result = await htlcContract.methods.swaps(swapByIndex[6]).call(); // Get the swap details using the hash
    const tokenContract = new web3Matic.eth.Contract(erc20Abi, result[3]);
    const tokenSymbol = await tokenContract.methods.symbol().call();

    const swapRequest = SwapRequest(
      result[3],
      tokenSymbol,
      Web3.utils.fromWei(result[2], "ether"),
      "Matic -> BSC",
      result[5],
      result[6],
      result[8],
      result[9]
    );

    activeSwaps.push(swapRequest);
  }

  if (activeSwaps) {
    return res.status(200).json({ activeSwaps });
  } else {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Fetch users swap requests
 */
app.get("/getUsersSwapRequests", async (req, res) => {
  console.log(req.query);
  return res.status(200).json({ data: [] });
});

/**
 * Creates a swap request for a user with the hashed secret
 *
 */
app.post("/engageSwapRequest", async (req, res) => {
  console.log("engageSwapRequest", req.body);
  const { hash, amount, sendToken, recieveToken, lockTime, networkId } = req.body;

  let htlcContract;
  let htlcContractAddr;
  if (networkId == 11155111) {
    htlcContract = new web3Sepolia.eth.Contract(htlcAbi, contractSepoliaAddr);
    htlcContractAddr = contractSepoliaAddr;
  } else {
    htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);
    htlcContractAddr = contractMaticAddr;
  }

  const tx = await htlcContract.methods.lockTokens(
    hash,
    amount,
    recieveToken,
    lockTime
  );
  const encodedABI = await tx.encodeABI();

  if (encodedABI) {
    return res.status(200).json({
      to: htlcContractAddr,
      data: encodedABI,
    });
  } else {
    return res.status(400).json({ error: "encodeABI error" });
  }
});

app.listen(process.env.PORT, function () {
  console.log("Listening on port 5050");
});
