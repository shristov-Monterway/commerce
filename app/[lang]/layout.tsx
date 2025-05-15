import type React from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TranslationProvider } from "@/components/translation-provider"
import { getMessages } from "@/lib/i18n"
import appConfig from "@/config/app-config"

export async function generateStaticParams() {
  return appConfig.supportedLanguages.map((lang) => ({
    lang: lang.code,
  }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Validate that the lang parameter is supported
  const isValidLocale = appConfig.supportedLanguages.some((lang) => lang.code === params.lang)

  if (!isValidLocale) {
    notFound()
  }

  // Load messages for the current locale
  const messages = await getMessages(params.lang)

  return (
    <TranslationProvider locale={params.lang} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header lang={params.lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={params.lang} />
      </div>
    </TranslationProvider>
  )
}
