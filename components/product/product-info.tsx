"use client"

import React from "react"
import { useState } from "react"
import { formatPrice } from "@/lib/currency"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Share2 } from "lucide-react"
import type { Product, ProductVariationType } from "@/types"
import appConfig from "@/config/app-config"
import { getProductDetailConfig } from "@/lib/layout-utils"
import { getMessages, getTranslation } from "@/lib/i18n"
import { useCartStore } from "@/lib/cart"

interface ProductInfoProps {
  product: Product
  selectedVariation: ProductVariationType
  lang: string
}

export function ProductInfo({ product, selectedVariation, lang }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [messages, setMessages] = useState<any>({})
  const [t, setT] = useState<(key: string, params?: Record<string, any>) => string>(() => (key) => key)
  const addToCart = useCartStore((state) => state.addItem)

  const productDetailConfig = getProductDetailConfig(lang)

  // Load messages
  React.useEffect(() => {
    const loadMessages = async () => {
      const msgs = await getMessages(lang)
      setMessages(msgs)
      setT(() => (key: string, params?: Record<string, any>) => getTranslation(msgs, key, params))
    }
    loadMessages()
  }, [lang])

  const price = selectedVariation.price
  const isOnSale = selectedVariation.compareAtPrice && selectedVariation.compareAtPrice > price
  const isOutOfStock = selectedVariation.inventory <= 0 || !selectedVariation.isActive
  const discount =
    isOnSale && selectedVariation.compareAtPrice
      ? Math.round(((selectedVariation.compareAtPrice - price) / selectedVariation.compareAtPrice) * 100)
      : 0

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(product.id, quantity, selectedVariation.id)
    // Show confirmation or redirect to cart
  }

  // Get all attributes for this variation
  const attributesList = selectedVariation.attributes.map((attr) => {
    const attrName = attr.name[lang] || attr.name[appConfig.defaultLanguage]
    const options = attr.options.map((opt) => opt.name[lang] || opt.name[appConfig.defaultLanguage]).join(", ")
    return { name: attrName, options }
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Product information */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          {product.name[lang] || product.name[appConfig.defaultLanguage]}
        </h1>
        <div className="mt-2 prose prose-sm max-w-none">
          <p>{product.description[lang] || product.description[appConfig.defaultLanguage]}</p>
        </div>
      </div>

      <Separator />

      {/* Variation information */}
      <div>
        <h2 className="text-xl font-semibold">
          {selectedVariation.name[lang] || selectedVariation.name[appConfig.defaultLanguage]}
        </h2>

        <div className="mt-2 flex items-center gap-2">
          <div className="text-2xl font-bold">{formatPrice(price, appConfig.defaultCurrency)}</div>
          {isOnSale && selectedVariation.compareAtPrice && (
            <>
              <div className="text-lg text-muted-foreground line-through">
                {formatPrice(selectedVariation.compareAtPrice, appConfig.defaultCurrency)}
              </div>
              <Badge variant="destructive">-{discount}%</Badge>
            </>
          )}
        </div>

        <div className="mt-4 prose prose-sm max-w-none">
          <p>{selectedVariation.description[lang] || selectedVariation.description[appConfig.defaultLanguage]}</p>
        </div>

        {/* Attributes */}
        {attributesList.length > 0 && (
          <div className="mt-4 space-y-2">
            {attributesList.map((attr, index) => (
              <div key={index} className="flex">
                <span className="font-medium min-w-[100px]">{attr.name}:</span>
                <span>{attr.options}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-shrink-0">
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              {t("products.quantity")}
            </label>
            {productDetailConfig.showQuantitySelector ? (
              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="h-10 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={isOutOfStock}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                >
                  +
                </Button>
              </div>
            ) : (
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="h-10 w-20"
                disabled={isOutOfStock}
              />
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{t("products.availability")}</label>
            <div>
              {isOutOfStock ? (
                <Badge variant="secondary">{t("products.outOfStock")}</Badge>
              ) : (
                <Badge variant="default" className="bg-green-500">
                  {t("products.inStock")} ({selectedVariation.inventory})
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isOutOfStock}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {t("products.addToCart")}
          </Button>
          <Button size="lg" variant="outline">
            <Heart className="mr-2 h-5 w-5" />
            {t("products.addToWishlist")}
          </Button>
          {productDetailConfig.showSocialSharing && (
            <Button size="lg" variant="outline">
              <Share2 className="mr-2 h-5 w-5" />
              {t("products.share")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
