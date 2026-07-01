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
    title: "장수 선택 & 사진 업로드",
    desc: "1장(500원) 또는 2장(1,000원)을 선택한 뒤, 갤러리에서 사진을 불러오세요.",
  },
  {
    number: "03",
    icon: Crop,
    title: "편집",
    desc: "6×4인치 인화지에 선택한 사진을 배치하고 캡션을 입력하세요. (최대 20자)",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "결제",
    desc: "보유 포인트와 카드를 자유롭게 혼합 결제할 수 있습니다. 회원은 출력 후 금액의 1%가 포인트로 적립됩니다.",
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
    a: "출력할 때마다 출력 금액의 1%가 자동으로 적립됩니다. 회원가입만 하면 혜택을 받을 수 있어요.",
  },
  {
    q: "비회원도 이용할 수 있나요?",
    a: "가능합니다. 가입 없이 카드 결제만으로 이용할 수 있습니다. 단, 포인트 적립은 회원만 제공됩니다.",
  },
  {
    q: "출력 사이즈와 장수는 어떻게 되나요?",
    a: "6×4인치(15×10cm) 가로형 폴라로이드 사이즈입니다. 1장(단독 컷) 또는 2장(나란히 2컷) 중 선택하세요.",
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
        <section className="mb-10" aria-label="가이드 소개">
          <p className="text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-2">How It Works</p>
          <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">pospic<br/>사용 가이드</h1>
          <p className="mt-3 text-base text-gray-500 leading-relaxed">QR 코드 하나로 쉽고 빠르게<br/>사진을 인화하세요</p>
        </section>

        {/* Steps */}
        <section aria-label="이용 순서" className="mb-12">
          <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6">이용 순서</h2>
          <ol className="space-y-0" role="list">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isLast = i === STEPS.length - 1
              return (
                <li key={step.number} className="relative flex gap-4">
                  {/* connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-[19px] top-11 w-0.5 h-[calc(100%-8px)] bg-gradient-to-b from-indigo-200 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                  {/* icon badge */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 z-10" aria-hidden="true">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  {/* content */}
                  <div className="flex-1 pb-8">
                    <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mb-1">STEP {step.number}</p>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-label="자주 묻는 질문" className="mb-10">
          <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            자주 묻는 질문
          </h2>
          <dl className="space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-5 shadow-sm border-0 hover:shadow-md transition-shadow duration-200">
                <dt className="text-sm font-bold text-gray-900 leading-snug">{faq.q}</dt>
                <dd className="mt-2 text-sm text-gray-500 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section aria-label="서비스 시작" className="flex flex-col gap-3 pb-8">
          <Button asChild className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all" aria-label="비회원으로 즉시 인쇄 시작">
            <Link to="/order/upload">
              지금 바로 인쇄하기
              <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-11 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 font-semibold transition-colors">
            <Link to="/signup">회원가입하고 포인트 적립하기</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
