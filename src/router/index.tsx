import { createBrowserRouter, Navigate } from 'react-router'
import LoginPage from '../pages/auth/LoginPage'
import OrderBoardPage from '../pages/order/OrderBoardPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/orders', element: <OrderBoardPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
