import type { Category } from "@/types"
import { CategoryCard } from "./category-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ChildCategoriesCarouselProps {
  categories: Category[]
  lang: string
}

export async function ChildCategoriesCarousel({ categories, lang }: ChildCategoriesCarouselProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4">{t("categories.subcategories")}</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-6 px-1">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} lang={lang} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
