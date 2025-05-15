# API Reference

## Overview

The e-commerce platform uses Next.js API routes to implement server-side functionality. This document describes the available API endpoints and their usage.

## Authentication

Most API endpoints require authentication. To authenticate, include the Firebase Authentication token in the request headers:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## API Endpoints

### Exchange Rates

#### GET /api/exchange-rates

Fetches the current exchange rates.

**Response**:
\`\`\`json
{
  "base": "USD",
  "rates": {
    "EUR": 0.85,
    "GBP": 0.75,
    "JPY": 110.0
  },
  "lastUpdated": 1625097600000
}
\`\`\`

### Stripe

#### POST /api/stripe/webhook

Handles Stripe webhook events, particularly for completed checkout sessions.

**Headers**:
- `stripe-signature`: Signature provided by Stripe

**Body**: Raw request body from Stripe

**Response**:
\`\`\`json
{
  "received": true
}
\`\`\`

## Client-Side API Functions

The application includes several client-side API functions for interacting with Firebase and other services.

### Products API

#### getProducts

\`\`\`typescript
async function getProducts(categoryId?: string, limit = 20): Promise<Product[]>
\`\`\`

Fetches products, optionally filtered by category.

#### getProduct

\`\`\`typescript
async function getProduct(productId: string): Promise<Product>
\`\`\`

Fetches a single product by ID.

#### getProductBySlug

\`\`\`typescript
async function getProductBySlug(slug: string, language: string): Promise<Product>
\`\`\`

Fetches a single product by slug and language.

#### createProduct

\`\`\`typescript
async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>
\`\`\`

Creates a new product.

#### updateProduct

\`\`\`typescript
async function updateProduct(productId: string, product: Partial<Product>): Promise<Product>
\`\`\`

Updates an existing product.

#### deleteProduct

\`\`\`typescript
async function deleteProduct(productId: string): Promise<{ success: boolean }>
\`\`\`

Deletes a product.

### Categories API

Similar functions exist for categories: `getCategories`, `getCategory`, `getCategoryBySlug`, `createCategory`, `updateCategory`, `deleteCategory`.

### Orders API

#### createOrder

\`\`\`typescript
async function createOrder(
  userId: string,
  items: OrderItem[],
  subtotal: number,
  tax: number,
  shipping: number,
  total: number,
  currency: string,
  shippingAddress: Address,
  stripeCheckoutId?: string,
  stripePaymentIntentId?: string
): Promise<Order>
\`\`\`

Creates a new order.

#### getOrder

\`\`\`typescript
async function getOrder(orderId: string): Promise<Order>
\`\`\`

Fetches a single order by ID.

#### getUserOrders

\`\`\`typescript
async function getUserOrders(userId: string): Promise<Order[]>
\`\`\`

Fetches all orders for a user.

#### updateOrderStatus

\`\`\`typescript
async function updateOrderStatus(
  orderId: string,
  paymentStatus?: Order["paymentStatus"],
  fulfillmentStatus?: Order["fulfillmentStatus"]
): Promise<{ success: boolean }>
\`\`\`

Updates the status of an order.

### Authentication API

#### signUp

\`\`\`typescript
async function signUp(email: string, password: string, displayName: string): Promise<{ success: boolean; user?: any; error?: string }>
\`\`\`

Creates a new user with email and password.

#### signIn

\`\`\`typescript
async function signIn(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }>
\`\`\`

Signs in an existing user with email and password.

#### signInWithGoogle

\`\`\`typescript
async function signInWithGoogle(): Promise<{ success: boolean; user?: any; error?: string }>
\`\`\`

Signs in with Google.

#### signOut

\`\`\`typescript
async function signOut(): Promise<{ success: boolean; error?: string }>
\`\`\`

Signs out the current user.

#### resetPassword

\`\`\`typescript
async function resetPassword(email: string): Promise<{ success: boolean; error?: string }>
\`\`\`

Sends a password reset email.

### Stripe API

#### createCheckoutSession

\`\`\`typescript
async function createCheckoutSession(
  items: CartItem[],
  products: Record<string, Product>,
  currency: string,
  user: User | null,
  shippingAddress: Address
): Promise<Stripe.Checkout.Session>
\`\`\`

Creates a Stripe checkout session.

#### getCheckoutSession

\`\`\`typescript
async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>
\`\`\`

Fetches a Stripe checkout session by ID.

### Currency API

#### convertPrice

\`\`\`typescript
async function convertPrice(priceInCents: number, targetCurrency: string): Promise<number>
\`\`\`

Converts a price from the base currency to the target currency.

#### formatPrice

\`\`\`typescript
function formatPrice(priceInCents: number, currency: string): string
\`\`\`

Formats a price for display, including the currency symbol.
\`\`\`

Let's fix the documentation/internationalization.md file:
