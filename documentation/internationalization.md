# Internationalization (i18n)

## Overview

The e-commerce platform implements a comprehensive internationalization (i18n) system that supports multiple languages and currencies. This document describes how the i18n system works and how to use it.

## Language Support

### Supported Languages

The supported languages are defined in the central configuration file `config/app-config.tsx`:

\`\`\`typescript
// In app-config.tsx
defaultLanguage: "en",
supportedLanguages: ["en", "es", "fr", "de"],
\`\`\`

To add a new language, add its language code to this array in the configuration file.

### Language Files

Translation messages are stored in JSON files in the `messages/` directory. Each language has its own file, named with the language code (e.g., `en.json`, `fr.json`).

The English file (`en.json`) serves as the source of truth for translations. When new messages are added to the English file, they are automatically translated to other languages using the translation script.

For detailed information about the translation workflow and script, see the [Translation Management](./translation-management.md) documentation.

### Translation Structure

Translation files use a nested structure for organization:

\`\`\`json
{
  "common": {
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "auth": {
    "login": {
      "title": "Login"
    }
  }
}
\`\`\`

### Translated Text Type

For content that needs to be available in multiple languages (like product names, descriptions, etc.), we use the `TranslatedText` type:

\`\`\`typescript
export interface TranslatedText {
  [key: string]: string // language code as key, translated text as value
}
\`\`\`

This allows us to store translations for each language in a single object.

## Currency Support

### Supported Currencies

The supported currencies are defined in the central configuration file `config/app-config.tsx`:

\`\`\`typescript
// In app-config.tsx
defaultCurrency: "USD",
supportedCurrencies: ["USD", "EUR", "GBP", "JPY"],
\`\`\`

To add a new currency, add its currency code to this array in the configuration file.

### Currency Conversion

Currency conversion is handled by the `lib/currency.ts` module, which uses exchange rates from an external API. The exchange rates are cached in Firestore and updated periodically.

## Using Translations

### In Server Components

In server components, you can use the `getMessages` and `getTranslation` functions:

\`\`\`typescript
import { getMessages, getTranslation } from "@/lib/i18n"

export default async function MyComponent({ params }: { params: { lang: string } }) {
  const { lang } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <div>
      <h1>{t("page.title")}</h1>
      <p>{t("page.description", { name: "John" })}</p>
    </div>
  )
}
\`\`\`

### In Client Components

In client components, you can use the `useT` hook:

\`\`\`typescript
"use client"

import { useT } from "@/components/translation-provider"

export function MyComponent() {
  const t = useT()

  return (
    <div>
      <h1>{t("page.title")}</h1>
      <p>{t("page.description", { name: "John" })}</p>
    </div>
  )
}
\`\`\`

### Working with TranslatedText

To display content from a `TranslatedText` object, use the current language code to access the appropriate translation:

\`\`\`typescript
import appConfig from "@/config/app-config"

const productName = product.name[lang] || product.name[appConfig.defaultLanguage]
\`\`\`

## Translation Generation

The project includes a script to automatically generate translations for new messages using the OpenAI API. The OpenAI configuration is defined in the central configuration file:

\`\`\`typescript
// In app-config.tsx
openAI: {
  apiKey: process.env.OPENAI_API_KEY || "",
  model: "gpt-4o",
},
\`\`\`

To run the script:

\`\`\`bash
npm run translate
\`\`\`

For detailed information about the translation script and workflow, see the [Translation Management](./translation-management.md) documentation.

## Language Selection

Users can select their preferred language using the language selector component in the header. The selected language is stored in:

1. The URL path (e.g., `/en/products`, `/fr/products`)
2. The user's profile (if logged in)
3. localStorage (for anonymous users)

## URL Structure

The application uses a URL structure that includes the language code as the first segment:

\`\`\`
/{lang}/{path}
\`\`\`

For example:
- `/en/products` - English products page
- `/fr/products` - French products page

This allows for SEO-friendly URLs and ensures that users always see content in their preferred language.

## Store Information

The store name and description are defined in the central configuration file as `TranslatedText` objects:

\`\`\`typescript
// In app-config.tsx
storeName: {
  en: "GlobalShop",
  es: "GlobalShop",
  fr: "GlobalShop",
  de: "GlobalShop",
},
storeDescription: {
  en: "Your global marketplace for quality products",
  es: "Tu mercado global para productos de calidad",
  fr: "Votre marché mondial pour des produits de qualité",
  de: "Ihr globaler Marktplatz für Qualitätsprodukte",
},
\`\`\`

Unlike other UI text that needs to be translated via the translation files, these values are accessed directly from the configuration:

\`\`\`typescript
// Get store name for current language
const storeName = appConfig.storeName[lang] || appConfig.storeName[appConfig.defaultLanguage]
\`\`\`

This approach is used for branding elements that should be consistent across the application and don't need to be part of the general translation workflow.
\`\`\`

Let's fix the documentation/translation-management.md file:
