import type { Order } from '../../types/order'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { COOK_MINUTE_OPTIONS } from '../../constants/order'
import { formatWon } from '../../utils/format'

interface Props {
  orders: Order[] // 접수 대기 중인 주문 전체. 첫 번째를 보여준다
  onAccept: (id: number, minutes: number) => void
  onReject: (id: number) => void
  onLater: () => void
}

export default function NewOrderPopup({ orders, onAccept, onReject, onLater }: Props) {
  const [order] = orders
  if (!order) return null

  return (
    <Modal width={560}>
      <header className="popup-header">
        <h3>신규 주문{orders.length > 1 && <span className="badge">{orders.length}건</span>}</h3>
        <span className="muted">{order.history.orderedAt}</span>
      </header>
      <p className="popup-no">#{order.displayNo}</p>

      <ul className="popup-items">
        {order.items.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>x{item.quantity}</span>
            <span>{formatWon(item.price)}</span>
          </li>
        ))}
      </ul>
      {order.storeRequest && <div className="notice">가게 요청: {order.storeRequest}</div>}

      <div className="popup-total">
        <strong>결제금액</strong>
        <strong>{formatWon(order.totalPrice)}</strong>
      </div>

      <p className="muted">예상 조리 시간을 누르면 바로 접수돼요</p>
      <div className="popup-minutes">
        {COOK_MINUTE_OPTIONS.map((m) => (
          <Button key={m} variant="outline" onClick={() => onAccept(order.id, m)}>
            {m}분
          </Button>
        ))}
      </div>
      <div className="popup-footer">
        <Button variant="secondary" onClick={() => onReject(order.id)}>
          거절
        </Button>
        <Button variant="secondary" onClick={onLater}>
          나중에 보기
        </Button>
      </div>
    </Modal>
  )
}
