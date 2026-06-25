import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface PointBadgeProps {
  amount: number
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PointBadge({ amount, className, size = "md" }: PointBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold bg-indigo-50 text-indigo-700",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-base",
        className
      )}
      aria-label={`${amount.toLocaleString()} 포인트`}
    >
      <Coins
        aria-hidden="true"
        className={cn(
          size === "sm" && "h-3 w-3",
          size === "md" && "h-4 w-4",
          size === "lg" && "h-5 w-5"
        )}
      />
      {amount.toLocaleString()}P
    </span>
  )
}
