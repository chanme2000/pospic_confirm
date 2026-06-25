import { useState } from "react"
import { mockOrders, ORDER_STATUS_LABEL } from "@/mocks"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"

type FilterTab = "ALL" | "PAID" | "PRINTING" | "PRINT_SUCCESS"

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL",           label: "전체" },
  { key: "PAID",          label: "결제완료" },
  { key: "PRINTING",      label: "출력중" },
  { key: "PRINT_SUCCESS", label: "출력완료" },
]

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL")

  const filtered =
    activeTab === "ALL"
      ? mockOrders
      : mockOrders.filter((o) => o.status === activeTab)

  const totalAmount = mockOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const totalPointUsed = mockOrders.reduce((sum, o) => sum + o.point_used, 0)
  const pointUsageRate =
    totalAmount > 0 ? Math.round((totalPointUsed / totalAmount) * 100) : 0

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
            <p className="text-sm">해당 상태의 주문이 없습니다</p>
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
                      <p className="text-xs text-gray-400">{order.created_at}</p>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
