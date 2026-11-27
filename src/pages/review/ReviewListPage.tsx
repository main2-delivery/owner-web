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
  const { reviews, unansweredCount } = useReviews()
  const [filter, setFilter] = useState<Filter>('UNANSWERED')

  const visible = reviews.filter((r) =>
    filter === 'UNANSWERED' ? r.reply == null : filter === 'PHOTO' ? r.hasPhoto : filter === 'LOW' ? r.rating <= 3 : true,
  )

  return (
    <div className="page">
      <PageHeader title="리뷰" description="고객이 남긴 리뷰에 답글을 달 수 있어요" />
      <div className="row grow-y">
        <RatingSummary unanswered={unansweredCount} />
        <section className="col grow scroll-y">
          <FilterChips<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'ALL', label: `전체 ${reviews.length}` },
              { value: 'UNANSWERED', label: `미답변 ${unansweredCount}` },
              { value: 'PHOTO', label: '사진 리뷰' },
              { value: 'LOW', label: '별점 3점 이하' },
            ]}
          />
          {visible.map((r) => (
            <ReviewCard
              key={r.reviewId}
              review={r}
              action={
                r.reply == null && (
                  <Button variant="outline" className="btn-md" onClick={() => navigate(`/reviews/${r.reviewId}`)}>
                    답글 달기
                  </Button>
                )
              }
            />
          ))}
          {visible.length === 0 && <p className="empty-cell">해당하는 리뷰가 없어요</p>}
        </section>
      </div>
    </div>
  )
}
