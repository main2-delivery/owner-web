import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import TopBar from '../../components/layout/TopBar'
import Banner from '../../components/layout/Banner'
import LogoutModal from '../../components/layout/LogoutModal'
import StatusTabs from '../../components/order/StatusTabs'
import OrderList from '../../components/order/OrderList'
import OrderDetail from '../../components/order/OrderDetail'
import OrderActions from '../../components/order/OrderActions'
import NewOrderPopup from '../../components/order/NewOrderPopup'
import RejectReasonModal from '../../components/order/RejectReasonModal'
import Toast from '../../components/common/Toast'
import { useOrderBoard } from '../../hooks/order/useOrderBoard'
import { ACCEPT_DELAY_MINUTES } from '../../constants/order'

// OWN-02 ~ OWN-11: 주문판 한 화면에서 접수 → 조리 → 픽업까지 처리한다
export default function OrderBoardPage() {
  const navigate = useNavigate()
  const board = useOrderBoard()
  const { actions, selectedOrder } = board

  const [isOpen, setIsOpen] = useState(true)
  const [popupHidden, setPopupHidden] = useState(false)
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null)
  const [showLogout, setShowLogout] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])

  const delayed = board.pendingOrders.some((o) => o.elapsedMinutes >= ACCEPT_DELAY_MINUTES)

  const accept = (id: number, minutes: number) => {
    actions.accept(id, minutes)
    board.follow(id, 'ACCEPTED')
    setToast(`주문을 접수했어요 · 예상 ${minutes}분`)
  }
  const reject = (reason: string) => {
    if (rejectTargetId == null) return
    actions.reject(rejectTargetId, reason)
    setRejectTargetId(null)
    setToast('주문을 거절했어요')
  }

  return (
    <div className="board">
      <TopBar isOpen={isOpen} onToggleOpen={() => setIsOpen((v) => !v)} onLogout={() => setShowLogout(true)} />
      {!isOpen && (
        <Banner
          tone="muted"
          message="지금은 준비중이라 새 주문을 받지 않아요"
          actionLabel="영업 시작"
          onAction={() => setIsOpen(true)}
        />
      )}
      {isOpen && delayed && <Banner tone="warning" message="접수를 기다리는 주문이 있어요. 빨리 확인해 주세요" />}

      <div className="board-body">
        <aside className="board-left">
          <StatusTabs active={board.tab} counts={board.counts} onChange={board.setTab} />
          <OrderList
            orders={board.visibleOrders}
            selectedId={selectedOrder?.id ?? null}
            onSelect={board.setSelectedId}
          />
        </aside>
        <main className="board-right">
          <OrderDetail order={selectedOrder} />
          <OrderActions
            order={selectedOrder}
            onAccept={(m) => selectedOrder && accept(selectedOrder.id, m)}
            onReject={() => selectedOrder && setRejectTargetId(selectedOrder.id)}
            onStartCooking={() => selectedOrder && (actions.startCooking(selectedOrder.id), board.follow(selectedOrder.id, 'COOKING'))}
            onAddTime={() => selectedOrder && actions.addCookTime(selectedOrder.id, 5)}
            onFinishCooking={() => selectedOrder && (actions.finishCooking(selectedOrder.id), board.follow(selectedOrder.id, 'COOKED'))}
            onPickUp={() => {
              if (!selectedOrder) return
              actions.pickUp(selectedOrder.id)
              board.follow(selectedOrder.id, 'DONE')
              setToast('픽업 완료! 배달이 시작됐어요')
            }}
          />
        </main>
      </div>

      {isOpen && !popupHidden && rejectTargetId == null && (
        <NewOrderPopup
          orders={board.pendingOrders}
          onAccept={accept}
          onReject={setRejectTargetId}
          onLater={() => setPopupHidden(true)}
        />
      )}
      {rejectTargetId != null && <RejectReasonModal onCancel={() => setRejectTargetId(null)} onConfirm={reject} />}
      {showLogout && <LogoutModal onCancel={() => setShowLogout(false)} onConfirm={() => navigate('/login')} />}
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
