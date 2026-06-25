import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Wallet, Users, Award, Copy, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockSalesPerson, mockSalesLedger, LEDGER_TYPE_LABEL } from "@/mocks"
import { cn } from "@/lib/utils"

const LEDGER_TYPE_KO: Record<string, string> = {
  ...LEDGER_TYPE_LABEL,
  SALES_REWARD:    "리워드 적립",
  REFUND_ROLLBACK: "환불 회수",
}

function handleCopyCode(code: string) {
  navigator.clipboard.writeText(code).then(() => {
    toast.success("영업 코드가 복사되었습니다", { description: code })
  }).catch(() => {
    toast.error("복사에 실패했습니다")
  })
}

export default function SalesDashboard() {
  const navigate = useNavigate()

  const recentLedger = [...mockSalesLedger]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3)

  return (
    <section aria-labelledby="dashboard-heading">
      <h2
        id="dashboard-heading"
        className="text-xl font-bold text-gray-900 mb-6"
      >
        매출 대시보드
      </h2>

      {/* Stats grid */}
      <dl
        className="grid grid-cols-2 gap-3 mb-6"
        aria-label="주요 통계"
      >
        {/* 리워드 잔액 */}
        <Card className="col-span-2">
          <CardContent className="p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
              <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
              리워드 잔액
            </dt>
            <dd className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              {mockSalesPerson.sales_wallet.current_balance.toLocaleString()}
              <span className="text-lg font-bold ml-1">P</span>
            </dd>
          </CardContent>
        </Card>

        {/* 연결 회원 수 */}
        <Card>
          <CardContent className="p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              연결 회원 수
            </dt>
            <dd className="text-2xl font-bold text-gray-900">
              {mockSalesPerson.linked_users}
              <span className="text-sm font-medium text-gray-500 ml-1">명</span>
            </dd>
          </CardContent>
        </Card>

        {/* 누적 리워드 */}
        <Card>
          <CardContent className="p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              누적 리워드
            </dt>
            <dd className="text-2xl font-bold text-gray-900">
              {mockSalesPerson.total_reward.toLocaleString()}
              <span className="text-sm font-medium text-gray-500 ml-1">P</span>
            </dd>
          </CardContent>
        </Card>

        {/* 내 영업 코드 */}
        <Card className="col-span-2">
          <CardContent className="p-4">
            <dt className="text-xs font-medium text-gray-500 mb-2">내 영업 코드</dt>
            <dd className="flex items-center justify-between gap-3">
              <code
                className="text-base font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg tracking-widest select-all"
                aria-label={`영업 코드: ${mockSalesPerson.sales_code}`}
              >
                {mockSalesPerson.sales_code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCode(mockSalesPerson.sales_code)}
                aria-label="영업 코드 복사"
                className="min-h-[44px] min-w-[44px] flex-shrink-0"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                복사
              </Button>
            </dd>
          </CardContent>
        </Card>
      </dl>

      {/* Recent rewards preview */}
      <section aria-labelledby="recent-rewards-heading">
        <div className="flex items-center justify-between mb-3">
          <h3
            id="recent-rewards-heading"
            className="text-sm font-semibold text-gray-700"
          >
            최근 리워드 내역
          </h3>
        </div>

        <Card>
          <CardContent className="p-0">
            {recentLedger.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                리워드 내역이 없습니다
              </p>
            ) : (
              <ul role="list" aria-label="최근 리워드 내역">
                {recentLedger.map((entry, idx) => (
                  <li
                    key={entry.id}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3",
                      idx < recentLedger.length - 1 && "border-b border-gray-100"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{entry.created_at}</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">
                        {LEDGER_TYPE_KO[entry.type] ?? entry.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {entry.status === "UNRECOVERED" && (
                        <Badge variant="destructive" aria-label="미회수">미회수</Badge>
                      )}
                      {entry.status === "SUCCESS" && (
                        <Badge variant="secondary" aria-label="정상">정상</Badge>
                      )}
                      <span
                        className={cn(
                          "text-sm font-bold tabular-nums",
                          entry.amount > 0 ? "text-green-600" : "text-red-500"
                        )}
                        aria-label={`${entry.amount > 0 ? "+" : ""}${entry.amount.toLocaleString()} 포인트`}
                      >
                        {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()}P
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full mt-3 min-h-[44px]"
          onClick={() => navigate("/sales-portal/rewards")}
          aria-label="전체 리워드 내역 보기"
        >
          전체 리워드 내역 보기
          <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </Button>
      </section>
    </section>
  )
}
