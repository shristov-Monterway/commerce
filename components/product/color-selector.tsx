"use client"

import { cn } from "@/lib/utils"
import { getMessages, getTranslation } from "@/lib/i18n"

interface Color {
  name: string
  value: string
}

interface ColorSelectorProps {
  colors: Color[]
  selectedColor: string
  onSelectColor: (color: string) => void
  lang?: string
}

export async function ColorSelector({ colors, selectedColor, onSelectColor, lang = "en" }: ColorSelectorProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{t("products.color")}</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            className={cn(
              "group relative h-10 w-10 rounded-full border p-1",
              selectedColor === color.value && "ring-2 ring-primary ring-offset-2",
            )}
            onClick={() => onSelectColor(color.value)}
            title={color.name}
          >
            <span className="block h-full w-full rounded-full" style={{ backgroundColor: color.value }}></span>
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
