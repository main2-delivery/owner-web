import { useEffect } from 'react'
import { createMockStore, useMockStore } from '../../utils/mockStore'
import { menuApi } from '../../api/menu/menuApi'
import { MENU_CATEGORIES, MOCK_MENUS } from '../../mocks/menus'
import { useCurrentStore } from '../store/useCurrentStore'
import type { DailyLimit, Menu, MenuFlag } from '../../types/menu'

// 메뉴 목록·등록·수정·삭제·복사, 대표·품절·숨김은 owner-server(menuApi)와 연동한다 (서버가 꺼져 있으면 목업).
// 한정 수량·카테고리는 아직 백엔드 API가 없어 화면에서만 바뀐다
const menus = createMockStore<Menu[]>([])
const loading = createMockStore(true)
let loadedKey: string | null = null

const FLAGS: MenuFlag[] = ['soldOut', 'hidden', 'representative']

// 이미지 업로드 API 전이라, 브라우저 안에서만 열리는 blob: 미리보기 주소는 서버에 보내지 않고 기존 값을 유지한다
const persistableImage = (next: string | null, prev: string | null) => (next?.startsWith('blob:') ? prev : next)

const toRequest = (m: Menu, prevImage: string | null) => ({
  name: m.name,
  description: m.description ?? '',
  price: m.price ?? 0,
  imageUrl: persistableImage(m.imageUrl, prevImage),
})

export function useMenus() {
  const { source, store } = useCurrentStore()
  const list = useMockStore(menus)
  const isLoading = useMockStore(loading) || source === 'loading'

  useEffect(() => {
    const key = `${source}:${store.storeId}`
    if (source === 'loading' || loadedKey === key) return
    loadedKey = key
    if (source === 'mock') {
      menus.set(MOCK_MENUS)
      loading.set(false)
      return
    }
    loading.set(true)
    menuApi
      .getMenus(store.storeId)
      .then((data) => menus.set(data))
      .catch(() => {
        loadedKey = null
      })
      .finally(() => loading.set(false))
  }, [source, store.storeId])

  const update = (menuId: number, patch: Partial<Menu>) =>
    menus.set((prev) => prev.map((m) => (m.menuId === menuId ? { ...m, ...patch } : m)))
  const isApi = source === 'api'

  return {
    menus: list,
    loading: isLoading,
    // 목업은 분식집 카테고리, 실제 가게는 메뉴에 붙은 카테고리만 (백엔드에 아직 없음)
    categories: isApi ? [...new Set(list.flatMap((m) => (m.category ? [m.category] : [])))] : MENU_CATEGORIES,
    find: (menuId: number) => list.find((m) => m.menuId === menuId),
    // 화면을 먼저 바꾸고, 서버 저장이 실패하면 되돌린다
    toggle: async (menuId: number, flag: MenuFlag) => {
      const target = list.find((m) => m.menuId === menuId)
      if (!target) return
      const value = !target[flag]
      update(menuId, { [flag]: value })
      if (!isApi) return
      try {
        await menuApi.setFlag(menuId, flag, value)
      } catch (e) {
        update(menuId, { [flag]: !value })
        throw e
      }
    },
    copy: async (menuId: number) => {
      const target = list.find((m) => m.menuId === menuId)
      if (!target) return
      // 서버는 이름·설명·가격·사진만 복사하고 대표·품절·숨김은 꺼진 채로 만든다
      const base = { ...target, soldOut: false, hidden: false, representative: false, dailyLimit: null }
      const newId = isApi ? (await menuApi.copy(menuId)).menuId : Math.max(0, ...list.map((m) => m.menuId)) + 1
      menus.set((prev) => {
        const at = prev.findIndex((m) => m.menuId === menuId)
        return [...prev.slice(0, at + 1), { ...base, menuId: newId }, ...prev.slice(at + 1)]
      })
    },
    save: async (menu: Menu) => {
      if (!isApi) {
        if (list.some((m) => m.menuId === menu.menuId)) update(menu.menuId, menu)
        else menus.set((prev) => [...prev, menu])
        return
      }
      const prev = list.find((m) => m.menuId === menu.menuId)
      let saved: Menu
      if (prev) {
        saved = { ...menu, ...(await menuApi.update(menu.menuId, toRequest(menu, prev.imageUrl))) }
      } else {
        const { menuId } = await menuApi.create(store.storeId, toRequest(menu, null))
        saved = { ...menu, menuId, imageUrl: persistableImage(menu.imageUrl, null), soldOut: false, hidden: false, representative: false }
      }
      // 대표·품절·숨김은 별도 API라, 폼에서 바뀐 것만 따로 저장한다
      for (const flag of FLAGS) {
        if (saved[flag] !== menu[flag]) saved = { ...saved, ...(await menuApi.setFlag(saved.menuId, flag, menu[flag])) }
      }
      const result = { ...saved, category: menu.category, dailyLimit: menu.dailyLimit }
      if (prev) update(menu.menuId, result)
      else menus.set((p) => [...p, result])
    },
    remove: async (menuId: number) => {
      if (isApi) await menuApi.remove(menuId)
      menus.set((prev) => prev.filter((m) => m.menuId !== menuId))
    },
    setDailyLimit: (menuId: number, limit: DailyLimit | null) => update(menuId, { dailyLimit: limit }),
    nextId: () => Math.max(0, ...list.map((m) => m.menuId)) + 1,
  }
}
