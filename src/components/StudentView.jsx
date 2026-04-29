import { useState, useEffect, useRef } from 'react'

const channel = new BroadcastChannel('dmr_student_view')

// Calculate optimal columns to avoid blank cells in the grid
// Tries to find cols where items divide evenly, allows max 1 blank in last row


// ── GRID HELPERS ────────────────────────────────────────────
function snapCount(n, maxN) {
  const clean = [1,2,3,4,6].filter(c => c <= maxN)
  for (let i = clean.length - 1; i >= 0; i--) {
    if (n >= clean[i]) return clean[i]
  }
  return Math.min(n, 1)
}
function gridCols(n) {
  if (n <= 3) return n
  if (n === 4) return 2
  if (n === 6) return 3
  return n
}

const TIER_COLS = ['','#16a34a','#2563eb','#d97706','#dc2626']
const TIER_BG   = ['','#f0fdf4','#eff6ff','#fffbeb','#fef2f2']
const TIER_BORDER=['','#86efac','#93c5fd','#fcd34d','#fca5a5']
const TIER_LABELS=['','Foundation','Core','Extension','Challenge']

export default function StudentView() {
  const [data, setData] = useState(null)
  const [closed, setClosed] = useState(false)
  const bombRef = useRef(null)
  const [bombLeft, setBombLeft] = useState(90)

  useEffect(() => {
    channel.addEventListener('message', e => {
      const d = e.data
      if (d.type === 'close') { setClosed(true); clearInterval(bombRef.current); return }
      if (d.type !== 'slide') return
      clearInterval(bombRef.current)
      setData(d)
      if (d.isBomb) {
        setBombLeft(d.btbSecs || 90)
        bombRef.current = setInterval(() => setBombLeft(b => b > 0 ? b - 1 : 0), 1000)
      }
    })
    return () => { clearInterval(bombRef.current); channel.close() }
  }, [])

  if (closed) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#1e1b4b',fontFamily:"'Syne',sans-serif",color:'rgba(224,231,255,.5)',fontSize:22 }}>
      Session ended.
    </div>
  )

  if (!data) return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#1e1b4b',gap:20,fontFamily:"'Syne',sans-serif" }}>
      <div style={{ width:64,height:64,background:'#a78bfa',clipPath:'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)',animation:'pulse 2s ease-in-out infinite' }} />
      <div style={{ color:'rgba(224,231,255,.6)',fontSize:22,fontWeight:700 }}>Waiting for teacher...</div>
      <div style={{ color:'rgba(224,231,255,.35)',fontSize:14 }}>Your teacher will start the review shortly</div>
    </div>
  )

  return (
    <div style={{ display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'#f8fafc',fontFamily:"'Figtree',sans-serif" }}>
      {/* Top bar */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 22px',background:'#1e1b4b',height:46,flexShrink:0 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'.2em',color:'#a78bfa',textTransform:'uppercase' }}>
          <div style={{ width:14,height:14,background:'#a78bfa',clipPath:'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)' }} />
          Daily Maths Review
        </div>
        <div style={{ fontFamily:'monospace',fontSize:12,color:'rgba(224,231,255,.5)', display:'flex', alignItems:'center', gap:8 }}>
          {data.isBomb ? '💣 Beat the Bomb' : `Slide ${data.slideNum}/${data.slideTotal}`}
          {data.isSpotlight && <span style={{ fontSize:10, padding:'1px 6px', borderRadius:4, background:'rgba(167,139,250,.3)', color:'#c4b5fd' }}>💡 Spotlight {data.spotlightIndex+1}/{data.spotlightTotal}</span>}
          {data.isBank && !data.isSpotlight && <span style={{ fontSize:10, padding:'1px 6px', borderRadius:4, background:'rgba(74,200,240,.3)', color:'#67e8f9' }}>📋 Full Bank</span>}
        </div>
        <div style={{ fontSize:12,color:'rgba(224,231,255,.4)' }}>
          {new Date().toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long'})}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1,overflow:'hidden',padding:'10px 18px 8px',display:'flex',flexDirection:'column',alignItems:'center',background:'#f8fafc' }}>
        {data.isBomb ? <SVBomb data={data} bombLeft={bombLeft} />
         : data.isExplanation ? <SVExplanation data={data} />
         : (data.slideMode==='single' || data.isSpotlight) ? <SVSingleQ data={data} />
         : <SVTiered data={data} />}
      </div>
    </div>
  )
}

// ── TIERED STUDENT VIEW ──
function SVTiered({ data }) {
  const byTierRaw = data.byTier || {1:[],2:[],3:[],4:[]}

  const tieredRows = [1,2,3,4].map(t => {
    const qs = [...(byTierRaw[t] || [])]
      .sort((a,b) => (a.question_text||a.q||'').length - (b.question_text||b.q||'').length)
    if (!qs.length) return null
    const maxN = t <= 2 ? 6 : t === 3 ? 2 : 1
    const count = snapCount(qs.length, maxN)
    return { tier: t, qs: qs.slice(0, count) }
  }).filter(Boolean)

  if (!tieredRows.length) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
      color:'#94a3b8', fontSize:16, fontStyle:'italic' }}>
      No questions yet.
    </div>
  )

  const t12Qs = tieredRows.filter(r=>r.tier<=2).flatMap(r=>r.qs)
  const t34Qs = tieredRows.filter(r=>r.tier>=3).flatMap(r=>r.qs)
  const maxShort = t12Qs.length ? Math.max(...t12Qs.map(q=>(q.question_text||q.q||'').length)) : 20
  const maxLong  = t34Qs.length ? Math.max(...t34Qs.map(q=>(q.question_text||q.q||'').length)) : 40
  const fontSm = maxShort > 60 ? 12 : maxShort > 40 ? 13 : maxShort > 25 ? 15 : 17
  const fontLg = maxLong > 120 ? 13 : maxLong > 80 ? 14 : maxLong > 50 ? 16 : 18
  const ansSm = Math.max(10, fontSm - 2)
  const ansLg = Math.max(11, fontLg - 2)

  return (
    <div style={{ width:'100%', maxWidth:1400, flex:1, minHeight:0, overflow:'hidden',
      display:'flex', flexDirection:'column' }}>

      {/* Skill header */}
      <div style={{ textAlign:'center', marginBottom:6, flexShrink:0 }}>
        <div style={{ color:'#1e1b4b', fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize:'clamp(18px,2.5vw,34px)' }}>{data.skill}</div>
        <div style={{ color:'#64748b', fontSize:12, marginTop:2 }}>
          {data.topic} · {data.strand} · {data.year==='F'?'Foundational':`Year ${data.year}`}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6, flex:1, minHeight:0, overflow:'hidden', alignContent:'stretch' }}>
        {tieredRows.map(({ tier: t, qs }) => {
          const isHigh = t >= 3
          const font = isHigh ? fontLg : fontSm
          const ansFont = isHigh ? ansLg : ansSm
          const cols = gridCols(qs.length)
          const rows = qs.length / cols
          const flexW = t === 1 ? 1 : t === 2 ? 1 : t === 3 ? 2 : 2.6

          return (
            <div key={t} style={{ display:'flex', gap:6, flex:flexW, minHeight:0, overflow:'hidden' }}>
              {/* Tier label */}
              <div style={{
                background:TIER_BG[t], border:`1.5px solid ${TIER_BORDER[t]}`,
                color:TIER_COLS[t], padding:'5px 7px', borderRadius:8,
                fontSize: t<=2 ? 9 : 11, fontWeight:800, letterSpacing:'.06em',
                writingMode:'vertical-rl', transform:'rotate(180deg)',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, minWidth: t<=2 ? 26 : 32, textTransform:'uppercase',
              }}>
                {t === 4 ? '🏆' : `T${t}`}
              </div>

              {/* Grid — cells stretch to fill all space */}
              <div style={{
                display:'grid',
                gridTemplateColumns:`repeat(${cols},1fr)`,
                gridTemplateRows:`repeat(${rows},1fr)`,
                gap:6, flex:1, minHeight:0, overflow:'hidden',
                alignItems:'stretch', alignContent:'stretch',
              }}>
                {qs.map((q, qi) => {
                  const qt = q.question_text || q.q || ''
                  const at = q.answer_text || q.a || ''
                  const img = q.image_url || ''
                  return (
                    <div key={qi} style={{
                      background: t===4 ? 'linear-gradient(135deg,#fff,#fffbeb)' : 'white',
                      border:`${t===4?2:1.5}px solid ${TIER_BORDER[t]}`,
                      borderRadius:10, padding:'10px 14px',
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      overflow:'hidden', height:'100%', boxSizing:'border-box',
                      textAlign:'center',
                    }}>
                      <div style={{ color:TIER_COLS[t], fontSize:10, fontWeight:800,
                        marginBottom:3, alignSelf:'flex-start' }}>
                        {t===4 ? '🏆 CHALLENGE' : `${t}.${qi+1}`}
                      </div>
                      {img && <img src={img} alt="" style={{
                        maxHeight: t>=3?90:60, maxWidth:'90%',
                        objectFit:'contain', marginBottom:5, borderRadius:4
                      }} />}
                      <div style={{
                        color:'#1e293b', fontFamily:"'JetBrains Mono',monospace",
                        fontSize:`${font}px`, lineHeight:1.5,
                        whiteSpace:'pre-wrap', wordBreak:'break-word',
                        fontWeight: t===4?600:400, textAlign:'center',
                        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                        width:'100%',
                      }}>
                        {qt}
                      </div>
                      {data.showAns && (
                        <div style={{
                          color:'#166534', fontFamily:"'JetBrains Mono',monospace",
                          fontSize:`${ansFont}px`, borderTop:`1px solid ${TIER_BORDER[t]}`,
                          paddingTop:4, marginTop:4, fontWeight:600,
                          width:'100%', textAlign:'center',
                        }}>
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

// ── SINGLE QUESTION STUDENT VIEW ──
function SVSingleQ({ data }) {
  const tier = data.tier || 1
  const isTF = data.mode==='tf' || data.qtype==='tf'
  const isMC = data.mode==='mc' || data.qtype==='mc'
  const modeLabel = { whiteboard:'📝 Whiteboard', verbal:'🗣 Verbal Response', tf:'👍 True / False', mc:'🃏 Multiple Choice' }
  const modeDesc  = { whiteboard:'Write your answer — hold up on signal', verbal:'Think about it — teacher will ask you', tf:'Thumbs UP for True · Thumbs DOWN for False', mc:'Hold up your A / B / C / D card' }
  const modeCol   = { whiteboard:'#7c3aed', verbal:'#0891b2', tf:'#059669', mc:'#7c3aed' }
  const col = modeCol[data.mode] || '#7c3aed'

  return (
    <div style={{ width:'100%',maxWidth:900,display:'flex',flexDirection:'column',alignItems:'center',gap:14,flex:1 }}>
      {/* Skill + tier */}
      <div style={{ display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',justifyContent:'center' }}>
        <div style={{ color:'#1e1b4b',fontFamily:"'Syne',sans-serif",fontSize:'clamp(18px,2.5vw,30px)',fontWeight:800 }}>{data.skill}</div>
        <span style={{ background:TIER_BG[tier],border:`1px solid ${TIER_BORDER[tier]}`,color:TIER_COLS[tier],padding:'3px 12px',borderRadius:20,fontSize:13,fontWeight:700 }}>T{tier} · {TIER_LABELS[tier]}</span>
      </div>

      {/* Mode instruction */}
      <div style={{ padding:'8px 20px',borderRadius:10,border:`1px solid ${col}40`,background:`${col}10`,textAlign:'center' }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:col }}>{modeLabel[data.mode]}</div>
        <div style={{ fontSize:13,color:'#64748b',marginTop:3 }}>{modeDesc[data.mode]}</div>
      </div>

      {/* T/F */}
      {isTF && !data.showAns && (
        <div style={{ display:'flex',gap:40 }}>
          {[{l:'👍 TRUE',c:'#059669'},{l:'👎 FALSE',c:'#dc2626'}].map(tf => (
            <div key={tf.l} style={{ padding:'16px 40px',borderRadius:14,border:`2px solid ${tf.c}60`,background:`${tf.c}12`,fontFamily:"'Syne',sans-serif",fontSize:'clamp(22px,3.5vw,38px)',fontWeight:800,color:tf.c }}>{tf.l}</div>
          ))}
        </div>
      )}

      {/* Question box */}
      <div style={{ background:'white',border:`2px solid ${TIER_BORDER[tier]}`,borderRadius:16,padding:'clamp(20px,3vw,48px) clamp(24px,4vw,64px)',width:'100%',textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,.08)',flex:1,display:'flex',flexDirection:'column',justifyContent:'center' }}>
        {data.qimage && <img src={data.qimage} alt="" style={{ maxHeight:160,maxWidth:'80%',margin:'0 auto 16px',objectFit:'contain',borderRadius:8 }} />}
        <div style={{ color:'#1e293b',fontFamily:"'JetBrains Mono',monospace",fontSize:'clamp(18px,3.5vw,46px)',lineHeight:1.6,whiteSpace:'pre-wrap',fontWeight:500 }}>{data.qtext}</div>

        {isMC && !data.showAns && data.qtext.includes('A)') && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:22,textAlign:'left' }}>
            {(data.qtext.match(/[A-D]\).+/g)||[]).map((opt,i) => (
              <div key={i} style={{ padding:'14px 18px',background:'#f8fafc',borderRadius:10,border:'1.5px solid #e2e8f0',fontFamily:"'JetBrains Mono',monospace",fontSize:'clamp(15px,2vw,26px)',color:'#1e293b' }}>{opt}</div>
            ))}
          </div>
        )}

        {data.showAns && (
          <div style={{ marginTop:24,paddingTop:20,borderTop:'2px solid #e2e8f0',fontFamily:"'JetBrains Mono',monospace",fontSize:'clamp(17px,3vw,40px)',color:'#166534',fontWeight:600 }}>
            → {data.atext}
          </div>
        )}
      </div>

      {/* Sub-question dots */}
      {data.qTotal > 1 && (
        <div style={{ display:'flex',gap:8 }}>
          {Array.from({length:data.qTotal},(_,i) => (
            <div key={i} style={{ width:10,height:10,borderRadius:'50%',background:i===data.qNum-1?'#7c3aed':i<data.qNum-1?'#c4b5fd':'#e2e8f0',transform:i===data.qNum-1?'scale(1.3)':'scale(1)',transition:'all .2s' }} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── EXPLANATION STUDENT VIEW ──
function SVExplanation({ data }) {
  const yt = (data.expVideo||'').replace('watch?v=','embed/').replace('youtu.be/','youtube.com/embed/')
  return (
    <div style={{ width:'100%', maxWidth:900, flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(22px,3.5vw,42px)', color:'#1e1b4b', textAlign:'center' }}>
        {data.expTitle || 'Explanation'}
      </div>
      {data.expImage && (
        <img src={data.expImage} alt="" style={{ maxHeight:280, maxWidth:'90%', objectFit:'contain', borderRadius:12, boxShadow:'0 4px 16px rgba(0,0,0,.12)' }} />
      )}
      {yt && (
        <iframe src={yt} style={{ width:'100%', maxWidth:640, height:360, borderRadius:12, border:'none' }} allowFullScreen title="Video" />
      )}
      {data.expText && (
        <div style={{ background:'white', borderRadius:14, padding:'22px 32px', maxWidth:700, width:'100%', color:'#1e293b', fontFamily:"'Figtree',sans-serif", fontSize:'clamp(16px,2vw,24px)', lineHeight:1.7, textAlign:'center', boxShadow:'0 4px 12px rgba(0,0,0,.08)', border:'1px solid #e2e8f0' }}>
          {data.expText}
        </div>
      )}
    </div>
  )
}

// ── BOMB STUDENT VIEW ──
function SVBomb({ data, bombLeft }) {
  const urgent = bombLeft <= 10
  return (
    <div style={{ width:'100%',maxWidth:1200,flex:1,display:'flex',flexDirection:'column' }}>
      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:'clamp(26px,5vw,54px)',fontWeight:800,color:'#dc2626',textAlign:'center',marginBottom:6 }}>💣 BEAT THE BOMB 💣</div>
      <div style={{ fontFamily:'monospace',fontSize:'clamp(72px,13vw,132px)',fontWeight:800,textAlign:'center',lineHeight:1,marginBottom:12,color:urgent?'#dc2626':'#7c3aed',animation:urgent?'pulse .4s infinite':'none' }}>
        {bombLeft<=0?'💥':bombLeft}
      </div>
      {data.bomb?.chain && (
        <div style={{ background:'#faf5ff',border:'2px solid #d8b4fe',borderRadius:14,padding:'14px 22px',marginBottom:12,textAlign:'center',flexShrink:0 }}>
          <div style={{ color:'#7c3aed',fontSize:12,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',marginBottom:8 }}>⛓ Chain Challenge</div>
          <div style={{ color:'#1e293b',fontFamily:"'JetBrains Mono',monospace",fontSize:'clamp(15px,2.2vw,28px)',lineHeight:1.8,whiteSpace:'pre-wrap' }}>{data.bomb.chain}</div>
        </div>
      )}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,flex:1,minHeight:0 }}>
        {[{l:'⚡ Standard',q:data.bomb?.easy,c:'#059669',bg:'#f0fdf4',b:'#86efac'},
          {l:'💀 Elite',q:data.bomb?.hard,c:'#dc2626',bg:'#fef2f2',b:'#fca5a5'}].map(s => (
          <div key={s.l} style={{ background:s.bg,border:`2px solid ${s.b}`,borderRadius:14,padding:'20px 26px',display:'flex',flexDirection:'column' }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:s.c,marginBottom:14 }}>{s.l}</div>
            <div style={{ color:'#1e293b',fontFamily:"'JetBrains Mono',monospace",fontSize:'clamp(16px,2.3vw,32px)',lineHeight:1.5,flex:1 }}>{s.q}</div>
            {data.showAns && <div style={{ marginTop:12,paddingTop:10,borderTop:`1px solid ${s.b}`,fontSize:14,color:'#64748b' }}>Discuss with class →</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
