// 백엔드 owner-server dto/review 와 필드 이름을 맞춘다

export interface Review {
  reviewId: number
  nickname: string // 수집 리뷰는 "익명"
  rating: number | null // 0.5 단위, 수집 리뷰는 null 일 수 있다
  content: string | null
  createdAt: string // ISO (목업은 "오늘 13:02" 같은 표시용 문구)
  reply: string | null // null 이면 미답변
  repliedAt: string | null
  // 아래는 백엔드에 아직 없는 화면 전용 값 (목업에만 있다)
  menuSummary?: string
  hasPhoto?: boolean
  orderNo?: string
  orderTimeline?: string
  cookMinutes?: number
}

export interface ReviewPage {
  reviews: Review[]
  page: number
  hasNext: boolean
}
