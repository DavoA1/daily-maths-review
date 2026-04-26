import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'
import { getDueDate, isDue } from '../lib/spacedRep.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [activeClass, setActiveClass] = useState(null)
  const [classSkills, setClassSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddClass, setShowAddClass] = useState(false)
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [skills, setSkills] = useState([])
  const [toast, setToast] = useState('')

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (activeClass) loadClassSkills(activeClass.id) }, [activeClass])
  useEffect(() => { loadSkills() }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2800) }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data && data.length > 0 && !activeClass) setActiveClass(data[0])
    setLoading(false)
  }

  async function loadClassSkills(classId) {
    const { data } = await supabase
      .from('class_skills')
      .select(`*, skill:skills(*)`)
      .eq('class_id', classId)
      .order('created_at')
    setClassSkills(data || [])
  }

  async function loadSkills() {
    const { data } = await supabase.from('skills').select('*').order('year_level,strand,skill_name')
    setSkills(data || [])
  }

  async function addClass() {
    if (!newClassName.trim()) return
    const { data, error } = await supabase.from('classes').insert({
      teacher_id: user.id, name: newClassName.trim(), year_level: 9
    }).select().single()
    if (!error) {
      setClasses(c => [...c, data])
      setActiveClass(data)
      setNewClassName('')
      setShowAddClass(false)
      showToast(`Class "${data.name}" created`)
    }
  }

  const now = new Date()
  const dueToday = classSkills.filter(cs => isDue(cs))
  const dueSoon = classSkills.filter(cs => { const d = getDueDate(cs); return d > now && d <= new Date(now.getTime() + 3 * 86400000) })
  const embedded = classSkills.filter(cs => (cs.mastery || 1) >= 5)

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
        <div>
          <div className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
            <span style={{ color: 'var(--acc)' }}>{user?.email?.split('@')[0]}</span>
          </div>
          <div style={{ color: 'var(--tm)', fontSize: 12, marginTop: 3 }}>
            {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        {/* Class selector */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {classes.map(cls => (
            <button key={cls.id} onClick={() => setActiveClass(cls)}
              style={{ padding: '7px 15px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all .15s',
                background: activeClass?.id === cls.id ? 'var(--acc)' : 'var(--s1)',
                color: activeClass?.id === cls.id ? '#06070a' : 'var(--tm)',
                borderColor: activeClass?.id === cls.id ? 'var(--acc)' : 'var(--b2)' }}>
              {cls.name}
            </button>
          ))}
          <button onClick={() => setShowAddClass(true)}
            style={{ padding: '7px 15px', borderRadius: 100, fontSize: 12, cursor: 'pointer', border: '1px dashed var(--b2)', background: 'transparent', color: 'var(--tm)', transition: 'all .15s' }}>
            + Add class
          </button>
        </div>
      </div>

      {/* Stats */}
      {activeClass && (
        <>
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {[
              { label: 'Topics tracked', val: classSkills.length, cls: 'acc' },
              { label: 'Due today', val: dueToday.length, cls: 'red' },
              { label: 'Due in 3 days', val: dueSoon.length, cls: 'org' },
              { label: 'Embedded (LTM)', val: embedded.length, cls: 'blu', sub: 'long-term memory' },
            ].map(s => (
              <div key={s.label} className="card card-pad">
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tm)', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: `var(--${s.cls})` }}>{s.val}</div>
                {s.sub && <div style={{ fontSize: 10, color: 'var(--tm)', marginTop: 2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>

          {/* Concept table */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Concept Schedule</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddTopic(true)}>+ Add taught topic</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Skill</th><th>Yr</th><th>Strand</th><th>VC Code</th>
                <th>Last reviewed</th><th>Next due</th><th>Status</th><th>Mastery</th>
              </tr>
            </thead>
            <tbody>
              {classSkills.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--tm)' }}>
                  No topics yet — click "Add taught topic" to begin
                </td></tr>
              ) : (
                [...classSkills].sort((a, b) => getDueDate(a) - getDueDate(b)).map(cs => {
                  const sk = cs.skill || {}
                  const dueDate = getDueDate(cs)
                  const days = Math.round((dueDate - now) / 86400000)
                  const status = days <= 0 ? ['badge-due', 'Due now'] : days <= 3 ? ['badge-soon', `${days}d`] : (cs.mastery || 1) >= 5 ? ['badge-set', `${days}d`] : ['badge-ok', `${days}d`]
                  const strandCls = 'st-' + (sk.strand || '').toLowerCase().split(' ')[0]
                  const pips = [1,2,3,4,5].map(i => <span key={i} className={`pip${i <= (cs.mastery || 1) ? ' on' : ''}`} />)
                  const lr = cs.last_reviewed ? new Date(cs.last_reviewed).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : 'Never'
                  const nd = dueDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
                  return (
                    <tr key={cs.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{sk.skill_name}</div>
                        <div style={{ fontSize: 10, color: 'var(--tm)' }}>{sk.topic}</div>
                        {cs.from_pat && <span className="badge badge-due" style={{ marginTop: 2 }}>PAT gap</span>}
                        {cs.from_unit_plan && <span className="badge badge-ok" style={{ marginTop: 2 }}>Unit plan</span>}
                      </td>
                      <td><span className="yr-tag">Yr {sk.year_level}</span></td>
                      <td><span className={`strand-tag ${strandCls}`}>{sk.strand}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tm)' }}>{sk.vc_code}</td>
                      <td style={{ fontSize: 11, color: 'var(--tm)' }}>{lr}</td>
                      <td style={{ fontSize: 11, color: 'var(--tm)' }}>{nd}</td>
                      <td><span className={`badge ${status[0]}`}>{status[1]}</span></td>
                      <td><div className="pips">{pips}</div></td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddClass(false)}>
          <div className="modal">
            <h3>Add Class</h3>
            <div className="field">
              <label>Class name</label>
              <input className="input" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="e.g. 9B, Year 9 Maths" onKeyDown={e => e.key === 'Enter' && addClass()} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddClass(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addClass}>Add Class</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <AddTopicModal
          skills={skills}
          classId={activeClass?.id}
          onClose={() => setShowAddTopic(false)}
          onAdded={() => { loadClassSkills(activeClass.id); showToast('Topic added to schedule') }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function AddTopicModal({ skills, classId, onClose, onAdded }) {
  const [yr, setYr] = useState('9')
  const [strand, setStrand] = useState('')
  const [topic, setTopic] = useState('')
  const [skillId, setSkillId] = useState('')
  const [daysAgo, setDaysAgo] = useState('0')

  const years = [...new Set(skills.map(s => s.year_level))].sort()
  const strands = [...new Set(skills.filter(s => s.year_level == yr).map(s => s.strand))].sort()
  const topics = [...new Set(skills.filter(s => s.year_level == yr && s.strand === strand).map(s => s.topic))].sort()
  const filteredSkills = skills.filter(s => s.year_level == yr && s.strand === strand && s.topic === topic)

  async function add() {
    if (!skillId || !classId) return
    const lastReviewed = daysAgo > 0 ? new Date(Date.now() - daysAgo * 86400000).toISOString() : new Date().toISOString()
    const { error } = await supabase.from('class_skills').insert({
      class_id: classId, skill_id: skillId, mastery: 1, last_reviewed: lastReviewed
    })
    if (!error) { onAdded(); onClose() }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Add Taught Topic</h3>
        <div className="field">
          <label>Year Level</label>
          <select className="input select" value={yr} onChange={e => { setYr(e.target.value); setStrand(''); setTopic(''); setSkillId('') }}>
            {years.map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Strand</label>
          <select className="input select" value={strand} onChange={e => { setStrand(e.target.value); setTopic(''); setSkillId('') }}>
            <option value="">Select strand...</option>
            {strands.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        {strand && (
          <div className="field">
            <label>Topic</label>
            <select className="input select" value={topic} onChange={e => { setTopic(e.target.value); setSkillId('') }}>
              <option value="">Select topic...</option>
              {topics.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}
        {topic && (
          <div className="field">
            <label>Skill</label>
            <select className="input select" value={skillId} onChange={e => setSkillId(e.target.value)}>
              <option value="">Select skill...</option>
              {filteredSkills.map(s => (
                <option key={s.id} value={s.id}>{s.skill_name}</option>
              ))}
            </select>
          </div>
        )}
        {skillId && skills.find(s => s.id === skillId)?.prerequisites?.length > 0 && (
          <div style={{ padding: '8px 12px', background: 'rgba(74,200,240,.06)', border: '1px solid rgba(74,200,240,.2)', borderRadius: 'var(--rs)', fontSize: 11, marginBottom: 14 }}>
            <strong style={{ color: 'var(--blu)' }}>Prerequisites: </strong>
            {skills.find(s => s.id === skillId)?.prerequisites.map(p => (
              <span key={p} className="prereq-pill">{p}</span>
            ))}
          </div>
        )}
        <div className="field">
          <label>When was this taught?</label>
          <select className="input select" value={daysAgo} onChange={e => setDaysAgo(e.target.value)}>
            <option value="0">Today</option>
            <option value="1">Yesterday</option>
            <option value="3">3 days ago</option>
            <option value="7">About a week ago</option>
            <option value="14">2 weeks ago</option>
            <option value="30">About a month ago</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={add} disabled={!skillId}>Add to Schedule →</button>
        </div>
      </div>
    </div>
  )
}
