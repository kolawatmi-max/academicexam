import { createContext, useContext, useState, useCallback } from 'react'

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || ''

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const login = useCallback((code) => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true)
      setShowLogin(false)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
  }, [])

  const requestLogin = useCallback(() => {
    if (!isAdmin) setShowLogin(true)
  }, [isAdmin])

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, requestLogin }}>
      {children}
      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} onLogin={login} />}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}

function AdminLoginModal({ onClose, onLogin }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (onLogin(code)) {
      setError('')
    } else {
      setError('รหัสไม่ถูกต้อง')
    }
  }

  return (
    <div className="popup-backdrop active" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
          <h3 style={{ margin: 0 }}>เข้าสู่ระบบ Admin</h3>
          <p className="muted" style={{ marginTop: 4 }}>กรอกรหัสเพื่อเข้าถึงสิทธิ์แก้ไข</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>รหัส Admin</label>
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError('') }}
              placeholder="กรอกรหัส"
              autoFocus
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, margin: '4px 0 0' }}>{error}</p>}
          <div className="actions" style={{ marginTop: 16 }}>
            <button className="primary" type="submit" style={{ flex: 1, justifyContent: 'center' }}>
              เข้าสู่ระบบ
            </button>
            <button className="secondary" type="button" onClick={onClose}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
