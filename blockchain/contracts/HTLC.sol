// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract HTLCLogic is Ownable {

    struct Swap {
        address sender; // Address of the user initiating the swap
        address receiver; // Address of the user receiving the swap
        uint256 amount; // Amount of tokens to be swapped
        address token; // Address of the token contract
        uint256 startTime; // Timestamp when the swap request created
        uint256 lockTime; // Duration to till swap expires
        bytes32 hashedSecret; // Hash of the secret
        bytes32 secret; // Revealed secret
        bool completed; // Flag indicating if the swap is completed
        bool closed; // Flag indicating if the swap request is closed
    }

    mapping(bytes32 => Swap) public swaps;

    event SwapCompleted(
        bytes32 indexed hash,
        address indexed sender,
        address indexed receiver
    );


    function lockTokens(bytes32 hash, uint256 amount, address token) external {
        require(swaps[hash].hashedSecret == bytes32(0), "Swap already exists");

        // Perform necessary validation and token transfer logic
        // Lock the tokens from the sender's address
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        swaps[hash] = Swap(
            msg.sender,
            address(0), // Set the receiver address as empty initially
            amount,
            token,
            block.timestamp,
            10000, // Set the time lock duration (e.g., 1 hour)
            hash,
            bytes32(0),
            false, 
            false
        );
    }

    function revealSecret(bytes32 secret) external {
        bytes32 hash = keccak256(abi.encodePacked(secret));
        Swap storage swap = swaps[hash];

        require(swap.sender == msg.sender, "Invalid sender");
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

    function refund(bytes32 id) external {
        Swap storage swap = swaps[id];

        require(swap.sender != msg.sender, "Unauthorized");
        require(block.timestamp > swap.startTime + swap.lockTime, "too early");
        require(!swap.closed, "Swap request is closed");

        swap.closed = true;

        IERC20(swap.token).transfer(swap.sender, swap.amount);
    }

    function getOwner() external view returns (address) {
        return owner();
    }
}
