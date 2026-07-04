import { useState } from "react"
import { toast } from "sonner"
import { Search, RotateCcw } from "lucide-react"
import { mockOrders, ORDER_STATUS_LABEL, logAuditEntry } from "@/mocks"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type FilterTab = "ALL" | "PAID" | "PRINTING" | "PRINT_SUCCESS"

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL",           label: "전체" },
  { key: "PAID",          label: "결제완료" },
  { key: "PRINTING",      label: "출력중" },
  { key: "PRINT_SUCCESS", label: "출력완료" },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders)
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL")
  const [query, setQuery] = useState("")

  const byTab =
    activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeTab)

  const q = query.trim().toLowerCase()
  const filtered = !q
    ? byTab
    : byTab.filter((o) => {
        const qDigits = q.replace(/-/g, "")
        return (
          o.id.toLowerCase().includes(q) ||
          o.user_name.toLowerCase().includes(q) ||
          o.phone.replace(/-/g, "").includes(qDigits) ||
          o.store_name.toLowerCase().includes(q) ||
          (o.sales_name ?? "").toLowerCase().includes(q)
        )
      })

  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const totalPointUsed = orders.reduce((sum, o) => sum + o.point_used, 0)
  const pointUsageRate =
    totalAmount > 0 ? Math.round((totalPointUsed / totalAmount) * 100) : 0

  function handleRefund(orderId: string) {
    const order = orders.find((o) => o.id === orderId)
    logAuditEntry({
      actor_type: "ADMIN",
      actor_name: "본사 관리자",
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
      prev.map((o) => (o.id === orderId ? { ...o, status: "REFUNDED" } : o))
    )
  }

  return (
    <section aria-labelledby="orders-heading">
      <h2 id="orders-heading" className="text-xl font-bold text-gray-900 mb-6">
        주문 현황
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{mockOrders.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">오늘 총 주문</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">총 결제액 (원)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{pointUsageRate}%</p>
            <p className="text-xs text-gray-500 mt-0.5">평균 포인트 사용률</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="주문번호, 회원명, 휴대폰, 가맹점, 영업사원으로 검색"
          className="pl-9"
          aria-label="주문 검색 — 주문번호, 회원명, 휴대폰, 가맹점, 영업사원"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 overflow-x-auto" role="tablist" aria-label="주문 상태 필터">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            aria-controls="orders-table"
            onClick={() => setActiveTab(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === key
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div id="orders-table" role="tabpanel" aria-label={`${ORDER_STATUS_LABEL[activeTab] ?? "전체"} 주문 목록`}>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">{q ? "검색 결과가 없습니다" : "해당 상태의 주문이 없습니다"}</p>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label="주문 목록">
            {filtered.map((order) => (
              <Card key={order.id} role="listitem">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 font-mono">
                          #{order.id}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.user_name} · {order.store_name}
                        {order.sales_name ? ` · ${order.sales_name}` : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.created_at}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-gray-900">
                        {order.total_amount.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-gray-400">포인트</span>
                      <p className="text-sm font-medium text-indigo-600">
                        {order.point_used.toLocaleString()}P
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">카드 결제</span>
                      <p className="text-sm font-medium text-gray-900">
                        {order.card_amount.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  {order.status === "PRINT_SUCCESS" && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
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
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
