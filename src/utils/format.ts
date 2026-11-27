export const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`

export const nowHHmm = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 1.8 → "1.8kg", 120 → "120장"
export const formatQty = (value: number, unit: string) =>
  `${Number.isInteger(value) ? value : value.toFixed(value < 1 ? 2 : 1).replace(/0$/, '')}${unit}`

export const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating)
