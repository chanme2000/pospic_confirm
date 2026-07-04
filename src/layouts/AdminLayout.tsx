import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Users,
  UserCog,
  Settings,
  Store,
  ShieldCheck,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const NAV_ITEMS = [
  { to: "/admin/dashboard",  label: "운영 대시보드", icon: LayoutDashboard },
  { to: "/admin/orders",     label: "주문 현황",    icon: ShoppingCart },
  { to: "/admin/ledger",     label: "포인트 원장",   icon: BookOpen },
  { to: "/admin/users",      label: "회원 관리",     icon: UserCog },
  { to: "/admin/sales",      label: "영업 관리",     icon: Users },
  { to: "/admin/stores",     label: "가맹점 관리",    icon: Store },
  { to: "/admin/audit-log",  label: "감사 로그",     icon: ShieldCheck },
  { to: "/admin/settings",   label: "설정",         icon: Settings },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
    toast.info("로그아웃되었습니다")
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <aside
        className="hidden md:flex flex-col w-60 bg-gray-900 min-h-screen flex-shrink-0"
        aria-label="관리자 사이드바"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md inline-flex" aria-label="pospic 홈으로 이동">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <span className="text-white text-xs font-black">P</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">pospic</span>
            </div>
          </Link>
          <p className="text-xs text-gray-500 mt-1.5 font-medium">어드민 포털</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label="관리자 메뉴">
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                      isActive
                        ? "bg-white text-gray-900 font-bold shadow-sm"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    )
                  }
                  aria-label={label}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-white/10 hover:text-white w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-900">pospic 관리자</h1>
            {user && <p className="text-xs text-gray-400 leading-tight">{user.name}</p>}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="md:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1"
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            로그아웃
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom tab bar (mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
        aria-label="모바일 하단 탭"
      >
        <ul className="flex overflow-x-auto" role="list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-shrink-0 w-20">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-0.5 py-2.5 px-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 min-h-[56px] w-full",
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  )
                }
                aria-label={label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-center leading-tight">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
