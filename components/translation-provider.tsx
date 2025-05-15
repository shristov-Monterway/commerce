"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Messages } from "@/lib/i18n"
import { useTranslations } from "@/lib/i18n"

// Create a context to provide translations to all components
type TranslationContextType = {
  t: (key: string, params?: Record<string, any>) => string
  locale: string
}

const TranslationContext = createContext<TranslationContextType | null>(null)

// Provider component
export function TranslationProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode
  locale: string
  messages: Messages
}) {
  const t = useTranslations(locale, messages)

  return <TranslationContext.Provider value={{ t, locale }}>{children}</TranslationContext.Provider>
}

// Hook to use translations in components
export function useT() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useT must be used within a TranslationProvider")
  }
  return context.t
}

// Hook to get the current locale
export function useLocale() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useLocale must be used within a TranslationProvider")
  }
  return context.locale
}
