import { useState } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { Navigate } from 'react-router-dom'

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fn = mode === 'login' ? signIn(email, password) : signUp(email, password, name)
    const { error: err } = await fn
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 30% -10%, rgba(74,200,240,.07), transparent 60%), var(--bg)',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: 420, animation: 'rise .7s cubic-bezier(.16,1,.3,1) both' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 32, height: 32, background: 'var(--acc)', clipPath: 'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--acc)' }}>
            Daily Maths Review
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,6vw,46px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 8 }}>
          {mode === 'login' ? <>Welcome<br /><span style={{ color: 'var(--acc)' }}>back</span></> : <>Create your<br /><span style={{ color: 'var(--acc)' }}>account</span></>}
        </h1>
        <p style={{ color: 'var(--tm)', fontSize: 13, marginBottom: 32, lineHeight: 1.6 }}>
          Victorian Curriculum · Year 5–12 · Spaced Repetition
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="field">
              <label>Your name</label>
              <input className="input" type="text" placeholder="Ms Johnson" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="field">
            <label>Email address</label>
            <input className="input" type="email" placeholder="you@school.vic.edu.au" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(240,74,107,.1)', border: '1px solid var(--red)', borderRadius: 'var(--rs)', color: 'var(--red)', fontSize: 12, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 6 }} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--tm)' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
