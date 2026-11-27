import Pill from '../common/Pill'
import { formatWon } from '../../utils/format'
import type { Menu } from '../../types/menu'

// 고객 앱에서 이 메뉴가 어떻게 보이는지 (OWN-16 오른쪽)
export default function MenuPreview({ menu }: { menu: Menu }) {
  const remaining = menu.dailyLimit ? menu.dailyLimit.quantity - menu.dailyLimit.sold : null
  const soldOut = menu.soldOut || remaining === 0
  return (
    <div className="preview">
      <span className="muted">고객 앱 미리보기</span>
      <div className="phone">
        <div className="phone-image" style={{ backgroundImage: menu.imageUrl ? `url(${menu.imageUrl})` : undefined }}>
          {!menu.imageUrl && '메뉴 사진'}
        </div>
        <div className="phone-body">
          <div className="inline">
            <strong className="phone-name">{menu.name || '메뉴 이름'}</strong>
            {menu.representative && <Pill tone="orange">대표</Pill>}
          </div>
          <p className="muted">{menu.description || '메뉴 설명'}</p>
          <strong className="phone-price">{menu.price != null ? formatWon(menu.price) : '가격 미정'}</strong>
          {soldOut && <Pill tone="red">품절</Pill>}
          {!soldOut && remaining != null && menu.dailyLimit!.showRemainingAt > 0 && remaining <= menu.dailyLimit!.showRemainingAt + 2 && (
            <Pill tone="blue">오늘 {remaining}개 남았어요</Pill>
          )}
        </div>
        <div className="phone-cta" aria-disabled={soldOut}>
          {soldOut ? '지금은 주문할 수 없어요' : `${formatWon(menu.price ?? 0)} 담기`}
        </div>
        {menu.hidden && <div className="phone-hidden">숨김 메뉴는 고객 앱에 보이지 않아요</div>}
      </div>
    </div>
  )
}
