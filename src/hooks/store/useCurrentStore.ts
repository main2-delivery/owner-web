import { useEffect } from 'react'
import { createMockStore, useMockStore } from '../../utils/mockStore'
import { storeApi } from '../../api/store/storeApi'
import { MOCK_STORE_DETAIL } from '../../mocks/store'
import type { StoreDetail } from '../../types/store'

// api: owner-server 에서 받은 실제 가게 · mock: 서버가 꺼져 있거나 내 가게가 없어 목업으로 보여 주는 중
export type DataSource = 'loading' | 'api' | 'mock'

interface CurrentStore {
  source: DataSource
  store: StoreDetail
}

// 모든 화면이 같이 보는 "지금 관리 중인 가게".
// X-Test-User-Id 점주의 가게 중 VITE_TEST_STORE_ID 가게(없으면 첫 가게)를 불러온다
const current = createMockStore<CurrentStore>({ source: 'loading', store: MOCK_STORE_DETAIL })
let started = false

async function load() {
  try {
    const stores = await storeApi.getMyStores()
    const preferred = Number(import.meta.env.VITE_TEST_STORE_ID)
    const target = stores.find((s) => s.storeId === preferred) ?? stores[0]
    if (!target) throw new Error('연결된 가게가 없어요')
    current.set({ source: 'api', store: await storeApi.getStore(target.storeId) })
  } catch {
    current.set({ source: 'mock', store: MOCK_STORE_DETAIL })
  }
}

export function useCurrentStore() {
  useEffect(() => {
    if (started) return
    started = true
    void load()
  }, [])
  const state = useMockStore(current)
  return {
    ...state,
    setStore: (store: StoreDetail) => current.set((prev) => ({ ...prev, store })),
  }
}
