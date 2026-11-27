import type { Review } from '../types/review'

export const REVIEW_STATS = { average: 4.6, total: 128, distribution: { 5: 92, 4: 24, 3: 7, 2: 3, 1: 2 } as Record<number, number> }

export const REPLY_TEMPLATES = [
  { label: '감사 인사', text: '맛있게 드셔 주셔서 감사해요! 다음에도 정성껏 만들어 드릴게요.' },
  { label: '배달 지연 사과', text: '늦어져서 정말 죄송해요. 주문이 몰려 조리가 밀렸어요. 다음엔 더 빨리 보내드릴게요!' },
  { label: '재방문 부탁', text: '소중한 리뷰 감사해요. 또 찾아주시면 더 맛있게 준비할게요 😊' },
]

export const MOCK_REVIEWS: Review[] = [
  { reviewId: 1, nickname: '떡볶이러버', rating: 5, createdAt: '오늘 13:02', menuSummary: '로제 떡볶이, 모둠튀김', content: '로제 소스가 진짜 꾸덕해요! 튀김도 바삭하게 왔어요. 또 시킬게요', hasPhoto: true, reply: null, orderNo: '20261126-120', orderTimeline: '12:31 접수 · 13:00 배달 완료', cookMinutes: 15 },
  { reviewId: 2, nickname: '안양주민', rating: 3, createdAt: '오늘 12:40', menuSummary: '떡볶이, 참치김밥', content: '맛은 좋은데 생각보다 조금 늦게 왔어요. 김밥이 살짝 식었어요', hasPhoto: false, reply: null, orderNo: '20261126-118', orderTimeline: '11:52 접수 · 12:31 배달 완료', cookMinutes: 24 },
  { reviewId: 3, nickname: '동안구맘', rating: 4, createdAt: '어제 18:50', menuSummary: '참치김밥 x2', content: '아이들이 잘 먹었어요', hasPhoto: false, reply: null, orderNo: '20261125-201', orderTimeline: '18:02 접수 · 18:35 배달 완료', cookMinutes: 12 },
  { reviewId: 4, nickname: '분식킬러', rating: 5, createdAt: '어제 19:15', menuSummary: '모둠순대', content: '순대 양이 많고 간이랑 허파도 넉넉해요', hasPhoto: true, reply: '넉넉하게 드려야 마음이 편하죠 😊 또 찾아주세요!', orderNo: '20261125-210', orderTimeline: '18:40 접수 · 19:05 배달 완료', cookMinutes: 14 },
  { reviewId: 5, nickname: '매운맛도전', rating: 2, createdAt: '어제 12:10', menuSummary: '떡볶이', content: '덜 맵게 요청했는데 너무 매웠어요', hasPhoto: false, reply: null, orderNo: '20261125-133', orderTimeline: '11:40 접수 · 12:05 배달 완료', cookMinutes: 16 },
]
