import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import TextField from '../../components/common/TextField'
import Button from '../../components/common/Button'
import ImagePicker from '../../components/common/ImagePicker'
import Toast from '../../components/common/Toast'
import { useStoreInfo } from '../../hooks/store/useStoreInfo'
import { apiErrorMessage } from '../../utils/apiError'
import type { StoreDetail } from '../../types/store'

const toNumber = (v: string) => Number(v.replace(/[^\d]/g, '')) || 0

// OWN-13: 가게 정보. storeApi.getStore / updateStore (PUT /api/owner/stores/{id}). 이름·주소·업종은 서버에서 수정 불가
export default function StoreInfoPage() {
  const { source, store, save } = useStoreInfo()
  if (source === 'loading') return <div className="page center muted">가게 정보를 불러오는 중이에요</div>
  // 가게가 바뀌면 입력 중이던 값을 새로 시작한다
  return <StoreInfoForm key={store.storeId} store={store} save={save} />
}

function StoreInfoForm({ store, save }: { store: StoreDetail; save: (next: StoreDetail) => Promise<void> | void }) {
  const [draft, setDraft] = useState(store)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])
  const dirty = JSON.stringify(draft) !== JSON.stringify(store)

  return (
    <div className="page">
      <PageHeader title="가게 정보" description="고객 앱 가게 화면에 그대로 보여요">
        <Link className="link-muted" to="/store/apply">
          입점 신청
        </Link>
        <Button variant="secondary" disabled={!dirty} onClick={() => setDraft(store)}>
          취소
        </Button>
        <Button
          disabled={!dirty || saving}
          onClick={async () => {
            setSaving(true)
            try {
              await save(draft)
              setToast('가게 정보를 저장했어요')
            } catch (e) {
              setToast(apiErrorMessage(e))
            } finally {
              setSaving(false)
            }
          }}
        >
          저장
        </Button>
      </PageHeader>
      <div className="row grow-y">
        <section className="card w-380">
          <h3>대표 이미지</h3>
          <ImagePicker label="대표 이미지" value={draft.logoUrl} onChange={(logoUrl) => setDraft({ ...draft, logoUrl })} placeholder={`${draft.name} 대표 사진`} />
          <p className="muted">정사각형 이미지를 권장해요. 고객 앱 가게 목록과 가게 화면 위쪽에 보여요.</p>
        </section>
        <section className="card grow">
          <h3>기본 정보</h3>
          <div className="form-grid cols-2">
            <TextField label="가게 이름" value={draft.name} disabled />
            <TextField label="가게 전화번호" value={draft.phone ?? ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            <TextField label="최소 주문 금액" suffix="원" inputMode="numeric" value={draft.minOrderAmount.toLocaleString()} onChange={(e) => setDraft({ ...draft, minOrderAmount: toNumber(e.target.value) })} />
            <TextField label="배달팁" suffix="원" inputMode="numeric" value={draft.deliveryFee.toLocaleString()} onChange={(e) => setDraft({ ...draft, deliveryFee: toNumber(e.target.value) })} />
            <TextField label="업종 카테고리" value={draft.categoryName ?? ''} disabled />
            <TextField label="포장 할인" suffix="원" inputMode="numeric" value={(draft.takeoutDiscount ?? 0).toLocaleString()} onChange={(e) => setDraft({ ...draft, takeoutDiscount: toNumber(e.target.value) })} />
          </div>
          <TextField label="가게 주소" value={draft.address} disabled />
          <p className="muted">가게 이름·주소·업종을 바꾸려면 고객센터로 문의해 주세요.</p>
          <label className="field">
            <span>가게 소개</span>
            <textarea className="input textarea" rows={3} maxLength={300} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </label>
        </section>
      </div>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
