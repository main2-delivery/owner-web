// 백엔드 core-domain 의 enum 과 값을 맞춘다

export type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN'

export type OrderStatus =
  | 'PENDING' // 접수 대기
  | 'ACCEPTED' // 접수
  | 'COOKING' // 조리 중
  | 'COOKED' // 조리 완료
  | 'DELIVERING' // 배달 중
  | 'DELIVERED' // 배달 완료
  | 'REJECTED' // 점주 거절
  | 'CANCELED' // 고객 취소
