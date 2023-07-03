const Web3 = require("web3");
const erc20Abi = require("./abi/erc20.json");

const SwapRequest = (
  sender,
  receiver,
  tokenAddress,
  tokenSymbol,
  amount,
  networkId,
  timeLock,
  hash,
  secret,
  isCompleted,
  isClosed
) => {
  return {
    sender,
    receiver,
    tokenAddress,
    tokenSymbol,
    amount,
    networkId,
    timeLock,
    hash,
    secret,
    isCompleted,
    isClosed,
  };
};

const SwapIterator = async (htlcContract, web3, swapCount) => {
  const activeSwapMap = new Map();
  for (let i = 0; i < swapCount; i++) {
    const swapByIndex = await htlcContract.methods.getSwapByIndex(i).call(); // Get the swap hash at index i
    const result = await htlcContract.methods.swaps(swapByIndex[7]).call(); // Get the swap details using the hash
    const tokenContract = new web3.eth.Contract(erc20Abi, result[4]);
    const tokenSymbol = await tokenContract.methods.symbol().call();
    const swapRequest = SwapRequest(
      result[0],
      result[1],
      result[4],
      tokenSymbol,
      Web3.utils.fromWei(result[3], "ether"),
      result[2],
      result[6],
      result[7],
      result[8],
      result[9],
      result[10]
    );

    activeSwapMap.set(result[7], swapRequest);
  }

  return activeSwapMap;
};

const ConsolidateMaps = (mapA, mapB) => {
  const consolidatedArray = [];

  // Iterate over entries in mapA
  for (const [key, valueA] of mapA) {
    const valueB = mapB.get(key);

    if (valueB) {
      // Both maps have the same key, add object with 'ready' status
      consolidatedArray.push({
        ...valueA,
        status: "ready",
        secret: valueA.secret !== ''? valueA.secret : valueB.secret,
        isCompleted: valueA.isCompleted || valueB.isCompleted,
        isClosed: valueA.isClosed || valueB.isClosed,
      });

      // Remove the entry from mapB to handle remaining entries in mapB later
      mapB.delete(key);
    } else {
      // Only mapA has the key, add object with 'pending' status
      consolidatedArray.push({
        ...valueA,
        status: "pending",
      });
    }
  }

  // Iterate over remaining entries in mapB
  for (const [key, valueB] of mapB) {
    // Only mapB has the key, add object with 'pending' status
    consolidatedArray.push({
      ...valueB,
      status: "pending",
    });
  }

  return consolidatedArray;
};

module.exports = {
  SwapRequest,
  SwapIterator,
  ConsolidateMaps,
};
