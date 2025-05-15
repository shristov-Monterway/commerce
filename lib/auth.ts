import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type User as FirebaseUser,
  type ConfirmationResult,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/types"
import appConfig from "@/config/app-config"

// Store the confirmation result for phone auth
let phoneConfirmationResult: ConfirmationResult | null = null

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Detect browser language or use default
    const browserLang = navigator.language.split("-")[0]
    const supportedLangs = appConfig.supportedLanguages.map((l) => l.code)
    const preferredLanguage = supportedLangs.includes(browserLang) ? browserLang : appConfig.defaultLanguage

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      email: user.email,
      displayName,
      preferredLanguage,
      preferredCurrency: appConfig.defaultCurrency,
      isAdmin: false,
      shippingAddresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      // Detect browser language or use default
      const browserLang = navigator.language.split("-")[0]
      const supportedLangs = appConfig.supportedLanguages.map((l) => l.code)
      const preferredLanguage = supportedLangs.includes(browserLang) ? browserLang : appConfig.defaultLanguage

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        preferredLanguage,
        preferredCurrency: appConfig.defaultCurrency,
        isAdmin: false,
        shippingAddresses: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Initialize phone authentication
export const initPhoneAuth = (elementId: string) => {
  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: "invisible",
      })
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Send verification code to phone
export const sendPhoneVerificationCode = async (phoneNumber: string) => {
  try {
    if (!window.recaptchaVerifier) {
      return { success: false, error: "reCAPTCHA not initialized" }
    }

    phoneConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    return { success: true }
  } catch (error: any) {
    // Reset reCAPTCHA if there's an error
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
    return { success: false, error: error.message }
  }
}

// Verify phone code and sign in
export const verifyPhoneCode = async (verificationCode: string) => {
  try {
    if (!phoneConfirmationResult) {
      return { success: false, error: "No verification in progress" }
    }

    const userCredential = await phoneConfirmationResult.confirm(verificationCode)
    const user = userCredential.user

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      // Detect browser language or use default
      const browserLang = navigator.language.split("-")[0]
      const supportedLangs = appConfig.supportedLanguages.map((l) => l.code)
      const preferredLanguage = supportedLangs.includes(browserLang) ? browserLang : appConfig.defaultLanguage

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: null,
        displayName: user.phoneNumber,
        phoneNumber: user.phoneNumber,
        preferredLanguage,
        preferredCurrency: appConfig.defaultCurrency,
        isAdmin: false,
        shippingAddresses: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    // Reset confirmation result
    phoneConfirmationResult = null

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getCurrentUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    }
    return null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Add global type for recaptcha verifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null
  }
}
