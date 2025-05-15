"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart"
import { useAuth } from "@/context/auth-context"
import { getProducts } from "@/lib/products"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { AddressForm } from "@/components/checkout/address-form"
import { ShippingMethod } from "@/components/checkout/shipping-method"
import { PaymentForm } from "@/components/checkout/payment-form"
import { OrderReview } from "@/components/checkout/order-review"
import { CartSummary } from "@/components/cart/cart-summary"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { getMessages, getTranslation } from "@/lib/i18n"
import { getCheckoutConfig } from "@/lib/layout-utils"
import type { Product, Address } from "@/types"

interface CheckoutPageProps {
  params: { lang: string }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { lang } = params
  const router = useRouter()
  const { items, currency, clearCart } = useCartStore()
  const { user, loading: authLoading } = useAuth()

  const [currentStep, setCurrentStep] = useState("cart")
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<any>({})
  const [t, setT] = useState<(key: string, params?: Record<string, any>) => string>(() => (key) => key)
  const [checkoutConfig, setCheckoutConfig] = useState<any>(null)

  // Checkout state
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [shippingMethod, setShippingMethod] = useState<string>("standard")
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [paymentDetails, setPaymentDetails] = useState<any>({})

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getMessages(lang)
      setMessages(msgs)
      setT(() => (key: string, params?: Record<string, any>) => getTranslation(msgs, key, params))
    }

    const fetchConfig = async () => {
      const config = await getCheckoutConfig(lang)
      setCheckoutConfig(config)
      setCurrentStep(config.steps[0])
    }

    fetchMessages()
    fetchConfig()
  }, [lang])

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0 && !isLoading) {
      router.push(`/${lang}/cart`)
    }

    // Redirect to login if not authenticated
    if (!authLoading && !user && !isLoading) {
      router.push(`/${lang}/auth/login?redirect=/checkout`)
    }

    // Set default shipping address if user is logged in
    if (user && user.shippingAddresses.length > 0) {
      const defaultAddress = user.shippingAddresses.find((addr) => addr.isDefault) || user.shippingAddresses[0]
      setShippingAddress(defaultAddress)
    }
  }, [items, authLoading, user, isLoading, router, lang])

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

  if (isLoading || authLoading || !checkoutConfig) {
    return <div className="container py-8">Loading...</div>
  }

  if (items.length === 0) {
    return null // Will redirect to cart
  }

  if (!user) {
    return null // Will redirect to login
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

  // Shipping options
  const shippingOptions = [
    {
      id: "standard",
      name: t("checkout.standardShipping"),
      description: t("checkout.standardShippingDescription"),
      price: 500,
      estimatedDelivery: t("checkout.standardShippingDelivery"),
    },
    {
      id: "express",
      name: t("checkout.expressShipping"),
      description: t("checkout.expressShippingDescription"),
      price: 1500,
      estimatedDelivery: t("checkout.expressShippingDelivery"),
    },
  ]

  const handleAddressSubmit = (address: Omit<Address, "id" | "isDefault">) => {
    setShippingAddress({
      ...address,
      id: "temp-id",
      isDefault: false,
    })

    const nextStepIndex = checkoutConfig.steps.indexOf("address") + 1
    if (nextStepIndex < checkoutConfig.steps.length) {
      setCurrentStep(checkoutConfig.steps[nextStepIndex])
    }
  }

  const handleShippingMethodSelect = (methodId: string) => {
    setShippingMethod(methodId)
  }

  const handleShippingContinue = () => {
    const nextStepIndex = checkoutConfig.steps.indexOf("shipping") + 1
    if (nextStepIndex < checkoutConfig.steps.length) {
      setCurrentStep(checkoutConfig.steps[nextStepIndex])
    }
  }

  const handlePaymentSubmit = (method: string, details: any) => {
    setPaymentMethod(method)
    setPaymentDetails(details)

    const nextStepIndex = checkoutConfig.steps.indexOf("payment") + 1
    if (nextStepIndex < checkoutConfig.steps.length) {
      setCurrentStep(checkoutConfig.steps[nextStepIndex])
    }
  }

  const handlePlaceOrder = () => {
    // In a real app, this would call an API to create the order
    console.log("Placing order...")

    // Clear cart and redirect to success page
    clearCart()
    router.push(`/${lang}/checkout/success`)
  }

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.cart"), href: `/${lang}/cart` },
          { label: t("checkout.title"), href: `/${lang}/checkout` },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">{t("checkout.title")}</h1>

      <CheckoutSteps currentStep={currentStep} lang={lang} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {currentStep === "address" && (
            <AddressForm address={shippingAddress || undefined} onSubmit={handleAddressSubmit} lang={lang} />
          )}

          {currentStep === "shipping" && (
            <ShippingMethod
              options={shippingOptions}
              selectedOption={shippingMethod}
              currency={currency}
              onSelect={handleShippingMethodSelect}
              onContinue={handleShippingContinue}
              lang={lang}
            />
          )}

          {currentStep === "payment" && <PaymentForm onSubmit={handlePaymentSubmit} lang={lang} />}

          {currentStep === "review" && shippingAddress && (
            <OrderReview
              items={items}
              products={products}
              shippingAddress={shippingAddress}
              shippingMethod={shippingMethod}
              paymentMethod={paymentMethod}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              currency={currency}
              onPlaceOrder={handlePlaceOrder}
              lang={lang}
            />
          )}
        </div>

        {checkoutConfig.showOrderSummary && (
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
        )}
      </div>
    </div>
  )
}
