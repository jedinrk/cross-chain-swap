require("dotenv").config();

/** Express JS and CORS configrations */
var express = require("express");
const cors = require("cors");
var app = express();
app.use(cors());
app.use(express.json());

const Web3 = require("web3");
const htlcAbi = require("./abi/htlc.json");

const web3Bsc = new Web3(new Web3.providers.HttpProvider(process.env.BSC_RPC));
const web3Matic = new Web3(
  new Web3.providers.HttpProvider(process.env.POLYGON_RPC)
);

/**
 * Creates a swap request for a user with the hashed secret
 *
 */
app.post("/createSwapRequest", function (req, res) {
  console.log(req.query);
  const { hash, amount, token, userAddress } = req.query;
  return res.status(200).json({ data: [] });
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
