require("dotenv").config();

/** Express JS and CORS configrations */
var express = require("express");
const cors = require("cors");
var app = express();
app.use(cors());
app.use(express.json());

const Web3 = require("web3");
const htlcAbi = require("./abi/htlc.json");
const erc20Abi = require("./abi/erc20.json");

const web3Bsc = new Web3(new Web3.providers.HttpProvider(process.env.BSC_RPC));
const web3Matic = new Web3(
  new Web3.providers.HttpProvider(process.env.POLYGON_RPC)
);

const contractMaticAddr = "0xAcFD8930700605a1A3904aEa675d9F7068b5f2C9";

/**
 * Generates the hash for the provided secret key
 */
app.post("/generatehash", async (req, res) => {
  const { secret } = req.body;

  const htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);

  const generatedHash = await htlcContract.methods
    .generateHash(secret)
    .call();

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
  const { query } = req;

  const tokenContract = new web3.eth.Contract(erc20Abi, query.tokenAddress);

  const allowance = await tokenContract.methods
    .allowance(query.userAddress, routerAddress)
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
  const { query } = req;

  const tokenContract = new web3.eth.Contract(erc20Abi, query.tokenAddress);

  const tx = await tokenContract.methods.approve(routerAddress, maxUint256);
  const encodedABI = await tx.encodeABI();

  if (encodedABI) {
    return res.status(200).json({
      to: query.tokenAddress,
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
  console.log('createSwapRequest', req.body)
  const { hash, amount, token, lockTime } = req.body;

  const htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);

  const tx = await htlcContract.methods.lockTokens(
    hash,
    amount,
    token,
    lockTime
  );
  const encodedABI = await tx.encodeABI();

  if (encodedABI) {
    return res.status(200).json({
      to: contractMaticAddr,
      data: encodedABI,
    });
  } else {
    return res.status(400).json({ error: "encodeABI error" });
  }
});

/**
 * Fetch all the active swap request
 */
app.get("/getActiveSwapRequests", function (req, res) {
  console.log(req.query);
  return res.status(200).json({ data: [] });
});

/**
 * Fetch users swap requests
 */
app.get("/getUsersSwapRequests", function (req, res) {
  console.log(req.query);
  return res.status(200).json({ data: [] });
});

app.listen(process.env.PORT, function () {
  console.log("Listening on port 5050");
});
