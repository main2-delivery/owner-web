import axios from 'axios'
import type { ApiResponse } from '../types/common'

// 백엔드 { success:false, error:{ message } } 응답이면 그 문구를, 아니면 기본 문구를 돌려준다
export function apiErrorMessage(e: unknown, fallback = '저장하지 못했어요. 잠시 후 다시 시도해 주세요') {
  if (axios.isAxiosError<ApiResponse<unknown>>(e)) return e.response?.data?.error?.message ?? fallback
  return fallback
}
