# Backend Repo for Cross-Chain Token Swap

This repository contains the backend code for a cross-chain token swap application. The backend is built using Node.js and Express.js, providing a robust server-side implementation for the token swap functionality.

## Tech Stack

The backend of this application is built using the following technologies:

- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine. It allows for server-side execution of JavaScript code.

- Express.js: A web application framework for Node.js that provides a simple and minimalistic approach for building web servers and APIs.

## Getting Started

To run the backend server, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Create a `.env` file in the root directory of the project with the following variables:

   ```
   PORT=<port-number>
   BSC_RPC=<BSC-RPC-url>
   POLYGON_RPC=<Polygon-RPC-url>
   SEPOLIA_RPC=<Sepolia-RPC-url>
   HTLC_MATIC_CONTRACT_ADDRESS=<HTLC-Matic-contract-address>
   HTLC_SEPOLIA_CONTRACT_ADDRESS=<HTLC-Sepolia-contract-address>
   ```

   Make sure to replace `<port-number>`, `<BSC-RPC-url>`, `<Polygon-RPC-url>`, `<Sepolia-RPC-url>`, `<HTLC-Matic-contract-address>`, and `<HTLC-Sepolia-contract-address>` with the actual values.

4. Install the dependencies:

   ```bash
   yarn
   ```

5. Run the backend server:

   ```bash
   yarn start
   ```

The backend server will start running on the specified port, and you can now make requests to the defined API endpoints.

## Learn More

To learn more about Node.js and Express.js, refer to the following resources:

- [Node.js Documentation](https://nodejs.org/en/docs/): Official documentation for Node.js, providing comprehensive guides and references.

- [Express.js Documentation](https://expressjs.com/): Official documentation for Express.js, offering detailed explanations of the framework's features and functionalities.
