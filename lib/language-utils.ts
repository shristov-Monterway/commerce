import ISO6391 from "iso-639-1"

// Map language codes to country codes for flags
// This is needed because flag-icons uses ISO 3166-1 alpha-2 country codes
export const languageToCountryCode: Record<string, string> = {
  en: "us", // English -> United States
  es: "es", // Spanish -> Spain
  fr: "fr", // French -> France
  de: "de", // German -> Germany
  it: "it", // Italian -> Italy
  pt: "pt", // Portuguese -> Portugal
  ru: "ru", // Russian -> Russia
  zh: "cn", // Chinese -> China
  ja: "jp", // Japanese -> Japan
  ko: "kr", // Korean -> South Korea
  ar: "sa", // Arabic -> Saudi Arabia
  hi: "in", // Hindi -> India
  // Add more mappings as needed
}

// Get country code from language code
export function getCountryCodeFromLanguage(langCode: string): string {
  return languageToCountryCode[langCode] || langCode
}

// Get native language name
export function getNativeLanguageName(langCode: string): string {
  return ISO6391.getNativeName(langCode)
}

// Get English language name
export function getEnglishLanguageName(langCode: string): string {
  return ISO6391.getName(langCode)
}
