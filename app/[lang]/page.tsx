import { getProducts, getCategories } from "@/lib/products"
import { getMessages, getTranslation } from "@/lib/i18n"
import { Hero } from "@/components/home/hero"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"

export default async function HomePage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Fetch data
  const products = await getProducts(undefined, 8)
  const categories = await getCategories()

  return (
    <div className="flex flex-col gap-12 py-8">
      <Hero lang={lang} />
      <FeaturedCategories lang={lang} categories={categories} />
      <FeaturedProducts lang={lang} products={products} />
      <Testimonials lang={lang} />
      <Newsletter lang={lang} />
    </div>
  )
}
