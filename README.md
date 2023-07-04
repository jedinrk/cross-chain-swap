# Cross-Chain Swap

This project is a prototype for a Decentralised application to swap tokens such as stable tokens (e.g., USDT, USDC) and non-stable tokens cross-chain. Currently we support the networks Mumbai-Matic and Sepolia. It basically follows the atomic swap mechanism using the Hashed Time-Locked (HTLC) Contract.

## HTLC Smart Contract Documentation

### Overview

The HTLC (Hash Time Lock Contract) smart contract facilitates the swapping of tokens between two parties using a hash-locked mechanism. It allows one party (the sender) to lock tokens in a contract, and another party (the receiver) to claim those tokens by revealing the preimage of a hash. The contract ensures that the swap is atomic, meaning that either both parties successfully complete the swap, or the swap is canceled and the tokens are returned to the sender.

### Contract Design

The HTLCLogic contract is the main contract responsible for managing the swap process. It includes the following key components:

1. Structs:
   - `Swap`: Represents a swap transaction and stores relevant information such as sender, receiver, token details, timestamps, hash, and status flags.

2. State Variables:
   - `swaps`: Mapping that stores all the active swap transactions, with the hash of the swap as the key.
   - `swapHashes`: Array that stores the hashes of all active swap transactions.
   - `locked`: Boolean variable used for reentrancy guard.

3. Events:
   - `SwapCompleted`: Fired when a swap is successfully completed, providing the hash, sender, and receiver addresses.

4. Modifiers:
   - `nonReentrant`: Modifier used to prevent reentrancy attacks by restricting multiple recursive calls to the contract during a single transaction.

5. Functions:
   - `lockTokens`: Allows a user to lock tokens for a swap by providing a unique hash, the network ID, token amount, token address, and lock duration.
   - `revealSecret`: Enables the receiver to claim the locked tokens by revealing the secret corresponding to the hash.
   - `refund`: Allows the sender to cancel the swap and reclaim the locked tokens after the lock duration has expired.
   - `getSwapCount`: Retrieves the total number of active swap transactions.
   - `getSwapByIndex`: Retrieves the swap details for a given index in the `swapHashes` array.
   - `generateHash`: Helper function to generate the hash from a secret string.

### Backend Flow

The typical flow for a swap using the HTLC smart contract is as follows:

1. User A (sender) initiates a swap by calling the `lockTokens` function, providing a unique hash, network ID, token amount, token address, and lock duration.
2. The contract validates that the swap does not already exist and transfers the specified token amount from User A to the contract.
3. The swap details are stored in the `swaps` mapping, with the hash as the key.
4. User B (receiver) retrieves the swap details, including the hash, and generates the secret corresponding to the hash.
5. User B calls the `revealSecret` function, providing the secret. The contract verifies the validity of the secret and other conditions (e.g., sender authorization, swap expiration) before completing the swap.
6. If the conditions are met, the contract transfers the locked tokens from the contract to User B's address, and the swap is marked as completed and closed.
7. An event is emitted to indicate the successful completion of the swap.
8. If the swap is not completed within the specified lock duration, User A can call the `refund` function to cancel the swap and reclaim the locked tokens.

### Security Concerns and Recommendations

While the HTLC smart contract provides a mechanism for secure token swaps, it's important to consider and address potential security concerns.

 Here are some recommendations to enhance the security of the contract:

1. Reentrancy Attack:
   - To prevent reentrancy attacks, a `nonReentrant` modifier has been implemented in the `revealSecret` and `refund` functions. This ensures that these functions cannot be called again until the previous execution is completed. The modifier guards against multiple recursive calls within a single transaction.
   - It's crucial to include the `nonReentrant` modifier in any function that performs external calls or transfers tokens to prevent reentrancy vulnerabilities.

2. Input Validation:
   - Ensure that input validation is performed rigorously in all functions. Validate inputs such as addresses, amounts, and timestamps to prevent unexpected behavior or vulnerabilities.
   - Use require statements with clear error messages to enforce valid conditions, such as checking if the swap exists, validating the hashed secret, verifying the sender's authorization, and checking the swap expiration.

3. Randomness:
   - The generation of the hash is a critical component in the HTLC process. It's important to ensure that the hash is generated from a truly random secret to maintain the security of the swap. Consider using a secure source of randomness, such as an external oracle or a verifiable random function (VRF).

4. Event Handling:
   - Emitting events after critical state changes is important for transparency and auditability. Ensure that events are emitted in appropriate places to capture relevant information about the swap process, such as successful completions.
   - Consider emitting events for potential error cases or exceptional scenarios to provide a comprehensive view of contract activities and potential issues.

5. Access Control:
   - The current implementation of the HTLC contract does not include specific access control mechanisms apart from the contract owner, as it does not inherit from any access control contracts.
   - Depending on the requirements and deployment environment, it may be necessary to implement additional access controls to restrict certain functions to specific roles or addresses. Consider using an access control framework like OpenZeppelin's Access Control to manage and enforce role-based permissions.

6. Testing and Auditing:
   - Thoroughly test the contract by simulating different scenarios, including edge cases and possible attack vectors, to ensure its robustness and security.
   - Consider conducting security audits by independent experts to identify any potential vulnerabilities and obtain recommendations for improvement.


