import { Link } from "react-router-dom"
import { ChevronRight, QrCode, ImageIcon, Crop, CreditCard, Package, HelpCircle } from "lucide-react"
import { PospicLogo } from "@/components/PospicLogo"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    number: "01",
    icon: QrCode,
    title: "QR 코드 스캔",
    desc: "매장 내 QR 코드를 스마트폰 카메라로 스캔하면 바로 서비스가 시작됩니다.",
  },
  {
    number: "02",
    icon: ImageIcon,
    title: "사진 선택",
    desc: "인화할 사진을 최대 2장 선택하세요. 갤러리에서 직접 불러올 수 있습니다.",
  },
  {
    number: "03",
    icon: Crop,
    title: "2컷 편집",
    desc: "6×4인치 인화지에 사진 2컷을 배치하고 캡션을 입력하세요. (최대 20자)",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "결제",
    desc: "보유 포인트와 카드를 자유롭게 혼합 결제할 수 있습니다. 장당 1,500원.",
  },
  {
    number: "05",
    icon: Package,
    title: "출력 수령",
    desc: "결제 즉시 프린터에서 출력됩니다. 완료 알림 후 바로 수령하세요.",
  },
]

const FAQS = [
  {
    q: "포인트는 어떻게 받나요?",
    a: "회원가입 시 3,000P가 즉시 지급됩니다. 사진 2장을 무료로 인쇄할 수 있어요.",
  },
  {
    q: "비회원도 이용할 수 있나요?",
    a: "가능합니다. 포인트 혜택 없이 카드 결제만으로 이용할 수 있습니다.",
  },
  {
    q: "출력 사이즈가 어떻게 되나요?",
    a: "6×4인치(15×10cm) 가로형 폴라로이드 사이즈로 2컷이 나란히 출력됩니다.",
  },
  {
    q: "사진 데이터는 어떻게 관리되나요?",
    a: "인쇄 완료 후 24시간 이내에 서버에서 자동 삭제됩니다. 안전하게 이용하세요.",
  },
  {
    q: "포인트가 부족하면 어떻게 하나요?",
    a: "포인트와 카드를 혼합 결제할 수 있습니다. 포인트가 0이어도 카드 단독 결제 가능합니다.",
  },
  {
    q: "출력이 잘못 나왔을 때는 어떻게 하나요?",
    a: "매장 직원에게 문의하시면 환불 처리를 도와드립니다.",
  },
]

export default function Guide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 inline-flex" aria-label="홈으로 이동">
            <PospicLogo size="sm" />
          </Link>
          <span className="text-sm font-medium text-gray-500">사용 가이드</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-10 text-center" aria-label="가이드 소개">
          <h1 className="text-2xl font-bold text-gray-900">pospic 사용 가이드</h1>
          <p className="mt-2 text-sm text-gray-500">QR 코드 하나로 쉽고 빠르게 사진을 인화하세요</p>
        </section>

        {/* Steps */}
        <section aria-label="이용 순서" className="mb-12">
          <h2 className="text-base font-semibold text-gray-700 mb-5">이용 순서</h2>
          <ol className="space-y-4" role="list">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isLast = i === STEPS.length - 1
              return (
                <li key={step.number} className="relative flex gap-4">
                  {/* connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-[19px] top-10 w-px h-[calc(100%+4px)] bg-indigo-100"
                      aria-hidden="true"
                    />
                  )}
                  {/* icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 z-10" aria-hidden="true">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {/* content */}
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-semibold text-indigo-500 mb-0.5">STEP {step.number}</p>
                    <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-label="자주 묻는 질문" className="mb-10">
          <h2 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            자주 묻는 질문
          </h2>
          <dl className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-4 border border-gray-100">
                <dt className="text-sm font-semibold text-gray-900">Q. {faq.q}</dt>
                <dd className="mt-1.5 text-sm text-gray-500 leading-relaxed">A. {faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section aria-label="서비스 시작" className="flex flex-col gap-3">
          <Button asChild className="w-full" aria-label="비회원으로 즉시 인쇄 시작">
            <Link to="/order/upload">
              지금 바로 인쇄하기
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/signup">회원가입하고 3,000P 받기</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
