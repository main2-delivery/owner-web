import type { OrderStatus } from './common'

export interface OrderItem {
  name: string
  quantity: number
  price: number // 수량 반영 금액
}

// 상태 이력 바(주문 → 접수 → 조리 시작 → 조리 완료 → 픽업) 시각. 아직이면 비워 둔다
export interface OrderHistory {
  orderedAt: string
  acceptedAt?: string
  cookingAt?: string
  cookedAt?: string
  pickedUpAt?: string
}

export interface Order {
  id: number
  orderNo: string // 20261125-253
  displayNo: number // #253
  status: OrderStatus
  paymentMethod: string
  items: OrderItem[]
  menuTotal: number
  deliveryFee: number
  totalPrice: number
  storeRequest?: string
  deliveryRequest?: string
  deliveryAddress: string
  history: OrderHistory
  elapsedMinutes: number // 주문 후 지난 시간 (목록 오른쪽 표시용)
  cookMinutes?: number // 접수 때 고른 예상 조리 시간
  rejectReason?: string
}
