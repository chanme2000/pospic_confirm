import { useState } from "react"
import { Search, Package, CheckCircle2, Loader2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PospicLogo } from "@/components/PospicLogo"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  PENDING:       { label: "대기중",   icon: Clock,         color: "text-gray-500" },
  PAID:          { label: "결제완료", icon: CheckCircle2,  color: "text-blue-500" },
  PRINTING:      { label: "출력중",   icon: Loader2,       color: "text-indigo-500" },
  PRINT_SUCCESS: { label: "출력완료", icon: CheckCircle2,  color: "text-green-500" },
  PRINT_FAILED:  { label: "출력실패", icon: XCircle,       color: "text-red-500" },
  CANCELLED:     { label: "취소됨",   icon: XCircle,       color: "text-gray-400" },
  REFUNDED:      { label: "환불됨",   icon: XCircle,       color: "text-orange-500" },
}

const MOCK_ORDERS: Record<string, {
  id: string
  status: string
  photo_count: number
  total_amount: number
  card_amount: number
  point_used: number
  store_name: string
  created_at: string
}> = {
  "ORD-20260618-001": {
    id: "ORD-20260618-001",
    status: "PRINT_SUCCESS",
    photo_count: 2,
    total_amount: 3000,
    card_amount: 0,
    point_used: 3000,
    store_name: "강남점",
    created_at: "2026-06-18 14:30",
  },
  "ORD-20260618-002": {
    id: "ORD-20260618-002",
    status: "PRINTING",
    photo_count: 1,
    total_amount: 1500,
    card_amount: 1500,
    point_used: 0,
    store_name: "홍대점",
    created_at: "2026-06-18 14:35",
  },
}

type LookupState = "idle" | "loading" | "found" | "not_found"

export default function OrderLookup() {
  const [orderNo, setOrderNo] = useState("")
  const [state, setState] = useState<LookupState>("idle")
  const [result, setResult] = useState<typeof MOCK_ORDERS[string] | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNo.trim()) return

    setState("loading")
    setTimeout(() => {
      const found = MOCK_ORDERS[orderNo.trim().toUpperCase()]
      if (found) {
        setResult(found)
        setState("found")
      } else {
        setResult(null)
        setState("not_found")
      }
    }, 600)
  }

  const statusInfo = result ? STATUS_CONFIG[result.status] : null

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <PospicLogo size="sm" />
          <Link
            to="/login"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            회원 로그인
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8 animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">주문 조회</h1>
          <p className="text-sm text-gray-500">주문번호로 출력 현황을 확인하세요</p>
        </div>

        {/* Search form */}
        <Card className="glass-card border-white/50 shadow-lg mb-6">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend className="sr-only">주문번호 조회</legend>
                <div className="space-y-1.5 mb-4">
                  <label htmlFor="order-number" className="text-sm font-medium text-gray-700">
                    주문번호
                  </label>
                  <Input
                    id="order-number"
                    type="text"
                    placeholder="ORD-20260618-001"
                    value={orderNo}
                    onChange={(e) => {
                      setOrderNo(e.target.value)
                      if (state !== "idle") setState("idle")
                    }}
                    className="font-mono text-sm"
                    aria-label="주문번호 입력"
                    aria-describedby="order-hint"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <p id="order-hint" className="text-xs text-gray-400">
                    결제 완료 후 수령한 주문번호를 입력하세요
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={!orderNo.trim() || state === "loading"}
                  aria-label="주문 조회하기"
                  aria-busy={state === "loading"}
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      조회 중...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" aria-hidden="true" />
                      조회하기
                    </>
                  )}
                </Button>
              </fieldset>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        {state === "found" && result && statusInfo && (
          <Card
            className="glass-card border-white/50 shadow-lg animate-fade-in-up"
            role="region"
            aria-label="주문 조회 결과"
            aria-live="polite"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                <div>
                  <p className="text-xs text-gray-400">주문번호</p>
                  <p className="text-sm font-mono font-bold text-gray-900">{result.id}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <statusInfo.icon
                  className={cn("h-5 w-5", statusInfo.color, result.status === "PRINTING" && "animate-spin")}
                  aria-hidden="true"
                />
                <span className={cn("text-base font-bold", statusInfo.color)}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Details */}
              <dl className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">매장</dt>
                  <dd className="font-medium text-gray-900">{result.store_name}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">사진 수</dt>
                  <dd className="font-medium text-gray-900">{result.photo_count}장</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">결제 금액</dt>
                  <dd className="font-medium text-gray-900">{result.total_amount.toLocaleString()}원</dd>
                </div>
                {result.card_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">카드 결제</dt>
                    <dd className="font-medium text-gray-900">{result.card_amount.toLocaleString()}원</dd>
                  </div>
                )}
                {result.point_used > 0 && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">포인트 사용</dt>
                    <dd className="font-medium text-indigo-600">{result.point_used.toLocaleString()}P</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">주문 일시</dt>
                  <dd className="font-medium text-gray-900">{result.created_at}</dd>
                </div>
              </dl>

              {result.status === "PRINT_SUCCESS" && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-100 px-3 py-2.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                  <p className="text-xs text-green-700 font-medium">출력이 완료되었습니다. 매장에서 수령해주세요.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {state === "not_found" && (
          <div
            className="text-center py-8"
            role="alert"
            aria-live="assertive"
          >
            <XCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-gray-600 mb-1">주문을 찾을 수 없습니다</p>
            <p className="text-xs text-gray-400">주문번호를 다시 확인해주세요</p>
            <p className="text-xs text-gray-300 mt-1">
              데모용 주문번호: <code className="text-gray-500">ORD-20260618-001</code>
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          회원이라면{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            로그인
          </Link>
          {" "}후 마이페이지에서 주문 내역을 확인하세요
        </p>
      </main>
    </div>
  )
}
