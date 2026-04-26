import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'

export default function Analytics() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [activeClass, setActiveClass] = useState('')
  const [classSkills, setClassSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (activeClass) loadData(activeClass) }, [activeClass])

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data?.length) setActiveClass(data[0].id)
    setLoading(false)
  }

  async function loadData(classId) {
    setLoading(true)
    const { data } = await supabase.from('class_skills').select(`*, skill:skills(*)`).eq('class_id', classId)
    setClassSkills(data || [])
    setLoading(false)
  }

  // Group by year level
  const byYear = {}
  classSkills.forEach(cs => {
    const yr = cs.skill?.year_level
    if (!byYear[yr]) byYear[yr] = []
    byYear[yr].push(cs)
  })

  function avgMastery(items) {
    if (!items.length) return 0
    return (items.reduce((s, c) => s + (c.mastery || 1), 0) / items.length).toFixed(1)
  }

  function lastRating(cs) {
    const h = cs.rating_history
    if (!Array.isArray(h) || !h.length) return null
    return h[h.length - 1].rating
  }

  function getPrereqsForLow(lowItems) {
    const set = new Set()
    lowItems.forEach(cs => {
      const prereqs = cs.skill?.prerequisites || []
      prereqs.forEach(p => set.add(p))
    })
    return [...set].slice(0, 8)
  }

  const RATING_LABELS = ['','😕 Lost','🤔 Struggling','😐 Mixed','🙂 Good','✅ Got it']
  const MASTERY_COLOUR = (m) => m <= 2 ? 'var(--red)' : m <= 4 ? 'var(--org)' : 'var(--grn)'

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-wrap">
      <div className="page-title">Analytics</div>
      <p className="page-sub">Mastery data by year level and topic. Use to identify gaps and inform cross-year review planning.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="field" style={{ margin: 0, minWidth: 220 }}>
          <label>Class</label>
          <select className="input select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {classSkills.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>No data yet. Add topics to this class and complete check-ins to see analytics.</p>
        </div>
      ) : (
        <>
          {/* Cross-year summary */}
          <div className="card card-pad" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Cross-Year Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
              {Object.keys(byYear).sort().map(yr => {
                const items = byYear[yr]
                const avg = parseFloat(avgMastery(items))
                const col = MASTERY_COLOUR(avg)
                return (
                  <div key={yr} style={{ background: 'var(--s2)', borderRadius: 'var(--rs)', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--tm)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Year {yr}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: col }}>{avg}</div>
                    <div style={{ fontSize: 10, color: 'var(--tm)' }}>{items.length} topics</div>
                    <div style={{ height: 4, background: 'var(--b2)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: col, width: `${(avg/7)*100}%`, borderRadius: 2 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Per year breakdown */}
          {Object.keys(byYear).sort().map(yr => {
            const items = byYear[yr]
            const low = items.filter(cs => (cs.mastery||1) <= 2)
            const prereqs = getPrereqsForLow(low)
            return (
              <div key={yr} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Year {yr}</span>
                  <span className="yr-tag" style={{ background: 'rgba(74,200,240,.1)', color: 'var(--blu)' }}>Avg mastery: {avgMastery(items)}/7</span>
                </div>

                {low.length > 0 && (
                  <>
                    <div style={{ padding: '10px 14px', background: 'rgba(240,74,107,.06)', border: '1px solid rgba(240,74,107,.2)', borderRadius: 'var(--rs)', fontSize: 12, marginBottom: 8 }}>
                      <strong style={{ color: 'var(--red)' }}>⚠ Needs reteaching: </strong>
                      {low.map(cs => cs.skill?.skill_name).join(', ')}
                    </div>
                    {prereqs.length > 0 && (
                      <div style={{ padding: '10px 14px', background: 'rgba(74,200,240,.05)', border: '1px solid rgba(74,200,240,.2)', borderRadius: 'var(--rs)', fontSize: 12, marginBottom: 8 }}>
                        <strong style={{ color: 'var(--blu)' }}>💡 Check prerequisites: </strong>
                        {prereqs.map(p => <span key={p} className="prereq-pill">{p}</span>)}
                      </div>
                    )}
                  </>
                )}

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill</th><th>Strand</th><th>VC Code</th>
                      <th>Mastery</th><th>Last rating</th><th>Reviews</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...items].sort((a,b) => (a.mastery||1)-(b.mastery||1)).map(cs => {
                      const sk = cs.skill || {}
                      const m = cs.mastery || 1
                      const lastR = lastRating(cs)
                      const reviews = Array.isArray(cs.rating_history) ? cs.rating_history.length : 0
                      const strandCls = 'st-' + (sk.strand||'').toLowerCase().split(' ')[0]
                      const barCol = MASTERY_COLOUR(m)
                      const statusText = m <= 2 ? 'Needs reteaching' : m <= 4 ? 'Developing' : 'Embedded'
                      const statusBadge = m <= 2 ? 'badge-due' : m <= 4 ? 'badge-soon' : 'badge-ok'
                      return (
                        <tr key={cs.id}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 12 }}>{sk.skill_name}</div>
                            <div style={{ fontSize: 10, color: 'var(--tm)' }}>{sk.topic}</div>
                          </td>
                          <td><span className={`strand-tag ${strandCls}`}>{sk.strand}</span></td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tm)' }}>{sk.vc_code}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 60, height: 6, background: 'var(--b2)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: barCol, width: `${(m/7)*100}%`, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tm)' }}>{m}/7</span>
                            </div>
                          </td>
                          <td>{lastR ? <span style={{ fontSize: 12 }}>{RATING_LABELS[lastR]} ({lastR}/5)</span> : <span style={{ color: 'var(--tm)', fontSize: 11 }}>—</span>}</td>
                          <td style={{ fontSize: 11, color: 'var(--tm)' }}>{reviews}</td>
                          <td><span className={`badge ${statusBadge}`}>{statusText}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
