"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { fetchExchangeRates } from "@/lib/currency"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingBag, Users, DollarSign, BarChart3, RefreshCw } from "lucide-react"

export default function AdminDashboardPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [isUpdatingRates, setIsUpdatingRates] = useState(false)

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.push(`/${lang}`)
    }
  }, [loading, user, router, lang])

  const handleUpdateExchangeRates = async () => {
    setIsUpdatingRates(true)
    try {
      await fetchExchangeRates()
      toast({
        title: "Success",
        description: "Exchange rates updated successfully",
      })
    } catch (error) {
      console.error("Error updating exchange rates:", error)
      toast({
        title: "Error",
        description: "Failed to update exchange rates",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingRates(false)
    }
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (!user?.isAdmin) {
    return null // Router will redirect
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180 since last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>Update currency exchange rates from external API</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleUpdateExchangeRates}
                disabled={isUpdatingRates}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isUpdatingRates ? "Updating..." : "Update Exchange Rates"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleString()}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
