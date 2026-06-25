import { cn } from "@/lib/utils"

interface Step {
  label: string
  index: number
}

interface StepIndicatorProps {
  currentStep: number
}

const STEPS: Step[] = [
  { label: "업로드", index: 1 },
  { label: "미리보기", index: 2 },
  { label: "결제", index: 3 },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="주문 단계" className="mb-6">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.index
          const isActive = currentStep === step.index
          return (
            <li key={step.index} className="flex items-center">
              <div className="flex flex-col items-center">
                <span
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isCompleted
                      ? "bg-indigo-600 text-white"
                      : isActive
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.index
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1 text-xs font-medium",
                    isActive ? "text-indigo-600" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "mx-2 mb-4 h-0.5 w-12",
                    isCompleted ? "bg-indigo-600" : "bg-gray-200"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
