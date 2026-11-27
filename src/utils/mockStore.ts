import { useSyncExternalStore } from 'react'

// 백엔드 연동 전, 여러 화면이 같은 목업 데이터를 바꾸고 보도록 하는 작은 저장소
// (메뉴 수정 후 목록으로 돌아와도 바뀐 값이 보이게). 연동하면 api 호출로 바꾼다
export function createMockStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set: (next: T | ((prev: T) => T)) => {
      state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next
      listeners.forEach((l) => l())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export function useMockStore<T>(store: ReturnType<typeof createMockStore<T>>) {
  return useSyncExternalStore(store.subscribe, store.get)
}
