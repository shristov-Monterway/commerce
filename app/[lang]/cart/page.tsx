"use client"

import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/cart"
import { getProducts } from "@/lib/products"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { getMessages, getTranslation } from "@/lib/i18n"
import type { Product } from "@/types"

interface CartPageProps {
  params: { lang: string }
}

export default function CartPage({ params }: CartPageProps) {
  const { lang } = params
  const { items, currency, updateQuantity, removeItem } = useCartStore()

  const [products, setProducts] = useState<Record<string, Product>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<any>({})
  const [t, setT] = useState<(key: string, params?: Record<string, any>) => string>(() => (key) => key)

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getMessages(lang)
      setMessages(msgs)
      setT(() => (key: string, params?: Record<string, any>) => getTranslation(msgs, key, params))
    }

    fetchMessages()
  }, [lang])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (items.length === 0) {
          setIsLoading(false)
          return
        }

        const productIds = items.map((item) => item.productId)
        const allProducts = await getProducts()

        const productMap: Record<string, Product> = {}
        allProducts.forEach((product) => {
          if (productIds.includes(product.id)) {
            productMap[product.id] = product
          }
        })

        setProducts(productMap)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [items])

  if (isLoading) {
    return <div className="container py-8">Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <EmptyCart lang={lang} />
      </div>
    )
  }

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    const product = products[item.productId]
    if (product) {
      return total + product.price * item.quantity
    }
    return total
  }, 0)

  // Estimated tax (example: 10%)
  const tax = Math.round(subtotal * 0.1)

  // Shipping (example: flat rate)
  const shipping = 500 // $5.00 in cents

  // Total
  const total = subtotal + tax + shipping

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.cart"), href: `/${lang}/cart` },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">{t("cart.title")}</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            {items.map((item) => {
              const product = products[item.productId]
              if (!product) return null

              return (
                <CartItem
                  key={item.productId}
                  item={item}
                  product={product}
                  lang={lang}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              )
            })}
          </div>
        </div>

        <div>
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
            currency={currency}
            lang={lang}
          />
        </div>
      </div>
    </div>
  )
}
