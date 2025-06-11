import hre from "hardhat";
import { parseUnits, formatUnits } from "viem";

/**
 * Deploys MockUSDC + PreMarketFactory, seeds two sample markets, and prints
 * the addresses in a format that can be pasted straight into .env.local.
 *
 * Usage:
 *   npx hardhat run scripts/deploy.ts --network hardhat   (local ephemeral)
 *   npx hardhat run scripts/deploy.ts --network localhost  (persistent node)
 *   npx hardhat run scripts/deploy.ts --network sepolia
 */
async function main() {
  const viem = hre.viem;
  const [deployer, resolver] = await viem.getWalletClients();

  console.log(`\nDeploying from : ${deployer.account.address}`);
  console.log(`Resolver       : ${resolver.account.address}`);
  console.log(`Network        : ${hre.network.name}\n`);

  // ── 1. MockUSDC ──────────────────────────────────────────────────────────
  const usdc = await viem.deployContract("MockUSDC");
  console.log(`MockUSDC       : ${usdc.address}`);

  // ── 2. PreMarketFactory ───────────────────────────────────────────────────
  const factory = await viem.deployContract("PreMarketFactory", [
    usdc.address,
    resolver.account.address,
  ]);
  console.log(`PreMarketFactory: ${factory.address}`);

  // ── 3. Seed the deployer with USDC and create two sample markets ──────────
  const mintAmount = parseUnits("50000", 6); // 50 000 mUSDC
  await usdc.write.mint([deployer.account.address, mintAmount]);

  const seedPerMarket = parseUnits("1000", 6);
  await usdc.write.approve([factory.address, seedPerMarket * 2n]);

  const publicClient = await viem.getPublicClient();
  const latest = await publicClient.getBlock();
  const oneWeek = 60n * 60n * 24n * 7n;
  const oneMonth = 60n * 60n * 24n * 30n;

  await factory.write.createMarket([
    "Will Project X launch a token before end of Q3 2025?",
    latest.timestamp + oneWeek,
    seedPerMarket,
  ]);

  await factory.write.createMarket([
    "Will Protocol Y airdrop snapshot include holders before block 20000000?",
    latest.timestamp + oneMonth,
    seedPerMarket,
  ]);

  const len = await factory.read.marketsLength();
  console.log(`\nSample markets created: ${len}`);
  for (let i = 0n; i < len; i++) {
    const addr = await factory.read.markets([i]);
    const market = await viem.getContractAt("PreMarket", addr);
    const q = await market.read.question();
    const pYes = await market.read.priceYes();
    console.log(`  [${i}] ${addr}  YES=${(Number(formatUnits(pYes, 18)) * 100).toFixed(1)}¢  "${q}"`);
  }

  console.log(`
─────────────────────────────────────────────
Add to your .env.local (Next.js frontend):

NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_FACTORY_ADDRESS=${factory.address}
─────────────────────────────────────────────
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
