import { useState } from "react"
import { toast } from "sonner"
import { Save, Calculator, Percent, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockSystemSettings, logAuditEntry } from "@/mocks"

export default function AdminSettings() {
  const [pricePerSheet, setPricePerSheet] = useState(mockSystemSettings.price_per_sheet)
  const [rewardRate, setRewardRate] = useState(mockSystemSettings.reward_rate)
  const [userPrintRewardRate, setUserPrintRewardRate] = useState(mockSystemSettings.user_print_reward_rate)
  const [pointValidityMonths, setPointValidityMonths] = useState(mockSystemSettings.point_validity_months)

  function handleSavePrice(e: React.FormEvent) {
    e.preventDefault()
    const before = mockSystemSettings.price_per_sheet
    logAuditEntry({
      actor_type: "ADMIN",
      actor_name: "본사 관리자",
      action: "PRICE_CHANGE",
      target_type: "SystemSettings",
      target_label: "price_per_sheet (전역)",
      before_value: `${before.toLocaleString()}원`,
      after_value: `${pricePerSheet.toLocaleString()}원`,
      memo: null,
    })
    mockSystemSettings.price_per_sheet = pricePerSheet
    toast.success("단가 설정이 저장되었습니다", {
      description: `장당 단가: ${pricePerSheet.toLocaleString()}원`,
    })
  }

  function handleSaveReward(e: React.FormEvent) {
    e.preventDefault()
    if (rewardRate !== mockSystemSettings.reward_rate) {
      logAuditEntry({
        actor_type: "ADMIN",
        actor_name: "본사 관리자",
        action: "REWARD_RATE_CHANGE",
        target_type: "SystemSettings",
        target_label: "reward_rate (영업사원 리워드율)",
        before_value: `${mockSystemSettings.reward_rate}%`,
        after_value: `${rewardRate}%`,
        memo: null,
      })
    }
    mockSystemSettings.reward_rate = rewardRate
    mockSystemSettings.user_print_reward_rate = userPrintRewardRate
    mockSystemSettings.point_validity_months = pointValidityMonths
    toast.success("리워드 및 적립 설정이 저장되었습니다", {
      description: `영업 리워드율: ${rewardRate}% / 사용자 출력 적립율: ${userPrintRewardRate}% / 포인트 유효기간: ${pointValidityMonths === 0 ? "무기한" : `${pointValidityMonths}개월`}`,
    })
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPricePerSheet(Math.max(0, Number(e.target.value) || 0))
  }

  function handleRewardRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.min(100, Math.max(0, Number(e.target.value) || 0))
    setRewardRate(val)
  }

  function handleUserPrintRewardRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.min(100, Math.max(0, Number(e.target.value) || 0))
    setUserPrintRewardRate(val)
  }

  function handleValidityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPointValidityMonths(Math.max(0, Number(e.target.value) || 0))
  }

  const preview2sheets = pricePerSheet * 2
  const rewardPreview = Math.floor(pricePerSheet * (rewardRate / 100))
  const userPrintRewardPreview = Math.floor(pricePerSheet * (userPrintRewardRate / 100))

  return (
    <section aria-labelledby="settings-heading">
      <h2 id="settings-heading" className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
        시스템 설정
      </h2>

      <div className="max-w-lg space-y-4">
        {/* Pricing card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">인화 단가 설정</CardTitle>
            <CardDescription>장당 인화 단가를 설정합니다. 변경 즉시 결제 화면에 반영됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSavePrice}>
              <fieldset>
                <legend className="sr-only">인화 단가</legend>

                <div className="space-y-1.5 mb-4">
                  <label htmlFor="price-per-sheet" className="text-sm font-medium text-gray-700">
                    장당 인화 단가 (원)
                  </label>
                  <div className="relative">
                    <Input
                      id="price-per-sheet"
                      type="number"
                      min={0}
                      step={100}
                      value={pricePerSheet}
                      onChange={handlePriceChange}
                      className="pr-8"
                      aria-label="장당 인화 단가 입력"
                      aria-describedby="price-preview"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 pointer-events-none" aria-hidden="true">
                      원
                    </span>
                  </div>
                </div>

                <div
                  id="price-preview"
                  className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-5"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">예상 금액 미리보기</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                      <dt className="text-xs text-gray-400 mb-1">1장 인화</dt>
                      <dd className="text-xl font-black text-gray-900">{pricePerSheet.toLocaleString()}<span className="text-sm font-semibold text-gray-500 ml-0.5">원</span></dd>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                      <dt className="text-xs text-gray-400 mb-1">2장 인화</dt>
                      <dd className="text-xl font-black text-indigo-700">{preview2sheets.toLocaleString()}<span className="text-sm font-semibold text-indigo-400 ml-0.5">원</span></dd>
                    </div>
                  </dl>
                </div>

                <Button type="submit" className="w-full" aria-label="단가 설정 저장">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  저장
                </Button>
              </fieldset>
            </form>
          </CardContent>
        </Card>

        {/* Reward & point validity card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">리워드 및 포인트 설정</CardTitle>
            <CardDescription>사용자 출력 적립율, 영업 리워드율, 포인트 유효기간을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveReward}>
              <fieldset className="space-y-4">
                <legend className="sr-only">리워드 및 포인트 설정</legend>

                {/* user_print_reward_rate */}
                <div className="space-y-1.5">
                  <label htmlFor="user-print-reward-rate" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    사용자 출력 적립율 (%)
                  </label>
                  <div className="relative">
                    <Input
                      id="user-print-reward-rate"
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={userPrintRewardRate}
                      onChange={handleUserPrintRewardRateChange}
                      className="pr-8"
                      aria-label="사용자 출력 적립율 입력"
                      aria-describedby="user-reward-preview"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 pointer-events-none" aria-hidden="true">
                      %
                    </span>
                  </div>
                  <p id="user-reward-preview" className="text-xs text-gray-500" aria-live="polite">
                    장당 {pricePerSheet.toLocaleString()}원 출력 시 회원 적립:{" "}
                    <strong className="text-emerald-600">{userPrintRewardPreview.toLocaleString()}P</strong>
                  </p>
                </div>

                {/* reward_rate */}
                <div className="space-y-1.5">
                  <label htmlFor="reward-rate" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                    영업사원 리워드율 (%)
                  </label>
                  <div className="relative">
                    <Input
                      id="reward-rate"
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={rewardRate}
                      onChange={handleRewardRateChange}
                      className="pr-8"
                      aria-label="영업 리워드율 입력"
                      aria-describedby="reward-preview"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 pointer-events-none" aria-hidden="true">
                      %
                    </span>
                  </div>
                  <p
                    id="reward-preview"
                    className="text-xs text-gray-500"
                    aria-live="polite"
                  >
                    장당 {pricePerSheet.toLocaleString()}원 결제 시 영업 리워드:{" "}
                    <strong className="text-indigo-600">{rewardPreview.toLocaleString()}P</strong>
                  </p>
                </div>

                {/* point_validity_months */}
                <div className="space-y-1.5">
                  <label htmlFor="point-validity" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                    포인트 유효기간 (개월)
                  </label>
                  <div className="relative">
                    <Input
                      id="point-validity"
                      type="number"
                      min={0}
                      step={1}
                      value={pointValidityMonths}
                      onChange={handleValidityChange}
                      className="pr-16"
                      aria-label="포인트 유효기간 입력. 0은 무기한"
                      aria-describedby="validity-hint"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 pointer-events-none" aria-hidden="true">
                      개월
                    </span>
                  </div>
                  <p id="validity-hint" className="text-xs text-gray-500">
                    {pointValidityMonths === 0
                      ? "0 입력 시 유효기간 무기한 적용"
                      : `포인트 적립 후 ${pointValidityMonths}개월 경과 시 자동 소멸`}
                  </p>
                </div>

                <Button type="submit" className="w-full" aria-label="리워드 및 포인트 설정 저장">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  저장
                </Button>
              </fieldset>
            </form>
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-amber-100 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-700">
              <strong>주의:</strong> 단가·리워드율 변경은 새로 시작되는 주문부터 적용됩니다.
              진행 중인 주문은 기존 설정이 유지됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
