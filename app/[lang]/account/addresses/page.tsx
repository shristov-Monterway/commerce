"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Address } from "@/types"
import { Loader2, Plus, Trash2, Check } from "lucide-react"

export default function AddressesPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New address form state
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  })

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push(`/${lang}/auth/login?redirect=/account/addresses`)
    }

    // Set addresses from user data
    if (user) {
      setAddresses(user.shippingAddresses || [])
    }
  }, [user, authLoading, router, lang])

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)

    try {
      // Create new address with ID
      const newAddressWithId: Address = {
        ...newAddress,
        id: Date.now().toString(),
      }

      // If this is the first address or marked as default, ensure it's the only default
      if (addresses.length === 0 || newAddressWithId.isDefault) {
        // Update all existing addresses to not be default
        const updatedAddresses = addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }))

        // Add the new address
        updatedAddresses.push(newAddressWithId)

        // Update in Firestore
        await updateDoc(doc(db, "users", user.id), {
          shippingAddresses: updatedAddresses,
          updatedAt: new Date(),
        })

        setAddresses(updatedAddresses)
      } else {
        // Just add the new address
        await updateDoc(doc(db, "users", user.id), {
          shippingAddresses: arrayUnion(newAddressWithId),
          updatedAt: new Date(),
        })

        setAddresses([...addresses, newAddressWithId])
      }

      // Reset form
      setNewAddress({
        name: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false,
      })

      setIsAddingAddress(false)

      toast({
        title: "Address added",
        description: "Your shipping address has been added successfully",
      })
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Error",
        description: "Failed to add shipping address",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return

    try {
      // Find the address to delete
      const addressToDelete = addresses.find((addr) => addr.id === addressId)
      if (!addressToDelete) return

      // Remove the address
      await updateDoc(doc(db, "users", user.id), {
        shippingAddresses: arrayRemove(addressToDelete),
        updatedAt: new Date(),
      })

      // Update local state
      const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)

      // If we deleted the default address and there are other addresses, make the first one default
      if (addressToDelete.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true

        await updateDoc(doc(db, "users", user.id), {
          shippingAddresses: updatedAddresses,
          updatedAt: new Date(),
        })
      }

      setAddresses(updatedAddresses)

      toast({
        title: "Address deleted",
        description: "Your shipping address has been deleted",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete shipping address",
        variant: "destructive",
      })
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return

    try {
      // Update all addresses, setting isDefault to true only for the selected address
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))

      // Update in Firestore
      await updateDoc(doc(db, "users", user.id), {
        shippingAddresses: updatedAddresses,
        updatedAt: new Date(),
      })

      setAddresses(updatedAddresses)

      toast({
        title: "Default address updated",
        description: "Your default shipping address has been updated",
      })
    } catch (error) {
      console.error("Error updating default address:", error)
      toast({
        title: "Error",
        description: "Failed to update default shipping address",
        variant: "destructive",
      })
    }
  }

  if (authLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shipping Addresses</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{address.name}</CardTitle>
                {address.isDefault && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Default
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              {!address.isDefault && (
                <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(address.id)}>
                  Set as Default
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteAddress(address.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add new address card */}
        {!isAddingAddress ? (
          <Card
            className="flex items-center justify-center h-[200px] border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setIsAddingAddress(true)}
          >
            <div className="flex flex-col items-center text-muted-foreground">
              <Plus className="h-8 w-8 mb-2" />
              <p>Add New Address</p>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add New Address</CardTitle>
              <CardDescription>Enter your shipping address details</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddAddress}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    value={newAddress.line2 || ""}
                    onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onCheckedChange={(checked) => setNewAddress({ ...newAddress, isDefault: checked as boolean })}
                  />
                  <Label htmlFor="isDefault">Set as default shipping address</Label>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Address"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
