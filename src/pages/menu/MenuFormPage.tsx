import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import TextField from '../../components/common/TextField'
import Button from '../../components/common/Button'
import Toggle from '../../components/common/Toggle'
import Pill from '../../components/common/Pill'
import Modal from '../../components/common/Modal'
import ImagePicker from '../../components/common/ImagePicker'
import MenuPreview from '../../components/menu/MenuPreview'
import DailyLimitModal from '../../components/menu/DailyLimitModal'
import { useMenus } from '../../hooks/menu/useMenus'
import { MENU_CATEGORIES } from '../../mocks/menus'
import type { Menu } from '../../types/menu'

// OWN-16: 메뉴 등록(/menus/new)·수정(/menus/:menuId). 연동 시 menuApi.create / update / remove
export default function MenuFormPage() {
  const { menuId } = useParams()
  const { find, save, remove, nextId } = useMenus()
  const isNew = menuId == null
  const existing = isNew ? undefined : find(Number(menuId))
  if (!isNew && !existing) return <Navigate to="/menus" replace />
  return (
    <MenuForm
      key={menuId ?? 'new'}
      initial={existing ?? { menuId: nextId(), name: '', description: '', price: null, imageUrl: null, soldOut: false, hidden: false, representative: false, category: MENU_CATEGORIES[0], dailyLimit: null }}
      isNew={isNew}
      onSave={save}
      onRemove={remove}
    />
  )
}

interface FormProps {
  initial: Menu
  isNew: boolean
  onSave: (menu: Menu) => void
  onRemove: (menuId: number) => void
}

function MenuForm({ initial, isNew, onSave, onRemove }: FormProps) {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(initial)
  const [submitted, setSubmitted] = useState(false)
  const [showLimit, setShowLimit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const set = (patch: Partial<Menu>) => setMenu((m) => ({ ...m, ...patch }))

  const nameError = !menu.name.trim() ? '메뉴 이름을 입력해 주세요' : menu.name.length > 100 ? '100자 이하로 입력해 주세요' : undefined
  const priceError = menu.price == null ? '가격을 입력해 주세요' : undefined

  const submit = () => {
    setSubmitted(true)
    if (nameError || priceError) return
    onSave({ ...menu, name: menu.name.trim() })
    navigate('/menus')
  }

  return (
    <div className="page">
      <PageHeader title={isNew ? '메뉴 등록' : `메뉴 수정 · ${initial.name}`} description="저장하면 고객 앱 메뉴판에 바로 반영돼요">
        {!isNew && (
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            삭제
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate('/menus')}>
          취소
        </Button>
        <Button onClick={submit}>저장</Button>
      </PageHeader>
      <div className="row grow-y">
        <section className="card grow">
          <div className="menu-form-top">
            <div className="w-150">
              <ImagePicker label="메뉴 사진" value={menu.imageUrl} onChange={(imageUrl) => set({ imageUrl })} placeholder="메뉴 사진" height={150} />
            </div>
            <div className="form-grid cols-2 grow">
              <TextField label="메뉴 이름" value={menu.name} maxLength={100} onChange={(e) => set({ name: e.target.value })} error={submitted ? nameError : undefined} />
              <label className="field">
                <span>카테고리</span>
                <select className="input" value={menu.category} onChange={(e) => set({ category: e.target.value })}>
                  {MENU_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <TextField
                label="가격"
                suffix="원"
                inputMode="numeric"
                value={menu.price != null ? menu.price.toLocaleString() : ''}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^\d]/g, '')
                  set({ price: digits ? Number(digits) : null })
                }}
                error={submitted ? priceError : undefined}
              />
            </div>
          </div>
          <TextField label="메뉴 설명" value={menu.description ?? ''} maxLength={500} onChange={(e) => set({ description: e.target.value })} />
          <div className="flag-grid">
            <FlagBox title="대표 메뉴" desc="메뉴판 맨 위에 보여요" checked={menu.representative} onChange={(representative) => set({ representative })} />
            <FlagBox title="품절" desc="오늘만 주문을 막아요" checked={menu.soldOut} onChange={(soldOut) => set({ soldOut })} />
            <FlagBox title="숨김" desc="메뉴판에서 감춰요" checked={menu.hidden} onChange={(hidden) => set({ hidden })} />
            <FlagBox
              title="오늘 한정 수량"
              desc={menu.dailyLimit ? `${menu.dailyLimit.quantity}개 · ${menu.dailyLimit.sold}개 판매` : '수량을 정해 두고 팔아요'}
              checked={!!menu.dailyLimit}
              onChange={(on) => (on ? setShowLimit(true) : set({ dailyLimit: null }))}
              onClickDesc={menu.dailyLimit ? () => setShowLimit(true) : undefined}
            />
          </div>
          <div className="dashed-box">
            <div className="inline">
              <b>옵션 그룹</b>
              <Pill tone="gray">MVP 이후</Pill>
            </div>
            <span className="muted">맵기 선택(필수 1) · 토핑 추가(선택 최대 3) — 옵션 API(DUDU-16) 이후 열려요</span>
          </div>
        </section>
        <MenuPreview menu={menu} />
      </div>
      {showLimit && (
        <DailyLimitModal
          menu={menu}
          onCancel={() => setShowLimit(false)}
          onSave={(dailyLimit) => {
            set({ dailyLimit })
            setShowLimit(false)
          }}
        />
      )}
      {confirmDelete && (
        <Modal>
          <h3 className="modal-title">'{initial.name}' 메뉴를 삭제할까요?</h3>
          <p className="muted">삭제하면 되돌릴 수 없어요. 잠시 팔지 않으려면 숨김을 켜 주세요.</p>
          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onRemove(initial.menuId)
                navigate('/menus')
              }}
            >
              삭제
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

interface FlagProps {
  title: string
  desc: string
  checked: boolean
  onChange: (next: boolean) => void
  onClickDesc?: () => void
}

function FlagBox({ title, desc, checked, onChange, onClickDesc }: FlagProps) {
  return (
    <div className="flag-box">
      <div className="between">
        <b>{title}</b>
        <Toggle label={title} checked={checked} onChange={onChange} />
      </div>
      {onClickDesc ? (
        <button type="button" className="text-link small" onClick={onClickDesc}>
          {desc} · 바꾸기
        </button>
      ) : (
        <span className="muted">{desc}</span>
      )}
    </div>
  )
}
