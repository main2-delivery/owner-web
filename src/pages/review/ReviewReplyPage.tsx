import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import ReviewCard from '../../components/review/ReviewCard'
import { useReviews } from '../../hooks/review/useReviews'
import { REPLY_TEMPLATES } from '../../mocks/reviews'

const MAX = 500

// OWN-18: 리뷰 답글 작성 (DUDU-29, 55)
export default function ReviewReplyPage() {
  const navigate = useNavigate()
  const { reviewId } = useParams()
  const { find, reply } = useReviews()
  const review = find(Number(reviewId))
  const [text, setText] = useState(review?.reply ?? '')
  if (!review) return <Navigate to="/reviews" replace />

  return (
    <div className="page">
      <PageHeader title="리뷰 답글" description={`${review.nickname}님 리뷰에 답글을 달고 있어요`}>
        <Button variant="secondary" onClick={() => navigate('/reviews')}>
          목록으로
        </Button>
      </PageHeader>
      <div className="row grow-y">
        <aside className="col w-480">
          <ReviewCard review={{ ...review, reply: null }} />
          <section className="card">
            <h3>주문 정보</h3>
            <dl className="kv">
              <dt>주문번호</dt>
              <dd>{review.orderNo}</dd>
              <dt>주문 시각</dt>
              <dd>{review.orderTimeline}</dd>
              <dt>조리 시간</dt>
              <dd>{review.cookMinutes}분 (평균 17분)</dd>
            </dl>
          </section>
        </aside>
        <section className="card grow">
          <h3>답글</h3>
          <div className="textarea-wrap grow">
            <textarea
              className="input textarea grow"
              value={text}
              maxLength={MAX}
              placeholder={`${review.nickname}님께 답글을 남겨 주세요`}
              onChange={(e) => setText(e.target.value)}
              aria-label="답글"
            />
            <span className="muted counter">
              {text.length} / {MAX}자
            </span>
          </div>
          <span className="muted strong">자주 쓰는 답글</span>
          <div className="filter-chips">
            {REPLY_TEMPLATES.map((t) => (
              <button key={t.label} type="button" className="filter-chip" onClick={() => setText(`${review.nickname}님, ${t.text}`.slice(0, MAX))}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="button-row align-right">
            <Button variant="secondary" onClick={() => navigate('/reviews')}>
              취소
            </Button>
            <Button
              disabled={!text.trim()}
              onClick={() => {
                reply(review.reviewId, text.trim())
                navigate('/reviews')
              }}
            >
              답글 등록
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
