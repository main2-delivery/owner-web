// 리뷰 (DUDU-29, 백엔드 미구현)
export interface Review {
  reviewId: number
  nickname: string
  rating: number // 1~5
  createdAt: string // 오늘 13:02
  menuSummary: string
  content: string
  hasPhoto: boolean
  reply: string | null
  // 답글 화면에서 보여 주는 주문 정보
  orderNo: string
  orderTimeline: string
  cookMinutes: number
}
