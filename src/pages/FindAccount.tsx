import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PospicLogo } from "@/components/PospicLogo"

type FindTab = "id" | "password"

// mock 결과
const MOCK_MASKED_EMAIL = "ho**@example.com"

export default function FindAccount() {
  const [searchParams] = useSearchParams()
  const initialTab = (searchParams.get("tab") as FindTab) ?? "id"

  const [tab, setTab] = useState<FindTab>(initialTab)
  const [isLoading, setIsLoading] = useState(false)

  // 아이디 찾기
  const [findIdName, setFindIdName] = useState("")
  const [findIdPhone, setFindIdPhone] = useState("")
  const [foundEmail, setFoundEmail] = useState<string | null>(null)

  // 비밀번호 찾기
  const [findPwEmail, setFindPwEmail] = useState("")
  const [findPwPhone, setFindPwPhone] = useState("")
  const [pwSent, setPwSent] = useState(false)

  function handleFindId(e: React.FormEvent) {
    e.preventDefault()
    if (!findIdName || !findIdPhone) {
      toast.error("이름과 휴대폰 번호를 입력해주세요")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setFoundEmail(MOCK_MASKED_EMAIL)
    }, 700)
  }

  function handleFindPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!findPwEmail || !findPwPhone) {
      toast.error("아이디와 휴대폰 번호를 입력해주세요")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setPwSent(true)
    }, 700)
  }

  function resetFindId() {
    setFoundEmail(null)
    setFindIdName("")
    setFindIdPhone("")
  }

  function resetFindPw() {
    setPwSent(false)
    setFindPwEmail("")
    setFindPwPhone("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <PospicLogo size="lg" />
        </div>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as FindTab); resetFindId(); resetFindPw() }}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="id" className="flex-1">아이디 찾기</TabsTrigger>
            <TabsTrigger value="password" className="flex-1">비밀번호 찾기</TabsTrigger>
          </TabsList>

          {/* 아이디 찾기 */}
          <TabsContent value="id">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>아이디 찾기</CardTitle>
                <CardDescription>가입 시 등록한 이름과 휴대폰 번호를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {foundEmail ? (
                  <div className="space-y-5">
                    <div className="flex flex-col items-center gap-2 py-4">
                      <CheckCircle className="h-10 w-10 text-indigo-500" aria-hidden="true" />
                      <p className="text-sm text-gray-500">회원님의 아이디는</p>
                      <p className="text-lg font-semibold text-gray-900">{foundEmail}</p>
                      <p className="text-xs text-gray-400">보안을 위해 일부가 가려져 있습니다</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to="/login">
                        <Button className="w-full">로그인하기</Button>
                      </Link>
                      <Button variant="outline" className="w-full" onClick={resetFindId}>
                        다시 찾기
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFindId} noValidate>
                    <fieldset className="space-y-4">
                      <legend className="sr-only">아이디 찾기 정보</legend>

                      <div className="space-y-1.5">
                        <label htmlFor="find-id-name" className="text-sm font-medium text-gray-700">
                          이름 <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="find-id-name"
                          type="text"
                          autoComplete="name"
                          placeholder="홍길동"
                          value={findIdName}
                          onChange={(e) => setFindIdName(e.target.value)}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="find-id-phone" className="text-sm font-medium text-gray-700">
                          휴대폰 번호 <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="find-id-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="010-0000-0000"
                          value={findIdPhone}
                          onChange={(e) => setFindIdPhone(e.target.value)}
                          required
                          aria-required="true"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={isLoading}
                        aria-busy={isLoading}
                      >
                        {isLoading ? "확인 중..." : "아이디 찾기"}
                      </Button>
                    </fieldset>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 비밀번호 찾기 */}
          <TabsContent value="password">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>비밀번호 찾기</CardTitle>
                <CardDescription>아이디와 가입 시 등록한 휴대폰 번호를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {pwSent ? (
                  <div className="space-y-5">
                    <div className="flex flex-col items-center gap-2 py-4">
                      <CheckCircle className="h-10 w-10 text-indigo-500" aria-hidden="true" />
                      <p className="text-sm text-gray-500 text-center">
                        임시 비밀번호를<br />휴대폰으로 발송했습니다
                      </p>
                      <p className="text-xs text-gray-400">로그인 후 비밀번호를 변경해주세요</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to="/login">
                        <Button className="w-full">로그인하기</Button>
                      </Link>
                      <Button variant="outline" className="w-full" onClick={resetFindPw}>
                        다시 찾기
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFindPassword} noValidate>
                    <fieldset className="space-y-4">
                      <legend className="sr-only">비밀번호 찾기 정보</legend>

                      <div className="space-y-1.5">
                        <label htmlFor="find-pw-email" className="text-sm font-medium text-gray-700">
                          아이디 (이메일) <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="find-pw-email"
                          type="email"
                          autoComplete="email"
                          placeholder="name@example.com"
                          value={findPwEmail}
                          onChange={(e) => setFindPwEmail(e.target.value)}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="find-pw-phone" className="text-sm font-medium text-gray-700">
                          휴대폰 번호 <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="find-pw-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="010-0000-0000"
                          value={findPwPhone}
                          onChange={(e) => setFindPwPhone(e.target.value)}
                          required
                          aria-required="true"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={isLoading}
                        aria-busy={isLoading}
                      >
                        {isLoading ? "확인 중..." : "임시 비밀번호 받기"}
                      </Button>
                    </fieldset>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
