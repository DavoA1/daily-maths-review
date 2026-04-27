import { supabase } from './supabase.js'
import { CURRICULUM, enrichCurriculum } from './curriculum.js'
import { CAMBRIDGE_Y9 } from './cambridge_y9.js'

export async function seedAll() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not logged in')

  console.log('Starting seed...')
  let skillCount = 0, qCount = 0, qErrors = 0

  // Combine all curriculum sources
  const allSkills = [...enrichCurriculum(CURRICULUM), ...CAMBRIDGE_Y9]

  for (const skill of allSkills) {
    // Upsert the skill — if it already exists, get back its ID
    const { data: skillRow, error: skillErr } = await supabase
      .from('skills')
      .upsert({
        year_level: skill.year,
        strand: skill.strand,
        topic: skill.topic,
        skill_name: skill.skill,
        vc_code: skill.vc || '',
        prerequisites: skill.prereqs || skill.prerequisites || [],
        btb_easy: skill.btbEasy || skill.btb_easy || '',
        btb_hard: skill.btbHard || skill.btb_hard || '',
        btb_chain: skill.btbChain || skill.btb_chain || '',
        is_shared: true,
        created_by: user.id
      }, { onConflict: 'year_level,strand,topic,skill_name', ignoreDuplicates: false })
      .select('id')
      .single()

    if (skillErr) {
      console.error('Skill error:', skillErr.message, skill.skill)
      continue
    }

    // Defensive fallback: if upsert returned no id (Supabase quirk on unchanged rows),
    // fetch the existing row by its unique key
    let skillId = skillRow?.id
    if (!skillId) {
      const { data: existing } = await supabase
        .from('skills')
        .select('id')
        .eq('year_level', skill.year)
        .eq('strand', skill.strand)
        .eq('topic', skill.topic)
        .eq('skill_name', skill.skill)
        .single()
      skillId = existing?.id
    }
    if (!skillId) {
      console.error('Could not get skill ID for:', skill.skill)
      continue
    }

    skillCount++

    // Delete existing questions then re-insert
    await supabase.from('questions').delete().eq('skill_id', skillId)

    const questions = (skill.questions || []).map(q => ({
      skill_id: skillId,
      tier: q.tier,
      question_text: q.q,
      answer_text: q.a,
      question_type: q.type || 'std',
      vc_code: q.vc || skill.vc || null,
      image_url: q.image_url || null,
      is_shared: true,
      created_by: user.id
    }))

    if (questions.length > 0) {
      const { data: inserted, error: qErr } = await supabase
        .from('questions').insert(questions).select('id')
      if (qErr) { console.error('Q error for', skill.skill, ':', qErr.message); qErrors++ }
      else qCount += inserted?.length || 0
    }
  }

  console.log(`Seed complete: ${skillCount} skills, ${qCount} questions, ${qErrors} errors`)
  return { skillCount, qCount, qErrors }
}
