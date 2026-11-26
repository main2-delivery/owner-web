import Modal from '../common/Modal'
import Button from '../common/Button'

interface Props {
  onCancel: () => void
  onConfirm: () => void
}

export default function LogoutModal({ onCancel, onConfirm }: Props) {
  return (
    <Modal>
      <h3>로그아웃할까요?</h3>
      <p className="muted">로그아웃하면 새 주문 알림을 받을 수 없어요</p>
      <div className="modal-footer">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={onConfirm}>로그아웃</Button>
      </div>
    </Modal>
  )
}
