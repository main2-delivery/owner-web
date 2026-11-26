import { createBrowserRouter } from 'react-router'
import Layout from '../components/layout/Layout'
import OrderListPage from '../pages/order/OrderListPage'
import MenuListPage from '../pages/menu/MenuListPage'
import ReviewListPage from '../pages/review/ReviewListPage'
import StorePage from '../pages/store/StorePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <OrderListPage /> },
      { path: 'orders', element: <OrderListPage /> },
      { path: 'menus', element: <MenuListPage /> },
      { path: 'reviews', element: <ReviewListPage /> },
      { path: 'store', element: <StorePage /> },
    ],
  },
])
