import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getMessages, getTranslation } from "@/lib/i18n"

interface ProductReviewsProps {
  lang: string
}

export async function ProductReviews({ lang }: ProductReviewsProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Mock reviews data - in a real app, this would come from the database
  const reviews = [
    {
      id: "1",
      author: "John Doe",
      date: "2023-05-15",
      rating: 5,
      content:
        "This product exceeded my expectations. The quality is excellent and it arrived earlier than expected. Highly recommended!",
    },
    {
      id: "2",
      author: "Jane Smith",
      date: "2023-04-28",
      rating: 4,
      content:
        "Great product for the price. The only reason I'm not giving 5 stars is because the color is slightly different from what's shown in the pictures.",
    },
    {
      id: "3",
      author: "Robert Johnson",
      date: "2023-04-10",
      rating: 5,
      content: "Perfect fit and great quality. Will definitely buy from this store again.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("products.customerReviews")}</h3>
        <Button>{t("products.writeReview")}</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">4.7</div>
        <div>
          <div className="flex text-yellow-400">
            <span>★★★★★</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("products.basedOnReviews", { count: reviews.length })}</p>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center gap-4 mb-2">
              <Avatar>
                <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review.author}</div>
                <div className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString(lang)}</div>
              </div>
            </div>
            <div className="flex text-yellow-400 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < review.rating ? "★" : "☆"}</span>
              ))}
            </div>
            <p className="text-sm">{review.content}</p>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        {t("products.loadMoreReviews")}
      </Button>
    </div>
  )
}
