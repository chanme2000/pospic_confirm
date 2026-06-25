export const mockUser = {
  id: "user-001",
  email: "user@test.com",
  name: "홍길동",
  sales_id: "sales-001",   // 가입 시 영업 QR로 연결된 영업사원 ID (없으면 null)
  user_wallet: { current_balance: 3000 },
};

export const mockSalesPerson = {
  id: "sales-001",
  name: "김영업",
  sales_code: "SALES001",
  sales_wallet: { current_balance: 12500 },
  linked_users: 8,
  total_reward: 45000,
};

export const mockOrders = [
  { id: "order-001", status: "PRINT_SUCCESS", total_amount: 5000, card_amount: 2000, point_used: 3000, created_at: "2026-06-18 14:30" },
  { id: "order-002", status: "PRINTING",      total_amount: 3000, card_amount: 3000, point_used: 0,    created_at: "2026-06-18 14:35" },
  { id: "order-003", status: "PRINT_SUCCESS", total_amount: 3000, card_amount: 0,    point_used: 3000, created_at: "2026-06-18 14:40" },
  { id: "order-004", status: "PAID",          total_amount: 4500, card_amount: 1500, point_used: 3000, created_at: "2026-06-18 14:45" },
];

export const mockUserLedger = [
  { id: "ul-001", type: "WELCOME_BONUS", amount: +3000, status: "SUCCESS",    reference_id: null,      reference_type: "SIGNUP",  created_at: "2026-06-18 09:00", target_name: "홍길동" },
  { id: "ul-002", type: "POINT_USE",     amount: -3000, status: "SUCCESS",    reference_id: "pay-001", reference_type: "PAYMENT", created_at: "2026-06-18 14:30", target_name: "홍길동" },
  { id: "ul-003", type: "WELCOME_BONUS", amount: +3000, status: "SUCCESS",    reference_id: null,      reference_type: "SIGNUP",  created_at: "2026-06-18 10:00", target_name: "이철수" },
  { id: "ul-004", type: "ADMIN_GRANT",   amount: +1000, status: "SUCCESS",    reference_id: null,      reference_type: "SYSTEM",  created_at: "2026-06-18 11:00", target_name: "홍길동" },
];

export const mockSalesLedger = [
  { id: "sl-001", type: "SALES_REWARD",    amount: +200,  status: "SUCCESS",     reference_id: "pay-001", reference_type: "PAYMENT", created_at: "2026-06-18 14:31", target_name: "김영업" },
  { id: "sl-002", type: "REFUND_ROLLBACK", amount: -100,  status: "UNRECOVERED", reference_id: "ref-001", reference_type: "REFUND",  created_at: "2026-06-18 14:32", target_name: "김영업" },
  { id: "sl-003", type: "SALES_REWARD",    amount: +150,  status: "SUCCESS",     reference_id: "pay-002", reference_type: "PAYMENT", created_at: "2026-06-18 14:41", target_name: "김영업" },
];

export const mockSalesList = [
  { id: "sales-001", name: "김영업", sales_code: "SALES001", sales_wallet: { current_balance: 12500 }, linked_users: 8, total_reward: 45000 },
  { id: "sales-002", name: "박영업", sales_code: "SALES002", sales_wallet: { current_balance: 3200 },  linked_users: 3, total_reward: 12000 },
];

export const mockStoreList = [
  { id: "store-001", name: "강남점",  address: "서울시 강남구 테헤란로 123",  owner_email: "store01@pospic.com", sales_id: "sales-001", sales_name: "김영업", sales_code: "SALES001" },
  { id: "store-002", name: "홍대점",  address: "서울시 마포구 홍익로 45",    owner_email: "store02@pospic.com", sales_id: "sales-002", sales_name: "박영업", sales_code: "SALES002" },
  { id: "store-003", name: "신촌점",  address: "서울시 서대문구 신촌로 78",   owner_email: "store03@pospic.com", sales_id: null,        sales_name: null,     sales_code: null },
];

export const mockSystemSettings = { price_per_sheet: 1500 };

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
  WELCOME_BONUS:  "가입보너스",
  POINT_USE:      "포인트사용",
  ADMIN_GRANT:    "관리자지급",
  ADMIN_DEDUCT:   "관리자차감",
  SALES_REWARD:   "영업리워드",
  REFUND_ROLLBACK:"리워드회수",
};
