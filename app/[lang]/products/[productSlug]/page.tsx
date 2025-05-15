import { notFound, redirect } from "next/navigation"
import { getProductBySlug } from "@/lib/products"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ProductPageProps {
  params: { lang: string; productSlug: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, productSlug } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Fetch product data
  const product = await getProductBySlug(productSlug, lang)

  if (!product) {
    // Product not found
    notFound()
  }

  // Get active variations
  const activeVariations = product.variations.filter((v) => v.isActive && v.inventory > 0)

  if (activeVariations.length === 0) {
    // No active variations, show 404 page
    notFound()
  }

  // Select the first active variation
  const selectedVariation = activeVariations[0]

  // Redirect to the URL with the selected variation
  redirect(`/${lang}/products/${productSlug}/${selectedVariation.slug}`)
}
