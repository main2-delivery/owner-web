import PageHeader from '../../components/common/PageHeader'
import SegmentTabs from '../../components/common/SegmentTabs'
import { MOCK_TODAY_SUMMARY as S } from '../../mocks/sales'
import { formatWon } from '../../utils/format'
import { SALES_TABS } from '../../constants/sales'

// OWN-19: 오늘 요약 (DUDU-31). 연동 시 1분마다 다시 불러온다
export default function TodaySummaryPage() {
  const nowHour = new Date().getHours()
  const peak = Math.max(...S.hourly.map((h) => h.count))
  return (
    <div className="page">
      <PageHeader title="오늘 요약" description={`${S.date} 기준`}>
        <SegmentTabs items={SALES_TABS} />
      </PageHeader>
      <div className="kpis">
        <Kpi label="오늘 매출" value={formatWon(S.salesAmount)} note={`어제보다 ${S.salesDiff >= 0 ? '+' : ''}${formatWon(S.salesDiff)}`} tone={S.salesDiff >= 0 ? 'good' : 'bad'} />
        <Kpi label="주문 수" value={`${S.orderCount}건`} note={`어제 같은 시각 ${S.orderCountYesterday}건`} />
        <Kpi label="평균 조리 시간" value={`${S.avgCookMinutes}분`} note={`목표 ${S.targetCookMinutes}분 이내`} tone={S.avgCookMinutes <= S.targetCookMinutes ? 'good' : 'bad'} />
        <Kpi label="거절·취소" value={`${S.rejectedCount}건`} note={S.rejectedNote} tone={S.rejectedCount > 0 ? 'bad' : undefined} />
      </div>
      <div className="row grow-y">
        <section className="card grow">
          <div className="between">
            <h3>시간대별 주문</h3>
            <span className="muted">건</span>
          </div>
          <div className="bar-chart" role="img" aria-label="시간대별 주문 수">
            {S.hourly.map((h) => (
              <div key={h.hour} className={`bar-col${h.count === peak ? ' peak' : ''}${h.hour > nowHour ? ' future' : ''}`}>
                {h.count > 0 && <span className="bar-value">{h.count}</span>}
                <span className="bar" style={{ height: `${(h.count / peak) * 100}%` }} />
                <span className="bar-label">{h.hour}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card w-360">
          <h3>오늘 인기 메뉴</h3>
          <ol className="rank-list">
            {S.popularMenus.map((m, i) => (
              <li key={m.name}>
                <b className={i < 3 ? 'accent-text' : 'muted'}>{i + 1}</b>
                <span className="grow">{m.name}</span>
                <span className="muted">{m.count}개</span>
                <b className="amount">{formatWon(m.amount)}</b>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone?: 'good' | 'bad' }) {
  return (
    <section className="card kpi">
      <span className="muted strong">{label}</span>
      <strong>{value}</strong>
      <span className={tone ? `kpi-${tone}` : 'muted'}>{note}</span>
    </section>
  )
}
