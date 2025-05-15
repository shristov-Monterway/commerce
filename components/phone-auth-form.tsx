"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { initPhoneAuth, sendPhoneVerificationCode, verifyPhoneCode } from "@/lib/auth"
import { useT } from "@/components/translation-provider"

export function PhoneAuthForm({ lang }: { lang: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const t = useT()
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)

  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    if (recaptchaContainerRef.current) {
      initPhoneAuth("recaptcha-container")
    }

    return () => {
      // Clean up reCAPTCHA when component unmounts
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = null
      }
    }
  }, [])

  useEffect(() => {
    // Countdown timer for resending code
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: t("common.error"),
        description: t("auth.phone.phoneRequired"),
        variant: "destructive",
      })
      return
    }

    // Basic phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ""))) {
      toast({
        title: t("common.error"),
        description: t("auth.phone.invalidPhone"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Initialize reCAPTCHA if not already initialized
      if (!window.recaptchaVerifier) {
        initPhoneAuth("recaptcha-container")
      }

      // Send verification code
      const formattedPhoneNumber = phoneNumber.replace(/\s+/g, "")
      const result = await sendPhoneVerificationCode(formattedPhoneNumber)

      if (result.success) {
        setCodeSent(true)
        setCountdown(60) // 60 seconds countdown for resend
        toast({
          title: t("auth.phone.codeSent"),
          description: t("auth.phone.codeSentMessage"),
        })
      } else {
        toast({
          title: t("common.error"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: t("common.error"),
        description: t("auth.phone.codeRequired"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await verifyPhoneCode(verificationCode)

      if (result.success) {
        toast({
          title: t("auth.messages.loginSuccess"),
          description: t("auth.messages.loginSuccessMessage"),
        })
        router.push(`/${lang}`)
      } else {
        toast({
          title: t("auth.phone.verificationFailed"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: t("auth.phone.verificationFailed"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    setVerificationCode("")
    setCodeSent(false)
    handleSendCode()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.phone.title")}</CardTitle>
        <CardDescription>{t("auth.phone.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!codeSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">{t("auth.phone.phoneNumber")}</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder={t("auth.phone.phoneNumberPlaceholder")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" onClick={handleSendCode} disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.phone.sendCode")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">{t("auth.phone.verificationCode")}</Label>
              <Input
                id="verification-code"
                placeholder={t("auth.phone.verificationCodePlaceholder")}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" onClick={handleVerifyCode} disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.phone.verify")}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={isLoading || countdown > 0}
                className="text-sm"
              >
                {countdown > 0 ? `${t("auth.phone.resendCode")} (${countdown}s)` : t("auth.phone.resendCode")}
              </Button>
            </div>
          </div>
        )}
        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={() => router.push(`/${lang}/auth/login`)}>
          {t("auth.phone.backToLogin")}
        </Button>
      </CardFooter>
    </Card>
  )
}
