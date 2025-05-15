import appConfig from "@/config/app-config"
import type {
  PageLayoutConfig,
  HeroConfig,
  FeaturedProductsConfig,
  FeaturedCategoriesConfig,
  TestimonialsConfig,
  NewsletterConfig,
  HeaderConfig,
  FooterConfig,
  ProductListConfig,
  ProductDetailConfig,
  CartConfig,
  CheckoutConfig,
} from "@/config/app-config"

/**
 * Gets the layout configuration for a specific language
 * @param lang The language code
 * @returns The layout configuration for the language
 */
export function getLayoutConfig(lang: string): PageLayoutConfig {
  // Get the layout config for the language, or fall back to the default language
  return appConfig.layouts[lang] || appConfig.layouts[appConfig.defaultLanguage]
}

/**
 * Gets the home page hero configuration for a specific language
 * @param lang The language code
 * @returns The hero configuration
 */
export function getHeroConfig(lang: string): HeroConfig {
  return getLayoutConfig(lang).home.hero
}

/**
 * Gets the featured products configuration for a specific language
 * @param lang The language code
 * @returns The featured products configuration
 */
export function getFeaturedProductsConfig(lang: string): FeaturedProductsConfig {
  return getLayoutConfig(lang).home.featuredProducts
}

/**
 * Gets the featured categories configuration for a specific language
 * @param lang The language code
 * @returns The featured categories configuration
 */
export function getFeaturedCategoriesConfig(lang: string): FeaturedCategoriesConfig {
  return getLayoutConfig(lang).home.featuredCategories
}

/**
 * Gets the testimonials configuration for a specific language
 * @param lang The language code
 * @returns The testimonials configuration
 */
export function getTestimonialsConfig(lang: string): TestimonialsConfig {
  return getLayoutConfig(lang).home.testimonials
}

/**
 * Gets the newsletter configuration for a specific language
 * @param lang The language code
 * @returns The newsletter configuration
 */
export function getNewsletterConfig(lang: string): NewsletterConfig {
  return getLayoutConfig(lang).home.newsletter
}

/**
 * Gets the header configuration for a specific language
 * @param lang The language code
 * @returns The header configuration
 */
export function getHeaderConfig(lang: string): HeaderConfig {
  return getLayoutConfig(lang).header
}

/**
 * Gets the footer configuration for a specific language
 * @param lang The language code
 * @returns The footer configuration
 */
export function getFooterConfig(lang: string): FooterConfig {
  return getLayoutConfig(lang).footer
}

/**
 * Gets the product list configuration for a specific language
 * @param lang The language code
 * @returns The product list configuration
 */
export function getProductListConfig(lang: string): ProductListConfig {
  return getLayoutConfig(lang).productList
}

/**
 * Gets the product detail configuration for a specific language
 * @param lang The language code
 * @returns The product detail configuration
 */
export function getProductDetailConfig(lang: string): ProductDetailConfig {
  return getLayoutConfig(lang).productDetail
}

/**
 * Gets the cart configuration for a specific language
 * @param lang The language code
 * @returns The cart configuration
 */
export function getCartConfig(lang: string): CartConfig {
  return getLayoutConfig(lang).cart
}

/**
 * Gets the checkout configuration for a specific language
 * @param lang The language code
 * @returns The checkout configuration
 */
export function getCheckoutConfig(lang: string): CheckoutConfig {
  return getLayoutConfig(lang).checkout
}
