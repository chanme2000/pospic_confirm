import { useState } from "react"
import { toast } from "sonner"
import { Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAdminAuditLog, AUDIT_ACTION_LABEL, AUDIT_ACTOR_TYPE_LABEL } from "@/mocks"

export default function AdminAuditLog() {
  const [logs, setLogs] = useState(mockAdminAuditLog)
  const [actionFilter, setActionFilter] = useState<string>("ALL")

  const actionsInUse = Array.from(new Set(mockAdminAuditLog.map((l) => l.action)))

  const filtered =
    actionFilter === "ALL" ? logs : logs.filter((l) => l.action === actionFilter)

  function handleDelete(id: string, targetLabel: string) {
    const ok = window.confirm(
      `이 감사 로그를 삭제하시겠습니까?\n(${targetLabel} 관련 기록 · 삭제 후 복구 불가)`
    )
    if (!ok) return

    const idx = mockAdminAuditLog.findIndex((l) => l.id === id)
    if (idx !== -1) mockAdminAuditLog.splice(idx, 1)
    setLogs((prev) => prev.filter((l) => l.id !== id))
    toast.success("감사 로그 항목이 삭제되었습니다")
  }

  return (
    <section aria-labelledby="audit-log-heading">
      <h2 id="audit-log-heading" className="text-xl font-bold text-gray-900 mb-2">
        감사 로그
      </h2>
      <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        반영구 보관 — 자동 파기되지 않으며, 필요 시 개별 항목만 수동으로 삭제할 수 있습니다
      </p>

      {/* 필터 */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 overflow-x-auto" role="tablist" aria-label="작업 유형 필터">
        <button
          role="tab"
          aria-selected={actionFilter === "ALL"}
          onClick={() => setActionFilter("ALL")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            actionFilter === "ALL" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          전체
        </button>
        {actionsInUse.map((action) => (
          <button
            key={action}
            role="tab"
            aria-selected={actionFilter === action}
            onClick={() => setActionFilter(action)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              actionFilter === action ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {AUDIT_ACTION_LABEL[action] ?? action}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">해당 작업 유형의 기록이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="감사 로그 목록">
          {filtered.map((log) => (
            <Card key={log.id} role="listitem">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Badge aria-label={`작업 유형: ${AUDIT_ACTION_LABEL[log.action] ?? log.action}`}>
                        {AUDIT_ACTION_LABEL[log.action] ?? log.action}
                      </Badge>
                      <Badge variant={log.actor_type === "STORE_OWNER" ? "blue" : "secondary"}>
                        {AUDIT_ACTOR_TYPE_LABEL[log.actor_type]}
                      </Badge>
                      <span className="text-xs text-gray-400">{log.target_type}</span>
                      <span className="text-xs font-medium text-gray-700">{log.target_label}</span>
                    </div>
                    {(log.before_value || log.after_value) && (
                      <p className="text-xs text-gray-500">
                        {log.before_value && <span className="text-gray-400">{log.before_value}</span>}
                        {log.before_value && log.after_value && <span className="mx-1.5">→</span>}
                        {log.after_value && <span className="font-medium text-gray-700">{log.after_value}</span>}
                      </p>
                    )}
                    {log.memo && <p className="text-xs text-gray-400 mt-1">{log.memo}</p>}
                    <p className="text-xs text-gray-400 mt-1.5">
                      {log.actor_name} · {log.created_at}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(log.id, log.target_label)}
                    aria-label={`${log.target_label} 감사 로그 삭제`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
