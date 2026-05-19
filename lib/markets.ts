import { formatUnits } from "viem"
import { getPublicClient, FACTORY_ADDRESS } from "./viem"
import { factoryAbi, marketAbi } from "./contracts"

export type LiveMarket = {
  address: `0x${string}`
  question: string
  expiry: number // unix seconds
  priceYes: number // 0..1
  priceNo: number // 0..1
  resolved: boolean
}

/// Returns null when the chain is not configured so callers can fall back to
/// the curated copy bundled in the marketing page.
export async function getLiveMarkets(): Promise<LiveMarket[] | null> {
  const client = getPublicClient()
  if (!client || !FACTORY_ADDRESS) return null

  try {
    const addrs = (await client.readContract({
      address: FACTORY_ADDRESS as `0x${string}`,
      abi: factoryAbi,
      functionName: "allMarkets",
    })) as readonly `0x${string}`[]

    if (addrs.length === 0) return []

    const reads = addrs.flatMap((address) => [
      { address, abi: marketAbi, functionName: "question" as const },
      { address, abi: marketAbi, functionName: "expiry" as const },
      { address, abi: marketAbi, functionName: "priceYes" as const },
      { address, abi: marketAbi, functionName: "priceNo" as const },
      { address, abi: marketAbi, functionName: "outcome" as const },
    ])

    const results = await client.multicall({ contracts: reads, allowFailure: false })

    return addrs.map((address, i): LiveMarket => {
      const base = i * 5
      const question = results[base] as string
      const expiry = Number(results[base + 1] as bigint)
      const pYes = results[base + 2] as bigint
      const pNo = results[base + 3] as bigint
      const outcome = Number(results[base + 4] as number | bigint)
      return {
        address,
        question,
        expiry,
        priceYes: Number(formatUnits(pYes, 18)),
        priceNo: Number(formatUnits(pNo, 18)),
        resolved: outcome !== 0,
      }
    })
  } catch {
    return null
  }
}
