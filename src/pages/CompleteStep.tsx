import { useLocation, Link } from "react-router-dom"
import { CheckCircle, Printer, Home, ClipboardList, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const IS_MEMBER = true

export default function CompleteStep() {
  const location = useLocation()
  const printReward: number = location.state?.printReward ?? 0
  const totalAmount: number = location.state?.totalAmount ?? 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <main>
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle
                className="h-20 w-20 text-green-500"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h1>
            <p className="text-gray-500 text-sm">
              사진 인쇄가 시작되었습니다
            </p>
          </div>

          <Card className="mb-4">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Printer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">인쇄 중입니다!</p>
                  <p className="text-xs text-gray-500">잠시만 기다려 주세요</p>
                </div>
              </div>

              <dl className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">주문 번호</dt>
                  <dd className="font-semibold text-gray-900 font-mono">#order-001</dd>
                </div>
                {totalAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-gray-500">결제 금액</dt>
                    <dd className="font-semibold text-gray-900">{totalAmount.toLocaleString()}원</dd>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">예상 대기시간</dt>
                  <dd className="font-medium text-gray-900">약 1~2분</dd>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">상태</dt>
                  <dd>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                      출력중
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* 출력 적립 포인트 */}
          {IS_MEMBER && printReward > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
              <Gift className="h-5 w-5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  {printReward}P 적립 완료!
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">출력 금액의 1%가 포인트로 적립되었습니다</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/" aria-label="처음 화면으로 돌아가기">
                <Home className="h-4 w-4" aria-hidden="true" />
                처음으로
              </Link>
            </Button>

            {IS_MEMBER && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/mypage" aria-label="마이페이지에서 주문 내역 확인">
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  주문 내역 보기
                </Link>
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
