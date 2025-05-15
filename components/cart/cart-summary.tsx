import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatPrice } from "@/lib/currency"
import { getMessages, getTranslation } from "@/lib/i18n"

interface CartSummaryProps {
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  lang: string
}

export async function CartSummary({ subtotal, tax, shipping, total, currency, lang }: CartSummaryProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-medium mb-4">{t("cart.orderSummary")}</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.tax")}</span>
          <span>{formatPrice(tax, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.shipping")}</span>
          <span>{shipping === 0 ? t("cart.free") : formatPrice(shipping, currency)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span>{t("cart.total")}</span>
            <span>{formatPrice(total, currency)}</span>
          </div>
        </div>
      </div>
      <Button asChild className="w-full mt-6">
        <Link href={`/${lang}/checkout`}>{t("cart.checkout")}</Link>
      </Button>
      <Button variant="outline" asChild className="w-full mt-2">
        <Link href={`/${lang}/products`}>{t("cart.continueShopping")}</Link>
      </Button>
    </div>
  )
}
