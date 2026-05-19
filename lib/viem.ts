import { createPublicClient, http, defineChain, type PublicClient } from "viem"
import { hardhat, sepolia } from "viem/chains"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? ""
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 31337)

const localhost = defineChain({
  ...hardhat,
  rpcUrls: {
    default: { http: [RPC_URL || "http://127.0.0.1:8545"] },
  },
})

export const chain = CHAIN_ID === 11155111 ? sepolia : localhost

/// Lazily-built read-only client. Returns `null` when no RPC has been
/// configured so the marketing page can still render statically.
let _client: PublicClient | null | undefined
export function getPublicClient(): PublicClient | null {
  if (_client !== undefined) return _client
  if (!RPC_URL && CHAIN_ID !== 31337) {
    _client = null
    return _client
  }
  _client = createPublicClient({
    chain,
    transport: http(RPC_URL || undefined),
  }) as PublicClient
  return _client
}

export const FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_FACTORY_ADDRESS ??
  "") as `0x${string}` | ""
