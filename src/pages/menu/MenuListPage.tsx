import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Toggle from '../../components/common/Toggle'
import Pill from '../../components/common/Pill'
import DailyLimitModal from '../../components/menu/DailyLimitModal'
import Toast from '../../components/common/Toast'
import { apiErrorMessage } from '../../utils/apiError'
import type { MenuFlag } from '../../types/menu'
import { useMenus } from '../../hooks/menu/useMenus'
import { formatWon } from '../../utils/format'

// OWN-15: 메뉴 목록. 대표·품절·숨김은 바로 저장되고 고객 앱에 반영된다 (DUDU-15, 27)
export default function MenuListPage() {
  const navigate = useNavigate()
  const { menus, categories, loading, toggle, copy, find, setDailyLimit } = useMenus()
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])
  const flip = (menuId: number, flag: MenuFlag) =>
    toggle(menuId, flag).catch((e) => setToast(apiErrorMessage(e, '바꾸지 못했어요. 잠시 후 다시 시도해 주세요')))
  const duplicate = (menuId: number, name: string) =>
    copy(menuId)
      .then(() => setToast(`'${name}' 메뉴를 복사했어요`))
      .catch((e) => setToast(apiErrorMessage(e, '복사하지 못했어요')))
  const [category, setCategory] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [limitMenuId, setLimitMenuId] = useState<number | null>(null)
  const limitMenu = limitMenuId != null ? find(limitMenuId) : undefined

  const visible = menus.filter(
    (m) => (category == null || m.category === category) && m.name.includes(keyword.trim()),
  )

  return (
    <div className="page">
      <PageHeader title="메뉴 관리" description="품절·숨김은 고객 앱에 바로 반영돼요">
        <label className="search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input placeholder="메뉴 이름 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} aria-label="메뉴 이름 검색" />
        </label>
        <Button onClick={() => navigate('/menus/new')}>＋ 메뉴 등록</Button>
      </PageHeader>
      <div className="row grow-y">
        <nav className="card w-220 category-list" aria-label="카테고리">
          <span className="muted strong">카테고리</span>
          {[null, ...categories].map((c) => (
            <button key={c ?? 'all'} type="button" className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
              <span>{c ?? '전체'}</span>
              <span className="muted">{c ? menus.filter((m) => m.category === c).length : menus.length}</span>
            </button>
          ))}
        </nav>
        <section className="card grow table-card">
          <table className="table menu-list">
            <thead>
              <tr>
                <th>메뉴</th>
                <th>가격</th>
                <th>대표</th>
                <th>품절</th>
                <th>숨김</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="muted">
                    메뉴를 불러오는 중이에요
                  </td>
                </tr>
              )}
              {visible.map((m) => (
                <tr key={m.menuId}>
                  <td>
                    <div className={`menu-cell${m.hidden ? ' faded' : ''}`}>
                      <span className="thumb" style={{ backgroundImage: m.imageUrl ? `url(${m.imageUrl})` : undefined }} />
                      <div>
                        <div className="inline">
                          <b>{m.name}</b>
                          {m.dailyLimit && (
                            <button type="button" className="pill-button" onClick={() => setLimitMenuId(m.menuId)}>
                              <Pill tone="blue">
                                한정 오늘 {m.dailyLimit.sold}/{m.dailyLimit.quantity}
                              </Pill>
                            </button>
                          )}
                          {m.soldOut && <Pill tone="red">품절</Pill>}
                          {m.hidden && <Pill tone="gray">숨김</Pill>}
                        </div>
                        <span className="muted">{m.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="price">{m.price != null ? formatWon(m.price) : '—'}</td>
                  <td>
                    <Toggle label={`${m.name} 대표`} checked={m.representative} onChange={() => flip(m.menuId, 'representative')} />
                  </td>
                  <td>
                    <Toggle label={`${m.name} 품절`} checked={m.soldOut} onChange={() => flip(m.menuId, 'soldOut')} />
                  </td>
                  <td>
                    <Toggle label={`${m.name} 숨김`} checked={m.hidden} onChange={() => flip(m.menuId, 'hidden')} />
                  </td>
                  <td>
                    <div className="inline">
                      <Link className="text-link" to={`/menus/${m.menuId}`}>
                        수정
                      </Link>
                      <button type="button" className="text-link" onClick={() => duplicate(m.menuId, m.name)}>
                        복사
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    조건에 맞는 메뉴가 없어요
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
      {toast && <Toast message={toast} onClose={closeToast} />}
      {limitMenu && (
        <DailyLimitModal
          menu={limitMenu}
          onCancel={() => setLimitMenuId(null)}
          onSave={(limit) => {
            setDailyLimit(limitMenu.menuId, limit)
            setLimitMenuId(null)
          }}
        />
      )}
    </div>
  )
}
