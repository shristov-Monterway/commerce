import type { Product } from "@/types"
import { ProductCard } from "./product-card"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ProductGridProps {
  products: Product[]
  lang: string
}

export async function ProductGrid({ products, lang }: ProductGridProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">{t("products.noProductsFound")}</h3>
        <p className="text-muted-foreground mt-2">{t("products.tryDifferentFilters")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          lang={lang}
          showPrice={true}
          showRating={true}
          showAddToCart={true}
        />
      ))}
    </div>
  )
}
