import type { ReactNode } from 'react'
import Pill from '../common/Pill'
import { stars } from '../../utils/format'
import type { Review } from '../../types/review'

export default function ReviewCard({ review, action }: { review: Review; action?: ReactNode }) {
  return (
    <article className="card review-card">
      <header className="inline">
        <b>{review.nickname}</b>
        <span className="stars" aria-label={`별점 ${review.rating}점`}>
          {stars(review.rating)}
        </span>
        <span className="muted">{review.createdAt}</span>
        <span className="grow" />
        {review.reply ? <Pill tone="green">답글 완료</Pill> : <Pill tone="orange">미답변</Pill>}
      </header>
      <span className="muted">주문 메뉴 · {review.menuSummary}</span>
      <div className="review-body">
        {review.hasPhoto && <span className="thumb thumb-lg" aria-label="리뷰 사진" />}
        <p>{review.content}</p>
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
