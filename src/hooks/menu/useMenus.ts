import { createMockStore, useMockStore } from '../../utils/mockStore'
import { MOCK_MENUS } from '../../mocks/menus'
import type { DailyLimit, Menu } from '../../types/menu'

// 메뉴 목록·등록·수정. 지금은 목업. 연동 시 menuApi 호출로 바꾸고, 수정 후 메뉴판 캐시가 무효화된다 (DUDU-63)
const menus = createMockStore<Menu[]>(MOCK_MENUS)

type Flag = 'soldOut' | 'hidden' | 'representative'

export function useMenus() {
  const list = useMockStore(menus)
  const update = (menuId: number, patch: Partial<Menu>) =>
    menus.set((prev) => prev.map((m) => (m.menuId === menuId ? { ...m, ...patch } : m)))

  return {
    menus: list,
    find: (menuId: number) => list.find((m) => m.menuId === menuId),
    toggle: (menuId: number, flag: Flag) => {
      const target = list.find((m) => m.menuId === menuId)
      if (target) update(menuId, { [flag]: !target[flag] })
    },
    save: (menu: Menu) => {
      if (list.some((m) => m.menuId === menu.menuId)) update(menu.menuId, menu)
      else menus.set((prev) => [...prev, menu])
    },
    remove: (menuId: number) => menus.set((prev) => prev.filter((m) => m.menuId !== menuId)),
    setDailyLimit: (menuId: number, limit: DailyLimit | null) => update(menuId, { dailyLimit: limit }),
    nextId: () => Math.max(0, ...list.map((m) => m.menuId)) + 1,
  }
}
