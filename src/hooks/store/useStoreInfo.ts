import { createMockStore, useMockStore } from '../../utils/mockStore'
import { storeApi } from '../../api/store/storeApi'
import { MOCK_BUSINESS_HOURS, MOCK_HOLIDAYS } from '../../mocks/store'
import { useCurrentStore } from './useCurrentStore'
import type { BusinessHour, Holiday, StoreCreateRequest, StoreDetail } from '../../types/store'

// 가게 정보는 owner-server(storeApi)와 연동한다. 영업시간·휴무일·입점 신청은 아직 목업
const hours = createMockStore<BusinessHour[]>(MOCK_BUSINESS_HOURS)
const holidays = createMockStore<Holiday[]>(MOCK_HOLIDAYS)
const autoSwitch = createMockStore(true)
// 입점 신청 결과. null 이면 아직 신청 전
const application = createMockStore<(StoreCreateRequest & { appliedAt: string }) | null>(null)

export function useStoreInfo() {
  const { source, store, setStore } = useCurrentStore()
  return {
    source,
    store,
    // 서버에 없는 값(소개·포장 할인)은 화면에만 남긴다
    save: async (next: StoreDetail) => {
      if (source !== 'api') return setStore(next)
      const saved = await storeApi.updateStore(next.storeId, {
        phone: next.phone ?? '',
        openTime: next.openTime,
        closeTime: next.closeTime,
        minOrderAmount: next.minOrderAmount,
        deliveryFee: next.deliveryFee,
        deliveryRadiusM: next.deliveryRadiusM,
        // blob: 미리보기 주소는 서버에 보내지 않는다 (이미지 업로드 API 전)
        logoUrl: next.logoUrl?.startsWith('blob:') ? store.logoUrl : next.logoUrl,
      })
      setStore({ ...next, ...saved })
    },
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
