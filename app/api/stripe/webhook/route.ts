import { type NextRequest, NextResponse } from "next/server"
import { handleWebhookEvent } from "@/lib/stripe"
import { createOrder } from "@/lib/orders"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    const result = await handleWebhookEvent(signature, Buffer.from(payload))

    if (!result.success) {
      return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }

    if (result.order) {
      // Save order to database with all the details from the webhook handler
      await createOrder(
        result.order.userId,
        result.order.items,
        result.order.subtotal,
        result.order.tax,
        result.order.shipping,
        result.order.total,
        result.order.currency,
        result.order.shippingAddress,
        result.order.stripeCheckoutId,
        result.order.stripePaymentIntentId,
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

// This is needed to disable body parsing, as we need the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}
