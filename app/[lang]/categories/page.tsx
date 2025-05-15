import { getCategories } from "@/lib/categories"
import { getMessages, getTranslation } from "@/lib/i18n"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { CategoryCard } from "@/components/category/category-card"

interface CategoriesPageProps {
  params: { lang: string }
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { lang } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Fetch all categories
  const allCategories = await getCategories()

  // Get top-level categories (no parent)
  const topLevelCategories = allCategories.filter((c) => !c.parentId)

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.categories"), href: `/${lang}/categories` },
        ]}
        lang={lang}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold">{t("navigation.categories")}</h1>
        <p className="mt-2 text-muted-foreground">{t("categories.browseAllCategories")}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {topLevelCategories.map((category) => (
          <div key={category.id} className="flex justify-center">
            <CategoryCard category={category} lang={lang} />
          </div>
        ))}
      </div>
    </div>
  )
}
