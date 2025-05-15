"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSelector } from "@/components/ui/language-selector"
import { CurrencySelector } from "@/components/ui/currency-selector"
import { useAuth } from "@/context/auth-context"
import { useCartStore } from "@/lib/cart"
import { useT } from "@/components/translation-provider"
import { getStoreName } from "@/lib/translation-utils"
import { getHeaderConfig } from "@/lib/layout-utils"

export function Header({ lang }: { lang: string }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const cartItems = useCartStore((state) => state.items)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useT()

  // Get header configuration for the current language
  const headerConfig = getHeaderConfig(lang)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Get translated store name
  const storeName = getStoreName(lang)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div
          className={`flex items-center gap-2 md:gap-4 ${headerConfig.logoPosition === "center" ? "md:order-2 md:flex-1 md:justify-center" : ""}`}
        >
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t("navigation.menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href={`/${lang}`} className="text-xl font-bold" onClick={() => setIsMenuOpen(false)}>
                  {storeName}
                </Link>
                <nav className="flex flex-col gap-4">
                  {headerConfig.navigationLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={`/${lang}${link.url}`}
                      className="text-lg font-medium hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.text}
                    </Link>
                  ))}
                  {user?.isAdmin && (
                    <Link
                      href={`/${lang}/admin`}
                      className="text-lg font-medium hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("navigation.admin")}
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href={`/${lang}`}
            className={`hidden md:block text-xl font-bold ${headerConfig.logoPosition === "center" ? "md:order-2" : ""}`}
          >
            {storeName}
          </Link>

          <nav
            className={`hidden md:flex items-center gap-6 ${headerConfig.logoPosition === "center" ? "md:order-1 md:flex-1 md:justify-start" : ""}`}
          >
            {headerConfig.navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={`/${lang}${link.url}`}
                className={`text-sm font-medium ${
                  pathname.includes(link.url) ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.text}
              </Link>
            ))}
            {user?.isAdmin && (
              <Link
                href={`/${lang}/admin`}
                className={`text-sm font-medium ${
                  pathname.includes("/admin") ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t("navigation.admin")}
              </Link>
            )}
          </nav>
        </div>

        {headerConfig.showSearchBar && (
          <div
            className={`hidden md:flex items-center gap-4 flex-1 max-w-md mx-4 ${headerConfig.logoPosition === "center" ? "md:order-1" : ""}`}
          >
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder={t("common.search")} className="w-full pl-8" />
            </div>
          </div>
        )}

        <div
          className={`flex items-center gap-2 ${headerConfig.logoPosition === "center" ? "md:order-3 md:flex-1 md:justify-end" : ""}`}
        >
          {headerConfig.showLanguageSelector && <LanguageSelector />}
          {headerConfig.showCurrencySelector && <CurrencySelector />}

          {headerConfig.showCartIcon && (
            <Link href={`/${lang}/cart`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">{t("navigation.cart")}</span>
              </Button>
            </Link>
          )}

          {headerConfig.showAccountIcon &&
            (user ? (
              <Link href={`/${lang}/account`}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t("navigation.account")}</span>
                </Button>
              </Link>
            ) : (
              <Link href={`/${lang}/auth/login`}>
                <Button variant="ghost" size="sm">
                  {t("navigation.login")}
                </Button>
              </Link>
            ))}
        </div>
      </div>
    </header>
  )
}
