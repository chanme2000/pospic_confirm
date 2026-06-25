import { Outlet, NavLink, Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Gift, LogOut } from "lucide-react"
import { PospicLogo } from "@/components/PospicLogo"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const NAV_ITEMS = [
  { to: "/sales-portal/dashboard", label: "매출 대시보드", icon: LayoutDashboard },
  { to: "/sales-portal/rewards",   label: "리워드 내역",   icon: Gift },
]

export default function SalesPortalLayout() {
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
        className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 min-h-screen flex-shrink-0"
        aria-label="영업사원 사이드바"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link
            to="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md inline-flex"
            aria-label="pospic 홈으로 이동"
          >
            <PospicLogo size="sm" />
          </Link>
          <p className="text-xs text-gray-400 mt-1 ml-10">영업사원 포털</p>
        </div>

        {/* Salesperson info */}
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-400">담당 영업사원</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">{user?.name ?? "영업사원"}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label="영업사원 메뉴">
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">pospic 영업사원 포털</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="md:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1"
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {user?.name ?? "영업사원"}
          </button>
          <span className="hidden md:block text-sm text-gray-500" aria-label={`로그인 계정: ${user?.name ?? "영업사원"}`}>
            {user?.name ?? "영업사원"}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Bottom tab bar (mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
        aria-label="모바일 하단 탭"
      >
        <ul className="flex" role="list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
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
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
