import { Suspense } from "react"
import { getProducts, getCategories } from "@/lib/products"
import { getMessages, getTranslation } from "@/lib/i18n"
import { getProductListConfig } from "@/lib/layout-utils"
import { ProductCard } from "@/components/product/product-card"
import { ProductListItem } from "@/components/product/product-list-item"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { Pagination } from "@/components/common/pagination"
import { SearchBar } from "@/components/common/search-bar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, Grid3X3, List } from "lucide-react"
import { buildAttributeFilters, filterProductsByAttributes } from "@/lib/product-filters"
import appConfig from "@/config/app-config"

interface ProductsPageProps {
  params: { lang: string }
  searchParams: {
    page?: string
    sort?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    [key: string]: string | string[] | undefined
  }
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = params
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Get configuration
  const productListConfig = getProductListConfig(lang)

  // Parse search params
  const page = Number.parseInt(searchParams.page || "1")
  const sort = searchParams.sort || productListConfig.defaultSort
  const categoryFilter = searchParams.category
  const minPrice = Number.parseInt(searchParams.minPrice || "0")
  const maxPrice = Number.parseInt(searchParams.maxPrice || "1000")

  // Extract attribute filters from search params
  const attributeFilters: Record<string, string[]> = {}
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key.startsWith("attr_")) {
      const attributeId = key.replace("attr_", "")
      attributeFilters[attributeId] = Array.isArray(value) ? value : [value as string]
    }
  })

  // Fetch data
  const allProducts = await getProducts()
  const categories = await getCategories()

  // Build dynamic attribute filters
  const availableFilters = buildAttributeFilters(allProducts)

  // Apply filters
  let filteredProducts = allProducts

  // Filter by category
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter((product) => product.categoryIds.includes(categoryFilter))
  }

  // Filter by attributes
  if (Object.keys(attributeFilters).length > 0) {
    filteredProducts = filterProductsByAttributes(filteredProducts, attributeFilters)
  }

  // Filter by price (would need to be implemented based on variations)

  // Sort products
  switch (sort) {
    case "price-low-high":
      filteredProducts.sort((a, b) => {
        const aPrice = a.variations.find((v) => v.isActive && v.inventory > 0)?.price || Number.POSITIVE_INFINITY
        const bPrice = b.variations.find((v) => v.isActive && v.inventory > 0)?.price || Number.POSITIVE_INFINITY
        return aPrice - bPrice
      })
      break
    case "price-high-low":
      filteredProducts.sort((a, b) => {
        const aPrice = a.variations.find((v) => v.isActive && v.inventory > 0)?.price || 0
        const bPrice = b.variations.find((v) => v.isActive && v.inventory > 0)?.price || 0
        return bPrice - aPrice
      })
      break
    case "newest":
      filteredProducts.sort((a, b) => {
        const aDate = Math.max(...a.variations.map((v) => v.createdAt))
        const bDate = Math.max(...b.variations.map((v) => v.createdAt))
        return bDate - aDate
      })
      break
    // Add more sorting options as needed
  }

  // Pagination
  const itemsPerPage = productListConfig.itemsPerPage
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: t("navigation.home"), href: `/${lang}` },
          { label: t("navigation.products"), href: `/${lang}/products` },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">{t("products.allProducts")}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        {productListConfig.showFilters && productListConfig.filterPosition === "sidebar" && (
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">{t("products.categories")}</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={categoryFilter === category.id}
                        onCheckedChange={(checked) => {
                          // This would be handled by a client component in a real app
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`}>
                        {category.name[lang] || category.name[appConfig.defaultLanguage]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic attribute filters */}
              {availableFilters.map((filter) => (
                <div key={filter.attributeId}>
                  <h3 className="font-medium mb-4">
                    {filter.attributeName[lang] || filter.attributeName[appConfig.defaultLanguage]}
                  </h3>
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`attr-${filter.attributeId}-${option.id}`}
                          checked={attributeFilters[filter.attributeId]?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            // This would be handled by a client component in a real app
                          }}
                        />
                        <Label htmlFor={`attr-${filter.attributeId}-${option.id}`}>
                          {option.name[lang] || option.name[appConfig.defaultLanguage]} ({option.count})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="font-medium mb-4">{t("products.priceRange")}</h3>
                <Slider defaultValue={[minPrice, maxPrice]} min={0} max={1000} step={10} />
                <div className="flex justify-between mt-2 text-sm">
                  <span>${minPrice}</span>
                  <span>${maxPrice}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t("products.applyFilters")}
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1">
          {/* Top filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">{t("products.gridView")}</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
                <span className="sr-only">{t("products.listView")}</span>
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {t("products.showing", { count: paginatedProducts.length, total: filteredProducts.length })}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SearchBar lang={lang} className="w-full sm:w-auto" />
              <Select defaultValue={sort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("products.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("products.sortNewest")}</SelectItem>
                  <SelectItem value="price-low-high">{t("products.sortPriceLowHigh")}</SelectItem>
                  <SelectItem value="price-high-low">{t("products.sortPriceHighLow")}</SelectItem>
                  <SelectItem value="popular">{t("products.sortPopular")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products grid */}
          {productListConfig.layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Suspense fallback={<div>Loading products...</div>}>
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    showQuickView={productListConfig.showQuickView}
                    showWishlist={true}
                    showAddToCart={true}
                  />
                ))}
              </Suspense>
            </div>
          ) : (
            <div className="space-y-6">
              <Suspense fallback={<div>Loading products...</div>}>
                {paginatedProducts.map((product) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    lang={lang}
                    showAddToCart={true}
                    showWishlist={true}
                  />
                ))}
              </Suspense>
            </div>
          )}

          {/* Pagination */}
          <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/${lang}/products`} lang={lang} />
        </div>
      </div>
    </div>
  )
}
