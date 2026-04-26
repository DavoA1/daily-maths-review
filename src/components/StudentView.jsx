import { useState, useEffect, useRef } from 'react'

const channel = new BroadcastChannel('dmr_student_view')
const TIER_BG = ['','rgba(74,240,160,.1)','rgba(74,200,240,.1)','rgba(240,148,74,.1)','rgba(240,74,107,.1)']
const TIER_CLS = ['','t1','t2','t3','t4']

export default function StudentView() {
  const [state, setState] = useState(null) // null = waiting
  const [closed, setClosed] = useState(false)
  const bombRef = useRef(null)
  const [bombLeft, setBombLeft] = useState(90)

  useEffect(() => {
    channel.addEventListener('message', e => {
      const d = e.data
      if (d.type === 'close') { setClosed(true); clearInterval(bombRef.current); return }
      if (d.type !== 'slide') return
      clearInterval(bombRef.current)
      setState(d)
      if (d.isBomb) {
        setBombLeft(d.btbSecs || 90)
        bombRef.current = setInterval(() => setBombLeft(b => b > 0 ? b - 1 : 0), 1000)
      }
    })
    return () => { clearInterval(bombRef.current); channel.close() }
  }, [])

  const fontBase = getComputedStyle(document.documentElement).getPropertyValue('--fs-base') || '14px'

  if (closed) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-display)',color:'var(--tm)',fontSize:20 }}>
      Review session ended.
    </div>
  )

  if (!state) return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--bg)',gap:18 }}>
      <div style={{ width:60,height:60,background:'var(--acc)',clipPath:'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)',animation:'pulse 2s ease-in-out infinite' }} />
      <h2 style={{ fontFamily:'var(--font-display)',fontSize:22,fontWeight:800,color:'var(--tm)' }}>Waiting for teacher...</h2>
      <p style={{ fontSize:14,color:'var(--tm)' }}>Your teacher will start the review shortly.</p>
    </div>
  )

  return (
    <div style={{ display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'var(--bg)',color:'var(--tx)' }}>
      {/* Top bar */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 22px',background:'rgba(8,9,13,.92)',borderBottom:'1px solid var(--b1)',flexShrink:0,height:46 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,letterSpacing:'.2em',color:'var(--acc)',textTransform:'uppercase' }}>
          <div style={{ width:12,height:12,background:'var(--acc)',clipPath:'polygon(50% 0%,100% 75%,80% 100%,20% 100%,0% 75%)' }} />
          Daily Maths Review
        </div>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:13,color:'var(--tm)' }}>
          {state.isBomb ? '💣 Beat the Bomb' : `Slide ${state.slideNum} / ${state.total}`}
        </div>
        <div style={{ fontSize:12,color:'var(--tm)' }}>
          {new Date().toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long'})}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1,overflow:'hidden',padding:'10px 20px 8px',display:'flex',flexDirection:'column',alignItems:'center' }}>
        {state.isBomb ? <SVBomb state={state} bombLeft={bombLeft} />
          : state.isWC ? <SVWholeClass state={state} />
          : <SVTiered state={state} />}
      </div>
    </div>
  )
}

function SVTiered({ state }) {
  return (
    <div style={{ width:'100%',maxWidth:1280,flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column' }}>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(20px,2.8vw,34px)',fontWeight:800,color:'var(--acc)',textAlign:'center',marginBottom:3,flexShrink:0 }}>{state.skill}</div>
      <div style={{ textAlign:'center',color:'var(--tm)',fontSize:12,marginBottom:10,flexShrink:0 }}>{state.topic} · {state.strand} · {state.year === 'F' ? 'Foundational' : `Year ${state.year}`}</div>
      <div style={{ display:'flex',flexDirection:'column',gap:8,flex:1,minHeight:0,overflow:'hidden' }}>
        {[1,2,3,4].map(t => {
          const qs = (state.byTier?.[t] || []).slice(0,4)
          if (!qs.length) return null
          return (
            <div key={t} style={{ display:'flex',gap:10,flex:1,minHeight:0,overflow:'hidden' }}>
              <div style={{ background:TIER_BG[t],color:`var(--${['','grn','blu','org','red'][t]})`,padding:'8px 10px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',writingMode:'vertical-rl',transform:'rotate(180deg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,minWidth:32 }}>
                T{t}
              </div>
              {qs.map((q,qi) => (
                <div key={qi} style={{ background:'var(--s1)',border:'1px solid var(--b1)',borderRadius:10,padding:'12px 14px',display:'flex',flexDirection:'column',gap:6,flex:1,minWidth:0,overflow:'hidden' }}>
                  <div style={{ fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:`var(--${['','grn','blu','org','red'][t]})`,flexShrink:0 }}>{t}.{qi+1}</div>
                  <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(13px,1.8vw,22px)',lineHeight:1.45,flex:1,overflow:'hidden',whiteSpace:'pre-wrap' }}>
                    {q.question_text || q.q}
                  </div>
                  {state.showAns && (
                    <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(11px,1.4vw,18px)',color:'var(--grn)',borderTop:'1px solid var(--b1)',paddingTop:6,marginTop:4,flexShrink:0 }}>
                      → {q.answer_text || q.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SVWholeClass({ state }) {
  return (
    <div style={{ width:'100%',maxWidth:960,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
      <div style={{ color:'var(--pur)',fontSize:11,fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8 }}>🎯 Whole-Class Question</div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(18px,2.5vw,30px)',fontWeight:800,color:'var(--pur)',textAlign:'center',marginBottom:18 }}>{state.skill}</div>
      <div style={{ background:'var(--s1)',border:'2px solid rgba(160,74,240,.4)',borderRadius:12,padding:'36px 48px',width:'100%',textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(18px,3vw,36px)',lineHeight:1.5,whiteSpace:'pre-wrap' }}>{state.wcQ}</div>
        {state.showAns && (
          <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(16px,2.5vw,28px)',color:'var(--grn)',borderTop:'1px solid var(--b1)',paddingTop:16,marginTop:14 }}>
            → {state.wcA}
          </div>
        )}
      </div>
    </div>
  )
}

function SVBomb({ state, bombLeft }) {
  const urgent = bombLeft <= 10
  return (
    <div style={{ width:'100%',maxWidth:1200,flex:1,display:'flex',flexDirection:'column' }}>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(26px,5vw,52px)',fontWeight:800,color:'var(--red)',textAlign:'center',marginBottom:6 }}>💣 BEAT THE BOMB 💣</div>
      <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(70px,13vw,130px)',fontWeight:800,textAlign:'center',lineHeight:1,marginBottom:16,color:urgent?'var(--red)':'var(--acc)',animation:urgent?'pulse .4s infinite':'none' }}>
        {bombLeft<=0 ? '💥' : bombLeft}
      </div>
      {state.bomb && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,flex:1,minHeight:0 }}>
          {[{l:'⚡ Standard Challenge',q:state.bomb.easy,c:'grn',bg:'rgba(74,240,160,.06)',b:'rgba(74,240,160,.3)'},
            {l:'💀 Elite Challenge',q:state.bomb.hard,c:'red',bg:'rgba(240,74,107,.06)',b:'rgba(240,74,107,.3)'}].map(s => (
            <div key={s.l} style={{ background:s.bg,border:`2px solid ${s.b}`,borderRadius:12,padding:'26px 30px',display:'flex',flexDirection:'column' }}>
              <div style={{ fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:`var(--${s.c})`,marginBottom:14 }}>{s.l}</div>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(16px,2.5vw,30px)',lineHeight:1.5,flex:1 }}>{s.q}</div>
              {state.showAns && <div style={{ marginTop:12,paddingTop:10,borderTop:'1px solid var(--b1)',fontSize:13,color:'var(--tm)' }}>Discuss with class →</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
