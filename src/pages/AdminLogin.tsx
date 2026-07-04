import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { PospicLogo } from "@/components/PospicLogo"

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [operatorCode, setOperatorCode] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!operatorCode || !password) {
      toast.error("운영자 코드와 비밀번호를 입력해주세요")
      return
    }
    setIsLoading(true)
    const code = operatorCode.toUpperCase().trim()
    setTimeout(() => {
      setIsLoading(false)
      if (code.startsWith("SALES")) {
        login({ name: "김영업", email: `${code}@pospic.com`, role: "SALES" })
        toast.success("영업사원 포털로 이동합니다")
        navigate("/sales-portal/dashboard")
      } else if (code.startsWith("STORE")) {
        login({ name: "점주님", email: `${code}@pospic.com`, role: "STORE_OWNER" })
        toast.success("가맹점 포털로 이동합니다")
        navigate("/store/orders")
      } else if (code.startsWith("ADMIN")) {
        login({ name: "관리자", email: `${code}@pospic.com`, role: "ADMIN" })
        toast.success("관리자 포털로 이동합니다")
        navigate("/admin/dashboard")
      } else {
        toast.error("올바르지 않은 운영자 코드입니다", {
          description: "본사에서 발급받은 SALES* · STORE* · ADMIN* 형식의 코드를 입력하세요",
        })
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <PospicLogo size="lg" variant="admin" subtitle="운영자 포털" />
        </div>

        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle>운영자 로그인</CardTitle>
            <CardDescription>영업사원·가맹점·관리자 전용</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} noValidate>
              <fieldset className="space-y-4">
                <legend className="sr-only">운영자 로그인 정보</legend>

                <div className="space-y-1.5">
                  <label htmlFor="operator-code" className="text-sm font-medium text-gray-700">
                    운영자 코드
                  </label>
                  <Input
                    id="operator-code"
                    type="text"
                    autoComplete="username"
                    placeholder="예: SALES001 · STORE001 · ADMIN001"
                    value={operatorCode}
                    onChange={(e) => setOperatorCode(e.target.value)}
                    required
                    aria-required="true"
                    aria-describedby="operator-code-hint"
                    className="font-mono tracking-wide"
                  />
                  <p id="operator-code-hint" className="text-xs text-gray-400">
                    본사에서 발급받은 운영자 코드를 입력하세요
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="operator-password" className="text-sm font-medium text-gray-700">
                    비밀번호
                  </label>
                  <Input
                    id="operator-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 bg-gray-800 hover:bg-gray-900 focus-visible:ring-gray-700"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "로그인 중..." : "운영자 로그인"}
                </Button>
              </fieldset>
            </form>

            <p className="mt-5 text-center text-xs text-gray-400">
              계정 문의는 본사 관리자에게 연락하세요
            </p>

            {/* 회원 로그인 링크 */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                일반 회원이신가요?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
                >
                  회원 로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
