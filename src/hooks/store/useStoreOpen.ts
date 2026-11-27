import { createContext, useContext } from 'react'

// 상단 바의 영업중/준비중 상태. 주문판처럼 여러 화면이 함께 쓴다 (OwnerLayout 이 제공)
export interface StoreOpenState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const StoreOpenContext = createContext<StoreOpenState>({ isOpen: true, setIsOpen: () => {} })

export const useStoreOpen = () => useContext(StoreOpenContext)
