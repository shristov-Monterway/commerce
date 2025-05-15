import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getHeroConfig } from "@/lib/layout-utils"
import type { HeroConfig } from "@/config/app-config"

interface HeroProps {
  lang: string
}

export function Hero({ lang }: HeroProps) {
  // Get hero configuration for the current language
  const heroConfig = getHeroConfig(lang)

  return (
    <section
      className={`container px-4 ${heroConfig.backgroundColor ? `bg-[${heroConfig.backgroundColor}]` : ""}`}
      style={{ color: heroConfig.textColor }}
    >
      {renderHeroByType(heroConfig, lang)}
    </section>
  )
}

function renderHeroByType(heroConfig: HeroConfig, lang: string) {
  switch (heroConfig.type) {
    case "split":
      return <SplitHero heroConfig={heroConfig} lang={lang} />
    case "fullWidth":
      return <FullWidthHero heroConfig={heroConfig} lang={lang} />
    case "simple":
      return <SimpleHero heroConfig={heroConfig} lang={lang} />
    default:
      return <SplitHero heroConfig={heroConfig} lang={lang} />
  }
}

function SplitHero({ heroConfig, lang }: { heroConfig: HeroConfig; lang: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{heroConfig.title}</h1>
        <p className="text-xl text-muted-foreground">{heroConfig.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg">
            <Link href={`/${lang}/products`}>{heroConfig.primaryButtonText}</Link>
          </Button>
          {heroConfig.secondaryButtonText && (
            <Button variant="outline" size="lg">
              <Link href={`/${lang}/categories`}>{heroConfig.secondaryButtonText}</Link>
            </Button>
          )}
        </div>
        {heroConfig.showSearchBar && (
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-8" />
          </div>
        )}
      </div>
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={heroConfig.imageSrc || "/placeholder.svg"}
          alt="Hero image"
          className="object-cover"
          priority
          fill
        />
      </div>
    </div>
  )
}

function FullWidthHero({ heroConfig, lang }: { heroConfig: HeroConfig; lang: string }) {
  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      <Image src={heroConfig.imageSrc || "/placeholder.svg"} alt="Hero image" className="object-cover" priority fill />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40 text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-3xl">{heroConfig.title}</h1>
        <p className="text-xl mt-4 max-w-2xl">{heroConfig.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" variant="default">
            <Link href={`/${lang}/products`}>{heroConfig.primaryButtonText}</Link>
          </Button>
          {heroConfig.secondaryButtonText && (
            <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white">
              <Link href={`/${lang}/categories`}>{heroConfig.secondaryButtonText}</Link>
            </Button>
          )}
        </div>
        {heroConfig.showSearchBar && (
          <div className="relative mt-8 max-w-md w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-8 bg-white/90" />
          </div>
        )}
      </div>
    </div>
  )
}

function SimpleHero({ heroConfig, lang }: { heroConfig: HeroConfig; lang: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{heroConfig.title}</h1>
      <p className="text-xl text-muted-foreground mt-4">{heroConfig.description}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button asChild size="lg">
          <Link href={`/${lang}/products`}>{heroConfig.primaryButtonText}</Link>
        </Button>
        {heroConfig.secondaryButtonText && (
          <Button variant="outline" size="lg">
            <Link href={`/${lang}/categories`}>{heroConfig.secondaryButtonText}</Link>
          </Button>
        )}
      </div>
      {heroConfig.showSearchBar && (
        <div className="relative mt-8 max-w-md mx-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search products..." className="pl-8" />
        </div>
      )}
    </div>
  )
}
