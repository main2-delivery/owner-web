import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      // /api 요청을 owner-server(8082)로 넘긴다. CORS 설정 없이 로컬에서 호출하기 위함
      proxy: {
        '/api': {
          target: env.OWNER_API_URL || 'http://localhost:8082',
          changeOrigin: true,
        },
      },
    },
  }
})
