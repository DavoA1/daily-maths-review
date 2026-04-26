import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'

export default function UnitPlan() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [cls, setCls] = useState('')
  const [yr, setYr] = useState('9')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [fileText, setFileText] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState([])
  const [skills, setSkills] = useState([])
  const [importing, setImporting] = useState(false)
  const [toast, setToast] = useState('')
  const [checked, setChecked] = useState({})

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (cls) loadSkills() }, [yr])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2800) }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data?.length) setCls(data[0].id)
  }

  async function loadSkills() {
    const { data } = await supabase.from('skills').select('id,skill_name,strand,topic,year_level').eq('year_level', yr)
    setSkills(data || [])
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    if (file.name.endsWith('.docx') && typeof mammoth !== 'undefined') {
      const reader = new FileReader()
      reader.onload = async ev => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: ev.target.result })
          setFileText(result.value)
          showToast('✓ File extracted')
        } catch { readAsText(file) }
      }
      reader.readAsArrayBuffer(file)
    } else {
      readAsText(file)
    }
  }

  function readAsText(file) {
    const reader = new FileReader()
    reader.onload = e => setFileText(e.target.result)
    reader.readAsText(file)
  }

  async function doParse() {
    const text = (fileText || pasteText || '').trim()
    if (!text) { alert('Upload a file or paste your unit plan text first.'); return }
    setParsing(true); setParsed([])

    const topicList = skills.map(s => `${s.strand} > ${s.topic} > ${s.skill_name}`).join('\n')
    const prompt = `You are analysing a Victorian Curriculum maths unit plan for Year ${yr}.

Extract topics and skills with when they are taught. Unit start date: ${startDate}.

Unit plan text:
"""
${text.substring(0, 5000)}
"""

Available curriculum skills:
${topicList.substring(0, 2000)}

Return ONLY a JSON array where each item has:
- "skill_name": exact name from list above (or closest match)
- "strand": maths strand
- "topic": topic area
- "weekOffset": days from start date when taught (0=week1, 7=week2, etc)
- "duration": number of lessons (integer)
- "learningIntention": brief learning intention if stated (max 12 words)
- "inBank": true if matches a skill above

Return only the JSON array, no markdown.`

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
      })
      const data = await resp.json()
      const raw = data.content?.map(i => i.text || '').join('') || ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const items = JSON.parse(clean)
      setParsed(items)
      const initChecked = {}
      items.forEach((_, i) => { initChecked[i] = true })
      setChecked(initChecked)
      showToast(`✓ Found ${items.length} topics`)
    } catch (err) {
      // Fallback: simple keyword matching
      const fallback = simpleFallback(text)
      if (fallback.length) {
        setParsed(fallback)
        const initChecked = {}
        fallback.forEach((_,i) => { initChecked[i] = true })
        setChecked(initChecked)
        showToast(`AI unavailable — matched ${fallback.length} topics by keyword`)
      } else {
        showToast('Could not parse. Try pasting text directly.')
      }
    }
    setParsing(false)
  }

  function simpleFallback(text) {
    const results = []
    const lines = text.split('\n')
    let week = 0
    lines.forEach(line => {
      const wm = line.match(/week\s*(\d+)|lesson\s*(\d+)/i)
      if (wm) week = parseInt(wm[1] || wm[2] || week + 1) || week + 1
      const lower = line.toLowerCase()
      const match = skills.find(s => lower.includes(s.skill_name.toLowerCase().substring(0, 10)) || lower.includes(s.topic.toLowerCase().substring(0, 8)))
      if (match && line.trim().length > 8) {
        if (!results.find(r => r.skill_name === match.skill_name)) {
          results.push({ skill_name: match.skill_name, strand: match.strand, topic: match.topic, weekOffset: Math.max(0, week-1)*7, duration: 1, learningIntention: line.trim().substring(0, 80), inBank: true })
        }
      }
    })
    return results.slice(0, 20)
  }

  async function doImport() {
    setImporting(true)
    const start = new Date(startDate)
    let added = 0

    // Get existing class_skills
    const { data: existing } = await supabase.from('class_skills').select('skill_id').eq('class_id', cls)
    const existingIds = new Set((existing || []).map(e => e.skill_id))

    for (const [i, topic] of parsed.entries()) {
      if (!checked[i]) continue
      const skill = skills.find(s => s.skill_name === topic.skill_name) ||
                    skills.find(s => s.skill_name.toLowerCase().includes((topic.skill_name||'').toLowerCase().substring(0,8)))
      if (!skill) continue
      if (existingIds.has(skill.id)) continue

      const teachDate = new Date(start.getTime() + (topic.weekOffset || 0) * 86400000)
      const daysAgo = Math.round((Date.now() - teachDate.getTime()) / 86400000)

      await supabase.from('class_skills').insert({
        class_id: cls, skill_id: skill.id, mastery: 1,
        last_reviewed: daysAgo >= 0 ? teachDate.toISOString() : null,
        scheduled_date: teachDate.toISOString(),
        learning_intention: topic.learningIntention || '',
        from_unit_plan: true
      })
      added++
    }
    showToast(`✓ ${added} topic${added !== 1 ? 's' : ''} imported`)
    setImporting(false)
  }

  return (
    <div className="page-wrap">
      <div className="page-title">Unit Plan Importer</div>
      <p className="page-sub">Upload your unit plan and the system extracts topics with dates, then schedules them automatically. Download from Google Docs as <strong>File → Download → Microsoft Word (.docx)</strong>.</p>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card card-pad">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>📄 Upload file</div>
          <p style={{ fontSize: 12, color: 'var(--td)', marginBottom: 12 }}>Supports .docx, .txt</p>
          <input type="file" id="up-file" accept=".docx,.txt" style={{ display: 'none' }} onChange={handleFile} />
          <div onClick={() => document.getElementById('up-file').click()}
            style={{ border: '2px dashed var(--b2)', borderRadius: 'var(--r)', padding: '28px', textAlign: 'center', cursor: 'pointer', color: 'var(--tm)', fontSize: 13, transition: 'all .15s' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
            Click to choose file
          </div>
          {fileName && <div style={{ fontSize: 11, color: 'var(--grn)', marginTop: 8 }}>✓ {fileName}</div>}
        </div>
        <div className="card card-pad">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>✏️ Or paste text</div>
          <p style={{ fontSize: 12, color: 'var(--td)', marginBottom: 12 }}>Copy and paste your unit plan content</p>
          <textarea className="input textarea" value={pasteText} onChange={e => setPasteText(e.target.value)}
            placeholder={'Paste unit plan text here...\n\nWeek 1: Linear equations\nLearning intention: Students will solve...'} style={{ minHeight: 130 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Apply to class</label>
          <select className="input select" value={cls} onChange={e => setCls(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Unit start date</label>
          <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Year level of unit</label>
          <select className="input select" value={yr} onChange={e => { setYr(e.target.value); loadSkills() }}>
            {[5,6,7,8,9,10,11,12].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={doParse} disabled={parsing} style={{ marginBottom: 24 }}>
        {parsing ? '⏳ Analysing...' : '🔍 Extract Topics from Unit Plan'}
      </button>

      {parsed.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Extracted topics ({parsed.length})</div>
              <p style={{ fontSize: 12, color: 'var(--tm)', marginTop: 2 }}>Uncheck any you don't want to import. Tick all others then click Import.</p>
            </div>
            <button className="btn btn-primary" onClick={doImport} disabled={importing}>
              {importing ? 'Importing...' : `Import Selected → Schedule`}
            </button>
          </div>
          <table className="data-table">
            <thead><tr><th>✓</th><th>Skill / Topic</th><th>Strand</th><th>Teach date</th><th>Lessons</th><th>Learning intention</th><th>In bank?</th></tr></thead>
            <tbody>
              {parsed.map((t, i) => {
                const teachDate = new Date(new Date(startDate).getTime() + (t.weekOffset || 0) * 86400000)
                const dateStr = teachDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
                const strandCls = 'st-' + (t.strand || '').toLowerCase().split(' ')[0]
                return (
                  <tr key={i}>
                    <td><input type="checkbox" checked={checked[i] || false} onChange={e => setChecked(c => ({ ...c, [i]: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--acc)', cursor: 'pointer' }} /></td>
                    <td><div style={{ fontWeight: 600, fontSize: 12 }}>{t.skill_name}</div><div style={{ fontSize: 10, color: 'var(--tm)' }}>{t.topic}</div></td>
                    <td><span className={`strand-tag ${strandCls}`}>{t.strand || '?'}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--td)' }}>{dateStr}</td>
                    <td style={{ fontSize: 11, color: 'var(--tm)' }}>{t.duration || 1} lesson{(t.duration || 1) > 1 ? 's' : ''}</td>
                    <td style={{ fontSize: 11, color: 'var(--td)', maxWidth: 200 }}>{t.learningIntention || '—'}</td>
                    <td><span className={`badge ${t.inBank ? 'badge-ok' : 'badge-soon'}`}>{t.inBank ? 'In bank' : 'New'}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
