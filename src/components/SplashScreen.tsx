import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2500)
    const completeTimer = setTimeout(() => onComplete(), 3000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-opacity duration-500 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{
        backgroundImage: "url(/back_qr.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden="true"
    >
      {/* 글래스 + 라임 컬러 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgb(196, 232, 0)"
        }}
      />

      {/* 콘텐츠 영역 */}
      <div className="relative flex flex-col h-full">

        {/* 상단 로고 + 메인 이미지 */}
        <div className="flex flex-col flex-1 max-w-sm mx-auto w-full">
          <div className="flex-1 flex items-center justify-center pt-16">
            <img
              src="/main_polaroid.png"
              alt="QR Printing Service"
              className="w-full block"
            />
          </div>

          <div className="flex justify-center pt-14">
            <img
              src="/small_logo.png"
              alt="pospic"
              className="h-10 object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))" }}
            />
          </div>
        </div>

        {/* 하단 푸터 — 전체 폭 */}
        <div
          className="w-full pt-14 pb-24 text-center"
        >
          <p className="text-gray-500 text-xs tracking-wide">
            Copyright&copy; All Rights Reserved Co.,Ltd.
          </p>
        </div>
      </div>
    </div>
  )
}
