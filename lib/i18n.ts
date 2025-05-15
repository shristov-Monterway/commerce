"use client"

import { cache } from "react"

// Define the type for our translations
export type Messages = Record<string, any>

// Cache the loaded messages to avoid repeated file reads
export const getMessages = cache(async (locale: string): Promise<Messages> => {
  try {
    // Import the messages for the requested locale
    const messages = (await import(`../messages/${locale}.json`)).default
    return messages
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error)
    // Fallback to English if the requested locale is not available
    try {
      const fallbackMessages = (await import("../messages/en.json")).default
      return fallbackMessages
    } catch (fallbackError) {
      console.error("Error loading fallback messages:", fallbackError)
      return {} // Return empty object if even fallback fails
    }
  }
})

// Helper function to get a nested translation by key path
export function getTranslation(messages: Messages, key: string, params?: Record<string, any>): string {
  // Split the key path (e.g., "home.hero.title" -> ["home", "hero", "title"])
  const keys = key.split(".")

  // Navigate through the nested objects to find the translation
  let translation: any = messages
  for (const k of keys) {
    if (!translation || !translation[k]) {
      console.warn(`Translation key not found: ${key}`)
      return key // Return the key itself as fallback
    }
    translation = translation[k]
  }

  // If the translation is not a string, return the key
  if (typeof translation !== "string") {
    console.warn(`Translation for key ${key} is not a string:`, translation)
    return key
  }

  // Replace parameters in the translation if provided
  if (params) {
    return Object.entries(params).reduce((str, [key, value]) => {
      return str.replace(new RegExp(`{${key}}`, "g"), String(value))
    }, translation)
  }

  return translation
}

// React hook to use translations in components
export function useTranslations(locale: string, messages: Messages) {
  return (key: string, params?: Record<string, any>) => {
    return getTranslation(messages, key, params)
  }
}
