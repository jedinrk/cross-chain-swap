const SwapRequest = (tokenAddress, tokenSymbol, amount, network, timeLock, hash, isCompleted, isClosed) => {
  return { tokenAddress, tokenSymbol, amount, network, timeLock, hash, isCompleted,  isClosed};
};

module.exports = {
  SwapRequest
};
