import { Badge } from "@/components/ui/badge"
import { ACCOUNT_STATUS_LABEL } from "@/mocks"
import type { BadgeProps } from "@/components/ui/badge"

interface AccountStatusBadgeProps {
  status: string
}

type BadgeVariant = BadgeProps["variant"]

const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  ACTIVE:    "success",
  INACTIVE:  "secondary",
  SUSPENDED: "destructive",
}

export function AccountStatusBadge({ status }: AccountStatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status] ?? "secondary"
  const label = ACCOUNT_STATUS_LABEL[status] ?? status

  return (
    <Badge variant={variant} aria-label={`계정 상태: ${label}`}>
      {label}
    </Badge>
  )
}
