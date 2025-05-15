"use client"

import { cn } from "@/lib/utils"
import { getMessages, getTranslation } from "@/lib/i18n"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onSelectSize: (size: string) => void
  lang?: string
}

export async function SizeSelector({ sizes, selectedSize, onSelectSize, lang = "en" }: SizeSelectorProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">{t("products.size")}</label>
        <button className="text-sm text-primary hover:underline">{t("products.sizeGuide")}</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={cn(
              "flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border px-3 text-sm",
              selectedSize === size
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-muted/50",
            )}
            onClick={() => onSelectSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
