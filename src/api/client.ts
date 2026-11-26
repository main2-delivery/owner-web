import axios from 'axios'

// 모든 API 호출은 이 인스턴스를 쓴다. /api 는 vite 프록시가 owner-server로 넘긴다
export const client = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

// 로그인 기능 전까지 백엔드의 테스트 헤더로 사용자를 지정한다 (.env.local)
client.interceptors.request.use((config) => {
  const userId = import.meta.env.VITE_TEST_USER_ID
  const role = import.meta.env.VITE_TEST_ROLE
  if (userId) config.headers.set('X-Test-User-Id', userId)
  if (role) config.headers.set('X-Test-Role', role)
  return config
})
