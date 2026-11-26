import { MOCK_STORE } from '../../mocks/orders'

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  onLogout: () => void
}

export default function TopBar({ isOpen, onToggleOpen, onLogout }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="logo">띱</span>
        <strong>{MOCK_STORE.name}</strong>
        <button className={`open-chip ${isOpen ? 'on' : 'off'}`} onClick={onToggleOpen}>
          {isOpen ? '영업중' : '준비중'}
        </button>
      </div>
      <div className="topbar-center">오늘 주문 {MOCK_STORE.todayOrderCount}건</div>
      <div className="topbar-right">
        <span className="muted">알림음 켜짐</span>
        <span>{MOCK_STORE.ownerName}</span>
        <button className="btn btn-secondary btn-sm" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  )
}
