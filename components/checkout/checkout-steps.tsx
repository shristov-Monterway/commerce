import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCheckoutConfig } from "@/lib/layout-utils"
import { getMessages, getTranslation } from "@/lib/i18n"

interface CheckoutStepsProps {
  currentStep: string
  lang: string
}

export async function CheckoutSteps({ currentStep, lang }: CheckoutStepsProps) {
  const checkoutConfig = getCheckoutConfig(lang)
  const messages = await getMessages(lang)
  const t = (key: string, params?: Record<string, any>) => getTranslation(messages, key, params)

  const steps = checkoutConfig.steps.map((step) => ({
    id: step,
    name: t(`checkout.steps.${step}`),
  }))

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex

          return (
            <li key={step.id} className={cn("flex items-center", index < steps.length - 1 ? "w-full" : "")}>
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                    isActive ? "bg-primary text-primary-foreground" : "",
                    isCompleted ? "bg-primary text-primary-foreground" : "",
                    !isActive && !isCompleted ? "bg-muted text-muted-foreground" : "",
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium",
                    isActive ? "text-foreground" : "",
                    isCompleted ? "text-foreground" : "",
                    !isActive && !isCompleted ? "text-muted-foreground" : "",
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("w-full h-px bg-muted mx-2", isCompleted ? "bg-primary" : "")}></div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
