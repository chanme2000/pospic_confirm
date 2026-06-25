import { useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, Image, Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/StepIndicator"
import { PospicLogo } from "@/components/PospicLogo"
import { cn } from "@/lib/utils"

interface PreviewFile {
  id: string
  url: string
  name: string
}

const MAX_FILES = 2

export default function UploadStep() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = MAX_FILES - previews.length
    if (remaining <= 0) {
      toast.error(`최대 ${MAX_FILES}장까지만 업로드할 수 있습니다`)
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
  }, [previews.length])

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
      toast.error("사진을 1장 이상 선택해주세요")
      return
    }
    navigate("/order/edit", { state: { previews } })
  }

  const isMaxReached = previews.length >= MAX_FILES

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

        <h1 className="text-xl font-bold text-gray-900 mb-1">사진 선택</h1>
        <p className="text-sm text-gray-500 mb-6">인쇄할 사진을 최대 2장 선택하세요</p>

        {/* Guest welcome bonus notice */}
        <div
          aria-label="가입 혜택 안내"
          className="mb-5 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 flex items-center gap-3"
        >
          <Star className="h-5 w-5 text-indigo-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-indigo-700">
            <strong>지금 가입하면 3,000P로 무료 인쇄 가능!</strong>
            <br />
            <span className="text-xs text-indigo-500">포인트로 카드 결제 없이 인쇄하세요</span>
          </p>
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="사진 업로드 영역. 클릭하거나 파일을 끌어다 놓으세요"
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
            "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            isDragging
              ? "border-indigo-400 bg-indigo-50"
              : isMaxReached
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 bg-white cursor-pointer hover:border-indigo-400 hover:bg-indigo-50"
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
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              isMaxReached ? "bg-gray-100" : "bg-indigo-50"
            )} aria-hidden="true">
              {isMaxReached
                ? <Image className="h-7 w-7 text-gray-400" />
                : <Upload className="h-7 w-7 text-indigo-500" />
              }
            </div>
            <div>
              <p className={cn(
                "text-sm font-semibold",
                isMaxReached ? "text-gray-400" : "text-gray-700"
              )}>
                {isMaxReached ? "최대 장수에 도달했습니다" : "클릭하거나 파일을 끌어다 놓으세요"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                JPG, PNG, HEIC · 최대 2장 · {previews.length}/{MAX_FILES}장 선택됨
              </p>
            </div>
          </div>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <section aria-label="선택된 사진 목록" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
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
          className="mt-6 w-full"
          disabled={previews.length === 0}
          aria-label="다음 단계: 인쇄 미리보기로 이동"
        >
          미리보기 확인 →
        </Button>
      </main>
    </div>
  )
}
