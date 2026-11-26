import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  block?: boolean
}

export default function Button({ variant = 'primary', block, className = '', ...rest }: Props) {
  return <button className={`btn btn-${variant} ${block ? 'btn-block' : ''} ${className}`} {...rest} />
}
