import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Toggle from '../common/Toggle'
import Stepper from '../common/Stepper'
import type { DailyLimit, Menu } from '../../types/menu'

interface Props {
  menu: Menu
  onCancel: () => void
  onSave: (limit: DailyLimit | null) => void // null 이면 한정 해제
}

// OWN-16 한정 수량 모달. 수량 차감은 서버에서 원자적으로 해서 동시 주문이 들어와도 넘지 않는다 (DUDU-64)
export default function DailyLimitModal({ menu, onCancel, onSave }: Props) {
  const current = menu.dailyLimit
  const sold = current?.sold ?? 0
  const [quantity, setQuantity] = useState(current?.quantity ?? 20)
  const [resetDaily, setResetDaily] = useState(current?.resetDaily ?? true)
  const [showRemaining, setShowRemaining] = useState((current?.showRemainingAt ?? 5) > 0)

  return (
    <Modal width={520}>
      <h3 className="modal-title">오늘 한정 수량 · {menu.name}</h3>
      <p className="muted">정한 수량이 다 팔리면 자동으로 품절돼요. 동시에 주문이 들어와도 수량을 넘지 않아요.</p>
      <div className="soft-row big">
        <b>수량</b>
        <Stepper value={quantity} onChange={setQuantity} min={Math.max(1, sold)} />
      </div>
      <div className="progress-block">
        <div className="between">
          <span className="muted">오늘 판매</span>
          <b>
            {sold} / {quantity}개
          </b>
        </div>
        <div className="progress">
          <span style={{ width: `${Math.min(100, (sold / quantity) * 100)}%` }} />
        </div>
      </div>
      <div className="between">
        <span>매일 영업 시작 때 수량 초기화</span>
        <Toggle label="매일 수량 초기화" checked={resetDaily} onChange={setResetDaily} />
      </div>
      <div className="between">
        <span>5개 남으면 고객 앱에 '남은 수량' 표시</span>
        <Toggle label="남은 수량 표시" checked={showRemaining} onChange={setShowRemaining} />
      </div>
      <div className="modal-footer">
        <Button variant="secondary" onClick={() => (current ? onSave(null) : onCancel())}>
          {current ? '한정 해제' : '취소'}
        </Button>
        <Button onClick={() => onSave({ quantity, sold, resetDaily, showRemainingAt: showRemaining ? 5 : 0 })}>저장</Button>
      </div>
    </Modal>
  )
}
