import { useCallback, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SegmentTabs from '../../components/common/SegmentTabs'
import Button from '../../components/common/Button'
import Pill from '../../components/common/Pill'
import Modal from '../../components/common/Modal'
import TextField from '../../components/common/TextField'
import Toast from '../../components/common/Toast'
import { INVENTORY_TABS } from '../../constants/sales'
import { stockLevel, useInventory } from '../../hooks/inventory/useInventory'
import { SUPPLIER } from '../../mocks/inventory'
import { formatQty } from '../../utils/format'
import type { StockLevel } from '../../types/inventory'

const LEVEL_PILL: Record<StockLevel, { tone: 'green' | 'yellow' | 'red'; label: string }> = {
  ENOUGH: { tone: 'green', label: '충분' },
  LOW: { tone: 'yellow', label: '주의' },
  SHORT: { tone: 'red', label: '부족' },
}

// OWN-21: 재고 현황. 주문을 접수하면 레시피대로 서버에서 자동 차감한다 (DUDU-36, 52)
export default function InventoryPage() {
  const { ingredients, recipe, byId, inbound } = useInventory()
  const [inboundId, setInboundId] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])

  const short = ingredients.filter((i) => stockLevel(i) === 'SHORT')
  const target = inboundId != null ? byId(inboundId) : undefined
  const parsed = Number(amount)

  return (
    <div className="page">
      <PageHeader title="재고 관리" description="주문을 접수하면 레시피대로 재료가 자동으로 줄어들어요">
        <SegmentTabs items={INVENTORY_TABS} />
        <Button onClick={() => setInboundId(ingredients[0].id)}>＋ 입고 등록</Button>
      </PageHeader>
      <div className="kpis cols-3">
        <section className="card kpi">
          <span className="muted strong">부족한 재료</span>
          <strong className={short.length ? 'text-danger' : ''}>{short.length}개</strong>
          <span className="muted">{short.map((i) => i.name).join(' · ') || '없어요'}</span>
        </section>
        <section className="card kpi">
          <span className="muted strong">오늘 자동 차감</span>
          <strong>48회</strong>
          <span className="muted">주문 27건 기준</span>
        </section>
        <section className="card kpi">
          <span className="muted strong">입고 예정</span>
          <strong>1건</strong>
          <span className="muted">
            {SUPPLIER.arrival} · {SUPPLIER.name}
          </span>
        </section>
      </div>
      <div className="row grow-y">
        <section className="card grow table-card">
          <table className="table">
            <thead>
              <tr>
                <th>재료</th>
                <th>현재 재고</th>
                <th>안전 재고</th>
                <th>오늘 사용</th>
                <th>상태</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ingredients.map((i) => {
                const level = LEVEL_PILL[stockLevel(i)]
                return (
                  <tr key={i.id}>
                    <td>
                      <b>{i.name}</b>
                    </td>
                    <td className={level.tone === 'red' ? 'text-danger strong' : 'strong'}>{formatQty(i.stock, i.unit)}</td>
                    <td className="muted">{formatQty(i.safetyStock, i.unit)}</td>
                    <td className="muted">{formatQty(i.usedToday, i.unit)}</td>
                    <td>
                      <Pill tone={level.tone}>{level.label}</Pill>
                    </td>
                    <td>
                      <button type="button" className="text-link" onClick={() => setInboundId(i.id)}>
                        입고
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        <section className="card w-340">
          <h3>레시피 · {recipe.menuName}</h3>
          {recipe.items.map((it) => (
            <div key={it.ingredientId} className="soft-row">
              <span>{byId(it.ingredientId)?.name}</span>
              <b>
                {it.amount}
                {it.unit}
              </b>
            </div>
          ))}
          <p className="muted">주문 1건 접수 → 위 재료가 수량만큼 자동 차감돼요. 거절·취소되면 다시 돌려놓아요.</p>
        </section>
      </div>
      {target && (
        <Modal width={440}>
          <h3 className="modal-title">입고 등록</h3>
          <label className="field">
            <span>재료</span>
            <select className="input" value={target.id} onChange={(e) => setInboundId(Number(e.target.value))}>
              {ingredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} (현재 {formatQty(i.stock, i.unit)})
                </option>
              ))}
            </select>
          </label>
          <TextField label="입고 수량" suffix={target.unit} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} autoFocus />
          <div className="modal-footer">
            <Button
              variant="secondary"
              onClick={() => {
                setInboundId(null)
                setAmount('')
              }}
            >
              취소
            </Button>
            <Button
              disabled={!(parsed > 0)}
              onClick={() => {
                inbound(target.id, parsed)
                setToast(`${target.name} ${formatQty(parsed, target.unit)} 입고했어요`)
                setInboundId(null)
                setAmount('')
              }}
            >
              입고
            </Button>
          </div>
        </Modal>
      )}
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
