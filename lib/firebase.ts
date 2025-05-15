import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import appConfig from "@/config/app-config"

// Initialize Firebase
const app = !getApps().length ? initializeApp(appConfig.firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Connect to emulators in development mode
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  if (typeof window !== "undefined") {
    console.log("Using Firebase Emulator")
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
    connectFirestoreEmulator(db, "localhost", 8080)
    connectStorageEmulator(storage, "localhost", 9199)
  }
}

export { app, auth, db, storage }
