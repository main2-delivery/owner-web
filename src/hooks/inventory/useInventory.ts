import { createMockStore, useMockStore } from '../../utils/mockStore'
import { MOCK_INGREDIENTS, MOCK_LEDGER, MOCK_RECIPE } from '../../mocks/inventory'
import type { Ingredient, Recipe, StockLevel } from '../../types/inventory'

// 재고 (매장 관리 시스템). 지금은 목업. 주문 접수 시 레시피대로 자동 차감은 서버에서 한다 (DUDU-36)
const ingredients = createMockStore<Ingredient[]>(MOCK_INGREDIENTS)
const recipe = createMockStore<Recipe>(MOCK_RECIPE)

export const stockLevel = (i: Ingredient): StockLevel =>
  i.stock < i.safetyStock * 0.5 ? 'SHORT' : i.stock < i.safetyStock * 1.1 ? 'LOW' : 'ENOUGH'

export function useInventory() {
  const list = useMockStore(ingredients)
  return {
    ingredients: list,
    recipe: useMockStore(recipe),
    ledger: MOCK_LEDGER,
    byId: (id: number) => list.find((i) => i.id === id),
    inbound: (id: number, amount: number) =>
      ingredients.set((prev) => prev.map((i) => (i.id === id ? { ...i, stock: +(i.stock + amount).toFixed(2) } : i))),
    // 실사 수량으로 장부 재고를 맞춘다
    applyStocktake: (counted: Record<number, number>) =>
      ingredients.set((prev) => prev.map((i) => (counted[i.id] != null ? { ...i, stock: counted[i.id] } : i))),
    // 로스율만큼 레시피 사용량을 늘린다
    adjustRecipe: (ingredientId: number, lossRate: number) =>
      recipe.set((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.ingredientId === ingredientId ? { ...it, amount: Math.round(it.amount * (1 + lossRate)) } : it,
        ),
      })),
  }
}
