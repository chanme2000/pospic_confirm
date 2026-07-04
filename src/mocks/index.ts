export const mockUser = {
  id: "user-001",
  email: "user@test.com",
  name: "홍길동",
  user_wallet: { current_balance: 500 },
};

export const mockSalesPerson = {
  id: "sales-001",
  name: "김영업",
  sales_code: "SALES001",
  sales_wallet: { current_balance: 12500 },
  linked_stores: 3,
  total_reward: 45000,
};

// 단가 500원 기준 갱신 (v3.3: 검색 기능 위해 회원명/휴대폰/가맹점/영업사원 필드 추가)
export const mockOrders = [
  { id: "order-001", status: "PRINT_SUCCESS", photo_count: 2, total_amount: 1000, card_amount: 700,  point_used: 300,  created_at: "2026-06-18 14:30", user_name: "홍길동", phone: "010-1234-5678", store_name: "강남점", sales_name: "김영업" },
  { id: "order-002", status: "PRINTING",      photo_count: 1, total_amount: 500,  card_amount: 500,  point_used: 0,    created_at: "2026-06-18 14:35", user_name: "이순신", phone: "010-2345-6789", store_name: "홍대점", sales_name: "박영업" },
  { id: "order-003", status: "PRINT_SUCCESS", photo_count: 2, total_amount: 1000, card_amount: 0,    point_used: 1000, created_at: "2026-06-18 14:40", user_name: "홍길동", phone: "010-1234-5678", store_name: "강남점", sales_name: "김영업" },
  { id: "order-004", status: "PAID",          photo_count: 1, total_amount: 500,  card_amount: 300,  point_used: 200,  created_at: "2026-06-18 14:45", user_name: "비회원",  phone: "010-9876-5432", store_name: "신촌점", sales_name: null },
];

// 가입 보너스 없음 — 출력 적립(PRINT_REWARD)으로 대체
export const mockUserLedger = [
  { id: "ul-001", type: "ADMIN_GRANT",   amount: +500,  status: "SUCCESS", reference_id: null,      reference_type: "SYSTEM",  created_at: "2026-06-18 09:00", target_name: "홍길동" },
  { id: "ul-002", type: "PRINT_REWARD",  amount: +10,   status: "SUCCESS", reference_id: "pay-001", reference_type: "PRINT",   created_at: "2026-06-18 14:31", target_name: "홍길동" },
  { id: "ul-003", type: "POINT_USE",     amount: -300,  status: "SUCCESS", reference_id: "pay-001", reference_type: "PAYMENT", created_at: "2026-06-18 14:30", target_name: "홍길동" },
  { id: "ul-004", type: "POINT_USE",     amount: -1000, status: "SUCCESS", reference_id: "pay-003", reference_type: "PAYMENT", created_at: "2026-06-18 14:40", target_name: "홍길동" },
  { id: "ul-005", type: "PRINT_REWARD",  amount: +10,   status: "SUCCESS", reference_id: "pay-003", reference_type: "PRINT",   created_at: "2026-06-18 14:41", target_name: "홍길동" },
];

export const mockSalesLedger = [
  { id: "sl-001", type: "SALES_REWARD",    amount: +7,   status: "SUCCESS",     reference_id: "pay-001", reference_type: "PAYMENT", created_at: "2026-06-18 14:31", target_name: "김영업" },
  { id: "sl-002", type: "REFUND_ROLLBACK", amount: -3,   status: "UNRECOVERED", reference_id: "ref-001", reference_type: "REFUND",  created_at: "2026-06-18 14:32", target_name: "김영업" },
  { id: "sl-003", type: "SALES_REWARD",    amount: +5,   status: "SUCCESS",     reference_id: "pay-002", reference_type: "PAYMENT", created_at: "2026-06-18 14:41", target_name: "김영업" },
];

// v3.3: status(ACTIVE/INACTIVE/SUSPENDED) 추가 — 계정 삭제 대신 상태로 관리
export const mockSalesList = [
  { id: "sales-001", name: "김영업", sales_code: "SALES001", status: "ACTIVE",   sales_wallet: { current_balance: 12500 }, linked_stores: 3, total_reward: 45000 },
  { id: "sales-002", name: "박영업", sales_code: "SALES002", status: "ACTIVE",   sales_wallet: { current_balance: 3200 },  linked_stores: 1, total_reward: 12000 },
  { id: "sales-003", name: "최영업", sales_code: "SALES003", status: "INACTIVE", sales_wallet: { current_balance: 0 },     linked_stores: 0, total_reward: 8000 },
];

// v3.4: price_per_sheet 추가 — 점주가 본인 매장에 한해 직접 설정 가능 (null = 전역값 사용)
export const mockStoreList: {
  id: string
  name: string
  address: string
  owner_email: string
  sales_id: string | null
  sales_name: string | null
  sales_code: string | null
  table_count: number
  status: string
  price_per_sheet: number | null
}[] = [
  { id: "store-001", name: "강남점", address: "서울시 강남구 테헤란로 123", owner_email: "store01@pospic.com", sales_id: "sales-001", sales_name: "김영업", sales_code: "SALES001", table_count: 5, status: "ACTIVE", price_per_sheet: null },
  { id: "store-002", name: "홍대점", address: "서울시 마포구 홍익로 45",   owner_email: "store02@pospic.com", sales_id: "sales-002", sales_name: "박영업", sales_code: "SALES002", table_count: 3, status: "ACTIVE", price_per_sheet: 600 },
  { id: "store-003", name: "신촌점", address: "서울시 서대문구 신촌로 78",  owner_email: "store03@pospic.com", sales_id: null,        sales_name: null,     sales_code: null,       table_count: 4, status: "ACTIVE", price_per_sheet: null },
];

// 점주 포털에서 본인 매장 단가를 저장할 때 사용 — mockStoreList를 모듈 스코프에서 갱신하므로
// 컴포넌트가 렌더링 중 얻은 참조(myStore 등)를 직접 변경하지 않는다.
export function setStorePrice(storeId: string, price: number | null) {
  const idx = mockStoreList.findIndex((s) => s.id === storeId);
  if (idx !== -1) {
    mockStoreList[idx] = { ...mockStoreList[idx], price_per_sheet: price };
  }
}

// 회원 관리 (v3.3 신규 — AdminUserManager)
export const mockUserList = [
  { id: "user-001", name: "홍길동", email: "user@test.com",   phone: "010-1234-5678", status: "ACTIVE",    current_balance: 500 },
  { id: "user-002", name: "이순신", email: "lee@test.com",    phone: "010-2345-6789", status: "ACTIVE",    current_balance: 1200 },
  { id: "user-003", name: "김철수", email: "kim@test.com",    phone: "010-3456-7890", status: "SUSPENDED", current_balance: 0 },
];

// 관리자 작업 감사 로그 (v3.3 신규 — 반영구 보관, 개별 삭제만 가능)
// v3.4: actor_type 추가 — ADMIN(본사) 뿐 아니라 STORE_OWNER(점주)가 직접 수행한 작업(매장별 단가 조정 등)도 함께 기록
export type AuditActorType = "ADMIN" | "STORE_OWNER";

export interface AdminAuditLogEntry {
  id: string;
  actor_type: AuditActorType;
  actor_name: string;
  action: string;
  target_type: string;
  target_label: string;
  before_value: string | null;
  after_value: string | null;
  memo: string | null;
  created_at: string;
}

export const mockAdminAuditLog: AdminAuditLogEntry[] = [
  { id: "al-001", actor_type: "ADMIN", actor_name: "본사 관리자", action: "SALES_REASSIGN", target_type: "Store", target_label: "강남점",
    before_value: "김영업(SALES001)", after_value: "박영업(SALES002)", memo: "김영업 퇴사로 인한 인수인계", created_at: "2026-07-04 10:00" },
  { id: "al-002", actor_type: "ADMIN", actor_name: "본사 관리자", action: "ACCOUNT_STATUS_CHANGE", target_type: "Sales", target_label: "최영업(SALES003)",
    before_value: "ACTIVE", after_value: "INACTIVE", memo: "퇴사 처리", created_at: "2026-07-04 09:58" },
  { id: "al-003", actor_type: "ADMIN", actor_name: "본사 관리자", action: "REFUND", target_type: "Payment", target_label: "order-003",
    before_value: null, after_value: "환불 1,000원", memo: null, created_at: "2026-06-18 15:00" },
  { id: "al-004", actor_type: "ADMIN", actor_name: "본사 관리자", action: "PRICE_CHANGE", target_type: "SystemSettings", target_label: "price_per_sheet (전역)",
    before_value: "1500원", after_value: "500원", memo: null, created_at: "2026-06-30 11:20" },
  { id: "al-005", actor_type: "STORE_OWNER", actor_name: "홍대점 점주", action: "PRICE_CHANGE", target_type: "Store", target_label: "홍대점",
    before_value: "전역값 사용(500원)", after_value: "600원", memo: "점주가 매장 단가 직접 조정 — 전역 단가에는 영향 없음", created_at: "2026-06-25 10:15" },
];

let auditLogSeq = mockAdminAuditLog.length;

// 새 감사 로그 항목을 기록한다 (ADMIN·STORE_OWNER 공용). mockAdminAuditLog를 제자리에서 변경(unshift)하므로
// 다른 화면(AdminAuditLog 등)에서도 재진입(remount) 시 최신 내역이 그대로 보인다.
export function logAuditEntry(entry: Omit<AdminAuditLogEntry, "id" | "created_at">) {
  auditLogSeq += 1;
  const created_at = new Date().toISOString().slice(0, 16).replace("T", " ");
  mockAdminAuditLog.unshift({ id: `al-${String(auditLogSeq).padStart(3, "0")}`, created_at, ...entry });
}

export const AUDIT_ACTOR_TYPE_LABEL: Record<AuditActorType, string> = {
  ADMIN: "본사 관리자",
  STORE_OWNER: "점주",
};

export const mockSystemSettings = {
  price_per_sheet: 500,          // 기본 단가 500원
  user_print_reward_rate: 1,     // 사용자 출력 적립율 (%) — 출력 금액의 1%
  reward_rate: 1,                // 영업사원 리워드율 (%)
  point_validity_months: 0,      // 0 = 무기한
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING:       "대기중",
  PAID:          "결제완료",
  PRINTING:      "출력중",
  PRINT_SUCCESS: "출력완료",
  PRINT_FAILED:  "출력실패",
  CANCELLED:     "취소됨",
  REFUNDED:      "환불됨",
};

export const LEDGER_TYPE_LABEL: Record<string, string> = {
  PRINT_REWARD:   "출력 적립",
  POINT_USE:      "포인트사용",
  ADMIN_GRANT:    "관리자지급",
  ADMIN_DEDUCT:   "관리자차감",
  SALES_REWARD:   "영업리워드",
  REFUND_ROLLBACK:"리워드회수",
};

// 계정 상태 (v3.3 신규)
export const ACCOUNT_STATUS_LABEL: Record<string, string> = {
  ACTIVE:    "정상",
  INACTIVE:  "비활성",
  SUSPENDED: "정지",
};

export const ACCOUNT_STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

// 관리자 작업 감사 로그 액션 타입 (v3.3 신규)
export const AUDIT_ACTION_LABEL: Record<string, string> = {
  POINT_GRANT:           "포인트 지급",
  POINT_DEDUCT:          "포인트 차감",
  REWARD_GRANT:          "리워드 지급",
  REWARD_DEDUCT:         "리워드 차감",
  REFUND:                "환불 처리",
  PRICE_CHANGE:          "단가 변경",
  REWARD_RATE_CHANGE:    "리워드율 변경",
  ACCOUNT_STATUS_CHANGE: "계정 상태 변경",
  SALES_REASSIGN:        "담당 영업사원 재지정",
  ADMIN_LOGIN:           "관리자 로그인",
};
