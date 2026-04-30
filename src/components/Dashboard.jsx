import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'
import { getDueDate, isDue } from '../lib/spacedRep.js'


// ── COMPETENCY SPARK BAR ─────────────────────────────────────
function SparkBar({ history }) {
  const recent = (history || []).slice(-8)
  if (!recent.length) return <span style={{ color:'var(--tm)', fontSize:10 }}>No data</span>
  const cols = { 1:'#f04a6b', 2:'#f0944a', 3:'#f0e44a', 4:'#4af0a0', 5:'#4ac8f0' }
  const avg = recent.reduce((s,r) => s + (r.rating||0), 0) / recent.length
  return (
    <div title={`Avg: ${avg.toFixed(1)} — ${recent.length} sessions`}>
      <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:20 }}>
        {recent.map((r, i) => (
          <div key={i} style={{
            width:6,
            height: `${Math.max(20, (r.rating||0)/5*100)}%`,
            background: r.skipped ? '#5a6080' : (cols[r.rating] || '#5a6080'),
            borderRadius:2,
            opacity: 0.4 + (i / recent.length) * 0.6,
            title: r.skipped ? 'Skipped' : `Rating: ${r.rating}`,
          }} />
        ))}
      </div>
      <div style={{ fontSize:9, color:'var(--tm)', marginTop:2, textAlign:'center' }}>{avg.toFixed(1)}/5</div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [activeClass, setActiveClass] = useState(null)
  const [classSkills, setClassSkills] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddClass, setShowAddClass] = useState(false)
  const [showEditClass, setShowEditClass] = useState(false)
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [editingCS, setEditingCS] = useState(null)
  const [newClassName, setNewClassName] = useState('')
  const [newClassYr, setNewClassYr] = useState(9)
  const [editClassData, setEditClassData] = useState({ name: '', year_level: 9 })
  const [toast, setToast] = useState('')

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (activeClass) loadClassSkills(activeClass.id) }, [activeClass])
  useEffect(() => { loadSkills() }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2800) }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data?.length && !activeClass) setActiveClass(data[0])
    setLoading(false)
  }

  async function loadClassSkills(classId) {
    const { data } = await supabase
      .from('class_skills').select(`*, skill:skills(*)`).eq('class_id', classId).order('created_at')
    setClassSkills(data || [])
  }

  async function loadSkills() {
    const { data } = await supabase.from('skills').select('*').order('year_level,strand,skill_name').range(0, 9999)
    setSkills(data || [])
  }

  async function addClass() {
    if (!newClassName.trim()) return
    const { data, error } = await supabase.from('classes').insert({
      teacher_id: user.id, name: newClassName.trim(), year_level: parseInt(newClassYr)
    }).select().single()
    if (!error) {
      setClasses(c => [...c, data])
      setActiveClass(data)
      setNewClassName(''); setNewClassYr(9); setShowAddClass(false)
      showToast(`Class "${data.name}" created`)
    }
  }

  async function updateClass() {
    const { error } = await supabase.from('classes').update({
      name: editClassData.name, year_level: parseInt(editClassData.year_level)
    }).eq('id', activeClass.id)
    if (!error) {
      setClasses(cs => cs.map(c => c.id === activeClass.id ? { ...c, ...editClassData } : c))
      setActiveClass(a => ({ ...a, ...editClassData }))
      setShowEditClass(false); showToast('Class updated')
    }
  }

  async function deleteCS(id) {
    if (!confirm('Remove this topic from the schedule?')) return
    await supabase.from('class_skills').delete().eq('id', id)
    loadClassSkills(activeClass.id); showToast('Topic removed')
  }

  async function updateCS(id, updates) {
    const { error } = await supabase.from('class_skills').update(updates).eq('id', id)
    if (!error) { loadClassSkills(activeClass.id); setEditingCS(null); showToast('✓ Updated') }
  }

  const now = new Date()
  const dueToday = classSkills.filter(cs => isDue(cs))
  const dueSoon = classSkills.filter(cs => { const d = getDueDate(cs); return d > now && d <= new Date(now.getTime() + 3 * 86400000) })
  const embedded = classSkills.filter(cs => (cs.mastery || 1) >= 5)

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:14, marginBottom:24 }}>
        <div>
          <div className="page-title">
            Good {now.getHours() < 12 ? 'morning' : 'afternoon'},{' '}
            <span style={{ color:'var(--acc)' }}>{user?.email?.split('@')[0]}</span>
          </div>
          <div style={{ color:'var(--tm)', fontSize:12, marginTop:3 }}>
            {now.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </div>
        </div>
        {/* Class selector */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
          {classes.map(cls => (
            <button key={cls.id} onClick={() => setActiveClass(cls)}
              style={{ padding:'7px 15px', borderRadius:100, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid', transition:'all .15s',
                background: activeClass?.id === cls.id ? 'var(--acc)' : 'var(--s1)',
                color: activeClass?.id === cls.id ? '#06070a' : 'var(--tm)',
                borderColor: activeClass?.id === cls.id ? 'var(--acc)' : 'var(--b2)' }}>
              {cls.name} {cls.year_level ? `(Yr ${cls.year_level})` : ''}
            </button>
          ))}
          <button onClick={() => setShowAddClass(true)}
            style={{ padding:'7px 15px', borderRadius:100, fontSize:12, cursor:'pointer', border:'1px dashed var(--b2)', background:'transparent', color:'var(--tm)' }}>
            + Add class
          </button>
          {activeClass && (
            <button onClick={() => { setEditClassData({ name: activeClass.name, year_level: activeClass.year_level || 9 }); setShowEditClass(true) }}
              style={{ padding:'7px 12px', borderRadius:100, fontSize:11, cursor:'pointer', border:'1px solid var(--b2)', background:'transparent', color:'var(--tm)' }}>
              ✏ Edit class
            </button>
          )}
        </div>
      </div>

      {/* Class code banner */}
      {activeClass && (
        <div style={{ padding:'8px 14px', background:'rgba(74,240,160,.05)', border:'1px solid rgba(74,240,160,.2)', borderRadius:'var(--rs)', fontSize:12, color:'var(--td)', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
          <span>Homework class code:</span>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--grn)', fontSize:14 }}>{activeClass.class_code || '—'}</span>
          <span style={{ color:'var(--tm)' }}>Students go to {window.location.origin}/homework and enter this code</span>
        </div>
      )}

      {/* Stats */}
      {activeClass && (
        <>
          <div className="grid-4" style={{ marginBottom:24 }}>
            {[
              { label:'Topics tracked', val:classSkills.length, col:'acc' },
              { label:'Due today', val:dueToday.length, col:'red' },
              { label:'Due in 3 days', val:dueSoon.length, col:'org' },
              { label:'Embedded (LTM)', val:embedded.length, col:'blu', sub:'long-term memory' },
            ].map(s => (
              <div key={s.label} className="card card-pad">
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--tm)', marginBottom:6 }}>{s.label}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:`var(--${s.col})` }}>{s.val}</div>
                {s.sub && <div style={{ fontSize:10, color:'var(--tm)', marginTop:2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>

          {/* Concept table */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700 }}>Concept Schedule</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddTopic(true)}>+ Add taught topic</button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Skill</th><th>Yr</th><th>Strand</th><th>VC Code</th>
                <th>Last reviewed</th><th>Scheduled</th><th>Status</th><th>Mastery</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classSkills.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'32px', color:'var(--tm)' }}>
                  No topics yet — click "Add taught topic" to begin
                </td></tr>
              ) : (
                [...classSkills].sort((a,b) => getDueDate(a) - getDueDate(b)).map(cs => {
                  const sk = cs.skill || {}
                  const dueDate = getDueDate(cs)
                  const days = Math.round((dueDate - now) / 86400000)
                  const statusCls = days <= 0 ? 'badge-due' : days <= 3 ? 'badge-soon' : (cs.mastery||1) >= 5 ? 'badge-set' : 'badge-ok'
                  const statusTxt = days <= 0 ? 'Due now' : `${days}d`
                  const strandCls = 'st-' + (sk.strand||'').toLowerCase().split(' ')[0]
                  const pips = [1,2,3,4,5].map(i => <span key={i} className={`pip${i<=(cs.mastery||1)?' on':''}`} />)
                  const lr = cs.last_reviewed ? new Date(cs.last_reviewed).toLocaleDateString('en-AU',{day:'numeric',month:'short'}) : 'Never'
                  const sd = cs.scheduled_date ? new Date(cs.scheduled_date).toLocaleDateString('en-AU',{day:'numeric',month:'short'}) : '—'
                  return (
                    <tr key={cs.id}>
                      <td>
                        <div style={{ fontWeight:600, fontSize:12 }}>{sk.skill_name}</div>
                        <div style={{ fontSize:10, color:'var(--tm)' }}>{sk.topic}</div>
                        {cs.from_pat && <span className="badge badge-due" style={{ marginTop:2, fontSize:8 }}>PAT</span>}
                        {cs.from_unit_plan && <span className="badge badge-ok" style={{ marginTop:2, fontSize:8 }}>Unit plan</span>}
                      </td>
                      <td><span className="yr-tag">Yr {sk.year_level}</span></td>
                      <td><span className={`strand-tag ${strandCls}`}>{sk.strand}</span></td>
                      <td style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--tm)' }}>{sk.vc_code}</td>
                      <td style={{ fontSize:11, color:'var(--tm)' }}>{lr}</td>
                      <td style={{ fontSize:11, color:'var(--tm)' }}>{sd}</td>
                      <td><span className={`badge ${statusCls}`}>{statusTxt}</span></td>
                      <td><div className="pips">{pips}</div></td>
                      <td style={{ minWidth:60 }}><SparkBar history={cs.rating_history} /></td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          <button className="btn btn-ghost btn-sm" style={{ color:'var(--blu)', padding:'3px 8px' }}
                            onClick={() => setEditingCS({ ...cs })}>✏</button>
                          <button className="btn btn-ghost btn-sm" style={{ color:'var(--red)', padding:'3px 8px' }}
                            onClick={() => deleteCS(cs.id)}>✕</button>
                        </div>
                      </td>
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
              <input className="input" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="e.g. 9B, Year 9 Maths" />
            </div>
            <div className="field">
              <label>Year level</label>
              <select className="input select" value={newClassYr} onChange={e => setNewClassYr(e.target.value)}>
                {[5,6,7,8,9,10,11,12].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddClass(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addClass}>Add Class</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditClass && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowEditClass(false)}>
          <div className="modal">
            <h3>Edit Class</h3>
            <div className="field">
              <label>Class name</label>
              <input className="input" value={editClassData.name} onChange={e => setEditClassData(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="field">
              <label>Year level</label>
              <select className="input select" value={editClassData.year_level} onChange={e => setEditClassData(d => ({ ...d, year_level: parseInt(e.target.value) }))}>
                {[5,6,7,8,9,10,11,12].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditClass(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={updateClass}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Concept Schedule Item Modal */}
      {editingCS && (
        <EditCSModal cs={editingCS} onClose={() => setEditingCS(null)} onSave={updates => updateCS(editingCS.id, updates)} />
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <AddTopicModal skills={skills} classId={activeClass?.id} onClose={() => setShowAddTopic(false)}
          onAdded={() => { loadClassSkills(activeClass.id); showToast('Topic added to schedule') }} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function EditCSModal({ cs, onClose, onSave }) {
  const sk = cs.skill || {}
  const [mastery, setMastery] = useState(cs.mastery || 1)
  const [scheduledDate, setScheduledDate] = useState(cs.scheduled_date ? cs.scheduled_date.split('T')[0] : '')
  const [lastReviewed, setLastReviewed] = useState(cs.last_reviewed ? cs.last_reviewed.split('T')[0] : '')
  const [learningIntention, setLearningIntention] = useState(cs.learning_intention || '')

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Edit: {sk.skill_name}</h3>
        <p style={{ fontSize:12, color:'var(--tm)', marginBottom:16 }}>{sk.topic} · {sk.strand} · Year {sk.year_level}</p>

        <div className="field">
          <label>Mastery level (1–7)</label>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <input type="range" min={1} max={7} value={mastery} onChange={e => setMastery(parseInt(e.target.value))}
              style={{ flex:1, accentColor:'var(--acc)' }} />
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--acc)', minWidth:24 }}>{mastery}</span>
          </div>
          <div style={{ fontSize:10, color:'var(--tm)', marginTop:4 }}>
            {mastery <= 2 ? '⚠ Needs reteaching' : mastery <= 4 ? '📈 Developing' : '✅ Embedded in long-term memory'}
          </div>
        </div>

        <div className="grid-2">
          <div className="field" style={{ margin:0 }}>
            <label>Scheduled / teach date</label>
            <input className="input" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
          </div>
          <div className="field" style={{ margin:0 }}>
            <label>Last reviewed</label>
            <input className="input" type="date" value={lastReviewed} onChange={e => setLastReviewed(e.target.value)} />
          </div>
        </div>

        <div className="field" style={{ marginTop:14 }}>
          <label>Learning intention (optional)</label>
          <input className="input" value={learningIntention} onChange={e => setLearningIntention(e.target.value)}
            placeholder="Students will be able to..." />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave({
            mastery,
            scheduled_date: scheduledDate ? new Date(scheduledDate).toISOString() : null,
            last_reviewed: lastReviewed ? new Date(lastReviewed).toISOString() : null,
            learning_intention: learningIntention
          })}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function AddTopicModal({ skills, classId, onClose, onAdded }) {
  const [yr, setYr] = useState('9')
  const [strand, setStrand] = useState('')
  const [topic, setTopic] = useState('')
  const [skillId, setSkillId] = useState('')
  const [teachDate, setTeachDate] = useState(new Date().toISOString().split('T')[0])

  const years = [...new Set(skills.map(s => s.year_level))].sort()
  const strands = [...new Set(skills.filter(s => s.year_level == yr).map(s => s.strand))].sort()
  const topics = [...new Set(skills.filter(s => s.year_level == yr && s.strand === strand).map(s => s.topic))].sort()
  const filteredSkills = skills.filter(s => s.year_level == yr && s.strand === strand && s.topic === topic)
  const selectedSkill = skills.find(s => s.id === skillId)

  async function add() {
    if (!skillId || !classId) return
    const d = new Date(teachDate)
    const isUpcoming = d > new Date()
    const { error } = await supabase.from('class_skills').insert({
      class_id: classId,
      skill_id: skillId,
      mastery: 1,
      last_reviewed: isUpcoming ? null : d.toISOString(),
      scheduled_date: d.toISOString(),
      from_unit_plan: isUpcoming
    })
    if (!error) { onAdded(); onClose() }
    else alert('Could not add — this skill may already be in the schedule.')
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
              {filteredSkills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
            </select>
          </div>
        )}
        {selectedSkill?.prerequisites?.length > 0 && (
          <div style={{ padding:'8px 12px', background:'rgba(74,200,240,.06)', border:'1px solid rgba(74,200,240,.2)', borderRadius:'var(--rs)', fontSize:11, marginBottom:14 }}>
            <strong style={{ color:'var(--blu)' }}>Prerequisites: </strong>
            {selectedSkill.prerequisites.map(p => <span key={p} className="prereq-pill">{p}</span>)}
          </div>
        )}
        <div className="field">
          <label>Teaching date (past or upcoming)</label>
          <input className="input" type="date" value={teachDate}
            onChange={e => setTeachDate(e.target.value)} />
          {teachDate && (() => {
            const d = new Date(teachDate)
            const today = new Date(); today.setHours(0,0,0,0)
            const diff = Math.round((d - today) / 86400000)
            if (diff > 0) return <div style={{ fontSize:11, color:'#7c3aed', marginTop:4 }}>📅 Upcoming topic — scheduled {diff} day{diff!==1?'s':''} from now</div>
            if (diff === 0) return <div style={{ fontSize:11, color:'#059669', marginTop:4 }}>✅ Teaching today</div>
            return <div style={{ fontSize:11, color:'var(--tm)', marginTop:4 }}>📘 Taught {Math.abs(diff)} day{Math.abs(diff)!==1?'s':''} ago</div>
          })()}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={add} disabled={!skillId}>Add to Schedule →</button>
        </div>
      </div>
    </div>
  )
}
