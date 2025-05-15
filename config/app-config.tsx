import type { TranslatedText } from "@/types"

// Define types for layout configuration
export interface HeroConfig {
  type: "simple" | "split" | "fullWidth"
  title: string
  description: string
  primaryButtonText: string
  secondaryButtonText?: string
  imageSrc: string
  backgroundColor?: string
  textColor?: string
  showSearchBar?: boolean
}

export interface FeaturedProductsConfig {
  enabled: boolean
  title: string
  count: number
  layout: "grid" | "carousel" | "list"
  showPrices: boolean
  showRatings: boolean
  categoryFilter?: string
  tagFilter?: string[]
}

export interface FeaturedCategoriesConfig {
  enabled: boolean
  title: string
  count: number
  layout: "grid" | "carousel" | "list"
  showImages: boolean
  parentCategoryOnly: boolean
}

export interface TestimonialsConfig {
  enabled: boolean
  title: string
  layout: "carousel" | "grid" | "list"
  backgroundColor?: string
}

export interface NewsletterConfig {
  enabled: boolean
  title: string
  description: string
  buttonText: string
  backgroundColor?: string
  position: "top" | "middle" | "bottom"
}

export interface FooterConfig {
  showSocialLinks: boolean
  showLanguageSelector: boolean
  showCurrencySelector: boolean
  columns: {
    title: string
    links: Array<{
      text: string
      url: string
    }>
  }[]
}

export interface HeaderConfig {
  logoPosition: "left" | "center"
  showSearchBar: boolean
  showLanguageSelector: boolean
  showCurrencySelector: boolean
  showCartIcon: boolean
  showAccountIcon: boolean
  navigationLinks: Array<{
    text: string
    url: string
  }>
}

export interface ProductListConfig {
  defaultSort: "newest" | "price-low-high" | "price-high-low" | "popular"
  itemsPerPage: number
  layout: "grid" | "list"
  showFilters: boolean
  filterPosition: "sidebar" | "top"
  showQuickView: boolean
}

export interface ProductDetailConfig {
  layout: "standard" | "gallery" | "compact"
  showRelatedProducts: boolean
  showReviews: boolean
  showQuantitySelector: boolean
  showSocialSharing: boolean
  imageZoom: boolean
}

export interface CartConfig {
  showThumbnails: boolean
  showCrossSells: boolean
  showSaveLater: boolean
}

export interface CheckoutConfig {
  steps: ("cart" | "address" | "shipping" | "payment" | "review")[]
  showOrderSummary: boolean
  showLoginPrompt: boolean
}

export interface PageLayoutConfig {
  home: {
    hero: HeroConfig
    featuredProducts: FeaturedProductsConfig
    featuredCategories: FeaturedCategoriesConfig
    testimonials: TestimonialsConfig
    newsletter: NewsletterConfig
  }
  header: HeaderConfig
  footer: FooterConfig
  productList: ProductListConfig
  productDetail: ProductDetailConfig
  cart: CartConfig
  checkout: CheckoutConfig
}

// Define language-specific layout configurations
export type LanguageLayoutConfigs = {
  [langCode: string]: PageLayoutConfig
}

export interface AppConfig {
  // Store information
  storeName: TranslatedText
  storeDescription: TranslatedText

  // Currency settings
  defaultCurrency: string
  supportedCurrencies: string[]

  // Language settings
  defaultLanguage: string
  supportedLanguages: string[]

  // Layout configurations per language
  layouts: LanguageLayoutConfigs

  // Firebase config
  firebaseConfig: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
  }

  // Stripe config
  stripe: {
    publishableKey: string
    webhookSecret: string
  }

  // Base URL
  baseUrl: string

  // OpenAI API for translations
  openAI: {
    apiKey: string
    model: string
  }
}

const appConfig: AppConfig = {
  storeName: {
    en: "GlobalShop",
    es: "GlobalShop",
    fr: "GlobalShop",
    de: "GlobalShop",
  },
  storeDescription: {
    en: "Your global marketplace for quality products",
    es: "Tu mercado global para productos de calidad",
    fr: "Votre marché mondial pour des produits de qualité",
    de: "Ihr globaler Marktplatz für Qualitätsprodukte",
  },

  defaultCurrency: "USD",
  supportedCurrencies: ["USD", "EUR", "GBP", "JPY"],

  defaultLanguage: "en",
  supportedLanguages: ["en", "es", "fr", "de"],

  // Layout configurations per language
  layouts: {
    // English layout configuration
    en: {
      home: {
        hero: {
          type: "split",
          title: "Shop Global, Feel Local",
          description:
            "Discover products from around the world, with prices in your currency and descriptions in your language.",
          primaryButtonText: "Shop Now",
          secondaryButtonText: "Browse Categories",
          imageSrc: "/colorful-shopping-items.png",
          showSearchBar: false,
        },
        featuredProducts: {
          enabled: true,
          title: "Featured Products",
          count: 8,
          layout: "grid",
          showPrices: true,
          showRatings: true,
        },
        featuredCategories: {
          enabled: true,
          title: "Shop by Category",
          count: 4,
          layout: "grid",
          showImages: true,
          parentCategoryOnly: true,
        },
        testimonials: {
          enabled: false,
          title: "What Our Customers Say",
          layout: "carousel",
        },
        newsletter: {
          enabled: false,
          title: "Subscribe to Our Newsletter",
          description: "Get the latest updates on new products and upcoming sales",
          buttonText: "Subscribe",
          position: "bottom",
        },
      },
      header: {
        logoPosition: "left",
        showSearchBar: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        showCartIcon: true,
        showAccountIcon: true,
        navigationLinks: [
          { text: "Products", url: "/products" },
          { text: "Categories", url: "/categories" },
        ],
      },
      footer: {
        showSocialLinks: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        columns: [
          {
            title: "Shop",
            links: [
              { text: "All Products", url: "/products" },
              { text: "Categories", url: "/categories" },
              { text: "New Arrivals", url: "/new-arrivals" },
              { text: "Sale", url: "/sale" },
            ],
          },
          {
            title: "Account",
            links: [
              { text: "My Account", url: "/account" },
              { text: "Order History", url: "/account/orders" },
              { text: "Wishlist", url: "/account/wishlist" },
              { text: "Shopping Cart", url: "/cart" },
            ],
          },
          {
            title: "Info",
            links: [
              { text: "About Us", url: "/about" },
              { text: "Contact", url: "/contact" },
              { text: "Shipping Policy", url: "/shipping" },
              { text: "Privacy Policy", url: "/privacy" },
              { text: "Terms & Conditions", url: "/terms" },
            ],
          },
        ],
      },
      productList: {
        defaultSort: "newest",
        itemsPerPage: 12,
        layout: "grid",
        showFilters: true,
        filterPosition: "sidebar",
        showQuickView: true,
      },
      productDetail: {
        layout: "standard",
        showRelatedProducts: true,
        showReviews: true,
        showQuantitySelector: true,
        showSocialSharing: true,
        imageZoom: true,
      },
      cart: {
        showThumbnails: true,
        showCrossSells: true,
        showSaveLater: false,
      },
      checkout: {
        steps: ["cart", "address", "shipping", "payment", "review"],
        showOrderSummary: true,
        showLoginPrompt: true,
      },
    },

    // Spanish layout configuration - with some differences
    es: {
      home: {
        hero: {
          type: "fullWidth",
          title: "Compra Global, Siente Local",
          description: "Descubre productos de todo el mundo, con precios en tu moneda y descripciones en tu idioma.",
          primaryButtonText: "Comprar Ahora",
          secondaryButtonText: "Explorar Categorías",
          imageSrc: "/colorful-shopping-items.png",
          backgroundColor: "#f8f9fa",
          showSearchBar: true,
        },
        featuredProducts: {
          enabled: true,
          title: "Productos Destacados",
          count: 6,
          layout: "carousel",
          showPrices: true,
          showRatings: true,
        },
        featuredCategories: {
          enabled: true,
          title: "Comprar por Categoría",
          count: 6,
          layout: "carousel",
          showImages: true,
          parentCategoryOnly: false,
        },
        testimonials: {
          enabled: true,
          title: "Lo Que Dicen Nuestros Clientes",
          layout: "carousel",
          backgroundColor: "#f8f9fa",
        },
        newsletter: {
          enabled: true,
          title: "Suscríbete a Nuestro Boletín",
          description: "Recibe las últimas actualizaciones sobre nuevos productos y próximas ofertas",
          buttonText: "Suscribirse",
          backgroundColor: "#f8f9fa",
          position: "bottom",
        },
      },
      header: {
        logoPosition: "center",
        showSearchBar: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        showCartIcon: true,
        showAccountIcon: true,
        navigationLinks: [
          { text: "Productos", url: "/products" },
          { text: "Categorías", url: "/categories" },
          { text: "Ofertas", url: "/sale" },
        ],
      },
      footer: {
        showSocialLinks: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        columns: [
          {
            title: "Tienda",
            links: [
              { text: "Todos los Productos", url: "/products" },
              { text: "Categorías", url: "/categories" },
              { text: "Nuevos Productos", url: "/new-arrivals" },
              { text: "Ofertas", url: "/sale" },
            ],
          },
          {
            title: "Cuenta",
            links: [
              { text: "Mi Cuenta", url: "/account" },
              { text: "Historial de Pedidos", url: "/account/orders" },
              { text: "Lista de Deseos", url: "/account/wishlist" },
              { text: "Carrito de Compras", url: "/cart" },
            ],
          },
          {
            title: "Información",
            links: [
              { text: "Sobre Nosotros", url: "/about" },
              { text: "Contacto", url: "/contact" },
              { text: "Política de Envío", url: "/shipping" },
              { text: "Política de Privacidad", url: "/privacy" },
              { text: "Términos y Condiciones", url: "/terms" },
            ],
          },
        ],
      },
      productList: {
        defaultSort: "newest",
        itemsPerPage: 9,
        layout: "grid",
        showFilters: true,
        filterPosition: "top",
        showQuickView: true,
      },
      productDetail: {
        layout: "gallery",
        showRelatedProducts: true,
        showReviews: true,
        showQuantitySelector: true,
        showSocialSharing: true,
        imageZoom: true,
      },
      cart: {
        showThumbnails: true,
        showCrossSells: true,
        showSaveLater: true,
      },
      checkout: {
        steps: ["cart", "address", "shipping", "payment", "review"],
        showOrderSummary: true,
        showLoginPrompt: true,
      },
    },

    // French layout configuration
    fr: {
      home: {
        hero: {
          type: "split",
          title: "Achetez Global, Sentez Local",
          description:
            "Découvrez des produits du monde entier, avec des prix dans votre devise et des descriptions dans votre langue.",
          primaryButtonText: "Acheter Maintenant",
          secondaryButtonText: "Parcourir les Catégories",
          imageSrc: "/colorful-shopping-items.png",
          showSearchBar: false,
        },
        featuredProducts: {
          enabled: true,
          title: "Produits en Vedette",
          count: 4,
          layout: "grid",
          showPrices: true,
          showRatings: true,
        },
        featuredCategories: {
          enabled: true,
          title: "Acheter par Catégorie",
          count: 3,
          layout: "grid",
          showImages: true,
          parentCategoryOnly: true,
        },
        testimonials: {
          enabled: true,
          title: "Ce Que Disent Nos Clients",
          layout: "list",
        },
        newsletter: {
          enabled: true,
          title: "Abonnez-vous à Notre Newsletter",
          description: "Recevez les dernières mises à jour sur les nouveaux produits et les ventes à venir",
          buttonText: "S'abonner",
          position: "middle",
        },
      },
      header: {
        logoPosition: "left",
        showSearchBar: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        showCartIcon: true,
        showAccountIcon: true,
        navigationLinks: [
          { text: "Produits", url: "/products" },
          { text: "Catégories", url: "/categories" },
          { text: "Nouveautés", url: "/new-arrivals" },
        ],
      },
      footer: {
        showSocialLinks: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        columns: [
          {
            title: "Boutique",
            links: [
              { text: "Tous les Produits", url: "/products" },
              { text: "Catégories", url: "/categories" },
              { text: "Nouveautés", url: "/new-arrivals" },
              { text: "Soldes", url: "/sale" },
            ],
          },
          {
            title: "Compte",
            links: [
              { text: "Mon Compte", url: "/account" },
              { text: "Historique des Commandes", url: "/account/orders" },
              { text: "Liste de Souhaits", url: "/account/wishlist" },
              { text: "Panier", url: "/cart" },
            ],
          },
          {
            title: "Information",
            links: [
              { text: "À Propos de Nous", url: "/about" },
              { text: "Contact", url: "/contact" },
              { text: "Politique d'Expédition", url: "/shipping" },
              { text: "Politique de Confidentialité", url: "/privacy" },
              { text: "Conditions Générales", url: "/terms" },
            ],
          },
        ],
      },
      productList: {
        defaultSort: "price-low-high",
        itemsPerPage: 10,
        layout: "grid",
        showFilters: true,
        filterPosition: "sidebar",
        showQuickView: true,
      },
      productDetail: {
        layout: "standard",
        showRelatedProducts: true,
        showReviews: true,
        showQuantitySelector: true,
        showSocialSharing: true,
        imageZoom: true,
      },
      cart: {
        showThumbnails: true,
        showCrossSells: true,
        showSaveLater: true,
      },
      checkout: {
        steps: ["cart", "address", "shipping", "payment", "review"],
        showOrderSummary: true,
        showLoginPrompt: true,
      },
    },

    // German layout configuration
    de: {
      home: {
        hero: {
          type: "simple",
          title: "Global Einkaufen, Lokal Fühlen",
          description:
            "Entdecken Sie Produkte aus der ganzen Welt, mit Preisen in Ihrer Währung und Beschreibungen in Ihrer Sprache.",
          primaryButtonText: "Jetzt Einkaufen",
          secondaryButtonText: "Kategorien Durchsuchen",
          imageSrc: "/colorful-shopping-items.png",
          backgroundColor: "#f0f0f0",
          showSearchBar: true,
        },
        featuredProducts: {
          enabled: true,
          title: "Ausgewählte Produkte",
          count: 8,
          layout: "grid",
          showPrices: true,
          showRatings: false,
        },
        featuredCategories: {
          enabled: true,
          title: "Nach Kategorie Einkaufen",
          count: 4,
          layout: "list",
          showImages: true,
          parentCategoryOnly: true,
        },
        testimonials: {
          enabled: false,
          title: "Was Unsere Kunden Sagen",
          layout: "grid",
        },
        newsletter: {
          enabled: true,
          title: "Abonnieren Sie Unseren Newsletter",
          description: "Erhalten Sie die neuesten Updates zu neuen Produkten und kommenden Angeboten",
          buttonText: "Abonnieren",
          backgroundColor: "#f0f0f0",
          position: "top",
        },
      },
      header: {
        logoPosition: "left",
        showSearchBar: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        showCartIcon: true,
        showAccountIcon: true,
        navigationLinks: [
          { text: "Produkte", url: "/products" },
          { text: "Kategorien", url: "/categories" },
          { text: "Angebote", url: "/sale" },
        ],
      },
      footer: {
        showSocialLinks: true,
        showLanguageSelector: true,
        showCurrencySelector: true,
        columns: [
          {
            title: "Shop",
            links: [
              { text: "Alle Produkte", url: "/products" },
              { text: "Kategorien", url: "/categories" },
              { text: "Neuheiten", url: "/new-arrivals" },
              { text: "Angebote", url: "/sale" },
            ],
          },
          {
            title: "Konto",
            links: [
              { text: "Mein Konto", url: "/account" },
              { text: "Bestellverlauf", url: "/account/orders" },
              { text: "Wunschliste", url: "/account/wishlist" },
              { text: "Warenkorb", url: "/cart" },
            ],
          },
          {
            title: "Information",
            links: [
              { text: "Über Uns", url: "/about" },
              { text: "Kontakt", url: "/contact" },
              { text: "Versandrichtlinien", url: "/shipping" },
              { text: "Datenschutzrichtlinien", url: "/privacy" },
              { text: "Allgemeine Geschäftsbedingungen", url: "/terms" },
            ],
          },
        ],
      },
      productList: {
        defaultSort: "newest",
        itemsPerPage: 16,
        layout: "grid",
        showFilters: true,
        filterPosition: "sidebar",
        showQuickView: false,
      },
      productDetail: {
        layout: "compact",
        showRelatedProducts: true,
        showReviews: true,
        showQuantitySelector: true,
        showSocialSharing: false,
        imageZoom: true,
      },
      cart: {
        showThumbnails: true,
        showCrossSells: false,
        showSaveLater: false,
      },
      checkout: {
        steps: ["cart", "address", "payment", "review"],
        showOrderSummary: true,
        showLoginPrompt: true,
      },
    },
  },

  firebaseConfig: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  },

  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },

  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  openAI: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4o",
  },
}

export default appConfig
