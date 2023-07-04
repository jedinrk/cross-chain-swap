import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const zeroAddr = "0x0000000000000000000000000000000000000000";
describe("HTLC", function () {
  let htlcLogic : any;
  let token : any;
  let sender : any;
  let receiver : any;

  beforeEach(async function () {

    const HTLCLogic = await ethers.getContractFactory("HTLCLogic");
    htlcLogic = await HTLCLogic.deploy();

    const USDK = await ethers.getContractFactory("USDK");
    token = await USDK.deploy();

    [sender, receiver] = await ethers.getSigners();
  });

  it("should lock tokens and create a new swap", async function () {
    const hash = "0x51dd1d399a6f7bbb877add23d470aeef62462e051d1f643a1354ef67bdc99dbb";
    const networkId = 1;
    const amount = ethers.parseEther("1");
    const lockTime = 3600; // 1 hour

    await token.approve(htlcLogic.target, amount);
    const lockTokensTx = await htlcLogic.lockTokens(
      hash,
      networkId,
      amount,
      token.target,
      lockTime
    );

    const swap = await htlcLogic.swaps(hash);
    const swapHashes = await htlcLogic.swapHashes(0);

    expect(swap.sender).to.equal(sender.address);
    expect(swap.receiver).to.equal(zeroAddr);
    expect(swap.networkId).to.equal(networkId);
    expect(swap.amount).to.equal(amount);
    expect(swap.token).to.equal(token.target);
    expect(swap.lockTime).to.equal(lockTime);
    expect(swap.hashedSecret).to.equal(hash);
    expect(swap.secret).to.equal("");
    expect(swap.completed).to.equal(false);
    expect(swap.closed).to.equal(false);

    expect(swapHashes).to.equal(hash);

    expect(lockTokensTx)
      .to.emit(htlcLogic, "SwapCompleted")
      .withArgs(hash, sender.address, 0x00);
  });
});
