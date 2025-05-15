import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { getMessages, getTranslation } from "@/lib/i18n"

interface EmptyCartProps {
  lang: string
}

export async function EmptyCart({ lang }: EmptyCartProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-6 mb-4">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t("cart.empty")}</h2>
      <p className="text-muted-foreground mb-6">{t("cart.emptyMessage")}</p>
      <Button asChild size="lg">
        <Link href={`/${lang}/products`}>{t("cart.continueShopping")}</Link>
      </Button>
    </div>
  )
}
