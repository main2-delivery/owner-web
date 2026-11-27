import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  suffix?: string // 원, kg 등
  error?: string
}

// Figma 점주/입력 필드
export default function TextField({ label, suffix, error, className = '', ...rest }: Props) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <span className="input-wrap">
        <input className={`input${error ? ' input-error' : ''}`} {...rest} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
