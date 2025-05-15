import { type NextRequest, NextResponse } from "next/server"
import { fetchExchangeRates, fetchAvailableCurrencies } from "@/lib/currency"

export async function GET(request: NextRequest) {
  try {
    // Check if we want all available currencies
    const searchParams = request.nextUrl.searchParams
    const getAll = searchParams.get("all") === "true"

    if (getAll) {
      const availableCurrencies = await fetchAvailableCurrencies()
      return NextResponse.json(availableCurrencies)
    } else {
      // Get exchange rates for supported currencies
      const exchangeRates = await fetchExchangeRates()
      return NextResponse.json(exchangeRates)
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 })
  }
}
