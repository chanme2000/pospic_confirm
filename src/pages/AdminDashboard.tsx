import { ShoppingCart, Wallet, Undo2, Coins, Award, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockOrders, mockUserLedger, mockSalesLedger, mockSalesList, mockAdminAuditLog } from "@/mocks"

const KPI_CARDS = [
  { key: "orders", label: "오늘 주문 수", icon: ShoppingCart, unit: "건", color: "text-gray-900" },
  { key: "revenue", label: "오늘 매출", icon: Wallet, unit: "원", color: "text-indigo-600" },
  { key: "refunds", label: "환불 건수", icon: Undo2, unit: "건", color: "text-red-500" },
  { key: "points", label: "포인트 지급", icon: Coins, unit: "P", color: "text-green-600" },
  { key: "rewards", label: "리워드 지급", icon: Award, unit: "P", color: "text-amber-600" },
] as const

export default function AdminDashboard() {
  const todayOrderCount = mockOrders.length
  const todayRevenue = mockOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const refundCount = mockAdminAuditLog.filter((log) => log.action === "REFUND").length
  const pointsGranted = mockUserLedger
    .filter((l) => l.amount > 0)
    .reduce((sum, l) => sum + l.amount, 0)
  const rewardsGranted = mockSalesLedger
    .filter((l) => l.amount > 0)
    .reduce((sum, l) => sum + l.amount, 0)

  const values: Record<(typeof KPI_CARDS)[number]["key"], number> = {
    orders: todayOrderCount,
    revenue: todayRevenue,
    refunds: refundCount,
    points: pointsGranted,
    rewards: rewardsGranted,
  }

  const topSales = [...mockSalesList]
    .sort((a, b) => b.total_reward - a.total_reward)
    .slice(0, 3)

  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="text-xl font-bold text-gray-900 mb-6">
        운영 대시보드
      </h2>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6" role="list" aria-label="오늘의 운영 지표">
        {KPI_CARDS.map(({ key, label, icon: Icon, unit, color }) => (
          <Card key={key} role="listitem">
            <CardContent className="p-4">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
                <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-xs">{label}</span>
              </div>
              <p className={`text-xl font-bold ${color}`}>
                {values[key].toLocaleString()}
                <span className="text-xs font-medium text-gray-400 ml-0.5">{unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TOP 영업사원 */}
      <Card>
        <CardContent className="p-5">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mb-3">
            <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
            TOP 영업사원
          </h3>
          <ol className="space-y-2" aria-label="누적 리워드 상위 영업사원">
            {topSales.map((sales, idx) => (
              <li
                key={sales.id}
                className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Badge variant={idx === 0 ? "warning" : "secondary"} className="flex-shrink-0" aria-label={`${idx + 1}위`}>
                    {idx + 1}위
                  </Badge>
                  <span className="text-sm font-medium text-gray-800 truncate">{sales.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{sales.sales_code}</span>
                </div>
                <span className="text-sm font-bold text-indigo-600 flex-shrink-0">
                  {sales.total_reward.toLocaleString()}P
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  )
}
