import { TradePage } from "@/components/trade-page"
import { getToken } from "@/lib/token-data"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ ticker: string }> }

export async function generateMetadata({ params }: Props) {
  const resolved = await params
  const token = getToken(resolved?.ticker)
  if (!token) return { title: "Market Not Found | Prequel" }
  return {
    title: `Trade ${token.ticker} — ${token.name} | Prequel`,
    description: token.question,
  }
}

export default async function Page({ params }: Props) {
  const resolved = await params
  const token = getToken(resolved?.ticker)
  if (!token) notFound()
  // notFound() throws, so token is defined here — cast to avoid TS error
  return <TradePage token={token!} />
}
