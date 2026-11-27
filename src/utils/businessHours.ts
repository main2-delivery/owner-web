import type { BusinessHour, Weekday } from '../types/store'

export const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'MON', label: '월' },
  { key: 'TUE', label: '화' },
  { key: 'WED', label: '수' },
  { key: 'THU', label: '목' },
  { key: 'FRI', label: '금' },
  { key: 'SAT', label: '토' },
  { key: 'SUN', label: '일' },
]

// Date.getDay(): 0=일 ~ 6=토
export const todayKey = (date = new Date()): Weekday => (['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const)[date.getDay()]

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export type Segment = { kind: 'closed' | 'open' | 'break'; from: number; to: number }

// 하루(0~24시)를 영업 종료 / 영업중 / 브레이크 구간으로 나눈다
export function daySegments(h: BusinessHour): Segment[] {
  const end = 24 * 60
  if (h.closed || !h.open || !h.close) return [{ kind: 'closed', from: 0, to: end }]
  const open = toMinutes(h.open)
  const close = toMinutes(h.close)
  const segs: Segment[] = [{ kind: 'closed', from: 0, to: open }]
  if (h.breakStart && h.breakEnd) {
    segs.push({ kind: 'open', from: open, to: toMinutes(h.breakStart) })
    segs.push({ kind: 'break', from: toMinutes(h.breakStart), to: toMinutes(h.breakEnd) })
    segs.push({ kind: 'open', from: toMinutes(h.breakEnd), to: close })
  } else {
    segs.push({ kind: 'open', from: open, to: close })
  }
  segs.push({ kind: 'closed', from: close, to: end })
  return segs.filter((s) => s.to > s.from)
}

const LABEL = { open: '영업 시작 → 영업중', break: '브레이크타임 시작 → 준비중', closed: '영업 종료 → 준비중' }

// 지금 이후 첫 상태 전환. 오늘 남은 전환이 없으면 null
export function nextTransition(h: BusinessHour, now = new Date()) {
  const cur = now.getHours() * 60 + now.getMinutes()
  const next = daySegments(h).find((s) => s.from > cur)
  if (!next) return null
  const hh = String(Math.floor(next.from / 60)).padStart(2, '0')
  const mm = String(next.from % 60).padStart(2, '0')
  return `${hh}:${mm} ${LABEL[next.kind]}`
}
