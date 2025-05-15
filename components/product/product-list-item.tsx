import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/currency"
import type { Product } from "@/types"
import appConfig from "@/config/app-config"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ProductListItemProps {
  product: Product
  lang: string
  showPrice?: boolean
  showRating?: boolean
  showAddToCart?: boolean
  showWishlist?: boolean
}

export async function ProductListItem({
  product,
  lang,
  showPrice = true,
  showRating = true,
  showAddToCart = false,
  showWishlist = false,
}: ProductListItemProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Get the first active variation or null
  const activeVariations = product.variations.filter((v) => v.isActive && v.inventory > 0)
  const defaultVariation = activeVariations.length > 0 ? activeVariations[0] : null

  // Check if product should be displayed (has at least one active variation)
  const hasActiveVariation = activeVariations.length > 0

  if (!hasActiveVariation) {
    return null // Don't display products without active variations
  }

  const price = defaultVariation?.price || 0
  const isOnSale = defaultVariation?.compareAtPrice && defaultVariation.compareAtPrice > price
  const isOutOfStock = !defaultVariation || defaultVariation.inventory <= 0

  // Get the product slug for the current language or default language
  const productSlug = product.slug[lang] || product.slug[appConfig.defaultLanguage]

  return (
    <div className="flex border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="relative w-24 h-24 md:w-40 md:h-40 rounded overflow-hidden mr-4">
        <Link href={`/${lang}/products/${productSlug}`}>
          <Image
            src={
              defaultVariation?.images[0] ||
              product.variations[0]?.images[0] ||
              "/placeholder.svg?height=160&width=160&query=product" ||
              "/placeholder.svg"
            }
            alt={product.name[lang] || product.name[appConfig.defaultLanguage]}
            fill
            className="object-cover"
          />
        </Link>

        {/* Product badges */}
        <div className="absolute top-1 left-1 flex flex-col gap-1">
          {isOnSale && (
            <Badge variant="destructive" className="text-xs">
              {t("products.sale")}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-xs">
              {t("products.outOfStock")}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1">
        <Link href={`/${lang}/products/${productSlug}`}>
          <h3 className="font-medium">{product.name[lang] || product.name[appConfig.defaultLanguage]}</h3>
        </Link>

        {showPrice && (
          <div className="mt-1 flex items-center">
            {defaultVariation ? (
              <p className="font-medium">{formatPrice(price, appConfig.defaultCurrency)}</p>
            ) : (
              <p className="font-medium">{t("products.priceVaries")}</p>
            )}
            {isOnSale && defaultVariation?.compareAtPrice && (
              <p className="ml-2 text-muted-foreground line-through">
                {formatPrice(defaultVariation.compareAtPrice, appConfig.defaultCurrency)}
              </p>
            )}
          </div>
        )}

        {showRating && (
          <div className="mt-1 flex items-center">
            {/* This would be replaced with an actual rating component */}
            <div className="flex text-yellow-400">
              <span>★★★★☆</span>
            </div>
            <span className="ml-1 text-xs text-muted-foreground">(4.2)</span>
          </div>
        )}

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description[lang] || product.description[appConfig.defaultLanguage]}
        </p>

        <div className="mt-4 flex gap-2">
          {showAddToCart && defaultVariation && (
            <Button size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t("products.addToCart")}
            </Button>
          )}
          {showWishlist && (
            <Button size="sm" variant="outline">
              <Heart className="mr-2 h-4 w-4" />
              {t("products.addToWishlist")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
