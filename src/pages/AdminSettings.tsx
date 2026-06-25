import { useState } from "react"
import { toast } from "sonner"
import { Save, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockSystemSettings } from "@/mocks"

export default function AdminSettings() {
  const [pricePerSheet, setPricePerSheet] = useState(
    mockSystemSettings.price_per_sheet
  )

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("설정이 저장되었습니다", {
      description: `장당 단가: ${pricePerSheet.toLocaleString()}원`,
    })
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(0, Number(e.target.value) || 0)
    setPricePerSheet(val)
  }

  const preview2sheets = pricePerSheet * 2

  return (
    <section aria-labelledby="settings-heading">
      <h2 id="settings-heading" className="text-xl font-bold text-gray-900 mb-6">
        시스템 설정
      </h2>

      <div className="max-w-lg space-y-4">
        {/* Pricing card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">인화 단가 설정</CardTitle>
            <CardDescription>장당 인화 단가를 설정합니다. 변경 즉시 결제 화면에 반영됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <fieldset>
                <legend className="sr-only">인화 단가</legend>

                <div className="space-y-1.5 mb-4">
                  <label
                    htmlFor="price-per-sheet"
                    className="text-sm font-medium text-gray-700"
                  >
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
                    <span
                      className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400 pointer-events-none"
                      aria-hidden="true"
                    >
                      원
                    </span>
                  </div>
                </div>

                {/* Live preview */}
                <div
                  id="price-preview"
                  className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 mb-5"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                    <p className="text-sm font-semibold text-indigo-700">예상 금액 미리보기</p>
                  </div>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-indigo-600">1장 인화 시</dt>
                      <dd className="font-semibold text-indigo-700" aria-label={`1장 인화 금액 ${pricePerSheet.toLocaleString()}원`}>
                        {pricePerSheet.toLocaleString()}원
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-indigo-600">2장 인화 시</dt>
                      <dd className="font-bold text-indigo-800 text-base" aria-label={`2장 인화 금액 ${preview2sheets.toLocaleString()}원`}>
                        {preview2sheets.toLocaleString()}원
                      </dd>
                    </div>
                  </dl>
                </div>

                <Button type="submit" className="w-full" aria-label="설정 저장">
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
              <strong>주의:</strong> 단가 변경은 새로 시작되는 주문부터 적용됩니다.
              진행 중인 주문은 기존 단가가 유지됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
