import { useCallback, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Toast from '../../components/common/Toast'
import ReviewCard from '../../components/review/ReviewCard'
import { useReviews } from '../../hooks/review/useReviews'
import { REPLY_TEMPLATES } from '../../mocks/reviews'
import { apiErrorMessage } from '../../utils/apiError'
import { formatDateTime } from '../../utils/format'
import type { Review } from '../../types/review'

const MAX = 1000 // 백엔드 ReviewReplyRequest 최대 길이

// OWN-18: 리뷰 답글 작성·수정·삭제 (DUDU-29, 55). PUT·DELETE /api/owner/reviews/{id}/reply
export default function ReviewReplyPage() {
  const { reviewId } = useParams()
  const { find, loading, reply, removeReply } = useReviews()
  const review = find(Number(reviewId))
  if (loading) return <div className="page center muted">리뷰를 불러오는 중이에요</div>
  if (!review) return <Navigate to="/reviews" replace />
  return <ReplyForm key={review.reviewId} review={review} onReply={reply} onRemove={removeReply} />
}

interface FormProps {
  review: Review
  onReply: (reviewId: number, text: string) => Promise<void>
  onRemove: (reviewId: number) => Promise<void>
}

function ReplyForm({ review, onReply, onRemove }: FormProps) {
  const navigate = useNavigate()
  const [text, setText] = useState(review.reply ?? '')
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeError = useCallback(() => setError(null), [])
  const editing = review.reply != null

  const run = async (action: () => Promise<void>, fallback: string) => {
    setBusy(true)
    try {
      await action()
      navigate('/reviews')
    } catch (e) {
      setError(apiErrorMessage(e, fallback))
      setConfirmDelete(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <PageHeader title={editing ? '리뷰 답글 수정' : '리뷰 답글'} description={`${review.nickname}님 리뷰에 답글을 달고 있어요`}>
        {editing && (
          <Button variant="danger" disabled={busy} onClick={() => setConfirmDelete(true)}>
            답글 삭제
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate('/reviews')}>
          목록으로
        </Button>
      </PageHeader>
      <div className="row grow-y">
        <aside className="col w-480">
          <ReviewCard review={{ ...review, reply: null }} />
          {(review.orderNo || review.repliedAt) && (
            <section className="card">
              <h3>{review.orderNo ? '주문 정보' : '답글 정보'}</h3>
              <dl className="kv">
                {review.orderNo && (
                  <>
                    <dt>주문번호</dt>
                    <dd>{review.orderNo}</dd>
                    <dt>주문 시각</dt>
                    <dd>{review.orderTimeline}</dd>
                    <dt>조리 시간</dt>
                    <dd>{review.cookMinutes}분 (평균 17분)</dd>
                  </>
                )}
                {review.repliedAt && (
                  <>
                    <dt>답글 단 시각</dt>
                    <dd>{formatDateTime(review.repliedAt)}</dd>
                  </>
                )}
              </dl>
            </section>
          )}
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
              disabled={!text.trim() || text.trim() === review.reply || busy}
              onClick={() => run(() => onReply(review.reviewId, text.trim()), '답글을 저장하지 못했어요')}
            >
              {editing ? '답글 수정' : '답글 등록'}
            </Button>
          </div>
        </section>
      </div>
      {error && <Toast message={error} onClose={closeError} />}
      {confirmDelete && (
        <Modal>
          <h3 className="modal-title">답글을 삭제할까요?</h3>
          <p className="muted">삭제하면 고객 앱에서도 답글이 사라지고 미답변 리뷰로 돌아가요.</p>
          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              취소
            </Button>
            <Button variant="danger" disabled={busy} onClick={() => run(() => onRemove(review.reviewId), '답글을 삭제하지 못했어요')}>
              삭제
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
