import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMessages, getTranslation } from "@/lib/i18n"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  lang: string
}

export async function Pagination({ currentPage, totalPages, baseUrl, lang }: PaginationProps) {
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = 4
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button variant="outline" size="icon" disabled={currentPage === 1} asChild={currentPage !== 1}>
        {currentPage === 1 ? (
          <span>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t("common.previous")}</span>
          </span>
        ) : (
          <Link href={`${baseUrl}?page=${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t("common.previous")}</span>
          </Link>
        )}
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
          )
        }

        const isCurrentPage = page === currentPage

        return (
          <Button
            key={page}
            variant={isCurrentPage ? "default" : "outline"}
            size="icon"
            asChild={!isCurrentPage}
            className="w-9"
          >
            {isCurrentPage ? <span>{page}</span> : <Link href={`${baseUrl}?page=${page}`}>{page}</Link>}
          </Button>
        )
      })}

      <Button variant="outline" size="icon" disabled={currentPage === totalPages} asChild={currentPage !== totalPages}>
        {currentPage === totalPages ? (
          <span>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("common.next")}</span>
          </span>
        ) : (
          <Link href={`${baseUrl}?page=${currentPage + 1}`}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("common.next")}</span>
          </Link>
        )}
      </Button>
    </div>
  )
}
