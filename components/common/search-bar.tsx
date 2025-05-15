"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { getMessages, getTranslation } from "@/lib/i18n"

interface SearchBarProps {
  lang: string
  initialQuery?: string
  className?: string
}

export async function SearchBar({ lang, initialQuery = "", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${lang}/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="search"
        placeholder={t("common.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
        <Search className="h-4 w-4" />
        <span className="sr-only">{t("common.search")}</span>
      </Button>
    </form>
  )
}
