import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  children?: ReactNode // 오른쪽 버튼·탭
}

export default function PageHeader({ title, description, children }: Props) {
  return (
    <header className="page-header">
      <div className="page-titles">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </header>
  )
}
