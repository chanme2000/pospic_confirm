import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PospicLogo } from "@/components/PospicLogo"

export default function UserSignup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const salesParam = searchParams.get("sales") // QR 유입 시 자동 주입 (예: SALES001)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [salesCode, setSalesCode] = useState(salesParam ?? "")
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !phone || !password) {
      toast.error("필수 항목을 모두 입력해주세요")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("가입 완료! 3,000P가 지급되었습니다", {
        description: "포인트로 사진을 무료 인쇄해보세요",
        duration: 5000,
      })
      navigate("/")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300/30 blur-3xl rounded-full" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/30 blur-3xl rounded-full" aria-hidden="true" />
      
      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <PospicLogo size="lg" subtitle="가입 즉시 3,000P 지급" />
        </div>

        <Card className="glass-card shadow-2xl border-white/60">
          <CardHeader className="pb-4">
            <CardTitle>회원가입</CardTitle>
            <CardDescription>무료로 가입하고 포인트를 받아가세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="space-y-4">
                <legend className="sr-only">회원가입 정보</legend>

                <div className="space-y-1.5">
                  <label htmlFor="signup-name" className="text-sm font-medium text-gray-700">
                    이름 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                    이메일 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                    비밀번호 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="8자 이상 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-phone" className="text-sm font-medium text-gray-700">
                    휴대폰 번호 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>

                {/* 영업코드: QR 유입 시 자동연결 표시 / 아닐 때 선택 입력 */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-sales-code" className="text-sm font-medium text-gray-700">
                    추천 영업코드
                    {!salesParam && (
                      <span className="ml-1.5 text-xs font-normal text-gray-400">(선택)</span>
                    )}
                  </label>
                  {salesParam ? (
                    <div
                      id="signup-sales-code"
                      className="flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2.5"
                      aria-label={`담당 영업사원 ${salesParam} 자동 연결됨`}
                    >
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm font-medium text-indigo-700">{salesParam}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">자동 연결</Badge>
                    </div>
                  ) : (
                    <Input
                      id="signup-sales-code"
                      type="text"
                      placeholder="영업코드를 입력하세요 (예: SALES001)"
                      value={salesCode}
                      onChange={(e) => setSalesCode(e.target.value.toUpperCase())}
                      aria-describedby="sales-code-hint"
                    />
                  )}
                  <p id="sales-code-hint" className="text-xs text-gray-400">
                    영업사원에게 받은 QR 또는 코드가 있을 때만 입력하세요
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all h-12 text-base font-bold"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "가입 중..." : "회원가입 완료"}
                </Button>
              </fieldset>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
              >
                로그인
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
