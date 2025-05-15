import Stripe from "stripe"
import type { Order, CartItem, Product, User, Address } from "@/types"
import appConfig from "@/config/app-config"
import { convertPrice } from "@/lib/currency"
import { getProduct } from "@/lib/products"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export const createCheckoutSession = async (
  items: CartItem[],
  products: Record<string, Product>,
  currency: string,
  user: User | null,
  shippingAddress: Address,
) => {
  try {
    // Require user to be logged in
    if (!user) {
      throw new Error("User must be logged in to checkout")
    }

    // Prepare line items for Stripe
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = products[item.productId]
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        // Convert product price to the target currency
        const convertedPrice = await convertPrice(product.price, currency)

        return {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: product.name[user.preferredLanguage || appConfig.defaultLanguage],
              images: product.images.length > 0 ? [product.images[0]] : [],
              metadata: {
                productId: product.id,
              },
            },
            unit_amount: convertedPrice,
          },
          quantity: item.quantity,
        }
      }),
    )

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      customer_email: user.email,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "ES"],
      },
      metadata: {
        userId: user.id,
        shippingAddressId: shippingAddress.id,
        // Store cart items in metadata as JSON string
        cartItems: JSON.stringify(items),
      },
    })

    return session
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

export const getCheckoutSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    })

    return session
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    throw error
  }
}

export const handleWebhookEvent = async (
  signature: string,
  payload: Buffer,
): Promise<{ success: boolean; order?: Order }> => {
  try {
    const webhookSecret = appConfig.stripe.webhookSecret
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed":
        // Payment was successful, create order
        const session = event.data.object as Stripe.Checkout.Session

        // Verify that user ID exists (user was logged in)
        const userId = session.metadata?.userId
        if (!userId || userId === "guest") {
          throw new Error("User must be logged in to complete checkout")
        }

        // Get cart items from metadata
        const cartItemsJson = session.metadata?.cartItems
        if (!cartItemsJson) {
          throw new Error("Cart items not found in session metadata")
        }

        const cartItems = JSON.parse(cartItemsJson) as CartItem[]

        // Create order items with product details
        const orderItems = await Promise.all(
          cartItems.map(async (item) => {
            const product = await getProduct(item.productId)
            return {
              productId: product.id,
              productSnapshot: {
                name: product.name,
                price: product.price,
                image: product.images[0] || "",
              },
              quantity: item.quantity,
              price: product.price,
            }
          }),
        )

        // Get shipping address from Stripe
        const shippingDetails = session.shipping_details
        const shippingAddress: Address = {
          id: session.metadata?.shippingAddressId || "default",
          name: shippingDetails?.name || "",
          line1: shippingDetails?.address?.line1 || "",
          line2: shippingDetails?.address?.line2 || "",
          city: shippingDetails?.address?.city || "",
          state: shippingDetails?.address?.state || "",
          postalCode: shippingDetails?.address?.postal_code || "",
          country: shippingDetails?.address?.country || "",
          phone: shippingDetails?.phone || "",
          isDefault: false,
        }

        // Calculate order totals
        const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const tax = session.total_details?.amount_tax || 0
        const shipping = session.total_details?.amount_shipping || 0

        // Create the order object
        const order: Order = {
          id: session.id,
          userId: userId,
          items: orderItems,
          subtotal: subtotal,
          tax: tax,
          shipping: shipping,
          total: session.amount_total || 0,
          currency: session.currency?.toUpperCase() || "USD",
          shippingAddress: shippingAddress,
          paymentStatus: "paid",
          fulfillmentStatus: "unfulfilled",
          stripeCheckoutId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        return { success: true, order }

      default:
        console.log(`Unhandled event type: ${event.type}`)
        return { success: true }
    }
  } catch (error) {
    console.error("Error handling webhook event:", error)
    return { success: false }
  }
}
