"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { getMessages, getTranslation } from "@/lib/i18n"

interface WishlistButtonProps {
  productId: string
  isInWishlist?: boolean
  lang: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
}

export async function WishlistButton({
  productId,
  isInWishlist = false,
  lang,
  variant = "outline",
  size = "default",
  showText = true,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(isInWishlist)
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const toggleWishlist = () => {
    // In a real app, this would call an API to add/remove from wishlist
    setInWishlist(!inWishlist)
    console.log(`${inWishlist ? "Removing from" : "Adding to"} wishlist: ${productId}`)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleWishlist}
      className={inWishlist ? "text-red-500 hover:text-red-600" : ""}
    >
      <Heart className={`${size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} ${inWishlist ? "fill-current" : ""}`} />
      {showText && size !== "icon" && (
        <span>{inWishlist ? t("products.removeFromWishlist") : t("products.addToWishlist")}</span>
      )}
    </Button>
  )
}
