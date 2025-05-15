import { getTestimonialsConfig } from "@/lib/layout-utils"

interface TestimonialsProps {
  lang: string
}

export function Testimonials({ lang }: TestimonialsProps) {
  const testimonialsConfig = getTestimonialsConfig(lang)

  if (!testimonialsConfig.enabled) {
    return null
  }

  return (
    <section
      className={`container px-4 py-12 ${testimonialsConfig.backgroundColor ? `bg-[${testimonialsConfig.backgroundColor}]` : ""}`}
    >
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">{testimonialsConfig.title}</h2>

      {testimonialsConfig.layout === "grid" && <TestimonialsGrid />}
      {testimonialsConfig.layout === "list" && <TestimonialsList />}
      {testimonialsConfig.layout === "carousel" && <TestimonialsCarousel />}
    </section>
  )
}

function TestimonialsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Example testimonials - in a real app, these would come from the database */}
      <TestimonialCard
        quote="This is the best e-commerce platform I've ever used. The products are high quality and the service is excellent."
        author="John Doe"
        role="Verified Customer"
        initials="JD"
      />
      <TestimonialCard
        quote="Fast shipping and great customer service. I'll definitely be shopping here again!"
        author="Jane Smith"
        role="Verified Customer"
        initials="JS"
      />
      <TestimonialCard
        quote="The product quality exceeded my expectations. Highly recommended!"
        author="Robert Johnson"
        role="Verified Customer"
        initials="RJ"
      />
    </div>
  )
}

function TestimonialsList() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <TestimonialCard
        quote="This is the best e-commerce platform I've ever used. The products are high quality and the service is excellent."
        author="John Doe"
        role="Verified Customer"
        initials="JD"
      />
      <TestimonialCard
        quote="Fast shipping and great customer service. I'll definitely be shopping here again!"
        author="Jane Smith"
        role="Verified Customer"
        initials="JS"
      />
      <TestimonialCard
        quote="The product quality exceeded my expectations. Highly recommended!"
        author="Robert Johnson"
        role="Verified Customer"
        initials="RJ"
      />
    </div>
  )
}

function TestimonialsCarousel() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* This would be replaced with an actual carousel component */}
      <TestimonialCard
        quote="This is the best e-commerce platform I've ever used. The products are high quality and the service is excellent."
        author="John Doe"
        role="Verified Customer"
        initials="JD"
      />
      <div className="flex justify-center mt-6 space-x-2">
        <button className="w-2 h-2 rounded-full bg-primary"></button>
        <button className="w-2 h-2 rounded-full bg-muted"></button>
        <button className="w-2 h-2 rounded-full bg-muted"></button>
      </div>
    </div>
  )
}

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  initials: string
}

function TestimonialCard({ quote, author, role, initials }: TestimonialCardProps) {
  return (
    <div className="bg-background p-6 rounded-lg shadow">
      <p className="italic mb-4">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
          {initials}
        </div>
        <div className="ml-3">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}
