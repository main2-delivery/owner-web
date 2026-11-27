import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import TextField from '../../components/common/TextField'
import Button from '../../components/common/Button'
import Pill from '../../components/common/Pill'
import ImagePicker from '../../components/common/ImagePicker'
import { useStoreApplication } from '../../hooks/store/useStoreInfo'
import { STORE_CATEGORIES } from '../../mocks/store'
import type { StoreCreateRequest } from '../../types/store'

const BUSINESS_NO = /^\d{3}-\d{2}-\d{5}$/

// OWN-12: 입점 신청 → 심사 중. 연동 시 storeApi.apply (POST /api/owner/stores)
export default function StoreApplyPage() {
  const { application, apply } = useStoreApplication()
  if (application) return <ApplicationPending appliedAt={application.appliedAt} name={application.name} />
  return <ApplyForm onSubmit={apply} />
}

function ApplyForm({ onSubmit }: { onSubmit: (req: StoreCreateRequest) => void }) {
  const [form, setForm] = useState({ name: '', categoryId: '', phone: '', ownerName: '', businessNumber: '', minOrderAmount: '', address: '' })
  const [image, setImage] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value })

  const errors: Partial<Record<keyof typeof form, string>> = {}
  if (!form.name.trim()) errors.name = '가게 이름을 입력해 주세요'
  if (!form.phone.trim()) errors.phone = '전화번호를 입력해 주세요'
  if (!form.address.trim()) errors.address = '주소를 입력해 주세요'
  if (!BUSINESS_NO.test(form.businessNumber)) errors.businessNumber = '000-00-00000 형식으로 입력해 주세요'
  const show = (key: keyof typeof form) => (submitted ? errors[key] : undefined)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    onSubmit({
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      businessNumber: form.businessNumber,
    })
  }

  return (
    <form className="page" onSubmit={submit}>
      <PageHeader title="입점 신청" description="가게 정보를 입력하면 영업일 기준 1~2일 안에 심사 결과를 알려드려요" />
      <div className="row grow-y">
        <section className="card grow">
          <ol className="steps">
            <li className="active">
              <b>1</b>기본 정보
            </li>
            <li>
              <b>2</b>사업자 확인
            </li>
            <li>
              <b>3</b>심사
            </li>
          </ol>
          <div className="form-grid cols-3">
            <TextField label="가게 이름" value={form.name} onChange={set('name')} placeholder="한끼분식" error={show('name')} />
            <label className="field">
              <span>업종 카테고리</span>
              <select className="input" value={form.categoryId} onChange={set('categoryId')}>
                <option value="">선택해 주세요</option>
                {STORE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <TextField label="가게 전화번호" value={form.phone} onChange={set('phone')} placeholder="031-000-0000" error={show('phone')} />
            <TextField label="대표자명" value={form.ownerName} onChange={set('ownerName')} placeholder="김사장" />
            <TextField label="사업자등록번호" value={form.businessNumber} onChange={set('businessNumber')} placeholder="000-00-00000" error={show('businessNumber')} />
            <TextField label="최소 주문 금액" value={form.minOrderAmount} onChange={set('minOrderAmount')} inputMode="numeric" placeholder="12000" suffix="원" />
          </div>
          <div className="address-row">
            <TextField className="grow" label="가게 주소" value={form.address} onChange={set('address')} placeholder="도로명 주소" error={show('address')} />
            <Button type="button" variant="outline" disabled title="주소 검색 API 연동 예정">
              주소 검색
            </Button>
          </div>
          <div className="field">
            <span>대표 이미지</span>
            <ImagePicker label="대표 이미지" value={image} onChange={setImage} placeholder="＋ 대표 이미지" height={96} />
          </div>
        </section>
        <aside className="col w-340">
          <section className="card card-notice">
            <h3>심사 안내</h3>
            <ul className="bullets">
              <li>사업자등록번호는 국세청 조회로 확인해요</li>
              <li>심사 중에도 메뉴는 미리 등록할 수 있어요</li>
              <li>승인되면 바로 영업을 시작할 수 있어요</li>
            </ul>
          </section>
          <div className="grow" />
          <Button type="submit" className="btn-lg">
            입점 신청하기
          </Button>
        </aside>
      </div>
    </form>
  )
}

function ApplicationPending({ name, appliedAt }: { name: string; appliedAt: string }) {
  const navigate = useNavigate()
  return (
    <div className="page center">
      <section className="card pending-card">
        <Pill tone="blue">심사 중</Pill>
        <h2>입점 신청을 확인하고 있어요</h2>
        <p className="muted center-text">
          {name} · 신청일 {appliedAt}
          <br />
          결과는 문자와 이 화면으로 알려드릴게요
        </p>
        <ol className="timeline">
          <li className="done">
            <i />
            <b>신청 완료</b>
            <span>{appliedAt.slice(5)}</span>
          </li>
          <li className="now">
            <i />
            <b>서류 확인</b>
            <span>진행 중</span>
          </li>
          <li>
            <i />
            <b>승인</b>
            <span>—</span>
          </li>
        </ol>
        <div className="button-row">
          <Button variant="secondary" onClick={() => navigate('/store')}>
            신청 내용 보기
          </Button>
          <Button onClick={() => navigate('/menus/new')}>메뉴 미리 등록</Button>
        </div>
      </section>
    </div>
  )
}
