import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'
import { isDue } from '../lib/spacedRep.js'

const RATINGS = [
  { v:1, l:'😕 Most lost', cls:'r1' },
  { v:2, l:'🤔 Struggling', cls:'r2' },
  { v:3, l:'😐 Mixed', cls:'r3' },
  { v:4, l:'🙂 Good', cls:'r4' },
  { v:5, l:'✅ Got it!', cls:'r5' },
]

export default function Checkin() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [activeClass, setActiveClass] = useState('')
  const [dueItems, setDueItems] = useState([])
  const [ratings, setRatings] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (activeClass) loadDue(activeClass) }, [activeClass])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data?.length) setActiveClass(data[0].id)
  }

  async function loadDue(classId) {
    const { data } = await supabase
      .from('class_skills')
      .select(`*, skill:skills(*)`)
      .eq('class_id', classId)
    const due = (data || []).filter(cs => isDue(cs))
    setDueItems(due)
    setRatings({})
    setSaved(false)
  }

  function setRating(csId, val) {
    setRatings(r => ({ ...r, [csId]: val }))
  }

  async function saveAll() {
    setSaving(true)
    const entries = Object.entries(ratings)
    for (const [csId, rating] of entries) {
      const cs = dueItems.find(d => d.id === csId)
      if (!cs) continue
      const history = Array.isArray(cs.rating_history) ? [...cs.rating_history] : []
      history.push({ date: new Date().toISOString(), rating })
      const mastery = rating <= 2 ? Math.max(1, (cs.mastery||1) - 1)
                    : rating >= 4 ? Math.min(7, (cs.mastery||1) + 1)
                    : cs.mastery || 1
      await supabase.from('class_skills').update({
        mastery, last_reviewed: new Date().toISOString(), rating_history: history
      }).eq('id', csId)
    }
    setSaving(false)
    setSaved(true)
    showToast(`✓ ${entries.length} concept${entries.length !== 1 ? 's' : ''} updated`)
    loadDue(activeClass)
  }

  const rated = Object.keys(ratings).length

  return (
    <div className="page-wrap">
      <div className="page-title">Post-Lesson Check-in</div>
      <p className="page-sub">Rate how your class understood each topic. Updates the spaced repetition schedule automatically. Under 2 minutes.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="field" style={{ margin: 0, minWidth: 220 }}>
          <label>Class</label>
          <select className="input select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {dueItems.length > 0 && (
          <button className="btn btn-primary" onClick={saveAll} disabled={saving || rated === 0}
            style={{ marginTop: 18 }}>
            {saving ? 'Saving...' : `Save ${rated} rating${rated !== 1 ? 's' : ''} →`}
          </button>
        )}
      </div>

      {dueItems.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✅</div>
          <p>No topics due for check-in today for this class. Check back after your next review session.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {dueItems.map(cs => {
            const sk = cs.skill || {}
            const strandCls = 'st-' + (sk.strand || '').toLowerCase().split(' ')[0]
            const currentRating = ratings[cs.id]
            const pips = [1,2,3,4,5].map(i => (
              <span key={i} className={`pip${i <= (cs.mastery||1) ? ' on' : ''}`} />
            ))
            return (
              <div key={cs.id} className="card card-pad" style={{
                border: currentRating ? '1px solid var(--acc)' : '1px solid var(--b1)',
                background: currentRating ? 'rgba(240,228,74,.03)' : 'var(--s1)',
                transition: 'all .2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{sk.skill_name}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`strand-tag ${strandCls}`}>{sk.strand}</span>
                      <span className="yr-tag">Yr {sk.year_level}</span>
                      <span style={{ fontSize: 10, color: 'var(--tm)', fontFamily: 'var(--font-mono)' }}>{sk.vc_code}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: 'var(--tm)' }}>Mastery:</span>
                      <div className="pips">{pips}</div>
                      <span style={{ fontSize: 10, color: 'var(--tm)' }}>{cs.mastery || 1}/7</span>
                    </div>
                  </div>
                  <div className="rating-row" style={{ flexShrink: 0 }}>
                    {RATINGS.map(r => (
                      <button key={r.v} className={`r-btn ${r.cls}${currentRating === r.v ? ' sel' : ''}`}
                        onClick={() => setRating(cs.id, r.v)}>
                        {r.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {saved && rated === 0 && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(74,240,160,.06)', border: '1px solid rgba(74,240,160,.2)', borderRadius: 'var(--rs)', fontSize: 13, color: 'var(--grn)' }}>
          ✓ All ratings saved. Spaced repetition schedule updated.
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
