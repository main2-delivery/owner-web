import { ORDER_TABS, type OrderTab } from '../../constants/order'

interface Props {
  active: OrderTab
  counts: Record<OrderTab, number>
  onChange: (tab: OrderTab) => void
}

export default function StatusTabs({ active, counts, onChange }: Props) {
  return (
    <nav className="status-tabs">
      {ORDER_TABS.map((t) => (
        <button
          key={t.key}
          className={`status-tab ${active === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          <span>{t.label}</span>
          <span className={`count ${t.key === 'NEW' && counts.NEW > 0 ? 'badge' : ''}`}>{counts[t.key]}</span>
        </button>
      ))}
    </nav>
  )
}
