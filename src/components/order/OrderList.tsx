import type { Order } from '../../types/order'
import OrderRow from './OrderRow'
import { MOCK_STORE } from '../../mocks/orders'

interface Props {
  orders: Order[]
  selectedId: number | null
  onSelect: (id: number) => void
}

export default function OrderList({ orders, selectedId, onSelect }: Props) {
  return (
    <div className="order-list">
      {orders.length === 0 ? (
        <div className="empty">
          <strong>아직 들어온 주문이 없어요</strong>
          <p className="muted">새 주문이 들어오면 알림음과 함께 팝업이 떠요</p>
        </div>
      ) : (
        orders.map((o) => (
          <OrderRow key={o.id} order={o} selected={o.id === selectedId} onSelect={() => onSelect(o.id)} />
        ))
      )}
      <p className="store-footer muted">
        {MOCK_STORE.name} · {MOCK_STORE.address}
      </p>
    </div>
  )
}
