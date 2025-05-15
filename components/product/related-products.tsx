import { getProductDetailConfig } from "@/lib/layout-utils"
import { getMessages, getTranslation } from "@/lib/i18n"
import type { Product } from "@/types"
import { ProductCard } from "@/components/product/product-card"

interface RelatedProductsProps {
  products: Product[]
  lang: string
}

export async function RelatedProducts({ products, lang }: RelatedProductsProps) {
  const productDetailConfig = getProductDetailConfig(lang)
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  if (!productDetailConfig.showRelatedProducts || products.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{t("products.relatedProducts")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            lang={lang}
            showPrice={true}
            showRating={true}
            showQuickView={productDetailConfig.showQuantitySelector}
          />
        ))}
      </div>
    </section>
  )
}
