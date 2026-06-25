import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Plus, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StepIndicator } from "@/components/StepIndicator"
import { PospicLogo } from "@/components/PospicLogo"

interface PreviewFile {
  id: string
  url: string
  name: string
}

export default function CanvasEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const previews: PreviewFile[] = location.state?.previews ?? []

  // 1장 업로드 시 동일 사진으로 2컷 채움
  const photo1 = previews[0] ?? null
  const photo2 = previews[1] ?? previews[0] ?? null

  const [captions, setCaptions] = useState(["", ""])

  function updateCaption(index: number, value: string) {
    setCaptions((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#editor-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        본문으로 바로가기
      </a>

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <PospicLogo size="sm" />
        </div>
      </header>

      <main id="editor-main" className="max-w-md mx-auto px-4 py-6">
        <StepIndicator currentStep={2} />

        <h1 className="text-xl font-bold text-gray-900 mb-1">인쇄 미리보기</h1>
        <p className="text-sm text-gray-500 mb-5">
          문구를 입력하면 폴라로이드 하단에 인쇄됩니다
        </p>

        {/* ── 6×4 출력물 미리보기 ─────────────────────────── */}
        <section aria-label="6×4 인쇄 미리보기">
          <div
            className="w-full rounded-xl overflow-hidden shadow-inner"
            style={{
              aspectRatio: "6/4",
              background: "linear-gradient(135deg, #e8e0d4 0%, #d6cdc2 100%)",
              padding: "5%",
            }}
          >
            <div className="flex h-full gap-[4%]">
              {[
                { photo: photo1, caption: captions[0], label: "컷 1" },
                { photo: photo2, caption: captions[1], label: "컷 2" },
              ].map((cut, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col bg-white rounded-sm overflow-hidden"
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12)",
                    padding: "4% 4% 0 4%",
                  }}
                  aria-label={`${cut.label} 폴라로이드`}
                >
                  {/* 사진 영역 */}
                  <div className="flex-1 overflow-hidden bg-gray-100 relative">
                    {cut.photo ? (
                      <img
                        src={cut.photo.url}
                        alt={`${cut.label} 사진`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-1 bg-gray-50">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <Plus className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="text-[10px] text-gray-300 font-medium">{cut.label}</span>
                      </div>
                    )}
                  </div>

                  {/* 폴라로이드 하단 캡션 영역 */}
                  <div
                    className="flex items-center justify-center px-1"
                    style={{ height: "22%", minHeight: "28px" }}
                  >
                    {cut.caption ? (
                      <p
                        className="text-center font-medium text-gray-700 leading-tight truncate w-full"
                        style={{ fontSize: "clamp(8px, 2.5vw, 11px)" }}
                        aria-label={`${cut.label} 캡션: ${cut.caption}`}
                      >
                        {cut.caption}
                      </p>
                    ) : (
                      <p
                        className="text-center text-gray-300 leading-tight"
                        style={{ fontSize: "clamp(7px, 2vw, 10px)" }}
                        aria-hidden="true"
                      >
                        문구를 입력하세요
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인화지 규격 안내 */}
          <p className="text-center text-xs text-gray-400 mt-2" aria-hidden="true">
            6×4 인화지 (15×10cm) · 폴라로이드 2컷
          </p>
        </section>

        {/* ── 텍스트 입력 ──────────────────────────────────── */}
        <section aria-label="폴라로이드 문구 입력" className="mt-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">폴라로이드 문구</h2>

          <div>
            <label
              htmlFor="caption-1"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              컷 1 문구
            </label>
            <Input
              id="caption-1"
              value={captions[0]}
              onChange={(e) => updateCaption(0, e.target.value)}
              placeholder="예) 2026.06.18 우리의 날 ✨"
              maxLength={20}
              aria-describedby="caption-1-hint"
            />
            <p id="caption-1-hint" className="mt-1 text-right text-xs text-gray-400">
              {captions[0].length}/20
            </p>
          </div>

          <div>
            <label
              htmlFor="caption-2"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              컷 2 문구
            </label>
            <Input
              id="caption-2"
              value={captions[1]}
              onChange={(e) => updateCaption(1, e.target.value)}
              placeholder="예) 소중한 추억 🎞️"
              maxLength={20}
              aria-describedby="caption-2-hint"
            />
            <p id="caption-2-hint" className="mt-1 text-right text-xs text-gray-400">
              {captions[1].length}/20
            </p>
          </div>
        </section>

        {/* 1장 업로드 안내 */}
        {previews.length === 1 && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs text-amber-700">
              <strong>사진 1장 업로드됨</strong> — 동일한 사진이 2컷에 자동 배치됩니다.
              서로 다른 사진 2장을 원하시면 뒤로가서 추가해주세요.
            </p>
          </div>
        )}

        {/* 인쇄 안내 */}
        <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Printer className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            인쇄 안내
          </p>
          <ul className="space-y-1" aria-label="인쇄 세부 정보">
            <li className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden="true" />
              실제 인화 크기: 6×4 인치 (15×10cm) 가로형
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden="true" />
              문구는 최대 20자, 폴라로이드 하단에 인쇄됩니다
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden="true" />
              인쇄 완료 후 이미지는 즉시 파기됩니다
            </li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={() =>
              navigate("/order/payment", { state: { previews, captions } })
            }
            className="w-full"
            aria-label="미리보기 확인 완료, 결제 단계로 이동"
          >
            이대로 결제하기 →
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
            aria-label="사진 다시 선택하러 돌아가기"
          >
            사진 다시 선택
          </Button>
        </div>
      </main>
    </div>
  )
}
