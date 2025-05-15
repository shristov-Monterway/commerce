"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { resetPassword } from "@/lib/auth"
import { useT } from "@/components/translation-provider"

export default function ForgotPasswordPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const router = useRouter()
  const { toast } = useToast()
  const t = useT()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await resetPassword(email)

      if (result.success) {
        toast({
          title: t("auth.messages.resetSuccess"),
          description: t("auth.messages.resetSuccessMessage"),
        })
        // Redirect to login page after successful password reset request
        setTimeout(() => {
          router.push(`/${lang}/auth/login`)
        }, 2000)
      } else {
        toast({
          title: t("auth.messages.resetFailed"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("auth.messages.resetFailed"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.forgotPassword.title")}</CardTitle>
          <CardDescription>{t("auth.forgotPassword.description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.forgotPassword.email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.forgotPassword.resetButton")}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" onClick={() => router.push(`/${lang}/auth/login`)}>
            {t("auth.forgotPassword.backToLogin")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
