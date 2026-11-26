import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/common/Button'
import { MOCK_STORE } from '../../mocks/orders'

// OWN-01: 로그인. 백엔드 연동 전이라 입력만 확인하고 주문판으로 이동한다
export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const filled = email.trim() !== '' && password !== ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!filled) {
      setError(true)
      return
    }
    navigate('/orders')
  }

  return (
    <div className="login">
      <div className="login-band">
        <span>띱 사장님</span>
      </div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">띱</div>
        <h1>띱 사장님</h1>
        <p className="muted">주문 접수를 시작하려면 로그인해 주세요</p>

        <label className="field">
          <span>이메일</span>
          <input
            className="input"
            type="email"
            placeholder="example@ddip.test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input
            className={`input ${error ? 'input-error' : ''}`}
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
          />
        </label>
        {error && <p className="error-text">이메일 또는 비밀번호를 확인해 주세요</p>}

        <Button block type="submit" variant={filled ? 'primary' : 'secondary'}>
          로그인
        </Button>
      </form>
      <p className="login-foot muted">
        {MOCK_STORE.name} · {MOCK_STORE.address}
      </p>
    </div>
  )
}
