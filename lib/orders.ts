import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Order, OrderItem, Product, Address } from "@/types"

export const createOrder = async (
  userId: string,
  items: OrderItem[],
  subtotal: number,
  tax: number,
  shipping: number,
  total: number,
  currency: string, // Changed from SupportedCurrency to string
  shippingAddress: Address,
  stripeCheckoutId?: string,
  stripePaymentIntentId?: string,
) => {
  try {
    const orderData: Omit<Order, "id"> = {
      userId,
      items,
      subtotal,
      tax,
      shipping,
      total,
      currency,
      shippingAddress,
      paymentStatus: stripePaymentIntentId ? "paid" : "pending",
      fulfillmentStatus: "unfulfilled",
      stripeCheckoutId,
      stripePaymentIntentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const docRef = await addDoc(collection(db, "orders"), orderData)

    return { id: docRef.id, ...orderData } as Order
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const getOrder = async (orderId: string) => {
  try {
    const docRef = doc(db, "orders", orderId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order
    } else {
      throw new Error("Order not found")
    }
  } catch (error) {
    console.error("Error getting order:", error)
    throw error
  }
}

export const getUserOrders = async (userId: string) => {
  try {
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const orders: Order[] = []

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order)
    })

    return orders
  } catch (error) {
    console.error("Error getting user orders:", error)
    throw error
  }
}

export const updateOrderStatus = async (
  orderId: string,
  paymentStatus?: Order["paymentStatus"],
  fulfillmentStatus?: Order["fulfillmentStatus"],
) => {
  try {
    const docRef = doc(db, "orders", orderId)
    const updateData: any = { updatedAt: serverTimestamp() }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }

    if (fulfillmentStatus) {
      updateData.fulfillmentStatus = fulfillmentStatus
    }

    await updateDoc(docRef, updateData)

    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

export const createOrderItemsFromProducts = async (
  products: Record<string, Product>,
  items: { productId: string; quantity: number }[],
  currency: string, // Changed from SupportedCurrency to string
): Promise<OrderItem[]> => {
  return items.map((item) => {
    const product = products[item.productId]

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`)
    }

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
  })
}
