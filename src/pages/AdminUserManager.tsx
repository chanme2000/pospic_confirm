import { useState } from "react"
import { toast } from "sonner"
import { Search, Mail, Phone, Wallet } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AccountStatusBadge } from "@/components/AccountStatusBadge"
import { StatusChangeMenu } from "@/components/StatusChangeMenu"
import { mockUserList, ACCOUNT_STATUS_LABEL, logAuditEntry } from "@/mocks"

export default function AdminUserManager() {
  const [userList, setUserList] = useState(mockUserList)
  const [query, setQuery] = useState("")

  function handleStatusChange(userId: string, name: string, nextStatus: string) {
    const prevStatus = userList.find((u) => u.id === userId)?.status ?? "ACTIVE"
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    )
    logAuditEntry({
      actor_type: "ADMIN",
      actor_name: "본사 관리자",
      action: "ACCOUNT_STATUS_CHANGE",
      target_type: "User",
      target_label: name,
      before_value: prevStatus,
      after_value: nextStatus,
      memo: null,
    })
    toast.success(`${name} 회원 상태가 변경되었습니다`, {
      description: `${ACCOUNT_STATUS_LABEL[nextStatus]}(으)로 전환 · 감사 로그에 기록되었습니다`,
    })
  }

  const filtered = userList.filter((u) => {
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.phone.replace(/-/g, "").includes(q.replace(/-/g, "")) ||
      u.email.toLowerCase().includes(q)
    )
  })

  return (
    <section aria-labelledby="user-manager-heading">
      <h2 id="user-manager-heading" className="text-xl font-bold text-gray-900 mb-6">
        회원 관리
      </h2>

      {/* 검색 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름, 휴대폰, 이메일로 검색"
          className="pl-9"
          aria-label="회원 검색 — 이름, 휴대폰, 이메일"
        />
      </div>

      {/* 회원 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="회원 목록">
          {filtered.map((u) => (
            <Card key={u.id} role="listitem" aria-label={`회원 ${u.name}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="text-sm font-bold text-gray-900">{u.name}</h3>
                      <AccountStatusBadge status={u.status} />
                    </div>
                    <p className="flex items-center gap-1 text-xs text-gray-400">
                      <Mail className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      {u.email}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Phone className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      {u.phone}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="flex items-center justify-end gap-1 text-xs text-gray-400 mb-1">
                      <Wallet className="h-3 w-3" aria-hidden="true" />
                      보유 포인트
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      {u.current_balance.toLocaleString()}P
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <StatusChangeMenu
                    status={u.status}
                    targetLabel={u.name}
                    onChange={(next) => handleStatusChange(u.id, u.name, next)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
