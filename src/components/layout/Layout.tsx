import { NavLink, Outlet } from 'react-router'

const NAV = [
  { to: '/orders', label: '주문' },
  { to: '/menus', label: '메뉴' },
  { to: '/reviews', label: '리뷰' },
  { to: '/store', label: '가게' },
]

export default function Layout() {
  return (
    <div className="layout">
      <nav className="sidebar">
        <h1>업주 센터</h1>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
