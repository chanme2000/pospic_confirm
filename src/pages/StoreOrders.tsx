import { mockOrders } from "@/mocks"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"

const TODAY = new Date().toISOString().split("T")[0]

export default function StoreOrders() {
  const totalAmount = mockOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const printSuccessCount = mockOrders.filter((o) => o.status === "PRINT_SUCCESS").length

  return (
    <section aria-labelledby="store-orders-heading">
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
        <h2 id="store-orders-heading" className="text-xl font-bold text-gray-900">
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
        <Card>
          <CardContent className="p-4 text-center">
            <p
              className="text-2xl font-bold text-gray-900"
              aria-label={`총 주문 수 ${mockOrders.length}건`}
            >
              {mockOrders.length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">총 주문</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p
              className="text-2xl font-bold text-indigo-600"
              aria-label={`총 결제액 ${totalAmount.toLocaleString()}원`}
            >
              {totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">결제액 (원)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p
              className="text-2xl font-bold text-green-600"
              aria-label={`출력 완료 ${printSuccessCount}건`}
            >
              {printSuccessCount}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">출력완료</p>
          </CardContent>
        </Card>
      </div>

      {/* Order list */}
      {mockOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">오늘 출력 내역이 없습니다</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="오늘 주문 목록">
          {mockOrders.map((order) => (
            <li key={order.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 font-mono">
                          #{order.id}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <time
                        dateTime={order.created_at}
                        className="text-xs text-gray-400"
                        aria-label={`주문 시각 ${order.created_at}`}
                      >
                        {order.created_at}
                      </time>
                    </div>
                    <p
                      className="text-base font-bold text-gray-900 flex-shrink-0"
                      aria-label={`결제액 ${order.total_amount.toLocaleString()}원`}
                    >
                      {order.total_amount.toLocaleString()}원
                    </p>
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
