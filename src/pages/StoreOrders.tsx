import { useState } from "react"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"
import { mockOrders } from "@/mocks"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const TODAY = new Date().toISOString().split("T")[0]

export default function StoreOrders() {
  const [orders, setOrders] = useState(mockOrders)

  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const printSuccessCount = orders.filter((o) => o.status === "PRINT_SUCCESS").length

  function handleRefund(orderId: string) {
    toast.success("환불 처리 완료", {
      description: `주문 #${orderId}이 환불 처리되었습니다`,
    })
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: "REFUNDED" } : o)
    )
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
