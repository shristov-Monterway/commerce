import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc, connectFirestoreEmulator } from "firebase/firestore"
import appConfig from "../config/app-config"

// Initialize Firebase
const app = initializeApp(appConfig.firebaseConfig)
const db = getFirestore(app)
connectFirestoreEmulator(db, "localhost", 8080)

// Sample data
const sampleCategories = [
  {
    id: "category-clothing",
    name: {
      en: "Clothing",
      de: "Kleidung",
      fr: "Vêtements",
    },
    description: {
      en: "Explore our wide range of clothing options",
      de: "Entdecken Sie unsere große Auswahl an Kleidungsoptionen",
      fr: "Explorez notre large gamme d'options de vêtements",
    },
    slug: {
      en: "clothing",
      de: "kleidung",
      fr: "vetements",
    },
    parentId: null,
    image: "https://example.com/images/clothing.jpg",
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "category-electronics",
    name: {
      en: "Electronics",
      de: "Elektronik",
      fr: "Électronique",
    },
    description: {
      en: "Latest gadgets and electronic devices",
      de: "Neueste Gadgets und elektronische Geräte",
      fr: "Derniers gadgets et appareils électroniques",
    },
    slug: {
      en: "electronics",
      de: "elektronik",
      fr: "electronique",
    },
    parentId: null,
    image: "https://example.com/images/electronics.jpg",
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "category-t-shirts",
    name: {
      en: "T-Shirts",
      de: "T-Shirts",
      fr: "T-Shirts",
    },
    description: {
      en: "Comfortable and stylish t-shirts",
      de: "Bequeme und stilvolle T-Shirts",
      fr: "T-shirts confortables et élégants",
    },
    slug: {
      en: "t-shirts",
      de: "t-shirts",
      fr: "t-shirts",
    },
    parentId: "category-clothing",
    image: "https://example.com/images/t-shirts.jpg",
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const sampleProducts = [
  {
    id: "product-basic-tee",
    name: {
      en: "Basic T-Shirt",
      de: "Einfaches T-Shirt",
      fr: "T-Shirt Basique",
    },
    description: {
      en: "A comfortable basic t-shirt for everyday wear",
      de: "Ein bequemes einfaches T-Shirt für den Alltag",
      fr: "Un t-shirt basique confortable pour tous les jours",
    },
    slug: {
      en: "basic-t-shirt",
      de: "einfaches-t-shirt",
      fr: "t-shirt-basique",
    },
    categoryIds: ["category-clothing", "category-t-shirts"],
    tags: ["casual", "basic", "cotton"],
    variations: [
      {
        id: "var-basic-tee-s-black",
        name: {
          en: "Basic T-Shirt - Small Black",
          de: "Einfaches T-Shirt - Klein Schwarz",
          fr: "T-Shirt Basique - Petit Noir",
        },
        description: {
          en: "Small black basic t-shirt",
          de: "Kleines schwarzes einfaches T-Shirt",
          fr: "Petit t-shirt basique noir",
        },
        slug: "small-black",
        price: 19.99,
        compareAtPrice: 24.99,
        images: [
          "https://example.com/images/basic-tee-black-front.jpg",
          "https://example.com/images/basic-tee-black-back.jpg",
        ],
        weight: 200,
        sku: "BT-S-BLK",
        inventory: 25,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attributes: [
          {
            id: "size",
            name: {
              en: "Size",
              de: "Größe",
              fr: "Taille",
            },
            options: [
              {
                id: "s",
                name: {
                  en: "Small",
                  de: "Klein",
                  fr: "Petit",
                },
              },
            ],
          },
          {
            id: "color",
            name: {
              en: "Color",
              de: "Farbe",
              fr: "Couleur",
            },
            options: [
              {
                id: "black",
                name: {
                  en: "Black",
                  de: "Schwarz",
                  fr: "Noir",
                },
              },
            ],
          },
        ],
      },
      {
        id: "var-basic-tee-m-black",
        name: {
          en: "Basic T-Shirt - Medium Black",
          de: "Einfaches T-Shirt - Mittel Schwarz",
          fr: "T-Shirt Basique - Moyen Noir",
        },
        description: {
          en: "Medium black basic t-shirt",
          de: "Mittleres schwarzes einfaches T-Shirt",
          fr: "T-shirt basique noir moyen",
        },
        slug: "medium-black",
        price: 19.99,
        compareAtPrice: 24.99,
        images: [
          "https://example.com/images/basic-tee-black-front.jpg",
          "https://example.com/images/basic-tee-black-back.jpg",
        ],
        weight: 220,
        sku: "BT-M-BLK",
        inventory: 30,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attributes: [
          {
            id: "size",
            name: {
              en: "Size",
              de: "Größe",
              fr: "Taille",
            },
            options: [
              {
                id: "m",
                name: {
                  en: "Medium",
                  de: "Mittel",
                  fr: "Moyen",
                },
              },
            ],
          },
          {
            id: "color",
            name: {
              en: "Color",
              de: "Farbe",
              fr: "Couleur",
            },
            options: [
              {
                id: "black",
                name: {
                  en: "Black",
                  de: "Schwarz",
                  fr: "Noir",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "product-smartphone",
    name: {
      en: "Smartphone X",
      de: "Smartphone X",
      fr: "Smartphone X",
    },
    description: {
      en: "The latest smartphone with advanced features",
      de: "Das neueste Smartphone mit fortschrittlichen Funktionen",
      fr: "Le dernier smartphone avec des fonctionnalités avancées",
    },
    slug: {
      en: "smartphone-x",
      de: "smartphone-x",
      fr: "smartphone-x",
    },
    categoryIds: ["category-electronics"],
    tags: ["smartphone", "tech", "mobile"],
    variations: [
      {
        id: "var-smartphone-128gb-black",
        name: {
          en: "Smartphone X - 128GB Black",
          de: "Smartphone X - 128GB Schwarz",
          fr: "Smartphone X - 128GB Noir",
        },
        description: {
          en: "128GB black smartphone",
          de: "128GB schwarzes Smartphone",
          fr: "Smartphone noir 128GB",
        },
        slug: "128gb-black",
        price: 799.99,
        compareAtPrice: 899.99,
        images: [
          "https://example.com/images/smartphone-black-front.jpg",
          "https://example.com/images/smartphone-black-back.jpg",
        ],
        weight: 180,
        sku: "SPX-128-BLK",
        inventory: 15,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attributes: [
          {
            id: "storage",
            name: {
              en: "Storage",
              de: "Speicher",
              fr: "Stockage",
            },
            options: [
              {
                id: "128gb",
                name: {
                  en: "128GB",
                  de: "128GB",
                  fr: "128GB",
                },
              },
            ],
          },
          {
            id: "color",
            name: {
              en: "Color",
              de: "Farbe",
              fr: "Couleur",
            },
            options: [
              {
                id: "black",
                name: {
                  en: "Black",
                  de: "Schwarz",
                  fr: "Noir",
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

// Seed function
async function seedEmulator() {
  try {
    console.log("Seeding Firestore emulator with sample data...")

    // Seed categories
    for (const category of sampleCategories) {
      await setDoc(doc(db, "categories", category.id), category)
      console.log(`Added category: ${category.id}`)
    }

    // Seed products
    for (const product of sampleProducts) {
      await setDoc(doc(db, "products", product.id), product)
      console.log(`Added product: ${product.id}`)
    }

    // Update the exchange rates seeding part
    // Seed exchange rates
    await setDoc(doc(db, "exchangeRates", "current"), {
      base: "USD",
      rates: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.8,
        CAD: 1.35,
        AUD: 1.52,
      },
      lastUpdated: Date.now(),
    })

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

// Run the seed function
seedEmulator()
