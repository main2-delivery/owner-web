import type { Menu } from '../types/menu'

export const MENU_CATEGORIES = ['떡볶이', '튀김', '김밥', '순대', '음료']

export const MOCK_MENUS: Menu[] = [
  { menuId: 101, name: '떡볶이', description: '쫄깃한 쌀떡, 매콤달콤 소스', price: 5000, imageUrl: null, soldOut: false, hidden: false, representative: true, category: '떡볶이' },
  {
    menuId: 102, name: '로제 떡볶이', description: '크림 로제 소스에 쫄깃한 쌀떡, 치즈 토핑', price: 6500, imageUrl: null, soldOut: false, hidden: false, representative: true, category: '떡볶이',
    dailyLimit: { quantity: 20, sold: 13, resetDaily: true, showRemainingAt: 5 },
  },
  { menuId: 103, name: '모둠순대', description: '순대·간·허파', price: 4500, imageUrl: null, soldOut: false, hidden: false, representative: false, category: '순대' },
  { menuId: 104, name: '모둠튀김', description: '김말이·야채·오징어 5개', price: 5000, imageUrl: null, soldOut: true, hidden: false, representative: false, category: '튀김' },
  { menuId: 105, name: '참치김밥', description: '참치마요 듬뿍', price: 4000, imageUrl: null, soldOut: false, hidden: false, representative: false, category: '김밥' },
  { menuId: 106, name: '계절 한정 어묵탕', description: '겨울 한정 메뉴', price: 5500, imageUrl: null, soldOut: false, hidden: true, representative: false, category: '떡볶이' },
  { menuId: 107, name: '쿨피스', description: '복숭아맛 355ml', price: 1500, imageUrl: null, soldOut: false, hidden: false, representative: false, category: '음료' },
]
