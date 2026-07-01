import { toast } from "sonner"
import { Plus, MapPin, User, Link2, Link2Off, QrCode, Download, Archive, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockStoreList } from "@/mocks"

export default function AdminStoreManager() {
  function handleAddStore() {
    toast.info("준비 중인 기능입니다", {
      description: "가맹점 등록 기능이 곧 추가됩니다",
    })
  }

  function handleEdit(name: string) {
    toast.info("준비 중인 기능입니다", {
      description: `${name} 수정 기능이 곧 추가됩니다`,
    })
  }

  function handleResetPassword(name: string) {
    toast.info("준비 중인 기능입니다", {
      description: `${name} 비밀번호 재발급 기능이 곧 추가됩니다`,
    })
  }

  function handleEntryQR(name: string) {
    toast.info("준비 중인 기능입니다", {
      description: `${name} 입장 QR PNG 다운로드 기능이 곧 추가됩니다`,
    })
  }

  function handleTableQR(name: string, count: number) {
    toast.info("준비 중인 기능입니다", {
      description: `${name} 테이블 QR ${count}개 ZIP 다운로드 기능이 곧 추가됩니다`,
    })
  }

  function handleQRRegen(name: string) {
    toast.info("준비 중인 기능입니다", {
      description: `${name} QR 재생성 기능이 곧 추가됩니다`,
    })
  }

  return (
    <section aria-labelledby="store-heading">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 id="store-heading" className="text-xl font-bold text-gray-900">
          가맹점 관리
        </h2>
        <Button onClick={handleAddStore} aria-label="새 가맹점 등록">
          <Plus className="h-4 w-4" aria-hidden="true" />
          가맹점 등록
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{mockStoreList.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">전체 가맹점</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {mockStoreList.filter((s) => s.sales_id).length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">영업사원 연결</p>
          </CardContent>
        </Card>
      </div>

      {/* Store list */}
      <ul className="space-y-4" role="list" aria-label="가맹점 목록">
        {mockStoreList.map((store) => (
          <li key={store.id}>
            <Card>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{store.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      {store.address}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(store.name)}
                      aria-label={`${store.name} 수정`}
                    >
                      수정
                    </Button>
                  </div>
                </div>

                {/* Info grid */}
                <dl className="grid grid-cols-1 gap-3 mb-4">
                  {/* 점주 계정 */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      <dt className="text-xs text-gray-400 flex-shrink-0">점주 계정</dt>
                      <dd className="text-xs font-medium text-gray-700 truncate">
                        {store.owner_email}
                      </dd>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-gray-500 flex-shrink-0"
                      onClick={() => handleResetPassword(store.name)}
                      aria-label={`${store.name} 비밀번호 재발급`}
                    >
                      비밀번호 재발급
                    </Button>
                  </div>

                  {/* 담당 영업사원 */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {store.sales_id ? (
                        <Link2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <Link2Off className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" aria-hidden="true" />
                      )}
                      <dt className="text-xs text-gray-400 flex-shrink-0">담당 영업사원</dt>
                      <dd>
                        {store.sales_name ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-700">{store.sales_name}</span>
                            <Badge variant="secondary" className="text-xs py-0">
                              {store.sales_code}
                            </Badge>
                          </span>
                        ) : (
                          <Badge variant="outline" className="text-xs text-gray-400">
                            미배정
                          </Badge>
                        )}
                      </dd>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-gray-500 flex-shrink-0"
                      onClick={() => handleEdit(store.name)}
                      aria-label={`${store.name} 담당 영업사원 변경`}
                    >
                      변경
                    </Button>
                  </div>

                  {/* 테이블 수 */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      <dt className="text-xs text-gray-400">테이블 수</dt>
                      <dd className="text-xs font-semibold text-gray-700">{store.table_count}개</dd>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-gray-500 flex-shrink-0"
                      onClick={() => handleEdit(store.name)}
                      aria-label={`${store.name} 테이블 수 변경`}
                    >
                      변경
                    </Button>
                  </div>
                </dl>

                {/* QR 다운로드 — 어드민 전용 */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                    <QrCode className="h-3 w-3" aria-hidden="true" />
                    QR 코드 관리 <span className="text-gray-300 font-normal">(어드민 전용)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5"
                      onClick={() => handleEntryQR(store.name)}
                      aria-label={`${store.name} 입장 QR PNG 다운로드`}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      입장 QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5"
                      onClick={() => handleTableQR(store.name, store.table_count)}
                      aria-label={`${store.name} 테이블 QR ${store.table_count}개 ZIP 다운로드`}
                    >
                      <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                      테이블 QR ZIP ({store.table_count}개)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 gap-1.5 text-gray-400"
                      onClick={() => handleQRRegen(store.name)}
                      aria-label={`${store.name} QR 재생성`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      재생성
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
