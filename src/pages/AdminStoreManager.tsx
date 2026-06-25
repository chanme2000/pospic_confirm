import { toast } from "sonner"
import { Plus, MapPin, User, Link2, Link2Off } from "lucide-react"
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
                <dl className="grid grid-cols-1 gap-3">
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
                </dl>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
