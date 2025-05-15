import Link from "next/link"
import { getFeaturedProductsConfig } from "@/lib/layout-utils"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"
import { ProductListItem } from "@/components/product/product-list-item"
import { getMessages, getTranslation } from "@/lib/i18n"

interface FeaturedProductsProps {
  lang: string
  products: Product[]
}

export async function FeaturedProducts({ lang, products }: FeaturedProductsProps) {
  const featuredProductsConfig = getFeaturedProductsConfig(lang)
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  if (!featuredProductsConfig.enabled) {
    return null
  }

  return (
    <section className="container px-4">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{featuredProductsConfig.title}</h2>

      {featuredProductsConfig.layout === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              showPrice={featuredProductsConfig.showPrices}
              showRating={featuredProductsConfig.showRatings}
            />
          ))}
        </div>
      )}

      {featuredProductsConfig.layout === "list" && (
        <div className="space-y-6">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              lang={lang}
              showPrice={featuredProductsConfig.showPrices}
              showRating={featuredProductsConfig.showRatings}
            />
          ))}
        </div>
      )}

      {featuredProductsConfig.layout === "carousel" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* This would be replaced with an actual carousel component */}
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              showPrice={featuredProductsConfig.showPrices}
              showRating={featuredProductsConfig.showRatings}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href={`/${lang}/products`}>{t("home.featuredProducts.viewAll")}</Link>
        </Button>
      </div>
    </section>
  )
}
