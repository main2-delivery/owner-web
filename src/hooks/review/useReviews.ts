import { createMockStore, useMockStore } from '../../utils/mockStore'
import { MOCK_REVIEWS } from '../../mocks/reviews'
import type { Review } from '../../types/review'

// 리뷰 조회·답글. 지금은 목업. 백엔드 리뷰 API(DUDU-29)가 생기면 api/review 로 바꾼다
const reviews = createMockStore<Review[]>(MOCK_REVIEWS)

export function useReviews() {
  const list = useMockStore(reviews)
  return {
    reviews: list,
    find: (reviewId: number) => list.find((r) => r.reviewId === reviewId),
    unansweredCount: list.filter((r) => r.reply == null).length,
    reply: (reviewId: number, text: string) =>
      reviews.set((prev) => prev.map((r) => (r.reviewId === reviewId ? { ...r, reply: text } : r))),
  }
}
