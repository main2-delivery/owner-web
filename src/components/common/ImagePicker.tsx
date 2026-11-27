import { useEffect, useRef, useState } from 'react'

interface Props {
  label: string
  value: string | null // 이미지 주소 (미리보기)
  onChange: (url: string | null) => void
  placeholder?: string
  height?: number
}

const MAX_BYTES = 5 * 1024 * 1024

// 이미지 고르기 + 미리보기. 업로드 API(DUDU-18) 연동 전이라 브라우저 미리보기 주소만 쓴다
export default function ImagePicker({ label, value, onChange, placeholder = '이미지', height = 200 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }, [objectUrl])

  const pick = (file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) return setError('JPG·PNG 파일만 올릴 수 있어요')
    if (file.size > MAX_BYTES) return setError('5MB 이하 이미지만 올릴 수 있어요')
    setError(null)
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    onChange(url)
  }

  return (
    <div className="image-picker">
      <button
        type="button"
        className="image-slot"
        style={{ height, backgroundImage: value ? `url(${value})` : undefined }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          pick(e.dataTransfer.files[0])
        }}
        aria-label={`${label} 고르기`}
      >
        {!value && (
          <>
            <strong>{placeholder}</strong>
            <span>클릭하거나 끌어와서 올려주세요 · JPG·PNG, 5MB 이하</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
