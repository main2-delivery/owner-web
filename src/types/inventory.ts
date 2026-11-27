// 재고·발주 (DUDU-36, 42, 52, 65, 백엔드 미구현)
export interface Ingredient {
  id: number
  name: string
  unit: string // kg, L, 장
  stock: number
  safetyStock: number
  usedToday: number
}

export type StockLevel = 'ENOUGH' | 'LOW' | 'SHORT'

export interface RecipeItem {
  ingredientId: number
  amount: number
  unit: string // g, ml
}

export interface Recipe {
  menuName: string
  items: RecipeItem[]
}

export interface LedgerEntry {
  time: string
  kind: 'ORDER' | 'STOCKTAKE' | 'INBOUND'
  label: string
  delta: number
}

export interface PurchaseSuggestion {
  ingredientId: number
  expectedUse: number // 앞으로 3일
  suggested: number // 0 이면 발주 필요 없음
}

export interface DemandForecast {
  day: string
  orders: number
  predicted: boolean
}
