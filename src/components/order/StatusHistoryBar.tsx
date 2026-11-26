import type { OrderHistory } from '../../types/order'

const STEPS: { key: keyof OrderHistory; label: string }[] = [
  { key: 'orderedAt', label: '주문' },
  { key: 'acceptedAt', label: '접수' },
  { key: 'cookingAt', label: '조리 시작' },
  { key: 'cookedAt', label: '조리 완료' },
  { key: 'pickedUpAt', label: '픽업' },
]

export default function StatusHistoryBar({ history }: { history: OrderHistory }) {
  return (
    <ol className="history-bar">
      {STEPS.map((s) => (
        <li key={s.key} className={history[s.key] ? 'done' : ''}>
          <strong>{s.label}</strong>
          <span>{history[s.key] ?? '—'}</span>
        </li>
      ))}
    </ol>
  )
}
