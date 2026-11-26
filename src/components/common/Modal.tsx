import type { ReactNode } from 'react'

interface Props {
  width?: number
  children: ReactNode
}

// 화면 전체를 덮는 배경 + 가운데 카드
export default function Modal({ width = 440, children }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ width }} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  )
}
