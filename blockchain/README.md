# HTLCLogic README

This repository contains the Solidity smart contract called `HTLCLogic` implemented using the Hardhat development environment. The contract provides functionality for Hashed Time-Lock Contracts (HTLCs), which enable secure and trustless swaps of tokens between two parties across chains.

## Getting Started

Follow the instructions below to set up the project and run the unit tests.

### Prerequisites

Make sure you have the following software installed on your system:

- Node.js (version 12 or above)
- npm (Node Package Manager)
- Git

### Installation

1. Clone this repository to your local machine using the following command:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

### Running the Unit Tests

To run the unit tests for the smart contract, follow these steps:

1. Make sure you are in the project directory.

2. Run the following command to execute the unit tests:

   ```bash
   npx hardhat test
   ```

   This command will run the tests using the Hardhat test runner and display the test results in the console.

## Smart Contract Overview

The `HTLCLogic` contract implements the functionality for creating and managing Hashed Time-Lock Contract for Cross-chain token swapping. Here are the main features and functions provided by the contract:

- **Lock Tokens**: Users can lock a certain amount of tokens in a swap by calling the `lockTokens` function. This function creates a new swap and locks the tokens from the sender's address.

- **Reveal Secret**: The receiver of the swap can reveal the secret associated with the swap by calling the `revealSecret` function. This function completes the swap and transfers the locked tokens to the receiver's address.

- **Refund**: If the receiver fails to reveal the secret within the specified lock time, the sender can call the `refund` function to retrieve the locked tokens.

- **Swap Details**: The contract provides functions to retrieve the details of a swap by its hash, including the sender, receiver, network ID, amount, token address, start time, lock time, hashed secret, revealed secret, and swap status.

- **Swap Count**: The contract provides a function to get the total number of swaps created.

- **Hash Generation**: The contract includes a function to generate the hash of a secret string.

## Unit Tests

The unit tests for the `HTLCLogic` contract are implemented using the Mocha testing framework and the Chai assertion library. The tests cover various scenarios and ensure the correct behavior of the contract functions.

To run the unit tests, follow the installation instructions mentioned above and execute the `npx hardhat test` command in the project directory. The test results will be displayed in the console, indicating whether each test case has passed or failed.

The unit tests cover the following scenarios:

- Locking tokens and creating a new swap
- Revealing the secret and completing the swap
- Refunding tokens to the sender
- Retrieving swap details by index
- Generating the hash of a secret

Each test case verifies the expected behavior of the contract functions by comparing the actual results with the expected results using Chai assertions.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code according to your needs.

## Acknowledgments

- This project uses the [Hardhat](https://hardhat.org/) development environment and [OpenZeppelin](https://openzeppelin.com/) libraries.
- The unit tests are implemented using [Mocha](https://mochajs.org/) and [Chai](https://www.ch