"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import type { CartItem as CartItemType, Product } from "@/types"
import appConfig from "@/config/app-config"
import { getCartConfig } from "@/lib/layout-utils"
import { getMessages, getTranslation } from "@/lib/i18n"

interface CartItemProps {
  item: CartItemType
  product: Product
  lang: string
  onUpdateQuantity: (productId: string, quantity: number, variationId: string) => void
  onRemove: (productId: string, variationId: string) => void
}

export async function CartItem({ item, product, lang, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const cartConfig = getCartConfig(lang)
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Get the variation
  const variation = product.variations.find((v) => v.id === item.variationId)

  if (!variation) {
    return null // Variation not found
  }

  const price = variation.price

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
      onUpdateQuantity(item.productId, value, item.variationId)
    }
  }

  const itemTotal = price * item.quantity

  return (
    <div className="flex py-6 border-b">
      {cartConfig.showThumbnails && (
        <div className="flex-shrink-0 w-24 h-24 relative rounded overflow-hidden mr-4">
          <Link href={`/${lang}/products/${product.id}/${variation.id}`}>
            <Image
              src={variation.images[0] || "/placeholder.svg?height=96&width=96&query=product"}
              alt={variation.name[lang] || variation.name[appConfig.defaultLanguage]}
              fill
              className="object-cover"
            />
          </Link>
        </div>
      )}

      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <Link href={`/${lang}/products/${product.id}/${variation.id}`} className="font-medium hover:underline">
              {product.name[lang] || product.name[appConfig.defaultLanguage]}
            </Link>

            {/* Display variation name */}
            <p className="text-sm mt-1">{variation.name[lang] || variation.name[appConfig.defaultLanguage]}</p>

            <p className="text-sm text-muted-foreground mt-1">
              {t("products.sku")}: {variation.sku}
            </p>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatPrice(itemTotal, appConfig.defaultCurrency)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {formatPrice(price, appConfig.defaultCurrency)} {t("cart.each")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => onUpdateQuantity(item.productId, Math.max(1, quantity - 1), item.variationId)}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => onUpdateQuantity(item.productId, quantity + 1, item.variationId)}
            >
              +
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.productId, item.variationId)}>
            <Trash2 className="h-4 w-4 mr-1" />
            {t("cart.remove")}
          </Button>
        </div>
      </div>
    </div>
  )
}
