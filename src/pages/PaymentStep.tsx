import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Coins, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StepIndicator } from "@/components/StepIndicator"
import { PospicLogo } from "@/components/PospicLogo"
import { mockUser, mockSystemSettings } from "@/mocks"

export default function PaymentStep() {
  const navigate = useNavigate()
  const photoCount = 2
  const totalAmount = mockSystemSettings.price_per_sheet * photoCount // 3000
  const availablePoints = mockUser.user_wallet.current_balance // 3000
  const maxSlider = Math.min(availablePoints, totalAmount)

  const [pointInput, setPointInput] = useState(0)
  const usedPoints = Math.min(pointInput, availablePoints, totalAmount)
  const cardAmount = Math.max(0, totalAmount - usedPoints)
  const salesReward = Math.floor(cardAmount * 0.1)

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPointInput(Number(e.target.value))
  }

  function handlePointInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.min(Number(e.target.value) || 0, maxSlider)
    setPointInput(val)
  }

  function handlePay() {
    navigate("/order/complete")
  }

  return (
    <div className="min-h-screen bg-mesh text-gray-900">
      <a
        href="#payment-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        본문으로 바로가기
      </a>

      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <PospicLogo size="sm" />
        </div>
      </header>

      <main id="payment-main" className="max-w-md mx-auto px-4 py-6 animate-fade-in-up">
        <StepIndicator currentStep={3} />

        <h1 className="text-xl font-bold text-gray-900 mb-1">결제</h1>
        <p className="text-sm text-gray-500 mb-6">포인트를 사용해 카드 결제 금액을 줄이세요</p>

        {/* Order summary */}
        <Card className="mb-5 glass-card border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">주문 내역</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  사진 {photoCount}장 × {mockSystemSettings.price_per_sheet.toLocaleString()}원
                </span>
                <span className="font-semibold text-gray-900">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>

              <div className="h-px bg-gray-100" aria-hidden="true" />

              {/* Point slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="point-slider"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                  >
                    <Coins className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                    포인트 사용
                  </label>
                  <span className="text-xs text-gray-500">
                    보유 {availablePoints.toLocaleString()}P
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <input
                    id="point-slider"
                    type="range"
                    min={0}
                    max={maxSlider}
                    step={100}
                    value={pointInput}
                    onChange={handleSliderChange}
                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                    aria-label={`포인트 사용량 슬라이더. 현재 ${usedPoints}P`}
                    aria-valuemin={0}
                    aria-valuemax={maxSlider}
                    aria-valuenow={usedPoints}
                  />
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Input
                      type="number"
                      min={0}
                      max={maxSlider}
                      value={pointInput}
                      onChange={handlePointInputChange}
                      className="w-20 text-right text-sm h-9"
                      aria-label="포인트 사용량 직접 입력"
                    />
                    <span className="text-sm text-gray-500">P</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setPointInput(0)}
                    className="text-xs text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    사용 안 함
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointInput(maxSlider)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    전액 사용
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment breakdown */}
        <Card className="mb-6 glass-card border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">결제 내역</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">포인트 사용</span>
                <span className="font-medium text-indigo-600">
                  -{usedPoints.toLocaleString()}P
                </span>
              </div>

              <div className="h-px bg-gray-100" aria-hidden="true" />

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  카드 결제
                </span>
                <span
                  className="text-xl font-bold text-indigo-600"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`카드 결제 금액 ${cardAmount.toLocaleString()}원`}
                >
                  {cardAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward notice */}
        {cardAmount > 0 ? (
          <p
            className="text-xs text-gray-400 flex items-start gap-1.5 mb-6 px-1"
            role="note"
            aria-live="polite"
          >
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            인쇄 완료 즉시 담당 영업사원에게 카드 결제 금액의 10% ({salesReward.toLocaleString()}P)가 리워드로 적립됩니다
          </p>
        ) : (
          <p
            className="text-xs text-amber-600 flex items-start gap-1.5 mb-6 px-1 bg-amber-50 rounded-lg p-3"
            role="note"
            aria-live="polite"
          >
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            전액 포인트 결제 — 카드 결제가 없어 영업사원 리워드는 0P입니다
          </p>
        )}

        <Button
          onClick={handlePay}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          aria-label={
            cardAmount > 0
              ? `카드 ${cardAmount.toLocaleString()}원 결제하기`
              : "포인트로 결제 완료하기"
          }
        >
          {cardAmount > 0
            ? `카드 ${cardAmount.toLocaleString()}원 결제`
            : "포인트로 결제 완료"}
        </Button>
      </main>
    </div>
  )
}
