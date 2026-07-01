import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  Compass, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  ChevronRight, 
  FileText, 
  Undo2,
  PenTool,
  RotateCcw,
  Sparkles,
  Database,
  RefreshCw,
  Eye
} from "lucide-react"
import { toast } from "sonner"

interface ChecklistItem {
  id: number
  section: string
  question: string
  howTo: string
  status: "PENDING" | "PASS" | "FAIL"
  feedback: string
}

interface UnconfirmedPolicy {
  id: string
  title: string
  optionA: string
  optionB: string
  selected: "A" | "B" | null
}

interface SavedFeedback {
  items: { id: number; status: "PENDING" | "PASS" | "FAIL"; feedback: string }[]
  policies: { id: string; selected: "A" | "B" | null }[]
  approval: "APPROVE" | "REJECT" | null
  generalFeedback: string
  reviewerName: string
  signatureType: "text" | "pad"
  textSignature: string
  signatureImage: string | null
  savedAt: string
}

const LOCAL_STORAGE_KEY = "pospic_confirm_feedback"

const initialItems: ChecklistItem[] = [
  // [A] 회원 주문 플로우
  { id: 1,  section: "A", question: '홈 화면 레이아웃 — "비회원 빠른 시작"과 "회원 로그인/가입" 카드 구성', howTo: "홈 화면('/')", status: "PENDING", feedback: "" },
  { id: 2,  section: "A", question: "로그인 전/후 헤더 전환 — 로그인 후 마이페이지·로그아웃 표시", howTo: "로그인 후 홈 화면", status: "PENDING", feedback: "" },
  { id: 3,  section: "A", question: "이미지 업로드 → 2컷 편집 → 결제 3단계 흐름", howTo: "홈 → [즉시 인쇄하기]", status: "PENDING", feedback: "" },
  { id: 4,  section: "A", question: "포인트 혼합 결제 UI — 슬라이더 + 직접 입력 방식", howTo: "결제 화면('/order/payment')", status: "PENDING", feedback: "" },
  { id: 5,  section: "A", question: "전액 포인트 결제 시 UI — 카드 결제 0원 표시 방식", howTo: "결제 화면 → 슬라이더 최대로 설정", status: "PENDING", feedback: "" },
  { id: 6,  section: "A", question: "결제 화면에 영업 리워드 안내 없음 확인 ★v3.0 수정 — 노출 제거", howTo: "결제 화면('/order/payment') 전체 스크롤 확인", status: "PENDING", feedback: "" },
  { id: 7,  section: "A", question: "주문 완료 화면 메시지 및 버튼 구성", howTo: "결제 → [결제하기] 클릭", status: "PENDING", feedback: "" },

  // [B] 회원 가입·계정 관리
  { id: 8,  section: "B", question: "사용 가이드 페이지 — 5단계 설명 + FAQ 구성", howTo: "헤더 → [사용 가이드] 클릭", status: "PENDING", feedback: "" },
  { id: 9,  section: "B", question: "회원가입 폼 — 이름·이메일·비밀번호·휴대폰 4필드 (영업코드 없음) + 이메일·전화번호 중복 방지 ★v3.0 수정", howTo: "[회원가입] 버튼 클릭", status: "PENDING", feedback: "" },
  { id: 10, section: "B", question: "로그인 2원화 구조 — 회원용('/login') / 운영자용('/admin/login') 분리 화면", howTo: "두 로그인 화면 비교", status: "PENDING", feedback: "" },
  { id: 11, section: "B", question: "아이디·비밀번호 찾기 화면 흐름 및 결과 표시 방식", howTo: "로그인 화면 → 아이디 찾기", status: "PENDING", feedback: "" },
  { id: 12, section: "B", question: "마이페이지 — 포인트 잔액 + 포인트 내역 + 주문 내역 탭 구성", howTo: "로그인 후 [마이페이지]", status: "PENDING", feedback: "" },
  { id: 28, section: "B", question: "비회원 주문번호 조회 화면 — 주문번호 입력 → 출력 상태 표시 ★v3.1 신규", howTo: "DemoNavigator → [비회원 주문 조회]  데모번호: ORD-20260618-001", status: "PENDING", feedback: "" },

  // [C] 어드민 포털 (본사)
  { id: 13, section: "C", question: "주문 현황판 — 주문 목록 테이블 및 상태 뱃지 레이아웃", howTo: "어드민 로그인 → 주문 현황판", status: "PENDING", feedback: "" },
  { id: 14, section: "C", question: "포인트 원장 — 회원 포인트 탭 / 영업 리워드 탭 구분 및 '미회수🔴' 표시", howTo: "어드민 → 포인트 원장", status: "PENDING", feedback: "" },
  { id: 15, section: "C", question: "영업사원 관리 — QR 미리보기(어드민 전용 배지) + PNG 다운로드 + QR 재생성 버튼 ★v3.0 수정", howTo: "어드민 → 영업사원 관리 → QR 버튼 클릭", status: "PENDING", feedback: "" },
  { id: 16, section: "C", question: "가맹점 관리 — 테이블 수 표시 + 입장 QR 다운로드 + 테이블 QR ZIP + QR 재생성 ★v3.0 수정", howTo: "어드민 → 가맹점 관리 → QR 코드 관리 영역 확인", status: "PENDING", feedback: "" },
  { id: 29, section: "C", question: "시스템 설정 — 단가 카드 + 영업 리워드율(%) 카드 + 포인트 유효기간 카드 ★v3.1 신규", howTo: "어드민 → 시스템 설정 → 카드 3개 확인", status: "PENDING", feedback: "" },

  // [D] 점주 포털
  { id: 17, section: "D", question: "오늘 출력현황 — 통계 카드 + 주문 목록 레이아웃", howTo: "STORE001 로그인", status: "PENDING", feedback: "" },
  { id: 30, section: "D", question: "매출 내역 — 1·2·3개월 기간 선택 + 월별 매출·주문 수·카드 결제액 ★v3.1 신규", howTo: "STORE001 로그인 → 사이드바 [매출 내역]", status: "PENDING", feedback: "" },

  // [E] 영업사원 포털
  { id: 18, section: "E", question: "매출 대시보드 — 담당 가맹점 수, 리워드 잔액, 누적 리워드 카드 ★v3.0 수정: '연결 회원 → 담당 가맹점'", howTo: "SALES001 로그인", status: "PENDING", feedback: "" },
  { id: 19, section: "E", question: "리워드 내역 — 적립/회수 내역 목록 및 상태 뱃지", howTo: "영업사원 포털 → 리워드 내역", status: "PENDING", feedback: "" },

  // [F] 공통 디자인
  { id: 20, section: "F", question: "전체 색상 테마 및 폰트 느낌 (브랜드 이미지와 부합 여부)", howTo: "전체 화면 탐색", status: "PENDING", feedback: "" },
  { id: 21, section: "F", question: "모바일에서의 사용성 — 버튼 크기, 글자 크기, 레이아웃", howTo: "스마트폰으로 접속 테스트", status: "PENDING", feedback: "" },

  // [G] 정책 확인
  { id: 22, section: "G", question: "가입 즉시 포인트 지급 없음 확인 ★v3.2 수정 — 3,000P 웰컴 보너스 폐지", howTo: "가입 완료 화면 + 마이페이지 잔액 확인 (잔액 0P)", status: "PENDING", feedback: "" },
  { id: 23, section: "G", question: "리워드 계산 정책 — 카드 결제액의 1%, 전액 포인트 결제 시 0P ★v3.0 수정: 10% → 1%", howTo: "어드민 시스템 설정 → 리워드율 카드 확인", status: "PENDING", feedback: "" },
  { id: 33, section: "G", question: "출력 적립 포인트 확인 — 출력 금액의 1% 자동 적립, 결제·완료 화면 적립 안내 표시 ★v3.2 신규", howTo: "결제 화면 → 선물 아이콘 적립 안내 확인 → 완료 화면 → '적립 완료' 메시지 확인", status: "PENDING", feedback: "" },
  { id: 34, section: "G", question: "사진 1장/2장 선택 UI — UploadStep 상단 버튼 + 선택에 따른 가격 표시 ★v3.2 신규", howTo: "업로드 화면('/order/upload') → 1장(500원)/2장(1,000원) 버튼 확인", status: "PENDING", feedback: "" },
  { id: 35, section: "G", question: "기본 단가 500원 확인 — 결제 화면 금액 표시 ★v3.2 수정: 1,500원 → 500원", howTo: "업로드에서 2장 선택 → 결제 화면 1,000원 표시 확인", status: "PENDING", feedback: "" },

  // [H] 권한·보안 UX 확인
  { id: 24, section: "H", question: "잘못된 운영자 코드 입력 시 에러 처리", howTo: "'/admin/login' → 'ABC123' 입력 → 에러 메시지 확인", status: "PENDING", feedback: "" },
  { id: 25, section: "H", question: "역할 접근 차단 — 권한 없는 페이지 직접 접근 시 로그인 화면 이동", howTo: "SALES001 로그인 후 주소창에 '/admin/orders' 직접 입력", status: "PENDING", feedback: "" },
  { id: 26, section: "H", question: "점주 환불 처리 기능 확인 — 출력완료 주문에 [환불] 버튼 노출 ★v3.2 수정", howTo: "STORE001 포털 → 출력현황 → PRINT_SUCCESS 주문 → [환불] 버튼 클릭", status: "PENDING", feedback: "" },
  { id: 27, section: "H", question: "엑셀 다운로드 범위 확인 — 어드민 원장만 제공, 점주·영업사원 미제공", howTo: "어드민 포인트 원장 → [엑셀 내보내기] (Phase 0: 준비중)", status: "PENDING", feedback: "" },
  { id: 31, section: "H", question: "QR 코드 생성·관리 어드민 전용 확인 — 영업사원·점주 포털에서 QR 생성 불가 ★v3.0 정책", howTo: "영업사원·점주 포털 전체 탐색 후 QR 생성 메뉴 없음 확인", status: "PENDING", feedback: "" },
  { id: 32, section: "H", question: "회원가입 중복 방지 — 기존 이메일 입력 시 인라인 에러 표시 확인 ★v3.0 신규", howTo: "회원가입 → test@test.com 입력 후 다른 필드 클릭", status: "PENDING", feedback: "" },
]

// v3.0에서 클라이언트 컨펌 완료 — 확정된 선택지가 pre-populated
const initialPolicies: UnconfirmedPolicy[] = [
  { id: "23-1", title: "점주 포털 기능 범위", optionA: "MVP: 오늘 현황만 제공", optionB: "기간별 매출 통계 추가 제공", selected: "B" },
  { id: "23-2", title: "영업사원 리워드 출금 방식", optionA: "관리자가 수동 처리", optionB: "자동 계좌이체 (Phase 2)", selected: "A" },
  { id: "23-3", title: "포인트 유효기간", optionA: "무제한", optionB: "가입 후 N개월 제한", selected: "A" },
  { id: "23-4", title: "비회원 주문 내역 조회", optionA: "제공 안 함", optionB: "주문번호로 조회 가능", selected: "B" },
  { id: "23-5", title: "매장별 단가 차등", optionA: "전국 단일가 정책", optionB: "매장별 차등 설정 가능", selected: "B" },
  { id: "23-6", title: "환불 처리 권한 (v3.2 업데이트)", optionA: "관리자 + 점주 모두 처리 가능", optionB: "관리자만 처리", selected: "A" },
]

export default function ConfirmGuide() {
  const [resetKey, setResetKey] = useState(0)

  // React 상태 정의
  const [items, setItems] = useState<ChecklistItem[]>(JSON.parse(JSON.stringify(initialItems)))
  const [policies, setPolicies] = useState<UnconfirmedPolicy[]>(JSON.parse(JSON.stringify(initialPolicies)))
  const [approval, setApproval] = useState<"APPROVE" | "REJECT" | null>(null)
  const [generalFeedback, setGeneralFeedback] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [signatureType, setSignatureType] = useState<"text" | "pad">("text")
  const [textSignature, setTextSignature] = useState("")
  const [signatureImage, setSignatureImage] = useState<string | null>(null)

  // LocalStorage에 보존된 최종 결과 데이터 상태
  const [savedData, setSavedData] = useState<SavedFeedback | null>(null)

  // 서명 캔버스 레프
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // 1. 컴포넌트 마운트 시 LocalStorage에서 데이터 불러오기 (자동 복구)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SavedFeedback
        setSavedData(parsed)

        // 각 상태 복구
        if (parsed.items) {
          // 기본 템플릿 항목에 덮어쓰기 방식으로 복구 (신규 항목 누락 방지)
          setItems(prev => prev.map(item => {
            const matched = parsed.items.find(pi => pi.id === item.id)
            return matched ? { ...item, status: matched.status, feedback: matched.feedback } : item
          }))
        }
        if (parsed.policies) {
          setPolicies(prev => prev.map(p => {
            const matched = parsed.policies.find(pp => pp.id === p.id)
            return matched ? { ...p, selected: matched.selected } : p
          }))
        }
        if (parsed.approval !== undefined) setApproval(parsed.approval)
        if (parsed.generalFeedback !== undefined) setGeneralFeedback(parsed.generalFeedback)
        if (parsed.reviewerName !== undefined) setReviewerName(parsed.reviewerName)
        if (parsed.signatureType !== undefined) setSignatureType(parsed.signatureType)
        if (parsed.textSignature !== undefined) setTextSignature(parsed.textSignature)
        if (parsed.signatureImage !== undefined) setSignatureImage(parsed.signatureImage)
      }
    } catch (e) {
      console.error("LocalStorage 로드 중 에러 발생:", e)
    }
  }, [])

  // 캔버스 초기 설정
  useEffect(() => {
    if (signatureType === "pad" && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#312e81" // indigo-900
        ctx.lineWidth = 3
        ctx.lineCap = "round"
      }

      // 이미 저장된 서명이 있고 캔버스가 존재할 때 복구
      if (signatureImage) {
        const img = new Image()
        img.onload = () => {
          ctx?.drawImage(img, 0, 0)
        }
        img.src = signatureImage
      }
    }
  }, [signatureType, signatureImage])

  // 캔버스 드로잉 좌표 보정 및 터치 지원
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    setIsDrawing(true)
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const rect = canvasRef.current.getBoundingClientRect()
    let x = 0
    let y = 0
    
    if ("touches" in e.nativeEvent) {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>
      x = touchEvent.touches[0].clientX - rect.left
      y = touchEvent.touches[0].clientY - rect.top
    } else {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>
      x = mouseEvent.clientX - rect.left
      y = mouseEvent.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const rect = canvasRef.current.getBoundingClientRect()
    let x = 0
    let y = 0

    if ("touches" in e.nativeEvent) {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>
      if (touchEvent.touches && touchEvent.touches.length > 0) {
        x = touchEvent.touches[0].clientX - rect.left
        y = touchEvent.touches[0].clientY - rect.top
      } else {
        return
      }
    } else {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>
      x = mouseEvent.clientX - rect.left
      y = mouseEvent.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    saveCanvasSignature()
  }

  const clearCanvas = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setSignatureImage(null)
  }

  const saveCanvasSignature = () => {
    if (!canvasRef.current) return
    const dataUrl = canvasRef.current.toDataURL()
    setSignatureImage(dataUrl)
  }

  // 체크리스트 진행도 계산
  const completedCount = items.filter(item => item.status !== "PENDING").length
  const progressPercent = Math.round((completedCount / items.length) * 100)

  // 상태 핸들러
  const handleStatusChange = (id: number, status: "PENDING" | "PASS" | "FAIL") => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item))
  }

  const handleFeedbackChange = (id: number, feedback: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, feedback } : item))
  }

  const handlePolicyChange = (id: string, selected: "A" | "B") => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, selected } : p))
  }

  // 2. LocalStorage에 데이터 영구 저장하기
  const handleSaveToLocalStorage = () => {
    if (!reviewerName.trim()) {
      toast.error("검토자 성명을 기재해 주세요.")
      return
    }
    if (!approval) {
      toast.error("최종 승인 여부를 선택해 주세요.")
      return
    }

    const payload: SavedFeedback = {
      items: items.map(i => ({ id: i.id, status: i.status, feedback: i.feedback })),
      policies: policies.map(p => ({ id: p.id, selected: p.selected })),
      approval,
      generalFeedback,
      reviewerName,
      signatureType,
      textSignature,
      signatureImage,
      savedAt: new Date().toISOString()
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
      setSavedData(payload)
      toast.success("컨펌 피드백 결과가 브라우저(LocalStorage)에 안전하게 저장되었습니다! 하단에서 결과를 확인할 수 있습니다.")
    } catch (e) {
      console.error(e)
      toast.error("LocalStorage 저장에 실패했습니다. 브라우저 용량이나 설정을 확인해 주세요.")
    }
  }

  // 3. LocalStorage 데이터 및 화면 상태 전체 초기화(리셋)
  const handleResetFeedback = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setItems(JSON.parse(JSON.stringify(initialItems)))
    setPolicies(JSON.parse(JSON.stringify(initialPolicies)))
    setApproval(null)
    setGeneralFeedback("")
    setReviewerName("")
    setSignatureType("text")
    setTextSignature("")
    setSignatureImage(null)
    setSavedData(null)
    clearCanvas()
    
    // key 값을 증가시켜 컴포넌트 강제 리마운트(완전 리셋) 유도
    setResetKey(prev => prev + 1)
    
    toast.success("모든 피드백 데이터가 완전히 초기화되었습니다.")
  }

  // 4. 저장된 내용을 복사 가능한 텍스트 포맷으로 요약 빌드
  const generateSummaryText = (data: SavedFeedback): string => {
    const todayStr = data.savedAt.split("T")[0]
    let text = `[pospic Phase 0 컨펌 피드백 요약]\n`
    text += `- 검토자: ${data.reviewerName}\n`
    text += `- 검토일자: ${todayStr}\n`
    text += `- 최종결과: ${data.approval === "APPROVE" ? "✔ 승인 (Phase 1 착수 동의)" : "❌ 수정 후 재검토 요청"}\n`
    
    if (data.generalFeedback.trim()) {
      text += `- 총평 의견: ${data.generalFeedback}\n`
    }
    
    text += `\n[미확정 정책 선택]\n`
    data.policies.forEach(p => {
      const origPolicy = policies.find(op => op.id === p.id)
      const selectedOpt = p.selected === "A" ? `Option A (${origPolicy?.optionA})` : p.selected === "B" ? `Option B (${origPolicy?.optionB})` : "선택 안 함"
      text += `- ${p.id} ${origPolicy?.title}: ${selectedOpt}\n`
    })

    const failItems = items.filter(i => {
      const matched = data.items.find(pi => pi.id === i.id)
      return matched?.status === "FAIL"
    })

    text += `\n[수정 요청 항목 목록 (총 ${failItems.length}건)]\n`
    if (failItems.length > 0) {
      failItems.forEach(fi => {
        const matched = data.items.find(pi => pi.id === fi.id)
        text += `- #${fi.id} ${fi.question}\n  -> 요구사항: ${matched?.feedback || "(의견 미입력)"}\n`
      })
    } else {
      text += `- 수정 요청 항목이 없습니다.\n`
    }

    return text
  }

  const [copied, setCopied] = useState(false)
  const copySummaryText = () => {
    if (!savedData) return
    const text = generateSummaryText(savedData)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success("요약된 피드백 텍스트가 클립보드에 복사되었습니다! 메신저 등에 전달해 주세요.")
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error(err)
      toast.error("클립보드 복사에 실패했습니다.")
    })
  }

  // 섹션 제목 매핑
  const sectionTitles: { [key: string]: string } = {
    A: "회원 주문 플로우",
    B: "회원 가입 및 계정 관리",
    C: "본사 어드민 포털",
    D: "점주 포털",
    E: "영업사원 포털",
    F: "공통 디자인 테마",
    G: "비즈니스 정책 확인",
    H: "권한 및 보안 UX"
  }

  return (
    <div key={resetKey} className="min-h-screen bg-mesh py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 상단 네비게이션 & 헤더 */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <Undo2 className="h-4 w-4" />
            <span className="text-sm font-medium">홈으로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-xs font-semibold text-indigo-600">
            <Sparkles className="h-3 w-3" />
            Phase 0 데모 컨펌 전용
          </div>
        </div>

        {/* 메인 배너 카드 */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl font-black tracking-tight text-indigo-900">pospic</span>
                <span className="text-xs bg-indigo-600 text-white font-bold rounded-md px-2 py-0.5">GUIDE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">클라이언트 컨펌 가이드</h1>
              <p className="text-sm text-gray-500 mt-1">프로토타입 화면 구성 및 UX 흐름 검토 페이지</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-gray-400 block">최초 작성: 2026-06-20 | v3.2 업데이트: 2026-07-01</span>
              <span className="text-xs font-medium text-gray-500 mt-1 inline-block">작성 기준: claude_plan.md v3.2</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-50">
              <span className="font-bold text-indigo-900 block mb-1">1. 이 문서의 목적</span>
              <p className="text-gray-600 text-xs leading-relaxed">
                이 페이지는 화면과 UX 흐름을 검토하기 위한 가이드입니다. 실제 사진 인쇄나 데이터 저장은 발생하지 않습니다.
              </p>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-50">
              <span className="font-bold text-emerald-900 block mb-1">2. 권장 접속 환경</span>
              <p className="text-gray-600 text-xs leading-relaxed">
                스마트폰(회원 주문용)에서 접속하는 것을 권장하며, PC 브라우저를 통해 어드민 및 포털 화면을 확인하십시오.
              </p>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-50">
              <span className="font-bold text-amber-900 block mb-1">3. Demo Navigator 사용</span>
              <p className="text-gray-600 text-xs leading-relaxed">
                오른쪽 하단 나침반(🧭) 버튼을 클릭하면 모든 권한과 화면으로 빠르게 이동할 수 있는 도구가 열립니다.
              </p>
            </div>
          </div>
        </div>

        {/* 진행률 인디케이터 */}
        <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-900">전체 검토 진행 상태</span>
            <span className="text-sm font-mono font-black text-indigo-600">{completedCount} / {items.length} <span className="font-semibold text-gray-400 text-xs">({progressPercent}%)</span></span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 추천 탐색 순서 가이드 */}
        <details className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden group">
          <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none select-none">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-gray-950 text-base">추천 화면 탐색 순서 가이드 (클릭하여 열기)</span>
                <p className="text-xs text-gray-400 mt-0.5">역할별로 최적의 테스트 동선을 확인해 보세요</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-800 mb-1">🚗 1. 회원 주문 플로우 (약 5분)</p>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600 font-mono">
                  <span>홈 (/)</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>사진 업로드</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>2컷 편집</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>결제 (포인트 조작)</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>완료</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-800 mb-1">🔑 2. 회원 가입/로그인 (약 3분)</p>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600 font-mono">
                  <span>홈 (/)</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>회원가입</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>로그인 후 마이페이지 검토</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-800 mb-1">🏢 3. 본사 어드민 포털 (약 7분)</p>
                <p className="text-gray-500 mb-1.5 font-sans">운영자 로그인 → <code className="bg-white px-1 border rounded text-gray-700">ADMIN001</code> 입력</p>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600 font-mono">
                  <span>주문 현황판</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>포인트 원장</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>영업사원 관리(QR)</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>가맹점 관리(QR)</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>시스템 설정(리워드율)</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-800 mb-1">🏬 4. 점주 포털 (약 3분)</p>
                <p className="text-gray-500 mb-1.5 font-sans">
                  점주: <code className="bg-white px-1 border rounded text-gray-700">STORE001</code>
                </p>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600 font-mono">
                  <span>출력현황</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>매출 내역(기간 선택)</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-800 mb-1">💼 5. 영업사원 포털 (약 2분)</p>
                <p className="text-gray-500 mb-1.5 font-sans">
                  영업사원: <code className="bg-white px-1 border rounded text-gray-700">SALES001</code>
                </p>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600 font-mono">
                  <span>매출 대시보드(담당 가맹점)</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>리워드 내역</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-800 mb-1">🔍 6. 비회원 주문 조회 (약 1분)</p>
                <p className="text-gray-500 mb-1.5 font-sans">DemoNavigator → [비회원 주문 조회]</p>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600 font-mono">
                  <span>주문번호 입력</span> <ChevronRight className="h-3 w-3 inline text-gray-400" />
                  <span>상태 확인</span>
                  <span className="text-gray-400 ml-1">(ORD-20260618-001)</span>
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* 검토 체크리스트 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-gray-900">검토 항목 및 결과 선택 (37문항 · v3.2)</h2>
          </div>

          {Object.keys(sectionTitles).map((secCode) => {
            const sectionItems = items.filter(item => item.section === secCode)
            const secCompleted = sectionItems.filter(item => item.status !== "PENDING").length
            const isSecAllDone = secCompleted === sectionItems.length

            return (
              <div key={secCode} className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">
                      {secCode}
                    </span>
                    <span className="font-extrabold text-gray-900">{sectionTitles[secCode]}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isSecAllDone ? "bg-emerald-100 text-emerald-800" : "bg-indigo-50 text-indigo-600"}`}>
                    {secCompleted} / {sectionItems.length} 완료
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {sectionItems.map((item) => (
                    <div key={item.id} className="p-6 transition-colors hover:bg-gray-50/50">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 font-mono">#{item.id}</span>
                            <p className="font-semibold text-gray-800 text-sm md:text-base leading-relaxed">{item.question}</p>
                          </div>
                          <p className="text-xs text-indigo-600 flex items-center gap-1 mt-1 font-medium">
                            <span className="font-bold text-gray-400">[접근 방법]</span> {item.howTo}
                          </p>
                        </div>

                        {/* 패스/실패 토글 버튼 */}
                        <div className="flex items-center gap-2.5 self-start">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, item.status === "PASS" ? "PENDING" : "PASS")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              item.status === "PASS"
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            확인 완료
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, item.status === "FAIL" ? "PENDING" : "FAIL")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              item.status === "FAIL"
                                ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <XCircle className="h-4 w-4" />
                            수정 요청
                          </button>
                        </div>
                      </div>

                      {/* 수정 요청 시 피드백 적는 필드 */}
                      {item.status === "FAIL" && (
                        <div className="mt-4 bg-rose-50/50 border border-rose-100 rounded-xl p-3 space-y-1.5 animate-fadeIn">
                          <label className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            구체적인 수정 요구 사항을 기재해 주세요.
                          </label>
                          <textarea
                            value={item.feedback}
                            onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                            placeholder="예: 홈 화면의 버튼 간격이 너무 좁습니다. 모바일 터치가 어렵습니다."
                            className="w-full text-xs p-2.5 border border-rose-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-gray-400"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* 미확정 항목 선택 피드백 (정책 확인) */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">정책 컨펌 확인 (6가지 · v3.2 업데이트)</h3>
                <p className="text-xs text-gray-400 mt-0.5">v3.0에서 확정된 선택지 + v3.2 환불 권한 업데이트. 변경이 필요하면 다른 옵션을 눌러주세요.</p>
              </div>
            </div>
            <span className="flex-shrink-0 text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">전항목 확정</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => (
              <div key={policy.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">#{policy.id}</span>
                  <h4 className="font-bold text-gray-900 text-sm">{policy.title}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePolicyChange(policy.id, "A")}
                    className={`p-3 text-xs rounded-xl font-semibold border transition-all text-center ${
                      policy.selected === "A"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-[10px] opacity-75 font-mono mb-0.5">OPTION A</span>
                    {policy.optionA}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePolicyChange(policy.id, "B")}
                    className={`p-3 text-xs rounded-xl font-semibold border transition-all text-center ${
                      policy.selected === "B"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-[10px] opacity-75 font-mono mb-0.5">OPTION B</span>
                    {policy.optionB}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최종 컨펌 의견 & 서명 패널 */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <PenTool className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">최종 컨펌 및 서명</h3>
              <p className="text-xs text-gray-400 mt-0.5">검토 의견을 취합하여 최종 서명해 주세요.</p>
            </div>
          </div>

          {/* 승인 선택 라디오 */}
          <div className="space-y-2">
            <span className="text-sm font-bold text-gray-800 block">승인 여부 선택</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                approval === "APPROVE" 
                  ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-bold" 
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
                <input 
                  type="radio" 
                  name="approval" 
                  value="APPROVE" 
                  checked={approval === "APPROVE"}
                  onChange={() => setApproval("APPROVE")}
                  className="accent-indigo-600 h-4 w-4" 
                />
                <span className="text-sm">✔ 승인 — Phase 1 개발 착수에 동의합니다.</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                approval === "REJECT" 
                  ? "bg-rose-50 border-rose-500 text-rose-950 font-bold" 
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
                <input 
                  type="radio" 
                  name="approval" 
                  value="REJECT" 
                  checked={approval === "REJECT"}
                  onChange={() => setApproval("REJECT")}
                  className="accent-rose-500 h-4 w-4" 
                />
                <span className="text-sm">❌ 수정 후 재검토 — 피드백 수정 요청을 전달합니다.</span>
              </label>
            </div>
          </div>

          {/* 추가 요청 사항 */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-800 block">추가 요청 및 총평 의견</label>
            <textarea
              value={generalFeedback}
              onChange={(e) => setGeneralFeedback(e.target.value)}
              placeholder="체크리스트 이외의 의견이 있거나, 전달할 메시지가 있다면 남겨주세요."
              className="w-full text-sm p-4 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 검토자 정보 */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-800 block">검토자 성명</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="예: 홍길동 팀장"
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-gray-400 block font-mono">META DATA</span>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>검토일자:</span>
                  <span className="font-bold">{new Date().toISOString().split("T")[0]}</span>
                </div>
              </div>
            </div>

            {/* 서명 영역 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 block">서명 입력</label>
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setSignatureType("text")}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                      signatureType === "text" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    타이핑
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureType("pad")}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                      signatureType === "pad" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    서명 패드
                  </button>
                </div>
              </div>

              {signatureType === "text" ? (
                <input
                  type="text"
                  value={textSignature}
                  onChange={(e) => setTextSignature(e.target.value)}
                  placeholder="(서명 또는 날인을 텍스트로 입력해 주세요)"
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white placeholder-gray-400 italic"
                />
              ) : (
                <div className="border border-gray-200 rounded-xl bg-white p-3 space-y-2 relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={100}
                    className="w-full h-[100px] border border-dashed border-gray-200 rounded-lg cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>마우스나 터치로 영역에 서명하세요.</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-700 font-bold transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      다시 그리기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 결과 제출 및 LocalStorage 영구 보존 */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800/30 rounded-full blur-3xl -z-10" />
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <Check className="h-5 w-5 bg-indigo-600 rounded-full p-0.5 text-white" />
              피드백 작성을 완료하셨나요?
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed max-w-lg">
              [컨펌 결과 저장하기] 버튼을 누르면 작성하신 모든 데이터가 브라우저(LocalStorage)에 영구 저장되며, 아래에서 모니터링할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveToLocalStorage}
            className="w-full md:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm bg-white text-indigo-950 hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg shadow-indigo-950/30 whitespace-nowrap"
          >
            <Database className="h-4 w-4 text-indigo-600" />
            컨펌 결과 저장하기
          </button>
        </div>

        {/* 5. 제출된 피드백 결과 모니터링 패널 (개발자용) */}
        {savedData && (
          <div className="border-2 border-indigo-200 bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fadeIn space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">제출된 피드백 결과 모니터링 (개발자 확인용)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">LocalStorage에 마지막으로 저장된 컨펌 데이터입니다.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={copySummaryText}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copied 
                      ? "bg-emerald-600 text-white" 
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "복사 성공!" : "피드백 요약 복사"}
                </button>
                <button
                  type="button"
                  onClick={handleResetFeedback}
                  className="px-4 py-2 bg-rose-950/40 text-rose-300 border border-rose-900/50 hover:bg-rose-900/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  피드백 초기화 (Reset)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* 기본 요약 카드 */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3.5">
                <h4 className="font-bold text-white text-xs text-indigo-400 uppercase tracking-wider">검토자 & 승인 상태</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">검토자</span>
                    <span className="font-bold text-white">{savedData.reviewerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">검토 일시</span>
                    <span className="font-mono text-slate-300">{savedData.savedAt.replace("T", " ").substring(0, 16)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-1">최종 결정</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs ${
                      savedData.approval === "APPROVE"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}>
                      {savedData.approval === "APPROVE" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          최종 승인 — Phase 1 착수 동의
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          수정 후 재검토 필요
                        </>
                      )}
                    </span>
                  </div>
                  {savedData.generalFeedback.trim() && (
                    <div className="col-span-2">
                      <span className="text-slate-500 block mb-1">총평 의견</span>
                      <p className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {savedData.generalFeedback}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-1">서명</span>
                    {savedData.signatureType === "text" ? (
                      <span className="text-sm italic font-bold text-slate-300 font-serif">
                        {savedData.textSignature || "(텍스트 서명 없음)"}
                      </span>
                    ) : (
                      savedData.signatureImage ? (
                        <div className="mt-1 bg-white border border-slate-200 rounded-lg p-2 max-w-[200px] h-[54px] flex items-center justify-center">
                          <img 
                            src={savedData.signatureImage} 
                            alt="Signature" 
                            className="max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">서명 누락</span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* 미확정 정책 선택 요약 */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3.5">
                <h4 className="font-bold text-white text-xs text-indigo-400 uppercase tracking-wider">미확정 정책 결정 내역</h4>
                <div className="space-y-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                  {savedData.policies.map(p => {
                    const orig = policies.find(op => op.id === p.id)
                    const optionText = p.selected === "A" ? orig?.optionA : p.selected === "B" ? orig?.optionB : "선택 누락"
                    return (
                      <div key={p.id} className="flex justify-between items-start gap-4 border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-slate-400 font-medium shrink-0">
                          {p.id} {orig?.title}
                        </span>
                        <span className={`text-right font-bold ${p.selected ? "text-indigo-300" : "text-amber-500 italic"}`}>
                          {p.selected ? `[Option ${p.selected}] ` : ""}{optionText}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 수정 요청 실패 항목 요약 리스트 */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 col-span-1 md:col-span-2 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-xs text-indigo-400 uppercase tracking-wider">
                    수정 요청 요약 ({savedData.items.filter(i => i.status === "FAIL").length}건)
                  </h4>
                  <span className="text-[10px] text-slate-500">❌ 수정 요청으로 마킹된 항목만 나열됩니다.</span>
                </div>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {savedData.items.filter(i => i.status === "FAIL").length > 0 ? (
                    items
                      .filter(origItem => savedData.items.find(pi => pi.id === origItem.id)?.status === "FAIL")
                      .map(item => {
                        const matched = savedData.items.find(pi => pi.id === item.id)
                        return (
                          <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[10px] font-bold">
                                항목 #{item.id}
                              </span>
                              <span className="text-[10px] text-slate-400">({sectionTitles[item.section]})</span>
                            </div>
                            <p className="font-bold text-slate-200 text-xs">{item.question}</p>
                            <div className="mt-1.5 text-xs text-rose-300 pl-2 border-l-2 border-rose-500 bg-rose-950/10 py-1 pr-2 rounded-r">
                              <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">수정 요청 내용:</span>
                              {matched?.feedback || "(구체적인 사유가 작성되지 않았습니다)"}
                            </div>
                          </div>
                        )
                      })
                  ) : (
                    <div className="text-center py-6 text-slate-500 italic text-xs">
                      수정 요청 사항이 없습니다. 프로토타입 전체 검토 패스!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
