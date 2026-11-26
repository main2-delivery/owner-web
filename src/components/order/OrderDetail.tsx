import type { Order } from '../../types/order'
import StatusChip from '../common/StatusChip'
import StatusHistoryBar from './StatusHistoryBar'
import { formatWon } from '../../utils/format'

export default function OrderDetail({ order }: { order: Order | null }) {
  if (!order) {
    return (
      <section className="order-detail empty">
        <strong>왼쪽에서 주문을 선택하세요</strong>
      </section>
    )
  }

  return (
    <section className="order-detail">
      <header className="detail-header">
        <div>
          <h2>주문번호 {order.orderNo}</h2>
          <p className="muted">
            {order.history.orderedAt} 주문 · {order.paymentMethod}
          </p>
        </div>
        <StatusChip status={order.status} />
      </header>

      {order.status === 'COOKING' && <div className="cook-timer">남은 조리 시간 {order.cookMinutes}:00</div>}
      {order.status === 'COOKED' && (
        <div className="notice notice-strong">배달 로봇이 오면 음식을 건네고 픽업 완료를 눌러주세요</div>
      )}

      {(order.storeRequest || order.deliveryRequest) && (
        <div className="notice">
          {order.storeRequest && <p>가게 요청: {order.storeRequest}</p>}
          {order.deliveryRequest && <p>배달 요청: {order.deliveryRequest}</p>}
        </div>
      )}

      <table className="menu-table">
        <thead>
          <tr>
            <th>메뉴명</th>
            <th>수량</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>x{item.quantity}</td>
              <td>{formatWon(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="price-summary">
        <div>
          <dt>메뉴 합계</dt>
          <dd>{formatWon(order.menuTotal)}</dd>
        </div>
        <div>
          <dt>배달비</dt>
          <dd>{formatWon(order.deliveryFee)}</dd>
        </div>
        <div className="total">
          <dt>결제금액</dt>
          <dd>{formatWon(order.totalPrice)}</dd>
        </div>
      </dl>

      <p className="address">
        <span className="muted">배달 주소</span> {order.deliveryAddress}
      </p>

      <StatusHistoryBar history={order.history} />
    </section>
  )
}
