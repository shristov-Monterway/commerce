import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/currency"
import type { Product } from "@/types"
import appConfig from "@/config/app-config"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ProductCardProps {
  product: Product
  lang: string
  showPrice?: boolean
  showRating?: boolean
  showQuickView?: boolean
  showWishlist?: boolean
  showAddToCart?: boolean
}

export async function ProductCard({
  product,
  lang,
  showPrice = true,
  showRating = true,
  showQuickView = false,
  showWishlist = false,
  showAddToCart = false,
}: ProductCardProps) {
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

  // Use the variation price
  const price = defaultVariation?.price || 0
  const isOnSale = defaultVariation?.compareAtPrice && defaultVariation.compareAtPrice > price
  const isOutOfStock = !defaultVariation || defaultVariation.inventory <= 0

  // Get the product slug for the current language or default language
  const productSlug = product.slug[lang] || product.slug[appConfig.defaultLanguage]

  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <Link href={`/${lang}/products/${productSlug}`} className="block">
          <Image
            src={
              defaultVariation?.images[0] ||
              product.variations[0]?.images[0] ||
              "/placeholder.svg?height=400&width=400&query=product" ||
              "/placeholder.svg"
            }
            alt={product.name[lang] || product.name[appConfig.defaultLanguage]}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            width={400}
            height={400}
          />
        </Link>

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
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

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {showWishlist && (
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Heart className="h-4 w-4" />
              <span className="sr-only">{t("products.addToWishlist")}</span>
            </Button>
          )}
          {showQuickView && (
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Eye className="h-4 w-4" />
              <span className="sr-only">{t("products.quickView")}</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <Link href={`/${lang}/products/${productSlug}`}>
          <h3 className="text-sm font-medium">{product.name[lang] || product.name[appConfig.defaultLanguage]}</h3>
        </Link>

        {showPrice && (
          <div className="mt-1 flex items-center">
            {defaultVariation ? (
              <p className="text-sm font-medium">{formatPrice(price, appConfig.defaultCurrency)}</p>
            ) : (
              <p className="text-sm font-medium">{t("products.priceVaries")}</p>
            )}
            {isOnSale && defaultVariation?.compareAtPrice && (
              <p className="ml-2 text-sm text-muted-foreground line-through">
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

        {showAddToCart && defaultVariation && (
          <Button size="sm" className="mt-3">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t("products.addToCart")}
          </Button>
        )}
      </div>
    </div>
  )
}
