import { useCallback, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SegmentTabs from '../../components/common/SegmentTabs'
import Button from '../../components/common/Button'
import Pill from '../../components/common/Pill'
import Toast from '../../components/common/Toast'
import { INVENTORY_TABS } from '../../constants/sales'
import { useInventory } from '../../hooks/inventory/useInventory'
import { formatQty } from '../../utils/format'

// 4주 평균 로스율 (서버 계산값, 목업)
const AVG_LOSS_RATE = 0.06
const LOSS_TARGET_ID = 1 // 떡볶이 떡

// OWN-22: 실사 보정. 세어 본 수량을 저장하면 재고 원장에 보정 기록이 남고, 로스율로 레시피 보정을 제안한다 (DUDU-65)
export default function StocktakePage() {
  const { ingredients, recipe, ledger, byId, applyStocktake, adjustRecipe } = useInventory()
  const [counted, setCounted] = useState<Record<number, string>>({})
  const [suggestionDone, setSuggestionDone] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])

  const target = byId(LOSS_TARGET_ID)
  const recipeItem = recipe.items.find((it) => it.ingredientId === LOSS_TARGET_ID)
  const filled = Object.entries(counted).filter(([, v]) => v !== '' && !Number.isNaN(Number(v)))

  return (
    <div className="page">
      <PageHeader title="실사 보정" description="실제로 세어 본 수량을 입력하면 장부와의 차이를 기록해요">
        <SegmentTabs items={INVENTORY_TABS} />
        <Button
          disabled={filled.length === 0}
          onClick={() => {
            applyStocktake(Object.fromEntries(filled.map(([id, v]) => [Number(id), Number(v)])))
            setCounted({})
            setToast(`${filled.length}개 재료를 보정했어요`)
          }}
        >
          보정 저장
        </Button>
      </PageHeader>
      <div className="row grow-y">
        <section className="card grow table-card">
          <table className="table">
            <thead>
              <tr>
                <th>재료</th>
                <th>장부 재고</th>
                <th>실사 수량</th>
                <th>차이</th>
                <th>로스율</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((i) => {
                const raw = counted[i.id] ?? ''
                const value = raw === '' ? null : Number(raw)
                const diff = value == null ? null : +(value - i.stock).toFixed(2)
                const loss = diff != null && i.stock > 0 ? Math.max(0, -diff / i.stock) : null
                return (
                  <tr key={i.id}>
                    <td>
                      <b>{i.name}</b>
                    </td>
                    <td className="muted">{formatQty(i.stock, i.unit)}</td>
                    <td>
                      <span className="input-wrap qty-input">
                        <input
                          className="input"
                          inputMode="decimal"
                          placeholder={String(i.stock)}
                          value={raw}
                          onChange={(e) => setCounted({ ...counted, [i.id]: e.target.value.replace(/[^\d.]/g, '') })}
                          aria-label={`${i.name} 실사 수량`}
                        />
                        <span className="input-suffix">{i.unit}</span>
                      </span>
                    </td>
                    <td className={diff ? 'text-danger strong' : 'muted'}>{diff == null ? '—' : `${diff > 0 ? '+' : ''}${formatQty(diff, i.unit)}`}</td>
                    <td className={loss != null && loss >= 0.04 ? 'text-danger strong' : 'muted'}>{loss == null ? '—' : `${(loss * 100).toFixed(1)}%`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        <aside className="col w-380">
          {target && recipeItem && !suggestionDone && (
            <section className="card card-orange">
              <Pill tone="solid">보정 제안</Pill>
              <h3>
                {target.name} 로스율이 4주 평균 {AVG_LOSS_RATE * 100}%예요
              </h3>
              <p>
                레시피 1인분 {recipeItem.amount}
                {recipeItem.unit} → {Math.round(recipeItem.amount * (1 + AVG_LOSS_RATE))}
                {recipeItem.unit}으로 바꾸면 장부와 실제 재고가 맞아요
              </p>
              <div className="button-row">
                <Button variant="secondary" className="btn-md grow" onClick={() => setSuggestionDone(true)}>
                  나중에
                </Button>
                <Button
                  className="btn-md grow"
                  onClick={() => {
                    adjustRecipe(LOSS_TARGET_ID, AVG_LOSS_RATE)
                    setSuggestionDone(true)
                    setToast('레시피에 반영했어요')
                  }}
                >
                  레시피에 반영
                </Button>
              </div>
            </section>
          )}
          <section className="card grow">
            <h3>재고 원장 · {target?.name}</h3>
            <ul className="ledger">
              {ledger.map((e) => (
                <li key={e.time + e.label}>
                  <span className="muted">{e.time}</span>
                  <span className="grow">{e.label}</span>
                  <b className={e.delta > 0 ? 'text-good' : e.kind === 'STOCKTAKE' ? 'text-danger' : 'muted'}>
                    {e.delta > 0 ? '+' : '−'}
                    {Math.abs(e.delta).toFixed(2)}kg
                  </b>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
