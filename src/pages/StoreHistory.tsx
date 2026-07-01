import { useState } from "react"
import { BarChart2, TrendingUp, Receipt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PERIODS = [
  { label: "1개월", months: 1 },
  { label: "2개월", months: 2 },
  { label: "3개월", months: 3 },
]

const MOCK_MONTHLY = [
  {
    month: "2026-06",
    label: "2026년 6월",
    order_count: 38,
    total_revenue: 87000,
    card_amount: 54000,
    point_used: 33000,
  },
  {
    month: "2026-05",
    label: "2026년 5월",
    order_count: 52,
    total_revenue: 118500,
    card_amount: 79500,
    point_used: 39000,
  },
  {
    month: "2026-04",
    label: "2026년 4월",
    order_count: 45,
    total_revenue: 103500,
    card_amount: 70500,
    point_used: 33000,
  },
]

export default function StoreHistory() {
  const [selectedMonths, setSelectedMonths] = useState(1)

  const visibleData = MOCK_MONTHLY.slice(0, selectedMonths)

  const totals = visibleData.reduce(
    (acc, m) => ({
      order_count: acc.order_count + m.order_count,
      total_revenue: acc.total_revenue + m.total_revenue,
      card_amount: acc.card_amount + m.card_amount,
      point_used: acc.point_used + m.point_used,
    }),
    { order_count: 0, total_revenue: 0, card_amount: 0, point_used: 0 }
  )

  return (
    <section aria-labelledby="history-heading">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="h-5 w-5 text-indigo-500" aria-hidden="true" />
        <h2 id="history-heading" className="text-xl font-bold text-gray-900">
          매출 내역
        </h2>
      </div>

      {/* Period selector */}
      <div
        role="group"
        aria-label="조회 기간 선택"
        className="flex gap-2 mb-6"
      >
        {PERIODS.map((p) => (
          <Button
            key={p.months}
            variant={selectedMonths === p.months ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMonths(p.months)}
            aria-pressed={selectedMonths === p.months}
            className={cn("min-h-[36px]", selectedMonths === p.months && "bg-indigo-600 hover:bg-indigo-700")}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {/* Summary totals */}
      <dl className="grid grid-cols-2 gap-3 mb-6">
        <Card className="col-span-2">
          <CardContent className="p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              기간 총 매출
            </dt>
            <dd className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              {totals.total_revenue.toLocaleString()}
              <span className="text-lg font-bold ml-1">원</span>
            </dd>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <dt className="text-xs font-medium text-gray-500 mb-1">총 주문 수</dt>
            <dd className="text-2xl font-bold text-gray-900">
              {totals.order_count}
              <span className="text-sm font-medium text-gray-500 ml-1">건</span>
            </dd>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <dt className="text-xs font-medium text-gray-500 mb-1">카드 결제액</dt>
            <dd className="text-2xl font-bold text-gray-900">
              {totals.card_amount.toLocaleString()}
              <span className="text-sm font-medium text-gray-500 ml-1">원</span>
            </dd>
          </CardContent>
        </Card>
      </dl>

      {/* Monthly breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Receipt className="h-4 w-4 text-gray-400" aria-hidden="true" />
          월별 상세
        </h3>
        <ul className="space-y-3" role="list" aria-label="월별 매출 상세">
          {visibleData.map((month) => (
            <li key={month.month}>
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold text-gray-800">
                    {month.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <dl className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <dt className="text-xs text-gray-400 mb-0.5">주문</dt>
                      <dd className="text-base font-bold text-gray-900">{month.order_count}건</dd>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2.5 text-center">
                      <dt className="text-xs text-indigo-400 mb-0.5">총 매출</dt>
                      <dd className="text-base font-bold text-indigo-700">
                        {(month.total_revenue / 1000).toFixed(0)}K
                      </dd>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <dt className="text-xs text-gray-400 mb-0.5">카드</dt>
                      <dd className="text-base font-bold text-gray-900">
                        {(month.card_amount / 1000).toFixed(0)}K
                      </dd>
                    </div>
                  </dl>
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    포인트 사용: {month.point_used.toLocaleString()}원
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        최근 3개월 데이터까지 조회 가능합니다
      </p>
    </section>
  )
}
