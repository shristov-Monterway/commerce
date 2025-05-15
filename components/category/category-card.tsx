import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/types"
import appConfig from "@/config/app-config"

interface CategoryCardProps {
  category: Category
  lang: string
}

export function CategoryCard({ category, lang }: CategoryCardProps) {
  // Get the category slug for the current language or default language
  const categorySlug = category.slug[lang] || category.slug[appConfig.defaultLanguage]
  const categoryName = category.name[lang] || category.name[appConfig.defaultLanguage]

  return (
    <Link href={`/${lang}/categories/${categorySlug}`} className="flex flex-col items-center group">
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-primary transition-colors">
        <Image
          src={category.image || "/placeholder.svg?height=128&width=128&query=category"}
          alt={categoryName}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">{categoryName}</span>
    </Link>
  )
}
