import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { REJECT_REASONS } from '../../constants/order'

interface Props {
  onCancel: () => void
  onConfirm: (reason: string) => void
}

const ETC = REJECT_REASONS[REJECT_REASONS.length - 1]

export default function RejectReasonModal({ onCancel, onConfirm }: Props) {
  const [reason, setReason] = useState<string | null>(null)
  const [etcText, setEtcText] = useState('')

  const finalReason = reason === ETC ? etcText.trim() : reason
  return (
    <Modal>
      <h3>주문을 거절할까요?</h3>
      <div className="reason-list">
        {REJECT_REASONS.map((r) => (
          <label key={r} className={`reason ${reason === r ? 'checked' : ''}`}>
            <input type="radio" name="reject-reason" checked={reason === r} onChange={() => setReason(r)} />
            {r}
          </label>
        ))}
        {reason === ETC && (
          <input
            className="input"
            placeholder="거절 사유를 입력하세요"
            value={etcText}
            onChange={(e) => setEtcText(e.target.value)}
          />
        )}
      </div>
      <p className="muted">거절하면 고객에게 결제 취소 안내가 가요</p>
      <div className="modal-footer">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button variant="danger" disabled={!finalReason} onClick={() => finalReason && onConfirm(finalReason)}>
          거절하기
        </Button>
      </div>
    </Modal>
  )
}
