import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { useSettings } from '../lib/settings.jsx'
import { supabase } from '../lib/supabase.js'
import { getDueConcepts, getUpcomingSkills, getRetrievalGaps } from '../lib/spacedRep.js'
import { FOUNDATIONAL } from '../lib/curriculum.js'
import { useNavigate } from 'react-router-dom'

// Store generated slides globally so Present page can access them
export let CURRENT_SLIDES = []
export function setCurrentSlides(s) { CURRENT_SLIDES = s }
const channel = new BroadcastChannel('dmr_student_view')

const TIER_LABELS = ['', 'T1 · Foundation', 'T2 · Core', 'T3 · Extension', 'T4 · Challenge']
const TIER_FULL  = ['', 'Foundation', 'Core', 'Extension', 'Challenge']
const QTYPE_LABELS = { std: 'Std', mc: 'MC', tf: 'T/F', fill: 'Fill', worded: 'Word', error: 'Error', show: 'Show' }
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000)

export default function Generate() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [activeClass, setActiveClass] = useState('')
  const [classSkills, setClassSkills] = useState([])
  const [skills, setSkills] = useState([]) // full skill objects
  const [questions, setQuestions] = useState([]) // all questions keyed by skill_id
  const [slides, setSlides] = useState([])
  const [maxTopics, setMaxTopics] = useState(15)
  const [timerSecs, setTimerSecs] = useState(settings.defaultTimer || 15)
  const [btbSecs, setBtbSecs] = useState(settings.btbTimer || 90)
  const [loading, setLoading] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null) // {slideIdx, qIdx} or null
  const [editQ, setEditQ] = useState({ tier: 1, type: 'std', q: '', a: '', vc: '' })
  const [summary, setSummary] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (activeClass) loadClassData(activeClass) }, [activeClass])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data && data.length > 0) setActiveClass(data[0].id)
  }

  async function loadClassData(classId) {
    const [csRes, skillsRes, qRes] = await Promise.all([
      supabase.from('class_skills').select(`*, skill:skills(*)`).eq('class_id', classId),
      supabase.from('skills').select('*'),
      supabase.from('questions').select('*')
    ])
    setClassSkills(csRes.data || [])
    setSkills(skillsRes.data || [])
    setQuestions(qRes.data || [])
  }

  function getQuestionsForSkill(skillId) {
    return questions.filter(q => q.skill_id === skillId).sort((a, b) => a.tier - b.tier)
  }

  function buildSlide(cs, tag = '', isWC = false) {
    const sk = cs.skill || {}
    const qs = getQuestionsForSkill(sk.id || cs.skill_id)
    return {
      id: cs.id,
      skill: sk,
      classSkill: cs,
      tag,
      isWC,
      questions: [...qs],
      btbEasy: sk.btb_easy || '',
      btbHard: sk.btb_hard || '',
    }
  }

  function buildFoundational(idx) {
    const f = FOUNDATIONAL[idx % FOUNDATIONAL.length]
    return {
      id: 'fndl-' + idx,
      skill: { skill_name: f.label, strand: f.strand, year_level: 'F', topic: 'Foundational', btb_easy: f.btbEasy, btb_hard: f.btbHard },
      classSkill: null,
      tag: '⚡ Warm-up',
      isFoundational: true,
      questions: f.questions,
      btbEasy: f.btbEasy,
      btbHard: f.btbHard,
    }
  }

  async function doGenerate() {
    if (!activeClass) return
    setLoading(true)
    await loadClassData(activeClass)

    // Reload fresh
    const { data: cs } = await supabase.from('class_skills').select(`*, skill:skills(*)`).eq('class_id', activeClass)
    const { data: qs } = await supabase.from('questions').select('*')
    const allClassSkills = cs || []
    const allQuestions = qs || []

    const qMap = {}
    allQuestions.forEach(q => { if (!qMap[q.skill_id]) qMap[q.skill_id] = []; qMap[q.skill_id].push(q) })

    const due = getDueConcepts(allClassSkills, maxTopics)
    const upcoming = getUpcomingSkills(allClassSkills, 7)
    const retrieval = getRetrievalGaps(allClassSkills)

    // Upcoming prereqs
    const upcomingPrereqs = []
    const added = new Set(due.map(d => d.skill?.skill_name))
    upcoming.forEach(u => {
      const prereqs = u.skill?.prerequisites || []
      prereqs.forEach(p => {
        if (added.has(p)) return
        const match = allClassSkills.find(c => c.skill?.skill_name === p)
        if (match) { added.add(p); upcomingPrereqs.push({ ...match, _tag: `🔜 Prereq for ${u.skill?.skill_name}` }) }
      })
    })

    const totalScheduled = due.length + upcomingPrereqs.length + retrieval.length
    const fndlCount = Math.max(2, Math.min(5, maxTopics - totalScheduled))

    const built = []

    // 1. Foundational warm-ups
    for (let i = 0; i < fndlCount; i++) {
      const f = FOUNDATIONAL[(dayOfYear + i) % FOUNDATIONAL.length]
      built.push({
        id: `fndl-${i}`,
        skill: { skill_name: f.label, strand: f.strand, year_level: 'F', topic: 'Foundational', btb_easy: f.btbEasy, btb_hard: f.btbHard },
        classSkill: null, tag: '⚡ Warm-up', isFoundational: true,
        questions: [...f.questions], btbEasy: f.btbEasy, btbHard: f.btbHard,
      })
    }

    // 2. Upcoming prereqs
    upcomingPrereqs.forEach(c => {
      const sk = c.skill || {}
      built.push({ id: c.id, skill: sk, classSkill: c, tag: c._tag,
        questions: (qMap[sk.id] || []).sort((a,b) => a.tier-b.tier),
        btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || '' })
    })

    // 3. Long-term retrieval
    retrieval.forEach(c => {
      const sk = c.skill || {}
      built.push({ id: c.id + '-ret', skill: sk, classSkill: c, tag: '🧠 Retrieval',
        questions: (qMap[sk.id] || []).sort((a,b) => a.tier-b.tier),
        btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || '' })
    })

    // 4. Due topics (low mastery → whole-class)
    due.forEach(c => {
      const sk = c.skill || {}
      const mastery = c.mastery || 1
      const slideQs = (qMap[sk.id] || []).sort((a,b) => a.tier-b.tier)
      const isWC = mastery <= 2
      built.push({ id: c.id, skill: sk, classSkill: c,
        tag: isWC ? '🎯 Whole class' : '',
        isWC,
        questions: slideQs,
        btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || ''
      })
    })

    setSlides(built)
    setCurrentSlides(built)
    setSummary({ fndl: fndlCount, prereqs: upcomingPrereqs.length, retrieval: retrieval.length, due: due.length, total: built.length })
    setLoading(false)
    showToast(`Generated ${built.length} slides`)
  }

  function removeSlide(idx) {
    setSlides(s => { const n = [...s]; n.splice(idx, 1); setCurrentSlides(n); return n })
  }

  function removeQuestion(slideIdx, qIdx) {
    setSlides(s => {
      const n = s.map((sl, i) => i !== slideIdx ? sl : { ...sl, questions: sl.questions.filter((_, qi) => qi !== qIdx) })
      setCurrentSlides(n); return n
    })
  }

  function openEditQ(slideIdx, qIdx) {
    const q = slides[slideIdx].questions[qIdx] || { tier: 1, type: 'std', question_text: '', answer_text: '', vc_code: '' }
    setEditQ({ tier: q.tier || 1, type: q.question_type || q.type || 'std', q: q.question_text || q.q || '', a: q.answer_text || q.a || '', vc: q.vc_code || q.vc || '' })
    setEditingSlide({ slideIdx, qIdx })
  }

  function openAddQ(slideIdx) {
    setEditQ({ tier: 2, type: 'std', q: '', a: '', vc: '' })
    setEditingSlide({ slideIdx, qIdx: -1 })
  }

  function saveEditQ() {
    const { slideIdx, qIdx } = editingSlide
    const newQ = { tier: editQ.tier, question_type: editQ.type, question_text: editQ.q, answer_text: editQ.a, vc_code: editQ.vc }
    setSlides(s => {
      const n = s.map((sl, i) => {
        if (i !== slideIdx) return sl
        const qs = [...sl.questions]
        if (qIdx === -1) qs.push(newQ)
        else qs[qIdx] = newQ
        return { ...sl, questions: qs }
      })
      setCurrentSlides(n); return n
    })
    setEditingSlide(null)
    showToast('✓ Saved')
  }

  const tierCls = ['', 't1', 't2', 't3', 't4']
  const tierBg  = ['', 'rgba(74,240,160,.08)', 'rgba(74,200,240,.08)', 'rgba(240,148,74,.08)', 'rgba(240,74,107,.08)']

  return (
    <div className="page-wrap">
      <div className="page-title">Generate Review Session</div>

      {/* Controls */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field" style={{ margin: 0, flex: 1, minWidth: 160 }}>
            <label>Class</label>
            <select className="input select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Max topics</label>
            <select className="input select" value={maxTopics} onChange={e => setMaxTopics(parseInt(e.target.value))}>
              {[10,12,15,18,20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Slide timer</label>
            <select className="input select" value={timerSecs} onChange={e => setTimerSecs(parseInt(e.target.value))}>
              {[10,15,20,30,45,60].map(t => <option key={t} value={t}>{t}s</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Bomb timer</label>
            <select className="input select" value={btbSecs} onChange={e => setBtbSecs(parseInt(e.target.value))}>
              {[60,90,120,180].map(t => <option key={t} value={t}>{t}s</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={doGenerate} disabled={loading} style={{ padding: '10px 24px' }}>
            {loading ? 'Building...' : 'Generate Slides'}
          </button>
          {slides.length > 0 && (
            <button className="btn" onClick={() => navigate('/present', { state: { slides, timerSecs, btbSecs } })}
              style={{ background: 'rgba(74,200,240,.14)', borderColor: 'var(--blu)', color: 'var(--blu)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              ▶ Present ({slides.length + 1} slides)
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ padding: '10px 16px', background: 'rgba(74,200,240,.06)', border: '1px solid rgba(74,200,240,.2)', borderRadius: 'var(--rs)', fontSize: 12, color: 'var(--td)', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ color: 'var(--blu)' }}>Session:</strong>
          <span>{summary.fndl} warm-up</span> ·
          <span>{summary.prereqs} prereqs</span> ·
          <span>{summary.retrieval} retrieval</span> ·
          <span>{summary.due} scheduled</span> ·
          <span>1 Beat the Bomb</span> =
          <strong style={{ color: 'var(--tx)' }}>{summary.total + 1} slides (~{Math.round((summary.total + 1) * timerSecs / 60)} min)</strong>
        </div>
      )}

      {/* Slide cards */}
      {slides.map((slide, si) => {
        const sk = slide.skill || {}
        const strandCls = 'st-' + (sk.strand || '').toLowerCase().split(' ')[0]
        const isWC = slide.isWC
        return (
          <div key={slide.id} className="card" style={{ marginBottom: 14, border: isWC ? '1px solid rgba(160,74,240,.3)' : '1px solid var(--b1)', background: isWC ? 'rgba(160,74,240,.04)' : 'var(--s1)' }}>
            {/* Slide header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, padding: '13px 16px', borderBottom: '1px solid var(--b1)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                  Slide {si + 1}: {sk.skill_name}
                  {slide.tag && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--blu)', marginLeft: 8 }}>{slide.tag}</span>}
                  {isWC && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(160,74,240,.15)', color: 'var(--pur)', marginLeft: 8 }}>Whole Class</span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tm)', marginTop: 2 }}>{sk.topic} · {sk.strand} · {sk.year_level === 'F' ? 'Foundational' : `Year ${sk.year_level}`}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {sk.year_level !== 'F' && <span className="yr-tag">Yr {sk.year_level}</span>}
                <span className={`strand-tag ${strandCls}`}>{sk.strand}</span>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: 16 }} onClick={() => removeSlide(si)}>✕</button>
              </div>
            </div>

            {/* Questions */}
            <div style={{ padding: '12px 16px' }}>
              {slide.questions.map((q, qi) => {
                const qt = q.question_type || q.type || 'std'
                const qtext = q.question_text || q.q || ''
                const atext = q.answer_text || q.a || ''
                const vccode = q.vc_code || q.vc || ''
                return (
                  <div key={qi} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 8, alignItems: 'start', padding: '8px 10px', background: 'var(--s2)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)', marginBottom: 6 }}>
                    <span className={`badge ${tierCls[q.tier]}-bg`} style={{ color: `var(--${['','grn','blu','org','red'][q.tier]})`, fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4, whiteSpace: 'nowrap', marginTop: 2 }}>
                      T{q.tier}
                    </span>
                    <div>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 3, flexWrap: 'wrap' }}>
                        {qt !== 'std' && <span className={`qtype-badge qt-${qt}`}>{QTYPE_LABELS[qt] || qt}</span>}
                        {vccode && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tm)', padding: '1px 5px', border: '1px solid var(--b1)', borderRadius: 3 }}>{vccode}</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{qtext}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tm)', marginTop: 3 }}>→ {atext}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--blu)' }} onClick={() => openEditQ(si, qi)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => removeQuestion(si, qi)}>✕</button>
                  </div>
                )
              })}
              <button onClick={() => openAddQ(si)} style={{ width: '100%', padding: '8px', border: '1px dashed var(--b2)', borderRadius: 'var(--rs)', background: 'transparent', color: 'var(--tm)', fontSize: 11, cursor: 'pointer', marginTop: 4, transition: 'all .15s' }}>
                + Add question to this slide
              </button>
            </div>
          </div>
        )
      })}

      {slides.length > 0 && (
        <div className="card card-pad" style={{ background: 'linear-gradient(135deg,rgba(240,74,107,.06),rgba(160,74,240,.06))', border: '1px solid rgba(240,74,107,.25)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 10 }}>
            💣 Beat the Bomb — {btbSecs}s
          </div>
          {slides[slides.length - 1] && (
            <div className="grid-2">
              <div style={{ background: 'rgba(74,240,160,.05)', border: '1px solid rgba(74,240,160,.3)', borderRadius: 'var(--rs)', padding: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--grn)', marginBottom: 8 }}>⚡ Standard</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{slides[slides.length - 1].btbEasy}</div>
              </div>
              <div style={{ background: 'rgba(240,74,107,.05)', border: '1px solid rgba(240,74,107,.3)', borderRadius: 'var(--rs)', padding: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>💀 Elite</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{slides[slides.length - 1].btbHard}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {slides.length === 0 && !loading && (
        <div className="empty-state">
          <div className="icon">⚡</div>
          <p>Click Generate Slides to build today's review session. The system will automatically include foundational warm-ups, prerequisite checks and spaced repetition topics.</p>
        </div>
      )}

      {/* Edit modal */}
      {editingSlide && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditingSlide(null)}>
          <div className="modal">
            <h3>{editingSlide.qIdx === -1 ? 'Add Question' : 'Edit Question'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Tier</label>
                <select className="input select" value={editQ.tier} onChange={e => setEditQ(q => ({ ...q, tier: parseInt(e.target.value) }))}>
                  {[1,2,3,4].map(t => <option key={t} value={t}>T{t} — {TIER_FULL[t]}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Type</label>
                <select className="input select" value={editQ.type} onChange={e => setEditQ(q => ({ ...q, type: e.target.value }))}>
                  {Object.entries(QTYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>VC Code</label>
                <input className="input" value={editQ.vc} onChange={e => setEditQ(q => ({ ...q, vc: e.target.value }))} placeholder="e.g. VC2M9A01" />
              </div>
            </div>
            <div className="field">
              <label>Question</label>
              <textarea className="input textarea" value={editQ.q} onChange={e => setEditQ(q => ({ ...q, q: e.target.value }))} />
            </div>
            <div className="field">
              <label>Answer</label>
              <textarea className="input textarea" style={{ minHeight: 60 }} value={editQ.a} onChange={e => setEditQ(q => ({ ...q, a: e.target.value }))} />
            </div>
            <div className="modal-footer">
              {editingSlide.qIdx !== -1 && <button className="btn btn-danger" onClick={() => { removeQuestion(editingSlide.slideIdx, editingSlide.qIdx); setEditingSlide(null) }}>Remove</button>}
              <button className="btn btn-secondary" onClick={() => setEditingSlide(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEditQ} disabled={!editQ.q || !editQ.a}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
