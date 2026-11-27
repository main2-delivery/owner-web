import { useCallback, useEffect, useState } from 'react'
import Banner from '../../components/layout/Banner'
import StatusTabs from '../../components/order/StatusTabs'
import OrderList from '../../components/order/OrderList'
import OrderDetail from '../../components/order/OrderDetail'
import OrderActions from '../../components/order/OrderActions'
import NewOrderPopup from '../../components/order/NewOrderPopup'
import RejectReasonModal from '../../components/order/RejectReasonModal'
import Toast from '../../components/common/Toast'
import { useOrderBoard } from '../../hooks/order/useOrderBoard'
import { useStoreOpen } from '../../hooks/store/useStoreOpen'
import {
  ACCEPT_DELAY_MINUTES,
  AUTO_CANCEL_MINUTES,
  AUTO_CANCEL_REASON,
  BUSY_PENDING_COUNT,
  ORDERS_PER_MINUTE_LIMIT,
} from '../../constants/order'
import { recommendCookMinutes } from '../../utils/cookTime'

const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

// OWN-02 ~ OWN-11, OWN-24: 주문판 한 화면에서 접수 → 조리 → 픽업까지 처리한다
// 상단 바·내비 바·로그아웃은 OwnerLayout 이 그린다
export default function OrderBoardPage() {
  const board = useOrderBoard()
  const { actions, selectedOrder } = board
  const { isOpen, setIsOpen } = useStoreOpen()

  const [popupHidden, setPopupHidden] = useState(false)
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])

  // 화면을 연 뒤 지난 초. 목업 주문의 경과 시간에 더해 자동 취소 카운트다운에 쓴다
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // 가장 오래 기다린 신규 주문 (자동 취소 대상)
  const oldest = board.pendingOrders.reduce<(typeof board.pendingOrders)[number] | null>(
    (a, o) => (a == null || o.elapsedMinutes > a.elapsedMinutes ? o : a),
    null,
  )
  const waitedSec = oldest ? oldest.elapsedMinutes * 60 + tick : 0
  const delayed = oldest != null && waitedSec >= ACCEPT_DELAY_MINUTES * 60
  const remainSec = Math.max(0, AUTO_CANCEL_MINUTES * 60 - waitedSec)

  // 접수 대기 시간을 넘기면 자동 취소·환불 (DUDU-67). 연동 후에는 서버가 처리하고 화면은 결과만 받는다
  useEffect(() => {
    if (!oldest || remainSec > 0) return
    actions.reject(oldest.id, AUTO_CANCEL_REASON)
    setToast(`#${oldest.displayNo} 주문이 자동 취소되고 고객에게 환불됐어요`)
  }, [oldest, remainSec, actions])

  const queued = board.orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'COOKING').length
  const recommendation = selectedOrder?.status === 'PENDING' ? recommendCookMinutes(selectedOrder, queued) : null

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
      {!isOpen && (
        <Banner
          tone="muted"
          message="지금은 준비중이라 새 주문을 받지 않아요"
          actionLabel="영업 시작"
          onAction={() => setIsOpen(true)}
        />
      )}
      {isOpen && delayed && oldest && (
        <Banner
          tone="warning"
          message={`#${oldest.displayNo} 접수 대기 ${Math.floor(waitedSec / 60)}분째예요 · ${Math.ceil(remainSec / 60)}분 안에 접수하지 않으면 자동 취소되고 고객에게 환불돼요`}
          trailing={<span className="countdown">{mmss(remainSec)} 남음</span>}
        />
      )}

      <div className="board-body">
        <aside className="board-left">
          <StatusTabs active={board.tab} counts={board.counts} onChange={board.setTab} />
          <OrderList
            orders={board.visibleOrders}
            selectedId={selectedOrder?.id ?? null}
            onSelect={board.setSelectedId}
          />
          {board.pendingOrders.length >= BUSY_PENDING_COUNT && (
            <p className="busy-note">
              <span className="pill pill-yellow">주문 몰림 보호 · 1분에 {ORDERS_PER_MINUTE_LIMIT}건까지 접수</span>
            </p>
          )}
        </aside>
        <main className="board-right">
          <OrderDetail order={selectedOrder} recommendation={recommendation} />
          <OrderActions
            order={selectedOrder}
            recommendedMinutes={recommendation?.minutes}
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
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
