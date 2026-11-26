export const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`

export const nowHHmm = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
