interface Props {
  message: string
  tone: 'warning' | 'muted'
  actionLabel?: string
  onAction?: () => void
}

// 상단 바 아래 띠 배너 (접수 지연, 준비중)
export default function Banner({ message, tone, actionLabel, onAction }: Props) {
  return (
    <div className={`banner banner-${tone}`}>
      <span>{message}</span>
      {actionLabel && (
        <button className="banner-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
