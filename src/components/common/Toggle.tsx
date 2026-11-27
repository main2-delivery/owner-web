interface Props {
  checked: boolean
  onChange: (next: boolean) => void
  label: string // 화면에는 안 보이지만 스크린리더용
  disabled?: boolean
}

// Figma 점주/토글 (켜짐·꺼짐)
export default function Toggle({ checked, onChange, label, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`toggle${checked ? ' on' : ''}`}
      onClick={() => onChange(!checked)}
    />
  )
}
