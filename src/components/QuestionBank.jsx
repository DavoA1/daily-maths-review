import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'
import { seedAll } from '../lib/seed.js'
import { seedYear8 } from '../lib/seed_yr8.js'
import { seedYear7 } from '../lib/seed_yr7.js'
import { seedYear10 } from '../lib/seed_yr10.js'
import { VC2_CURRICULUM } from '../lib/vc2curriculum.js'

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


// ── IMAGE FIELD COMPONENT ──
// Supports: URL paste, file upload (to Supabase Storage or as base64 fallback)
function ImageField({ value, onChange, compact = false }) {
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState('url') // 'url' | 'file'
  const fileRef = useState(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      // Try Supabase Storage first
      const filename = `q_${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi,'_')}`
      const { data, error } = await supabase.storage
        .from('question-images')
        .upload(filename, file, { upsert: true })
      if (!error) {
        const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(filename)
        onChange(urlData.publicUrl)
      } else {
        // Fallback: base64
        const reader = new FileReader()
        reader.onload = (ev) => onChange(ev.target.result)
        reader.readAsDataURL(file)
      }
    } catch {
      // Fallback: base64
      const reader = new FileReader()
      reader.onload = (ev) => onChange(ev.target.result)
      reader.readAsDataURL(file)
    }
    setUploading(false)
  }

  if (compact) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 11, color: 'var(--tm)', flexShrink: 0 }}>🖼 Image:</label>
      <input className="input" style={{ flex: 1, minWidth: 120, fontSize: 11 }}
        placeholder="Paste image URL..." value={value}
        onChange={e => onChange(e.target.value)} />
      <label style={{ padding: '4px 10px', background: 'var(--blu)', color: 'white', borderRadius: 'var(--rs)', fontSize: 11, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
        {uploading ? '⏳' : '📁 Upload'}
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </label>
      {value && (
        <>
          <img src={value} alt="" style={{ height: 32, width: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--b1)' }} />
          <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, padding: 2 }}>✕</button>
        </>
      )}
    </div>
  )

  return (
    <div className="field">
      <label>Question Image (optional)</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button className={`btn btn-sm ${mode==='url'?'btn-primary':'btn-secondary'}`} onClick={() => setMode('url')}>🔗 URL</button>
        <button className={`btn btn-sm ${mode==='file'?'btn-primary':'btn-secondary'}`} onClick={() => setMode('file')}>📁 Upload File</button>
      </div>
      {mode === 'url' ? (
        <input className="input" placeholder="https://..." value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, border: '2px dashed var(--b2)', borderRadius: 'var(--rs)', cursor: 'pointer', color: 'var(--tm)', fontSize: 13, background: 'var(--bg)' }}>
          {uploading ? '⏳ Uploading...' : '📁 Click to choose image file'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </label>
      )}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '8px 10px', background: 'var(--bg)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)' }}>
          <img src={value} alt="" style={{ height: 60, maxWidth: 100, objectFit: 'contain', borderRadius: 4 }} />
          <div style={{ flex: 1, fontSize: 11, color: 'var(--tm)', wordBreak: 'break-all' }}>{value.startsWith('data:') ? '📎 Embedded image' : value.slice(0,60)+'...'}</div>
          <button onClick={() => onChange('')} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 11 }}>Remove</button>
        </div>
      )}
    </div>
  )
}

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
  const [seedYr8Done, setSeedYr8Done] = useState(false)
  const [seedingYr8, setSeedingYr8] = useState(false)
  const [seedYr7Done, setSeedYr7Done] = useState(false)
  const [seedingYr7, setSeedingYr7] = useState(false)
  const [seedYr10Done, setSeedYr10Done] = useState(false)
  const [seedingYr10, setSeedingYr10] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editQ, setEditQ] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [newSkill, setNewSkill] = useState({ year_level:9, strand:'', topic:'', skill_name:'', vc_code:'', prerequisites:'', btb_easy:'', btb_hard:'', btb_chain:'' })
  const [toast, setToast] = useState('')

  useEffect(() => { loadAll() }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function loadAll() {
    setLoading(true)
    const [{ data: sk }, { data: qs }] = await Promise.all([
      supabase.from('skills').select('*').order('year_level,strand,topic,skill_name').range(0, 9999),
      supabase.from('questions').select('*').order('tier,id').range(0, 9999)
    ])
    setSkills(sk || [])
    setQuestions(qs || [])
    setSeedDone((sk || []).length > 0)
    setLoading(false)
  }

  async function handleSeedYr8() {
    setSeedingYr8(true)
    try {
      const result = await seedYear8(user)
      setSeedYr8Done(true)
      showToast(`Year 8: ${result.skillCount} skills, ${result.questionCount} questions seeded`)
    } catch(e) {
      showToast(`Error: ${e.message}`)
    }
    setSeedingYr8(false)
    loadAll()
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
    setEditData({ tier: q.tier, question_type: q.question_type, question_text: q.question_text, answer_text: q.answer_text, vc_code: q.vc_code || '', image_url: q.image_url || '' })
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
              {seeding ? '⏳ Seeding...' : '🌱 Seed Year 9 Questions'}
            </button>
          )}
          {!seedYr8Done && (
            <button className="btn btn-primary" onClick={async () => {
              setSeedingYr8(true)
              const result = await seedYear8(user)
              setSeedingYr8(false)
              if (!result.error) { setSeedYr8Done(true); loadAll(); showToast(`✓ Year 8: ${result.questionCount} questions seeded`) }
              else showToast('Error seeding Year 8')
            }} disabled={seedingYr8} style={{ background:'rgba(74,200,240,.14)', borderColor:'var(--blu)', color:'var(--blu)' }}>
              {seedingYr8 ? '⏳ Seeding Year 8...' : '🌱 Seed Year 8 Questions'}
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={() => setBulkOpen(true)}
            style={{ background:'rgba(74,200,240,.08)', borderColor:'var(--blu)', color:'var(--blu)' }}>
            📥 Bulk Upload Questions
          </button>
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
                      {q.image_url && <img src={q.image_url} alt="" style={{ height: 28, width: 28, objectFit: 'cover', borderRadius: 4, flexShrink: 0, border: '1px solid var(--b1)' }} />}
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
                {editData.vc_code && VC2_CURRICULUM[editData.vc_code] && (
                  <div style={{ fontSize: 10, color: 'var(--tm)', marginTop: 3, lineHeight: 1.4 }}>
                    {VC2_CURRICULUM[editData.vc_code].description.slice(0, 100)}...
                  </div>
                )}
              </div>
            </div>
            <div className="field"><label>Question</label><textarea className="input textarea" value={editData.question_text} onChange={e => setEditData(d => ({ ...d, question_text: e.target.value }))} /></div>
            <div className="field"><label>Answer</label><textarea className="input textarea" style={{ minHeight: 60 }} value={editData.answer_text} onChange={e => setEditData(d => ({ ...d, answer_text: e.target.value }))} /></div>
            <ImageField value={editData.image_url || ''} onChange={url => setEditData(d => ({ ...d, image_url: url }))} />
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
              { label: 'VC Code (e.g. VC2M9A01)', key: 'vc_code', placeholder: 'e.g. VC2M9A01' },
              { label: 'Prerequisites (comma separated)', key: 'prerequisites', placeholder: 'e.g. One-step equations, Inverse operations' },
              { label: '⚡ Beat the Bomb — Standard', key: 'btb_easy', placeholder: 'e.g. Evaluate: 3x - 1 when x = 4' },
              { label: '💀 Beat the Bomb — Elite', key: 'btb_hard', placeholder: 'e.g. Make x the subject of 2(x+a) = b' },
              { label: '⛓ Beat the Bomb — Chain (start → ops → target)', key: 'btb_chain', placeholder: 'e.g. Start: 48 → ÷6 → ×3 → −5 → +8 = ?' },
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

      {bulkOpen && <BulkUploadModal
        skills={skills}
        user={user}
        onClose={() => setBulkOpen(false)}
        onDone={() => { setBulkOpen(false); loadAll() }}
      />}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

// ── BULK UPLOAD MODAL ─────────────────────────────────────────
function BulkUploadModal({ skills, user, onClose, onDone }) {
  const [csvText, setCsvText] = useState('')
  const [parsed, setParsed] = useState([])
  const [errors, setErrors] = useState([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const TEMPLATE = `skill_name,tier,type,question,answer
Expanding algebraic expressions,1,std,"Expand: 2(x + 3)","2x + 6"
Expanding algebraic expressions,2,std,"Expand: -3(x + 4)","-3x - 12"
Pythagoras theorem,1,std,"Find c: a=3, b=4","c = 5"`

  function parseCsv(text) {
    const rows = [], errs = []
    const lines = text.trim().split('\n')
    const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g,''))
    const col = (n) => header.findIndex(h => h.includes(n))
    const ci = { skill: col('skill'), tier: col('tier'), type: col('type'), q: col('question'), a: col('answer'), vc: col('vc'), img: col('image') }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const cols = []; let inQ = false, cur = ''
      for (const ch of line + ',') {
        if (ch === '"') inQ = !inQ
        else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = '' }
        else cur += ch
      }
      const skillName = ci.skill >= 0 ? cols[ci.skill]||'' : ''
      const tier = parseInt(ci.tier >= 0 ? cols[ci.tier] : '1') || 1
      const question = ci.q >= 0 ? cols[ci.q]||'' : ''
      const answer = ci.a >= 0 ? cols[ci.a]||'' : ''
      if (!skillName || !question) { errs.push(`Row ${i+1}: missing skill_name or question`); continue }
      if (tier < 1 || tier > 4) { errs.push(`Row ${i+1}: tier must be 1-4`); continue }
      const match = skills.find(s => s.skill_name.toLowerCase() === skillName.toLowerCase())
      rows.push({ skill_name: skillName, skill_id: match?.id||null, matched: !!match,
        tier, question_type: ci.type>=0?cols[ci.type]||'std':'std',
        question_text: question, answer_text: answer,
        vc_code: ci.vc>=0?cols[ci.vc]||'':'', image_url: ci.img>=0?cols[ci.img]||'':'' })
    }
    setParsed(rows); setErrors(errs)
  }

  async function upload() {
    const rows = parsed.filter(r => r.matched)
    setUploading(true)
    let ok = 0, fail = 0
    for (const r of rows) {
      const { error } = await supabase.from('questions').insert({
        skill_id: r.skill_id, tier: r.tier, question_type: r.question_type||'std',
        question_text: r.question_text, answer_text: r.answer_text,
        vc_code: r.vc_code||'', image_url: r.image_url||null,
        is_shared: true, created_by: user.id,
      })
      if (error) fail++; else ok++
    }
    setResult({ ok, fail, skipped: parsed.length - rows.length })
    setUploading(false)
  }

  const matched = parsed.filter(r=>r.matched).length
  const unmatched = parsed.filter(r=>!r.matched).length

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.65)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div style={{ background:'var(--s1)',border:'1px solid var(--blu)',borderRadius:14,width:'100%',maxWidth:700,maxHeight:'90vh',overflow:'auto' }}>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid var(--b2)',display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ fontSize:16 }}>📥</span>
          <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,flex:1 }}>Bulk Upload Questions</div>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--tm)',cursor:'pointer',fontSize:18 }}>✕</button>
        </div>
        <div style={{ padding:20 }}>
          {result ? (
            <div style={{ textAlign:'center',padding:'20px 0' }}>
              <div style={{ fontSize:40,marginBottom:12 }}>✅</div>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,marginBottom:8 }}>Upload Complete</div>
              <div style={{ color:'var(--grn)',fontSize:14,marginBottom:4 }}>✓ {result.ok} questions uploaded</div>
              {result.fail>0&&<div style={{ color:'var(--red)',fontSize:14,marginBottom:4 }}>✗ {result.fail} failed</div>}
              {result.skipped>0&&<div style={{ color:'var(--tm)',fontSize:12,marginBottom:12 }}>⚠ {result.skipped} skipped (skill not found)</div>}
              <button className="btn btn-primary" onClick={onDone}>Done</button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:12,fontSize:12,color:'var(--td)',lineHeight:1.6,background:'var(--s2)',padding:'10px 14px',borderRadius:'var(--rs)',border:'1px solid var(--b1)' }}>
                <strong>CSV Format:</strong> Required columns: <code>skill_name, tier (1-4), question, answer</code><br/>
                Optional: <code>type, vc_code, image_url</code> · skill_name must exactly match a skill in the bank.
              </div>
              <div style={{ display:'flex',gap:8,marginBottom:10 }}>
                <button className="btn btn-sm btn-secondary" onClick={() => {
                  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(TEMPLATE); a.download='questions_template.csv'; a.click()
                }}>⬇ Download Template</button>
              </div>
              <textarea className="input textarea" rows={8} placeholder={TEMPLATE} value={csvText}
                onChange={e=>setCsvText(e.target.value)}
                style={{ fontFamily:'var(--font-mono)',fontSize:11,resize:'vertical',marginBottom:8,width:'100%' }} />
              <button className="btn btn-primary" onClick={()=>parseCsv(csvText)} disabled={!csvText.trim()} style={{ marginBottom:12 }}>🔍 Preview</button>
              {errors.length>0&&<div style={{ background:'rgba(240,74,107,.1)',border:'1px solid var(--red)',borderRadius:'var(--rs)',padding:'8px 12px',marginBottom:10 }}>
                {errors.map((e,i)=><div key={i} style={{ fontSize:11,color:'var(--red)' }}>• {e}</div>)}
              </div>}
              {parsed.length>0&&<>
                <div style={{ display:'flex',gap:12,marginBottom:8,fontSize:12 }}>
                  <span style={{ color:'var(--grn)' }}>✓ {matched} matched</span>
                  {unmatched>0&&<span style={{ color:'var(--org)' }}>⚠ {unmatched} skill not found</span>}
                </div>
                <div style={{ maxHeight:180,overflow:'auto',marginBottom:12,border:'1px solid var(--b2)',borderRadius:'var(--rs)' }}>
                  <table style={{ width:'100%',fontSize:11,borderCollapse:'collapse' }}>
                    <thead><tr style={{ background:'var(--s2)' }}>
                      {['Skill','T','Question preview','Answer preview','✓'].map(h=>(
                        <th key={h} style={{ padding:'5px 8px',textAlign:'left',color:'var(--tm)',borderBottom:'1px solid var(--b2)' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{parsed.map((r,i)=>(
                      <tr key={i} style={{ background:i%2?'var(--s1)':'transparent',opacity:r.matched?1:.5 }}>
                        <td style={{ padding:'4px 8px',color:'var(--td)',maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{r.skill_name}</td>
                        <td style={{ padding:'4px 8px',color:'var(--td)' }}>T{r.tier}</td>
                        <td style={{ padding:'4px 8px',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{r.question_text}</td>
                        <td style={{ padding:'4px 8px',color:'var(--grn)',maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{r.answer_text}</td>
                        <td style={{ padding:'4px 8px' }}>{r.matched?<span style={{ color:'var(--grn)' }}>✓</span>:<span style={{ color:'var(--org)' }}>⚠</span>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div style={{ display:'flex',gap:8 }}>
                  <button className="btn btn-primary" onClick={upload} disabled={uploading||!matched}>
                    {uploading?'⏳ Uploading...':`⬆ Upload ${matched} question${matched!==1?'s':''}`}
                  </button>
                  <button className="btn btn-secondary" onClick={()=>{setParsed([]);setErrors([]);setCsvText('')}}>Clear</button>
                </div>
              </>}
            </>
          )}
        </div>
      </div>
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
    const { error } = await supabase.from('questions').insert({ ...data, skill_id: skillId, is_shared: true, created_by: user.id, image_url: data.image_url || null })
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
        <div className="field" style={{ marginTop: 8 }}>
          <ImageField value={data.image_url || ''} onChange={url => setData(d => ({ ...d, image_url: url }))} compact />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={!data.question_text || !data.answer_text}>Add</button>
      </div>
    </div>
  )
}
