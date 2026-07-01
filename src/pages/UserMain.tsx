import { Link, useNavigate } from "react-router-dom"
import { Zap, Star, ChevronRight, UserCircle } from "lucide-react"
import { PospicLogo } from "@/components/PospicLogo"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export default function UserMain() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success("로그아웃되었습니다")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-mesh text-gray-900">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        본문으로 바로가기
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <PospicLogo size="sm" />
          <nav aria-label="계정 메뉴" className="flex items-center gap-4">
            <Link
              to="/guide"
              className="text-sm text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
            >
              사용 가이드
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/mypage"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="max-w-md mx-auto px-4 py-8">
        {/* Hero banner */}
        <section
          aria-label="포인트 적립 안내"
          className="mb-8 rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-500 px-6 py-7 text-white shadow-xl shadow-primary-600/25 relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" aria-hidden="true" />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white/5 rounded-full" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Star className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              <span className="text-xs font-semibold text-indigo-200 tracking-widest uppercase">Member Benefit</span>
            </div>
            <p className="text-xl font-black leading-tight tracking-tight">출력할 때마다<br/>포인트 적립!</p>
            <p className="text-sm text-indigo-100 mt-2 font-medium">출력 금액의 1%를 자동으로 돌려받아요</p>
          </div>
        </section>

        {/* Service cards */}
        <div className="flex flex-col gap-4 animate-fade-in-up">
          {/* Guest quick start — Primary CTA */}
          <Card className="glass-card shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-md" aria-hidden="true">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Quick Start</p>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">비회원 즉시 인쇄</h2>
                  <p className="text-sm text-gray-500 mt-1 mb-5">가입 없이 지금 바로 사진을 인쇄하세요</p>
                  <Button
                    asChild
                    className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
                    aria-label="비회원으로 즉시 인쇄 시작"
                  >
                    <Link to="/order/upload">
                      즉시 인쇄하기
                      <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member service — Secondary */}
          <Card className="bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center" aria-hidden="true">
                  <UserCircle className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary-400 tracking-widest uppercase mb-1">Member</p>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">회원 서비스</h2>
                  <p className="text-sm text-gray-500 mt-1 mb-5">포인트 적립으로 더 저렴하게 인쇄하세요</p>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1 h-11 border-gray-200 hover:border-primary-300 hover:text-primary-600 font-semibold transition-colors" aria-label="로그인 페이지로 이동">
                      <Link to="/login">로그인</Link>
                    </Button>
                    <Button asChild className="flex-1 h-11 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-sm hover:shadow-md transition-all" aria-label="회원가입 페이지로 이동">
                      <Link to="/signup">회원가입</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          비회원도 출력 가능 · 회원은 출력 금액 1% 포인트 적립
        </p>

        {/* Admin shortcut */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/admin/login"
            className="text-xs text-gray-300 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1 transition-colors"
            aria-label="운영자 로그인 페이지로 이동"
          >
            운영자 로그인
          </Link>
        </div>
      </main>
    </div>
  )
}
