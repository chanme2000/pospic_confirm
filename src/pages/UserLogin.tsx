import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { PospicLogo } from "@/components/PospicLogo"

export default function UserLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState("") // 이메일 또는 휴대폰 번호
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier || !password) {
      toast.error("이메일(또는 휴대폰)과 비밀번호를 입력해주세요")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      login({ name: "홍길동", email: identifier, role: "USER" })
      toast.success("로그인되었습니다")
      navigate("/")
    }, 600)
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-primary-300/20 blur-3xl rounded-full" aria-hidden="true" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-3xl rounded-full" aria-hidden="true" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <PospicLogo size="lg" subtitle="QR 포토 프린팅 서비스" />
        </div>

        <Card className="glass-card shadow-2xl border-white/60">
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">로그인</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">이메일 또는 휴대폰 번호로 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} noValidate>
              <fieldset className="space-y-4 mt-2">
                <legend className="sr-only">회원 로그인 정보</legend>

                <div className="space-y-1.5">
                  <label htmlFor="login-identifier" className="text-sm font-semibold text-gray-700">
                    이메일 또는 휴대폰 번호
                  </label>
                  <Input
                    id="login-identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="name@example.com 또는 010-0000-0000"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    aria-required="true"
                    className="h-11 bg-white/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">
                    비밀번호
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    className="h-11 bg-white/80"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-2 text-base font-bold bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </fieldset>
            </form>

            {/* 아이디·비밀번호 찾기 */}
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
              <Link
                to="/find-account?tab=id"
                className="hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm transition-colors"
              >
                아이디 찾기
              </Link>
              <span aria-hidden="true" className="text-gray-200">|</span>
              <Link
                to="/find-account?tab=password"
                className="hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm transition-colors"
              >
                비밀번호 찾기
              </Link>
            </div>

            {/* 회원가입 링크 */}
            <p className="mt-5 text-center text-sm text-gray-500">
              계정이 없으신가요?{" "}
              <Link
                to="/signup"
                className="font-bold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
              >
                회원가입
              </Link>
            </p>

            {/* 운영자 로그인 구분선 */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                영업사원·가맹점·관리자이신가요?{" "}
                <Link
                  to="/admin/login"
                  className="font-medium text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
                >
                  운영자 로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
