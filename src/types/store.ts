// 백엔드 owner-server dto/store 와 필드 이름을 맞춘다

export interface StoreDetail {
  storeId: number
  name: string
  categoryId: number | null
  categoryName: string | null
  phone: string | null // 수집 가게는 비어 있을 수 있다
  businessNumber: string | null
  address: string
  minOrderAmount: number
  deliveryFee: number
  deliveryRadiusM: number
  openTime: string | null // HH:mm:ss, 수집 가게는 null
  closeTime: string | null
  status: string // PENDING(심사 중) · OPEN · CLOSED ...
  logoUrl: string | null
  // 아래는 백엔드에 아직 없는 화면 전용 값
  description?: string
  takeoutDiscount?: number
}

export interface StoreCreateRequest {
  name: string
  address: string
  phone: string
  categoryId: number | null
  businessNumber: string
}

export interface StoreUpdateRequest {
  phone: string
  openTime: string | null
  closeTime: string | null
  minOrderAmount: number
  deliveryFee: number
  deliveryRadiusM: number
  logoUrl: string | null
}

// 영업시간 (DUDU-66, 백엔드 미구현)
export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export interface BusinessHour {
  day: Weekday
  open: string
  close: string
  breakStart?: string
  breakEnd?: string
  closed: boolean
}

export interface Holiday {
  id: number
  date: string // 12.25(목)
  memo: string
}
