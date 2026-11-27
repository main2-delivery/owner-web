import { NavLink } from 'react-router'

// 화면 오른쪽 위 묶음 탭 (재고 현황 | 실사 보정 | 발주 제안 등). 탭마다 주소가 따로 있다
export default function SegmentTabs({ items }: { items: { to: string; label: string }[] }) {
  return (
    <div className="segmented">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end className={({ isActive }) => (isActive ? 'active' : '')}>
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
