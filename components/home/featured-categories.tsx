import Link from "next/link"
import Image from "next/image"
import { getFeaturedCategoriesConfig } from "@/lib/layout-utils"
import type { Category } from "@/types"
import appConfig from "@/config/app-config"

interface FeaturedCategoriesProps {
  lang: string
  categories: Category[]
}

export function FeaturedCategories({ lang, categories }: FeaturedCategoriesProps) {
  const featuredCategoriesConfig = getFeaturedCategoriesConfig(lang)

  if (!featuredCategoriesConfig.enabled) {
    return null
  }

  // Filter featured categories based on configuration
  const featuredCategories = featuredCategoriesConfig.parentCategoryOnly
    ? categories.filter((category) => !category.parentId).slice(0, featuredCategoriesConfig.count)
    : categories.slice(0, featuredCategoriesConfig.count)

  return (
    <section className="container px-4">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{featuredCategoriesConfig.title}</h2>

      {featuredCategoriesConfig.layout === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              lang={lang}
              showImage={featuredCategoriesConfig.showImages}
            />
          ))}
        </div>
      )}

      {featuredCategoriesConfig.layout === "list" && (
        <div className="space-y-4">
          {featuredCategories.map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              lang={lang}
              showImage={featuredCategoriesConfig.showImages}
            />
          ))}
        </div>
      )}

      {featuredCategoriesConfig.layout === "carousel" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would be replaced with an actual carousel component */}
          {featuredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              lang={lang}
              showImage={featuredCategoriesConfig.showImages}
            />
          ))}
        </div>
      )}
    </section>
  )
}

interface CategoryCardProps {
  category: Category
  lang: string
  showImage: boolean
}

export function CategoryCard({ category, lang, showImage }: CategoryCardProps) {
  return (
    <Link
      href={`/${lang}/categories/${category.slug[lang] || category.slug[appConfig.defaultLanguage]}`}
      className="group relative overflow-hidden rounded-lg"
    >
      {showImage && (
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={category.image || "/placeholder.svg?height=400&width=400&query=category"}
            alt={category.name[lang] || category.name[appConfig.defaultLanguage]}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            width={400}
            height={400}
          />
        </div>
      )}
      <div
        className={`${showImage ? "absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 text-white" : "p-4 border rounded-lg mt-2"}`}
      >
        <h3 className="text-lg font-medium">{category.name[lang] || category.name[appConfig.defaultLanguage]}</h3>
      </div>
    </Link>
  )
}

interface CategoryListItemProps {
  category: Category
  lang: string
  showImage: boolean
}

export function CategoryListItem({ category, lang, showImage }: CategoryListItemProps) {
  return (
    <Link
      href={`/${lang}/categories/${category.slug[lang] || category.slug[appConfig.defaultLanguage]}`}
      className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      {showImage && (
        <div className="w-16 h-16 mr-4 relative rounded overflow-hidden">
          <Image
            src={category.image || "/placeholder.svg?height=64&width=64&query=category"}
            alt={category.name[lang] || category.name[appConfig.defaultLanguage]}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="font-medium">{category.name[lang] || category.name[appConfig.defaultLanguage]}</h3>
        {category.description && (
          <p className="text-sm text-muted-foreground">
            {category.description[lang] || category.description[appConfig.defaultLanguage]}
          </p>
        )}
      </div>
    </Link>
  )
}
