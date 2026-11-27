import type { BusinessHour, Holiday, StoreDetail } from '../types/store'

export const MOCK_STORE_DETAIL: StoreDetail = {
  storeId: 1,
  name: '한끼분식',
  categoryId: 3,
  categoryName: '분식',
  phone: '031-000-0000',
  businessNumber: '000-00-00000',
  address: '안양시 동안구 시민대로 000, 1층',
  minOrderAmount: 12000,
  deliveryFee: 3000,
  deliveryRadiusM: 2000,
  openTime: '10:00',
  closeTime: '21:00',
  status: 'OPEN',
  logoUrl: null,
  description: '매일 아침 직접 만든 떡과 어묵으로 끓이는 동네 분식집이에요. 원산지: 쌀(국산), 어묵(국산)',
  takeoutDiscount: 1000,
}

export const STORE_CATEGORIES = [
  { id: 1, name: '한식' },
  { id: 2, name: '중식' },
  { id: 3, name: '분식' },
  { id: 4, name: '치킨' },
  { id: 5, name: '카페·디저트' },
]

const weekday = (day: BusinessHour['day']): BusinessHour => ({
  day,
  open: '10:00',
  close: '21:00',
  breakStart: '15:00',
  breakEnd: '16:30',
  closed: false,
})

export const MOCK_BUSINESS_HOURS: BusinessHour[] = [
  weekday('MON'),
  weekday('TUE'),
  weekday('WED'),
  weekday('THU'),
  { day: 'FRI', open: '10:00', close: '22:00', closed: false },
  { day: 'SAT', open: '11:00', close: '22:00', closed: false },
  { day: 'SUN', open: '', close: '', closed: true },
]

export const MOCK_HOLIDAYS: Holiday[] = [{ id: 1, date: '12.25(목)', memo: '크리스마스' }]
