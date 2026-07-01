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

      <main id="main-content" className="max-w-md mx-auto px-4 py-6">
        {/* Print reward banner */}
        <section
          aria-label="포인트 적립 안내"
          className="mb-8 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-500 px-5 py-5 text-white shadow-lg shadow-primary-500/30 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out origin-center" aria-hidden="true" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" aria-hidden="true">
              <Star className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <p className="text-base font-bold">출력할 때마다 포인트 적립!</p>
              <p className="text-xs text-indigo-100 mt-0.5">회원은 출력 금액의 1%를 포인트로 돌려받아요</p>
            </div>
          </div>
        </section>

        {/* Service cards */}
        <div className="flex flex-col gap-5 animate-fade-in-up">
          {/* Guest quick start */}
          <Card className="glass-card border-2 border-primary-100 hover:border-primary-300 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center shadow-sm" aria-hidden="true">
                  <Zap className="h-7 w-7 text-primary-600 animate-pulse-soft" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-extrabold text-gray-900">비회원 빠른 시작</h2>
                  <p className="text-sm text-gray-500 mt-1">가입 없이 바로 사진을 인쇄하세요</p>
                  <Button
                    asChild
                    className="mt-5 w-full bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all"
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

          {/* Member service */}
          <Card className="glass-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-white/80 border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm" aria-hidden="true">
                  <UserCircle className="h-7 w-7 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-extrabold text-gray-900">회원 서비스</h2>
                  <p className="text-sm text-gray-500 mt-1">포인트로 더 저렴하게 인쇄하세요</p>
                  <div className="mt-5 flex gap-3">
                    <Button asChild variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50 hover:text-primary-600 transition-colors shadow-sm" aria-label="로그인 페이지로 이동">
                      <Link to="/login">로그인</Link>
                    </Button>
                    <Button asChild className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-md hover:shadow-lg transition-all" aria-label="회원가입 페이지로 이동">
                      <Link to="/signup">회원가입</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          비회원도 출력 가능 · 회원은 포인트 적립 혜택 제공
        </p>

        {/* Admin shortcut */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/admin/login"
            className="text-xs text-gray-300 hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1 transition-colors"
            aria-label="운영자 로그인 페이지로 이동"
          >
            운영자 로그인
          </Link>
        </div>
      </main>
    </div>
  )
}
