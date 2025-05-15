import { notFound } from "next/navigation"
import { getProductById, getProducts } from "@/lib/products"
import { getMessages, getTranslation } from "@/lib/i18n"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { VariationImageSelector } from "@/components/product/variation-image-selector"
import { Separator } from "@/components/ui/separator"
import appConfig from "@/config/app-config"

interface ProductVariationPageProps {
  params: { lang: string; productId: string; variationId: string }
}

export default async function ProductVariationPage({ params }: ProductVariationPageProps) {
  const { lang, productId, variationId } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Fetch product data
  const product = await getProductById(productId)

  if (!product) {
    notFound()
  }

  // Find the selected variation
  const selectedVariation = product.variations.find((v) => v.id === variationId)

  if (!selectedVariation) {
    notFound()
  }

  // Get all active variations for the selector
  const activeVariations = product.variations

  // Fetch related products (in a real app, this would be more sophisticated)
  const relatedProducts = await getProducts(product.categoryIds[0], 4)

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.products"), href: `/${lang}/products` },
          {
            label: product.name[lang] || product.name[appConfig.defaultLanguage],
            href: `/${lang}/products/${productId}`,
          },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <ProductGallery
          allVariations={product.variations}
          selectedVariation={selectedVariation}
          alt={product.name[lang] || product.name[appConfig.defaultLanguage]}
          lang={lang}
        />

        <div>
          <ProductInfo product={product} selectedVariation={selectedVariation} lang={lang} />

          <Separator className="my-6" />

          <VariationImageSelector
            product={product}
            variations={activeVariations}
            selectedVariationId={selectedVariation.id}
            lang={lang}
          />
        </div>
      </div>

      <ProductTabs product={product} lang={lang} />

      <RelatedProducts products={relatedProducts} lang={lang} />
    </div>
  )
}
