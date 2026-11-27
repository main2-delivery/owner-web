import type { ReactNode } from 'react'

export type PillTone = 'orange' | 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'solid'

export default function Pill({ tone = 'gray', children }: { tone?: PillTone; children: ReactNode }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}
