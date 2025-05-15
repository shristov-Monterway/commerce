import { notFound } from "next/navigation"
import { getCategories, getCategoryBySlug } from "@/lib/categories"
import { getProductsByCategory } from "@/lib/products"
import { getMessages, getTranslation } from "@/lib/i18n"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { ChildCategoriesCarousel } from "@/components/category/child-categories-carousel"
import appConfig from "@/config/app-config"

interface CategoryPageProps {
  params: { lang: string; categorySlug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { lang, categorySlug } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Fetch category data
  const category = await getCategoryBySlug(categorySlug, lang)

  if (!category) {
    notFound()
  }

  // Fetch child categories
  const allCategories = await getCategories()
  const childCategories = allCategories.filter((c) => c.parentId === category.id)

  // Fetch products in this category
  const products = await getProductsByCategory(category.id)

  // Filter out products without active variations
  const activeProducts = products.filter((product) => product.variations.some((v) => v.isActive && v.inventory > 0))

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.categories"), href: `/${lang}/categories` },
          {
            label: category.name[lang] || category.name[appConfig.defaultLanguage],
            href: `/${lang}/categories/${categorySlug}`,
          },
        ]}
        lang={lang}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold">{category.name[lang] || category.name[appConfig.defaultLanguage]}</h1>
        <p className="mt-2 text-muted-foreground">
          {category.description[lang] || category.description[appConfig.defaultLanguage]}
        </p>
      </div>

      {/* Child categories carousel - only shown if there are child categories */}
      {childCategories.length > 0 && <ChildCategoriesCarousel categories={childCategories} lang={lang} />}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProductFilters
            searchParams={searchParams}
            products={activeProducts}
            lang={lang}
            excludeCategories={true} // Exclude category filter on category page
          />
        </div>
        <div className="md:col-span-3">
          <ProductGrid products={activeProducts} lang={lang} />
        </div>
      </div>
    </div>
  )
}
