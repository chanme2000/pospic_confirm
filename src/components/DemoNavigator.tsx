import { useState } from "react"
import { Link } from "react-router-dom"
import { Compass, X, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"

// Phase 0 전용 — Phase 1 진입 시 App.tsx에서 제거
const GROUPS = [
  {
    label: "회원 영역",
    badge: null,
    routes: [
      { label: "클라이언트 컨펌 가이드 (필독)", path: "/confirm-guide" },
      { label: "홈", path: "/" },
      { label: "사용 가이드", path: "/guide" },
      { label: "회원 로그인", path: "/login" },
      { label: "회원가입", path: "/signup" },
      { label: "아이디·비밀번호 찾기", path: "/find-account" },
      { label: "마이페이지", path: "/mypage" },
      { label: "사진 업로드 → 편집 → 결제", path: "/order/upload" },
      { label: "비회원 주문 조회", path: "/order/lookup" },
    ],
  },
  {
    label: "어드민",
    badge: "ADMIN001",
    routes: [
      { label: "주문 현황", path: "/admin/orders" },
      { label: "포인트 원장", path: "/admin/ledger" },
      { label: "영업 관리", path: "/admin/sales" },
      { label: "가맹점 관리", path: "/admin/stores" },
      { label: "시스템 설정", path: "/admin/settings" },
    ],
  },
  {
    label: "점주 포털",
    badge: "STORE001",
    routes: [
      { label: "출력 현황", path: "/store/orders" },
      { label: "매출 내역", path: "/store/history" },
    ],
  },
  {
    label: "영업사원 포털",
    badge: "SALES001",
    routes: [
      { label: "매출 대시보드", path: "/sales-portal/dashboard" },
      { label: "리워드 내역", path: "/sales-portal/rewards" },
    ],
  },
]

export default function DemoNavigator() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 배경 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 사이드 패널 */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="데모 탐색 패널"
        aria-hidden={!open}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">데모 탐색</p>
            <p className="text-xs text-gray-400 mt-0.5">Phase 0 컨펌용 내비게이터</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 운영자 로그인 단축 */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <Link
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            운영자 로그인 → /admin/login
          </Link>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            포털별 코드: <code className="bg-white px-1 rounded text-gray-600">ADMIN001</code> ·{" "}
            <code className="bg-white px-1 rounded text-gray-600">STORE001</code> ·{" "}
            <code className="bg-white px-1 rounded text-gray-600">SALES001</code>
          </p>
        </div>

        {/* 라우트 목록 */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4" aria-label="화면 목록">
          {GROUPS.map((group) => (
            <section key={group.label}>
              <div className="flex items-center gap-2 px-1.5 mb-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {group.label}
                </span>
                {group.badge && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-500 rounded px-1.5 py-0.5 font-mono font-semibold">
                    {group.badge}
                  </span>
                )}
              </div>
              <ul className="space-y-0.5">
                {group.routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg px-2.5 py-2 transition-colors group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-indigo-400 flex-shrink-0 transition-colors" />
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        {/* 푸터 */}
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            이 패널은 Phase 0 컨펌 전용입니다
          </p>
        </div>
      </aside>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          open
            ? "bg-gray-700 text-white scale-95"
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
        )}
        aria-label={open ? "내비게이터 닫기" : "데모 내비게이터 열기"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Compass className="h-5 w-5" />}
      </button>
    </>
  )
}
