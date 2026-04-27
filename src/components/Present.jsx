import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.jsx'

const channel = new BroadcastChannel('dmr_student_view')

const TIER_LABELS = ['','Foundation','Core','Extension','Challenge']
const TIER_COLS = ['','#16a34a','#2563eb','#d97706','#dc2626']
const TIER_BG   = ['','#f0fdf4','#eff6ff','#fffbeb','#fef2f2']
const TIER_BORDER=['','#86efac','#93c5fd','#fcd34d','#fca5a5']

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
  const allSlides = state?.slides || []
  const timerSecs = state?.timerSecs || 20
  const btbSecs = state?.btbSecs || 90

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
  const timerRef = useRef(null)
  const bombRef = useRef(null)

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
    return () => { clearInterval(timerRef.current); clearInterval(bombRef.current) }
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
      slideMode: slide?.isSpotlight ? 'single' : (slide?.isBank && !slide?.singleMode) ? 'tiered' : slide?.singleMode ? 'single' : 'tiered',
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
      else if (e.key === 'Escape') exitPresent()
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
            { l:'📺 Student View', fn:openStudentView, col:'#34d399' },
            { l:'✕ Exit', fn:exitPresent, col:'#f87171' },
          ].map(b => (
            <button key={b.l} onClick={b.fn} disabled={b.dis}
              style={{ padding:'5px 11px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', border:`1px solid ${b.col||'rgba(255,255,255,.2)'}`, background:'rgba(0,0,0,.3)', color:b.col||'rgba(224,231,255,.7)', opacity:b.dis?.4:1, transition:'all .15s' }}>
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
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', padding:'12px 18px 6px', alignItems:'center', minHeight:0 }}>
        {isBomb
          ? <BombSlide left={bombLeft} btbSecs={btbSecs} slide={allSlides[allSlides.length-1]} showAns={showAns} />
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
        <div style={{ display:'flex', gap:4, paddingBottom:6, flexShrink:0 }}>
          {Array.from({length:totalSlides},(_,i) => (
            <div key={i} onClick={() => goToSlide(i)}
              style={{ width:7, height:7, borderRadius:'50%', cursor:'pointer', transition:'all .2s', transform:i===slideIdx?'scale(1.4)':'scale(1)', background:i===slideIdx?'#a78bfa':'rgba(255,255,255,.25)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TIERED SLIDE (main format — 10-20 questions in rows by tier) ──
function TieredSlide({ slide, showAns }) {
  if (!slide) return null
  const sk = slide.skill || {}
  const byTier = {1:[],2:[],3:[],4:[]}
  ;(slide.questions || []).forEach(q => { if(byTier[q.tier]) byTier[q.tier].push(q) })

  return (
    <div style={{ width:'100%', maxWidth:1400, display:'flex', flexDirection:'column', flex:1, minHeight:0, overflow:'hidden' }}>
      {/* Skill header */}
      <div style={{ textAlign:'center', marginBottom:8, flexShrink:0 }}>
        <div style={{ color:'#e0e7ff', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'clamp(16px,2vw,26px)' }}>{sk.skill_name}</div>
        <div style={{ color:'rgba(224,231,255,.5)', fontSize:11, marginTop:2 }}>{sk.topic} · {sk.strand} · {sk.year_level==='F'?'Foundational':`Year ${sk.year_level}`}</div>
      </div>

      {/* Tier rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:6, flex:1, minHeight:0, overflow:'hidden' }}>
        {[1,2,3,4].map(t => {
          const qs = byTier[t]
          if (!qs.length) return null
          return (
            <div key={t} style={{ display:'flex', gap:6, flex:1, minHeight:0, overflow:'hidden' }}>
              {/* Tier label */}
              <div style={{ background:TIER_BG[t], border:`1px solid ${TIER_BORDER[t]}`, color:TIER_COLS[t], padding:'4px 8px', borderRadius:8, fontSize:11, fontWeight:800, letterSpacing:'.05em', writingMode:'vertical-rl', transform:'rotate(180deg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, minWidth:30, textTransform:'uppercase' }}>
                T{t} {TIER_LABELS[t]}
              </div>
              {/* Questions */}
              <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(qs.length, qs.length<=4?qs.length:qs.length<=8?Math.ceil(qs.length/2):Math.ceil(qs.length/3))}, 1fr)`, gap:5, flex:1, minHeight:0, overflow:'hidden' }}>
                {qs.map((q,qi) => {
                  const qt = q.question_text || q.q || ''
                  const at = q.answer_text || q.a || ''
                  const img = q.image_url || ''
                  return (
                    <div key={qi} style={{ background:'rgba(255,255,255,.95)', border:`1.5px solid ${TIER_BORDER[t]}`, borderRadius:8, padding:'7px 10px', display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0 }}>
                      {/* Question number */}
                      <div style={{ color:TIER_COLS[t], fontSize:10, fontWeight:800, marginBottom:3, letterSpacing:'.05em' }}>{t}.{qi+1}</div>
                      {/* Question image */}
                      {img && <img src={img} alt="" style={{ maxHeight:60, objectFit:'contain', marginBottom:4, borderRadius:4 }} />}
                      {/* Question text */}
                      <div style={{ color:'#1e293b', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(10px,1.1vw,14px)', lineHeight:1.45, flex:1, overflow:'hidden', whiteSpace:'pre-wrap' }}>
                        {qt}
                      </div>
                      {/* Answer */}
                      {showAns && (
                        <div style={{ color:'#166534', fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(9px,0.9vw,12px)', borderTop:`1px solid ${TIER_BORDER[t]}`, paddingTop:3, marginTop:3 }}>
                          → {at}
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
