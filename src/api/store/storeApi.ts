import { client } from '../client'
import type { ApiResponse } from '../../types/common'
import type { StoreCreateRequest, StoreDetail, StoreUpdateRequest } from '../../types/store'

// owner-server StoreController (/api/owner/stores)
export const storeApi = {
  apply: (req: StoreCreateRequest) =>
    client.post<ApiResponse<{ storeId: number }>>('/owner/stores', req).then((r) => r.data.data),
  getMyStores: () =>
    client
      .get<ApiResponse<{ storeId: number; name: string; address: string; status: string }[]>>('/owner/stores')
      .then((r) => r.data.data),
  getStore: (storeId: number) =>
    client.get<ApiResponse<StoreDetail>>(`/owner/stores/${storeId}`).then((r) => r.data.data),
  updateStore: (storeId: number, req: StoreUpdateRequest) =>
    client.put<ApiResponse<StoreDetail>>(`/owner/stores/${storeId}`, req).then((r) => r.data.data),
}
