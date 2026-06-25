import { toast } from "sonner"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { mockUserLedger, mockSalesLedger, LEDGER_TYPE_LABEL } from "@/mocks"
import { cn } from "@/lib/utils"

function AmountCell({ amount }: { amount: number }) {
  const isPositive = amount > 0
  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        isPositive ? "text-green-600" : "text-red-500"
      )}
      aria-label={`${isPositive ? "+" : ""}${amount.toLocaleString()}원`}
    >
      {isPositive ? "+" : ""}{amount.toLocaleString()}
    </span>
  )
}

function StatusCell({ status }: { status: string }) {
  if (status === "UNRECOVERED") {
    return (
      <Badge variant="destructive" aria-label="미회수 상태">
        미회수
      </Badge>
    )
  }
  return (
    <Badge variant="success" aria-label="성공 상태">
      완료
    </Badge>
  )
}

function LedgerTable({
  rows,
}: {
  rows: typeof mockUserLedger | typeof mockSalesLedger
}) {
  if (rows.length === 0) {
    return (
      <p className="text-center py-10 text-sm text-gray-400">내역이 없습니다</p>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[560px]" aria-label="원장 내역">
        <thead>
          <tr className="border-b border-gray-100">
            <th scope="col" className="text-left py-3 px-2 text-xs font-semibold text-gray-500 whitespace-nowrap">일시</th>
            <th scope="col" className="text-left py-3 px-2 text-xs font-semibold text-gray-500">대상</th>
            <th scope="col" className="text-right py-3 px-2 text-xs font-semibold text-gray-500">변동금액</th>
            <th scope="col" className="text-left py-3 px-2 text-xs font-semibold text-gray-500">타입</th>
            <th scope="col" className="text-left py-3 px-2 text-xs font-semibold text-gray-500">참조ID</th>
            <th scope="col" className="text-left py-3 px-2 text-xs font-semibold text-gray-500">상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-2 text-xs text-gray-400 whitespace-nowrap">{row.created_at}</td>
              <td className="py-3 px-2 font-medium text-gray-700">{row.target_name}</td>
              <td className="py-3 px-2 text-right">
                <AmountCell amount={row.amount} />
              </td>
              <td className="py-3 px-2 text-gray-600 whitespace-nowrap">
                {LEDGER_TYPE_LABEL[row.type] ?? row.type}
              </td>
              <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                {row.reference_id ?? "—"}
              </td>
              <td className="py-3 px-2">
                <StatusCell status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminPointLedger() {
  function handleExport() {
    toast.info("준비 중인 기능입니다", {
      description: "엑셀 내보내기는 곧 지원될 예정입니다",
    })
  }

  return (
    <section aria-labelledby="ledger-heading">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 id="ledger-heading" className="text-xl font-bold text-gray-900">
          포인트 원장
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          aria-label="원장 데이터 엑셀로 내보내기"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          엑셀 내보내기
        </Button>
      </div>

      <Tabs defaultValue="user">
        <TabsList aria-label="원장 유형 선택">
          <TabsTrigger value="user">회원 포인트</TabsTrigger>
          <TabsTrigger value="sales">영업 리워드</TabsTrigger>
        </TabsList>

        <TabsContent value="user" aria-label="회원 포인트 원장">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <LedgerTable rows={mockUserLedger} />
          </div>
        </TabsContent>

        <TabsContent value="sales" aria-label="영업 리워드 원장">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <LedgerTable rows={mockSalesLedger} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
