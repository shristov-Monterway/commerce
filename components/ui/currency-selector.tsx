"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"
import appConfig from "@/config/app-config"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { useCartStore } from "@/lib/cart"

export function CurrencySelector() {
  const { user } = useAuth()
  const setCurrency = useCartStore((state) => state.setCurrency)
  const [currentCurrency, setCurrentCurrency] = useState<string>(appConfig.defaultCurrency)

  useEffect(() => {
    // Get currency from localStorage or use default
    const storedCurrency = localStorage.getItem("preferredCurrency")
    if (storedCurrency && appConfig.supportedCurrencies.includes(storedCurrency)) {
      setCurrentCurrency(storedCurrency)
      setCurrency(storedCurrency)
    } else if (user?.preferredCurrency) {
      setCurrentCurrency(user.preferredCurrency)
      setCurrency(user.preferredCurrency)
      localStorage.setItem("preferredCurrency", user.preferredCurrency)
    }
  }, [user, setCurrency])

  const changeCurrency = async (currency: string) => {
    if (currency === currentCurrency) return

    setCurrentCurrency(currency)
    setCurrency(currency)
    localStorage.setItem("preferredCurrency", currency)

    // Update user preference in Firestore if logged in
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.id), {
          preferredCurrency: currency,
          updatedAt: new Date(),
        })
      } catch (error) {
        console.error("Error updating user currency preference:", error)
      }
    }
  }

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span>{currencySymbols[currentCurrency] || currentCurrency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {appConfig.supportedCurrencies.map((currency) => (
          <DropdownMenuItem key={currency} onClick={() => changeCurrency(currency)} className="flex items-center gap-2">
            <span>{currencySymbols[currency] || currency}</span>
            <span>{currency}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
