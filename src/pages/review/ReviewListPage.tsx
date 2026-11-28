import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import FilterChips from '../../components/common/FilterChips'
import Button from '../../components/common/Button'
import ReviewCard from '../../components/review/ReviewCard'
import RatingSummary from '../../components/review/RatingSummary'
import { useReviews } from '../../hooks/review/useReviews'

type Filter = 'ALL' | 'UNANSWERED' | 'PHOTO' | 'LOW'

// OWN-17: 리뷰 목록 (DUDU-29, 55)
export default function ReviewListPage() {
  const navigate = useNavigate()
  const { reviews, loading, unansweredCount } = useReviews()
  const hasPhotoInfo = reviews.some((r) => r.hasPhoto != null)
  const [filter, setFilter] = useState<Filter>('UNANSWERED')

  const visible = reviews.filter((r) =>
    filter === 'UNANSWERED' ? r.reply == null : filter === 'PHOTO' ? r.hasPhoto : filter === 'LOW' ? r.rating != null && r.rating <= 3 : true,
  )

  return (
    <div className="page">
      <PageHeader title="리뷰" description="고객이 남긴 리뷰에 답글을 달 수 있어요" />
      <div className="row grow-y">
        <RatingSummary reviews={reviews} unanswered={unansweredCount} />
        <section className="col grow scroll-y">
          <FilterChips<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'ALL', label: `전체 ${reviews.length}` },
              { value: 'UNANSWERED', label: `미답변 ${unansweredCount}` },
              // 리뷰 사진은 백엔드 응답에 아직 없어서, 사진 정보가 있을 때(목업)만 보여 준다
              ...(hasPhotoInfo ? [{ value: 'PHOTO' as const, label: '사진 리뷰' }] : []),
              { value: 'LOW', label: '별점 3점 이하' },
            ]}
          />
          {visible.map((r) => (
            <ReviewCard
              key={r.reviewId}
              review={r}
              action={
                <Button variant={r.reply == null ? 'outline' : 'secondary'} className="btn-md" onClick={() => navigate(`/reviews/${r.reviewId}`)}>
                  {r.reply == null ? '답글 달기' : '답글 수정'}
                </Button>
              }
            />
          ))}
          {loading ? <p className="empty-cell">리뷰를 불러오는 중이에요</p> : visible.length === 0 && <p className="empty-cell">해당하는 리뷰가 없어요</p>}
        </section>
      </div>
    </div>
  )
}
