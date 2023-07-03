// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract HTLCLogic is Ownable {

    struct Swap {
        address sender; // Address of the user initiating the swap
        address receiver; // Address of the user receiving the swap
        uint256 networkId; // Network from which the swap was requested
        uint256 amount; // Amount of tokens to be swapped
        address token; // Address of the token contract
        uint256 startTime; // Timestamp when the swap request created
        uint256 lockTime; // Duration to till swap expires
        bytes32 hashedSecret; // Hash of the secret
        string secret; // Revealed secret
        bool completed; // Flag indicating if the swap is completed
        bool closed; // Flag indicating if the swap request is closed
    }

    mapping(bytes32 => Swap) public swaps;
    bytes32[] public swapHashes; // Array to store the swap hashes

    event SwapCompleted(
        bytes32 indexed hash,
        address indexed sender,
        address indexed receiver
    );


    function lockTokens(bytes32 hash, uint256 networkId,uint256 amount, address token, uint256 lockTime) external {
        require(swaps[hash].hashedSecret == bytes32(0), "Swap already exists");

        // Perform necessary validation and token transfer logic


        // Lock the tokens from the sender's address
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        swaps[hash] = Swap(
            msg.sender,
            address(0), // Set the receiver address as empty initially,
            networkId,
            amount,
            token,
            block.timestamp,
            lockTime, // Set the time lock duration (e.g., 1 hour)
            hash,
            "",
            false, 
            false
        );

         swapHashes.push(hash); // Add the swap hash to the array
    }

    function revealSecret(string memory secret) external {
        bytes32 hash = keccak256(abi.encodePacked(secret));
        Swap storage swap = swaps[hash];

        require(swap.sender != msg.sender, "Sender is not authorized withdraw");
        require(swap.hashedSecret == hash, "Invalid hashed secret");
        require(block.timestamp <= swap.startTime + swap.lockTime, "Swap expired");
        require(!swap.completed, "Swap already completed");
        require(!swap.closed, "Swap request is closed");

        swap.secret = secret;
        swap.receiver = msg.sender;
        swap.completed = true;
        swap.closed = true;

        // Perform necessary token transfer to the receiver's address
        IERC20(swap.token).transfer(swap.receiver, swap.amount);

        emit SwapCompleted(hash, swap.sender, swap.receiver);
    }

    function refund(bytes32 hash) external {
        Swap storage swap = swaps[hash];

        require(swap.sender == msg.sender, "Unauthorized");
        require(block.timestamp > swap.startTime + swap.lockTime, "Too early");
        require(!swap.closed, "Swap request is closed");

        swap.closed = true;

        IERC20(swap.token).transfer(swap.sender, swap.amount);
    }

    function getSwapCount() external view returns (uint256) {
        return swapHashes.length;
    }

    function getSwapByIndex(uint256 index) external view returns (Swap memory) {
        require(index < swapHashes.length, "Invalid index");
        return swaps[swapHashes[index]];
    }

    function getOwner() external view returns (address) {
        return owner();
    }

    function generateHash(string memory secret) external pure returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(secret));
        return hash;
    }

}
