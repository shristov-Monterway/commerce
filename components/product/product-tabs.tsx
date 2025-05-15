import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getMessages, getTranslation } from "@/lib/i18n"
import type { Product } from "@/types"
import appConfig from "@/config/app-config"
import { ProductReviews } from "@/components/product/product-reviews"

interface ProductTabsProps {
  product: Product
  lang: string
}

export async function ProductTabs({ product, lang }: ProductTabsProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <Tabs defaultValue="description" className="mt-8">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="description">{t("products.description")}</TabsTrigger>
        <TabsTrigger value="specifications">{t("products.specifications")}</TabsTrigger>
        <TabsTrigger value="reviews">{t("products.reviews")}</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="py-4">
        <div className="prose prose-sm max-w-none">
          <p>{product.description[lang] || product.description[appConfig.defaultLanguage]}</p>
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">{t("products.sku")}</span>
              <span>{product.sku}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">{t("products.weight")}</span>
              <span>{product.weight}g</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">{t("products.categories")}</span>
              <span>Category 1, Category 2</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">{t("products.tags")}</span>
              <span>{product.tags.map((tag) => tag.name[lang] || tag.name[appConfig.defaultLanguage]).join(", ")}</span>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="reviews" className="py-4">
        <ProductReviews lang={lang} />
      </TabsContent>
    </Tabs>
  )
}
