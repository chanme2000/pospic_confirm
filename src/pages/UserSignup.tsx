import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PospicLogo } from "@/components/PospicLogo"

const MOCK_EXISTING = ["test@test.com", "01012345678"]

export default function UserSignup() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [emailDup, setEmailDup] = useState(false)
  const [phoneDup, setPhoneDup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function checkEmailDup() {
    setEmailDup(MOCK_EXISTING.includes(email.trim().toLowerCase()))
  }

  function checkPhoneDup() {
    setPhoneDup(MOCK_EXISTING.includes(phone.replace(/-/g, "")))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !phone || !password) {
      toast.error("필수 항목을 모두 입력해주세요")
      return
    }
    if (emailDup || phoneDup) {
      toast.error("중복 항목을 확인해주세요")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("가입 완료!", {
        description: "출력할 때마다 금액의 1%가 포인트로 적립됩니다",
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
        <div className="flex flex-col items-center mb-8">
          <PospicLogo size="lg" subtitle="출력할 때마다 1% 포인트 적립" />
        </div>

        <Card className="glass-card shadow-2xl border-white/60">
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">회원가입</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">무료로 가입하고 출력할 때마다 1% 포인트</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="space-y-4 mt-2">
                <legend className="sr-only">회원가입 정보</legend>

                <div className="space-y-1.5">
                  <label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">
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
                    className="h-11 bg-white/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">
                    이메일 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailDup(false) }}
                    onBlur={checkEmailDup}
                    required
                    aria-required="true"
                    aria-describedby={emailDup ? "email-dup-msg" : undefined}
                    aria-invalid={emailDup}
                    className={`h-11 bg-white/80 ${emailDup ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  />
                  {emailDup && (
                    <p id="email-dup-msg" className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                      이미 사용 중인 이메일입니다
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">
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
                    className="h-11 bg-white/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-phone" className="text-sm font-semibold text-gray-700">
                    휴대폰 번호 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneDup(false) }}
                    onBlur={checkPhoneDup}
                    required
                    aria-required="true"
                    aria-describedby={phoneDup ? "phone-dup-msg" : undefined}
                    aria-invalid={phoneDup}
                    className={`h-11 bg-white/80 ${phoneDup ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  />
                  {phoneDup && (
                    <p id="phone-dup-msg" className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                      이미 가입된 휴대폰 번호입니다
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 h-12 bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all text-base font-bold"
                  disabled={isLoading || emailDup || phoneDup}
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
                className="font-bold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
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
