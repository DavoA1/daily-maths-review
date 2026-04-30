import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSlides, getTimerSecs, getBtbSecs } from '../lib/slideStore.js'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.jsx'

const channel = new BroadcastChannel('dmr_student_view')

const TIER_LABELS = ['','Foundation','Core','Extension','Challenge']
const TIER_COLS = ['','#16a34a','#2563eb','#d97706','#dc2626']
const TIER_BG   = ['','#f0fdf4','#eff6ff','#fffbeb','#fef2f2']
const TIER_BORDER=['','#86efac','#93c5fd','#fcd34d','#fca5a5']




// ── GRID HELPERS ────────────────────────────────────────────
// Snap question count to clean grid numbers (no empty cells)
// T1/T2: 1,2,3,4,6 — never 5 (would leave a blank)
// T3: 1 or 2
// T4: always 1
function snapCount(n, maxN) {
  const clean = [1,2,3,4,6].filter(c => c <= maxN)
  for (let i = clean.length - 1; i >= 0; i--) {
    if (n >= clean[i]) return clean[i]
  }
  return Math.min(n, 1)
}
function gridCols(n) {
  if (n <= 3) return n   // 1→1col, 2→2col, 3→3col
  if (n === 4) return 2  // 2×2
  if (n === 6) return 3  // 3×2
  return n
}

const MODE_CONFIG = {
  whiteboard: { label: '📝 Whiteboard', colour: '#7c3aed', desc: 'Write answer on whiteboard — hold up on signal' },
  verbal:     { label: '🗣 Verbal Response', colour: '#0891b2', desc: 'Think about it — teacher will cold call or pair-share' },
  tf:         { label: '👍 True / False', colour: '#059669', desc: 'Thumbs UP for True · Thumbs DOWN for False' },
  mc:         { label: '🃏 Multiple Choice', colour: '#7c3aed', desc: 'Hold up your A / B / C / D card' },
}

function assignModes(questions) {
  return questions.map((q, i) => {
    const base = q.question_type || q.type || 'std'
    let mode = 'whiteboard'
    if (base === 'tf') mode = 'tf'
    else if (base === 'mc') mode = 'mc'
    else if (i === 0) mode = 'verbal'
    return { ...q, presentMode: mode }
  })
}

export default function Present() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  // Read slides from the shared store (persists across navigation)
  const storedSlides = getSlides()
  const allSlides = (storedSlides.length > 0 ? storedSlides : state?.slides) || []
  const timerSecs = getTimerSecs() || state?.timerSecs || 20
  const btbSecs   = getBtbSecs()   || state?.btbSecs   || 90

  // Each slide is either:
  // mode='tiered'  → show all questions in tier rows (10-20 questions)
  // mode='single'  → 3-5 questions shown one at a time (WC / special sets)
  // mode='bomb'    → Beat the Bomb

  const [slideIdx, setSlideIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)       // for single-question mode
  const [showAns, setShowAns] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timerSecs)
  const [bombLeft, setBombLeft] = useState(btbSecs)
  const [ratings, setRatings] = useState({})
  const [skipped, setSkipped] = useState(new Set())
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [reviewElapsed, setReviewElapsed] = useState(0)  // seconds since first slide
  const timerRef = useRef(null)
  const bombRef = useRef(null)
  const reviewTimerRef = useRef(null)

  const isBomb = slideIdx >= allSlides.length
  const totalSlides = allSlides.length + 1
  const currentSlide = !isBomb ? allSlides[slideIdx] : null

  // Determine slide display mode
  const slideMode = !currentSlide ? 'bomb'
    : currentSlide.isWC ? 'single'
    : currentSlide.singleMode ? 'single'
    : 'tiered'

  // For spotlight slides, always just 1 question. For singleMode bank slides, up to 5.
  const singleSeq = currentSlide
    ? currentSlide.isSpotlight
      ? assignModes(currentSlide.questions || [])
      : assignModes(currentSlide.questions || []).slice(0, 5)
    : []
  const currentQ = slideMode === 'single' ? (singleSeq[qIdx] || singleSeq[0]) : null
  const modeConfig = currentQ ? (MODE_CONFIG[currentQ.presentMode] || MODE_CONFIG.whiteboard) : MODE_CONFIG.whiteboard

  function startTimer(s) {
    clearInterval(timerRef.current)
    setTimeLeft(s)
    timerRef.current = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000)
  }
  function startBomb() {
    clearInterval(bombRef.current)
    setBombLeft(btbSecs)
    bombRef.current = setInterval(() => setBombLeft(t => t > 0 ? t - 1 : 0), 1000)
  }

  useEffect(() => {
    if (!allSlides.length) { navigate('/generate'); return }
    startTimer(timerSecs)
    // 10-minute review timer
    reviewTimerRef.current = setInterval(() => setReviewElapsed(e => e + 1), 1000)
    return () => {
      clearInterval(timerRef.current)
      clearInterval(bombRef.current)
      clearInterval(reviewTimerRef.current)
    }
  }, [])

  function goToSlide(si, qi = 0) {
    clearInterval(timerRef.current); clearInterval(bombRef.current)
    setShowAns(false); setSlideIdx(si); setQIdx(qi)
    if (si >= allSlides.length) startBomb()
    else startTimer(timerSecs)
    pushToStudent(si, qi, false)
  }

  function nextQ() {
    clearInterval(timerRef.current)
    setShowAns(false)
    if (slideMode === 'single' && qIdx < singleSeq.length - 1) {
      setQIdx(q => q + 1)
      startTimer(timerSecs)
      pushToStudent(slideIdx, qIdx + 1, false)
    } else {
      goToSlide(slideIdx < totalSlides - 1 ? slideIdx + 1 : slideIdx)
    }
  }
  function prevQ() {
    clearInterval(timerRef.current)
    setShowAns(false)
    if (slideMode === 'single' && qIdx > 0) {
      setQIdx(q => q - 1)
      startTimer(timerSecs)
    } else if (slideIdx > 0) {
      goToSlide(slideIdx - 1)
    }
  }

  function toggleAns() {
    const next = !showAns
    setShowAns(next)
    pushToStudent(slideIdx, qIdx, next)
  }

  function skipSlide() {
    setSkipped(prev => new Set([...prev, slideIdx]))
    // Record skip on classSkill if present
    const sl = allSlides[slideIdx]
    if (sl?.classSkill?.id) {
      const history = sl.classSkill.rating_history || []
      history.push({ date: new Date().toISOString(), rating: 0, skipped: true })
      supabase.from('class_skills').update({ rating_history: history }).eq('id', sl.classSkill.id).then(()=>{})
    }
    nextQ()
  }

  function pushToStudent(si, qi, ans) {
    if (si >= allSlides.length) {
      const last = allSlides[allSlides.length - 1]
      channel.postMessage({ type: 'slide', isBomb: true, showAns: ans, btbSecs,
        bomb: { easy: last?.btbEasy || '', hard: last?.btbHard || '', chain: last?.btbChain || '' } })
      return
    }
    const slide = allSlides[si]
    const seq = assignModes(slide?.questions || []).slice(0, 5)
    const q = seq[qi] || seq[0]
    const mode = q?.presentMode || 'whiteboard'
    const byTier = {1:[],2:[],3:[],4:[]}
    ;(slide?.questions || []).forEach(q => { if(byTier[q.tier]) byTier[q.tier].push(q) })
    channel.postMessage({
      type:'slide', isBomb:false, showAns:ans,
      slideMode: slide?.isExplanation ? 'explanation' : slide?.isSpotlight ? 'single' : (slide?.isBank && !slide?.singleMode) ? 'tiered' : slide?.singleMode ? 'single' : 'tiered',
      isExplanation: slide?.isExplanation || false,
      expTitle: slide?.expTitle || '',
      expText: slide?.expText || '',
      expImage: slide?.expImage || '',
      expVideo: slide?.expVideo || '',
      isSpotlight: slide?.isSpotlight || false,
      isBank: slide?.isBank || false,
      spotlightIndex: slide?.spotlightIndex,
      spotlightTotal: slide?.spotlightTotal,
      skill: slide?.skill?.skill_name, topic: slide?.skill?.topic,
      year: slide?.skill?.year_level, strand: slide?.skill?.strand,
      qtext: q?.question_text || q?.q || '',
      atext: q?.answer_text || q?.a || '',
      qimage: q?.image_url || '',
      mode, tier: q?.tier || 1, qtype: q?.question_type || 'std',
      qNum: qi + 1, qTotal: seq.length,
      byTier,
      slideNum: si + 1, slideTotal: allSlides.length
    })
  }

  function openStudentView() {
    const win = window.open(window.location.origin + '/student', 'DMR_Student', 'width=1280,height=720,menubar=no,toolbar=no')
    setTimeout(() => pushToStudent(slideIdx, qIdx, showAns), 1000)
  }

  function rateSkill(skillName, rating) {
    setRatings(r => ({ ...r, [skillName]: rating }))
    const sl = allSlides[slideIdx]
    if (sl?.classSkill?.id) {
      const history = sl.classSkill.rating_history || []
      history.push({ date: new Date().toISOString(), rating })
      const mastery = rating <= 2 ? Math.max(1,(sl.classSkill.mastery||1)-1)
                    : rating >= 4 ? Math.min(7,(sl.classSkill.mastery||1)+1)
                    : sl.classSkill.mastery || 1
      supabase.from('class_skills').update({ mastery, last_reviewed: new Date().toISOString(), rating_history: history }).eq('id', sl.classSkill.id).then(()=>{})
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  function exitPresent() {
    clearInterval(timerRef.current); clearInterval(bombRef.current)
    channel.postMessage({ type: 'close' })
    navigate('/generate')
  }

  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === ' ') nextQ()
      else if (e.key === 'ArrowLeft') prevQ()
      else if (e.key.toLowerCase() === 'a') toggleAns()
      else if (e.key.toLowerCase() === 's') skipSlide()
      else if (e.key.toLowerCase() === 'f') toggleFullscreen()
      else if (e.key === '\u003f') setShowShortcuts(s => !s)  // ? key
      else if (e.key === 'Escape') { if (showShortcuts) setShowShortcuts(false); else exitPresent() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slideIdx, qIdx, showAns, slideMode])

  if (!allSlides.length) return null
  const urgent = timeLeft <= 5 && !isBomb
  const sk = currentSlide?.skill || {}

  return (
    <div style={{ position:'fixed', inset:0, background:'#1e1b4b', zIndex:2000, display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:"'Figtree', sans-serif" }}>

      {/* Progress bar */}
      <div style={{ height:4, background:'rgba(255,255,255,.15)', flexShrink:0 }}>
        <div style={{ height:'100%', background:'#a78bfa', width:`${(slideIdx/totalSlides)*100}%`, transition:'width .3s' }} />
      </div>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', padding:'8px 18px', background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)', borderBottom:'1px solid rgba(255,255,255,.1)', flexShrink:0, gap:12, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:'#e0e7ff', fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:8 }}>
            {isBomb ? '💣 BEAT THE BOMB' : sk.skill_name}
            {!isBomb && currentSlide?.isSpotlight && (
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:4, background:'rgba(167,139,250,.25)', color:'#c4b5fd', fontWeight:700, whiteSpace:'nowrap' }}>
                💡 Spotlight {currentSlide.spotlightIndex+1}/{currentSlide.spotlightTotal}
              </span>
            )}
            {!isBomb && currentSlide?.isBank && (
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:4, background:'rgba(74,200,240,.2)', color:'#67e8f9', fontWeight:700, whiteSpace:'nowrap' }}>
                📋 Full Bank
              </span>
            )}
          </div>
          {!isBomb && <div style={{ color:'rgba(224,231,255,.5)', fontSize:11, marginTop:1 }}>
            Slide {slideIdx+1}/{allSlides.length} · {sk.strand} · {sk.year_level==='F'?'Foundational':`Yr ${sk.year_level}`}
          </div>}
        </div>

        {/* Mode badge for single-question mode */}
        {slideMode === 'single' && currentQ && !isBomb && (
          <div style={{ padding:'4px 12px', borderRadius:6, border:`1px solid ${modeConfig.colour}60`, background:`${modeConfig.colour}25`, color:modeConfig.colour, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
            {modeConfig.label}
          </div>
        )}

        {/* Timer */}
        <div style={{ fontFamily:'monospace', fontSize:24, fontWeight:800, minWidth:56, textAlign:'center', color: urgent ? '#f87171' : isBomb ? '#f87171' : '#a78bfa', animation: urgent ? 'pulse .5s infinite' : 'none' }}>
          {isBomb ? `${bombLeft}s` : `${timeLeft}s`}
        </div>

        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {[
            { l:'← Prev', fn:prevQ, dis:slideIdx===0&&qIdx===0 },
            { l:showAns?'🙈 Hide':'👁 Reveal', fn:toggleAns, col:'#a78bfa' },
            { l:'Next →', fn:nextQ, dis:isBomb },
            { l:'⏭ Skip', fn:skipSlide, col:'#f59e0b', dis:isBomb },
            { l:'📺 Student View', fn:openStudentView, col:'#34d399' },
            { l:'⛶ Full', fn:toggleFullscreen, col:'rgba(224,231,255,.5)' },
            { l:'\u003f Keys', fn:()=>setShowShortcuts(s=>!s), col:'rgba(224,231,255,.5)' },
            { l:'✕ Exit', fn:exitPresent, col:'#f87171' },
          ].map(b => (
            <button key={b.l} onClick={b.fn} disabled={b.dis}
              style={{ padding:'5px 11px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', border:`1px solid ${b.col||'rgba(255,255,255,.2)'}`, background:'rgba(0,0,0,.3)', color:b.col||'rgba(224,231,255,.7)', opacity:b.dis?0.4:1, transition:'all .15s' }}>
              {b.l}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-question progress for single mode */}
      {slideMode === 'single' && singleSeq.length > 1 && !isBomb && (
        <div style={{ display:'flex', gap:4, padding:'6px 18px', background:'rgba(0,0,0,.25)', borderBottom:'1px solid rgba(255,255,255,.08)', flexShrink:0 }}>
          {singleSeq.map((q,i) => {
            const mc = MODE_CONFIG[q.presentMode] || MODE_CONFIG.whiteboard
            return (
              <div key={i} onClick={() => { setQIdx(i); setShowAns(false); startTimer(timerSecs) }}
                style={{ flex:1, height:30, borderRadius:6, border:`1px solid ${i===qIdx?mc.colour:'rgba(255,255,255,.15)'}`, background:i===qIdx?`${mc.colour}30`:i<qIdx?'rgba(255,255,255,.08)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:11, color:i===qIdx?mc.colour:'rgba(224,231,255,.5)', fontWeight:i===qIdx?700:400 }}>
                Q{i+1} {i < qIdx ? '✓' : ''}
              </div>
            )
          })}
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', padding:slideMode==='explanation'?'0':'12px 18px 6px', alignItems:'center', minHeight:0, position:'relative' }}>
        {isBomb
          ? <BombSlide left={bombLeft} btbSecs={btbSecs} slide={allSlides[allSlides.length-1]} showAns={showAns} />
          : slideMode === 'explanation'
            ? <ExplanationSlide slide={currentSlide} />
          : slideMode === 'single'
            ? <SingleQSlide slide={currentSlide} q={currentQ} showAns={showAns} modeConfig={modeConfig} />
            : <TieredSlide slide={currentSlide} showAns={showAns} />
        }

        {/* Check-in strip — shown at end of each slide group */}
        {!isBomb && (slideMode === 'tiered' || (slideMode === 'single' && qIdx === singleSeq.length - 1)) && (
          <div style={{ width:'100%', maxWidth:1200, marginTop:8, marginBottom:6, padding:'8px 14px', background:'rgba(0,0,0,.3)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', flexShrink:0 }}>
            <span style={{ color:'rgba(224,231,255,.6)', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>Class rating:</span>
            <div className="rating-row">
              {[{v:1,l:'😕 Lost'},{v:2,l:'🤔 Struggling'},{v:3,l:'😐 Mixed'},{v:4,l:'🙂 Getting it'},{v:5,l:'✅ Got it!'}].map(r => (
                <button key={r.v} className={`r-btn r${r.v}${ratings[sk.skill_name]===r.v?' sel':''}`}
                  onClick={() => rateSkill(sk.skill_name, r.v)}>{r.l}</button>
              ))}
            </div>
            {ratings[sk.skill_name] && <span style={{ fontSize:11, color:'#34d399', fontWeight:600 }}>✓ Rated {ratings[sk.skill_name]}/5</span>}
          </div>
        )}

        {/* Slide dots */}
        <div style={{ display:'flex', gap:4, paddingBottom:4, flexShrink:0 }}>
          {Array.from({length:totalSlides},(_,i) => (
            <div key={i} onClick={() => goToSlide(i)}
              style={{ width:7, height:7, borderRadius:'50%', cursor:'pointer', transition:'all .2s', transform:i===slideIdx?'scale(1.4)':'scale(1)', background: skipped.has(i)?'#f59e0b':i===slideIdx?'#a78bfa':'rgba(255,255,255,.25)' }} />
          ))}
        </div>
        {/* 10-minute review timer bar */}
        <ReviewTimerBar elapsed={reviewElapsed} totalSecs={600} />
      </div>

      </div>

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div onClick={() => setShowShortcuts(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#1e2230', border:'1px solid rgba(255,255,255,.15)', borderRadius:16, padding:'28px 36px', minWidth:360 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:'#e0e7ff', marginBottom:20, textAlign:'center' }}>⌨ Keyboard Shortcuts</div>
            {[
              ['→  or  Space', 'Next slide / question'],
              ['←', 'Previous slide'],
              ['A', 'Reveal / hide answer'],
              ['S', 'Skip slide'],
              ['F', 'Toggle fullscreen'],
              ['\u003f', 'Show / hide this panel'],  // ? key
              ['Esc', 'Close overlay / exit present'],
            ].map(([key, desc]) => (
              <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
                <kbd style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:6, padding:'3px 10px', fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:'#a78bfa', letterSpacing:'.05em' }}>{key}</kbd>
                <span style={{ color:'rgba(224,231,255,.7)', fontSize:13 }}>{desc}</span>
              </div>
            ))}
            <div style={{ textAlign:'center', marginTop:16, fontSize:12, color:'rgba(224,231,255,.3)' }}>Click anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── REVIEW TIMER BAR ────────────────────────────────────────
function ReviewTimerBar({ elapsed, totalSecs }) {
  const pct = Math.min(100, (elapsed / totalSecs) * 100)
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  const overTime = elapsed >= totalSecs
  const barCol = pct < 60 ? '#34d399' : pct < 85 ? '#f59e0b' : '#f87171'
  return (
    <div style={{ width:'100%', flexShrink:0, paddingBottom:4 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'rgba(224,231,255,.5)', marginBottom:3 }}>
        <span>⏱ Review timer</span>
        <span style={{ color: overTime?'#f87171':'rgba(224,231,255,.5)', fontWeight: overTime?700:400 }}>
          {overTime ? `+${Math.floor((elapsed-totalSecs)/60)}:${String((elapsed-600)%60).padStart(2,'0')} over` : `${mins}:${String(secs).padStart(2,'0')} / 10:00`}
        </span>
      </div>
      <div style={{ height:5, background:'rgba(255,255,255,.1)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:barCol, borderRadius:3, transition:'width .5s linear' }} />
      </div>
    </div>
  )
}

// ── TIERED SLIDE ──
// T1: 6q max · T2: 6q max · T3: 2q max · T4: 1q
// Font size auto-fits based on text length, tier row height, and whether answer is shown
function TieredSlide({ slide, showAns }) {
  if (!slide) return null
  const sk = slide.skill || {}

  const byTier = {1:[],2:[],3:[],4:[]}
  ;(slide.questions || []).forEach(q => { if (byTier[q.tier]) byTier[q.tier].push(q) })

  const tieredRows = [1,2,3,4].map(t => {
    const qs = [...byTier[t]]
      .sort((a,b) => (a.question_text||a.q||'').length - (b.question_text||b.q||'').length)
    if (!qs.length) return null
    const maxN = t <= 2 ? 6 : t === 3 ? 2 : 1
    return { tier: t, qs: qs.slice(0, snapCount(qs.length, maxN)) }
  }).filter(Boolean)

  if (!tieredRows.length) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
      color:'rgba(224,231,255,.4)', fontSize:16, fontStyle:'italic' }}>
      No questions yet — re-seed the question bank.
    </div>
  )

  // Font size: scales down with text length and number of rows in tier
  // Also shrinks when answer is shown to fit both Q + A in the cell
  function cellFont(qs, showingAns) {
    const maxLen = Math.max(...qs.map(q => (q.question_text||q.q||'').length))
    const rows = qs.length / gridCols(qs.length)  // how many rows of cells
    // Longer text → smaller font; more rows → smaller font; answer shown → shrink further
    const base = maxLen > 80 ? 13
               : maxLen > 55 ? 15
               : maxLen > 35 ? 17
               : maxLen > 20 ? 18
               : 20
    const rowPenalty = rows > 1 ? 2 : 0
    const ansPenalty = showingAns ? 3 : 0
    return Math.max(11, base - rowPenalty - ansPenalty)
  }

  function ansFont(qFont) { return Math.max(10, qFont - 2) }

  return (
    <div style={{ width:'100%', maxWidth:1400, display:'flex', flexDirection:'column', flex:1, minHeight:0, overflow:'hidden' }}>

      {/* Skill header */}
      <div style={{ textAlign:'center', marginBottom:5, flexShrink:0 }}>
        <div style={{ color:'#e0e7ff', fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize:'clamp(12px,1.5vw,20px)' }}>{sk.skill_name}</div>
        <div style={{ color:'rgba(224,231,255,.4)', fontSize:10, marginTop:1 }}>
          {sk.topic} · {sk.strand} · {sk.year_level==='F'?'Foundational':`Year ${sk.year_level}`}
        </div>
      </div>

      {/* Tier rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1, minHeight:0, overflow:'hidden', alignContent:'stretch' }}>
        {tieredRows.map(({ tier: t, qs }) => {
          const font    = cellFont(qs, showAns)
          const aFont   = ansFont(font)
          const cols    = gridCols(qs.length)
          const rows    = qs.length / cols
          // T1/T2/T3 get more space; T4 reduced 15% from baseline
          const flexW   = t === 1 ? 1.6 : t === 2 ? 1.6 : t === 3 ? 1.5 : 1.3

          return (
            <div key={t} style={{ display:'flex', gap:4, flex:flexW, minHeight:0, overflow:'hidden', alignItems:'stretch' }}>

              {/* Tier label */}
              <div style={{
                background: TIER_BG[t], border:`1.5px solid ${TIER_BORDER[t]}`,
                color: TIER_COLS[t], padding:'3px 5px', borderRadius:6,
                fontSize:8, fontWeight:800, letterSpacing:'.05em',
                writingMode:'vertical-rl', transform:'rotate(180deg)',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, minWidth:20, textTransform:'uppercase',
              }}>
                {t === 4 ? '🏆' : `T${t}`}
              </div>

              {/* Grid */}
              <div style={{
                display:'grid',
                gridTemplateColumns:`repeat(${cols}, 1fr)`,
                gridTemplateRows:`repeat(${rows}, 1fr)`,
                gap:4, flex:1, minHeight:0, overflow:'hidden',
                alignItems:'stretch', alignContent:'stretch',
              }}>
                {qs.map((q, qi) => {
                  const qtext = q.question_text || q.q || ''
                  const atext = q.answer_text || q.a || ''
                  const img   = q.image_url || ''
                  const isGen = q.generated

                  return (
                    <div key={qi} style={{
                      background: t===4
                        ? 'linear-gradient(135deg,rgba(255,255,255,.99),rgba(255,251,235,.98))'
                        : 'rgba(255,255,255,.97)',
                      border:`${t===4?2:1.5}px solid ${TIER_BORDER[t]}`,
                      borderRadius:7, padding:'5px 8px',
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      overflow:'hidden', height:'100%', boxSizing:'border-box',
                    }}>
                      {/* Q label */}
                      <div style={{ color:TIER_COLS[t], fontSize:8, fontWeight:800,
                        letterSpacing:'.04em', marginBottom:2, alignSelf:'flex-start',
                        display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
                        {t===4 ? '🏆' : `${t}.${qi+1}`}
                        {isGen && <span style={{ fontSize:7, opacity:.4 }}>⚡</span>}
                      </div>
                      {/* Image */}
                      {img && <img src={img} alt="" style={{
                        maxHeight:40, maxWidth:'90%', objectFit:'contain',
                        marginBottom:3, borderRadius:3, flexShrink:0
                      }} />}
                      {/* Question text */}
                      <div style={{
                        color:'#0f172a',
                        fontFamily:"'JetBrains Mono',monospace",
                        fontSize:`${font}px`,
                        lineHeight:1.35,
                        whiteSpace:'pre-wrap', wordBreak:'break-word',
                        fontWeight: t===4 ? 600 : 400,
                        textAlign:'center',
                        overflow:'hidden',
                        flex:1,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        width:'100%',
                      }}>
                        {qtext}
                      </div>
                      {/* Answer — appears below, same cell */}
                      {showAns && (
                        <div style={{
                          color:'#166534',
                          fontFamily:"'JetBrains Mono',monospace",
                          fontSize:`${aFont}px`,
                          fontWeight:700,
                          lineHeight:1.3,
                          borderTop:`1px solid ${TIER_BORDER[t]}`,
                          paddingTop:3, marginTop:3,
                          width:'100%', textAlign:'center',
                          overflow:'hidden', flexShrink:0,
                          whiteSpace:'pre-wrap', wordBreak:'break-word',
                        }}>
                          → {atext}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SINGLE QUESTION SLIDE ──
function SingleQSlide({ slide, q, showAns, modeConfig }) {
  if (!slide || !q) return null
  const sk = slide.skill || {}
  const tier = q.tier || 1
  const qt = q.question_text || q.q || ''
  const at = q.answer_text || q.a || ''
  const img = q.image_url || ''
  const isTF = q.presentMode==='tf' || q.question_type==='tf' || q.type==='tf'
  const isMC = q.presentMode==='mc' || q.question_type==='mc' || q.type==='mc'

  return (
    <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexShrink:0 }}>
        <div style={{ color:'#e0e7ff', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'clamp(14px,1.8vw,22px)' }}>{sk.skill_name}</div>
        <div style={{ flex:1, height:1, background:'rgba(255,255,255,.15)' }} />
        <div style={{ background:TIER_BG[tier], border:`1px solid ${TIER_BORDER[tier]}`, color:TIER_COLS[tier], padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>T{tier} · {TIER_LABELS[tier]}</div>
      </div>

      {/* Mode instruction */}
      <div style={{ padding:'8px 16px', borderRadius:8, border:`1px solid ${modeConfig.colour}40`, background:`${modeConfig.colour}15`, marginBottom:12, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <span style={{ fontWeight:700, color:modeConfig.colour, fontSize:13 }}>{modeConfig.label}</span>
        <span style={{ fontSize:12, color:'rgba(224,231,255,.6)' }}>{modeConfig.desc}</span>
      </div>

      {/* T/F cards */}
      {isTF && !showAns && (
        <div style={{ display:'flex', justifyContent:'center', gap:40, marginBottom:16, flexShrink:0 }}>
          {[{l:'👍 TRUE',c:'#059669'},{l:'👎 FALSE',c:'#dc2626'}].map(tf => (
            <div key={tf.l} style={{ padding:'14px 36px', borderRadius:12, border:`2px solid ${tf.c}60`, background:`${tf.c}18`, fontFamily:"'Syne', sans-serif", fontSize:'clamp(18px,2.5vw,28px)', fontWeight:800, color:tf.c }}>{tf.l}</div>
          ))}
        </div>
      )}

      {/* The question card */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:0 }}>
        <div style={{ background:'rgba(255,255,255,.97)', borderRadius:16, padding:'clamp(20px,3vw,44px) clamp(24px,4vw,60px)', width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,.3)', textAlign:'center', maxHeight:'100%', overflow:'auto', border:`2px solid ${TIER_BORDER[tier]}` }}>
          {img && <img src={img} alt="" style={{ maxHeight:140, maxWidth:'80%', objectFit:'contain', marginBottom:16, borderRadius:8 }} />}
          <div style={{ color:'#0f172a', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(16px,2.8vw,36px)', lineHeight:1.6, whiteSpace:'pre-wrap', fontWeight:500 }}>
            {qt}
          </div>
          {/* MC options */}
          {isMC && !showAns && qt.includes('A)') && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:20, textAlign:'left' }}>
              {(qt.match(/[A-D]\).+/g)||[]).map((opt,i) => (
                <div key={i} style={{ padding:'12px 16px', background:'#f8fafc', borderRadius:10, border:'1.5px solid #e2e8f0', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(13px,1.8vw,22px)', color:'#1e293b' }}>{opt}</div>
              ))}
            </div>
          )}
          {showAns && (
            <div style={{ marginTop:24, paddingTop:20, borderTop:'2px solid #e2e8f0', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(15px,2.2vw,28px)', color:'#166534', fontWeight:600 }}>
              → {at}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── EXPLANATION SLIDE ───────────────────────────────────────
function ExplanationSlide({ slide }) {
  const title = slide?.expTitle || ''
  const text  = slide?.expText  || ''
  const image = slide?.expImage || ''
  const video = slide?.expVideo || ''
  const yt = video ? video.replace('watch?v=','embed/').replace('youtu.be/','youtube.com/embed/') : ''
  const hasMedia = image || yt

  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column',
      padding:'12px 20px', gap:12,
    }}>
      {/* Title banner */}
      <div style={{
        background:'rgba(160,74,240,.2)', border:'2px solid rgba(160,74,240,.4)',
        borderRadius:12, padding:'14px 28px', textAlign:'center', flexShrink:0,
      }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize:'clamp(18px,2.5vw,38px)', color:'#e0e7ff', lineHeight:1.2 }}>
          {title || 'Explanation'}
        </div>
      </div>

      {/* Content card — position absolute gives it definite height */}
      <div style={{
        flex:1, background:'rgba(255,255,255,.97)', borderRadius:12,
        padding:'24px 32px', overflow:'auto',
        boxShadow:'0 4px 24px rgba(0,0,0,.3)',
        display:'flex', gap:28, flexDirection: hasMedia ? 'row' : 'column',
        alignItems: hasMedia ? 'flex-start' : 'center',
        justifyContent:'center',
      }}>

        {/* Text */}
        <div style={{
          flex:1, color:'#1e293b', fontFamily:"'Figtree',sans-serif",
          fontSize:'clamp(16px,2vw,26px)', lineHeight:1.8,
          whiteSpace:'pre-wrap', wordBreak:'break-word',
          textAlign: hasMedia ? 'left' : 'center',
        }}>
          {text || <span style={{ color:'#94a3b8', fontStyle:'italic', fontSize:16 }}>No explanation text added.</span>}
        </div>

        {/* Image */}
        {image && !yt && (
          <div style={{ flexShrink:0, maxWidth:'45%', alignSelf:'center' }}>
            <img src={image} alt="" style={{ width:'100%', maxHeight:380,
              objectFit:'contain', borderRadius:8 }} />
          </div>
        )}

        {/* Video */}
        {yt && (
          <div style={{ flexShrink:0, width:'45%' }}>
            <iframe src={yt} style={{ width:'100%', aspectRatio:'16/9',
              borderRadius:8, border:'none' }} allowFullScreen title="Video" />
          </div>
        )}
    </div>
  )
}

// ── BEAT THE BOMB ──
function BombSlide({ left, btbSecs, slide, showAns }) {
  const urgent = left <= 10
  const chain = slide?.btbChain || ''

  return (
    <div style={{ width:'100%', maxWidth:1100, flex:1, display:'flex', flexDirection:'column' }}>
      <div style={{ fontFamily:"'Syne', sans-serif", fontSize:'clamp(22px,4vw,48px)', fontWeight:800, color:'#f87171', textAlign:'center', marginBottom:4 }}>💣 BEAT THE BOMB 💣</div>
      <div style={{ fontFamily:'monospace', fontSize:'clamp(54px,10vw,110px)', fontWeight:800, textAlign:'center', lineHeight:1, marginBottom:10, color:urgent?'#f87171':'#a78bfa', animation:urgent?'pulse .4s infinite':'none' }}>
        {left<=0?'💥 TIME\'S UP!':left}
      </div>

      {/* Chain challenge */}
      {chain && (
        <div style={{ background:'rgba(167,139,250,.12)', border:'2px solid rgba(167,139,250,.4)', borderRadius:16, padding:'16px 24px', marginBottom:12, textAlign:'center', flexShrink:0 }}>
          <div style={{ color:'#a78bfa', fontSize:11, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:8 }}>⛓ CHAIN CHALLENGE</div>
          <div style={{ color:'#e0e7ff', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(14px,2vw,24px)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{chain}</div>
        </div>
      )}

      {slide && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, flex:1, minHeight:0 }}>
          {[
            {l:'⚡ Standard Challenge',q:slide.btbEasy,c:'#059669',bg:'rgba(5,150,105,.08)',b:'rgba(5,150,105,.4)'},
            {l:'💀 Elite Challenge',q:slide.btbHard,c:'#dc2626',bg:'rgba(220,38,38,.08)',b:'rgba(220,38,38,.4)'}
          ].map(s => (
            <div key={s.l} style={{ background:s.bg, border:`2px solid ${s.b}`, borderRadius:16, padding:'18px 22px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:11, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:s.c, marginBottom:12 }}>{s.l}</div>
              <div style={{ color:'#e0e7ff', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(13px,1.8vw,24px)', lineHeight:1.5, flex:1, whiteSpace:'pre-wrap' }}>{s.q}</div>
              {showAns && <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid rgba(255,255,255,.15)', fontSize:12, color:'rgba(224,231,255,.5)' }}>Discuss with class →</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
