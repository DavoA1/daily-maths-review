import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.jsx'

const TIER_HDR = ['','T1 · Foundation','T2 · Core','T3 · Extension','T4 · Challenge']
const TIER_CLS = ['','t1','t2','t3','t4']
const TIER_BG  = ['','rgba(74,240,160,.1)','rgba(74,200,240,.1)','rgba(240,148,74,.1)','rgba(240,74,107,.1)']
const channel  = new BroadcastChannel('dmr_student_view')

export default function Present() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const slides = state?.slides || []
  const timerSecs = state?.timerSecs || 15
  const btbSecs = state?.btbSecs || 90
  const isBomb = idx => idx >= slides.length

  const [idx, setIdx] = useState(0)
  const [showAns, setShowAns] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timerSecs)
  const [bombLeft, setBombLeft] = useState(btbSecs)
  const [ratings, setRatings] = useState({})
  const [studentWin, setStudentWin] = useState(null)
  const timerRef = useRef(null)
  const bombRef  = useRef(null)

  const totalSlides = slides.length + 1 // +1 for bomb

  function startTimer(secs) {
    clearInterval(timerRef.current)
    setTimeLeft(secs)
    timerRef.current = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000)
  }
  function startBomb() {
    clearInterval(bombRef.current)
    setBombLeft(btbSecs)
    bombRef.current = setInterval(() => setBombLeft(t => t > 0 ? t - 1 : 0), 1000)
  }

  useEffect(() => {
    if (!slides.length) { navigate('/generate'); return }
    goToSlide(0)
    return () => { clearInterval(timerRef.current); clearInterval(bombRef.current) }
  }, [])

  function goToSlide(i) {
    clearInterval(timerRef.current)
    clearInterval(bombRef.current)
    setIdx(i)
    setShowAns(false)
    if (i >= slides.length) { startBomb() }
    else { startTimer(timerSecs) }
    pushToStudent(i, false)
  }
  function next() { if (idx < totalSlides - 1) goToSlide(idx + 1) }
  function prev() { if (idx > 0) goToSlide(idx - 1) }

  function toggleAns() {
    setShowAns(a => {
      pushToStudent(idx, !a)
      return !a
    })
  }

  function pushToStudent(slideIdx, ans) {
    const data = buildStudentPayload(slideIdx, ans)
    channel.postMessage(data)
  }

  function buildStudentPayload(slideIdx, ans) {
    if (slideIdx >= slides.length) {
      const last = slides[slides.length - 1]
      return { type: 'slide', isBomb: true, showAns: ans, btbSecs,
        bomb: { easy: last?.btbEasy || '', hard: last?.btbHard || '' },
        slideNum: slideIdx + 1, total: totalSlides }
    }
    const sl = slides[slideIdx]
    const byTier = {1:[],2:[],3:[],4:[]}
    sl.questions.forEach(q => { if (byTier[q.tier]) byTier[q.tier].push(q) })
    return { type: 'slide', isBomb: false, showAns: ans,
      skill: sl.skill?.skill_name, topic: sl.skill?.topic, strand: sl.skill?.strand,
      year: sl.skill?.year_level, isWC: sl.isWC,
      wcQ: sl.isWC ? (sl.questions[0]?.question_text || '') : null,
      wcA: sl.isWC ? (sl.questions[0]?.answer_text || '') : null,
      byTier, slideNum: slideIdx + 1, total: totalSlides }
  }

  function openStudentView() {
    const url = window.location.origin + '/student'
    const win = window.open(url, 'DMR_Student', 'width=1280,height=720,menubar=no,toolbar=no,location=no')
    setStudentWin(win)
    setTimeout(() => pushToStudent(idx, showAns), 1200)
  }

  function rateSkill(skillName, rating) {
    setRatings(r => ({ ...r, [skillName]: rating }))
    // Save to Supabase
    const sl = slides[idx]
    if (sl?.classSkill?.id) {
      const history = sl.classSkill.rating_history || []
      history.push({ date: new Date().toISOString(), rating })
      const mastery = rating <= 2 ? Math.max(1, (sl.classSkill.mastery||1)-1)
                    : rating >= 4 ? Math.min(7, (sl.classSkill.mastery||1)+1)
                    : sl.classSkill.mastery || 1
      supabase.from('class_skills').update({
        mastery, last_reviewed: new Date().toISOString(),
        rating_history: history
      }).eq('id', sl.classSkill.id).then(() => {})
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
      if (e.key === 'ArrowRight' || e.key === ' ') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key.toLowerCase() === 'a') toggleAns()
      else if (e.key === 'Escape') exitPresent()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, showAns])

  const isOnBomb = isBomb(idx)
  const slide = !isOnBomb ? slides[idx] : null
  const urgent = timeLeft <= 5 && timeLeft > 0

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 2000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--b1)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: 'var(--acc)', width: `${(idx / totalSlides) * 100}%`, transition: 'width .3s ease' }} />
      </div>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px', background: 'rgba(8,9,13,.9)', borderBottom: '1px solid var(--b1)', flexShrink: 0, gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--tm)', flex: 1 }}>
          {isOnBomb ? '💣 BEAT THE BOMB' : `Slide ${idx+1}/${totalSlides} · ${slide?.skill?.skill_name}`}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: urgent ? 'var(--red)' : 'var(--acc)', animation: urgent ? 'pulse .5s infinite' : 'none', minWidth: 56, textAlign: 'center' }}>
          {isOnBomb ? `${bombLeft}s` : `${timeLeft}s`}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: '← Prev', onClick: prev, disabled: idx === 0 },
            { label: showAns ? '🙈 Hide' : '👁 Reveal', onClick: toggleAns, accent: true },
            { label: 'Next →', onClick: next, disabled: idx === totalSlides-1 },
            { label: '📺 Student View', onClick: openStudentView, green: true },
            { label: '✕ Exit', onClick: exitPresent, red: true },
          ].map(b => (
            <button key={b.label} onClick={b.onClick} disabled={b.disabled} style={{
              padding: '6px 12px', borderRadius: 'var(--rs)', fontSize: 11, fontWeight: b.accent ? 700 : 500,
              cursor: 'pointer', border: '1px solid',
              borderColor: b.accent ? 'var(--acc)' : b.red ? 'var(--red)' : b.green ? 'var(--grn)' : 'var(--b2)',
              background: b.accent ? 'rgba(240,228,74,.12)' : b.green ? 'rgba(74,240,160,.12)' : 'transparent',
              color: b.accent ? 'var(--acc)' : b.red ? 'var(--red)' : b.green ? 'var(--grn)' : 'var(--tm)',
              opacity: b.disabled ? 0.4 : 1, transition: 'all .15s'
            }}>{b.label}</button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isOnBomb ? <BombSlide left={bombLeft} btbSecs={btbSecs} slide={slides[slides.length-1]} showAns={showAns} />
          : slide?.isWC ? <WCSlide slide={slide} showAns={showAns} />
          : <TieredSlide slide={slide} showAns={showAns} />}

        {/* Check-in strip */}
        {!isOnBomb && (
          <div style={{ width: '100%', maxWidth: 1240, marginTop: 8, marginBottom: 10, padding: '8px 14px', background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, color: 'var(--tm)', whiteSpace: 'nowrap' }}>Class rating:</span>
            <div className="rating-row">
              {[{v:1,l:'😕 Most lost'},{v:2,l:'🤔 Struggling'},{v:3,l:'😐 Mixed'},{v:4,l:'🙂 Good'},{v:5,l:'✅ Got it!'}].map(r => (
                <button key={r.v} className={`r-btn r${r.v}${ratings[slide?.skill?.skill_name] === r.v ? ' sel' : ''}`}
                  onClick={() => rateSkill(slide?.skill?.skill_name, r.v)}>
                  {r.l}
                </button>
              ))}
            </div>
            {ratings[slide?.skill?.skill_name] && <span style={{ fontSize: 11, color: 'var(--grn)', fontWeight: 600 }}>✓ Rated {ratings[slide?.skill?.skill_name]}/5</span>}
          </div>
        )}

        {/* Dots */}
        <div style={{ display: 'flex', gap: 5, paddingBottom: 8, flexShrink: 0 }}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <div key={i} onClick={() => goToSlide(i)}
              style={{ width: 7, height: 7, borderRadius: '50%', cursor: 'pointer', transition: 'all .2s', transform: i === idx ? 'scale(1.4)' : 'scale(1)', background: i === idx ? 'var(--acc)' : 'var(--b2)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TieredSlide({ slide, showAns }) {
  if (!slide) return null
  const sk = slide.skill || {}
  const byTier = {1:[],2:[],3:[],4:[]}
  slide.questions.forEach(q => { if (byTier[q.tier]) byTier[q.tier].push(q) })

  return (
    <div style={{ width: '100%', maxWidth: 1240, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(14px,1.8vw,22px)', fontWeight: 800, color: 'var(--acc)', textAlign: 'center', marginBottom: 2, flexShrink: 0 }}>
        {sk.skill_name}
      </div>
      <div style={{ textAlign: 'center', color: 'var(--tm)', fontSize: 10, marginBottom: 8, flexShrink: 0 }}>
        {sk.topic} · {sk.strand} · {sk.year_level === 'F' ? 'Foundational' : `Year ${sk.year_level}`}
      </div>
      {/* Rows by tier */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {[1,2,3,4].map(t => {
          const qs = byTier[t].slice(0, 4)
          if (!qs.length) return null
          return (
            <div key={t} style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div style={{ background: TIER_BG[t], color: `var(--${['','grn','blu','org','red'][t]})`, padding: '6px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: 28 }}>
                T{t}
              </div>
              {qs.map((q, qi) => (
                <div key={qi} style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: 'var(--rs)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: `var(--${['','grn','blu','org','red'][t]})` }}>{t}.{qi+1}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px,1.1vw,15px)', lineHeight: 1.45, flex: 1, overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
                    {q.question_text || q.q}
                  </div>
                  {showAns && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px,0.9vw,13px)', color: 'var(--grn)', borderTop: '1px solid var(--b1)', paddingTop: 4, marginTop: 2 }}>→ {q.answer_text || q.a}</div>}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WCSlide({ slide, showAns }) {
  if (!slide) return null
  const q = slide.questions[0] || {}
  return (
    <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <div style={{ color: 'var(--pur)', fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 6 }}>🎯 Whole-Class Question</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,2vw,26px)', fontWeight: 800, color: 'var(--pur)', textAlign: 'center', marginBottom: 16 }}>
        {slide.skill?.skill_name}
      </div>
      <div style={{ background: 'var(--s1)', border: '2px solid rgba(160,74,240,.4)', borderRadius: 'var(--r)', padding: '28px 36px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(16px,2.5vw,28px)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{q.question_text || q.q}</div>
        {showAns && <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--b1)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(13px,2vw,22px)', color: 'var(--grn)' }}>→ {q.answer_text || q.a}</div>}
        {slide.wcExplanation && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(160,74,240,.07)', borderLeft: '3px solid var(--pur)', borderRadius: 'var(--rs)', textAlign: 'left', fontSize: 12, color: 'var(--td)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            <strong style={{ color: 'var(--pur)' }}>Steps: </strong>{slide.wcExplanation}
          </div>
        )}
      </div>
    </div>
  )
}

function BombSlide({ left, btbSecs, slide, showAns }) {
  const urgent = left <= 10
  return (
    <div style={{ width: '100%', maxWidth: 1100, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4.5vw,48px)', fontWeight: 800, color: 'var(--red)', textAlign: 'center', marginBottom: 4 }}>💣 BEAT THE BOMB 💣</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(56px,11vw,110px)', fontWeight: 800, textAlign: 'center', lineHeight: 1, marginBottom: 12, color: urgent ? 'var(--red)' : 'var(--acc)', animation: urgent ? 'pulse .4s infinite' : 'none' }}>
        {left <= 0 ? '💥 TIME\'S UP!' : `${left}`}
      </div>
      {slide && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
          {[
            { label: '⚡ Standard Challenge', q: slide.btbEasy, cls: 'grn', bg: 'rgba(74,240,160,.06)', border: 'rgba(74,240,160,.3)' },
            { label: '💀 Elite Challenge', q: slide.btbHard, cls: 'red', bg: 'rgba(240,74,107,.06)', border: 'rgba(240,74,107,.3)' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 'var(--r)', padding: '22px 26px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: `var(--${s.cls})`, marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(14px,2vw,26px)', lineHeight: 1.5, flex: 1 }}>{s.q}</div>
              {showAns && <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--b1)', fontSize: 12, color: 'var(--tm)' }}>Discuss with class →</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
