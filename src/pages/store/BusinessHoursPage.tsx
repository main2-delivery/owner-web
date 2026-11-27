import { useCallback, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Toggle from '../../components/common/Toggle'
import Toast from '../../components/common/Toast'
import { useBusinessHours } from '../../hooks/store/useStoreInfo'
import { WEEKDAYS, daySegments, nextTransition, todayKey } from '../../utils/businessHours'
import type { BusinessHour } from '../../types/store'

// OWN-14: 영업시간·브레이크·휴무. 저장하면 서버 스케줄러가 영업중/준비중을 자동 전환한다 (DUDU-66, 백엔드 미구현)
export default function BusinessHoursPage() {
  const { hours, holidays, autoSwitch, setHours, setAutoSwitch, addHoliday, removeHoliday } = useBusinessHours()
  const [draft, setDraft] = useState(hours)
  const [newHoliday, setNewHoliday] = useState({ date: '', memo: '' })
  const [toast, setToast] = useState<string | null>(null)
  const closeToast = useCallback(() => setToast(null), [])

  const update = (day: BusinessHour['day'], patch: Partial<BusinessHour>) =>
    setDraft((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)))

  const today = draft.find((h) => h.day === todayKey())!
  const todayLabel = WEEKDAYS.find((w) => w.key === today.day)!.label
  const next = nextTransition(today)

  return (
    <div className="page">
      <PageHeader title="영업시간" description="정해 둔 시간에 맞춰 영업중·준비중이 자동으로 바뀌어요">
        <Button
          onClick={() => {
            setHours(draft)
            setToast('영업시간을 저장했어요')
          }}
        >
          저장
        </Button>
      </PageHeader>
      <div className="row grow-y">
        <section className="card grow table-card">
          <table className="table hours-table">
            <thead>
              <tr>
                <th>요일</th>
                <th>영업시간</th>
                <th>브레이크타임</th>
                <th>휴무</th>
              </tr>
            </thead>
            <tbody>
              {draft.map((h) => {
                const label = WEEKDAYS.find((w) => w.key === h.day)!.label
                return (
                  <tr key={h.day} className={h.closed ? 'is-off' : ''}>
                    <td>
                      <b>{label}요일</b>
                    </td>
                    <td>
                      {h.closed ? (
                        <span className="muted">정기 휴무</span>
                      ) : (
                        <span className="time-range">
                          <input type="time" aria-label={`${label} 영업 시작`} value={h.open} onChange={(e) => update(h.day, { open: e.target.value })} />~
                          <input type="time" aria-label={`${label} 영업 종료`} value={h.close} onChange={(e) => update(h.day, { close: e.target.value })} />
                        </span>
                      )}
                    </td>
                    <td>
                      {!h.closed && (
                        <span className="time-range">
                          <input type="time" aria-label={`${label} 브레이크 시작`} value={h.breakStart ?? ''} onChange={(e) => update(h.day, { breakStart: e.target.value || undefined })} />~
                          <input type="time" aria-label={`${label} 브레이크 종료`} value={h.breakEnd ?? ''} onChange={(e) => update(h.day, { breakEnd: e.target.value || undefined })} />
                        </span>
                      )}
                    </td>
                    <td>
                      <Toggle
                        label={`${label}요일 휴무`}
                        checked={h.closed}
                        onChange={(closed) => update(h.day, closed ? { closed } : { closed, open: h.open || '10:00', close: h.close || '21:00' })}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        <aside className="col w-400">
          <section className="card">
            <div className="between">
              <h3>영업 상태 자동 전환</h3>
              <Toggle label="영업 상태 자동 전환" checked={autoSwitch} onChange={setAutoSwitch} />
            </div>
            <p className="muted">켜 두면 영업 시작·브레이크·마감 시각에 상태가 바뀌어요. 직접 바꾸면 다음 전환 시각까지 유지돼요.</p>
          </section>
          <section className="card">
            <h3>오늘({todayLabel}) 일정</h3>
            <div className="day-bar">
              {daySegments(today).map((s) => (
                <span key={s.from} className={`seg seg-${s.kind}`} style={{ flexGrow: s.to - s.from }} title={s.kind} />
              ))}
            </div>
            <div className="legend">
              <span className="seg-open">영업중</span>
              <span className="seg-break">브레이크</span>
              <span className="seg-closed">영업 종료</span>
            </div>
            <p className="accent-text">{autoSwitch ? (next ? `다음 전환: ${next}` : '오늘 남은 전환이 없어요') : '자동 전환이 꺼져 있어요'}</p>
          </section>
          <section className="card grow">
            <h3>임시 휴무</h3>
            {holidays.map((h) => (
              <div key={h.id} className="soft-row">
                <span>
                  {h.date} {h.memo}
                </span>
                <button type="button" className="text-danger" onClick={() => removeHoliday(h.id)}>
                  삭제
                </button>
              </div>
            ))}
            <form
              className="inline-form"
              onSubmit={(e) => {
                e.preventDefault()
                if (!newHoliday.date.trim()) return
                addHoliday(newHoliday.date.trim(), newHoliday.memo.trim())
                setNewHoliday({ date: '', memo: '' })
              }}
            >
              <input className="input" placeholder="12.31(수)" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} aria-label="휴무 날짜" />
              <input className="input" placeholder="사유" value={newHoliday.memo} onChange={(e) => setNewHoliday({ ...newHoliday, memo: e.target.value })} aria-label="휴무 사유" />
              <Button type="submit" variant="outline" disabled={!newHoliday.date.trim()}>
                ＋ 추가
              </Button>
            </form>
          </section>
        </aside>
      </div>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}
