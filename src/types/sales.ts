import type { OrderStatus } from './common'

// 오늘 요약·주문 내역 (DUDU-31, 백엔드 미구현)
export interface TodaySummary {
  date: string
  salesAmount: number
  salesDiff: number // 어제 같은 시각 대비
  orderCount: number
  orderCountYesterday: number
  avgCookMinutes: number
  targetCookMinutes: number
  rejectedCount: number
  rejectedNote: string
  hourly: { hour: number; count: number }[]
  popularMenus: { name: string; count: number; amount: number }[]
}

export interface OrderHistoryRow {
  orderNo: string
  orderedAt: string // HH:mm
  menuSummary: string
  totalPrice: number
  paymentMethod: string
  status: OrderStatus
}

export type HistoryPeriod = 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH'
