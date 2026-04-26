import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'

export default function PATData() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [cls, setCls] = useState('')
  const [yr, setYr] = useState('9')
  const [fileText, setFileText] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [fileName, setFileName] = useState('')
  const [analysing, setAnalysing] = useState(false)
  const [results, setResults] = useState([])
  const [checked, setChecked] = useState({})
  const [importing, setImporting] = useState(false)
  const [skills, setSkills] = useState([])
  const [toast, setToast] = useState('')

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { if (yr) loadSkills() }, [yr])

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
    const file = e.target.files[0]; if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => setFileText(ev.target.result)
    reader.readAsText(file)
  }

  async function doAnalyse() {
    const text = (fileText || pasteText || '').trim()
    if (!text) { alert('Upload or paste PAT data first.'); return }
    setAnalysing(true); setResults([])

    const topicList = skills.map(s => `${s.strand} > ${s.topic} > ${s.skill_name} (${s.id})`).join('\n')

    const prompt = `You are analysing PAT Maths results for Year ${yr} students.

PAT data:
"""
${text.substring(0, 4000)}
"""

Available curriculum skills:
${topicList.substring(0, 2000)}

Identify which content areas had lowest success rates (most students got wrong).

Return ONLY a JSON array where each item has:
- "skill_name": skill name from list above
- "strand": maths strand
- "topic": topic area
- "urgency": "critical" | "moderate" | "minor"
- "percentageWrong": estimated % students who got this wrong (integer 0-100)
- "recommendation": one sentence action
- "questionNumbers": array of PAT question numbers (if identifiable)

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
      const sorted = [...items].sort((a,b) => ({ critical:0, moderate:1, minor:2 }[a.urgency]||1) - ({ critical:0, moderate:1, minor:2 }[b.urgency]||1))
      setResults(sorted)
      const initChecked = {}
      sorted.forEach((t, i) => { initChecked[i] = t.urgency !== 'minor' })
      setChecked(initChecked)
      showToast(`✓ Found ${sorted.length} skill gaps`)
    } catch (err) {
      showToast('Analysis error: ' + err.message)
    }
    setAnalysing(false)
  }

  async function doImport() {
    setImporting(true)
    const { data: existing } = await supabase.from('class_skills').select('skill_id').eq('class_id', cls)
    const existingIds = new Set((existing||[]).map(e => e.skill_id))
    let added = 0

    for (const [i, t] of results.entries()) {
      if (!checked[i]) continue
      const skill = skills.find(s => s.skill_name === t.skill_name) ||
                    skills.find(s => s.skill_name.toLowerCase().includes((t.skill_name||'').toLowerCase().substring(0,8)))
      if (!skill || existingIds.has(skill.id)) continue

      await supabase.from('class_skills').insert({
        class_id: cls, skill_id: skill.id, mastery: 1,
        last_reviewed: new Date(Date.now() - 86400000).toISOString(),
        from_pat: true, pat_urgency: t.urgency
      })
      added++
    }
    showToast(`✓ ${added} PAT gap${added !== 1 ? 's' : ''} added to review schedule`)
    setImporting(false)
  }

  const URGENCY_COLOURS = { critical: 'var(--red)', moderate: 'var(--org)', minor: 'var(--grn)' }
  const URGENCY_BADGES = { critical: 'badge-due', moderate: 'badge-soon', minor: 'badge-ok' }

  return (
    <div className="page-wrap">
      <div className="page-title">PAT Maths Data</div>
      <p className="page-sub">Upload your PAT results and the system identifies which skills need targeted review, then adds them to your daily review schedule.</p>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card card-pad">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>📊 Upload PAT CSV</div>
          <p style={{ fontSize: 12, color: 'var(--td)', marginBottom: 12 }}>Export from ACER as CSV. Include question responses (1=correct, 0=incorrect).</p>
          <input type="file" id="pat-file" accept=".csv,.txt" style={{ display: 'none' }} onChange={handleFile} />
          <div onClick={() => document.getElementById('pat-file').click()}
            style={{ border: '2px dashed var(--b2)', borderRadius: 'var(--r)', padding: '28px', textAlign: 'center', cursor: 'pointer', color: 'var(--tm)', fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
            Click to upload CSV
          </div>
          {fileName && <div style={{ fontSize: 11, color: 'var(--grn)', marginTop: 8 }}>✓ {fileName}</div>}
        </div>
        <div className="card card-pad">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>✏️ Or paste PAT results</div>
          <p style={{ fontSize: 12, color: 'var(--td)', marginBottom: 12 }}>Paste the raw ACER export or describe which questions students struggled with.</p>
          <textarea className="input textarea" value={pasteText} onChange={e => setPasteText(e.target.value)}
            placeholder={'StudentID,Q1,Q2,Q3...\nS001,1,0,1,0,1...\n\nOr describe results:\nStudents struggled with Q4 (fractions), Q7 (algebra), Q12 (geometry)...'} style={{ minHeight: 130 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Apply to class</label>
          <select className="input select" value={cls} onChange={e => setCls(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>PAT year level tested</label>
          <select className="input select" value={yr} onChange={e => setYr(e.target.value)}>
            {[5,6,7,8,9,10].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={doAnalyse} disabled={analysing} style={{ marginBottom: 24 }}>
        {analysing ? '⏳ Analysing...' : '🔍 Analyse PAT Data'}
      </button>

      {results.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>PAT Analysis — {results.length} skill gaps identified</div>
              <p style={{ fontSize: 12, color: 'var(--tm)', marginTop: 2 }}>Critical and moderate gaps pre-selected. Tick all to import.</p>
            </div>
            <button className="btn btn-primary" onClick={doImport} disabled={importing}>
              {importing ? 'Adding...' : 'Add Selected to Review Schedule'}
            </button>
          </div>
          <table className="data-table">
            <thead><tr><th>✓</th><th>Skill / Content Area</th><th>% Wrong</th><th>Urgency</th><th>PAT Questions</th><th>Recommendation</th></tr></thead>
            <tbody>
              {results.map((t, i) => {
                const strandCls = 'st-' + (t.strand||'').toLowerCase().split(' ')[0]
                return (
                  <tr key={i}>
                    <td><input type="checkbox" checked={checked[i]||false} onChange={e => setChecked(c => ({...c,[i]:e.target.checked}))} style={{ width:16,height:16,accentColor:'var(--acc)',cursor:'pointer' }} /></td>
                    <td>
                      <div style={{ fontWeight:600,fontSize:12 }}>{t.skill_name||'Unknown'}</div>
                      <div style={{ fontSize:10,color:'var(--tm)' }}>{t.strand} · {t.topic}</div>
                    </td>
                    <td>
                      <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,color:URGENCY_COLOURS[t.urgency] }}>{t.percentageWrong||'?'}%</div>
                    </td>
                    <td><span className={`badge ${URGENCY_BADGES[t.urgency]}`}>{t.urgency}</span></td>
                    <td style={{ fontSize:10,color:'var(--tm)',fontFamily:'var(--font-mono)' }}>{(t.questionNumbers||[]).join(', ')||'—'}</td>
                    <td style={{ fontSize:11,color:'var(--td)',maxWidth:200 }}>{t.recommendation||'—'}</td>
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
