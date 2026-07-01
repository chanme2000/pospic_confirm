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
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/30 blur-3xl rounded-full" aria-hidden="true" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-200/20 blur-3xl rounded-full" aria-hidden="true" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        <main>
          {/* Success hero */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center shadow-lg shadow-emerald-100">
                <CheckCircle
                  className="h-14 w-14 text-emerald-500"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">결제 완료!</h1>
            <p className="text-base text-gray-500">
              사진 인쇄가 시작되었습니다
            </p>
          </div>

          <Card className="mb-4 glass-card shadow-lg border-white/60">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" aria-hidden="true">
                  <Printer className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">인쇄 중입니다!</p>
                  <p className="text-xs text-gray-500">잠시만 기다려 주세요</p>
                </div>
              </div>

              <dl className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">주문 번호</dt>
                  <dd className="font-bold text-gray-900 font-mono tracking-tight">#order-001</dd>
                </div>
                {totalAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-gray-500">결제 금액</dt>
                    <dd className="font-bold text-gray-900">{totalAmount.toLocaleString()}원</dd>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">예상 대기시간</dt>
                  <dd className="font-semibold text-gray-900">약 1~2분</dd>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">상태</dt>
                  <dd>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true" />
                      출력중
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* 출력 적립 포인트 */}
          {IS_MEMBER && printReward > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-4 shadow-sm">
              <Gift className="h-5 w-5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-emerald-800">
                  {printReward}P 적립 완료!
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">출력 금액의 1%가 포인트로 적립되었습니다</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all">
              <Link to="/" aria-label="처음 화면으로 돌아가기">
                <Home className="h-4 w-4" aria-hidden="true" />
                처음으로
              </Link>
            </Button>

            {IS_MEMBER && (
              <Button asChild variant="outline" className="w-full h-11 border-gray-200 hover:border-gray-300 font-semibold transition-colors">
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
