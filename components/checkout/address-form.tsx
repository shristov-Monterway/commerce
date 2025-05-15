"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMessages, getTranslation } from "@/lib/i18n"
import type { Address } from "@/types"

interface AddressFormProps {
  address?: Address
  onSubmit: (address: Omit<Address, "id" | "isDefault">) => void
  onCancel?: () => void
  lang: string
}

export async function AddressForm({ address, onSubmit, onCancel, lang }: AddressFormProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const [formData, setFormData] = useState({
    name: address?.name || "",
    line1: address?.line1 || "",
    line2: address?.line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    country: address?.country || "",
    phone: address?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t("checkout.fullName")}</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="line1">{t("checkout.addressLine1")}</Label>
        <Input id="line1" name="line1" value={formData.line1} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="line2">{t("checkout.addressLine2")}</Label>
        <Input id="line2" name="line2" value={formData.line2} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">{t("checkout.city")}</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="state">{t("checkout.stateProvince")}</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">{t("checkout.postalCode")}</Label>
          <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="country">{t("checkout.country")}</Label>
          <Select value={formData.country} onValueChange={handleCountryChange} required>
            <SelectTrigger id="country">
              <SelectValue placeholder={t("checkout.selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="ES">Spain</SelectItem>
              <SelectItem value="IT">Italy</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="phone">{t("checkout.phoneNumber")}</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit">{t("common.save")}</Button>
      </div>
    </form>
  )
}
