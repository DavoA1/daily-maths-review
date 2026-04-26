import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'

function downloadCSV(filename, rows, headers) {
  const escape = v => {
    const s = String(v ?? '').replace(/"/g, '""')
    return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s
  }
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

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

  function exportCSV() {
    const cls = classes.find(c => c.id === activeClass)
    const headers = ['Class','Year Level','Skill','Strand','Topic','VC Code','Mastery (1-7)','Last Rating','Reviews','Scheduled Date','Last Reviewed','Source']
    const rows = classSkills.map(cs => {
      const sk = cs.skill || {}
      const h = Array.isArray(cs.rating_history) ? cs.rating_history : []
      const lastR = h.length ? h[h.length-1].rating : ''
      return [
        cls?.name || '', sk.year_level || '', sk.skill_name || '', sk.strand || '',
        sk.topic || '', sk.vc_code || '', cs.mastery || 1, lastR, h.length,
        cs.scheduled_date ? new Date(cs.scheduled_date).toLocaleDateString('en-AU') : '',
        cs.last_reviewed ? new Date(cs.last_reviewed).toLocaleDateString('en-AU') : '',
        cs.from_pat ? 'PAT' : cs.from_unit_plan ? 'Unit Plan' : 'Manual'
      ]
    })
    downloadCSV(`analytics-${cls?.name || 'class'}-${new Date().toISOString().split('T')[0]}.csv`, rows, headers)
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
    return (items.reduce((s,c) => s+(c.mastery||1), 0) / items.length).toFixed(1)
  }
  function lastRating(cs) {
    const h = cs.rating_history
    return Array.isArray(h) && h.length ? h[h.length-1].rating : null
  }
  function getPrereqs(lowItems) {
    const set = new Set()
    lowItems.forEach(cs => (cs.skill?.prerequisites||[]).forEach(p => set.add(p)))
    return [...set].slice(0,8)
  }
  const masteryColour = m => m <= 2 ? 'var(--red)' : m <= 4 ? 'var(--org)' : 'var(--grn)'
  const RATING_LABELS = ['','😕','🤔','😐','🙂','✅']

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-wrap">
      <div className="page-title">Analytics</div>
      <p className="page-sub">Mastery data by year level and topic. Use to identify gaps and inform cross-year review planning.</p>

      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:24, flexWrap:'wrap' }}>
        <div className="field" style={{ margin:0, minWidth:220 }}>
          <label>Class</label>
          <select className="input select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}{c.year_level ? ` (Yr ${c.year_level})` : ''}</option>)}
          </select>
        </div>
        {classSkills.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={exportCSV} style={{ marginTop:18 }}>
            📥 Export to CSV
          </button>
        )}
      </div>

      {classSkills.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>No data yet. Add topics to this class and complete check-ins to see analytics.</p>
        </div>
      ) : (
        <>
          {/* Cross-year summary */}
          <div className="card card-pad" style={{ marginBottom:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Cross-Year Summary</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10 }}>
              {Object.keys(byYear).sort().map(yr => {
                const items = byYear[yr]
                const avg = parseFloat(avgMastery(items))
                const col = masteryColour(avg)
                return (
                  <div key={yr} style={{ background:'var(--s2)', borderRadius:'var(--rs)', padding:12, textAlign:'center' }}>
                    <div style={{ fontSize:10, color:'var(--tm)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>Year {yr}</div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:col }}>{avg}</div>
                    <div style={{ fontSize:10, color:'var(--tm)' }}>{items.length} topics</div>
                    <div style={{ height:4, background:'var(--b2)', borderRadius:2, marginTop:6, overflow:'hidden' }}>
                      <div style={{ height:'100%', background:col, width:`${(avg/7)*100}%`, borderRadius:2 }} />
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
            const prereqs = getPrereqs(low)
            return (
              <div key={yr} style={{ marginBottom:28 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>Year {yr}</span>
                  <span className="yr-tag" style={{ background:'rgba(74,200,240,.1)', color:'var(--blu)' }}>Avg mastery: {avgMastery(items)}/7</span>
                </div>

                {low.length > 0 && (
                  <>
                    <div style={{ padding:'10px 14px', background:'rgba(240,74,107,.06)', border:'1px solid rgba(240,74,107,.2)', borderRadius:'var(--rs)', fontSize:12, marginBottom:8 }}>
                      <strong style={{ color:'var(--red)' }}>⚠ Needs reteaching: </strong>
                      {low.map(cs => cs.skill?.skill_name).join(', ')}
                    </div>
                    {prereqs.length > 0 && (
                      <div style={{ padding:'10px 14px', background:'rgba(74,200,240,.05)', border:'1px solid rgba(74,200,240,.2)', borderRadius:'var(--rs)', fontSize:12, marginBottom:8 }}>
                        <strong style={{ color:'var(--blu)' }}>💡 Check prerequisites: </strong>
                        {prereqs.map(p => <span key={p} className="prereq-pill">{p}</span>)}
                      </div>
                    )}
                  </>
                )}

                <table className="data-table">
                  <thead>
                    <tr><th>Skill</th><th>Strand</th><th>VC Code</th><th>Mastery</th><th>Last rating</th><th>Reviews</th><th>Source</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[...items].sort((a,b) => (a.mastery||1)-(b.mastery||1)).map(cs => {
                      const sk = cs.skill || {}
                      const m = cs.mastery || 1
                      const lastR = lastRating(cs)
                      const reviews = Array.isArray(cs.rating_history) ? cs.rating_history.length : 0
                      const strandCls = 'st-' + (sk.strand||'').toLowerCase().split(' ')[0]
                      const col = masteryColour(m)
                      const statusBadge = m <= 2 ? 'badge-due' : m <= 4 ? 'badge-soon' : 'badge-ok'
                      const statusText = m <= 2 ? 'Needs reteaching' : m <= 4 ? 'Developing' : 'Embedded'
                      return (
                        <tr key={cs.id}>
                          <td>
                            <div style={{ fontWeight:600, fontSize:12 }}>{sk.skill_name}</div>
                            <div style={{ fontSize:10, color:'var(--tm)' }}>{sk.topic}</div>
                          </td>
                          <td><span className={`strand-tag ${strandCls}`}>{sk.strand}</span></td>
                          <td style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--tm)' }}>{sk.vc_code}</td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <div style={{ width:60, height:6, background:'var(--b2)', borderRadius:3, overflow:'hidden' }}>
                                <div style={{ height:'100%', background:col, width:`${(m/7)*100}%`, borderRadius:3 }} />
                              </div>
                              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tm)' }}>{m}/7</span>
                            </div>
                          </td>
                          <td>{lastR ? <span style={{ fontSize:12 }}>{RATING_LABELS[lastR]} {lastR}/5</span> : <span style={{ color:'var(--tm)', fontSize:11 }}>—</span>}</td>
                          <td style={{ fontSize:11, color:'var(--tm)' }}>{reviews}</td>
                          <td><span style={{ fontSize:10, color:'var(--tm)' }}>{cs.from_pat ? 'PAT' : cs.from_unit_plan ? 'Unit plan' : 'Manual'}</span></td>
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
