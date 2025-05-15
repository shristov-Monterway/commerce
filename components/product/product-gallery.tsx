"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getProductDetailConfig } from "@/lib/layout-utils"
import type { ProductVariationType } from "@/types"

interface ProductGalleryProps {
  allVariations: ProductVariationType[]
  selectedVariation: ProductVariationType
  alt: string
  lang: string
}

export function ProductGallery({ allVariations, selectedVariation, alt, lang }: ProductGalleryProps) {
  // Collect all unique images from all variations
  const allImages = Array.from(new Set(allVariations.flatMap((variation) => variation.images)))

  const [activeIndex, setActiveIndex] = useState(0)
  const productDetailConfig = getProductDetailConfig(lang)

  // When selected variation changes, set active index to its first image
  useEffect(() => {
    if (selectedVariation && selectedVariation.images.length > 0) {
      const firstImageIndex = allImages.findIndex((img) => img === selectedVariation.images[0])
      if (firstImageIndex !== -1) {
        setActiveIndex(firstImageIndex)
      }
    }
  }, [selectedVariation, allImages])

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={allImages[activeIndex] || "/placeholder.svg?height=600&width=600&query=product"}
          alt={alt}
          className="h-full w-full object-cover"
          width={600}
          height={600}
          priority
        />

        {/* Navigation arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        {/* Zoom button */}
        {productDetailConfig.imageZoom && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
            onClick={() => {
              // Implement zoom functionality
              console.log("Zoom functionality would be implemented here")
            }}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom</span>
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => {
            // Highlight thumbnails that belong to the selected variation
            const isFromSelectedVariation = selectedVariation.images.includes(image)

            return (
              <button
                key={index}
                className={cn(
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted",
                  activeIndex === index && "ring-2 ring-primary ring-offset-2",
                  isFromSelectedVariation && "border-2 border-primary/30",
                )}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image || "/placeholder.svg?height=64&width=64&query=product"}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                  width={64}
                  height={64}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
