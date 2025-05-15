import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { getMessages, getTranslation } from "@/lib/i18n"
import { getStoreName, getStoreDescription } from "@/lib/translation-utils"
import { getFooterConfig } from "@/lib/layout-utils"
import { LanguageSelector } from "@/components/ui/language-selector"
import { CurrencySelector } from "@/components/ui/currency-selector"

export async function Footer({ lang }: { lang: string }) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const currentYear = new Date().getFullYear()

  // Get store name and description from app config using the current language
  const storeName = getStoreName(lang)
  const storeDescription = getStoreDescription(lang)

  // Get footer configuration for the current language
  const footerConfig = getFooterConfig(lang)

  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{storeName}</h3>
            <p className="text-sm text-muted-foreground">{storeDescription}</p>
            {footerConfig.showSocialLinks && (
              <div className="mt-4 flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            )}
          </div>

          {footerConfig.columns.map((column, index) => (
            <div key={index}>
              <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
              <ul className="space-y-2 text-sm">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={`/${lang}${link.url}`} className="text-muted-foreground hover:text-foreground">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {footerConfig.showLanguageSelector && footerConfig.showCurrencySelector && (
            <div>
              <h3 className="mb-4 text-sm font-semibold">{t("footer.preferences")}</h3>
              <div className="space-y-4">
                {footerConfig.showLanguageSelector && (
                  <div className="flex items-center">
                    <span className="text-sm mr-2">{t("footer.language")}:</span>
                    <LanguageSelector />
                  </div>
                )}
                {footerConfig.showCurrencySelector && (
                  <div className="flex items-center">
                    <span className="text-sm mr-2">{t("footer.currency")}:</span>
                    <CurrencySelector />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t("footer.copyright", { year: currentYear, storeName: storeName })}</p>
        </div>
      </div>
    </footer>
  )
}
