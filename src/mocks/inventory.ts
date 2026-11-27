import type { DemandForecast, Ingredient, LedgerEntry, PurchaseSuggestion, Recipe } from '../types/inventory'

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: 1, name: '떡볶이 떡', unit: 'kg', stock: 1.8, safetyStock: 5, usedToday: 4.2 },
  { id: 2, name: '어묵', unit: 'kg', stock: 3.4, safetyStock: 2, usedToday: 1.1 },
  { id: 3, name: '떡볶이 소스', unit: 'L', stock: 2.1, safetyStock: 2, usedToday: 1.5 },
  { id: 4, name: '튀김가루', unit: 'kg', stock: 0.6, safetyStock: 2, usedToday: 0.9 },
  { id: 5, name: '김밥 김', unit: '장', stock: 120, safetyStock: 50, usedToday: 16 },
  { id: 6, name: '순대', unit: 'kg', stock: 4.5, safetyStock: 3, usedToday: 1.2 },
]

export const MOCK_RECIPE: Recipe = {
  menuName: '떡볶이 1인분',
  items: [
    { ingredientId: 1, amount: 200, unit: 'g' },
    { ingredientId: 2, amount: 50, unit: 'g' },
    { ingredientId: 3, amount: 80, unit: 'ml' },
  ],
}

export const MOCK_LEDGER: LedgerEntry[] = [
  { time: '14:26', kind: 'ORDER', label: '주문 차감 #253', delta: -0.4 },
  { time: '13:58', kind: 'ORDER', label: '주문 차감 #251', delta: -0.2 },
  { time: '11:00', kind: 'STOCKTAKE', label: '실사 보정', delta: -0.1 },
  { time: '09:05', kind: 'INBOUND', label: '입고 · 한입식자재', delta: 5 },
]

export const MOCK_FORECAST: DemandForecast[] = [
  { day: '월', orders: 31, predicted: false },
  { day: '화', orders: 28, predicted: false },
  { day: '수', orders: 33, predicted: false },
  { day: '목', orders: 41, predicted: true },
  { day: '금', orders: 47, predicted: true },
  { day: '토', orders: 44, predicted: true },
]

export const MOCK_SUGGESTIONS: PurchaseSuggestion[] = [
  { ingredientId: 1, expectedUse: 13.5, suggested: 15 },
  { ingredientId: 4, expectedUse: 2.4, suggested: 4 },
  { ingredientId: 3, expectedUse: 5.2, suggested: 5 },
  { ingredientId: 2, expectedUse: 3.1, suggested: 0 },
]

// 품목별 단가 (발주 예상 금액 계산용)
export const UNIT_PRICE: Record<number, number> = { 1: 4800, 2: 7000, 3: 6400, 4: 3500 }
export const SUPPLIER = { name: '한입식자재', arrival: '내일 09:00' }
