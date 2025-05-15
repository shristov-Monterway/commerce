"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { getProducts, deleteProduct } from "@/lib/products"
import { useAuth } from "@/context/auth-context"
import type { Product } from "@/types"
import appConfig from "@/config/app-config"

export default function AdminProductsPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading && user?.isAdmin) {
      fetchProducts()
    } else if (!loading && !user?.isAdmin) {
      router.push(`/${lang}`)
    }
  }, [loading, user, router, lang, toast])

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId)
        setProducts(products.filter((product) => product.id !== productId))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      }
    }
  }

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase()
    const nameMatch = Object.values(product.name).some((name) => name.toLowerCase().includes(searchLower))
    const skuMatch = product.sku.toLowerCase().includes(searchLower)
    return nameMatch || skuMatch
  })

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (!user?.isAdmin) {
    return null // Router will redirect
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button asChild>
          <Link href={`/${lang}/admin/products/new`}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=48&width=48&query=product"}
                          alt={product.name[lang] || product.name[appConfig.defaultLanguage]}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name[lang] || product.name[appConfig.defaultLanguage]}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                    <TableCell>{product.inventory}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/${lang}/admin/products/${product.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
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
