// ── HOMEWORK PRINT PAGE ──────────────────────────────────────
// Opens in new tab, styled for A4 print

export function openHomeworkPrint(slides, className = '', teachDate = '') {
  // Collect T3/T4 questions from all bank slides
  const sections = []
  slides.forEach(slide => {
    if (!slide.isBank && !slide.questions?.length) return
    if (slide.isExplanation || slide.isFoundational) return
    const skillName = slide.skill?.skill_name || ''
    const t3 = (slide.questions || []).filter(q => q.tier === 3)
    const t4 = (slide.questions || []).filter(q => q.tier === 4)
    const qs = [...t3, ...t4]
    if (!qs.length) return
    // Deduplicate by skill
    if (!sections.find(s => s.skill === skillName)) {
      sections.push({ skill: skillName, qs })
    }
  })

  if (!sections.length) {
    alert('No T3/T4 questions found in current slides. These are the extension and challenge questions used for homework.')
    return
  }

  const date = teachDate || new Date().toLocaleDateString('en-AU', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  const qCount = sections.reduce((s, sec) => s + sec.qs.length, 0)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Daily Maths Review — Homework</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: white; padding: 0; }
    @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; }
      .page-break { page-break-before: always; }
    }

    /* Print button */
    .print-bar { background: #1e2230; color: white; padding: 12px 24px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 10; }
    .print-btn { background: #4ac8f0; color: #0f172a; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 700; font-size: 14px; cursor: pointer; }
    .close-btn { background: transparent; color: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.2); padding: 8px 16px; border-radius: 6px; font-size: 13px; cursor: pointer; margin-left: auto; }

    /* Page header */
    .page-header { border-bottom: 3px solid #1e2230; padding-bottom: 10px; margin-bottom: 20px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 22px; font-weight: 800; color: #1e2230; }
    .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
    .meta { text-align: right; font-size: 12px; color: #64748b; }
    .meta strong { display: block; font-size: 14px; color: #1e2230; }

    /* Name/date fields */
    .fields { display: flex; gap: 20px; margin: 14px 0 20px; }
    .field-box { flex: 1; }
    .field-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
    .field-line { border-bottom: 1.5px solid #1e2230; height: 24px; }

    /* Skill sections */
    .skill-section { margin-bottom: 24px; break-inside: avoid; }
    .skill-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .skill-name { font-size: 14px; font-weight: 700; color: #1e2230; }
    .tier-badge { font-size: 10px; padding: 2px 7px; border-radius: 4px; font-weight: 700; }
    .t3-badge { background: #fef3c7; color: #92400e; }
    .t4-badge { background: #fce7f3; color: #9d174d; }

    /* Question grid */
    .q-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .q-grid.single { grid-template-columns: 1fr; }
    .q-box { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; break-inside: avoid; }
    .q-box.challenge { border-color: #f9a8d4; background: #fdf2f8; }
    .q-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
    .q-label.challenge { color: #db2777; }
    .q-text { font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6; color: #1e293b; }
    .q-image { max-width: 100%; max-height: 120px; object-fit: contain; margin-top: 8px; border-radius: 4px; }
    .answer-space { border-bottom: 1px solid #e2e8f0; margin-top: 10px; height: 20px; }

    /* Answer section */
    .answers-section { margin-top: 32px; border-top: 2px dashed #e2e8f0; padding-top: 16px; }
    .answers-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
    .answer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .answer-item { font-size: 11px; color: #475569; padding: 4px 0; }
    .answer-item strong { color: #1e2230; }

    /* Footer */
    .page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
  </style>
</head>
<body>

<div class="print-bar no-print">
  <div>
    <div style="font-weight:700;font-size:15px">Daily Maths Review — Homework Sheet</div>
    <div style="font-size:12px;opacity:.7">${qCount} questions across ${sections.length} skills · T3 = Extension · T4 = Challenge</div>
  </div>
  <button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
  <button class="close-btn" onclick="window.close()">✕ Close</button>
</div>

<div style="padding: 24px 28px; max-width: 820px; margin: 0 auto;">

  <div class="page-header">
    <div class="header-top">
      <div>
        <div class="title">Daily Maths Review — Homework</div>
        <div class="subtitle">${className ? className + ' · ' : ''}${date}</div>
      </div>
      <div class="meta">
        <strong>${qCount} Questions</strong>
        ${sections.length} topic${sections.length !== 1 ? 's' : ''}
      </div>
    </div>
  </div>

  <div class="fields">
    <div class="field-box"><div class="field-label">Student Name</div><div class="field-line"></div></div>
    <div class="field-box"><div class="field-label">Date Completed</div><div class="field-line"></div></div>
    <div class="field-box" style="max-width:100px"><div class="field-label">Score</div><div class="field-line"></div></div>
  </div>

  ${sections.map((sec, si) => `
  <div class="skill-section">
    <div class="skill-header">
      <span class="skill-name">${sec.skill}</span>
      ${sec.qs.some(q => q.tier === 3) ? '<span class="tier-badge t3-badge">Extension</span>' : ''}
      ${sec.qs.some(q => q.tier === 4) ? '<span class="tier-badge t4-badge">Challenge</span>' : ''}
    </div>
    <div class="q-grid${sec.qs.length === 1 ? ' single' : ''}">
      ${sec.qs.map((q, qi) => {
        const isChallenge = q.tier === 4
        const qtext = q.question_text || q.q || ''
        const img = q.image_url || ''
        return `
      <div class="q-box${isChallenge ? ' challenge' : ''}">
        <div class="q-label${isChallenge ? ' challenge' : ''}">${isChallenge ? '🏆 Challenge' : `Q${qi + 1}`}</div>
        <div class="q-text">${qtext.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        ${img ? `<img src="${img}" class="q-image" alt="" />` : ''}
        <div class="answer-space"></div>
      </div>`
      }).join('')}
    </div>
  </div>`).join('')}

  <div class="answers-section">
    <div class="answers-title">✓ Answers</div>
    <div class="answer-grid">
      ${sections.flatMap(sec => sec.qs.map((q, qi) => {
        const atext = q.answer_text || q.a || '—'
        const qtext = (q.question_text || q.q || '').slice(0, 30)
        return `<div class="answer-item"><strong>${sec.skill.split(' ')[0]} Q${qi+1}:</strong> ${atext.replace(/</g,'&lt;')}</div>`
      })).join('')}
    </div>
  </div>

  <div class="page-footer">
    <span>Daily Maths Review · Victorian Curriculum Year 9</span>
    <span>${date}</span>
  </div>

</div>
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}
