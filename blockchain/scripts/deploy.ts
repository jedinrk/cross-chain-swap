import { ethers } from "hardhat";

async function main() {
  
  const htlc = await ethers.deployContract("HTLCLogic");
  await htlc.waitForDeployment();

  console.log(
    `HTLC contract deployed to ${htlc.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
