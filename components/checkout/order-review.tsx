"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/currency"
import { getMessages, getTranslation } from "@/lib/i18n"
import type { CartItem, Product, Address } from "@/types"
import appConfig from "@/config/app-config"

interface OrderReviewProps {
  items: CartItem[]
  products: Record<string, Product>
  shippingAddress: Address
  shippingMethod: string
  paymentMethod: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  onPlaceOrder: () => void
  lang: string
}

export async function OrderReview({
  items,
  products,
  shippingAddress,
  shippingMethod,
  paymentMethod,
  subtotal,
  tax,
  shipping,
  total,
  currency,
  onPlaceOrder,
  lang,
}: OrderReviewProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">{t("checkout.orderItems")}</h2>
        <div className="space-y-4">
          {items.map((item) => {
            const product = products[item.productId]
            if (!product) return null

            return (
              <div key={item.productId} className="flex gap-4">
                <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images[0] || "/placeholder.svg?height=64&width=64&query=product"}
                    alt={product.name[lang] || product.name[appConfig.defaultLanguage]}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{product.name[lang] || product.name[appConfig.defaultLanguage]}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("checkout.quantity")}: {item.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(product.price * item.quantity, currency)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(product.price, currency)} {t("cart.each")}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-4">{t("checkout.shippingAddress")}</h2>
          <div className="p-4 border rounded-md">
            <div className="font-medium">{shippingAddress.name}</div>
            <div>{shippingAddress.line1}</div>
            {shippingAddress.line2 && <div>{shippingAddress.line2}</div>}
            <div>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
            </div>
            <div>{shippingAddress.country}</div>
            <div>{shippingAddress.phone}</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">{t("checkout.paymentMethod")}</h2>
          <div className="p-4 border rounded-md">
            <div className="font-medium">
              {paymentMethod === "credit-card"
                ? t("checkout.creditCard")
                : paymentMethod === "paypal"
                  ? "PayPal"
                  : paymentMethod}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">{t("checkout.orderSummary")}</h2>
        <div className="p-4 border rounded-md">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.tax")}</span>
              <span>{formatPrice(tax, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span>{shipping === 0 ? t("cart.free") : formatPrice(shipping, currency)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={onPlaceOrder} className="w-full">
        {t("checkout.placeOrder")}
      </Button>
    </div>
  )
}
