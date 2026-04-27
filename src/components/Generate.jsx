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

// Generate a number chain challenge (start → operations → target)
function generateChain() {
  const chains = [
    'Start: 3\n× 4 → − 7 → × 2 → + 1 = ?\n(Answer: 19)',
    'Start: 48\n÷ 6 → × 3 → − 5 → + 8 = ?\n(Answer: 27)',
    'Start: 5\n² → − 7 → × 2 → ÷ 6 = ?\n(Answer: 6)',
    'Start: 100\n÷ 4 → + 17 → × 2 → − 9 = ?\n(Answer: 57)',
    'Start: 7\n× 8 → − 16 → ÷ 4 → + 3 = ?\n(Answer: 15)',
    'Start: 36\n√  → × 7 → − 9 → ÷ 3 = ?\n(Answer: 11)',
    'Start: 2\n³ → + 17 → ÷ 5 → × 4 = ?\n(Answer: 20)',
    'Start: 15\n× 3 → − 5 → ² → ÷ 4 = ?\n(Answer: 400)',
  ]
  const day = Math.floor(Date.now() / 86400000)
  return chains[day % chains.length]
}

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
      supabase.from('skills').select('*').range(0, 9999),
      supabase.from('questions').select('*').range(0, 9999)
    ])
    setClassSkills(csRes.data || [])
    setSkills(skillsRes.data || [])
    setQuestions(qRes.data || [])
  }

  function getQuestionsForSkill(skillId) {
    return questions.filter(q => q.skill_id === skillId).sort((a, b) => a.tier - b.tier)
  }

  // Build a SLIDE SET for a skill:
  // Returns an array of slides — spotlight singles + final full bank
  function buildSlideSet(cs, tag = '', opts = {}) {
    const sk = cs.skill || {}
    const bankedQs = getQuestionsForSkill(sk.id || cs.skill_id)
    // Augment with algorithmically generated questions for tiers that have < 4 questions
    const allQs = augmentWithGenerated(sk, bankedQs, 4).sort((a, b) => a.tier - b.tier)
    const btbEasy = sk.btb_easy || ''
    const btbHard = sk.btb_hard || ''
    const btbChain = sk.btb_chain || ''
    const base = { skill: sk, classSkill: cs, tag, btbEasy, btbHard, btbChain, ...opts }

    if (!allQs.length) {
      // No questions — just a full bank placeholder
      return [{ ...base, id: cs.id, singleMode: false, isBank: true, questions: [] }]
    }

    // Pick spotlight questions: 1 from T1, 1 from T2, 1 from T3 (or T4)
    // These are the individually-revealed slides teachers work through with the class
    const byTier = { 1: [], 2: [], 3: [], 4: [] }
    allQs.forEach(q => { if (byTier[q.tier]) byTier[q.tier].push(q) })

    const spotlights = []
    // T1: pick 1 for the opener (verbal/whiteboard)
    if (byTier[1].length) spotlights.push(byTier[1][0])
    // T2: pick 1 
    if (byTier[2].length) spotlights.push(byTier[2][0])
    // T3 or T4: pick 1 for the class discussion/show-work question
    const higherTier = [...byTier[3], ...byTier[4]]
    if (higherTier.length) spotlights.push(higherTier[0])

    const slides = []

    // Spotlight slides — one question per slide, interactive
    spotlights.forEach((q, i) => {
      slides.push({
        ...base,
        id: `${cs.id}-spot${i}`,
        singleMode: true,
        isBank: false,
        isSpotlight: true,
        spotlightIndex: i,
        spotlightTotal: spotlights.length,
        questions: [q],
      })
    })

    // Final slide = full tiered bank of ALL questions
    slides.push({
      ...base,
      id: `${cs.id}-bank`,
      singleMode: false,
      isBank: true,
      isSpotlight: false,
      questions: allQs,
    })

    return slides
  }

  // Legacy single-slide builder (used for retrieval/prereq where we don't want full sets)
  function buildSingleSlide(cs, tag = '', opts = {}) {
    const sk = cs.skill || {}
    const banked = getQuestionsForSkill(sk.id || cs.skill_id)
    const qs = augmentWithGenerated(sk, banked, 4).sort((a, b) => a.tier - b.tier)
    return {
      id: cs.id,
      skill: sk,
      classSkill: cs,
      tag,
      singleMode: false,
      isBank: true,
      questions: qs,
      btbEasy: sk.btb_easy || '',
      btbHard: sk.btb_hard || '',
      btbChain: sk.btb_chain || '',
      ...opts
    }
  }

  function buildFoundational(idx) {
    const f = FOUNDATIONAL[idx % FOUNDATIONAL.length]
    return {
      id: 'fndl-' + idx,
      type: 'tiered',  // warm-up shows all questions tiered
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
    const { data: qs } = await supabase.from('questions').select('*').range(0, 9999)
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

    // Helper: get questions for a skill from qMap
    function skillQs(sk) {
      return (qMap[sk.id] || []).sort((a, b) => a.tier - b.tier)
    }

    // 1. Foundational warm-ups (full tiered bank only — no spotlight needed for mental maths)
    for (let i = 0; i < fndlCount; i++) {
      const f = FOUNDATIONAL[(dayOfYear + i) % FOUNDATIONAL.length]
      built.push({
        id: `fndl-${i}`,
        skill: { skill_name: f.label, strand: f.strand, year_level: 'F', topic: 'Foundational' },
        classSkill: null, tag: '⚡ Warm-up', isFoundational: true,
        singleMode: false, isBank: true,
        questions: [...f.questions],
        btbEasy: f.btbEasy, btbHard: f.btbHard, btbChain: '',
      })
    }

    // 2. Upcoming prereqs — just a quick spotlight set (no full bank, keep it brief)
    upcomingPrereqs.forEach(c => {
      const sk = c.skill || {}
      const qs = skillQs(sk).filter(q => q.tier <= 2).slice(0, 3)
      qs.forEach((q, i) => built.push({
        id: `${c.id}-pre${i}`, skill: sk, classSkill: c, tag: c._tag,
        singleMode: true, isBank: false, isSpotlight: true,
        questions: [q],
        btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || '', btbChain: sk.btb_chain || '',
      }))
    })

    // 3. Long-term retrieval — just the full bank (students should remember this)
    retrieval.forEach(c => {
      const sk = c.skill || {}
      built.push({
        id: `${c.id}-ret`, skill: sk, classSkill: c, tag: '🧠 Retrieval',
        singleMode: false, isBank: true,
        questions: skillQs(sk),
        btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || '', btbChain: sk.btb_chain || '',
      })
    })

    // 4. Due topics — SLIDE SET per skill:
    //    • 3 spotlight slides (1 from T1, 1 from T2, 1 from T3/T4) — interactive
    //    • 1 full tiered bank slide — all questions, all tiers
    due.forEach(c => {
      const sk = c.skill || {}
      const mastery = c.mastery || 1
      const history = Array.isArray(c.rating_history) ? c.rating_history : []
      const lowStreak = history.slice(-3).filter(r => r.rating <= 2).length >= 2
      const tag = mastery <= 2 ? '⚠ Low mastery' : ''
      const slideSet = buildSlideSet(c, tag, { isWC: lowStreak })
      built.push(...slideSet)
    })

    setSlides(built)
    setCurrentSlides(built)
    const skillCount = due.length
    const totalSlides = built.length
    setSummary({
      fndl: fndlCount, prereqs: upcomingPrereqs.length,
      retrieval: retrieval.length, due: skillCount, total: totalSlides
    })
    setLoading(false)
    showToast(`Generated ${totalSlides} slides for ${skillCount} skills`)
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
      {(() => {
        // Group slides by skill for visual grouping
        // Spotlight slides + bank slide for the same skill appear together
        const groups = []
        let curGroup = null
        slides.forEach((slide, si) => {
          const skillKey = slide.skill?.skill_name || slide.id
          if (!curGroup || curGroup.skillKey !== skillKey || slide.isBank || slide.isFoundational) {
            if (curGroup) groups.push(curGroup)
            curGroup = { skillKey, slides: [], isFoundational: slide.isFoundational }
          }
          curGroup.slides.push({ slide, si })
          if (slide.isBank) {
            groups.push(curGroup)
            curGroup = null
          }
        })
        if (curGroup) groups.push(curGroup)

        return groups.map((group, gi) => {
          const firstSlide = group.slides[0]?.slide || {}
          const sk = firstSlide.skill || {}
          const strandCls = 'st-' + (sk.strand || '').toLowerCase().split(' ')[0]
          const spotCount = group.slides.filter(s => s.slide.isSpotlight).length
          const hasBank = group.slides.some(s => s.slide.isBank)
          const isFoundational = group.isFoundational

          return (
            <div key={gi} style={{ marginBottom: 20 }}>
              {/* Group header */}
              {!isFoundational && group.slides.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 12px', background: 'var(--s2)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)' }}>
                  <span className={`strand-tag ${strandCls}`}>{sk.strand}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{sk.skill_name}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: 'var(--tm)' }}>
                    {spotCount > 0 && `${spotCount} spotlight${spotCount > 1 ? 's' : ''} → `}
                    {hasBank && '1 full bank'}
                  </span>
                  {sk.year_level !== 'F' && <span className="yr-tag">Yr {sk.year_level}</span>}
                </div>
              )}

              {/* Individual slides in group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: !isFoundational && group.slides.length > 1 ? 16 : 0, borderLeft: !isFoundational && group.slides.length > 1 ? '2px solid var(--b2)' : 'none' }}>
                {group.slides.map(({ slide, si }) => {
                  const isSpotlight = slide.isSpotlight
                  const isBank = slide.isBank
                  const slideTag = isSpotlight
                    ? `💡 Spotlight Q (${slide.spotlightIndex + 1}/${slide.spotlightTotal})`
                    : isBank ? '📋 Full Bank' : slide.tag || ''
                  const borderCol = isBank ? 'rgba(74,200,240,.35)' : isSpotlight ? 'rgba(160,74,240,.25)' : 'var(--b1)'
                  const bgCol = isBank ? 'rgba(74,200,240,.03)' : isSpotlight ? 'rgba(160,74,240,.02)' : 'var(--s1)'

                  return (
                    <div key={slide.id} className="card" style={{ border: `1px solid ${borderCol}`, background: bgCol }}>
                      {/* Slide header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '10px 14px', borderBottom: '1px solid var(--b1)' }}>
                        <span style={{ fontSize: 10, color: 'var(--tm)', fontWeight: 600, minWidth: 32 }}>#{si + 1}</span>
                        {/* Slide type badge */}
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
                          background: isBank ? 'rgba(74,200,240,.15)' : isSpotlight ? 'rgba(160,74,240,.15)' : 'rgba(74,240,160,.1)',
                          color: isBank ? 'var(--blu)' : isSpotlight ? 'var(--pur)' : 'var(--grn)',
                        }}>{slideTag}</span>
                        {slide.tag && !isSpotlight && !isBank && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: slide.tag.includes('⚠') ? 'var(--org)' : 'var(--blu)', padding: '2px 6px', background: slide.tag.includes('⚠') ? 'rgba(240,148,74,.1)' : 'rgba(74,200,240,.1)', borderRadius: 4 }}>{slide.tag}</span>
                        )}
                        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: isBank ? 700 : 500, fontSize: 13, color: isBank ? 'var(--tx)' : 'var(--td)' }}>
                          {isFoundational || group.slides.length === 1 ? sk.skill_name : (isBank ? 'All questions — work independently' : '')}
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {isBank && (
                            <button onClick={() => setSlides(s => { const n = [...s]; n[si] = { ...n[si], singleMode: !n[si].singleMode }; setCurrentSlides(n); return n })}
                              style={{ padding: '4px 10px', border: `1px solid ${slides[si]?.singleMode ? 'var(--blu)' : 'var(--b2)'}`, borderRadius: 4, background: slides[si]?.singleMode ? 'rgba(74,200,240,.1)' : 'transparent', color: slides[si]?.singleMode ? 'var(--blu)' : 'var(--tm)', fontSize: 10, cursor: 'pointer' }}>
                              {slides[si]?.singleMode ? '1️⃣ Single ✓' : '📋 Tiered'}
                            </button>
                          )}
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: 14 }} onClick={() => removeSlide(si)}>✕</button>
                        </div>
                      </div>

                      {/* Questions */}
                      <div style={{ padding: '8px 12px' }}>
                        {slide.questions.map((q, qi) => {
                          const qt = q.question_type || q.type || 'std'
                          const qtext = q.question_text || q.q || ''
                          const atext = q.answer_text || q.a || ''
                          const vccode = q.vc_code || q.vc || ''
                          return (
                            <div key={qi} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 8, alignItems: 'start', padding: '7px 10px', background: 'var(--s2)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)', marginBottom: 5 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: ['','rgba(74,240,160,.15)','rgba(74,200,240,.15)','rgba(240,148,74,.15)','rgba(240,74,107,.15)'][q.tier || 1], color: ['','var(--grn)','var(--blu)','var(--org)','var(--red)'][q.tier || 1], whiteSpace: 'nowrap', marginTop: 2 }}>
                                T{q.tier}
                              </span>
                              <div>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 3, flexWrap: 'wrap' }}>
                                  {qt !== 'std' && <span className={`qtype-badge qt-${qt}`}>{QTYPE_LABELS[qt] || qt}</span>}
                                  {vccode && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tm)', padding: '1px 4px', border: '1px solid var(--b1)', borderRadius: 3 }}>{vccode}</span>}
                                  {q.image_url && <span style={{ fontSize: 9, color: 'var(--blu)' }}>🖼</span>}
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{qtext}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tm)', marginTop: 3 }}>→ {atext}</div>
                              </div>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--blu)' }} onClick={() => openEditQ(si, qi)}>Edit</button>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => removeQuestion(si, qi)}>✕</button>
                            </div>
                          )
                        })}
                        {isBank && (
                          <button onClick={() => openAddQ(si)} style={{ width: '100%', padding: '6px', border: '1px dashed var(--b2)', borderRadius: 'var(--rs)', background: 'transparent', color: 'var(--tm)', fontSize: 11, cursor: 'pointer' }}>
                            + Add question to bank
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      })()}
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
