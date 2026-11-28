import { useEffect } from 'react'
import { createMockStore, useMockStore } from '../../utils/mockStore'
import { reviewApi } from '../../api/review/reviewApi'
import { MOCK_REVIEWS } from '../../mocks/reviews'
import { useCurrentStore } from '../store/useCurrentStore'
import type { Review } from '../../types/review'

// 리뷰 조회·답글은 owner-server(reviewApi)와 연동한다 (서버가 꺼져 있으면 목업).
// 사진·별점 필터와 별점 통계를 화면에서 계산하려고, 가게 리뷰를 페이지 단위로 끝까지 불러온다
const PAGE_SIZE = 100
const MAX_PAGES = 10

const reviews = createMockStore<Review[]>([])
const loading = createMockStore(true)
let loadedKey: string | null = null

async function loadAll(storeId: number) {
  const all: Review[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await reviewApi.getReviews(storeId, { page, size: PAGE_SIZE })
    all.push(...res.reviews)
    if (!res.hasNext) break
  }
  return all
}

export function useReviews() {
  const { source, store } = useCurrentStore()
  const list = useMockStore(reviews)
  const isLoading = useMockStore(loading) || source === 'loading'
  const isApi = source === 'api'

  useEffect(() => {
    const key = `${source}:${store.storeId}`
    if (source === 'loading' || loadedKey === key) return
    loadedKey = key
    if (source === 'mock') {
      reviews.set(MOCK_REVIEWS)
      loading.set(false)
      return
    }
    loading.set(true)
    loadAll(store.storeId)
      .then((data) => reviews.set(data))
      .catch(() => {
        loadedKey = null
      })
      .finally(() => loading.set(false))
  }, [source, store.storeId])

  const patch = (reviewId: number, next: Partial<Review>) =>
    reviews.set((prev) => prev.map((r) => (r.reviewId === reviewId ? { ...r, ...next } : r)))

  return {
    reviews: list,
    loading: isLoading,
    find: (reviewId: number) => list.find((r) => r.reviewId === reviewId),
    unansweredCount: list.filter((r) => r.reply == null).length,
    reply: async (reviewId: number, text: string) => {
      if (!isApi) return patch(reviewId, { reply: text, repliedAt: new Date().toISOString() })
      const saved = await reviewApi.putReply(reviewId, text)
      patch(reviewId, { reply: saved.reply, repliedAt: saved.repliedAt })
    },
    removeReply: async (reviewId: number) => {
      if (isApi) await reviewApi.deleteReply(reviewId)
      patch(reviewId, { reply: null, repliedAt: null })
    },
  }
}
