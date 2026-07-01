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

// 단가 500원 기준 갱신
export const mockOrders = [
  { id: "order-001", status: "PRINT_SUCCESS", photo_count: 2, total_amount: 1000, card_amount: 700,  point_used: 300,  created_at: "2026-06-18 14:30" },
  { id: "order-002", status: "PRINTING",      photo_count: 1, total_amount: 500,  card_amount: 500,  point_used: 0,    created_at: "2026-06-18 14:35" },
  { id: "order-003", status: "PRINT_SUCCESS", photo_count: 2, total_amount: 1000, card_amount: 0,    point_used: 1000, created_at: "2026-06-18 14:40" },
  { id: "order-004", status: "PAID",          photo_count: 1, total_amount: 500,  card_amount: 300,  point_used: 200,  created_at: "2026-06-18 14:45" },
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

export const mockSalesList = [
  { id: "sales-001", name: "김영업", sales_code: "SALES001", sales_wallet: { current_balance: 12500 }, linked_stores: 3, total_reward: 45000 },
  { id: "sales-002", name: "박영업", sales_code: "SALES002", sales_wallet: { current_balance: 3200 },  linked_stores: 1, total_reward: 12000 },
];

export const mockStoreList = [
  { id: "store-001", name: "강남점", address: "서울시 강남구 테헤란로 123", owner_email: "store01@pospic.com", sales_id: "sales-001", sales_name: "김영업", sales_code: "SALES001", table_count: 5 },
  { id: "store-002", name: "홍대점", address: "서울시 마포구 홍익로 45",   owner_email: "store02@pospic.com", sales_id: "sales-002", sales_name: "박영업", sales_code: "SALES002", table_count: 3 },
  { id: "store-003", name: "신촌점", address: "서울시 서대문구 신촌로 78",  owner_email: "store03@pospic.com", sales_id: null,        sales_name: null,     sales_code: null,       table_count: 4 },
];

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
