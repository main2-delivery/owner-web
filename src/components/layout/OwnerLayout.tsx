import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import TopBar from './TopBar'
import NavBar from './NavBar'
import LogoutModal from './LogoutModal'
import { StoreOpenContext } from '../../hooks/store/useStoreOpen'

// 로그인 후 모든 화면의 틀: 상단 바 + 내비 바 + 화면 내용
export default function OwnerLayout() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <StoreOpenContext value={{ isOpen, setIsOpen }}>
      <div className="app-shell">
        <TopBar isOpen={isOpen} onToggleOpen={() => setIsOpen(!isOpen)} onLogout={() => setShowLogout(true)} />
        <NavBar />
        <div className="app-main">
          <Outlet />
        </div>
        {showLogout && <LogoutModal onCancel={() => setShowLogout(false)} onConfirm={() => navigate('/login')} />}
      </div>
    </StoreOpenContext>
  )
}
