export const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`

export const nowHHmm = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 1.8 → "1.8kg", 120 → "120장"
export const formatQty = (value: number, unit: string) =>
  `${Number.isInteger(value) ? value : value.toFixed(value < 1 ? 2 : 1).replace(/0$/, '')}${unit}`

// 0.5 단위 별점은 반올림해서 별 5개로 보여 준다. 별점이 없으면 빈 별
export const stars = (rating: number | null) => {
  const n = Math.min(5, Math.max(0, Math.round(rating ?? 0)))
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

// ISO 시각 → "오늘 13:02" · "어제 18:50" · "2026.11.20 13:02". ISO 가 아니면(목업 문구) 그대로
export const formatDateTime = (value: string) => {
  const d = new Date(value)
  if (!/^\d{4}-\d{2}-\d{2}/.test(value) || Number.isNaN(d.getTime())) return value
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86_400_000)
  if (days === 0) return `오늘 ${hm}`
  if (days === 1) return `어제 ${hm}`
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${hm}`
}
