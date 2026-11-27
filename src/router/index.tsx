import { createBrowserRouter, Navigate } from 'react-router'
import LoginPage from '../pages/auth/LoginPage'
import OwnerLayout from '../components/layout/OwnerLayout'
import OrderBoardPage from '../pages/order/OrderBoardPage'
import MenuListPage from '../pages/menu/MenuListPage'
import MenuFormPage from '../pages/menu/MenuFormPage'
import ReviewListPage from '../pages/review/ReviewListPage'
import ReviewReplyPage from '../pages/review/ReviewReplyPage'
import TodaySummaryPage from '../pages/sales/TodaySummaryPage'
import OrderHistoryPage from '../pages/sales/OrderHistoryPage'
import InventoryPage from '../pages/inventory/InventoryPage'
import StocktakePage from '../pages/inventory/StocktakePage'
import PurchaseSuggestionPage from '../pages/inventory/PurchaseSuggestionPage'
import StoreInfoPage from '../pages/store/StoreInfoPage'
import StoreApplyPage from '../pages/store/StoreApplyPage'
import BusinessHoursPage from '../pages/store/BusinessHoursPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    // 로그인 후 화면은 모두 상단 바 + 내비 바 안에 그린다
    element: <OwnerLayout />,
    children: [
      { path: '/orders', element: <OrderBoardPage /> },
      { path: '/menus', element: <MenuListPage /> },
      { path: '/menus/new', element: <MenuFormPage /> },
      { path: '/menus/:menuId', element: <MenuFormPage /> },
      { path: '/reviews', element: <ReviewListPage /> },
      { path: '/reviews/:reviewId', element: <ReviewReplyPage /> },
      { path: '/sales', element: <TodaySummaryPage /> },
      { path: '/sales/orders', element: <OrderHistoryPage /> },
      { path: '/inventory', element: <InventoryPage /> },
      { path: '/inventory/stocktake', element: <StocktakePage /> },
      { path: '/inventory/purchase', element: <PurchaseSuggestionPage /> },
      { path: '/store', element: <StoreInfoPage /> },
      { path: '/store/apply', element: <StoreApplyPage /> },
      { path: '/store/hours', element: <BusinessHoursPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
