"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/currency"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDelivery: string
}

interface ShippingMethodProps {
  options: ShippingOption[]
  selectedOption?: string
  currency: string
  onSelect: (optionId: string) => void
  onContinue: () => void
  lang: string
}

export async function ShippingMethod({
  options,
  selectedOption,
  currency,
  onSelect,
  onContinue,
  lang,
}: ShippingMethodProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const [selected, setSelected] = useState(selectedOption || options[0]?.id)

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">{t("checkout.selectShippingMethod")}</h2>

      <RadioGroup value={selected} onValueChange={handleSelect} className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 rounded-md border p-4">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex flex-1 justify-between cursor-pointer">
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
                <div className="text-sm text-muted-foreground">{option.estimatedDelivery}</div>
              </div>
              <div className="font-medium">{formatPrice(option.price, currency)}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button onClick={onContinue} className="w-full">
        {t("checkout.continueToPayment")}
      </Button>
    </div>
  )
}
