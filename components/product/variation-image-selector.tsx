import Link from "next/link"
import Image from "next/image"
import type { ProductVariationType } from "@/types"
import appConfig from "@/config/app-config"

interface VariationImageSelectorProps {
  variations: ProductVariationType[]
  selectedVariation: ProductVariationType
  productSlug: string
  lang: string
}

export function VariationImageSelector({
  variations,
  selectedVariation,
  productSlug,
  lang,
}: VariationImageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {variations.map((variation) => {
        const isSelected = variation.id === selectedVariation.id
        const isOutOfStock = variation.inventory <= 0

        return (
          <Link
            key={variation.id}
            href={`/${lang}/products/${productSlug}/${variation.slug}`}
            className={`
              relative block w-16 h-16 rounded-md overflow-hidden border-2 transition-all
              ${isSelected ? "border-primary shadow-md" : "border-muted"}
              ${isOutOfStock ? "opacity-50" : "hover:border-primary/50"}
            `}
          >
            <Image
              src={variation.images[0] || "/placeholder.svg?height=64&width=64&query=variation"}
              alt={variation.name[lang] || variation.name[appConfig.defaultLanguage]}
              fill
              className="object-cover"
            />
          </Link>
        )
      })}
    </div>
  )
}
