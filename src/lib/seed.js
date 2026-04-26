// Run this ONCE to populate Supabase with all curriculum questions
// Open browser console on your deployed app and call: import('/src/lib/seed.js').then(m => m.seedAll())
// OR run via the Settings page (seed button)

import { supabase } from './supabase.js'
import { CURRICULUM } from './curriculum.js'

export async function seedAll() {
  console.log('Seeding curriculum...')
  let skillCount = 0, qCount = 0

  for (const skill of CURRICULUM) {
    // Upsert skill
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
        created_by: (await supabase.auth.getUser()).data.user?.id
      }, { onConflict: 'year_level,strand,topic,skill_name' })
      .select()
      .single()

    if (skillErr) { console.error('Skill error:', skillErr.message, skill.skill); continue }
    skillCount++

    // Insert questions
    for (const q of (skill.questions || [])) {
      const { error: qErr } = await supabase.from('questions').upsert({
        skill_id: skillRow.id,
        tier: q.tier,
        question_text: q.q,
        answer_text: q.a,
        question_type: q.type || 'std',
        vc_code: q.vc || skill.vc,
        is_shared: true,
        created_by: skillRow.created_by
      }, { onConflict: 'skill_id,tier,question_text' })
      if (!qErr) qCount++
    }
  }
  console.log(`Done: ${skillCount} skills, ${qCount} questions seeded`)
  return { skillCount, qCount }
}
