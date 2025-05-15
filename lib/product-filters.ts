import type { Product, AttributeFilter } from "@/types"

/**
 * Builds attribute filters from a list of products
 */
export function buildAttributeFilters(products: Product[]): AttributeFilter[] {
  const attributeMap = new Map<string, Map<string, Set<string>>>()

  // First, collect all attributes and their options
  products.forEach((product) => {
    // Only consider products with active variations
    const activeVariations = product.variations.filter((v) => v.isActive && v.inventory > 0)

    if (activeVariations.length === 0) return

    activeVariations.forEach((variation) => {
      variation.attributes.forEach((attr) => {
        if (!attributeMap.has(attr.id)) {
          attributeMap.set(attr.id, new Map())
        }

        const optionsMap = attributeMap.get(attr.id)!

        if (!optionsMap.has(attr.name.en)) {
          optionsMap.set(attr.name.en, new Set())
        }

        attr.options.forEach((option) => {
          optionsMap.get(attr.name.en)!.add(option.id)
        })
      })
    })
  })

  // Then, count occurrences of each option
  const attributeFilters: AttributeFilter[] = []

  attributeMap.forEach((optionsMap, attributeId) => {
    // Get the first attribute name (they should all be the same for a given ID)
    const [attributeName, optionIds] = optionsMap.entries().next().value

    const options = Array.from(optionIds).map((optionId) => {
      // Count products that have this option
      let count = 0

      products.forEach((product) => {
        const hasOption = product.variations.some(
          (variation) =>
            variation.isActive &&
            variation.inventory > 0 &&
            variation.attributes.some(
              (attr) => attr.id === attributeId && attr.options.some((opt) => opt.id === optionId),
            ),
        )

        if (hasOption) count++
      })

      // Find the option name from any product that has it
      let optionName = { en: optionId }
      for (const product of products) {
        for (const variation of product.variations) {
          for (const attr of variation.attributes) {
            if (attr.id === attributeId) {
              const option = attr.options.find((opt) => opt.id === optionId)
              if (option) {
                optionName = option.name
                break
              }
            }
          }
        }
      }

      return {
        id: optionId,
        name: optionName,
        count,
      }
    })

    attributeFilters.push({
      attributeId,
      attributeName: { en: attributeName },
      options,
    })
  })

  return attributeFilters
}

/**
 * Filters products by selected attribute options
 */
export function filterProductsByAttributes(products: Product[], selectedFilters: Record<string, string[]>): Product[] {
  if (Object.keys(selectedFilters).length === 0) {
    return products
  }

  return products.filter((product) => {
    // Check if any variation matches all selected filters
    return product.variations.some((variation) => {
      if (!variation.isActive || variation.inventory <= 0) {
        return false
      }

      // Check if this variation matches all selected filters
      return Object.entries(selectedFilters).every(([attributeId, selectedOptionIds]) => {
        // Find the attribute in this variation
        const attribute = variation.attributes.find((attr) => attr.id === attributeId)

        if (!attribute) {
          return false
        }

        // Check if any of the selected options match this attribute
        return selectedOptionIds.some((optionId) => attribute.options.some((opt) => opt.id === optionId))
      })
    })
  })
}
