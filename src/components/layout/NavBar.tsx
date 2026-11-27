import { NavLink } from 'react-router'

// 상단 바 아래 메뉴 (Figma 점주/내비 바)
const NAV_ITEMS = [
  { to: '/orders', label: '주문' },
  { to: '/menus', label: '메뉴 관리' },
  { to: '/reviews', label: '리뷰' },
  { to: '/sales', label: '매출·주문 내역' },
  { to: '/inventory', label: '재고·발주' },
  { to: '/store', label: '가게 정보' },
  { to: '/store/hours', label: '영업시간' },
]

export default function NavBar() {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          // '/store' 는 '/store/hours' 에서도 켜지지 않게 정확히 맞을 때만
          end={item.to === '/store'}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
