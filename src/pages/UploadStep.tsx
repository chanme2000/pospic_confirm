import { useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, Image } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/StepIndicator"
import { PospicLogo } from "@/components/PospicLogo"
import { cn } from "@/lib/utils"
import { mockSystemSettings } from "@/mocks"

interface PreviewFile {
  id: string
  url: string
  name: string
}

export default function UploadStep() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoCount, setPhotoCount] = useState<1 | 2>(2)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const maxFiles = photoCount

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = maxFiles - previews.length
    if (remaining <= 0) {
      toast.error(`최대 ${maxFiles}장까지만 업로드할 수 있습니다`)
      return
    }
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining)

    if (accepted.length < files.length) {
      toast.error("이미지 파일만 업로드할 수 있습니다")
    }

    const newPreviews = accepted.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
  }, [previews.length, maxFiles])

  function handlePhotoCountChange(count: 1 | 2) {
    setPhotoCount(count)
    // 선택 장수보다 많이 업로드된 경우 초과분 제거
    if (previews.length > count) {
      const removed = previews.slice(count)
      removed.forEach((p) => URL.revokeObjectURL(p.url))
      setPreviews((prev) => prev.slice(0, count))
    }
  }

  function removeFile(id: string) {
    setPreviews((prev) => {
      const removed = prev.find((p) => p.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function handleNext() {
    if (previews.length === 0) {
      toast.error("사진을 선택해주세요")
      return
    }
    navigate("/order/edit", { state: { previews, photoCount } })
  }

  const isMaxReached = previews.length >= maxFiles
  const price = mockSystemSettings.price_per_sheet * photoCount

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#upload-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        본문으로 바로가기
      </a>

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <PospicLogo size="sm" />
        </div>
      </header>

      <main id="upload-main" className="max-w-md mx-auto px-4 py-6">
        <StepIndicator currentStep={1} />

        <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">사진 선택</h1>
        <p className="text-sm text-gray-500 mb-6">인쇄할 장수를 먼저 고른 뒤 사진을 올려주세요</p>

        {/* 장수 선택 */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">인쇄 장수</p>
          <div
            role="group"
            aria-label="인쇄 장수 선택"
            className="grid grid-cols-2 gap-3"
          >
            {([1, 2] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handlePhotoCountChange(count)}
                aria-pressed={photoCount === count}
                className={cn(
                  "rounded-2xl border-2 px-4 py-5 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[80px]",
                  photoCount === count
                    ? "border-gray-900 bg-gray-900 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <p className={cn(
                  "text-2xl font-black leading-tight",
                  photoCount === count ? "text-white" : "text-gray-800"
                )}>
                  {count}장
                </p>
                <p className={cn(
                  "text-sm font-bold mt-1",
                  photoCount === count ? "text-gray-300" : "text-gray-400"
                )}>
                  {(mockSystemSettings.price_per_sheet * count).toLocaleString()}원
                </p>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2.5 text-right">
            장당 {mockSystemSettings.price_per_sheet.toLocaleString()}원 · 출력 후 금액의 1% 포인트 적립
          </p>
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`사진 업로드 영역. 클릭하거나 파일을 끌어다 놓으세요. ${photoCount}장 선택 가능`}
          aria-disabled={isMaxReached}
          onClick={() => !isMaxReached && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isMaxReached) {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-2xl border-2 border-dashed py-10 px-6 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            isDragging
              ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
              : isMaxReached
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 bg-white cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm",
              isMaxReached ? "bg-gray-100" : isDragging ? "bg-indigo-100" : "bg-indigo-50"
            )} aria-hidden="true">
              {isMaxReached
                ? <Image className="h-8 w-8 text-gray-400" />
                : <Upload className="h-8 w-8 text-indigo-500" />
              }
            </div>
            <div>
              <p className={cn(
                "text-base font-bold",
                isMaxReached ? "text-gray-400" : "text-gray-800"
              )}>
                {isMaxReached ? "사진 선택 완료" : "클릭하거나 파일을 끌어다 놓으세요"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                JPG, PNG, HEIC · <span className="font-semibold text-gray-600">{previews.length}/{maxFiles}장</span> 선택됨
              </p>
            </div>
          </div>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <section aria-label="선택된 사진 목록" className="mt-4">
            <div className={cn("grid gap-3", photoCount === 2 ? "grid-cols-2" : "grid-cols-1")}>
              {previews.map((preview) => (
                <div key={preview.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={preview.url}
                    alt={`선택된 사진: ${preview.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(preview.id)}
                    aria-label={`${preview.name} 사진 제거`}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <Button
          onClick={handleNext}
          className="mt-6 w-full h-13 min-h-[52px] text-base font-bold bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all"
          disabled={previews.length === 0}
          aria-label={`다음 단계: ${photoCount}장 인쇄 ${price.toLocaleString()}원 미리보기로 이동`}
        >
          미리보기 확인 ({price.toLocaleString()}원) →
        </Button>
      </main>
    </div>
  )
}
