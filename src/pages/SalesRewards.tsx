import { mockSalesLedger, LEDGER_TYPE_LABEL } from "@/mocks"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const LEDGER_TYPE_KO: Record<string, string> = {
  ...LEDGER_TYPE_LABEL,
  SALES_REWARD:    "리워드 적립",
  REFUND_ROLLBACK: "환불 회수",
}

export default function SalesRewards() {
  const sorted = [...mockSalesLedger].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  )

  const totalEarned = sorted
    .filter((e) => e.type === "SALES_REWARD")
    .reduce((sum, e) => sum + e.amount, 0)

  const totalRefunded = sorted
    .filter((e) => e.type === "REFUND_ROLLBACK")
    .reduce((sum, e) => sum + Math.abs(e.amount), 0)

  return (
    <section aria-labelledby="rewards-heading">
      <h2
        id="rewards-heading"
        className="text-xl font-bold text-gray-900 mb-6"
      >
        리워드 내역
      </h2>

      {/* Summary stats */}
      <dl
        className="grid grid-cols-2 gap-3 mb-6"
        aria-label="리워드 통계 요약"
      >
        <Card>
          <CardContent className="p-4">
            <dt className="text-xs font-medium text-gray-500 mb-1">총 적립액</dt>
            <dd className="text-xl font-bold text-green-600 tabular-nums">
              +{totalEarned.toLocaleString()}
              <span className="text-sm font-medium ml-0.5">P</span>
            </dd>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <dt className="text-xs font-medium text-gray-500 mb-1">총 회수액</dt>
            <dd className="text-xl font-bold text-red-500 tabular-nums">
              -{totalRefunded.toLocaleString()}
              <span className="text-sm font-medium ml-0.5">P</span>
            </dd>
          </CardContent>
        </Card>
      </dl>

      {/* Ledger list */}
      {sorted.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-gray-400">리워드 내역이 없습니다</p>
          </CardContent>
        </Card>
      ) : (
        <ul
          className="space-y-3"
          role="list"
          aria-label="리워드 전체 내역"
        >
          {sorted.map((entry) => (
            <li key={entry.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: meta info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {LEDGER_TYPE_KO[entry.type] ?? entry.type}
                        </span>
                        {entry.status === "UNRECOVERED" && (
                          <Badge variant="destructive" aria-label="미회수 상태">미회수</Badge>
                        )}
                        {entry.status === "SUCCESS" && (
                          <Badge variant="secondary" aria-label="정상 상태">정상</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{entry.created_at}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        참조 ID:{" "}
                        <span className="font-mono text-gray-500">
                          {entry.reference_id ?? "—"}
                        </span>
                      </p>
                    </div>

                    {/* Right: amount */}
                    <div className="flex-shrink-0 text-right">
                      <span
                        className={cn(
                          "text-lg font-extrabold tabular-nums",
                          entry.amount > 0 ? "text-green-600" : "text-red-500"
                        )}
                        aria-label={`${entry.amount > 0 ? "+" : ""}${entry.amount.toLocaleString()} 포인트`}
                      >
                        {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()}P
                      </span>
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
