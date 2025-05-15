"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { signIn, signUp, signInWithGoogle } from "@/lib/auth"
import { useT } from "@/components/translation-provider"
import { Phone } from "lucide-react"

export default function AuthPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const router = useRouter()
  const { toast } = useToast()
  const t = useT()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn(loginEmail, loginPassword)

      if (result.success) {
        toast({
          title: t("auth.messages.loginSuccess"),
          description: t("auth.messages.loginSuccessMessage"),
        })
        router.push(`/${lang}`)
      } else {
        toast({
          title: t("auth.messages.loginFailed"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("auth.messages.loginFailed"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signUp(registerEmail, registerPassword, registerName)

      if (result.success) {
        toast({
          title: t("auth.messages.registerSuccess"),
          description: t("auth.messages.registerSuccessMessage"),
        })
        router.push(`/${lang}`)
      } else {
        toast({
          title: t("auth.messages.registerFailed"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("auth.messages.registerFailed"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const result = await signInWithGoogle()

      if (result.success) {
        toast({
          title: t("auth.messages.loginSuccess"),
          description: t("auth.messages.loginSuccessMessage"),
        })
        router.push(`/${lang}`)
      } else {
        toast({
          title: t("auth.messages.loginFailed"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("auth.messages.loginFailed"),
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
        <Tabs defaultValue="login">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("auth.login.title")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.register.title")}</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="login">
            <CardContent className="space-y-4">
              <CardDescription>{t("auth.login.description")}</CardDescription>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("auth.login.email")}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">{t("auth.login.password")}</Label>
                    <Link
                      href={`/${lang}/auth/forgot-password`}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      {t("auth.login.forgotPassword")}
                    </Link>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("common.loading") : t("auth.login.loginButton")}
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t("common.or")}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                  {t("auth.login.googleButton")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/${lang}/auth/phone`)}
                  disabled={isLoading}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t("auth.phone.title")}
                </Button>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardContent className="space-y-4">
              <CardDescription>{t("auth.register.description")}</CardDescription>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">{t("auth.register.name")}</Label>
                  <Input
                    id="register-name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">{t("auth.register.email")}</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{t("auth.register.password")}</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("common.loading") : t("auth.register.registerButton")}
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t("common.or")}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                  {t("auth.register.googleButton")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/${lang}/auth/phone`)}
                  disabled={isLoading}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t("auth.phone.title")}
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-center pt-0">
          <p className="text-xs text-muted-foreground">
            {t("auth.login.dontHaveAccount")}{" "}
            <Link
              href="#"
              className="text-primary hover:underline"
              onClick={() => document.getElementById("register-tab")?.click()}
            >
              {t("auth.login.createAccount")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
