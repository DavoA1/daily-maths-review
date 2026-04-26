import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.jsx'

const channel = new BroadcastChannel('dmr_student_view')

// Assign a mix of presentation types to a set of questions
function assignPresentationTypes(questions) {
  if (!questions.length) return []
  // Pick 3-5 questions, mix of types
  const pick = questions.slice(0, Math.min(5, questions.length))
  return pick.map((q, i) => {
    const base = q.question_type || q.type || 'std'
    // Assign presentation mode
    let mode = 'whiteboard'
    if (base === 'tf') mode = 'tf'
    else if (base === 'mc') mode = 'mc'
    else if (i === 0 && pick.length >= 3) mode = 'verbal' // first Q verbal to warm up
    else if (i % 3 === 2) mode = 'tf_custom' // every 3rd, do a class T/F
    return { ...q, presentMode: mode }
  })
}

const MODE_CONFIG = {
  whiteboard: { label: '📝 Whiteboard', colour: 'var(--acc)', desc: 'Students write answer on mini-whiteboard, hold up on signal' },
  verbal:     { label: '🗣 Verbal', colour: 'var(--blu)', desc: 'Students respond verbally — cold call or think-pair-share' },
  tf:         { label: '👍 True / False', colour: 'var(--grn)', desc: 'Students hold up thumbs up (True) or thumbs down (False)' },
  tf_custom:  { label: '👍 True / False', colour: 'var(--grn)', desc: 'Students hold up thumbs up (True) or thumbs down (False)' },
  mc:         { label: '🃏 Multiple Choice', colour: 'var(--pur)', desc: 'Students hold up A/B/C/D card or show fingers' },
}

const TIER_BG = ['','rgba(74,240,160,.1)','rgba(74,200,240,.1)','rgba(240,148,74,.1)','rgba(240,74,107,.1)']
const TIER_COL = ['','var(--grn)','var(--blu)','var(--org)','var(--red)']
const TIER_FULL = ['','Foundation','Core','Extension','Challenge']

export default function Present() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const allSlides = state?.slides || []
  const timerSecs = state?.timerSecs || 15
  const btbSecs = state?.btbSecs || 90

  const [slideIdx, setSlideIdx] = useState(0)   // which skill/slide group
  const [qIdx, setQIdx] = useState(0)            // which question within the group
  const [showAns, setShowAns] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timerSecs)
  const [bombLeft, setBombLeft] = useState(btbSecs)
  const [ratings, setRatings] = useState({})
  const [studentWin, setStudentWin] = useState(null)
  const [sequences, setSequences] = useState([]) // per-slide question sequences
  const timerRef = useRef(null)
  const bombRef = useRef(null)

  const isBomb = slideIdx >= allSlides.length
  const totalSlides = allSlides.length + 1

  // Build question sequences for all slides on mount
  useEffect(() => {
    if (!allSlides.length) { navigate('/generate'); return }
    const seqs = allSlides.map(slide => {
      if (slide.isWC) return [{ ...(slide.questions[0] || {}), presentMode: 'whiteboard' }]
      return assignPresentationTypes(slide.questions)
    })
    setSequences(seqs)
    startTimer(timerSecs)
    return () => { clearInterval(timerRef.current); clearInterval(bombRef.current) }
  }, [])

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

  // Current question
  const currentSeq = sequences[slideIdx] || []
  const currentQ = currentSeq[qIdx] || null
  const currentSlide = !isBomb ? allSlides[slideIdx] : null

  function nextQ() {
    clearInterval(timerRef.current)
    setShowAns(false)
    if (qIdx < currentSeq.length - 1) {
      // Next question in same slide
      setQIdx(q => q + 1)
      startTimer(timerSecs)
      pushToStudent(slideIdx, qIdx + 1, false)
    } else {
      // Move to next slide
      nextSlide()
    }
  }

  function prevQ() {
    clearInterval(timerRef.current)
    setShowAns(false)
    if (qIdx > 0) {
      setQIdx(q => q - 1)
      startTimer(timerSecs)
      pushToStudent(slideIdx, qIdx - 1, false)
    } else if (slideIdx > 0) {
      const prevSeq = sequences[slideIdx - 1] || []
      setSlideIdx(s => s - 1)
      setQIdx(prevSeq.length - 1)
      startTimer(timerSecs)
    }
  }

  function nextSlide() {
    clearInterval(timerRef.current)
    clearInterval(bombRef.current)
    setShowAns(false)
    setQIdx(0)
    if (slideIdx < totalSlides - 1) {
      const next = slideIdx + 1
      setSlideIdx(next)
      if (next >= allSlides.length) startBomb()
      else startTimer(timerSecs)
      pushToStudent(next, 0, false)
    }
  }

  function goSlide(si) {
    clearInterval(timerRef.current)
    clearInterval(bombRef.current)
    setShowAns(false); setQIdx(0); setSlideIdx(si)
    if (si >= allSlides.length) startBomb()
    else startTimer(timerSecs)
    pushToStudent(si, 0, false)
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
        bomb: { easy: last?.btbEasy || '', hard: last?.btbHard || '' } })
      return
    }
    const slide = allSlides[si]
    const seq = sequences[si] || assignPresentationTypes(slide?.questions || [])
    const q = seq[qi] || seq[0] || {}
    const qtext = q.question_text || q.q || ''
    const atext = q.answer_text || q.a || ''
    const mode = q.presentMode || 'whiteboard'
    channel.postMessage({
      type: 'slide', isBomb: false, showAns: ans,
      skill: slide?.skill?.skill_name, topic: slide?.skill?.topic,
      year: slide?.skill?.year_level, strand: slide?.skill?.strand,
      qtext, atext, mode,
      tier: q.tier || 1, qtype: q.question_type || q.type || 'std',
      qNum: qi + 1, qTotal: seq.length,
      slideNum: si + 1, slideTotal: allSlides.length
    })
  }

  function openStudentView() {
    const url = window.location.origin + '/student'
    const win = window.open(url, 'DMR_Student', 'width=1280,height=720,menubar=no,toolbar=no,location=no')
    setStudentWin(win)
    setTimeout(() => pushToStudent(slideIdx, qIdx, showAns), 1000)
  }

  function rateSkill(skillName, rating) {
    setRatings(r => ({ ...r, [skillName]: rating }))
    const sl = allSlides[slideIdx]
    if (sl?.classSkill?.id) {
      const history = sl.classSkill.rating_history || []
      history.push({ date: new Date().toISOString(), rating })
      const mastery = rating <= 2 ? Math.max(1, (sl.classSkill.mastery||1)-1)
                    : rating >= 4 ? Math.min(7, (sl.classSkill.mastery||1)+1)
                    : sl.classSkill.mastery || 1
      supabase.from('class_skills').update({ mastery, last_reviewed: new Date().toISOString(), rating_history: history }).eq('id', sl.classSkill.id).then(() => {})
    }
  }

  function exitPresent() {
    clearInterval(timerRef.current); clearInterval(bombRef.current)
    channel.postMessage({ type: 'close' })
    if (studentWin && !studentWin.closed) studentWin.close()
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
  }, [slideIdx, qIdx, showAns, sequences])

  if (!allSlides.length || !sequences.length) return null

  const urgent = timeLeft <= 5 && timeLeft > 0
  const modeConfig = currentQ ? (MODE_CONFIG[currentQ.presentMode] || MODE_CONFIG.whiteboard) : MODE_CONFIG.whiteboard

  return (
    <div style={{ position:'fixed', inset:0, background:'var(--bg)', zIndex:2000, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Progress bar */}
      <div style={{ height:3, background:'var(--b1)', flexShrink:0 }}>
        <div style={{ height:'100%', background:'var(--acc)', width:`${(slideIdx/totalSlides)*100}%`, transition:'width .3s ease' }} />
      </div>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', padding:'8px 18px', background:'rgba(8,9,13,.92)', borderBottom:'1px solid var(--b1)', flexShrink:0, gap:10, flexWrap:'wrap' }}>
        {/* Slide info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:12, fontWeight:700, color:'var(--tm)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {isBomb ? '💣 BEAT THE BOMB' : `${currentSlide?.skill?.skill_name || ''}`}
          </div>
          {!isBomb && currentQ && (
            <div style={{ fontSize:10, color:'var(--tm)', marginTop:1 }}>
              Slide {slideIdx+1}/{allSlides.length} · Q{qIdx+1}/{currentSeq.length}
            </div>
          )}
        </div>

        {/* Mode badge */}
        {!isBomb && currentQ && (
          <div style={{ padding:'5px 12px', borderRadius:'var(--rs)', border:`1px solid ${modeConfig.colour}`, background:`${modeConfig.colour}20`, color:modeConfig.colour, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
            {modeConfig.label}
          </div>
        )}

        {/* Timer */}
        <div style={{ fontFamily:'var(--font-mono)', fontSize:24, fontWeight:700, color:urgent?'var(--red)':(isBomb?'var(--red)':(timeLeft<=10?'var(--org)':' var(--acc)')), minWidth:52, textAlign:'center', animation:urgent?'pulse .5s infinite':'none' }}>
          {isBomb ? `${bombLeft}s` : `${timeLeft}s`}
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {[
            { l:'← Prev', fn:prevQ, dis:slideIdx===0&&qIdx===0 },
            { l:showAns?'🙈 Hide':'👁 Reveal', fn:toggleAns, acc:true },
            { l:'Next →', fn:nextQ, dis:isBomb },
            { l:'📺 Student', fn:openStudentView, grn:true },
            { l:'✕ Exit', fn:exitPresent, red:true },
          ].map(b => (
            <button key={b.l} onClick={b.fn} disabled={b.dis}
              style={{ padding:'6px 11px', borderRadius:'var(--rs)', fontSize:11, fontWeight:b.acc?700:500, cursor:'pointer', border:'1px solid',
                borderColor:b.acc?'var(--acc)':b.red?'var(--red)':b.grn?'var(--grn)':' var(--b2)',
                background:b.acc?'rgba(240,228,74,.12)':b.grn?'rgba(74,240,160,.12)':' transparent',
                color:b.acc?'var(--acc)':b.red?'var(--red)':b.grn?'var(--grn)':' var(--tm)',
                opacity:b.dis?.4:1, transition:'all .15s' }}>
              {b.l}
            </button>
          ))}
        </div>
      </div>

      {/* Question progress within slide */}
      {!isBomb && currentSeq.length > 1 && (
        <div style={{ display:'flex', gap:3, padding:'6px 18px', background:'var(--s1)', borderBottom:'1px solid var(--b1)', flexShrink:0 }}>
          {currentSeq.map((q, i) => {
            const mc = MODE_CONFIG[q.presentMode] || MODE_CONFIG.whiteboard
            return (
              <div key={i} onClick={() => { setQIdx(i); setShowAns(false); startTimer(timerSecs); pushToStudent(slideIdx,i,false) }}
                style={{ flex:1, height:28, borderRadius:'var(--rs)', border:`1px solid ${i===qIdx?mc.colour:'var(--b2)'} `, background:i===qIdx?`${mc.colour}18`:'var(--s2)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:5, cursor:'pointer', transition:'all .15s', fontSize:10 }}>
                <span style={{ color:i===qIdx?mc.colour:'var(--tm)', fontWeight:i===qIdx?700:400 }}>
                  {mc.label.split(' ')[0]} Q{i+1}
                </span>
                {i < qIdx && <span style={{ fontSize:9, color:'var(--grn)' }}>✓</span>}
              </div>
            )
          })}
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', padding:'12px 20px 6px', alignItems:'center', minHeight:0 }}>
        {isBomb ? (
          <BombSlide left={bombLeft} btbSecs={btbSecs} slide={allSlides[allSlides.length-1]} showAns={showAns} />
        ) : currentSlide?.isWC ? (
          <WCSlide slide={currentSlide} showAns={showAns} q={currentQ} />
        ) : (
          <SingleQSlide slide={currentSlide} q={currentQ} showAns={showAns} modeConfig={modeConfig} qNum={qIdx+1} qTotal={currentSeq.length} />
        )}

        {/* Check-in strip */}
        {!isBomb && qIdx === currentSeq.length - 1 && (
          <div style={{ width:'100%', maxWidth:1100, marginTop:8, marginBottom:6, padding:'8px 14px', background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:'var(--r)', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', flexShrink:0 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:10, fontWeight:700, color:'var(--tm)', whiteSpace:'nowrap' }}>Class understanding:</span>
            <div className="rating-row">
              {[{v:1,l:'😕 Most lost'},{v:2,l:'🤔 Struggling'},{v:3,l:'😐 Mixed'},{v:4,l:'🙂 Good'},{v:5,l:'✅ Got it!'}].map(r => (
                <button key={r.v} className={`r-btn r${r.v}${ratings[currentSlide?.skill?.skill_name]===r.v?' sel':''}`}
                  onClick={() => rateSkill(currentSlide?.skill?.skill_name, r.v)}>{r.l}</button>
              ))}
            </div>
            {ratings[currentSlide?.skill?.skill_name] && <span style={{ fontSize:11, color:'var(--grn)', fontWeight:600 }}>✓ Rated {ratings[currentSlide?.skill?.skill_name]}/5</span>}
          </div>
        )}

        {/* Slide dots */}
        <div style={{ display:'flex', gap:5, paddingBottom:6, flexShrink:0 }}>
          {Array.from({ length:totalSlides }, (_,i) => (
            <div key={i} onClick={() => goSlide(i)}
              style={{ width:7, height:7, borderRadius:'50%', cursor:'pointer', transition:'all .2s',
                transform:i===slideIdx?'scale(1.4)':'scale(1)', background:i===slideIdx?'var(--acc)':'var(--b2)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SINGLE QUESTION SLIDE (main format) ──
function SingleQSlide({ slide, q, showAns, modeConfig, qNum, qTotal }) {
  if (!slide || !q) return null
  const sk = slide.skill || {}
  const tier = q.tier || 1
  const qtext = q.question_text || q.q || ''
  const atext = q.answer_text || q.a || ''

  const isTF = q.presentMode === 'tf' || q.presentMode === 'tf_custom' || (q.question_type||q.type) === 'tf'
  const isMC = q.presentMode === 'mc' || (q.question_type||q.type) === 'mc'

  return (
    <div style={{ width:'100%', maxWidth:1000, display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
      {/* Skill header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexShrink:0 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(13px,1.5vw,18px)', fontWeight:800, color:'var(--acc)' }}>{sk.skill_name}</div>
        <div style={{ height:1, flex:1, background:'var(--b1)' }} />
        <span style={{ fontSize:10, color:'var(--tm)' }}>{sk.topic} · Yr {sk.year_level}</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, padding:'2px 6px', border:'1px solid var(--b1)', borderRadius:3, color:'var(--tm)' }}>
          T{tier} · {['',"Foundation","Core","Extension","Challenge"][tier]}
        </span>
      </div>

      {/* Mode instruction banner */}
      <div style={{ padding:'8px 16px', borderRadius:'var(--rs)', border:`1px solid ${modeConfig.colour}30`, background:`${modeConfig.colour}10`, marginBottom:12, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:12, fontWeight:700, color:modeConfig.colour }}>{modeConfig.label}</span>
        <span style={{ fontSize:11, color:'var(--tm)' }}>{modeConfig.desc}</span>
      </div>

      {/* The question — big and central */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:0 }}>
        <div style={{ background:'var(--s1)', border:`2px solid ${TIER_BG[tier].replace('.1','.35')}`, borderRadius:'var(--r)',
          padding:'clamp(20px,3vw,40px) clamp(24px,4vw,56px)', width:'100%', textAlign:'center', maxHeight:'100%', overflow:'auto' }}>

          {/* T/F layout */}
          {isTF && !showAns && (
            <div style={{ display:'flex', justifyContent:'center', gap:'clamp(20px,5vw,60px)', marginBottom:16 }}>
              {[{l:'👍 TRUE',c:'var(--grn)'},{l:'👎 FALSE',c:'var(--red)'}].map(tf => (
                <div key={tf.l} style={{ padding:'12px 28px', borderRadius:'var(--r)', border:`2px solid ${tf.c}40`, background:`${tf.c}12`, fontFamily:'var(--font-display)', fontSize:'clamp(16px,2vw,24px)', fontWeight:800, color:tf.c }}>{tf.l}</div>
              ))}
            </div>
          )}

          <div style={{ fontFamily:'var(--font-mono)', fontSize:'clamp(16px,2.8vw,36px)', lineHeight:1.55, whiteSpace:'pre-wrap', color:'var(--tx)' }}>{qtext}</div>

          {/* MC options formatted */}
          {isMC && !showAns && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:20, textAlign:'left' }}>
              {(qtext.match(/[A-D]\).+/g)||[]).map((opt,i) => (
                <div key={i} style={{ padding:'10px 14px', background:'var(--s2)', borderRadius:'var(--rs)', border:'1px solid var(--b2)', fontFamily:'var(--font-mono)', fontSize:'clamp(13px,1.8vw,20px)' }}>{opt}</div>
              ))}
            </div>
          )}

          {showAns && (
            <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--b1)', fontFamily:'var(--font-mono)', fontSize:'clamp(14px,2.2vw,28px)', color:'var(--grn)' }}>
              → {atext}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── WHOLE CLASS SLIDE ──
function WCSlide({ slide, showAns, q }) {
  const [showSteps, setShowSteps] = useState(false)
  if (!slide || !q) return null
  const qtext = q.question_text || q.q || ''
  const atext = q.answer_text || q.a || ''
  return (
    <div style={{ width:'100%', maxWidth:1000, display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexShrink:0 }}>
        <span style={{ color:'var(--pur)', fontSize:10, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase' }}>🎯 Whole-Class</span>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(14px,1.8vw,22px)', fontWeight:800, color:'var(--pur)' }}>{slide.skill?.skill_name}</div>
        <button onClick={() => setShowSteps(s=>!s)} style={{ marginLeft:'auto', padding:'4px 12px', border:'1px solid var(--pur)', borderRadius:'var(--rs)', background:showSteps?'rgba(160,74,240,.15)':'transparent', color:'var(--pur)', fontSize:11, cursor:'pointer' }}>
          {showSteps ? '🙈 Hide steps' : '📋 Teacher steps'}
        </button>
      </div>
      <div style={{ display:'flex', gap:14, flex:1, minHeight:0, overflow:'hidden' }}>
        <div style={{ flex:showSteps?'0 0 55%':1, background:'var(--s1)', border:'2px solid rgba(160,74,240,.35)', borderRadius:'var(--r)', padding:'24px 32px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'clamp(16px,2.5vw,32px)', lineHeight:1.5, whiteSpace:'pre-wrap', flex:1 }}>{qtext}</div>
          {showAns && <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid var(--b1)', fontFamily:'var(--font-mono)', fontSize:'clamp(13px,2vw,24px)', color:'var(--grn)' }}>→ {atext}</div>}
        </div>
        {showSteps && (
          <div style={{ flex:'0 0 43%', background:'rgba(160,74,240,.06)', border:'1px solid rgba(160,74,240,.25)', borderRadius:'var(--r)', padding:'16px 18px', overflowY:'auto' }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', color:'var(--pur)', marginBottom:10 }}>📋 Steps</div>
            <div style={{ fontSize:13, color:'var(--td)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{generateSteps(slide.skill?.skill_name)}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function generateSteps(skillName) {
  if (!skillName) return '1. State the key rule or formula\n2. Show what is given\n3. Work through step by step\n4. State the answer clearly\n5. Check it makes sense'
  const map = {
    'Gradient': '1. Gradient = rise ÷ run = (y₂-y₁) ÷ (x₂-x₁)\n2. Identify two points\n3. Sub into formula\n4. Simplify the fraction\n5. Write equation y = mx + c',
    'substitution': '1. Make one variable the subject\n2. Substitute into the other equation\n3. Solve for the first variable\n4. Sub back to find the second\n5. Check in BOTH equations',
    'Index': 'Multiplication: add indices\nDivision: subtract indices\nPower of power: multiply\nZero index: = 1\nNegative index: reciprocal',
    'Pythagoras': '1. Identify the right angle\n2. Label hypotenuse (c, opposite right angle)\n3. a² + b² = c²\n4. Sub in known values\n5. Square root both sides',
    'trig': '1. Label O, A, H relative to the angle\n2. Choose SOH, CAH or TOA\n3. Write the equation\n4. Solve for the unknown\n5. Use inverse for angles',
    'Factoris': '1. Check for common factor first\n2. Find two numbers: multiply to c, add to b\n3. Write as (x + p)(x + q)\n4. Check by expanding',
    'interest': 'SI: I = Prt, A = P(1+rt)\nCI: A = P(1+r)ⁿ\nCI always > SI for same r, n>1',
    'parabola': '1. Vertex: x = -b/2a, find y\n2. y-intercept: x = 0\n3. x-intercepts: y = 0\n4. Direction: a>0 opens up',
  }
  for (const [k,v] of Object.entries(map)) {
    if (skillName.toLowerCase().includes(k.toLowerCase())) return v
  }
  return '1. Recall the key rule\n2. Identify what is given\n3. Identify what to find\n4. Show clear working\n5. Check your answer'
}

// ── BOMB SLIDE ──
function BombSlide({ left, btbSecs, slide, showAns }) {
  const urgent = left <= 10
  return (
    <div style={{ width:'100%', maxWidth:1100, flex:1, display:'flex', flexDirection:'column' }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,4vw,46px)', fontWeight:800, color:'var(--red)', textAlign:'center', marginBottom:4 }}>💣 BEAT THE BOMB 💣</div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:'clamp(54px,10vw,108px)', fontWeight:800, textAlign:'center', lineHeight:1, marginBottom:12,
        color:urgent?'var(--red)':'var(--acc)', animation:urgent?'pulse .4s infinite':'none' }}>
        {left<=0?'💥 TIME\'S UP!':left}
      </div>
      {slide && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, flex:1, minHeight:0 }}>
          {[{l:'⚡ Standard',q:slide.btbEasy,c:'grn',bg:'rgba(74,240,160,.06)',b:'rgba(74,240,160,.3)'},
            {l:'💀 Elite',q:slide.btbHard,c:'red',bg:'rgba(240,74,107,.06)',b:'rgba(240,74,107,.3)'}].map(s => (
            <div key={s.l} style={{ background:s.bg, border:`2px solid ${s.b}`, borderRadius:'var(--r)', padding:'20px 24px', display:'flex', flexDirection:'column' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:10, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:`var(--${s.c})`, marginBottom:12 }}>{s.l}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'clamp(13px,2vw,26px)', lineHeight:1.5, flex:1 }}>{s.q}</div>
              {showAns && <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid var(--b1)', fontSize:12, color:'var(--tm)' }}>Discuss →</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
