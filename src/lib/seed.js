import { supabase } from './supabase.js'
import { CURRICULUM, enrichCurriculum } from './curriculum.js'

export async function seedAll() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not logged in')

  console.log('Starting seed...')
  let skillCount = 0
  let qCount = 0
  let qErrors = 0

  const enriched = enrichCurriculum(CURRICULUM)
  for (const skill of enriched) {
    // Upsert skill row
    const { data: skillRow, error: skillErr } = await supabase
      .from('skills')
      .upsert({
        year_level: skill.year,
        strand: skill.strand,
        topic: skill.topic,
        skill_name: skill.skill,
        vc_code: skill.vc,
        prerequisites: skill.prereqs || [],
        btb_easy: skill.btbEasy,
        btb_hard: skill.btbHard,
        is_shared: true,
        created_by: user.id
      }, { onConflict: 'year_level,strand,topic,skill_name' })
      .select('id')
      .single()

    if (skillErr) {
      console.error('Skill error:', skillErr.message, skill.skill)
      continue
    }

    skillCount++
    const skillId = skillRow.id

    // Delete existing questions for this skill then re-insert cleanly
    await supabase.from('questions').delete().eq('skill_id', skillId)

    const questions = (skill.questions || []).map(q => ({
      skill_id: skillId,
      tier: q.tier,
      question_text: q.q,
      answer_text: q.a,
      question_type: q.type || 'std',
      vc_code: q.vc || skill.vc || null,
      is_shared: true,
      created_by: user.id
    }))

    if (questions.length > 0) {
      const { data: inserted, error: qErr } = await supabase
        .from('questions')
        .insert(questions)
        .select('id')

      if (qErr) {
        console.error('Questions error for', skill.skill, ':', qErr.message)
        qErrors++
      } else {
        qCount += inserted?.length || 0
      }
    }
  }

  console.log(`Seed complete: ${skillCount} skills, ${qCount} questions, ${qErrors} errors`)
  return { skillCount, qCount, qErrors }
}
