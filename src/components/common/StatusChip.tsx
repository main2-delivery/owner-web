import type { OrderStatus } from '../../types/common'
import { STATUS_LABEL } from '../../constants/order'

export default function StatusChip({ status }: { status: OrderStatus }) {
  return <span className={`chip chip-${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>
}
