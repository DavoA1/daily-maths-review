import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

// Student-facing homework portal — no login required, just class code
export default function Homework() {
  const [step, setStep] = useState('code') // code | quiz | done
  const [code, setCode] = useState('')
  const [classInfo, setClassInfo] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [ratings, setRatings] = useState({})
  const [alias, setAlias] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function joinClass() {
    if (!code.trim()) return
    const { data, error: err } = await supabase
      .from('classes')
      .select('id,name,year_level')
      .eq('class_code', code.toUpperCase().trim())
      .single()
    if (err || !data) { setError('Class code not found. Check with your teacher.'); return }
    setClassInfo(data)
    await loadQuestions(data.id)
    setStep('quiz')
  }

  async function loadQuestions(classId) {
    // Get due skills for the class
    const { data: cs } = await supabase
      .from('class_skills')
      .select('skill_id, mastery')
      .eq('class_id', classId)
      .order('mastery')
      .limit(6)

    if (!cs?.length) { setQuestions([]); return }

    const skillIds = cs.map(c => c.skill_id)
    const { data: qs } = await supabase
      .from('questions')
      .select('*, skill:skills(skill_name, strand)')
      .in('skill_id', skillIds)
      .in('tier', [1, 2]) // Only T1 and T2 for homework
      .order('tier')

    // Pick 2-3 questions per skill, max 12 total
    const grouped = {}
    qs?.forEach(q => {
      if (!grouped[q.skill_id]) grouped[q.skill_id] = []
      if (grouped[q.skill_id].length < 3) grouped[q.skill_id].push(q)
    })
    const flat = Object.values(grouped).flat().slice(0, 12)
    setQuestions(flat)
  }

  async function submit() {
    setSubmitting(true)
    const correct = Object.entries(ratings).filter(([_, r]) => r >= 4).length
    await supabase.from('homework_sessions').insert({
      class_code: code.toUpperCase().trim(),
      student_alias: alias || 'Anonymous',
      questions_attempted: questions.length,
      questions_correct: correct,
      skill_ratings: ratings
    })
    setSubmitting(false)
    setSubmitted(true)
    setStep('done')
  }

  const RATINGS = [
    { v:1, l:'❌ Got it wrong' }, { v:2, l:'🤔 Unsure' },
    { v:3, l:'😐 Mostly right' }, { v:4, l:'✅ Correct' }, { v:5, l:'🌟 Easy!' }
  ]

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--tx)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', padding:'40px 20px', fontFamily:'var(--font-body)' }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:40 }}>
        <div style={{ width:20, height:20, background:'var(--acc)', clipPath:'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)' }} />
        <span style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:700, letterSpacing:'.2em', color:'var(--acc)', textTransform:'uppercase' }}>Daily Maths Review</span>
      </div>

      {step === 'code' && (
        <div style={{ width:'100%', maxWidth:420, animation:'rise .5s ease both' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,6vw,42px)', fontWeight:800, marginBottom:8 }}>
            Student <span style={{ color:'var(--acc)' }}>Homework</span>
          </h1>
          <p style={{ color:'var(--tm)', fontSize:13, marginBottom:32, lineHeight:1.6 }}>
            Enter your class code to access today's review questions. Your teacher will give you this code.
          </p>
          <div className="field">
            <label>Class code</label>
            <input className="input" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABC123" maxLength={8} style={{ fontFamily:'var(--font-mono)', fontSize:20, letterSpacing:'.2em', textAlign:'center', textTransform:'uppercase' }}
              onKeyDown={e => e.key === 'Enter' && joinClass()} />
          </div>
          <div className="field">
            <label>Your name or nickname (optional)</label>
            <input className="input" value={alias} onChange={e => setAlias(e.target.value)} placeholder="e.g. Alex or Student 5" />
          </div>
          {error && <div style={{ color:'var(--red)', fontSize:12, marginBottom:12 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width:'100%', padding:14, fontSize:15 }} onClick={joinClass}>
            Start Review →
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div style={{ width:'100%', maxWidth:720, animation:'rise .5s ease both' }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, marginBottom:4 }}>
              {classInfo?.name} — Review
            </div>
            <p style={{ color:'var(--tm)', fontSize:13 }}>
              Answer each question then reveal the answer and rate yourself. {questions.length} questions.
            </p>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📚</div>
              <p>No questions available for this class yet. Check back after your teacher has set up the review.</p>
            </div>
          ) : (
            <>
              {questions.map((q, i) => {
                const isRevealed = revealed[q.id]
                const rating = ratings[q.id]
                const tierColour = ['','var(--grn)','var(--blu)','var(--org)','var(--red)'][q.tier]
                return (
                  <div key={q.id} className="card" style={{ marginBottom:14, overflow:'hidden' }}>
                    {/* Header */}
                    <div style={{ padding:'10px 16px', background:'var(--s2)', borderBottom:'1px solid var(--b1)', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, color:tierColour }}>Q{i+1} · T{q.tier}</span>
                      <span style={{ fontSize:11, color:'var(--tm)' }}>{q.skill?.skill_name}</span>
                    </div>
                    {/* Question */}
                    <div style={{ padding:'16px', fontFamily:'var(--font-mono)', fontSize:'clamp(14px,2.5vw,18px)', lineHeight:1.6, whiteSpace:'pre-wrap' }}>
                      {q.question_text}
                    </div>
                    {/* Reveal */}
                    {!isRevealed ? (
                      <div style={{ padding:'0 16px 16px' }}>
                        <button className="btn btn-secondary" onClick={() => setRevealed(r => ({...r,[q.id]:true}))}>
                          Show Answer
                        </button>
                      </div>
                    ) : (
                      <div style={{ borderTop:'1px solid var(--b1)' }}>
                        <div style={{ padding:'12px 16px', background:'rgba(74,240,160,.05)', fontFamily:'var(--font-mono)', fontSize:'clamp(13px,2vw,16px)', color:'var(--grn)' }}>
                          → {q.answer_text}
                        </div>
                        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--b1)', display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                          <span style={{ fontSize:11, color:'var(--tm)', marginRight:4 }}>How did you go?</span>
                          {RATINGS.map(r => (
                            <button key={r.v} className={`r-btn r${r.v}${rating === r.v ? ' sel' : ''}`}
                              style={{ padding:'5px 10px', fontSize:11 }}
                              onClick={() => setRatings(rt => ({...rt,[q.id]:r.v}))}>
                              {r.l}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              <div style={{ display:'flex', justifyContent:'center', marginTop:8 }}>
                <button className="btn btn-primary" style={{ padding:'12px 32px', fontSize:15 }}
                  onClick={submit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit & Finish'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 'done' && (
        <div style={{ width:'100%', maxWidth:480, textAlign:'center', animation:'rise .5s ease both' }}>
          <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, marginBottom:10 }}>
            Great work!
          </h2>
          <p style={{ color:'var(--tm)', fontSize:15, lineHeight:1.7, marginBottom:24 }}>
            Your responses have been submitted to your teacher. Keep it up — a little review every day makes a big difference!
          </p>
          <div style={{ padding:'16px', background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:'var(--r)', marginBottom:24 }}>
            <div style={{ fontSize:12, color:'var(--tm)', marginBottom:8 }}>Your session</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--acc)' }}>
              {Object.values(ratings).filter(r => r >= 4).length} / {questions.length}
            </div>
            <div style={{ fontSize:12, color:'var(--tm)', marginTop:4 }}>questions you got right</div>
          </div>
          <button className="btn btn-secondary" onClick={() => { setStep('code'); setCode(''); setRatings({}); setRevealed({}); setAnswers({}) }}>
            Start another session
          </button>
        </div>
      )}
    </div>
  )
}
