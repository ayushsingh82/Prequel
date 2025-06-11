import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? "";
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: { chainId: 31337 },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ...(SEPOLIA_RPC && PRIVATE_KEY
      ? {
          sepolia: {
            url: SEPOLIA_RPC,
            chainId: 11155111,
            accounts: [PRIVATE_KEY],
          },
        }
      : {}),
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: process.env.CI ? "gas-report.txt" : undefined,
    noColors: !!process.env.CI,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY ?? "",
  },
};

export default config;
