import { useMemo, useState } from 'react'
import type { Order } from '../../types/order'
import { ORDER_TABS, type OrderTab } from '../../constants/order'
import { MOCK_ORDERS } from '../../mocks/orders'
import { nowHHmm } from '../../utils/format'

// 주문판 상태 관리. 지금은 목업 데이터만 바꾼다. 백엔드 연동 시 각 동작에서 api/order 호출로 교체
export function useOrderBoard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [tab, setTab] = useState<OrderTab>('NEW')
  const [selectedId, setSelectedId] = useState<number | null>(MOCK_ORDERS[0]?.id ?? null)

  const counts = useMemo(
    () =>
      Object.fromEntries(
        ORDER_TABS.map((t) => [t.key, orders.filter((o) => t.statuses.includes(o.status)).length]),
      ) as Record<OrderTab, number>,
    [orders],
  )

  const visibleOrders = useMemo(() => {
    const statuses = ORDER_TABS.find((t) => t.key === tab)!.statuses
    return orders.filter((o) => statuses.includes(o.status))
  }, [orders, tab])

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null
  const pendingOrders = orders.filter((o) => o.status === 'PENDING')

  const update = (id: number, patch: (o: Order) => Partial<Order>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch(o) } : o)))

  const actions = {
    accept: (id: number, cookMinutes: number) =>
      update(id, (o) => ({ status: 'ACCEPTED', cookMinutes, history: { ...o.history, acceptedAt: nowHHmm() } })),
    reject: (id: number, reason: string) => update(id, () => ({ status: 'REJECTED', rejectReason: reason })),
    startCooking: (id: number) =>
      update(id, (o) => ({ status: 'COOKING', history: { ...o.history, cookingAt: nowHHmm() } })),
    addCookTime: (id: number, minutes: number) =>
      update(id, (o) => ({ cookMinutes: (o.cookMinutes ?? 0) + minutes })),
    finishCooking: (id: number) =>
      update(id, (o) => ({ status: 'COOKED', history: { ...o.history, cookedAt: nowHHmm() } })),
    pickUp: (id: number) =>
      update(id, (o) => ({ status: 'DELIVERING', history: { ...o.history, pickedUpAt: nowHHmm() } })),
  }

  // 처리한 주문을 따라 해당 상태 탭으로 이동
  const follow = (id: number, nextTab: OrderTab) => {
    setTab(nextTab)
    setSelectedId(id)
  }

  return {
    orders,
    tab,
    setTab,
    counts,
    visibleOrders,
    selectedOrder,
    setSelectedId,
    pendingOrders,
    actions,
    follow,
  }
}
