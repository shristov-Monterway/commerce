import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getNewsletterConfig } from "@/lib/layout-utils"

interface NewsletterProps {
  lang: string
}

export function Newsletter({ lang }: NewsletterProps) {
  const newsletterConfig = getNewsletterConfig(lang)

  if (!newsletterConfig.enabled) {
    return null
  }

  return (
    <section
      className={`container px-4 py-12 ${newsletterConfig.backgroundColor ? `bg-[${newsletterConfig.backgroundColor}]` : ""}`}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">{newsletterConfig.title}</h2>
        <p className="text-muted-foreground mb-6">{newsletterConfig.description}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input type="email" placeholder="your@email.com" className="flex-1" />
          <Button>{newsletterConfig.buttonText}</Button>
        </div>
      </div>
    </section>
  )
}
