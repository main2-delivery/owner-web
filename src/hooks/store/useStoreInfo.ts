import { createMockStore, useMockStore } from '../../utils/mockStore'
import { MOCK_BUSINESS_HOURS, MOCK_HOLIDAYS, MOCK_STORE_DETAIL } from '../../mocks/store'
import type { BusinessHour, Holiday, StoreCreateRequest, StoreDetail } from '../../types/store'

// 가게 정보·영업시간. 지금은 목업. 연동 시 storeApi.getStore / updateStore / apply 로 바꾼다
const storeDetail = createMockStore<StoreDetail>(MOCK_STORE_DETAIL)
const hours = createMockStore<BusinessHour[]>(MOCK_BUSINESS_HOURS)
const holidays = createMockStore<Holiday[]>(MOCK_HOLIDAYS)
const autoSwitch = createMockStore(true)
// 입점 신청 결과. null 이면 아직 신청 전
const application = createMockStore<(StoreCreateRequest & { appliedAt: string }) | null>(null)

export function useStoreInfo() {
  return {
    store: useMockStore(storeDetail),
    save: (next: StoreDetail) => storeDetail.set(next),
  }
}

export function useBusinessHours() {
  return {
    hours: useMockStore(hours),
    holidays: useMockStore(holidays),
    autoSwitch: useMockStore(autoSwitch),
    setHours: hours.set,
    setAutoSwitch: autoSwitch.set,
    addHoliday: (date: string, memo: string) => holidays.set((prev) => [...prev, { id: Date.now(), date, memo }]),
    removeHoliday: (id: number) => holidays.set((prev) => prev.filter((h) => h.id !== id)),
  }
}

export function useStoreApplication() {
  return {
    application: useMockStore(application),
    apply: (req: StoreCreateRequest) => application.set({ ...req, appliedAt: '2026.11.25 14:20' }),
  }
}
