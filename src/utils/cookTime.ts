import type { Order } from '../types/order'
import { COOK_MINUTE_OPTIONS } from '../constants/order'

// 조리 시간 추천 (DUDU-68). 서버 예측 API 전까지 화면에서 같은 규칙으로 계산한다
// 메뉴 종류당 + 밀린 주문(접수·조리 중) + 피크 시간대 보정 → 고를 수 있는 시간 중 가장 가까운 큰 값
const BASE_MINUTES = 8
const PER_MENU_MINUTES = 2
const PER_QUEUED_ORDER_MINUTES = 4
const PEAK_EXTRA_MINUTES = 3
const PEAK_HOURS = [11, 12, 13, 17, 18, 19]

export function recommendCookMinutes(order: Order, queuedOrders: number, now = new Date()) {
  const menuMinutes = BASE_MINUTES + PER_MENU_MINUTES * order.items.length
  const peak = PEAK_HOURS.includes(now.getHours())
  const raw = menuMinutes + queuedOrders * PER_QUEUED_ORDER_MINUTES + (peak ? PEAK_EXTRA_MINUTES : 0)
  const minutes = COOK_MINUTE_OPTIONS.find((m) => m >= raw) ?? COOK_MINUTE_OPTIONS[COOK_MINUTE_OPTIONS.length - 1]

  const reasons = [`${order.items.map((i) => i.name).join('·')} 조리 ${menuMinutes}분`]
  if (queuedOrders > 0) reasons.push(`앞선 주문 ${queuedOrders}건`)
  if (peak) reasons.push('피크 시간대 보정')
  return { minutes, reason: reasons.join(' + ') }
}
