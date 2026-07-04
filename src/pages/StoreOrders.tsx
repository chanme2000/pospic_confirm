import { useState } from "react"
import { toast } from "sonner"
import { RotateCcw, Coins } from "lucide-react"
import { mockOrders, mockStoreList, mockSystemSettings, logAuditEntry, setStorePrice } from "@/mocks"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TODAY = new Date().toISOString().split("T")[0]

// Phase 0 데모 고정값: STORE001 로그인 = 강남점(store-001)
const MY_STORE_ID = "store-001"

export default function StoreOrders() {
  const [orders, setOrders] = useState(mockOrders)
  const myStore = mockStoreList.find((s) => s.id === MY_STORE_ID) ?? mockStoreList[0]
  const [priceOverride, setPriceOverride] = useState<number | null>(myStore.price_per_sheet)
  const [priceInput, setPriceInput] = useState(
    String(myStore.price_per_sheet ?? mockSystemSettings.price_per_sheet)
  )

  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const printSuccessCount = orders.filter((o) => o.status === "PRINT_SUCCESS").length

  function handleRefund(orderId: string) {
    const order = orders.find((o) => o.id === orderId)
    logAuditEntry({
      actor_type: "STORE_OWNER",
      actor_name: `${myStore.name} 점주`,
      action: "REFUND",
      target_type: "Payment",
      target_label: orderId,
      before_value: null,
      after_value: order ? `환불 ${order.total_amount.toLocaleString()}원` : null,
      memo: null,
    })
    toast.success("환불 처리 완료", {
      description: `주문 #${orderId}이 환불 처리되었습니다`,
    })
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: "REFUNDED" } : o)
    )
  }

  function priceLabel(value: number | null) {
    return value
      ? `${value.toLocaleString()}원`
      : `전역값 사용(${mockSystemSettings.price_per_sheet.toLocaleString()}원)`
  }

  function handleSavePrice() {
    const next = Number(priceInput)
    if (!Number.isFinite(next) || next < 501) {
      toast.error("단가는 501원 이상으로 설정해야 합니다")
      return
    }
    const beforeLabel = priceLabel(priceOverride)
    setStorePrice(myStore.id, next) // 어드민 화면에서도 재진입 시 반영되도록 공유 mock 데이터 갱신
    setPriceOverride(next)
    logAuditEntry({
      actor_type: "STORE_OWNER",
      actor_name: `${myStore.name} 점주`,
      action: "PRICE_CHANGE",
      target_type: "Store",
      target_label: myStore.name,
      before_value: beforeLabel,
      after_value: priceLabel(next),
      memo: "점주가 매장 단가 직접 조정 — 본사 전역 단가에는 영향 없음",
    })
    toast.success("매장 단가가 변경되었습니다", {
      description: "본사 전역 단가에는 영향이 없으며, 변경 내역은 본사 감사 로그에서 확인할 수 있습니다",
    })
  }

  function handleResetToGlobal() {
    const beforeLabel = priceLabel(priceOverride)
    setStorePrice(myStore.id, null)
    setPriceOverride(null)
    setPriceInput(String(mockSystemSettings.price_per_sheet))
    logAuditEntry({
      actor_type: "STORE_OWNER",
      actor_name: `${myStore.name} 점주`,
      action: "PRICE_CHANGE",
      target_type: "Store",
      target_label: myStore.name,
      before_value: beforeLabel,
      after_value: priceLabel(null),
      memo: "점주가 전역 단가 사용으로 복귀",
    })
    toast.success("전역 단가로 되돌렸습니다")
  }

  return (
    <section aria-labelledby="store-orders-heading">
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
        <h2 id="store-orders-heading" className="text-2xl font-black text-gray-900 tracking-tight">
          오늘 출력 현황
        </h2>
        <time
          dateTime={TODAY}
          className="text-sm text-gray-400"
          aria-label={`오늘 날짜: ${TODAY}`}
        >
          {TODAY}
        </time>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-black text-gray-900 leading-none" aria-label={`총 주문 수 ${orders.length}건`}>
              {orders.length}
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wide">총 주문</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-black text-indigo-600 leading-none" aria-label={`총 결제액 ${totalAmount.toLocaleString()}원`}>
              {totalAmount.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wide">결제액(원)</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-black text-emerald-600 leading-none" aria-label={`출력 완료 ${printSuccessCount}건`}>
              {printSuccessCount}
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wide">출력완료</p>
          </CardContent>
        </Card>
      </div>

      {/* 매장 단가 설정 (v3.4 신규) */}
      <Card className="border-0 shadow-sm bg-white mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <h3 className="text-sm font-bold text-gray-900">우리 매장 인화 단가</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            본사 전역 단가와 별개로 우리 매장만의 단가를 설정할 수 있습니다. 본사 전역 단가에는 영향을 주지 않으며,
            변경 내역은 본사 감사 로그에서 확인할 수 있습니다.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={501}
                step={1}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-28 h-9 text-sm"
                aria-label="우리 매장 인화 단가 (원)"
              />
              <span className="text-sm text-gray-500">원</span>
            </div>
            <Button size="sm" onClick={handleSavePrice} aria-label="매장 단가 저장">
              저장
            </Button>
            {priceOverride !== null && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400"
                onClick={handleResetToGlobal}
                aria-label="전역 단가로 되돌리기"
              >
                전역 단가로 되돌리기
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            현재 적용 중: <span className="font-semibold text-gray-600">{priceLabel(priceOverride)}</span>
            {" · "}본사 전역 단가: {mockSystemSettings.price_per_sheet.toLocaleString()}원
          </p>
        </CardContent>
      </Card>

      {/* Order list */}
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">오늘 출력 내역이 없습니다</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="오늘 주문 목록">
          {orders.map((order) => (
            <li key={order.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 font-mono">
                          #{order.id}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <time dateTime={order.created_at}>{order.created_at}</time>
                        <span>{order.photo_count}장</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p
                        className="text-base font-bold text-gray-900"
                        aria-label={`결제액 ${order.total_amount.toLocaleString()}원`}
                      >
                        {order.total_amount.toLocaleString()}원
                      </p>
                      {order.status === "PRINT_SUCCESS" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleRefund(order.id)}
                          aria-label={`주문 #${order.id} 환불 처리`}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" aria-hidden="true" />
                          환불
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
