import { expect } from "chai";
import hre from "hardhat";
import { parseUnits, getAddress } from "viem";

const ONE = 10n ** 18n;

async function deployFixture() {
  const viem = hre.viem;
  const [creator, trader, resolver, other] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const usdc = await viem.deployContract("MockUSDC");
  const factory = await viem.deployContract("PreMarketFactory", [
    usdc.address,
    resolver.account.address,
  ]);

  const tenK = parseUnits("10000", 6);
  await usdc.write.mint([creator.account.address, tenK]);
  await usdc.write.mint([trader.account.address, tenK]);

  return { viem, publicClient, creator, trader, resolver, other, usdc, factory };
}

async function makeMarket(opts?: { seed?: bigint; horizonSec?: number }) {
  const f = await deployFixture();
  const seed = opts?.seed ?? parseUnits("1000", 6);
  const horizon = opts?.horizonSec ?? 60 * 60 * 24;

  const latest = await f.publicClient.getBlock();
  const expiry = latest.timestamp + BigInt(horizon);

  // The creator approves the factory then creates the market.
  const creatorUsdc = await f.viem.getContractAt("MockUSDC", f.usdc.address, {
    client: { wallet: f.creator },
  });
  await creatorUsdc.write.approve([f.factory.address, seed]);

  const creatorFactory = await f.viem.getContractAt(
    "PreMarketFactory",
    f.factory.address,
    { client: { wallet: f.creator } }
  );
  await creatorFactory.write.createMarket([
    "Will Project X launch a token by EOY?",
    expiry,
    seed,
  ]);

  const marketAddr = await f.factory.read.markets([0n]);
  const market = await f.viem.getContractAt("PreMarket", marketAddr);

  return { ...f, market, expiry, seed };
}

describe("PreMarket", () => {
  it("deploys with seeded reserves and reports a 50/50 price", async () => {
    const { market, seed } = await makeMarket();
    expect(await market.read.reserveYes()).to.equal(seed);
    expect(await market.read.reserveNo()).to.equal(seed);
    expect(await market.read.initialized()).to.equal(true);
    expect(await market.read.priceYes()).to.equal(ONE / 2n);
    expect(await market.read.priceNo()).to.equal(ONE / 2n);
  });

  it("buy(YES) raises priceYes, lowers priceNo, respects minOut", async () => {
    const { market, trader, viem, usdc } = await makeMarket();
    const amountIn = parseUnits("100", 6);

    const traderUsdc = await viem.getContractAt("MockUSDC", usdc.address, {
      client: { wallet: trader },
    });
    await traderUsdc.write.approve([market.address, amountIn]);

    const traderMarket = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: trader },
    });

    await expect(
      traderMarket.write.buy([true, amountIn, amountIn * 10n])
    ).to.be.rejected;

    await traderMarket.write.buy([true, amountIn, 0n]);

    const yesBal = await market.read.yesBalance([trader.account.address]);
    expect(yesBal > amountIn).to.equal(true);

    const pYes = await market.read.priceYes();
    const pNo = await market.read.priceNo();
    expect(pYes > ONE / 2n).to.equal(true);
    expect(pNo < ONE / 2n).to.equal(true);
    const sum = pYes + pNo;
    expect(sum >= ONE - 2n && sum <= ONE + 2n).to.equal(true);
  });

  it("sell returns collateral and moves price back toward seed", async () => {
    const { market, trader, viem, usdc } = await makeMarket();
    const amountIn = parseUnits("100", 6);

    const traderUsdc = await viem.getContractAt("MockUSDC", usdc.address, {
      client: { wallet: trader },
    });
    await traderUsdc.write.approve([market.address, amountIn]);

    const traderMarket = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: trader },
    });
    await traderMarket.write.buy([true, amountIn, 0n]);

    const yesAfterBuy = await market.read.yesBalance([trader.account.address]);
    const priceAfterBuy = await market.read.priceYes();
    const usdcBeforeSell = await usdc.read.balanceOf([trader.account.address]);

    const sellAmt = yesAfterBuy / 2n;
    await traderMarket.write.sell([true, sellAmt, 0n]);

    const usdcAfterSell = await usdc.read.balanceOf([trader.account.address]);
    expect(usdcAfterSell > usdcBeforeSell).to.equal(true);
    expect((await market.read.priceYes()) < priceAfterBuy).to.equal(true);
  });

  it("resolve before expiry reverts; non-resolver reverts", async () => {
    const { market, resolver, other, viem } = await makeMarket();

    const asResolver = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: resolver },
    });
    await expect(asResolver.write.resolve([1])).to.be.rejected;

    const asOther = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: other },
    });
    await expect(asOther.write.resolve([1])).to.be.rejected;
  });

  it("winners redeem 1 USDC per share, losers redeem 0", async () => {
    const { market, trader, resolver, other, usdc, viem } = await makeMarket();
    const amountIn = parseUnits("100", 6);

    // Trader bets YES.
    const traderUsdc = await viem.getContractAt("MockUSDC", usdc.address, {
      client: { wallet: trader },
    });
    await traderUsdc.write.approve([market.address, amountIn]);
    const traderMarket = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: trader },
    });
    await traderMarket.write.buy([true, amountIn, 0n]);

    // Other bets NO. Fund them first.
    await usdc.write.mint([other.account.address, amountIn]);
    const otherUsdc = await viem.getContractAt("MockUSDC", usdc.address, {
      client: { wallet: other },
    });
    await otherUsdc.write.approve([market.address, amountIn]);
    const otherMarket = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: other },
    });
    await otherMarket.write.buy([false, amountIn, 0n]);

    // Fast-forward past expiry.
    const testClient = await viem.getTestClient();
    await testClient.increaseTime({ seconds: 60 * 60 * 24 + 1 });
    await testClient.mine({ blocks: 1 });

    const asResolver = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: resolver },
    });
    await asResolver.write.resolve([1]);
    expect(await market.read.outcome()).to.equal(1);

    const winnerBefore = await usdc.read.balanceOf([trader.account.address]);
    const winnerShares = await market.read.yesBalance([trader.account.address]);
    await traderMarket.write.redeem();
    const winnerAfter = await usdc.read.balanceOf([trader.account.address]);
    expect(winnerAfter - winnerBefore).to.equal(winnerShares);

    // Loser holds NO; redeem should revert with "nothing".
    await expect(otherMarket.write.redeem()).to.be.rejected;
  });

  it("creator reclaims winning-side seed after resolution", async () => {
    const { market, creator, resolver, usdc, viem } = await makeMarket();

    const testClient = await viem.getTestClient();
    await testClient.increaseTime({ seconds: 60 * 60 * 24 + 1 });
    await testClient.mine({ blocks: 1 });

    const asResolver = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: resolver },
    });
    await asResolver.write.resolve([1]);

    const before = await usdc.read.balanceOf([creator.account.address]);
    const reserveYes = await market.read.reserveYes();
    const asCreator = await viem.getContractAt("PreMarket", market.address, {
      client: { wallet: creator },
    });
    await asCreator.write.claimSeed();
    const after = await usdc.read.balanceOf([creator.account.address]);

    expect(after - before).to.equal(reserveYes);
  });
});

describe("PreMarketFactory", () => {
  it("creates markets and indexes them", async () => {
    const f = await deployFixture();
    const seed = parseUnits("500", 6);
    const latest = await f.publicClient.getBlock();
    const expiry = latest.timestamp + 60n * 60n * 24n;

    const creatorUsdc = await f.viem.getContractAt("MockUSDC", f.usdc.address, {
      client: { wallet: f.creator },
    });
    await creatorUsdc.write.approve([f.factory.address, seed * 2n]);

    const creatorFactory = await f.viem.getContractAt(
      "PreMarketFactory",
      f.factory.address,
      { client: { wallet: f.creator } }
    );

    await creatorFactory.write.createMarket(["Market A", expiry, seed]);
    await creatorFactory.write.createMarket(["Market B", expiry, seed]);

    expect(await f.factory.read.marketsLength()).to.equal(2n);

    const a = await f.factory.read.markets([0n]);
    const b = await f.factory.read.markets([1n]);
    expect(getAddress(a)).to.not.equal(getAddress(b));

    const mA = await f.viem.getContractAt("PreMarket", a);
    expect(await mA.read.question()).to.equal("Market A");
    expect(getAddress(await mA.read.creator())).to.equal(
      getAddress(f.creator.account.address)
    );
  });
});
