"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import type { User } from "@/types"
import { getCurrentUser } from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await getCurrentUser(firebaseUser)
        setUser(userData)

        // Set language and currency preferences
        if (userData) {
          localStorage.setItem("preferredLanguage", userData.preferredLanguage)
          localStorage.setItem("preferredCurrency", userData.preferredCurrency)

          // Redirect to user's preferred language if on default route
          if (pathname === "/") {
            router.push(`/${userData.preferredLanguage}`)
          }
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [pathname, router])

  return <AuthContext.Provider value={{ firebaseUser, user, loading }}>{children}</AuthContext.Provider>
}
