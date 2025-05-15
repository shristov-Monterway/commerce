import { notFound } from "next/navigation"
import { getProductBySlug } from "@/lib/products"
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
  params: { lang: string; productSlug: string; variationSlug: string }
}

export default async function ProductVariationPage({ params }: ProductVariationPageProps) {
  const { lang, productSlug, variationSlug } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Fetch product data
  const product = await getProductBySlug(productSlug, lang)

  if (!product) {
    notFound()
  }

  // Find the selected variation
  const selectedVariation = product.variations.find((v) => v.slug === variationSlug)

  if (!selectedVariation) {
    notFound()
  }

  // Get all active variations for the selector
  const activeVariations = product.variations.filter((v) => v.isActive && v.inventory > 0)

  // Collect all images from all variations for the gallery
  const allImages = product.variations.flatMap((v) => v.images)

  // Start with the selected variation's images
  const orderedImages = [
    ...selectedVariation.images,
    ...allImages.filter((img) => !selectedVariation.images.includes(img)),
  ]

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.products"), href: `/${lang}/products` },
          {
            label: product.name[lang] || product.name[appConfig.defaultLanguage],
            href: `/${lang}/products/${productSlug}`,
          },
        ]}
        lang={lang}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductGallery images={orderedImages} />
        </div>

        <div>
          {/* Product Information */}
          <h1 className="text-3xl font-bold">{product.name[lang] || product.name[appConfig.defaultLanguage]}</h1>
          <p className="mt-2 text-muted-foreground">
            {product.description[lang] || product.description[appConfig.defaultLanguage]}
          </p>

          <Separator className="my-6" />

          {/* Variation Information */}
          <ProductInfo product={product} variation={selectedVariation} lang={lang} />

          <Separator className="my-6" />

          {/* Variation Selector */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t("products.otherVariations")}</h3>
            <VariationImageSelector
              variations={activeVariations}
              selectedVariation={selectedVariation}
              productSlug={productSlug}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductTabs product={product} variation={selectedVariation} lang={lang} />
      </div>

      <div className="mt-12">
        <RelatedProducts product={product} lang={lang} />
      </div>
    </div>
  )
}
