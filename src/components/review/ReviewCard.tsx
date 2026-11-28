import type { ReactNode } from 'react'
import Pill from '../common/Pill'
import { formatDateTime, stars } from '../../utils/format'
import type { Review } from '../../types/review'

export default function ReviewCard({ review, action }: { review: Review; action?: ReactNode }) {
  return (
    <article className="card review-card">
      <header className="inline">
        <b>{review.nickname}</b>
        <span className="stars" aria-label={review.rating != null ? `별점 ${review.rating}점` : '별점 없음'}>
          {stars(review.rating)}
        </span>
        <span className="muted">{formatDateTime(review.createdAt)}</span>
        <span className="grow" />
        {review.reply ? <Pill tone="green">답글 완료</Pill> : <Pill tone="orange">미답변</Pill>}
      </header>
      {review.menuSummary && <span className="muted">주문 메뉴 · {review.menuSummary}</span>}
      <div className="review-body">
        {review.hasPhoto && <span className="thumb thumb-lg" aria-label="리뷰 사진" />}
        <p>{review.content || '(내용 없이 별점만 남긴 리뷰예요)'}</p>
      </div>
      {review.reply && (
        <div className="reply-box">
          <b>사장님 답글</b>
          <p>{review.reply}</p>
        </div>
      )}
      {action && <footer className="align-right">{action}</footer>}
    </article>
  )
}
