import type { Order } from '../types/order'

// 백엔드 연동 전까지 쓰는 화면 확인용 데이터
export const MOCK_STORE = {
  name: '한끼분식',
  address: '안양시 동안구 시민대로 000',
  ownerName: '김사장님',
  todayOrderCount: 12,
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 253,
    orderNo: '20261125-253',
    displayNo: 253,
    status: 'PENDING',
    paymentMethod: '카드 결제',
    items: [
      { name: '떡볶이', quantity: 2, price: 10000 },
      { name: '모둠순대', quantity: 1, price: 4500 },
    ],
    menuTotal: 14500,
    deliveryFee: 3000,
    totalPrice: 17500,
    storeRequest: '떡볶이 덜 맵게 해주세요',
    deliveryRequest: '문 앞에 두고 벨 눌러주세요',
    deliveryAddress: '안양시 동안구 평촌대로 000, 101동 1203호',
    history: { orderedAt: '14:26' },
    elapsedMinutes: 6,
  },
  {
    id: 254,
    orderNo: '20261125-254',
    displayNo: 254,
    status: 'PENDING',
    paymentMethod: '카드 결제',
    items: [
      { name: '치즈김밥', quantity: 2, price: 9000 },
      { name: '어묵', quantity: 1, price: 3000 },
    ],
    menuTotal: 12000,
    deliveryFee: 0,
    totalPrice: 12000,
    deliveryAddress: '안양시 동안구 관악대로 000, 302호',
    history: { orderedAt: '14:31' },
    elapsedMinutes: 1,
  },
]
