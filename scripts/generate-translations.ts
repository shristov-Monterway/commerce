import fs from "fs"
import path from "path"
import { OpenAI } from "openai"
import ISO6391 from "iso-639-1"
import appConfig from "../config/app-config"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: appConfig.openAI.apiKey,
})

// Path to messages directory
const MESSAGES_DIR = path.join(process.cwd(), "messages")

// Function to read JSON file
function readJsonFile(filePath: string): any {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContent)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {} // Return empty object if file doesn't exist
    }
    throw error
  }
}

// Function to write JSON file
function writeJsonFile(filePath: string, data: any): void {
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
}

// Function to translate a string using OpenAI
async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    // Get the full language name for better translation quality
    const languageName = ISO6391.getName(targetLanguage)

    const response = await openai.chat.completions.create({
      model: appConfig.openAI.model,
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text from English to ${languageName}. Return only the translated text without any explanations or additional text.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    })

    return response.choices[0].message.content?.trim() || text
  } catch (error) {
    console.error(`Error translating text: ${text}`, error)
    return text // Return original text if translation fails
  }
}

// Function to translate a nested object
async function translateObject(obj: any, targetLanguage: string): Promise<any> {
  const result: any = {}

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      result[key] = await translateText(obj[key], targetLanguage)
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = await translateObject(obj[key], targetLanguage)
    } else {
      result[key] = obj[key]
    }
  }

  return result
}

// Function to find new and removed keys between two objects
function findDifferences(source: any, target: any, prefix = ""): { newKeys: string[]; removedKeys: string[] } {
  const newKeys: string[] = []
  const removedKeys: string[] = []

  // Find new keys in source that don't exist in target
  for (const key in source) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (!(key in target)) {
      if (typeof source[key] === "object" && source[key] !== null) {
        // If it's an object, add all nested keys
        const allNestedKeys = getAllNestedKeys(source[key], currentPath)
        newKeys.push(...allNestedKeys)
      } else {
        newKeys.push(currentPath)
      }
    } else if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      typeof target[key] === "object" &&
      target[key] !== null
    ) {
      // Recursively check nested objects
      const { newKeys: nestedNew, removedKeys: nestedRemoved } = findDifferences(source[key], target[key], currentPath)
      newKeys.push(...nestedNew)
      removedKeys.push(...nestedRemoved)
    }
  }

  // Find keys in target that don't exist in source
  for (const key in target) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (!(key in source)) {
      if (typeof target[key] === "object" && target[key] !== null) {
        // If it's an object, add all nested keys
        const allNestedKeys = getAllNestedKeys(target[key], currentPath)
        removedKeys.push(...allNestedKeys)
      } else {
        removedKeys.push(currentPath)
      }
    }
  }

  return { newKeys, removedKeys }
}

// Function to get all nested keys in an object
function getAllNestedKeys(obj: any, prefix = ""): string[] {
  const keys: string[] = []

  for (const key in obj) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys.push(...getAllNestedKeys(obj[key], currentPath))
    } else {
      keys.push(currentPath)
    }
  }

  return keys
}

// Function to get value from object using path
function getValueByPath(obj: any, path: string): any {
  const keys = path.split(".")
  let current = obj

  for (const key of keys) {
    if (current === undefined || current === null) return undefined
    current = current[key]
  }

  return current
}

// Function to set value in object using path
function setValueByPath(obj: any, path: string, value: any): void {
  const keys = path.split(".")
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current)) {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

// Function to remove value from object using path
function removeValueByPath(obj: any, path: string): void {
  const keys = path.split(".")
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current)) return
    current = current[key]
  }

  delete current[keys[keys.length - 1]]
}

// Main function to update translations
async function updateTranslations() {
  console.log("Starting translation update process...")

  // Get supported languages from app config
  const { defaultLanguage, supportedLanguages } = appConfig

  // Filter out the default language (English)
  const targetLanguages = supportedLanguages.filter((lang) => lang !== defaultLanguage)

  // Read English translations
  const englishFilePath = path.join(MESSAGES_DIR, `${defaultLanguage}.json`)
  const englishTranslations = readJsonFile(englishFilePath)

  if (!englishTranslations || Object.keys(englishTranslations).length === 0) {
    console.error(`${defaultLanguage} translations file is empty or not found.`)
    return
  }

  // Process each supported language
  for (const langCode of targetLanguages) {
    const languageName = ISO6391.getName(langCode)
    console.log(`Processing ${languageName} (${langCode}) translations...`)

    const langFilePath = path.join(MESSAGES_DIR, `${langCode}.json`)
    const existingTranslations = readJsonFile(langFilePath)

    // Find differences between English and target language
    const { newKeys, removedKeys } = findDifferences(englishTranslations, existingTranslations)

    console.log(`Found ${newKeys.length} new keys and ${removedKeys.length} removed keys for ${languageName}`)

    // Create a copy of existing translations or start with empty object
    const updatedTranslations = { ...existingTranslations }

    // Remove keys that don't exist in English
    for (const key of removedKeys) {
      removeValueByPath(updatedTranslations, key)
      console.log(`Removed key: ${key}`)
    }

    // Translate and add new keys
    if (newKeys.length > 0) {
      console.log(`Translating ${newKeys.length} new keys to ${languageName}...`)

      for (const key of newKeys) {
        const englishValue = getValueByPath(englishTranslations, key)

        if (typeof englishValue === "string") {
          const translatedValue = await translateText(englishValue, langCode)
          setValueByPath(updatedTranslations, key, translatedValue)
          console.log(`Translated key: ${key}`)
        } else {
          setValueByPath(updatedTranslations, key, englishValue)
        }
      }
    }

    // Write updated translations back to file
    writeJsonFile(langFilePath, updatedTranslations)
    console.log(`Updated ${languageName} translations file`)
  }

  console.log("Translation update process completed successfully!")
}

// Run the script
updateTranslations().catch((error) => {
  console.error("Error updating translations:", error)
  process.exit(1)
})
