# Database Structure

## Overview

The e-commerce platform uses Firebase Firestore as its primary database. This document describes the database structure, collections, and documents.

## Collections

### Users

The `users` collection stores user information.

**Document ID**: Firebase Auth UID

**Fields**:
- `id`: string - Firebase Auth UID
- `email`: string | null - User's email address
- `displayName`: string - User's display name
- `phoneNumber`: string | null - User's phone number (if using phone auth)
- `preferredLanguage`: string - User's preferred language code
- `preferredCurrency`: string - User's preferred currency code
- `isAdmin`: boolean - Whether the user has admin privileges
- `shippingAddresses`: Address[] - User's shipping addresses
- `createdAt`: number - Timestamp of when the user was created
- `updatedAt`: number - Timestamp of when the user was last updated

### Products

The `products` collection stores product information.

**Document ID**: Auto-generated

**Fields**:
- `id`: string - Document ID
- `name`: TranslatedText - Product name in multiple languages
- `description`: TranslatedText - Product description in multiple languages
- `slug`: TranslatedText - URL-friendly product name in multiple languages
- `price`: number - Product price in cents
- `compareAtPrice`: number | null - Original price for sale items, in cents
- `images`: string[] - Array of image URLs
- `categoryIds`: string[] - Array of category IDs
- `tags`: ProductTag[] - Array of product tags
- `weight`: number - Product weight in grams
- `sku`: string - Stock keeping unit
- `inventory`: number - Number of items in stock
- `isActive`: boolean - Whether the product is active
- `createdAt`: number - Timestamp of when the product was created
- `updatedAt`: number - Timestamp of when the product was last updated

### Categories

The `categories` collection stores product categories.

**Document ID**: Auto-generated

**Fields**:
- `id`: string - Document ID
- `name`: TranslatedText - Category name in multiple languages
- `description`: TranslatedText - Category description in multiple languages
- `slug`: TranslatedText - URL-friendly category name in multiple languages
- `parentId`: string | null - Parent category ID, or null for top-level categories
- `image`: string - Category image URL
- `createdAt`: number - Timestamp of when the category was created
- `updatedAt`: number - Timestamp of when the category was last updated

### Orders

The `orders` collection stores order information.

**Document ID**: Auto-generated

**Fields**:
- `id`: string - Document ID
- `userId`: string - User ID who placed the order
- `items`: OrderItem[] - Array of order items
- `subtotal`: number - Order subtotal in cents
- `tax`: number - Tax amount in cents
- `shipping`: number - Shipping cost in cents
- `total`: number - Order total in cents
- `currency`: string - Currency code
- `shippingAddress`: Address - Shipping address
- `paymentStatus`: "pending" | "paid" | "failed" - Payment status
- `fulfillmentStatus`: "unfulfilled" | "fulfilled" | "partially_fulfilled" - Fulfillment status
- `stripeCheckoutId`: string | undefined - Stripe Checkout session ID
- `stripePaymentIntentId`: string | undefined - Stripe Payment Intent ID
- `createdAt`: number - Timestamp of when the order was created
- `updatedAt`: number - Timestamp of when the order was last updated

### Exchange Rates

The `exchangeRates` collection stores currency exchange rates.

**Document ID**: "current"

**Fields**:
- `base`: string - Base currency code
- `rates`: Record<string, number> - Exchange rates for supported currencies
- `lastUpdated`: number - Timestamp of when the rates were last updated

## Data Types

### TranslatedText

\`\`\`typescript
interface TranslatedText {
  [key: string]: string // language code as key, translated text as value
}
\`\`\`

### Address

\`\`\`typescript
interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}
\`\`\`

### OrderItem

\`\`\`typescript
interface OrderItem {
  productId: string;
  productSnapshot: {
    name: TranslatedText;
    price: number;
    image: string;
  };
  quantity: number;
  price: number; // in cents, at time of purchase
}
\`\`\`

### ProductTag

\`\`\`typescript
interface ProductTag {
  id: string;
  name: TranslatedText;
}
\`\`\`

## Security Rules

The database is secured with Firestore security rules that enforce the following access patterns:

- Public read access to products and categories
- Authenticated users can read and write their own data
- Authenticated users can create orders
- Admin users can read and write all data

See the `lib/firestore-rules.txt` file for the complete security rules.

## Indexes

The following indexes are required for the application to function properly:

1. Products collection:
   - Compound index on `categoryIds` (array), `isActive` (ascending), `createdAt` (descending)
   - Compound index on `isActive` (ascending), `createdAt` (descending)

2. Orders collection:
   - Compound index on `userId` (ascending), `createdAt` (descending)

## Data Relationships

- Products belong to one or more categories (via `categoryIds`)
- Categories can have a parent category (via `parentId`)
- Orders belong to a user (via `userId`)
- Order items reference products (via `productId`)
\`\`\`

Let's create the API reference documentation:
