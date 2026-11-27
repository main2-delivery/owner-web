interface Props<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export default function FilterChips<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="filter-chips">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`filter-chip${o.value === value ? ' active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
