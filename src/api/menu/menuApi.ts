import { client } from '../client'
import type { ApiResponse } from '../../types/common'
import type { Menu, MenuFlag, MenuRequest } from '../../types/menu'

const FLAG_PATH: Record<MenuFlag, string> = { soldOut: 'sold-out', hidden: 'hidden', representative: 'representative' }

// owner-server MenuController (/api/owner)
export const menuApi = {
  getMenus: (storeId: number) =>
    client.get<ApiResponse<Menu[]>>(`/owner/stores/${storeId}/menus`).then((r) => r.data.data),
  create: (storeId: number, req: MenuRequest) =>
    client.post<ApiResponse<{ menuId: number }>>(`/owner/stores/${storeId}/menus`, req).then((r) => r.data.data),
  getMenu: (menuId: number) => client.get<ApiResponse<Menu>>(`/owner/menus/${menuId}`).then((r) => r.data.data),
  update: (menuId: number, req: MenuRequest) =>
    client.put<ApiResponse<Menu>>(`/owner/menus/${menuId}`, req).then((r) => r.data.data),
  remove: (menuId: number) => client.delete<ApiResponse<null>>(`/owner/menus/${menuId}`),
  // 대표·품절·숨김은 각각 PATCH { value }
  setFlag: (menuId: number, flag: MenuFlag, value: boolean) =>
    client.patch<ApiResponse<Menu>>(`/owner/menus/${menuId}/${FLAG_PATH[flag]}`, { value }).then((r) => r.data.data),
  copy: (menuId: number) =>
    client.post<ApiResponse<{ menuId: number }>>(`/owner/menus/${menuId}/copy`).then((r) => r.data.data),
}
