import { Camera, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface PospicLogoProps {
  size?: "sm" | "lg"        // sm: 헤더 인라인, lg: 인증 페이지 중앙
  variant?: "default" | "admin"  // admin: gray-800 + ShieldCheck 배지
  subtitle?: string          // lg 전용 부제목
  className?: string
}

function LogoIcon({ size, variant }: { size: "sm" | "lg"; variant: "default" | "admin" }) {
  const isLg = size === "lg"
  const isAdmin = variant === "admin"

  return (
    <div className="relative flex-shrink-0">
      <div
        className={cn(
          "flex items-center justify-center",
          isLg
            ? cn("w-12 h-12 rounded-2xl shadow-lg", isAdmin ? "shadow-gray-200" : "shadow-indigo-200")
            : "w-8 h-8 rounded-lg",
          isAdmin ? "bg-gray-800" : "bg-indigo-600",
        )}
        aria-hidden="true"
      >
        <Camera className={cn("text-white", isLg ? "h-6 w-6" : "h-4 w-4")} />
      </div>
      {isAdmin && (
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center ring-2 ring-white"
          aria-hidden="true"
        >
          <ShieldCheck className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  )
}

export function PospicLogo({
  size = "sm",
  variant = "default",
  subtitle,
  className,
}: PospicLogoProps) {
  if (size === "lg") {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <div className="mb-3">
          <LogoIcon size="lg" variant={variant} />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">pospic</span>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size="sm" variant={variant} />
      <span className="text-xl font-bold text-gray-900 tracking-tight">pospic</span>
    </div>
  )
}
