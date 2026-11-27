import type { Order } from '../../types/order'
import Button from '../common/Button'
import { COOK_MINUTE_OPTIONS } from '../../constants/order'

interface Props {
  order: Order | null
  recommendedMinutes?: number
  onAccept: (minutes: number) => void
  onReject: () => void
  onStartCooking: () => void
  onAddTime: () => void
  onFinishCooking: () => void
  onPickUp: () => void
}

// 주문서 아래 고정 버튼 영역. 상태마다 버튼이 다르다
export default function OrderActions({ order, recommendedMinutes, ...on }: Props) {
  if (!order) return <footer className="order-actions" />

  switch (order.status) {
    case 'PENDING':
      return (
        <footer className="order-actions">
          {COOK_MINUTE_OPTIONS.map((m) => (
            <Button key={m} className="has-badge" onClick={() => on.onAccept(m)}>
              {m === recommendedMinutes && <span className="btn-badge">추천</span>}
              {m}분
            </Button>
          ))}
          <Button variant="secondary" onClick={on.onReject}>
            거절
          </Button>
        </footer>
      )
    case 'ACCEPTED':
      return (
        <footer className="order-actions">
          <Button block onClick={on.onStartCooking}>
            조리 시작
          </Button>
        </footer>
      )
    case 'COOKING':
      return (
        <footer className="order-actions">
          <Button block onClick={on.onFinishCooking}>
            조리 완료
          </Button>
          <Button variant="secondary" onClick={on.onAddTime}>
            +5분
          </Button>
        </footer>
      )
    case 'COOKED':
      return (
        <footer className="order-actions">
          <Button block onClick={on.onPickUp}>
            픽업 완료
          </Button>
        </footer>
      )
    default:
      return <footer className="order-actions" />
  }
}
