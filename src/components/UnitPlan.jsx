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
  const [parseMethod, setParseMethod] = useState('')

  useEffect(() => { loadClasses() }, [user])
  useEffect(() => { loadSkills(yr) }, [yr])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data?.length) setCls(data[0].id)
  }

  async function loadSkills(yearLevel) {
    const { data } = await supabase
      .from('skills')
      .select('id,skill_name,strand,topic,year_level,vc_code,prerequisites')
    setSkills(data || [])
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    // Always read as text - works for .txt, and gets readable content from .docx too
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target.result
      // Clean up any binary garbage from docx
      const clean = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ')
      setFileText(clean)
      showToast('File loaded — click Extract Topics')
    }
    reader.readAsText(file)
  }

  function smartParse(rawText, yearLevel) {
    const text = rawText.replace(/\s+/g, ' ').toLowerCase()
    const lines = rawText.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 3)
    const yearSkills = skills.filter(s => s.year_level == yearLevel)
    const allSkills = skills // also check other years for cross-year content

    const results = []
    const usedSkills = new Set()

    // Week/lesson number patterns
    const weekPatterns = [
      /week\s*(\d+)/i,
      /lesson\s*(\d+)/i,
      /unit\s*(\d+)/i,
      /term\s*\d+\s*week\s*(\d+)/i,
      /w(\d+)/i,
    ]

    let currentWeek = 0
    let currentWeekOffset = 0

    lines.forEach((line, lineIdx) => {
      const lineLower = line.toLowerCase()

      // Detect week number
      for (const pat of weekPatterns) {
        const m = line.match(pat)
        if (m) {
          currentWeek = parseInt(m[1])
          currentWeekOffset = (currentWeek - 1) * 7
          break
        }
      }

      // Try to match this line to a skill
      // Strategy 1: exact skill name match
      let match = yearSkills.find(s =>
        lineLower.includes(s.skill_name.toLowerCase()) ||
        s.skill_name.toLowerCase().split(' ').filter(w => w.length > 4).every(w => lineLower.includes(w))
      )

      // Strategy 2: topic match
      if (!match) {
        match = yearSkills.find(s =>
          s.topic && lineLower.includes(s.topic.toLowerCase())
        )
      }

      // Strategy 3: key maths words
      if (!match) {
        const mathKeywords = {
          'linear equation': 'Solving by substitution and elimination',
          'simultaneous': 'Solving by substitution and elimination',
          'quadratic': 'Sketching and interpreting parabolas',
          'parabola': 'Sketching and interpreting parabolas',
          'pythagoras': 'Finding missing sides and applications',
          'trigonometry': 'Finding sides and angles using trig ratios',
          'trig': 'Finding sides and angles using trig ratios',
          'index law': 'Index laws — multiplication and division',
          'indices': 'Index laws — multiplication and division',
          'surd': 'Simplifying surds',
          'scientific notation': 'Writing and calculating in scientific notation',
          'probability': 'Theoretical and experimental probability',
          'statistics': 'Comparing data sets — mean, median, IQR',
          'data': 'Comparing data sets — mean, median, IQR',
          'scatter': 'Scatter plots, correlation, line of best fit',
          'gradient': 'Gradient and y-intercept',
          'linear graph': 'Gradient and y-intercept',
          'financial': 'Simple and compound interest',
          'interest': 'Simple and compound interest',
          'circle': 'Circle properties and chord theorems',
          'congruent': 'Congruent triangles — conditions and proofs',
          'similar': 'Similar triangles — conditions and applications',
          'area': 'Area of composite shapes and sectors',
          'volume': 'Volume of prisms, cylinders, pyramids and spheres',
          'surface area': 'Surface area of prisms and cylinders',
          'factori': 'Factorising trinomials and special products',
          'expand': 'Expanding binomials',
          'rate': 'Solving rate and ratio problems in context',
          'ratio': 'Solving rate and ratio problems in context',
          'consumer': 'Applications — money, tax, discounts, wages',
          'coordinate': 'Midpoint, distance and gradient on the Cartesian plane',
          'angle': 'Angle proofs and geometric reasoning',
          'proof': 'Angle proofs and geometric reasoning',
        }
        for (const [kw, skillName] of Object.entries(mathKeywords)) {
          if (lineLower.includes(kw)) {
            match = yearSkills.find(s => s.skill_name === skillName) ||
                    yearSkills.find(s => s.skill_name.toLowerCase().includes(kw))
            if (match) break
          }
        }
      }

      if (match && !usedSkills.has(match.id)) {
        usedSkills.add(match.id)
        // Extract learning intention from nearby lines
        const li = lines.slice(lineIdx, lineIdx + 3)
          .find(l => /learning intention|students will|learn to|understand|apply/i.test(l))
        results.push({
          skill_id: match.id,
          skill_name: match.skill_name,
          strand: match.strand,
          topic: match.topic,
          weekOffset: currentWeekOffset,
          duration: 1,
          learningIntention: li ? li.replace(/learning intention[:\s]*/i, '').substring(0, 100) : '',
          inBank: true
        })
      }
    })

    return results
  }

  async function doParse() {
    const text = (fileText || pasteText || '').trim()
    if (!text || text.length < 10) {
      alert('Please upload a file or paste your unit plan text first.')
      return
    }
    setParsing(true)
    setParsed([])
    setParseMethod('')

    // Give React a moment to update UI
    await new Promise(r => setTimeout(r, 50))

    const results = smartParse(text, yr)

    if (results.length > 0) {
      setParsed(results)
      const initChecked = {}
      results.forEach((_, i) => { initChecked[i] = true })
      setChecked(initChecked)
      setParseMethod('keyword')
      showToast(`✓ Found ${results.length} topics`)
    } else {
      // Show all available skills for manual selection
      const yearSkills = skills.filter(s => s.year_level == yr)
      const manualItems = yearSkills.map(s => ({
        skill_id: s.id,
        skill_name: s.skill_name,
        strand: s.strand,
        topic: s.topic,
        weekOffset: 0,
        duration: 1,
        learningIntention: '',
        inBank: true
      }))
      setParsed(manualItems)
      const initChecked = {}
      // Uncheck all by default for manual mode
      manualItems.forEach((_, i) => { initChecked[i] = false })
      setChecked(initChecked)
      setParseMethod('manual')
      showToast('Could not auto-detect topics — select manually below')
    }

    setParsing(false)
  }

  async function doImport() {
    setImporting(true)
    const start = new Date(startDate)
    let added = 0

    const { data: existing } = await supabase
      .from('class_skills')
      .select('skill_id')
      .eq('class_id', cls)
    const existingIds = new Set((existing || []).map(e => e.skill_id))

    for (const [i, topic] of parsed.entries()) {
      if (!checked[i]) continue
      if (!topic.skill_id || existingIds.has(topic.skill_id)) continue

      const teachDate = new Date(start.getTime() + (topic.weekOffset || 0) * 86400000)
      const daysAgo = Math.round((Date.now() - teachDate.getTime()) / 86400000)

      const { error } = await supabase.from('class_skills').insert({
        class_id: cls,
        skill_id: topic.skill_id,
        mastery: 1,
        last_reviewed: daysAgo >= 0 ? teachDate.toISOString() : null,
        scheduled_date: teachDate.toISOString(),
        learning_intention: topic.learningIntention || '',
        from_unit_plan: true
      })
      if (!error) added++
    }

    showToast(`✓ ${added} topic${added !== 1 ? 's' : ''} imported to schedule`)
    setImporting(false)
    setParsed([])
    setChecked({})
    setFileText('')
    setPasteText('')
    setFileName('')
  }

  const selectedCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="page-wrap">
      <div className="page-title">Unit Plan Importer</div>
      <p className="page-sub">
        Upload your unit plan and the system extracts topics and dates, then schedules them into your review queue.
        Download your Google Doc as <strong>File → Download → Plain Text (.txt)</strong> for best results.
        Alternatively, paste the text directly.
      </p>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card card-pad">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>📄 Upload file</div>
          <p style={{ fontSize: 12, color: 'var(--td)', marginBottom: 12 }}>
            Best: Google Doc → File → Download → <strong>Plain Text (.txt)</strong>
            <br />Also works: .docx (text will be extracted)
          </p>
          <input type="file" id="up-file" accept=".txt,.docx,.doc" style={{ display: 'none' }} onChange={handleFile} />
          <div
            onClick={() => document.getElementById('up-file').click()}
            style={{ border: '2px dashed var(--b2)', borderRadius: 'var(--r)', padding: '28px', textAlign: 'center', cursor: 'pointer', color: 'var(--tm)', fontSize: 13, transition: 'border-color .2s' }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
            Click to choose file
          </div>
          {fileName && (
            <div style={{ fontSize: 11, color: 'var(--grn)', marginTop: 8 }}>✓ {fileName} loaded</div>
          )}
        </div>
        <div className="card card-pad">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>✏️ Paste text</div>
          <p style={{ fontSize: 12, color: 'var(--td)', marginBottom: 12 }}>
            Copy and paste your unit plan. Include week numbers and topic names for best matching.
          </p>
          <textarea
            className="input textarea"
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder={'Week 1: Introduction to Linear Equations\nLearning intention: Students will solve one and two-step equations\n\nWeek 2: Expanding and Factorising\nStudents will expand binomial products...\n\nWeek 3: Pythagoras Theorem...'}
            style={{ minHeight: 140 }}
          />
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
          <label>Year level</label>
          <select className="input select" value={yr} onChange={e => setYr(e.target.value)}>
            {[5,6,7,8,9,10,11,12].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={doParse} disabled={parsing} style={{ marginBottom: 24 }}>
        {parsing ? '⏳ Extracting topics...' : '🔍 Extract Topics'}
      </button>

      {parsed.length > 0 && (
        <>
          {parseMethod === 'keyword' && (
            <div style={{ padding: '10px 14px', background: 'rgba(74,240,160,.06)', border: '1px solid rgba(74,240,160,.25)', borderRadius: 'var(--rs)', fontSize: 12, color: 'var(--grn)', marginBottom: 14 }}>
              ✓ Matched {parsed.length} topics from your unit plan. Review the dates and check/uncheck as needed.
            </div>
          )}
          {parseMethod === 'manual' && (
            <div style={{ padding: '10px 14px', background: 'rgba(240,228,74,.06)', border: '1px solid rgba(240,228,74,.25)', borderRadius: 'var(--rs)', fontSize: 12, color: 'var(--acc)', marginBottom: 14 }}>
              ⚠ Could not auto-detect topics from the text. All Year {yr} skills are shown below — tick the ones in your unit plan and set the week offset (days from start date).
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              {parseMethod === 'manual' ? `Select topics for Year ${yr}` : `Extracted topics (${parsed.length})`}
              {selectedCount > 0 && <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--tm)', marginLeft: 8 }}>{selectedCount} selected</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { const all = {}; parsed.forEach((_,i) => all[i]=true); setChecked(all) }}>Select all</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setChecked({})}>Deselect all</button>
              <button className="btn btn-primary" onClick={doImport} disabled={importing || selectedCount === 0}>
                {importing ? 'Importing...' : `Import ${selectedCount} topic${selectedCount !== 1 ? 's' : ''} →`}
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>✓</th>
                <th>Skill</th>
                <th>Strand</th>
                <th>Days from start</th>
                <th>Lessons</th>
                <th>Learning intention</th>
              </tr>
            </thead>
            <tbody>
              {parsed.map((t, i) => {
                const strandCls = 'st-' + (t.strand || '').toLowerCase().split(' ')[0]
                const teachDate = new Date(new Date(startDate).getTime() + (t.weekOffset || 0) * 86400000)
                const dateStr = teachDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
                return (
                  <tr key={i} style={{ opacity: checked[i] ? 1 : 0.45 }}>
                    <td>
                      <input type="checkbox" checked={checked[i] || false}
                        onChange={e => setChecked(c => ({ ...c, [i]: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: 'var(--acc)', cursor: 'pointer' }} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{t.skill_name}</div>
                      <div style={{ fontSize: 10, color: 'var(--tm)' }}>{t.topic}</div>
                    </td>
                    <td><span className={`strand-tag ${strandCls}`}>{t.strand || '?'}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" value={t.weekOffset || 0} min={0}
                          onChange={e => setParsed(p => p.map((item, idx) => idx === i ? { ...item, weekOffset: parseInt(e.target.value) || 0 } : item))}
                          style={{ width: 56, padding: '3px 6px', background: 'var(--s2)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--tx)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                        <span style={{ fontSize: 10, color: 'var(--tm)' }}>{dateStr}</span>
                      </div>
                    </td>
                    <td>
                      <input type="number" value={t.duration || 1} min={1} max={20}
                        onChange={e => setParsed(p => p.map((item, idx) => idx === i ? { ...item, duration: parseInt(e.target.value) || 1 } : item))}
                        style={{ width: 48, padding: '3px 6px', background: 'var(--s2)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--tx)', fontSize: 11 }} />
                    </td>
                    <td>
                      <input type="text" value={t.learningIntention || ''}
                        placeholder="Optional..."
                        onChange={e => setParsed(p => p.map((item, idx) => idx === i ? { ...item, learningIntention: e.target.value } : item))}
                        style={{ width: '100%', padding: '3px 8px', background: 'var(--s2)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--tx)', fontSize: 11 }} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
            <button className="btn btn-primary" onClick={doImport} disabled={importing || selectedCount === 0} style={{ padding: '12px 28px' }}>
              {importing ? 'Importing...' : `Import ${selectedCount} topic${selectedCount !== 1 ? 's' : ''} to Schedule →`}
            </button>
          </div>
        </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
