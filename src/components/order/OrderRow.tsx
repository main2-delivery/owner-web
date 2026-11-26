import type { Order } from '../../types/order'
import StatusChip from '../common/StatusChip'
import { formatWon } from '../../utils/format'

// 목록 오른쪽 위 보조 정보 (경과 시간, 예상 시간 등)
function rowNote(order: Order) {
  switch (order.status) {
    case 'PENDING':
      return `${order.elapsedMinutes}분`
    case 'ACCEPTED':
      return `예상 ${order.cookMinutes}분`
    case 'COOKING':
      return `${order.cookMinutes}분 남음`
    case 'COOKED':
      return '픽업 대기'
    case 'REJECTED':
      return order.rejectReason ?? ''
    default:
      return order.history.pickedUpAt ?? ''
  }
}

interface Props {
  order: Order
  selected: boolean
  onSelect: () => void
}

export default function OrderRow({ order, selected, onSelect }: Props) {
  const [first, ...rest] = order.items
  return (
    <button className={`order-row ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="order-row-top">
        <strong className="order-no">#{order.displayNo}</strong>
        <StatusChip status={order.status} />
        <span className={`order-note ${order.status === 'PENDING' ? 'urgent' : ''}`}>{rowNote(order)}</span>
      </div>
      <div className="order-row-bottom">
        <span className="muted">
          {first.name}
          {rest.length > 0 ? ` 외 ${rest.length}개` : ` ${first.quantity}개`}
        </span>
        <strong>{formatWon(order.totalPrice)}</strong>
      </div>
    </button>
  )
}
