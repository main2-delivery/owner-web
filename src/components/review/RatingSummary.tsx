import { stars } from '../../utils/format'
import type { Review } from '../../types/review'

// 불러온 리뷰로 평균 별점과 별점 분포를 계산한다 (별점 없는 리뷰는 빼고, 0.5 단위는 반올림)
export default function RatingSummary({ reviews, unanswered }: { reviews: Review[]; unanswered: number }) {
  const rated = reviews.flatMap((r) => (r.rating != null ? [r.rating] : []))
  const average = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0
  const distribution = [5, 4, 3, 2, 1].map((s) => ({ s, count: rated.filter((r) => Math.min(5, Math.max(1, Math.round(r))) === s).length }))
  const max = Math.max(1, ...distribution.map((d) => d.count))
  return (
    <section className="card w-300 rating-summary">
      <div className="inline">
        <span className="rating-big">{rated.length ? average.toFixed(1) : '-'}</span>
        <div>
          <div className="stars">{stars(average)}</div>
          <span className="muted">리뷰 {reviews.length}개</span>
        </div>
      </div>
      {distribution.map(({ s, count }) => (
        <div key={s} className="dist-row">
          <span className="muted">{s}점</span>
          <span className="progress progress-star">
            <span style={{ width: `${(count / max) * 100}%` }} />
          </span>
          <span className="muted">{count}</span>
        </div>
      ))}
      <div className="soft-row orange">
        <b>답글을 기다리는 리뷰</b>
        <b className="accent-text">{unanswered}개</b>
      </div>
      <p className="muted">답글을 단 리뷰는 재주문율이 더 높아요</p>
    </section>
  )
}
