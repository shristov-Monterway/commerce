"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getMessages, getTranslation } from "@/lib/i18n"
import type { Product, ProductVariationType } from "@/types"
import appConfig from "@/config/app-config"

interface VariationSelectorProps {
  product: Product
  lang: string
  onVariationChange: (variationId: string | null, variation: ProductVariationType | null) => void
}

export function VariationSelector({ product, lang, onVariationChange }: VariationSelectorProps) {
  const [messages, setMessages] = useState<any>({})
  const [t, setT] = useState<(key: string, params?: Record<string, any>) => string>(() => (key) => key)
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getMessages(lang)
      setMessages(msgs)
      setT(() => (key: string, params?: Record<string, any>) => getTranslation(msgs, key, params))
    }

    fetchMessages()
  }, [lang])

  useEffect(() => {
    // If there's only one variation, select it by default
    const variationKeys = Object.keys(product.variations)
    if (variationKeys.length === 1) {
      setSelectedVariation(variationKeys[0])
      onVariationChange(variationKeys[0], product.variations[variationKeys[0]])
    }
  }, [product.variations, onVariationChange])

  // Get all unique attribute types across all variations
  const attributeTypes: Record<string, Set<string>> = {}

  Object.values(product.variations).forEach((variation) => {
    Object.entries(variation.attributes).forEach(([attrId, attr]) => {
      if (!attributeTypes[attrId]) {
        attributeTypes[attrId] = new Set()
      }

      Object.keys(attr.options).forEach((optionId) => {
        attributeTypes[attrId].add(optionId)
      })
    })
  })

  // Find a variation that matches the selected attributes
  const findMatchingVariation = (attrs: Record<string, string>) => {
    const selectedAttrsEntries = Object.entries(attrs)
    if (selectedAttrsEntries.length === 0) return null

    return (
      Object.entries(product.variations).find(([_, variation]) => {
        return selectedAttrsEntries.every(([attrId, optionId]) => {
          return variation.attributes[attrId]?.options[optionId] !== undefined
        })
      })?.[0] || null
    )
  }

  const handleAttributeChange = (attributeId: string, optionId: string) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeId]: optionId,
    }

    setSelectedAttributes(newSelectedAttributes)

    const matchingVariationId = findMatchingVariation(newSelectedAttributes)
    setSelectedVariation(matchingVariationId)

    if (matchingVariationId) {
      onVariationChange(matchingVariationId, product.variations[matchingVariationId])
    } else {
      onVariationChange(null, null)
    }
  }

  // Group attributes by type for display
  const attributeGroups = Object.entries(attributeTypes).map(([attrId, _]) => {
    // Find the first variation that has this attribute to get the name
    const variation = Object.values(product.variations).find((v) => v.attributes[attrId])
    const attributeName =
      variation?.attributes[attrId]?.name[lang] ||
      variation?.attributes[attrId]?.name[appConfig.defaultLanguage] ||
      attrId

    // Get all options for this attribute across all variations
    const options = new Map()
    Object.values(product.variations).forEach((variation) => {
      if (variation.attributes[attrId]) {
        Object.entries(variation.attributes[attrId].options).forEach(([optionId, option]) => {
          options.set(optionId, option.name[lang] || option.name[appConfig.defaultLanguage])
        })
      }
    })

    return {
      id: attrId,
      name: attributeName,
      options: Array.from(options.entries()).map(([id, name]) => ({ id, name })),
    }
  })

  return (
    <div className="space-y-6">
      {attributeGroups.map((group) => (
        <div key={group.id} className="space-y-2">
          <h3 className="font-medium">{group.name}</h3>
          <RadioGroup
            value={selectedAttributes[group.id] || ""}
            onValueChange={(value) => handleAttributeChange(group.id, value)}
            className="flex flex-wrap gap-2"
          >
            {group.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <RadioGroupItem value={option.id} id={`${group.id}-${option.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`${group.id}-${option.id}`}
                  className="px-3 py-1.5 border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted"
                >
                  {option.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}

      {!selectedVariation && attributeGroups.length > 0 && (
        <p className="text-sm text-muted-foreground">{t("products.selectVariation")}</p>
      )}
    </div>
  )
}
