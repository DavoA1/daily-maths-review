import { useState, useEffect, useRef } from 'react'

const channel = new BroadcastChannel('dmr_student_view')

const TIER_COL = ['','var(--grn)','var(--blu)','var(--org)','var(--red)']
const TIER_BG  = ['','rgba(74,240,160,.1)','rgba(74,200,240,.1)','rgba(240,148,74,.1)','rgba(240,74,107,.1)']

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
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-display)',color:'var(--tm)',fontSize:20 }}>
      Session ended.
    </div>
  )

  if (!data) return (
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
        <div style={{ fontFamily:'var(--font-mono)',fontSize:12,color:'var(--tm)' }}>
          {data.isBomb ? '💣 Beat the Bomb' : `Slide ${data.slideNum}/${data.slideTotal} · Q${data.qNum}/${data.qTotal}`}
        </div>
        <div style={{ fontSize:12,color:'var(--tm)' }}>
          {new Date().toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long'})}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1,overflow:'hidden',padding:'14px 24px 10px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
        {data.isBomb ? <SVBomb data={data} bombLeft={bombLeft} />
         : <SVSingleQ data={data} />}
      </div>
    </div>
  )
}

function SVSingleQ({ data }) {
  const tier = data.tier || 1
  const mode = data.mode || 'whiteboard'
  const isTF = mode === 'tf' || mode === 'tf_custom' || data.qtype === 'tf'
  const isMC = mode === 'mc' || data.qtype === 'mc'

  const modeLabel = { whiteboard:'📝 Whiteboard', verbal:'🗣 Verbal', tf:'👍 True / False', tf_custom:'👍 True / False', mc:'🃏 Multiple Choice' }
  const modeDesc = {
    whiteboard: 'Write your answer, hold up on signal',
    verbal: 'Think about your answer — teacher will ask you',
    tf: 'Thumbs UP for True · Thumbs DOWN for False',
    tf_custom: 'Thumbs UP for True · Thumbs DOWN for False',
    mc: 'Hold up your A / B / C / D card',
  }
  const modeCol = { whiteboard:'var(--acc)', verbal:'var(--blu)', tf:'var(--grn)', tf_custom:'var(--grn)', mc:'var(--pur)' }
  const col = modeCol[mode] || 'var(--acc)'

  return (
    <div style={{ width:'100%',maxWidth:900,display:'flex',flexDirection:'column',alignItems:'center',gap:16 }}>
      {/* Skill + tier */}
      <div style={{ display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',justifyContent:'center' }}>
        <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(16px,2.5vw,28px)',fontWeight:800,color:'var(--acc)',textAlign:'center' }}>{data.skill}</div>
        <span style={{ padding:'3px 10px',borderRadius:4,background:TIER_BG[tier],color:TIER_COL[tier],fontSize:11,fontWeight:700,fontFamily:'var(--font-mono)' }}>
          T{tier}
        </span>
      </div>

      {/* Mode instruction */}
      <div style={{ padding:'8px 20px',borderRadius:'var(--rs)',border:`1px solid ${col}40`,background:`${col}10`,textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-display)',fontSize:14,fontWeight:700,color:col }}>{modeLabel[mode]}</div>
        <div style={{ fontSize:12,color:'var(--tm)',marginTop:3 }}>{modeDesc[mode]}</div>
      </div>

      {/* T/F buttons */}
      {isTF && !data.showAns && (
        <div style={{ display:'flex',gap:40 }}>
          {[{l:'👍 TRUE',c:'var(--grn)'},{l:'👎 FALSE',c:'var(--red)'}].map(tf => (
            <div key={tf.l} style={{ padding:'16px 36px',borderRadius:'var(--r)',border:`2px solid ${tf.c}50`,background:`${tf.c}12`,fontFamily:'var(--font-display)',fontSize:'clamp(20px,3vw,32px)',fontWeight:800,color:tf.c }}>{tf.l}</div>
          ))}
        </div>
      )}

      {/* The question */}
      <div style={{ background:'var(--s1)',border:`2px solid ${TIER_BG[tier].replace('.1','.4')}`,borderRadius:'var(--r)',padding:'clamp(20px,3vw,44px) clamp(24px,4vw,60px)',width:'100%',textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(18px,3.5vw,44px)',lineHeight:1.55,whiteSpace:'pre-wrap',color:'var(--tx)' }}>{data.qtext}</div>

        {/* MC options */}
        {isMC && !data.showAns && data.qtext.includes('A)') && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:20,textAlign:'left' }}>
            {(data.qtext.match(/[A-D]\).+/g)||[]).map((opt,i) => (
              <div key={i} style={{ padding:'12px 16px',background:'var(--s2)',borderRadius:'var(--rs)',border:'1px solid var(--b2)',fontFamily:'var(--font-mono)',fontSize:'clamp(14px,2vw,24px)' }}>{opt}</div>
            ))}
          </div>
        )}

        {data.showAns && (
          <div style={{ marginTop:20,paddingTop:16,borderTop:'1px solid var(--b1)',fontFamily:'var(--font-mono)',fontSize:'clamp(16px,3vw,38px)',color:'var(--grn)' }}>
            → {data.atext}
          </div>
        )}
      </div>

      {/* Sub-question progress dots */}
      {data.qTotal > 1 && (
        <div style={{ display:'flex',gap:8 }}>
          {Array.from({length:data.qTotal},(_,i) => (
            <div key={i} style={{ width:8,height:8,borderRadius:'50%',background:i<data.qNum?'var(--acc)':i===data.qNum-1?'var(--acc)':'var(--b2)',transform:i===data.qNum-1?'scale(1.4)':'scale(1)',transition:'all .2s' }} />
          ))}
        </div>
      )}
    </div>
  )
}

function SVBomb({ data, bombLeft }) {
  const urgent = bombLeft <= 10
  return (
    <div style={{ width:'100%',maxWidth:1200,flex:1,display:'flex',flexDirection:'column' }}>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(26px,5vw,52px)',fontWeight:800,color:'var(--red)',textAlign:'center',marginBottom:6 }}>💣 BEAT THE BOMB 💣</div>
      <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(70px,13vw,130px)',fontWeight:800,textAlign:'center',lineHeight:1,marginBottom:16,color:urgent?'var(--red)':'var(--acc)',animation:urgent?'pulse .4s infinite':'none' }}>
        {bombLeft<=0?'💥':bombLeft}
      </div>
      {data.bomb && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,flex:1,minHeight:0 }}>
          {[{l:'⚡ Standard',q:data.bomb.easy,c:'grn',bg:'rgba(74,240,160,.06)',b:'rgba(74,240,160,.3)'},
            {l:'💀 Elite',q:data.bomb.hard,c:'red',bg:'rgba(240,74,107,.06)',b:'rgba(240,74,107,.3)'}].map(s => (
            <div key={s.l} style={{ background:s.bg,border:`2px solid ${s.b}`,borderRadius:12,padding:'26px 30px',display:'flex',flexDirection:'column' }}>
              <div style={{ fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:`var(--${s.c})`,marginBottom:14 }}>{s.l}</div>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(16px,2.5vw,30px)',lineHeight:1.5,flex:1 }}>{s.q}</div>
              {data.showAns && <div style={{ marginTop:12,paddingTop:10,borderTop:'1px solid var(--b1)',fontSize:13,color:'var(--tm)' }}>Discuss →</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
