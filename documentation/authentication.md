# Authentication

## Overview

The e-commerce platform uses Firebase Authentication for user authentication, with support for multiple authentication methods. This document describes how the authentication system works and how to use it.

## Authentication Methods

The platform supports the following authentication methods:

1. **Email/Password**: Traditional email and password authentication
2. **Google**: Social authentication with Google
3. **Phone**: Phone number authentication with SMS verification

## Authentication Flow

### Email/Password Authentication

1. User enters email and password
2. Client calls Firebase Authentication API to create or sign in the user
3. On successful authentication, a user document is created in Firestore (if it doesn't exist)
4. User is redirected to the home page or the page they were trying to access

### Google Authentication

1. User clicks the "Continue with Google" button
2. Firebase Authentication opens a popup for Google sign-in
3. User signs in with their Google account
4. On successful authentication, a user document is created in Firestore (if it doesn't exist)
5. User is redirected to the home page or the page they were trying to access

### Phone Authentication

1. User enters their phone number
2. Firebase Authentication sends an SMS with a verification code
3. User enters the verification code
4. On successful verification, a user document is created in Firestore (if it doesn't exist)
5. User is redirected to the home page or the page they were trying to access

## User Data

User data is stored in two places:

1. **Firebase Authentication**: Basic user data (email, phone, etc.)
2. **Firestore**: Extended user data (preferences, addresses, etc.)

The user document in Firestore has the following structure:

\`\`\`typescript
interface User {
  id: string;
  email: string | null;
  displayName: string;
  phoneNumber?: string | null;
  preferredLanguage: string;
  preferredCurrency: string;
  isAdmin: boolean;
  shippingAddresses: Address[];
  createdAt: number;
  updatedAt: number;
}
\`\`\`

## Authentication Context

The application uses a React context (`AuthContext`) to provide authentication state to components. The context includes:

- `firebaseUser`: The Firebase Authentication user object
- `user`: The Firestore user document
- `loading`: A boolean indicating whether the authentication state is loading

To access the authentication context, use the `useAuth` hook:

\`\`\`typescript
import { useAuth } from "@/context/auth-context"

function MyComponent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in</div>
  }

  return <div>Welcome, {user.displayName}</div>
}
\`\`\`

## Protected Routes

To protect routes that require authentication, check the user state in the component:

\`\`\`typescript
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/protected-page")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Will redirect
  }

  return <div>Protected content</div>
}
\`\`\`

## Admin Routes

For routes that require admin privileges, check the `isAdmin` property of the user:

\`\`\`typescript
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect
  }

  return <div>Admin content</div>
}
\`\`\`

## Authentication API

The authentication API is implemented in the `lib/auth.ts` file, which provides functions for:

- `signUp`: Create a new user with email and password
- `signIn`: Sign in an existing user with email and password
- `signInWithGoogle`: Sign in with Google
- `initPhoneAuth`: Initialize phone authentication
- `sendPhoneVerificationCode`: Send a verification code to a phone number
- `verifyPhoneCode`: Verify a phone verification code
- `signOut`: Sign out the current user
- `resetPassword`: Send a password reset email
- `getCurrentUser`: Get the current user's Firestore document
\`\`\`

Let's fix the documentation/database-structure.md file:
