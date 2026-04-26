import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'
import { seedAll } from '../lib/seed.js'

function downloadCSV(filename, rows, headers) {
  const escape = v => { const s = String(v??'').replace(/"/g,'""'); return s.includes(',')||s.includes('\n')||s.includes('"') ? `"${s}"` : s }
  const csv = [headers,...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv],{type:'text/csv'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click()
  URL.revokeObjectURL(url)
}

const QTYPE_LABELS = { std:'Standard', mc:'Multiple Choice', tf:'True/False', fill:'Fill in Blank', worded:'Word Problem', error:'Error Analysis', show:'Show Working' }
const TIER_CLS = ['','t1','t2','t3','t4']
const TIER_FULL = ['','Foundation','Core','Extension','Challenge']

export default function QuestionBank() {
  const { user } = useAuth()
  const [skills, setSkills] = useState([])
  const [questions, setQuestions] = useState([])
  const [filterYr, setFilterYr] = useState('all')
  const [filterStrand, setFilterStrand] = useState('all')
  const [filterTopic, setFilterTopic] = useState('all')
  const [expanded, setExpanded] = useState({})
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedDone, setSeedDone] = useState(false)
  const [editQ, setEditQ] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [newSkill, setNewSkill] = useState({ year_level:9, strand:'', topic:'', skill_name:'', vc_code:'', prerequisites:'' })
  const [toast, setToast] = useState('')

  useEffect(() => { loadAll() }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function loadAll() {
    setLoading(true)
    const [{ data: sk }, { data: qs }] = await Promise.all([
      supabase.from('skills').select('*').order('year_level,strand,topic,skill_name'),
      supabase.from('questions').select('*').order('tier,id')
    ])
    setSkills(sk || [])
    setQuestions(qs || [])
    setSeedDone((sk || []).length > 0)
    setLoading(false)
  }

  async function handleSeed() {
    setSeeding(true)
    try {
      const result = await seedAll()
      showToast(`✓ Seeded ${result.skillCount} skills, ${result.qCount} questions`)
      setSeedDone(true)
      loadAll()
    } catch (e) {
      showToast('Seed error: ' + e.message)
    }
    setSeeding(false)
  }

  // Filters
  const years = [...new Set(skills.map(s => s.year_level))].sort((a,b) => a-b)
  const strands = [...new Set(skills.filter(s => filterYr === 'all' || s.year_level == filterYr).map(s => s.strand))].sort()
  const topics = [...new Set(skills.filter(s => (filterYr === 'all' || s.year_level == filterYr) && (filterStrand === 'all' || s.strand === filterStrand)).map(s => s.topic))].sort()

  const filteredSkills = skills.filter(s =>
    (filterYr === 'all' || s.year_level == filterYr) &&
    (filterStrand === 'all' || s.strand === filterStrand) &&
    (filterTopic === 'all' || s.topic === filterTopic)
  )
  const totalQs = questions.length

  function getQs(skillId) { return questions.filter(q => q.skill_id === skillId) }

  function openEdit(q) {
    setEditQ(q)
    setEditData({ tier: q.tier, question_type: q.question_type, question_text: q.question_text, answer_text: q.answer_text, vc_code: q.vc_code || '' })
  }

  async function saveEdit() {
    const { error } = await supabase.from('questions').update(editData).eq('id', editQ.id)
    if (!error) { showToast('✓ Updated'); setEditQ(null); loadAll() }
  }

  async function deleteQ(id) {
    if (!confirm('Delete this question?')) return
    await supabase.from('questions').delete().eq('id', id)
    showToast('Deleted'); loadAll()
  }

  async function addSkill() {
    const { error } = await supabase.from('skills').insert({
      ...newSkill,
      prerequisites: newSkill.prerequisites.split(',').map(s => s.trim()).filter(Boolean),
      is_shared: true, created_by: user.id
    })
    if (!error) { showToast('✓ Skill added'); setShowAddSkill(false); loadAll() }
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="page-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 6 }}>
        <div>
          <div className="page-title">Question Bank</div>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            Victorian Curriculum Yr 5–12 · <span style={{ color: 'var(--acc)' }}>{filteredSkills.length} skills · {totalQs} total questions</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!seedDone && (
            <button className="btn btn-primary" onClick={handleSeed} disabled={seeding}>
              {seeding ? '⏳ Seeding...' : '🌱 Seed Question Bank'}
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={() => {
            const headers = ['Year','Strand','Topic','Skill','VC Code','Tier','Type','Question','Answer']
            const rows = []
            skills.forEach(sk => {
              getQs(sk.id).forEach(q => rows.push([sk.year_level,sk.strand,sk.topic,sk.skill_name,sk.vc_code||'',q.tier,q.question_type||'std',q.question_text,q.answer_text]))
            })
            downloadCSV(`question-bank-${new Date().toISOString().split('T')[0]}.csv`, rows, headers)
          }}>📥 Export to CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddSkill(true)}>+ Add Skill</button>
        </div>
      </div>

      {!seedDone && (
        <div style={{ padding: '12px 16px', background: 'rgba(240,228,74,.06)', border: '1px solid rgba(240,228,74,.3)', borderRadius: 'var(--rs)', fontSize: 13, color: 'var(--acc)', marginBottom: 18 }}>
          ⚠ No questions in database yet. Click <strong>Seed Question Bank</strong> to load all curriculum questions. This only needs to be done once.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', ...years].map(y => (
            <button key={y} onClick={() => { setFilterYr(String(y)); setFilterStrand('all'); setFilterTopic('all') }}
              style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, cursor: 'pointer', border: '1px solid', transition: 'all .15s',
                borderColor: filterYr === String(y) ? 'var(--acc)' : 'var(--b2)',
                background: filterYr === String(y) ? 'rgba(240,228,74,.1)' : 'var(--s1)',
                color: filterYr === String(y) ? 'var(--acc)' : 'var(--tm)' }}>
              {y === 'all' ? 'All years' : `Yr ${y}`}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', ...strands].map(s => {
            const stCls = s === 'all' ? '' : 'st-' + s.toLowerCase().split(' ')[0]
            return (
              <button key={s} onClick={() => { setFilterStrand(s); setFilterTopic('all') }}
                style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, cursor: 'pointer', border: '1px solid', transition: 'all .15s',
                  borderColor: filterStrand === s ? 'var(--blu)' : 'var(--b2)',
                  background: filterStrand === s ? 'rgba(74,200,240,.08)' : 'var(--s1)',
                  color: filterStrand === s ? 'var(--blu)' : 'var(--tm)' }}>
                {s === 'all' ? 'All strands' : s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Skill groups */}
      {filteredSkills.map(skill => {
        const qs = getQs(skill.id)
        const open = expanded[skill.id]
        const strandCls = 'st-' + (skill.strand || '').toLowerCase().split(' ')[0]
        return (
          <div key={skill.id} style={{ marginBottom: 10, borderRadius: 'var(--r)', overflow: 'hidden', border: '1px solid var(--b1)' }}>
            <div onClick={() => setExpanded(e => ({ ...e, [skill.id]: !e[skill.id] }))}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'var(--s2)', cursor: 'pointer', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{skill.skill_name}</span>
                <span style={{ fontSize: 10, color: 'var(--tm)' }}>{skill.topic}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <span className="yr-tag">Yr {skill.year_level}</span>
                <span className={`strand-tag ${strandCls}`}>{skill.strand}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tm)', padding: '1px 5px', border: '1px solid var(--b1)', borderRadius: 3 }}>{skill.vc_code}</span>
                <span style={{ fontSize: 10, color: 'var(--tm)' }}>{qs.length} Qs</span>
                <span style={{ color: 'var(--tm)', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
              </div>
            </div>
            {open && (
              <div style={{ borderTop: '1px solid var(--b1)', background: 'var(--s1)' }}>
                {skill.prerequisites?.length > 0 && (
                  <div style={{ padding: '6px 14px', background: 'rgba(74,200,240,.04)', borderBottom: '1px solid var(--b1)', fontSize: 11, color: 'var(--tm)' }}>
                    <strong style={{ color: 'var(--blu)' }}>Prerequisites: </strong>
                    {skill.prerequisites.map(p => <span key={p} className="prereq-pill">{p}</span>)}
                  </div>
                )}
                {qs.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tm)', fontSize: 12 }}>No questions yet — add some below</div>
                ) : (
                  qs.map(q => (
                    <div key={q.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 14px', borderBottom: '1px solid var(--b1)', fontSize: 12 }}>
                      <span className={`badge ${TIER_CLS[q.tier]}-bg`} style={{ color: `var(--${['','grn','blu','org','red'][q.tier]})`, fontSize: 9, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap', marginTop: 1, flexShrink: 0 }}>T{q.tier}</span>
                      {q.question_type && q.question_type !== 'std' && <span className={`qtype-badge qt-${q.question_type}`} style={{ flexShrink: 0 }}>{q.question_type.toUpperCase()}</span>}
                      {q.vc_code && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tm)', padding: '1px 5px', border: '1px solid var(--b1)', borderRadius: 3, flexShrink: 0 }}>{q.vc_code}</span>}
                      <span style={{ fontFamily: 'var(--font-mono)', flex: 1, minWidth: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{q.question_text}</span>
                      <span style={{ color: 'var(--tm)', fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 80, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.answer_text}</span>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--blu)', flexShrink: 0 }} onClick={() => openEdit(q)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', flexShrink: 0 }} onClick={() => deleteQ(q.id)}>✕</button>
                    </div>
                  ))
                )}
                <div style={{ padding: '8px 14px' }}>
                  <AddQuestionRow skillId={skill.id} vcCode={skill.vc_code} onAdded={loadAll} showToast={showToast} />
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Edit modal */}
      {editQ && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditQ(null)}>
          <div className="modal">
            <h3>Edit Question</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Tier</label>
                <select className="input select" value={editData.tier} onChange={e => setEditData(d => ({ ...d, tier: parseInt(e.target.value) }))}>
                  {[1,2,3,4].map(t => <option key={t} value={t}>T{t} — {TIER_FULL[t]}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Type</label>
                <select className="input select" value={editData.question_type} onChange={e => setEditData(d => ({ ...d, question_type: e.target.value }))}>
                  {Object.entries(QTYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>VC Code</label>
                <input className="input" value={editData.vc_code} onChange={e => setEditData(d => ({ ...d, vc_code: e.target.value }))} />
              </div>
            </div>
            <div className="field"><label>Question</label><textarea className="input textarea" value={editData.question_text} onChange={e => setEditData(d => ({ ...d, question_text: e.target.value }))} /></div>
            <div className="field"><label>Answer</label><textarea className="input textarea" style={{ minHeight: 60 }} value={editData.answer_text} onChange={e => setEditData(d => ({ ...d, answer_text: e.target.value }))} /></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditQ(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add skill modal */}
      {showAddSkill && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddSkill(false)}>
          <div className="modal">
            <h3>Add New Skill</h3>
            {[
              { label: 'Year level', key: 'year_level', type: 'number', placeholder: '9' },
              { label: 'Strand', key: 'strand', placeholder: 'e.g. Algebra' },
              { label: 'Topic', key: 'topic', placeholder: 'e.g. Linear Equations' },
              { label: 'Skill name', key: 'skill_name', placeholder: 'e.g. Solving two-step equations' },
              { label: 'VC Code', key: 'vc_code', placeholder: 'e.g. VC2M9A01' },
              { label: 'Prerequisites (comma separated)', key: 'prerequisites', placeholder: 'e.g. One-step equations, Inverse operations' },
            ].map(f => (
              <div key={f.key} className="field">
                <label>{f.label}</label>
                <input className="input" type={f.type || 'text'} placeholder={f.placeholder} value={newSkill[f.key]}
                  onChange={e => setNewSkill(s => ({ ...s, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddSkill(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addSkill}>Add Skill</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function AddQuestionRow({ skillId, vcCode, onAdded, showToast }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({ tier: 2, question_type: 'std', question_text: '', answer_text: '', vc_code: vcCode || '' })
  function downloadCSV(filename, rows, headers) {
  const escape = v => { const s = String(v??'').replace(/"/g,'""'); return s.includes(',')||s.includes('\n')||s.includes('"') ? `"${s}"` : s }
  const csv = [headers,...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv],{type:'text/csv'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click()
  URL.revokeObjectURL(url)
}

const QTYPE_LABELS = { std:'Standard', mc:'Multiple Choice', tf:'True/False', fill:'Fill in Blank', worded:'Word Problem', error:'Error Analysis', show:'Show Working' }

  async function save() {
    if (!data.question_text || !data.answer_text) return
    const { error } = await supabase.from('questions').insert({ ...data, skill_id: skillId, is_shared: true, created_by: user.id })
    if (!error) { showToast('✓ Question added'); setData(d => ({ ...d, question_text: '', answer_text: '' })); setOpen(false); onAdded() }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ fontSize: 11, color: 'var(--tm)', background: 'transparent', border: '1px dashed var(--b2)', borderRadius: 'var(--rs)', padding: '5px 12px', cursor: 'pointer', width: '100%', transition: 'all .15s' }}>
      + Add question
    </button>
  )

  return (
    <div style={{ background: 'var(--s2)', borderRadius: 'var(--rs)', border: '1px solid var(--b2)', padding: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Tier</label>
          <select className="input select" value={data.tier} onChange={e => setData(d => ({ ...d, tier: parseInt(e.target.value) }))}>
            {[1,2,3,4].map(t => <option key={t} value={t}>T{t}</option>)}
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Type</label>
          <select className="input select" value={data.question_type} onChange={e => setData(d => ({ ...d, question_type: e.target.value }))}>
            {Object.entries(QTYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>VC Code</label>
          <input className="input" value={data.vc_code} onChange={e => setData(d => ({ ...d, vc_code: e.target.value }))} />
        </div>
      </div>
      <div className="field" style={{ marginBottom: 8 }}>
        <label>Question</label>
        <textarea className="input textarea" style={{ minHeight: 60 }} value={data.question_text} onChange={e => setData(d => ({ ...d, question_text: e.target.value }))} />
      </div>
      <div className="field" style={{ marginBottom: 8 }}>
        <label>Answer</label>
        <textarea className="input textarea" style={{ minHeight: 40 }} value={data.answer_text} onChange={e => setData(d => ({ ...d, answer_text: e.target.value }))} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={!data.question_text || !data.answer_text}>Add</button>
      </div>
    </div>
  )
}
