import type { OrderHistoryRow, TodaySummary } from '../types/sales'

export const MOCK_TODAY_SUMMARY: TodaySummary = {
  date: '11월 26일(수)',
  salesAmount: 412500,
  salesDiff: 38000,
  orderCount: 27,
  orderCountYesterday: 23,
  avgCookMinutes: 17,
  targetCookMinutes: 20,
  rejectedCount: 1,
  rejectedNote: '재료 소진 1',
  hourly: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((hour) => ({ hour, count: [1, 4, 9, 6, 2][hour - 10] ?? 0 })),
  popularMenus: [
    { name: '떡볶이', count: 14, amount: 70000 },
    { name: '로제 떡볶이', count: 13, amount: 84500 },
    { name: '모둠튀김', count: 9, amount: 45000 },
    { name: '참치김밥', count: 8, amount: 32000 },
    { name: '모둠순대', count: 6, amount: 27000 },
  ],
}

export const MOCK_ORDER_HISTORY: OrderHistoryRow[] = [
  { orderNo: '20261126-127', orderedAt: '14:26', menuSummary: '떡볶이 외 1개', totalPrice: 17500, paymentMethod: '카드', status: 'PENDING' },
  { orderNo: '20261126-126', orderedAt: '14:10', menuSummary: '로제 떡볶이 외 2개', totalPrice: 22000, paymentMethod: '카드', status: 'COOKING' },
  { orderNo: '20261126-125', orderedAt: '13:58', menuSummary: '참치김밥 x2', totalPrice: 11000, paymentMethod: '간편결제', status: 'COOKED' },
  { orderNo: '20261126-124', orderedAt: '13:41', menuSummary: '모둠순대 외 1개', totalPrice: 12500, paymentMethod: '카드', status: 'DELIVERED' },
  { orderNo: '20261126-123', orderedAt: '13:20', menuSummary: '떡볶이 x2', totalPrice: 13000, paymentMethod: '간편결제', status: 'DELIVERED' },
  { orderNo: '20261126-122', orderedAt: '13:05', menuSummary: '모둠튀김 외 1개', totalPrice: 15000, paymentMethod: '카드', status: 'REJECTED' },
  { orderNo: '20261126-121', orderedAt: '12:52', menuSummary: '로제 떡볶이', totalPrice: 9500, paymentMethod: '카드', status: 'DELIVERED' },
  { orderNo: '20261126-120', orderedAt: '12:31', menuSummary: '로제 떡볶이, 모둠튀김', totalPrice: 14500, paymentMethod: '카드', status: 'DELIVERED' },
  { orderNo: '20261126-119', orderedAt: '12:20', menuSummary: '참치김밥 외 2개', totalPrice: 16000, paymentMethod: '간편결제', status: 'DELIVERED' },
  { orderNo: '20261126-118', orderedAt: '11:52', menuSummary: '떡볶이, 참치김밥', totalPrice: 12000, paymentMethod: '카드', status: 'DELIVERED' },
]
