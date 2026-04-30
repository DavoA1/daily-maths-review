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
    chain(64, ['÷ 8', '× (−3)', '+ 15', '÷ (−3)', '× 4'], '−20'),
    chain(-12, ['× (−4)', '− 18', '÷ 6', '× (−2)', '+ 3'], '−7'),
    chain(3, ['²', '× (−2)', '+ 50', '÷ (−4)', '− 5'], '−17'),
  ],
  'Rounding': [
    chain(3.14159, ['round to 2 d.p.', '× 10', '− 1.4', 'round to 1 d.p.', '× 3'], '89.7'),
    chain(0.00567, ['round to 2 s.f.', '× 1000', '+ 2.3', 'round to nearest integer', '÷ 2'], '4'),
  ],
  'Fractions': [
    chain('1/2', ['+ 1/4', '× 8', '− 2½', '÷ 1/2', '+ 1'], '4'),
    chain('3/4', ['× 4', '− 1', '÷ 1/2', '+ 1', '÷ 3'], '3'),
  ],
  'Ratios and Rates': [
    chain(120, ['split 1:3 → larger part', '÷ 5', '× 3', '+ 12', '÷ 6'], '11'),
    chain(250, ['find 20%', '× 3', '− 25', 'split 2:3 → smaller part', '× 4'], '100'),
  ],
  'Percentages': [
    chain(200, ['increase by 20%', 'decrease by 10%', 'find 25%', '× 6', '+ 4'], '328'),
    chain(400, ['decrease by 25%', 'increase by 10%', 'find 5%', '× 40', '− 60'], '600'),
  ],
  'Simple interest': [
    chain(1000, ['SI: 5%pa for 3yr → interest', '÷ 10', '× 3', '+ 500', '÷ 10'], '65'),
    chain(2000, ['SI: 4%pa for 2yr → interest', '+ 2000', '÷ 100', '× 3', '+ 7'], '55'),
  ],
  'Compound interest': [
    chain(1000, ['CI 10% 2yr → total amount', '− 1000', '÷ 10', '+ 50', '÷ 3'], '27'),
    chain(500, ['CI 8% for 1yr → total amount', '÷ 5', '− 18', '× 4', '− 52'], '300'),
  ],

  // ── ALGEBRA ─────────────────────────────────────────────
  'Algebraic expressions': [
    chain('x = 3', ['find x²', '+ 2x', '− 3', '÷ 6', '× 5'], '10'),
    chain('a=−2, b=3', ['find a² + b', '× 2', '− 1', '÷ 7', '+ 6'], '7'),
  ],
  'Expanding': [
    chain('2(x+3)', ['expand', 'add 3x−1', 'substitute x=2', '÷ 3', '× 2'], '10'),
    chain('−3(x−4)', ['expand', 'add 2x+1', 'substitute x=5', '× (−1)', '+ 4'], '12'),
  ],
  'Factorising': [
    chain('x²+5x+6', ['factorise', 'positive root', '× 4', '− 1', '÷ 11'], '1'),
    chain('x²−9', ['factorise DOTS', 'positive root', 'square it', '− 5', '× 2'], '8'),
  ],
  'Linear equations': [
    chain('2x+5=17', ['solve for x', '× 3', '− 4', '÷ 2', '+ 1'], '8'),
    chain('3(x−2)=12', ['solve for x', '²', '÷ 4', '+ 1', '× 2'], '10'),
  ],
  'Inequalities': [
    chain('3x−1>8', ['solve: find min integer x', '× 2', '− 4', '÷ 2', '+ 5'], '7'),
    chain('−2x≤10', ['solve: find max x', '² ', '÷ 5', '+ 5', '× 2'], '30'),
  ],
  'Simultaneous equations': [
    chain('x+y=10, x−y=4', ['solve: find x', '+ y', '÷ 3', '× 2', '− 1'], '9'),
    chain('2x+y=11, x+y=7', ['solve: find x', '× 3', '+ y', '÷ 5', '× 2'], '6'),
  ],
  'Formulas': [
    chain('v=u+at', ['u=5,a=3,t=4: find v', '− 7', '× 2', '÷ 3', '+ 1'], '11'),
    chain('A=½bh', ['b=8,h=6: find A', '+ 10', '÷ 7', '× 5', '− 10'], '15'),
  ],
  'Linear graphs': [
    chain('y=2x+3', ['y when x=4', '− 3', '÷ 5', '× 10', '+ 5'], '25'),
    chain('(2,4) and (6,12)', ['find gradient', '× 3', '+1', '÷ 7', '× 4'], '4'),
  ],
  'Midpoint and distance': [
    chain('(1,3) and (5,7)', ['midpoint x-coord', '× 3', '− 2', '+ 4', '÷ 5'], '2'),
    chain('(0,0) and (6,8)', ['find distance', '÷ 5', '× 3', '+ 7', '− 10'], '3'),
  ],
  'Quadratic equations': [
    chain('x²+7x+12=0', ['factorise', 'larger root', '× (−1)', '+ 20', '÷ 3'], '4'),
    chain('x²−5x+6=0', ['solve', 'product of roots', '× 3', '− 12', '+ 6'], '0'),
  ],
  'Parabolas': [
    chain('y=x²−4x+3', ['x-intercepts', 'sum the roots', '× 2', '+ 3', '− 1'], '10'),
    chain('y=(x−2)²+1', ['vertex y-value', '× 5', '÷ 5', '+ x-value', '² '], '9'),
  ],

  // ── MEASUREMENT ─────────────────────────────────────────
  'Pythagoras': [
    chain('a=3, b=4', ['find c', '× 2', '+ 1', '÷ 11', '× 5'], '5'),
    chain('c=13, b=12', ['find a', '+ 7', '÷ 4', '× 3', '− 3'], '6'),
  ],
  'Trigonometry': [
    chain('sin 30°', ['× 20', '+ cos60° × 10', '÷ 5', '× 3', '− 2'], '16'),
    chain('tan 45°', ['× 8', '+ sin90° × 2', '÷ 5', '× 3', '+ 6'], '12'),
  ],
  'Circumference and area': [
    chain('circle r=5', ['area nearest whole', '÷ 25', '× 10', 'round to 1dp', '× 2'], '6.2'),
    chain('circle d=8', ['circumference 2dp', '÷ 4', 'round to nearest whole', '× 2', '+ 2'], '14'),
  ],
  'Volume': [
    chain('cube side=3', ['find volume', '÷ 9', '× 4', '+ 3', '× 2'], '30'),
    chain('cylinder r=2, h=5', ['volume nearest whole', '÷ 20', '× 3', 'round 1dp', '+ 1'], '5.9'),
  ],

  // ── INDICES ─────────────────────────────────────────────
  'Index notation': [
    chain('2⁴', ['evaluate', '÷ 8', '× 3', '+ 2⁰', '× 4'], '28'),
    chain('(−3)²', ['evaluate', '+ (−3)³', '÷ (−18)', '× 4', '+ 9'], '5'),
  ],
  'Index laws': [
    chain('x⁵ × x³', ['simplify: find index', '÷ 4', '+ 1', '× 3', '− 2'], '7'),
    chain('a⁶ ÷ a²', ['simplify: find index', '²', '÷ 4', '+ 3', '× 2'], '14'),
  ],
  'Scientific notation': [
    chain('4.5 × 10³', ['basic numeral', '÷ 900', '× 2', '+ 3', '× 2'], '14'),
    chain('3×10² × 2×10⁴', ['evaluate', '÷ 10⁵', '× 5', '+ 1', '× 3'], '12'),
  ],
  'Surds': [
    chain('√50', ['simplify', '× √2', '÷ √2', 'square it', '÷ 10'], '5'),
    chain('√12 + √27', ['simplify each', 'add them', 'square it', '÷ 3', '− 25'], '50'),
  ],

  // ── GEOMETRY ────────────────────────────────────────────
  'Angles': [
    chain('angles: 40°, 75°', ['find 3rd angle', '÷ 5', '× 2', '− 6', '+ 10'], '34'),
    chain('exterior angle=130°', ['both interior angles if equal', 'sum them', '÷ 5', '× 3', '− 3'], '75'),
  ],
  'Parallel lines': [
    chain('co-interior: one=73°', ['find other', '÷ 107', '× 100', '÷ 10', '× 3'], '30'),
  ],
  'Polygons': [
    chain('hexagon', ['angle sum', '÷ 6', '÷ 2', '+ 30', '× 2'], '180'),
    chain('regular octagon', ['each interior angle', '÷ 5', '× 3', '− 36', '+ 1'], '100'),
  ],

  // ── PROBABILITY & STATS ──────────────────────────────────
  'Probability': [
    chain('P(A)=0.4', ['P(not A)', '× 10', '− 1', '÷ 2', '× 4'], '10'),
    chain('fair die', ['P(even) × 12', '+ P(>4) × 6', '÷ 4', '× 2', '− 1'], '7'),
  ],
  'Mean and median': [
    chain('3,7,8,8,9', ['find mean', '× 2', '− median', '÷ 3', '+ 1'], '6'),
    chain('2,5,5,8,10,12', ['find median', '+ mean', '÷ 6', '× 2', '− 1'], '3'),
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
