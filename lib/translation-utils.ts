import type { TranslatedText } from "@/types"
import appConfig from "@/config/app-config"

/**
 * Gets the translated text for the current language, falling back to the default language if needed
 * @param translatedText The translated text object
 * @param lang The current language code
 * @returns The translated text for the current language
 */
export function getTranslatedText(translatedText: TranslatedText, lang: string): string {
  return translatedText[lang] || translatedText[appConfig.defaultLanguage] || Object.values(translatedText)[0] || ""
}

/**
 * Creates a TranslatedText object with the same text for all supported languages
 * @param text The text to use for all languages
 * @returns A TranslatedText object with the text for all supported languages
 */
export function createTranslatedText(text: string): TranslatedText {
  const result: TranslatedText = {}
  appConfig.supportedLanguages.forEach((lang) => {
    result[lang] = text
  })
  return result
}

/**
 * Updates a specific language in a TranslatedText object
 * @param translatedText The original TranslatedText object
 * @param lang The language code to update
 * @param text The new text for the language
 * @returns A new TranslatedText object with the updated language
 */
export function updateTranslatedText(translatedText: TranslatedText, lang: string, text: string): TranslatedText {
  return {
    ...translatedText,
    [lang]: text,
  }
}

/**
 * Gets the store name for the current language
 * @param lang The current language code
 * @returns The store name for the current language
 */
export function getStoreName(lang: string): string {
  return getTranslatedText(appConfig.storeName, lang)
}

/**
 * Gets the store description for the current language
 * @param lang The current language code
 * @returns The store description for the current language
 */
export function getStoreDescription(lang: string): string {
  return getTranslatedText(appConfig.storeDescription, lang)
}
