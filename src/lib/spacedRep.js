// ═══════════════════════════════════════════════════════════════
// SPACED REPETITION — Topic selection logic
// ═══════════════════════════════════════════════════════════════

const MS_PER_DAY = 86400000

function daysSince(isoDate) {
  if (!isoDate) return 999
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / MS_PER_DAY)
}

function latestRating(classSkill) {
  const h = classSkill.rating_history
  if (!Array.isArray(h) || !h.length) return null
  return h[h.length - 1].rating
}

function avgRecentRating(classSkill, n = 3) {
  const h = classSkill.rating_history
  if (!Array.isArray(h) || !h.length) return null
  const recent = h.slice(-n).map(r => r.rating)
  return recent.reduce((a, b) => a + b, 0) / recent.length
}

// ── INCLUSION TIERS ─────────────────────────────────────────
// Returns one of: 'intensive' | 'moderate' | 'light' | 'review' | null
export function getInclusionTier(cs) {
  const days = daysSince(cs.last_reviewed)
  const score = avgRecentRating(cs) || cs.mastery || 1

  // Must include — recent or struggling
  if (days <= 3 || score <= 2) return 'intensive'
  // Should include — getting there
  if (days <= 7 || score <= 3) return 'moderate'
  // Include for retrieval — doing ok
  if (days <= 14 || score <= 4) return 'light'
  // Long-term retrieval only — mastered
  if (days <= 30) return 'review'
  // Too old for automatic inclusion (but teacher can manually add)
  return null
}

// What slides each inclusion tier gets:
//   intensive: WC spotlight + MC spotlight + full bank
//   moderate:  T2 spotlight + MC spotlight + full bank
//   light:     MC spotlight + full bank
//   review:    full bank only

export function getDueConcepts(classSkills, maxTopics = 10) {
  const withTiers = classSkills
    .filter(cs => cs.skill) // must have skill data
    .map(cs => ({ cs, tier: getInclusionTier(cs) }))
    .filter(x => x.tier !== null)
    .sort((a, b) => {
      // Priority: intensive > moderate > light > review
      const order = { intensive: 0, moderate: 1, light: 2, review: 3 }
      if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier]
      // Within same tier: most recently reviewed first
      return daysSince(a.cs.last_reviewed) - daysSince(b.cs.last_reviewed)
    })

  return withTiers.slice(0, maxTopics).map(x => ({
    ...x.cs,
    _inclusionTier: x.tier
  }))
}

export function getUpcomingSkills(classSkills, daysAhead = 7) {
  return classSkills.filter(cs => {
    if (!cs.scheduled_date) return false
    const daysUntil = Math.ceil((new Date(cs.scheduled_date) - Date.now()) / MS_PER_DAY)
    return daysUntil >= 0 && daysUntil <= daysAhead
  })
}

export function getRetrievalGaps(classSkills) {
  return classSkills.filter(cs => {
    const days = daysSince(cs.last_reviewed)
    const score = avgRecentRating(cs) || cs.mastery || 1
    return days > 14 && days <= 60 && score >= 4
  }).slice(0, 3)
}

// ── Legacy helpers used by Dashboard ──────────────────────
export function isDue(classSkill) {
  return getInclusionTier(classSkill) !== null
}

export function getDueDate(classSkill) {
  if (classSkill.scheduled_date) return new Date(classSkill.scheduled_date)
  if (classSkill.last_reviewed) {
    const d = new Date(classSkill.last_reviewed)
    d.setDate(d.getDate() + 3)
    return d
  }
  return new Date()
}
