import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABEL } from "@/mocks"
import type { BadgeProps } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

type BadgeVariant = BadgeProps["variant"]

const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  PENDING:       "secondary",
  PAID:          "default",
  PRINTING:      "blue",
  PRINT_SUCCESS: "success",
  PRINT_FAILED:  "destructive",
  CANCELLED:     "outline",
  REFUNDED:      "warning",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status] ?? "secondary"
  const label = ORDER_STATUS_LABEL[status] ?? status

  return (
    <Badge variant={variant} aria-label={`주문 상태: ${label}`}>
      {label}
    </Badge>
  )
}
