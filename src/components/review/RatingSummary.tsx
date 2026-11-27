import { stars } from '../../utils/format'
import { REVIEW_STATS } from '../../mocks/reviews'

export default function RatingSummary({ unanswered }: { unanswered: number }) {
  const max = Math.max(...Object.values(REVIEW_STATS.distribution))
  return (
    <section className="card w-300 rating-summary">
      <div className="inline">
        <span className="rating-big">{REVIEW_STATS.average}</span>
        <div>
          <div className="stars">{stars(Math.round(REVIEW_STATS.average))}</div>
          <span className="muted">리뷰 {REVIEW_STATS.total}개</span>
        </div>
      </div>
      {[5, 4, 3, 2, 1].map((s) => (
        <div key={s} className="dist-row">
          <span className="muted">{s}점</span>
          <span className="progress progress-star">
            <span style={{ width: `${(REVIEW_STATS.distribution[s] / max) * 100}%` }} />
          </span>
          <span className="muted">{REVIEW_STATS.distribution[s]}</span>
        </div>
      ))}
      <div className="soft-row orange">
        <b>답글을 기다리는 리뷰</b>
        <b className="accent-text">{unanswered}개</b>
      </div>
      <p className="muted">최근 30일 기준 · 답글을 단 리뷰는 재주문율이 더 높아요</p>
    </section>
  )
}
