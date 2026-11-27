// 백엔드 owner-server dto/menu 와 필드 이름을 맞춘다

export interface Menu {
  menuId: number
  name: string
  description: string | null
  price: number | null // 수집 메뉴는 null 일 수 있다
  imageUrl: string | null
  soldOut: boolean
  hidden: boolean
  representative: boolean
  // 아래는 백엔드에 아직 없는 화면 전용 값
  category?: string
  dailyLimit?: DailyLimit | null // 오늘 한정 수량 (DUDU-64)
}

export interface DailyLimit {
  quantity: number
  sold: number
  resetDaily: boolean
  showRemainingAt: number // 이 개수 이하로 남으면 고객 앱에 남은 수량 표시
}

export interface MenuRequest {
  name: string
  description: string
  price: number
  imageUrl: string | null
}
