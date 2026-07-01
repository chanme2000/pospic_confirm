import { Link, useNavigate } from "react-router-dom"
import { LogOut, Coins, ShoppingBag, Home } from "lucide-react"
import { PospicLogo } from "@/components/PospicLogo"
import { mockUser, mockUserLedger, mockOrders, LEDGER_TYPE_LABEL } from "@/mocks"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"

export default function MyPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 inline-flex" aria-label="홈으로 이동">
            <PospicLogo size="sm" />
          </Link>
          <span className="text-sm font-medium text-gray-500">마이페이지</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Profile card */}
        <Card className="border-0 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" aria-hidden="true" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">My Account</p>
                <p className="text-xl font-black text-white leading-tight">{mockUser.name}</p>
                <p className="text-sm text-gray-400 mt-1">{mockUser.email}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-gray-400 mb-1">보유 포인트</p>
                <p className="text-3xl font-black text-white tracking-tight" aria-label={`보유 포인트 ${mockUser.user_wallet.current_balance.toLocaleString()}P`}>
                  {mockUser.user_wallet.current_balance.toLocaleString()}
                  <span className="text-lg font-bold text-indigo-400 ml-0.5">P</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="ledger">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ledger" className="flex items-center gap-1.5">
              <Coins className="h-4 w-4" aria-hidden="true" />
              포인트 내역
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              주문 내역
            </TabsTrigger>
          </TabsList>

          {/* Point ledger tab */}
          <TabsContent value="ledger" className="mt-3">
            <section aria-labelledby="ledger-heading">
              <h2 id="ledger-heading" className="sr-only">포인트 내역</h2>
              {mockUserLedger.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">포인트 내역이 없습니다</p>
                </div>
              ) : (
                <ul className="space-y-3" aria-label="포인트 내역 목록">
                  {mockUserLedger.map((item) => (
                    <li key={item.id}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {LEDGER_TYPE_LABEL[item.type] ?? item.type}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{item.created_at}</p>
                            </div>
                            <p
                              className={`text-base font-bold flex-shrink-0 ${
                                item.amount >= 0 ? "text-green-600" : "text-red-500"
                              }`}
                              aria-label={`${item.amount >= 0 ? "적립" : "차감"} ${Math.abs(item.amount).toLocaleString()}P`}
                            >
                              {item.amount >= 0 ? "+" : ""}
                              {item.amount.toLocaleString()}P
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </TabsContent>

          {/* Orders tab */}
          <TabsContent value="orders" className="mt-3">
            <section aria-labelledby="orders-heading">
              <h2 id="orders-heading" className="sr-only">주문 내역</h2>
              {mockOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">주문 내역이 없습니다</p>
                </div>
              ) : (
                <ul className="space-y-3" aria-label="주문 내역 목록">
                  {mockOrders.map((order) => (
                    <li key={order.id}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="text-sm font-semibold text-gray-900 font-mono">
                                  #{order.id}
                                </span>
                                <StatusBadge status={order.status} />
                              </div>
                              <p className="text-xs text-gray-400">{order.created_at}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p
                                className="text-base font-bold text-gray-900"
                                aria-label={`결제액 ${order.total_amount.toLocaleString()}원`}
                              >
                                {order.total_amount.toLocaleString()}원
                              </p>
                              {order.point_used > 0 && (
                                <p className="text-xs text-indigo-500 mt-0.5">
                                  포인트 {order.point_used.toLocaleString()}P 사용
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {/* Bottom actions */}
        <div className="pt-2 flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Link to="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              홈으로
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            로그아웃
          </Button>
        </div>
      </main>
    </div>
  )
}
