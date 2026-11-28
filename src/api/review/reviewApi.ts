import { client } from '../client'
import type { ApiResponse } from '../../types/common'
import type { Review, ReviewPage } from '../../types/review'

// owner-server ReviewController (/api/owner)
export const reviewApi = {
  getReviews: (storeId: number, params: { unanswered?: boolean; page?: number; size?: number } = {}) =>
    client.get<ApiResponse<ReviewPage>>(`/owner/stores/${storeId}/reviews`, { params }).then((r) => r.data.data),
  // 답글 작성·수정 모두 PUT
  putReply: (reviewId: number, reply: string) =>
    client.put<ApiResponse<Review>>(`/owner/reviews/${reviewId}/reply`, { reply }).then((r) => r.data.data),
  deleteReply: (reviewId: number) => client.delete<ApiResponse<null>>(`/owner/reviews/${reviewId}/reply`),
}
