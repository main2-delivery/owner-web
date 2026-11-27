import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SegmentTabs from '../../components/common/SegmentTabs'
import FilterChips from '../../components/common/FilterChips'
import StatusChip from '../../components/common/StatusChip'
import { SALES_TABS } from '../../constants/sales'
import { MOCK_ORDER_HISTORY } from '../../mocks/sales'
import { formatWon } from '../../utils/format'
import type { HistoryPeriod } from '../../types/sales'
import type { OrderStatus } from '../../types/common'

const PAGE_SIZE = 7

const STATUS_FILTERS: { value: string; label: string; statuses: OrderStatus[] | null }[] = [
  { value: 'ALL', label: '전체', statuses: null },
  { value: 'IN_PROGRESS', label: '처리 중', statuses: ['PENDING', 'ACCEPTED', 'COOKING', 'COOKED'] },
  { value: 'DONE', label: '픽업완료', statuses: ['DELIVERING', 'DELIVERED'] },
  { value: 'REJECTED', label: '거절·취소', statuses: ['REJECTED', 'CANCELED'] },
]

// OWN-20: 주문 내역 (DUDU-31). 연동 시 기간·상태·페이지를 쿼리로 넘긴다. 목업은 오늘 데이터만 있다
export default function OrderHistoryPage() {
  const [period, setPeriod] = useState<HistoryPeriod>('TODAY')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1)

  const statuses = STATUS_FILTERS.find((f) => f.value === status)!.statuses
  const rows = period === 'TODAY' ? MOCK_ORDER_HISTORY.filter((r) => !statuses || statuses.includes(r.status)) : []
  const total = rows.reduce((sum, r) => sum + r.totalPrice, 0)
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div className="page">
      <PageHeader title="주문 내역" description="지난 주문을 기간·상태별로 찾아볼 수 있어요">
        <SegmentTabs items={SALES_TABS} />
      </PageHeader>
      <div className="between">
        <div className="inline">
          <FilterChips<HistoryPeriod>
            value={period}
            onChange={(p) => {
              setPeriod(p)
              setPage(1)
            }}
            options={[
              { value: 'TODAY', label: '오늘' },
              { value: 'YESTERDAY', label: '어제' },
              { value: 'WEEK', label: '최근 7일' },
              { value: 'MONTH', label: '최근 30일' },
            ]}
          />
          <select
            className="input select-chip"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            aria-label="상태"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                상태: {f.label}
              </option>
            ))}
          </select>
        </div>
        <b className="muted">
          {rows.length}건 · 합계 {formatWon(total)}
        </b>
      </div>
      <section className="card grow table-card">
        <table className="table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>시각</th>
              <th>메뉴</th>
              <th className="num">금액</th>
              <th>결제</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.orderNo}>
                <td>
                  <b>{r.orderNo}</b>
                </td>
                <td className="muted">{r.orderedAt}</td>
                <td>{r.menuSummary}</td>
                <td className="num">
                  <b>{formatWon(r.totalPrice)}</b>
                </td>
                <td className="muted">{r.paymentMethod}</td>
                <td>
                  <StatusChip status={r.status} />
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-cell">
                  {period === 'TODAY' ? '조건에 맞는 주문이 없어요' : '백엔드 연동 후 지난 주문을 볼 수 있어요'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <nav className="pagination" aria-label="페이지">
        <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="이전 페이지">
          ‹
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button key={p} type="button" className={p === current ? 'active' : ''} onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
        <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="다음 페이지">
          ›
        </button>
      </nav>
    </div>
  )
}
