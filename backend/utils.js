const SwapRequest = (tokenAddress, tokenSymbol, amount, network, time, hash, isCompleted, isClosed) => {
  return { tokenAddress, tokenSymbol, amount, network, time, hash, isCompleted,  isClosed};
};

module.exports = {
  SwapRequest
};
