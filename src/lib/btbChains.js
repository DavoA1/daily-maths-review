// ═══════════════════════════════════════════════════════════
// BEAT THE BOMB — CHAIN CHALLENGES
// Format: Start → op1 → op2 → op3 → op4 → = ?
// Each chain is seeded per skill topic
// ═══════════════════════════════════════════════════════════

// Helper to build a chain string
function chain(start, steps, result) {
  return `Start: ${start}\n${steps.join(' → ')}\n= ${result}`
}

export const BTC_CHAINS = {

  // ── NUMBER ──────────────────────────────────────────────
  'Integer operations': [
    chain(64, ['÷ 8', '× (-3)', '+ 15', '÷ (-3)'], '−5'),
    chain(-12, ['× (-4)', '− 18', '÷ 6', '× (-2)'], '−10'),
    chain(3, ['²', '× (-2)', '+ 50', '÷ (-4)'], '−8'),
  ],
  'Rounding': [
    chain(3.14159, ['round to 2 d.p.', '× 10', '− 1.4', 'round to 1 d.p.'], '29.9'),
    chain(0.00567, ['round to 2 s.f.', '× 1000', '+ 2.3', 'round to nearest integer'], '8'),
  ],
  'Fractions': [
    chain('½', ['+ ¼', '× 8', '− 2½', '÷ ½'], '3'),
    chain('¾', ['× 4', '− 1', '÷ ½', '+ 1⅓'], '8⅓'),
  ],
  'Ratios and Rates': [
    chain(120, ['split in ratio 1:3 → take larger part', '÷ 5', '× 3', '+ 12'], '66'),
    chain(250, ['find 20%', '× 3', '− 25', 'split in ratio 2:3 → take smaller part'], '25'),
  ],
  'Percentages': [
    chain(200, ['increase by 20%', 'decrease by 10%', 'find 25%', '× 6'], '324'),
    chain(400, ['decrease by 25%', 'increase by 10%', 'find 5%', '× 40'], '660'),
  ],
  'Simple interest': [
    chain(1000, ['SI: 5% p.a. for 3 yr', '+ original principal', '÷ 100', '× 8'], '124'),
    chain(2000, ['SI: 4% p.a. for 2 yr', 'add to principal', 'find 10%', '× 3'], '648'),
  ],
  'Compound interest': [
    chain(1000, ['CI: 10% for 2 yr → find A', '− 1000', '÷ 10', '+ 50'], '71'),
    chain(500, ['CI: 8% for 1 yr → find A', '÷ 5', '− 18', '× 4'], '352'),
  ],

  // ── ALGEBRA ─────────────────────────────────────────────
  'Algebraic expressions': [
    chain('x = 3', ['find x²', '+ 2x', '− 3', '÷ 6'], '2'),
    chain('a = -2, b = 3', ['find a² + b', '× 2', '− 1', '÷ 7'], '1'),
  ],
  'Expanding': [
    chain('2(x + 3)', ['expand', 'add 3x − 1', 'substitute x = 2', '÷ 3'], '5'),
    chain('−3(x − 4)', ['expand', 'add 2x + 1', 'substitute x = 5', '× (-1)'], '−16'),
  ],
  'Factorising': [
    chain('x² + 5x + 6', ['factorise', 'find positive root', '× 4', '− 1'], '11'),
    chain('x² − 9', ['factorise using DOTS', 'find positive root', 'square it', '− 5'], '4'),
  ],
  'Linear equations': [
    chain('2x + 5 = 17', ['solve for x', '× 3', '− 4', '÷ 2'], '7'),
    chain('3(x − 2) = 12', ['solve for x', '²', '÷ 4', '+ 1'], '5'),
  ],
  'Inequalities': [
    chain('3x − 1 > 8', ['solve for x', '× 2', '− 4', 'is result > 10?'], 'Yes: 14 > 10'),
    chain('−2x ≤ 10', ['solve for x', 'find smallest integer solution', '² ', '÷ 5'], '5'),
  ],
  'Simultaneous equations': [
    chain('x + y = 10, x − y = 4', ['solve: find x', '× y', '÷ 3', '+ 1'], '9'),
    chain('2x + y = 11, x + y = 7', ['solve: find x', '× 3', '+ y', '÷ 5'], '3'),
  ],
  'Formulas': [
    chain('v = u + at', ['u=5, a=3, t=4: find v', '÷ 17 × 100', 'round to nearest 10', '÷ 10'], '10'),
    chain('A = ½bh', ['b=8, h=6: find A', '+ 10', '÷ 7', '× 5'], '25'),
  ],
  'Linear graphs': [
    chain('y = 2x + 3', ['find y when x = 4', '− 3', '÷ 5', '× 10'], '20'),
    chain('(2,4) and (6,12)', ['find gradient', '× 3', '+ 1', '÷ 7'], '1'),
  ],
  'Midpoint and distance': [
    chain('(1,3) and (5,7)', ['find midpoint x-coord', '× 3', '− 2', '+ distance between points'], '14.66'),
    chain('(0,0) and (6,8)', ['find distance', '÷ 5', '× 3', '+ 7'], '13'),
  ],
  'Quadratic equations': [
    chain('x² + 7x + 12 = 0', ['factorise', 'find larger root', '× (-1)', '+ 20'], '17'),
    chain('x² − 5x + 6 = 0', ['solve', 'find product of roots', '× 3', '− 12'], '6'),
  ],
  'Parabolas': [
    chain('y = x² − 4x + 3', ['find x-intercepts', 'sum the roots', '× 2', '+ 3'], '11'),
    chain('y = (x−2)² + 1', ['find vertex y-value', '× 5', '÷ 5', 'add x-value of vertex'], '3'),
  ],

  // ── MEASUREMENT ─────────────────────────────────────────
  'Pythagoras': [
    chain('3, 4, ?', ['find hypotenuse', '× 2', '+ 1', '÷ 11'], '1'),
    chain('right triangle: legs 5, 12', ['find hypotenuse', '÷ 13', '× 10', '− 7'], '3'),
  ],
  'Trigonometry': [
    chain('sin 30°', ['× 20', '+ cos 60° × 10', '÷ 5', '× 2'], '6'),
    chain('tan 45°', ['× 8', '+ sin 90° × 2', '÷ 5', '× 3'], '6'),
  ],
  'Circumference and area': [
    chain('circle r = 5', ['find area (nearest whole)', '÷ 25', '× π', 'round to 1 d.p.'], '3.1'),
    chain('circle d = 8', ['find circumference (2 d.p.)', '÷ π', '× 2', 'round to nearest integer'], '16'),
  ],
  'Volume': [
    chain('cube side = 3', ['find volume', '÷ 9', '× 4', '+ 3'], '15'),
    chain('cylinder r=2, h=5', ['find volume (nearest whole)', '÷ 20', '× 3', 'round to 1 d.p.'], '1.9'),
  ],

  // ── INDICES ─────────────────────────────────────────────
  'Index notation': [
    chain('2⁴', ['evaluate', '÷ 8', '× 3', '+ 2⁰'], '7'),
    chain('(-3)²', ['evaluate', '+ (-3)³', '÷ (-18)', '× 4'], '−4'),
  ],
  'Index laws': [
    chain('x⁵ × x³', ['simplify: find index', '÷ 4', '+ x⁰ value', '× 3'], '9'),
    chain('a⁶ ÷ a²', ['simplify: find index', '²', '÷ 4', '+ 3'], '7'),
  ],
  'Scientific notation': [
    chain('4.5 × 10³', ['write as basic numeral', '÷ 900', '× 2', 'write in sci notation'], '1.0 × 10¹'),
    chain('3 × 10² × 2 × 10⁴', ['evaluate', '÷ 10⁵', '× 5', '+ 1'], '4'),
  ],
  'Surds': [
    chain('√50', ['simplify', 'multiply by √2', '÷ √2', 'square it'], '50'),
    chain('√12 + √27', ['simplify each', 'add them', 'square it', '÷ 3'], '75'),
  ],

  // ── GEOMETRY ────────────────────────────────────────────
  'Angles': [
    chain('triangle: 2 angles = 40°, 75°', ['find third angle', '÷ 5', '× 2', '− 6'], '24'),
    chain('exterior angle = 130°', ['find both non-adjacent interior angles if equal', 'sum them', '÷ 5', '× 3'], '78'),
  ],
  'Parallel lines': [
    chain('co-interior angles: one = 73°', ['find other', '÷ 107', '× 100', 'round to nearest 10'], '100'),
  ],
  'Polygons': [
    chain('hexagon', ['find angle sum', '÷ 6', '÷ 2', '+ 30'], '90'),
    chain('regular octagon', ['find each interior angle', '÷ 5', '× 3', '− 36'], '45'),
  ],

  // ── PROBABILITY & STATS ──────────────────────────────────
  'Probability': [
    chain('P(A) = 0.4', ['find P(not A)', '× 10', '− 1', '÷ 2'], '2.5'),
    chain('roll fair die', ['P(even) × 12', '+ P(>4) × 6', '÷ 4', '+ 1'], '4'),
  ],
  'Mean and median': [
    chain('3, 7, 8, 8, 9', ['find mean', '× 2', '− median', '÷ 3'], '5'),
    chain('2, 5, 5, 8, 10, 12', ['find median', '+ mean', '÷ 6', '× 2'], '4'),
  ],
}

// Map skill names to chain keys (fuzzy matching)
export function getChainsForSkill(skillName) {
  const name = (skillName || '').toLowerCase()
  for (const [key, chains] of Object.entries(BTC_CHAINS)) {
    if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name.split(' ')[0])) {
      return chains
    }
  }
  // Keyword fallbacks
  if (name.includes('expand')) return BTC_CHAINS['Expanding']
  if (name.includes('factoris')) return BTC_CHAINS['Factorising']
  if (name.includes('equation')) return BTC_CHAINS['Linear equations']
  if (name.includes('gradient') || name.includes('linear')) return BTC_CHAINS['Linear graphs']
  if (name.includes('pythag')) return BTC_CHAINS['Pythagoras']
  if (name.includes('trig')) return BTC_CHAINS['Trigonometry']
  if (name.includes('index') || name.includes('indic')) return BTC_CHAINS['Index laws']
  if (name.includes('surd')) return BTC_CHAINS['Surds']
  if (name.includes('quadrat')) return BTC_CHAINS['Quadratic equations']
  if (name.includes('parabola')) return BTC_CHAINS['Parabolas']
  if (name.includes('percent')) return BTC_CHAINS['Percentages']
  if (name.includes('fraction')) return BTC_CHAINS['Fractions']
  if (name.includes('probabilit')) return BTC_CHAINS['Probability']
  if (name.includes('statistic') || name.includes('mean') || name.includes('median')) return BTC_CHAINS['Mean and median']
  if (name.includes('angle') || name.includes('parallel')) return BTC_CHAINS['Angles']
  if (name.includes('area') || name.includes('volume') || name.includes('perimeter')) return BTC_CHAINS['Circumference and area']
  if (name.includes('simultaneous')) return BTC_CHAINS['Simultaneous equations']
  if (name.includes('inequalit')) return BTC_CHAINS['Inequalities']
  return null
}

// Pick a daily chain for a skill (rotates each day)
export function getDailyChain(skillName) {
  const chains = getChainsForSkill(skillName)
  if (!chains || !chains.length) return null
  const dayOfYear = Math.floor(Date.now() / 86400000)
  return chains[dayOfYear % chains.length]
}
