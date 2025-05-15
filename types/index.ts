export interface TranslatedText {
  [key: string]: string // language code as key, translated text as value
}

// Alias for backward compatibility
export type TranslationType = TranslatedText

export interface Category {
  id: string
  name: TranslationType
  description: TranslationType
  slug: TranslationType
  parentId: string | null
  image: string
  createdAt: number
  updatedAt: number
}

export interface ProductTag {
  id: string
  name: TranslationType
}

export interface ProductVariationType {
  id: string
  name: TranslationType
  description: TranslationType
  slug: string // Variation slug
  price: number
  compareAtPrice: number | null
  images: string[]
  weight: number
  sku: string
  inventory: number
  isActive: boolean
  createdAt: number
  updatedAt: number
  attributes: {
    // unique id of this attribute like 'size', 'color'
    id: string
    name: TranslationType
    options: {
      // unique id of this option like 's', '41', 'm'
      id: string
      name: TranslationType
    }[]
  }[]
}

export interface ProductType {
  id: string
  name: TranslationType
  description: TranslationType
  slug: TranslationType // Product slug (translated)
  categoryIds: string[]
  tags: ProductTag[]
  variations: ProductVariationType[]
}

// Alias for backward compatibility
export type Product = ProductType

export interface User {
  id: string
  email: string | null
  displayName: string
  phoneNumber?: string | null
  preferredLanguage: string
  preferredCurrency: string
  isAdmin: boolean
  shippingAddresses: Address[]
  createdAt: number
  updatedAt: number
}

export interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface CartItem {
  productId: string
  variationId: string // Now required since all products have variations
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number // in cents
  tax: number // in cents
  shipping: number // in cents
  total: number // in cents
  currency: string
  shippingAddress: Address
  paymentStatus: "pending" | "paid" | "failed"
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "partially_fulfilled"
  stripeCheckoutId?: string
  stripePaymentIntentId?: string
  createdAt: number
  updatedAt: number
}

export interface OrderItem {
  productId: string
  variationId: string
  productSnapshot: {
    name: TranslationType
    price: number
    image: string
  }
  quantity: number
  price: number // in cents, at time of purchase
}

export interface ExchangeRates {
  base: string
  rates: Record<string, number>
  lastUpdated: number
}

// Helper type for attribute filters
export interface AttributeFilter {
  attributeId: string
  attributeName: TranslationType
  options: {
    id: string
    name: TranslationType
    count: number
  }[]
}
