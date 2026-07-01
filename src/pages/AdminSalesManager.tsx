import { toast } from "sonner"
import { Plus, QrCode, Download, Store, Wallet, Award, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockSalesList, mockSalesLedger, LEDGER_TYPE_LABEL } from "@/mocks"

function QRModal({ name, code }: { name: string; code: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div
        className="w-40 h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2"
        aria-label={`${name} 영업사원 QR 코드 미리보기 영역`}
      >
        <QrCode className="h-16 w-16 text-gray-300" aria-hidden="true" />
        <span className="text-xs text-gray-400">QR 코드</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">영업 코드: {code}</p>
        <p className="text-xs text-gray-400 mt-1 bg-gray-50 rounded px-2 py-1 font-mono">
          어드민 전용 생성 QR
        </p>
      </div>
    </div>
  )
}

export default function AdminSalesManager() {
  function handleAddSales() {
    toast.info("준비 중인 기능입니다", {
      description: "영업사원 등록 기능이 곧 추가됩니다",
    })
  }

  function handleQRPreview(name: string, code: string) {
    toast(
      <QRModal name={name} code={code} />,
      {
        duration: 8000,
        closeButton: true,
      }
    )
  }

  function handleDownload() {
    toast.info("준비 중인 기능입니다", {
      description: "PNG 다운로드 기능이 곧 추가됩니다",
    })
  }

  // Get recent ledger for each sales person (last 3)
  function getRecentLedger(salesId: string) {
    return mockSalesLedger
      .filter(() => {
        // Mock: all belong to sales-001
        return salesId === "sales-001" || mockSalesLedger.length > 0
      })
      .slice(0, 3)
  }

  return (
    <section aria-labelledby="sales-heading">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 id="sales-heading" className="text-xl font-bold text-gray-900">
          영업 관리
        </h2>
        <Button
          onClick={handleAddSales}
          aria-label="새 영업사원 등록"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          영업사원 등록
        </Button>
      </div>

      <div className="space-y-4" role="list" aria-label="영업사원 목록">
        {mockSalesList.map((sales) => (
          <Card key={sales.id} role="listitem" aria-label={`영업사원 ${sales.name}`}>
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{sales.name}</h3>
                    <Badge variant="secondary" aria-label={`영업 코드: ${sales.sales_code}`}>
                      {sales.sales_code}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQRPreview(sales.name, sales.sales_code)}
                    aria-label={`${sales.name} 영업사원 QR 미리보기`}
                  >
                    <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                    QR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    aria-label={`${sales.name} 영업사원 QR PNG 다운로드`}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.info("준비 중인 기능입니다", { description: "QR 재생성 기능이 곧 추가됩니다" })}
                    aria-label={`${sales.name} 영업사원 QR 재생성`}
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <dl className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <dt className="text-xs text-gray-400 flex items-center justify-center gap-1 mb-1">
                    <Store className="h-3 w-3" aria-hidden="true" />
                    담당 가맹점
                  </dt>
                  <dd className="text-base font-bold text-gray-900">{sales.linked_stores}곳</dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <dt className="text-xs text-gray-400 flex items-center justify-center gap-1 mb-1">
                    <Award className="h-3 w-3" aria-hidden="true" />
                    누적 리워드
                  </dt>
                  <dd className="text-base font-bold text-indigo-600">{sales.total_reward.toLocaleString()}P</dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <dt className="text-xs text-gray-400 flex items-center justify-center gap-1 mb-1">
                    <Wallet className="h-3 w-3" aria-hidden="true" />
                    현재 잔액
                  </dt>
                  <dd className="text-base font-bold text-green-600">{sales.sales_wallet.current_balance.toLocaleString()}P</dd>
                </div>
              </dl>

              {/* Recent ledger mini table */}
              {sales.id === "sales-001" && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">최근 적립 내역</p>
                  <div className="space-y-1.5" role="list" aria-label="최근 적립 내역">
                    {getRecentLedger(sales.id).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0"
                        role="listitem"
                      >
                        <span className="text-gray-400">{entry.created_at}</span>
                        <span className="text-gray-600">{LEDGER_TYPE_LABEL[entry.type] ?? entry.type}</span>
                        <span className={entry.amount > 0 ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
                          {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()}P
                        </span>
                        {entry.status === "UNRECOVERED" && (
                          <Badge variant="destructive" aria-label="미회수">미회수</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sales.id !== "sales-001" && (
                <p className="text-xs text-gray-400 text-center py-2">적립 내역 없음</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
