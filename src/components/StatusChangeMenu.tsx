import { ACCOUNT_STATUS_LABEL, ACCOUNT_STATUS_OPTIONS } from "@/mocks"

interface StatusChangeMenuProps {
  status: string
  targetLabel: string
  onChange: (next: string) => void
}

export function StatusChangeMenu({ status, targetLabel, onChange }: StatusChangeMenuProps) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`${targetLabel} 계정 상태 변경`}
      className="text-xs h-7 rounded-md border border-gray-300 bg-white px-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {ACCOUNT_STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {ACCOUNT_STATUS_LABEL[opt]}
        </option>
      ))}
    </select>
  )
}
