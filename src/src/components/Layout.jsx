import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◈', end: true },
  { to: '/generate', label: 'Generate', icon: '⚡' },
  { to: '/checkin', label: 'Check-in', icon: '✓' },
  { to: '/bank', label: 'Question Bank', icon: '◻' },
  { to: '/analytics', label: 'Analytics', icon: '◉' },
  { to: '/unitplan', label: 'Unit Plans', icon: '◑' },
  { to: '/pat', label: 'PAT Data', icon: '◈' },
  { to: '/settings', label: 'Settings', icon: '◎' },
]

export default function Layout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '0 20px', height: 52,
        background: 'rgba(8,9,13,.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--b1)', position: 'sticky', top: 0, zIndex: 100,
        gap: 4
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
          <div style={{ width: 14, height: 14, background: 'var(--acc)', clipPath: 'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '.2em', color: 'var(--acc)', textTransform: 'uppercase' }}>DMR</span>
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} style={({ isActive }) => ({
              padding: '6px 13px', borderRadius: 'var(--rs)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', border: 'none', textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'all .15s', color: isActive ? 'var(--tx)' : 'var(--tm)',
              background: isActive ? 'var(--s2)' : 'transparent', fontFamily: 'var(--font-body)'
            })}>
              {n.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', fontSize: 12, color: 'var(--tm)', flexShrink: 0 }}>
          <span>{profile?.name}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/homework')} style={{ color: 'var(--grn)', borderColor: 'var(--grn)' }}>
            Student Portal
          </button>
          <button className="btn btn-secondary btn-sm" onClick={signOut}>Sign out</button>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
