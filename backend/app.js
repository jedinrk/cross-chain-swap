require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { SwapIterator, ConsolidateMaps } = require("./utils");

const app = express();
app.use(cors());
app.use(express.json());

const {
  htlcAbi,
  erc20Abi,
  web3Sepolia,
  web3Matic,
  contractMaticAddr,
  contractSepoliaAddr,
} = require("./web3");

/**
 * Generates the hash for the provided secret key
 */
app.post("/generatehash", async (req, res) => {
  try {
    const { secret } = req.body;
    const htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);
    const generatedHash = await htlcContract.methods
      .generateHash(secret)
      .call();

    return res.status(200).json({ hash: generatedHash });
  } catch (error) {
    console.error("Error in generatehash:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch the token allowance for the HTLC contract spend for the userAddress
 */
app.get("/approve/allowance", async (req, res) => {
  try {
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

    return res.status(200).json({ allowance });
  } catch (error) {
    console.error("Error in approve/allowance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Generate data for calling the token contract in order to allow the HTLC to spend tokens
 */
app.get("/approve/transaction", async (req, res) => {
  try {
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

    return res.status(200).json({
      to: tokenAddress,
      data: encodedABI,
    });
  } catch (error) {
    console.error("Error in approve/transaction:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Creates a swap request for a user with the hashed secret
 */
app.post("/createSwapRequest", async (req, res) => {
  try {
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
      networkId,
      amount,
      token,
      lockTime
    );
    const encodedABI = await tx.encodeABI();

    return res.status(200).json({
      to: htlcContractAddr,
      data: encodedABI,
    });
  } catch (error) {
    console.error("Error in createSwapRequest:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch all active swap requests
 */
app.get("/getActiveSwapRequests", async (req, res) => {
  try {
    const { userAddress } = req.query;

    const consolidatedArray = await consolidateSwapIntoArray();
    const activeSwaps = consolidatedArray.filter(
      (swap) => swap.sender !== userAddress && swap.status === "pending"
    );

    return res.status(200).json({ activeSwaps });
  } catch (error) {
    console.error("Error in getActiveSwapRequests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch user's swap requests
 */
app.get("/getUsersSwapRequests", async (req, res) => {
  try {
    const { userAddress } = req.query;

    const consolidatedArray = await consolidateSwapIntoArray();

    const userSwapRequests = consolidatedArray.filter(
      (swap) => swap.sender === userAddress
    );

    return res.status(200).json({ userSwapRequests });
  } catch (error) {
    console.error("Error in getUsersSwapRequests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch user's swap engagements
 */
app.get("/getUsersSwapEngagements", async (req, res) => {
  try {
    const { userAddress } = req.query;

    const consolidatedArray = await consolidateSwapIntoArray();

    const userSwapEngagements = consolidatedArray.filter(
      (swap) => swap.secret !== ""
    );

    return res.status(200).json({ userSwapEngagements });
  } catch (error) {
    console.error("Error in getUsersSwapEngagements:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Engage in a swap request with the hashed secret
 */
app.post("/engageSwapRequest", async (req, res) => {
  try {
    const {
      hash,
      amount,
      sendToken,
      receiveToken,
      lockTime,
      originNetworkId,
      networkId,
    } = req.body;

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
      originNetworkId,
      amount,
      receiveToken,
      lockTime
    );
    const encodedABI = await tx.encodeABI();

    return res.status(200).json({
      to: htlcContractAddr,
      data: encodedABI,
    });
  } catch (error) {
    console.error("Error in engageSwapRequest:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Reveal the secret for a swap engagement
 */
app.post("/revealSecret", async (req, res) => {
  try {
    const { secret, networkId } = req.body;

    let htlcContract;
    let htlcContractAddr;

    if (networkId == 11155111) {
      htlcContract = new web3Sepolia.eth.Contract(htlcAbi, contractSepoliaAddr);
      htlcContractAddr = contractSepoliaAddr;
    } else {
      htlcContract = new web3Matic.eth.Contract(htlcAbi, contractMaticAddr);
      htlcContractAddr = contractMaticAddr;
    }

    const tx = await htlcContract.methods.revealSecret(secret);
    const encodedABI = await tx.encodeABI();

    return res.status(200).json({
      to: htlcContractAddr,
      data: encodedABI,
    });
  } catch (error) {
    console.error("Error in revealSecret:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT);
});

/**
 * Common logic to fetch all the swap requests from contracts and consolidate into an array with status.
 */
const consolidateSwapIntoArray = async () => {
  try {
    const htlcMaticContract = new web3Matic.eth.Contract(
      htlcAbi,
      contractMaticAddr
    );
    const swapMaticCount = await htlcMaticContract.methods
      .getSwapCount()
      .call();

    const htlcSepoliaContract = new web3Sepolia.eth.Contract(
      htlcAbi,
      contractSepoliaAddr
    );
    const swapSepoliaCount = await htlcSepoliaContract.methods
      .getSwapCount()
      .call();

    const activeSwapMatic = await SwapIterator(
      htlcMaticContract,
      web3Matic,
      swapMaticCount
    );

    const activeSwapSepolia = await SwapIterator(
      htlcSepoliaContract,
      web3Sepolia,
      swapSepoliaCount
    );

    const consolidatedArray = ConsolidateMaps(
      activeSwapMatic,
      activeSwapSepolia
    );
    return consolidatedArray;
  } catch (error) {
    console.error("Error in consolidateSwapIntoArray:", error);
    throw error;
  }
};
