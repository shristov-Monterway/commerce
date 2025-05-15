"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import appConfig from "@/config/app-config"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { useT } from "@/components/translation-provider"
import { getNativeLanguageName } from "@/lib/language-utils"

export function LanguageSelector() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useT()
  const [currentLanguage, setCurrentLanguage] = useState<string>(appConfig.defaultLanguage)

  useEffect(() => {
    // Get language from localStorage or use default
    const storedLanguage = localStorage.getItem("preferredLanguage")
    if (storedLanguage && appConfig.supportedLanguages.includes(storedLanguage)) {
      setCurrentLanguage(storedLanguage)
    } else if (user?.preferredLanguage) {
      setCurrentLanguage(user.preferredLanguage)
      localStorage.setItem("preferredLanguage", user.preferredLanguage)
    }
  }, [user])

  const changeLanguage = async (language: string) => {
    if (language === currentLanguage) return

    setCurrentLanguage(language)
    localStorage.setItem("preferredLanguage", language)

    // Update user preference in Firestore if logged in
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.id), {
          preferredLanguage: language,
          updatedAt: new Date(),
        })
      } catch (error) {
        console.error("Error updating user language preference:", error)
      }
    }

    // Redirect to the same page with the new language
    const segments = pathname.split("/")
    if (segments.length > 1 && appConfig.supportedLanguages.includes(segments[1])) {
      segments[1] = language
      router.push(segments.join("/"))
    } else {
      router.push(`/${language}${pathname}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only">{getNativeLanguageName(currentLanguage)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {appConfig.supportedLanguages.map((langCode) => (
          <DropdownMenuItem key={langCode} onClick={() => changeLanguage(langCode)} className="flex items-center gap-2">
            <span>{getNativeLanguageName(langCode)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
