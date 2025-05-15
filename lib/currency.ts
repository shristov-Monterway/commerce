import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { ExchangeRates } from "@/types"
import appConfig from "@/config/app-config"

// Function to fetch exchange rates from API
export const fetchExchangeRates = async () => {
  try {
    const baseCurrency = appConfig.defaultCurrency.toLowerCase()

    // Fetch exchange rates for the base currency
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()

    // The API returns data in the format { date: "YYYY-MM-DD", [baseCurrency]: { [currencyCode]: rate, ... } }
    const ratesData = data[baseCurrency]

    // Filter only supported currencies
    const filteredRates: Record<string, number> = {}

    appConfig.supportedCurrencies.forEach((currency) => {
      const currencyLower = currency.toLowerCase()
      if (ratesData[currencyLower]) {
        // Store with uppercase currency code for consistency in our app
        filteredRates[currency.toUpperCase()] = ratesData[currencyLower]
      }
    })

    const exchangeRates: ExchangeRates = {
      base: baseCurrency.toUpperCase(),
      rates: filteredRates,
      lastUpdated: Date.now(),
    }

    // Save to Firestore
    await setDoc(doc(db, "exchangeRates", "current"), exchangeRates)

    return exchangeRates
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    throw error
  }
}

// Function to get all available currencies
export const fetchAvailableCurrencies = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json")

    if (!response.ok) {
      throw new Error("Failed to fetch available currencies")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching available currencies:", error)
    throw error
  }
}

// Function to get exchange rates from Firestore
export const getExchangeRates = async (): Promise<ExchangeRates> => {
  try {
    const docRef = doc(db, "exchangeRates", "current")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as ExchangeRates
    } else {
      // If no exchange rates exist, fetch them
      return await fetchExchangeRates()
    }
  } catch (error) {
    console.error("Error getting exchange rates:", error)
    throw error
  }
}

// Function to convert price from base currency to target currency
export const convertPrice = async (priceInCents: number, targetCurrency: string): Promise<number> => {
  try {
    const baseCurrency = appConfig.defaultCurrency

    // If target currency is the same as base, no conversion needed
    if (targetCurrency === baseCurrency) {
      return priceInCents
    }

    const exchangeRates = await getExchangeRates()

    // Check if rates are stale (older than 24 hours)
    const oneDayInMs = 24 * 60 * 60 * 1000
    if (Date.now() - exchangeRates.lastUpdated > oneDayInMs) {
      // Fetch fresh rates
      await fetchExchangeRates()
      return await convertPrice(priceInCents, targetCurrency)
    }

    const rate = exchangeRates.rates[targetCurrency]

    if (!rate) {
      throw new Error(`Exchange rate not found for ${targetCurrency}`)
    }

    // Convert price and round to nearest cent
    return Math.round(priceInCents * rate)
  } catch (error) {
    console.error("Error converting price:", error)
    // Return original price if conversion fails
    return priceInCents
  }
}

// Format price for display
export const formatPrice = (priceInCents: number, currency: string): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(priceInCents / 100)
}
