"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { getCategories, deleteCategory } from "@/lib/products"
import { useAuth } from "@/context/auth-context"
import type { Category } from "@/types"
import appConfig from "@/config/app-config"

export default function AdminCategoriesPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading && user?.isAdmin) {
      fetchCategories()
    } else if (!loading && !user?.isAdmin) {
      router.push(`/${lang}`)
    }
  }, [loading, user, router, lang, toast])

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId)
        setCategories(categories.filter((category) => category.id !== categoryId))
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting category:", error)
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        })
      }
    }
  }

  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase()
    return Object.values(category.name).some((name) => name.toLowerCase().includes(searchLower))
  })

  // Get parent category names
  const getCategoryName = (parentId: string | null) => {
    if (!parentId) return "None"
    const parent = categories.find((c) => c.id === parentId)
    return parent ? parent.name[lang] || parent.name[appConfig.defaultLanguage] : "Unknown"
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (!user?.isAdmin) {
    return null // Router will redirect
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Button asChild>
          <Link href={`/${lang}/admin/categories/new`}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div>Loading categories...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg?height=48&width=48&query=category"}
                          alt={category.name[lang] || category.name[appConfig.defaultLanguage]}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name[lang] || category.name[appConfig.defaultLanguage]}
                    </TableCell>
                    <TableCell>{getCategoryName(category.parentId)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/${lang}/admin/categories/${category.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
