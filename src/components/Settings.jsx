import { useSettings } from '../lib/settings.jsx'
import { useState } from 'react'
import { seedAll } from '../lib/seed.js'
import { useAuth } from '../lib/auth.jsx'

export default function Settings() {
  const { settings, setSettings, THEMES, FONT_SIZES, FONTS } = useSettings()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  function update(key, val) {
    setSettings(s => ({ ...s, [key]: val }))
    setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  async function handleSeed() {
    setSeeding(true); setSeedMsg('Seeding curriculum questions...')
    try {
      const result = await seedAll()
      setSeedMsg(`✓ Seeded ${result.skillCount} skills and ${result.qCount} questions into the database.`)
    } catch(e) {
      setSeedMsg('Error: ' + e.message)
    }
    setSeeding(false)
  }

  return (
    <div className="page-wrap">
      <div className="page-title">Settings</div>
      <p className="page-sub">Customise your classroom display and app preferences.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:720 }}>

        {/* Seed question bank */}
        <div className="card card-pad" style={{ border:'1px solid rgba(240,228,74,.2)', background:'rgba(240,228,74,.03)' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:6 }}>🌱 Question Bank Setup</div>
          <p style={{ fontSize:12, color:'var(--td)', marginBottom:14, lineHeight:1.6 }}>
            First time using the app? Click this button to load all Victorian Curriculum questions into the database.
            This only needs to be done <strong>once</strong> and takes about 30 seconds.
          </p>
          <button className="btn btn-primary" onClick={handleSeed} disabled={seeding}>
            {seeding ? '⏳ Seeding...' : '🌱 Seed Question Bank'}
          </button>
          {seedMsg && <div style={{ marginTop:10, fontSize:12, color:'var(--grn)', lineHeight:1.6 }}>{seedMsg}</div>}
        </div>

        {/* Theme */}
        <div className="card card-pad">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Presentation Theme</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button key={key} onClick={() => update('theme', key)} style={{
                padding:'14px 12px', borderRadius:'var(--r)', border:`2px solid ${settings.theme===key?'var(--acc)':'var(--b2)'}`,
                background:t.bg, cursor:'pointer', textAlign:'left', transition:'all .15s',
                boxShadow:settings.theme===key?`0 0 0 3px rgba(240,228,74,.15)`:'none'
              }}>
                <div style={{ display:'flex', gap:5, marginBottom:8 }}>
                  {[t.accent,t.blue,t.red,t.green].map((c,i) => <div key={i} style={{ width:12, height:12, borderRadius:'50%', background:c }} />)}
                </div>
                <div style={{ color:t.text, fontFamily:'var(--font-display)', fontSize:13, fontWeight:700 }}>{t.name}</div>
                {settings.theme===key && <div style={{ color:t.accent, fontSize:10, marginTop:2 }}>Active ✓</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="card card-pad">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Text Size</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {Object.entries(FONT_SIZES).map(([key, fs]) => (
              <button key={key} onClick={() => update('fontSize', key)} style={{
                padding:'10px 18px', borderRadius:'var(--rs)', border:`2px solid ${settings.fontSize===key?'var(--acc)':'var(--b2)'}`,
                background:settings.fontSize===key?'rgba(240,228,74,.1)':'var(--s2)',
                color:settings.fontSize===key?'var(--acc)':'var(--tm)',
                cursor:'pointer', transition:'all .15s', fontSize:fs.base
              }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="card card-pad">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Font Style</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[
              { key:'default', label:'Default', sample:'The quick brown fox' },
              { key:'dyslexia', label:'Dyslexia-friendly (OpenDyslexic)', sample:'The quick brown fox' },
              { key:'serif', label:'Serif', sample:'The quick brown fox' },
            ].map(f => (
              <button key={f.key} onClick={() => update('font', f.key)} style={{
                padding:'12px 16px', borderRadius:'var(--rs)', border:`2px solid ${settings.font===f.key?'var(--acc)':'var(--b2)'}`,
                background:settings.font===f.key?'rgba(240,228,74,.1)':'var(--s2)', cursor:'pointer', textAlign:'left', transition:'all .15s'
              }}>
                <div style={{ color:settings.font===f.key?'var(--acc)':'var(--tx)', fontWeight:600, fontSize:12, marginBottom:4 }}>{f.label}</div>
                <div style={{ color:'var(--tm)', fontSize:12 }}>{f.sample}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Accent colour */}
        <div className="card card-pad">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:6 }}>Custom Accent Colour</div>
          <p style={{ color:'var(--tm)', fontSize:12, marginBottom:14 }}>Override the highlight colour for headings and key elements.</p>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            {['#f0e44a','#4ac8f0','#4af0a0','#f04a6b','#a04af0','#f0944a','#ffffff'].map(c => (
              <button key={c} onClick={() => update('accentOverride', c)} style={{
                width:32, height:32, borderRadius:'50%', background:c,
                border:`3px solid ${settings.accentOverride===c?'var(--tx)':'transparent'}`,
                cursor:'pointer', transition:'all .15s'
              }} />
            ))}
            <input type="color" value={settings.accentOverride||'#f0e44a'}
              onChange={e => update('accentOverride', e.target.value)}
              style={{ width:32, height:32, borderRadius:4, border:'1px solid var(--b2)', cursor:'pointer', background:'none' }} />
            {settings.accentOverride && (
              <button className="btn btn-ghost btn-sm" onClick={() => update('accentOverride', null)}>Reset to theme default</button>
            )}
          </div>
        </div>

        {/* Presentation defaults */}
        <div className="card card-pad">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Presentation Defaults</div>
          <div className="grid-2">
            <div className="field" style={{ margin:0 }}>
              <label>Default slide timer</label>
              <select className="input select" value={settings.defaultTimer||15} onChange={e => update('defaultTimer', parseInt(e.target.value))}>
                {[10,15,20,30,45,60].map(t => <option key={t} value={t}>{t} seconds</option>)}
              </select>
            </div>
            <div className="field" style={{ margin:0 }}>
              <label>Beat the Bomb timer</label>
              <select className="input select" value={settings.btbTimer||90} onChange={e => update('btbTimer', parseInt(e.target.value))}>
                {[60,90,120,180].map(t => <option key={t} value={t}>{t} seconds</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Class codes */}
        <div className="card card-pad">
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:6 }}>Homework Portal</div>
          <p style={{ fontSize:12, color:'var(--td)', lineHeight:1.6 }}>
            Students access the homework portal at <strong style={{ color:'var(--acc)' }}>{window.location.origin}/homework</strong>
            {' '}using their class code. Class codes are shown on the Dashboard next to each class.
          </p>
        </div>

        {saved && <div className="toast" style={{ position:'static', display:'block', textAlign:'center' }}>✓ Settings saved</div>}
      </div>
    </div>
  )
}
