// Spaced repetition intervals in days
const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120]

export function getDueDate(classSkill) {
  if (!classSkill.last_reviewed) return new Date()
  const mastery = classSkill.mastery || 1
  const interval = INTERVALS[Math.min(mastery, INTERVALS.length - 1)] || 1
  const due = new Date(classSkill.last_reviewed)
  due.setDate(due.getDate() + interval)
  return due
}

export function isDue(classSkill) {
  return getDueDate(classSkill) <= new Date()
}

export function updateMastery(current, rating) {
  // rating 1-5: 1-2 = struggled, 3 = mixed, 4-5 = got it
  if (rating <= 2) return Math.max(1, current - 1)
  if (rating >= 4) return Math.min(7, current + 1)
  return current
}

export function getDueConcepts(classSkills, max = 15) {
  const now = new Date()
  const due = classSkills
    .filter(cs => getDueDate(cs) <= now)
    .sort((a, b) => getDueDate(a) - getDueDate(b))
  const upcoming = classSkills
    .filter(cs => getDueDate(cs) > now)
    .sort((a, b) => getDueDate(a) - getDueDate(b))
  return [...due, ...upcoming].slice(0, max)
}

export function getUpcomingSkills(classSkills, daysAhead = 14) {
  const now = new Date()
  const future = new Date(now.getTime() + daysAhead * 86400000)
  return classSkills
    .filter(cs => {
      if (!cs.scheduled_date) return false
      const d = new Date(cs.scheduled_date)
      return d > now && d <= future
    })
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
}

export function getRetrievalGaps(classSkills) {
  const now = new Date()
  return classSkills
    .filter(cs => {
      if (!cs.scheduled_date) return false
      const daysAgo = (now - new Date(cs.scheduled_date)) / 86400000
      return daysAgo > 28 && (cs.mastery || 1) < 4
    })
    .sort((a, b) => (a.mastery || 1) - (b.mastery || 1))
    .slice(0, 2)
}
