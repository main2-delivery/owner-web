import type { OrderStatus } from '../types/common'

// 화면의 상태 탭 6개와 백엔드 OrderStatus 매핑
export type OrderTab = 'NEW' | 'ACCEPTED' | 'COOKING' | 'COOKED' | 'DONE' | 'REJECTED'

export const ORDER_TABS: { key: OrderTab; label: string; statuses: OrderStatus[] }[] = [
  { key: 'NEW', label: '신규', statuses: ['PENDING'] },
  { key: 'ACCEPTED', label: '접수완료', statuses: ['ACCEPTED'] },
  { key: 'COOKING', label: '조리중', statuses: ['COOKING'] },
  { key: 'COOKED', label: '조리완료', statuses: ['COOKED'] },
  { key: 'DONE', label: '완료', statuses: ['DELIVERING', 'DELIVERED'] },
  { key: 'REJECTED', label: '거절', statuses: ['REJECTED', 'CANCELED'] },
]

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: '신규',
  ACCEPTED: '접수완료',
  COOKING: '조리중',
  COOKED: '조리완료',
  DELIVERING: '픽업완료',
  DELIVERED: '픽업완료',
  REJECTED: '거절',
  CANCELED: '취소',
}

export const COOK_MINUTE_OPTIONS = [10, 20, 30, 40]

export const REJECT_REASONS = ['재료 소진', '영업 종료', '배달 불가 지역', '기타 (직접 입력)']

// 신규 주문이 이 시간(분) 넘게 접수되지 않으면 접수 지연 띠 배너를 띄운다
export const ACCEPT_DELAY_MINUTES = 5
