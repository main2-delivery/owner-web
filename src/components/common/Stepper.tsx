interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

// − 20 ＋ 수량 조절
export default function Stepper({ value, onChange, min = 0, max = 999 }: Props) {
  return (
    <div className="stepper">
      <button type="button" aria-label="줄이기" disabled={value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <output>{value}</output>
      <button type="button" aria-label="늘리기" disabled={value >= max} onClick={() => onChange(value + 1)}>
        ＋
      </button>
    </div>
  )
}
