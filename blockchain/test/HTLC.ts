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
    const hash = "0x4faee670273f04bc8c3ce0cee41c1005b906f1703f4341311df55eed98438787";
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

  it("should reveal the secret and complete the swap", async function () {
    const hash = "0x51dd1d399a6f7bbb877add23d470aeef62462e051d1f643a1354ef67bdc99dbb";
    const secret = "theNewSecret";

    await token.approve(htlcLogic.target, ethers.parseEther("1"));
    await htlcLogic.lockTokens(hash, 1, ethers.parseEther("1"), token.target, 3600);

    await htlcLogic.connect(receiver).revealSecret(secret);

    const swap = await htlcLogic.swaps(hash);

    expect(swap.secret).to.equal(secret);
    expect(swap.receiver).to.equal(receiver.address);
    expect(swap.completed).to.equal(true);
    expect(swap.closed).to.equal(true);

    // Verify token transfer
    const receiverBalance = await token.balanceOf(receiver.address);
    expect(receiverBalance).to.equal(ethers.parseEther("1"));
  });

  it("should refund tokens to the sender", async function () {
    const hash = "0x263d8264c5a2cb5add3e044b77fdb2a3f0b9e464bd36df27c23a924fc6110d42";
    const amount = ethers.parseEther("1");

    const senderInitialBalance = await token.balanceOf(sender.address);

    await token.approve(htlcLogic.target, amount);
    await htlcLogic.lockTokens(hash, 1, amount, token.target, 0);

    const senderBalance = await token.balanceOf(sender.address);
    expect(senderBalance).to.equal(senderInitialBalance-amount);
    
    await htlcLogic.refund(hash);

    const swap = await htlcLogic.swaps(hash);

    expect(swap.closed).to.equal(true);

    // Verify token transfer
    const senderFinalBalance = await token.balanceOf(sender.address);
    expect(senderFinalBalance).to.equal(senderInitialBalance);
  });
});
