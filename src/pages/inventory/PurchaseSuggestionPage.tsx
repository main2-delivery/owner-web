import { useCallback, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SegmentTabs from '../../components/common/SegmentTabs'
import Button from '../../components/common/Button'
import Pill from '../../components/common/Pill'
import Toggle from '../../components/common/Toggle'
import Toast from '../../components/common/Toast'
import { INVENTORY_TABS } from '../../constants/sales'
import { useInventory } from '../../hooks/inventory/useInventory'
import { MOCK_FORECAST, MOCK_SUGGESTIONS, SUPPLIER, UNIT_PRICE } from '../../mocks/inventory'
import { formatQty, formatWon } from '../../utils/format'

// OWN-23: 발주 제안. 최근 4주 판매로 앞으로 3일 수요를 예측해 안전 재고까지 채울 양을 추천한다 (DUDU-42)
export default function PurchaseSuggestionPage() {
  const { byId } = useInventory()
  const [selected, setSelected] = useState<number[]>(MOCK_SUGGESTIONS.filter((s) => s.suggested > 0).map((s) => s.ingredientId))
  const [autoOrder, setAutoOrder] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])

  const maxOrders = Math.max(...MOCK_FORECAST.map((f) => f.orders))
  const picked = MOCK_SUGGESTIONS.filter((s) => selected.includes(s.ingredientId) && s.suggested > 0)
  const amount = picked.reduce((sum, s) => sum + s.suggested * (UNIT_PRICE[s.ingredientId] ?? 0), 0)
  const toggle = (id: number) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div className="page">
      <PageHeader title="발주 제안" description="최근 4주 판매로 앞으로 3일 사용량을 예측했어요">
        <SegmentTabs items={INVENTORY_TABS} />
      </PageHeader>
      <div className="row grow-y">
        <div className="col grow">
          <section className="card">
            <div className="inline">
              <h3>떡볶이 예상 주문</h3>
              <Pill tone="blue">목·금 비 소식 → 배달 +15%</Pill>
            </div>
            <ul className="hbar-list">
              {MOCK_FORECAST.map((f) => (
                <li key={f.day} className={f.predicted ? 'predicted' : ''}>
                  <span>
                    {f.day}
                    {f.predicted && ' 예측'}
                  </span>
                  <span className="hbar" style={{ width: `${(f.orders / maxOrders) * 70}%` }} />
                  <span className="muted">{f.orders}건</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="card grow table-card">
            <table className="table">
              <thead>
                <tr>
                  <th className="check-col" />
                  <th>재료</th>
                  <th>현재</th>
                  <th>3일 예상 사용</th>
                  <th>추천 발주</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SUGGESTIONS.map((s) => {
                  const ing = byId(s.ingredientId)
                  if (!ing) return null
                  const disabled = s.suggested === 0
                  return (
                    <tr key={s.ingredientId} className={disabled ? 'is-off' : ''}>
                      <td>
                        <input type="checkbox" className="checkbox" checked={!disabled && selected.includes(s.ingredientId)} disabled={disabled} onChange={() => toggle(s.ingredientId)} aria-label={`${ing.name} 발주`} />
                      </td>
                      <td>
                        <b>{ing.name}</b>
                      </td>
                      <td className="muted">{formatQty(ing.stock, ing.unit)}</td>
                      <td>{formatQty(s.expectedUse, ing.unit)}</td>
                      <td className={disabled ? 'muted' : 'accent-text strong'}>{disabled ? '필요 없음' : formatQty(s.suggested, ing.unit)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </div>
        <aside className="col w-360">
          <section className="card">
            <h3>발주 요약</h3>
            <dl className="kv kv-right">
              <dt>공급처</dt>
              <dd>{SUPPLIER.name}</dd>
              <dt>품목</dt>
              <dd>{picked.length}개 선택</dd>
              <dt>예상 금액</dt>
              <dd>{formatWon(amount)}</dd>
              <dt>도착 예정</dt>
              <dd>{SUPPLIER.arrival}</dd>
            </dl>
            <div className="soft-row">
              <div>
                <b>자동 발주</b>
                <p className="muted">매일 21:00 제안대로 발주해요</p>
              </div>
              <Toggle label="자동 발주" checked={autoOrder} onChange={setAutoOrder} />
            </div>
          </section>
          <div className="grow" />
          <Button
            className="btn-lg"
            disabled={picked.length === 0}
            onClick={() => setToast(`${picked.length}개 품목 발주를 요청했어요 · ${SUPPLIER.arrival} 도착 예정`)}
          >
            {picked.length}개 품목 발주 요청
          </Button>
        </aside>
      </div>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
