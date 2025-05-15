import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product } from "@/types"
import { convertPrice } from "@/lib/currency"

interface CartStore {
  items: CartItem[]
  currency: string
  addItem: (productId: string, quantity: number, variationId: string) => void
  removeItem: (productId: string, variationId: string) => void
  updateQuantity: (productId: string, quantity: number, variationId: string) => void
  clearCart: () => void
  setCurrency: (currency: string) => void
  getCartTotal: (products: Record<string, Product>) => Promise<number>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: "USD",

      addItem: (productId, quantity = 1, variationId) => {
        const { items } = get()

        // Check if the item with the same product and variation already exists
        const existingItemIndex = items.findIndex(
          (item) => item.productId === productId && item.variationId === variationId,
        )

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          // Add new item
          set({ items: [...items, { productId, quantity, variationId }] })
        }
      },

      removeItem: (productId, variationId) => {
        const { items } = get()
        const updatedItems = items.filter((item) => !(item.productId === productId && item.variationId === variationId))
        set({ items: updatedItems })
      },

      updateQuantity: (productId, quantity, variationId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variationId)
          return
        }

        const { items } = get()
        const updatedItems = items.map((item) => {
          if (item.productId === productId && item.variationId === variationId) {
            return { ...item, quantity }
          }
          return item
        })
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [] })
      },

      setCurrency: (currency) => {
        set({ currency })
      },

      getCartTotal: async (products) => {
        const { items, currency } = get()
        let total = 0

        for (const item of items) {
          const product = products[item.productId]
          if (product) {
            const variation = product.variations.find((v) => v.id === item.variationId)
            if (variation) {
              // Convert variation price to the cart currency
              const convertedPrice = await convertPrice(variation.price, currency)
              total += convertedPrice * item.quantity
            }
          }
        }

        return total
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
