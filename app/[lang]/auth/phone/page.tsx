"use client"

import { PhoneAuthForm } from "@/components/phone-auth-form"

export default function PhoneAuthPage({ params }: { params: { lang: string } }) {
  const { lang } = params

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <PhoneAuthForm lang={lang} />
    </div>
  )
}
