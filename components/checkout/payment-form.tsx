"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getMessages, getTranslation } from "@/lib/i18n"
import { CreditCard, Wallet } from "lucide-react"

interface PaymentFormProps {
  onSubmit: (paymentMethod: string, paymentDetails: any) => void
  lang: string
}

export async function PaymentForm({ onSubmit, lang }: PaymentFormProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(paymentMethod, paymentMethod === "credit-card" ? cardDetails : {})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <RadioGroupItem value="credit-card" id="credit-card" />
          <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-5 w-5" />
            {t("checkout.creditCard")}
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
            <Wallet className="h-5 w-5" />
            PayPal
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === "credit-card" && (
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={handleCardDetailsChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="cardName">{t("checkout.nameOnCard")}</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={cardDetails.cardName}
              onChange={handleCardDetailsChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">{t("checkout.expiryDate")}</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleCardDetailsChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvv">{t("checkout.cvv")}</Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={handleCardDetailsChange}
                required
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="p-4 bg-muted rounded-md text-center">
          <p>{t("checkout.paypalMessage")}</p>
        </div>
      )}

      <Button type="submit" className="w-full">
        {t("checkout.placeOrder")}
      </Button>
    </form>
  )
}
