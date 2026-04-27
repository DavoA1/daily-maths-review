// ═══════════════════════════════════════════════════════════
// QUESTION GENERATOR — algorithmic T1/T2 question generation
// Produces fresh questions every call — no repeats
// ═══════════════════════════════════════════════════════════

// Seeded random so questions are consistent within a session but vary day-to-day
let _seed = Date.now()
function rng() {
  _seed = (_seed * 1664525 + 1013904223) & 0xffffffff
  return ((_seed >>> 0) / 0xffffffff)
}
function rand(min, max) { return Math.floor(rng() * (max - min + 1)) + min }
function pick(arr) { return arr[Math.floor(rng() * arr.length)] }
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Reseed each call so answers are always fresh
export function reseed() { _seed = Date.now() + Math.random() * 1000000 }

// ─── MATHS HELPERS ───────────────────────────────────────────
function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b) }
function simplify(n, d) { const g = gcd(Math.abs(n), Math.abs(d)); return [n/g, d/g] }
function fracStr(n, d) {
  if (d === 1) return `${n}`
  const [sn, sd] = simplify(n, d)
  if (sd < 0) return fracStr(-sn, -sd)
  const whole = Math.floor(Math.abs(sn) / sd)
  const rem = Math.abs(sn) % sd
  const sign = sn < 0 ? '−' : ''
  if (rem === 0) return `${sn}`
  if (whole === 0) return `${sign}${Math.abs(sn)}⁄${sd}`
  return `${sign}${whole} ${rem}⁄${sd}`
}
function pyTriples() {
  return [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41],[6,8,10],[9,12,15],[12,16,20],[15,20,25]]
}

// ─── GENERATORS ──────────────────────────────────────────────
// Each returns { tier, type, q, a } or null

const GENERATORS = {

  // ── INTEGER OPERATIONS / BIDMAS ──────────────────────────
  'VC2M9N01_bidmas_t1': () => {
    const templates = [
      () => { const a=rand(2,9),b=rand(2,9),c=rand(1,9); return { q:`${a} × ${b} − ${c}`, a:`${a*b-c}` } },
      () => { const a=rand(2,12),b=rand(2,6),c=rand(1,8); return { q:`${a*b} ÷ ${b} + ${c}`, a:`${a+c}` } },
      () => { const a=rand(-9,-2),b=rand(2,8); return { q:`${a} × ${b}`, a:`${a*b}` } },
      () => { const a=rand(-12,-2),b=rand(-8,-2); return { q:`${a} × (${b})`, a:`${a*b}` } },
      () => { const a=rand(2,8); return { q:`(−${a})²`, a:`${a*a}` } },
      () => { const a=rand(2,5); return { q:`−${a}²`, a:`${-(a*a)}` } },
      () => { const a=rand(2,4); return { q:`(−${a})³`, a:`${-(a*a*a)}` } },
      () => { const a=rand(1,9),b=rand(1,9),c=rand(2,6); return { q:`${a} + ${b} × ${c}`, a:`${a+b*c}` } },
      () => { const a=rand(10,30),b=rand(2,9); return { q:`(${a} − ${b}) × ${rand(2,4)}`, a:`${(a-b)*rand(2,4)}` } },
    ]
    const t = pick(templates)()
    return { tier:1, type:'std', q:`Evaluate: ${t.q}`, a:t.a }
  },

  'VC2M9N01_bidmas_t2': () => {
    const templates = [
      () => { const a=rand(2,5),b=rand(2,8),c=rand(1,6),d=rand(1,5); return { q:`${a} × ${b} − ${c} × ${d}`, a:`${a*b-c*d}` } },
      () => { const a=rand(-6,-2),b=rand(3,8),c=rand(1,6); return { q:`${a} × ${b} + (${c})`, a:`${a*b+c}` } },
      () => { const a=rand(2,6),b=rand(2,4),c=rand(1,8); return { q:`${a}³ − ${c}`, a:`${Math.pow(a,3)-c}` } },
      () => { const sq=[4,9,16,25,36,49,64],s=pick(sq),r=Math.sqrt(s),a=rand(1,8); return { q:`√${s} + ${a}²`, a:`${r+a*a}` } },
      () => { const a=rand(2,5),b=rand(2,5),c=rand(2,4); return { q:`(${a} + ${b}) × ${c} − ${rand(1,8)}`, a:`${(a+b)*c-rand(1,8)}` } },
      () => { const a=rand(2,8),b=rand(2,4); return { q:`${a*b} ÷ ${b} × ${rand(2,5)}`, a:`${a*rand(2,5)}` } },
    ]
    const t = pick(templates)()
    return { tier:2, type:'std', q:`Evaluate: ${t.q}`, a:t.a }
  },

  // ── ROUNDING ─────────────────────────────────────────────
  'VC2M9N02_round_t1': () => {
    const dp = pick([1,2,3])
    const n = (rand(100,9999)/100).toFixed(4)
    const rounded = parseFloat(n).toFixed(dp)
    return { tier:1, type:'std', q:`Round ${n} to ${dp} d.p.`, a:rounded }
  },
  'VC2M9N02_sf_t1': () => {
    const sf = pick([1,2,3])
    const templates = [
      () => { const n=rand(10000,999999); return { n, r:parseFloat(n.toPrecision(sf)) } },
      () => { const n=parseFloat((rand(1,999)/10000).toFixed(6)); return { n, r:parseFloat(n.toPrecision(sf)) } },
    ]
    const t = pick(templates)()
    return { tier:1, type:'std', q:`Round ${t.n} to ${sf} s.f.`, a:`${t.r}` }
  },

  // ── FRACTIONS ────────────────────────────────────────────
  'VC2M9N04_frac_add_t1': () => {
    const d1=pick([2,3,4,5,6,8,10]),n1=rand(1,d1-1)
    const d2=pick([2,3,4,5,6,8,10]),n2=rand(1,d2-1)
    const lcd=d1*d2/gcd(d1,d2)
    const rn=n1*(lcd/d1)+n2*(lcd/d2)
    return { tier:1, type:'std', q:`${fracStr(n1,d1)} + ${fracStr(n2,d2)} =`, a:fracStr(rn,lcd) }
  },
  'VC2M9N04_frac_mult_t1': () => {
    const d1=pick([2,3,4,5,6]),n1=rand(1,d1-1)
    const d2=pick([2,3,4,5,6]),n2=rand(1,d2-1)
    const [rn,rd]=simplify(n1*n2,d1*d2)
    return { tier:1, type:'std', q:`${fracStr(n1,d1)} × ${fracStr(n2,d2)} =`, a:fracStr(rn,rd) }
  },
  'VC2M9N04_frac_div_t1': () => {
    const d1=pick([2,3,4,5]),n1=rand(1,d1-1)
    const d2=pick([2,3,4,5]),n2=rand(1,d2-1)
    const [rn,rd]=simplify(n1*d2,d1*n2)
    return { tier:1, type:'std', q:`${fracStr(n1,d1)} ÷ ${fracStr(n2,d2)} =`, a:fracStr(rn,rd) }
  },

  // ── PERCENTAGES ──────────────────────────────────────────
  'VC2M9N07_perc_t1': () => {
    const pcts=[5,10,12.5,15,20,25,30,33,40,50,75]
    const p=pick(pcts), amts=[20,40,50,60,80,100,120,150,200,250,400,500]
    const amt=pick(amts)
    const ans=p*amt/100
    return { tier:1, type:'std', q:`Find ${p}% of $${amt}`, a:`$${ans%1===0?ans:ans.toFixed(2)}` }
  },
  'VC2M9N07_perc_increase_t2': () => {
    const pcts=[5,10,15,20,25,30]
    const p=pick(pcts), amts=[80,100,120,150,200,250,300,400]
    const amt=pick(amts)
    const ans=amt*(1+p/100)
    return { tier:2, type:'std', q:`Increase $${amt} by ${p}%`, a:`$${ans%1===0?ans:ans.toFixed(2)}` }
  },
  'VC2M9N07_perc_decrease_t2': () => {
    const pcts=[5,10,15,20,25,30]
    const p=pick(pcts), amts=[80,100,120,150,200,250,300,400]
    const amt=pick(amts)
    const ans=amt*(1-p/100)
    return { tier:2, type:'std', q:`Decrease $${amt} by ${p}%`, a:`$${ans%1===0?ans:ans.toFixed(2)}` }
  },

  // ── SUBSTITUTION ─────────────────────────────────────────
  'VC2M9A01_sub_t1': () => {
    const a=rand(2,9),b=rand(-5,5),c=rand(1,6),x=pick([-3,-2,-1,1,2,3,4,5])
    const templates=[
      {q:`${a}x + ${b}`, fn:x=>a*x+b},
      {q:`x² + ${b}`, fn:x=>x*x+b},
      {q:`${c}x² − ${a}`, fn:x=>c*x*x-a},
      {q:`−${a}x + ${c}`, fn:x=>-a*x+c},
      {q:`x³`, fn:x=>x*x*x},
    ]
    const t=pick(templates)
    return { tier:1, type:'std', q:`Evaluate ${t.q} when x = ${x}`, a:`${t.fn(x)}` }
  },
  'VC2M9A01_sub_t2': () => {
    const a=rand(2,5),b=rand(2,5),x=pick([-3,-2,-1,1,2,3]),y=pick([-3,-2,-1,1,2,3])
    const templates=[
      {q:`${a}x + ${b}y`, fn:(x,y)=>a*x+b*y},
      {q:`x² − y²`, fn:(x,y)=>x*x-y*y},
      {q:`(x + y)²`, fn:(x,y)=>(x+y)*(x+y)},
      {q:`${a}x² + ${b}y`, fn:(x,y)=>a*x*x+b*y},
    ]
    const t=pick(templates)
    return { tier:2, type:'std', q:`x=${x}, y=${y}: evaluate ${t.q}`, a:`${t.fn(x,y)}` }
  },

  // ── EXPANDING ────────────────────────────────────────────
  'VC2M9A03_expand_t1': () => {
    const a=pick([2,3,4,5,6,7]),b=rand(1,9),sign=pick(['+','-'])
    const c=rand(1,9)
    const ans = sign==='+' ? `${a}x + ${a*c}` : `${a}x − ${a*c}`
    return { tier:1, type:'std', q:`Expand: ${a}(x ${sign} ${c})`, a:ans }
  },
  'VC2M9A03_expand_neg_t1': () => {
    const a=rand(2,8),c=rand(1,9),sign=pick(['+','-'])
    const ans = sign==='+' ? `−${a}x − ${a*c}` : `−${a}x + ${a*c}`
    return { tier:1, type:'std', q:`Expand: −${a}(x ${sign} ${c})`, a:ans }
  },
  'VC2M9A03_expand_collect_t2': () => {
    const a=rand(2,5),b=rand(1,6),c=rand(2,5),d=rand(1,6)
    const total=a+c, constant=a*b+c*d
    return { tier:2, type:'std', q:`Expand and simplify: ${a}(x + ${b}) + ${c}(x + ${d})`, a:`${total}x + ${constant}` }
  },
  'VC2M9A03_expand_binomial_t2': () => {
    const a=rand(1,6),b=rand(1,6),c=rand(1,6),d=rand(1,6)
    const mid=a*d+b*c, last=b*d
    return { tier:2, type:'std', q:`Expand: (x + ${a})(x + ${b})`, a:`x² + ${a+b}x + ${a*b}` }
  },

  // ── LINEAR EQUATIONS ─────────────────────────────────────
  'VC2M9A04a_eq_t1': () => {
    const x=rand(-10,10),a=rand(2,8),b=rand(-15,15)
    const rhs=a*x+b
    return { tier:1, type:'std', q:`Solve: ${a}x + ${b} = ${rhs}`, a:`x = ${x}` }
  },
  'VC2M9A04a_eq_t2': () => {
    const x=rand(-8,8),a=rand(2,6),b=rand(2,6),c=rand(-10,10)
    const rhs=a*(x+b)+c
    return { tier:2, type:'std', q:`Solve: ${a}(x + ${b}) + ${c} = ${rhs}`, a:`x = ${x}` }
  },
  'VC2M9A04a_eq_both_t2': () => {
    const x=rand(-6,6),a=rand(2,8),b=rand(2,8),c=rand(-10,10),d=rand(-10,10)
    if(a===b) return null
    const lhs_const=c, rhs_const=d
    // ax + c = bx + d => x = (d-c)/(a-b)
    const rhs=b*x+d
    const lhs_rhs=a*x+c
    return { tier:2, type:'std', q:`Solve: ${a}x + ${c} = ${b}x + ${d}`, a:`x = ${x}` }
  },

  // ── INEQUALITIES ─────────────────────────────────────────
  'VC2M9A05_ineq_t1': () => {
    const ops=['<','≤','>','≥']
    const a=rand(2,8),b=rand(-10,10),op=pick(ops)
    const rhs=rand(-10,20)
    const xVal=parseFloat(((rhs-b)/a).toFixed(2))
    const ansOp = (op==='<'||op==='≤') ? (op==='<'?'<':'≤') : (op==='>'?'>':'≥')
    return { tier:1, type:'std', q:`Solve: ${a}x + ${b} ${op} ${rhs}`, a:`x ${ansOp} ${xVal}` }
  },

  // ── INDEX LAWS ───────────────────────────────────────────
  'VC2M9N11b_idx_mult_t1': () => {
    const base=pick(['x','a','m','p','y'])
    const p1=rand(2,6),p2=rand(2,6)
    return { tier:1, type:'std', q:`Simplify: ${base}^${p1} × ${base}^${p2}`, a:`${base}^${p1+p2}` }
  },
  'VC2M9N11b_idx_div_t1': () => {
    const base=pick(['x','a','m','p'])
    const p1=rand(4,9),p2=rand(1,p1-1)
    return { tier:1, type:'std', q:`Simplify: ${base}^${p1} ÷ ${base}^${p2}`, a:`${base}^${p1-p2}` }
  },
  'VC2M9N11b_idx_coeff_t2': () => {
    const base=pick(['x','a','m'])
    const c1=rand(2,6),p1=rand(2,5),c2=rand(2,6),p2=rand(2,5)
    return { tier:2, type:'std', q:`Simplify: ${c1}${base}^${p1} × ${c2}${base}^${p2}`, a:`${c1*c2}${base}^${p1+p2}` }
  },
  'VC2M9N11c_zero_t1': () => {
    const base=pick(['x','a','(2m)','(3y)','5'])
    return { tier:1, type:'std', q:`Evaluate: ${base}⁰`, a:`1` }
  },
  'VC2M9N11e_neg_t1': () => {
    const base=pick([2,3,4,5]),p=rand(1,4)
    return { tier:1, type:'std', q:`Evaluate: ${base}^−${p}`, a:`1/${Math.pow(base,p)}` }
  },

  // ── SCIENTIFIC NOTATION ──────────────────────────────────
  'VC2M9N12a_sci_t1': () => {
    const templates=[
      () => { const n=rand(10000,9999999); const s=n.toExponential(1).replace('e+','×10^'); return { q:`Write in scientific notation: ${n}`, a:s } },
      () => { const dp=rand(3,7); const n=parseFloat((rand(1,9)/Math.pow(10,dp)).toFixed(dp+1)); const s=n.toExponential(1).replace('e-','×10^−'); return { q:`Write in sci. notation: ${n}`, a:s } },
    ]
    return { tier:1, type:'std', ...pick(templates)() }
  },

  // ── GRADIENT ─────────────────────────────────────────────
  'VC2M9A04_grad_t1': () => {
    const x1=rand(-5,3),y1=rand(-5,5),run=pick([1,2,3,4,5,-1,-2,-3]),rise=rand(-6,6)
    const x2=x1+run,y2=y1+rise
    const [gn,gd]=simplify(rise,run)
    const ans = gd===1?`${gn}`:`${gn}/${gd}`
    return { tier:1, type:'std', q:`Gradient through (${x1},${y1}) and (${x2},${y2})`, a:ans }
  },
  'VC2M9A03_gmx_t1': () => {
    const m=rand(1,6),c=rand(-8,8),x=rand(-3,5)
    const y=m*x+c
    return { tier:1, type:'std', q:`y = ${m}x + ${c}. Find y when x = ${x}`, a:`${y}` }
  },

  // ── PYTHAGORAS ───────────────────────────────────────────
  'VC2M9M01a_pyth_t1': () => {
    const triples=pyTriples()
    const [a,b,c]=pick(triples)
    const scale=pick([1,1,1,2,3])
    return { tier:1, type:'std', q:`Pythagoras: a=${a*scale}, b=${b*scale}. Find c.`, a:`c = ${c*scale}` }
  },
  'VC2M9M01b_pyth_short_t1': () => {
    const triples=pyTriples()
    const [a,b,c]=pick(triples)
    const scale=pick([1,1,2])
    return { tier:1, type:'std', q:`Pythagoras: c=${c*scale}, b=${b*scale}. Find a.`, a:`a = ${a*scale}` }
  },

  // ── AREA ─────────────────────────────────────────────────
  'VC2M9M03d_area_t1': () => {
    const shapes=[
      () => { const l=rand(3,15),w=rand(2,12); return { q:`Area of rectangle: ${l}×${w} cm`, a:`${l*w} cm²` } },
      () => { const b=rand(4,16),h=rand(3,12); return { q:`Area of triangle: base ${b} cm, height ${h} cm`, a:`${b*h/2} cm²` } },
      () => { const r=rand(2,10); return { q:`Area of circle: r = ${r} cm (2 dp)`, a:`${(Math.PI*r*r).toFixed(2)} cm²` } },
    ]
    return { tier:1, type:'std', ...pick(shapes)() }
  },
  'VC2M9M04c_vol_t1': () => {
    const l=rand(2,10),w=rand(2,8),h=rand(2,8)
    return { tier:1, type:'std', q:`Volume of rectangular prism: ${l}×${w}×${h} cm`, a:`${l*w*h} cm³` }
  },

  // ── SURDS ────────────────────────────────────────────────
  'VC2M9N13a_surd_t1': () => {
    // Perfect square factors: generate √(a²×k) = a√k
    const a=pick([2,3,4,5,6,7]),k=pick([2,3,5,6,7])
    const n=a*a*k
    return { tier:1, type:'std', q:`Simplify: √${n}`, a:`${a}√${k}` }
  },

  // ── PROBABILITY ──────────────────────────────────────────
  'VC2M9P01a_prob_t1': () => {
    const templates=[
      () => { const n=rand(2,9),d=rand(n+1,20); return { q:`P(event) = ${n}/${d}. P(not event) =`, a:`${d-n}/${d}` } },
      () => { const total=pick([6,8,10,12,20,52]); const fav=rand(1,total/2); return { q:`${fav} favourable out of ${total} equally likely. P =`, a:`${fav}/${total}` } },
    ]
    return { tier:1, type:'std', ...pick(templates)() }
  },

  // ── MEAN/MEDIAN ──────────────────────────────────────────
  'VC2M9D01b_mean_t1': () => {
    const count=pick([4,5,6])
    const vals=Array.from({length:count},()=>rand(1,20))
    const sum=vals.reduce((a,b)=>a+b,0)
    const mean=sum/count
    return { tier:1, type:'std', q:`Mean of: ${vals.join(', ')}`, a:`${mean%1===0?mean:mean.toFixed(1)}` }
  },
  'VC2M9D01b_median_t1': () => {
    const count=pick([5,7])
    const vals=shuffle(Array.from({length:count},()=>rand(1,20)))
    const sorted=[...vals].sort((a,b)=>a-b)
    const median=sorted[Math.floor(count/2)]
    return { tier:1, type:'std', q:`Median of: ${vals.join(', ')}`, a:`${median}` }
  },

  // ── SIMPLE INTEREST ──────────────────────────────────────
  'VC2M9M05a_si_t1': () => {
    const P=pick([500,1000,2000,4000,5000]),r=pick([3,4,5,6,8]),t=pick([1,2,3,4,5])
    const I=P*r*t/100
    return { tier:1, type:'std', q:`SI: P=$${P}, r=${r}%, t=${t} yr. Find I.`, a:`$${I}` }
  },
  'VC2M9M05b_ci_t1': () => {
    const P=pick([1000,2000,5000]),r=pick([5,8,10]),n=pick([2,3])
    const A=P*Math.pow(1+r/100,n)
    return { tier:1, type:'std', q:`CI: P=$${P}, r=${r}%, n=${n} yr. Find A.`, a:`$${A.toFixed(2)}` }
  },

}

// ─── SKILL → GENERATOR MAPPING ───────────────────────────────
// Maps VC codes and skill names to generator keys
const SKILL_GENERATOR_MAP = {
  // By VC code
  'VC2M9N01': ['VC2M9N01_bidmas_t1','VC2M9N01_bidmas_t2'],
  'VC2M9N02': ['VC2M9N02_round_t1','VC2M9N02_sf_t1'],
  'VC2M9N04': ['VC2M9N04_frac_add_t1','VC2M9N04_frac_mult_t1','VC2M9N04_frac_div_t1'],
  'VC2M9N07': ['VC2M9N07_perc_t1','VC2M9N07_perc_increase_t2','VC2M9N07_perc_decrease_t2'],
  'VC2M9A01': ['VC2M9A01_sub_t1','VC2M9A01_sub_t2'],
  'VC2M9A02': ['VC2M9A01_sub_t1','VC2M9A03_expand_t1'],
  'VC2M9A03': ['VC2M9A03_expand_t1','VC2M9A03_expand_neg_t1','VC2M9A03_expand_collect_t2','VC2M9A03_expand_binomial_t2'],
  'VC2M9A04': ['VC2M9A04a_eq_t1','VC2M9A04a_eq_t2','VC2M9A04_grad_t1'],
  'VC2M9A04a': ['VC2M9A04a_eq_t1','VC2M9A04a_eq_both_t2'],
  'VC2M9A04b': ['VC2M9A04a_eq_t2','VC2M9A04a_eq_both_t2'],
  'VC2M9A05': ['VC2M9A05_ineq_t1'],
  'VC2M9A08d': ['VC2M9A04_grad_t1'],
  'VC2M9A08f': ['VC2M9A03_gmx_t1'],
  'VC2M9N11a': ['VC2M9N11b_idx_mult_t1'],
  'VC2M9N11b': ['VC2M9N11b_idx_mult_t1','VC2M9N11b_idx_div_t1','VC2M9N11b_idx_coeff_t2'],
  'VC2M9N11c': ['VC2M9N11c_zero_t1'],
  'VC2M9N11e': ['VC2M9N11e_neg_t1'],
  'VC2M9N12a': ['VC2M9N12a_sci_t1'],
  'VC2M9N13a': ['VC2M9N13a_surd_t1'],
  'VC2M9M01a': ['VC2M9M01a_pyth_t1'],
  'VC2M9M01b': ['VC2M9M01b_pyth_short_t1'],
  'VC2M9M03d': ['VC2M9M03d_area_t1'],
  'VC2M9M04c': ['VC2M9M04c_vol_t1'],
  'VC2M9M05a': ['VC2M9M05a_si_t1'],
  'VC2M9M05b': ['VC2M9M05b_ci_t1'],
  'VC2M9P01a': ['VC2M9P01a_prob_t1'],
  'VC2M9D01b': ['VC2M9D01b_mean_t1','VC2M9D01b_median_t1'],

  // By keyword fallback
  'Integer': ['VC2M9N01_bidmas_t1','VC2M9N01_bidmas_t2'],
  'BIDMAS': ['VC2M9N01_bidmas_t1','VC2M9N01_bidmas_t2'],
  'Rounding': ['VC2M9N02_round_t1','VC2M9N02_sf_t1'],
  'Fractions': ['VC2M9N04_frac_add_t1','VC2M9N04_frac_mult_t1'],
  'Percentages': ['VC2M9N07_perc_t1','VC2M9N07_perc_increase_t2'],
  'Substitution': ['VC2M9A01_sub_t1','VC2M9A01_sub_t2'],
  'Expanding': ['VC2M9A03_expand_t1','VC2M9A03_expand_neg_t1','VC2M9A03_expand_collect_t2'],
  'Linear Equations': ['VC2M9A04a_eq_t1','VC2M9A04a_eq_t2'],
  'Inequalities': ['VC2M9A05_ineq_t1'],
  'Indices': ['VC2M9N11b_idx_mult_t1','VC2M9N11b_idx_div_t1','VC2M9N11c_zero_t1','VC2M9N11e_neg_t1'],
  'Scientific Notation': ['VC2M9N12a_sci_t1'],
  'Surds': ['VC2M9N13a_surd_t1'],
  'Pythagoras': ['VC2M9M01a_pyth_t1','VC2M9M01b_pyth_short_t1'],
  'Area': ['VC2M9M03d_area_t1'],
  'Volume': ['VC2M9M04c_vol_t1'],
  'Gradient': ['VC2M9A04_grad_t1'],
  'Probability': ['VC2M9P01a_prob_t1'],
  'Mean': ['VC2M9D01b_mean_t1','VC2M9D01b_median_t1'],
  'Simple interest': ['VC2M9M05a_si_t1'],
  'Compound interest': ['VC2M9M05b_ci_t1'],
}

/**
 * Get generator keys for a skill (by VC code, then by topic/skill name keywords)
 */
function getGeneratorKeys(skill) {
  const vc = (skill.vc_code || skill.vc || '').replace(/[a-z]/g,'') // strip sub-code suffix
  if (SKILL_GENERATOR_MAP[skill.vc_code]) return SKILL_GENERATOR_MAP[skill.vc_code]
  if (SKILL_GENERATOR_MAP[vc]) return SKILL_GENERATOR_MAP[vc]
  // Try keyword matching
  const topic = (skill.topic || skill.skill_name || '').toLowerCase()
  for (const [kw, keys] of Object.entries(SKILL_GENERATOR_MAP)) {
    if (topic.includes(kw.toLowerCase())) return keys
  }
  return []
}

/**
 * Generate N fresh questions for a skill
 * Supplements banked questions — generated questions fill gaps
 */
export function generateQuestionsForSkill(skill, count = 4, tier = null) {
  reseed()
  const keys = getGeneratorKeys(skill)
  if (!keys.length) return []
  
  const results = []
  let attempts = 0
  while (results.length < count && attempts < count * 10) {
    attempts++
    const key = pick(keys)
    const gen = GENERATORS[key]
    if (!gen) continue
    const q = gen()
    if (!q) continue
    if (tier && q.tier !== tier) continue
    // Mark as generated so UI can distinguish
    results.push({ ...q, id: `gen_${Date.now()}_${attempts}`, generated: true, skill_id: skill.id })
  }
  return results
}

/**
 * Given existing banked questions, fill in missing tiers with generated ones
 * Returns augmented question array
 */
// Tier targets match the display layout: T1/T2 = 6, T3 = 2, T4 = 1
const TIER_TARGETS = { 1: 6, 2: 6, 3: 2, 4: 1 }

export function augmentWithGenerated(skill, bankedQuestions, targetPerTier = null) {
  const keys = getGeneratorKeys(skill)
  // No generators for this skill — return banked questions immediately, no loop
  if (!keys.length) return bankedQuestions
  reseed()

  const byTier = {1:[],2:[],3:[],4:[]}
  bankedQuestions.forEach(q => { if(byTier[q.tier]) byTier[q.tier].push(q) })

  const augmented = [...bankedQuestions]

  for (const tier of [1,2,3,4]) {
    const target = targetPerTier || TIER_TARGETS[tier] || 4
    const needed = target - byTier[tier].length
    if (needed <= 0) continue
    
    let attempts = 0
    let added = 0
    // Only auto-generate for T1 and T2 — T3/T4 should come from the curated bank
    if (tier >= 3 || needed <= 0) continue
    while (added < needed && attempts < needed * 5) {
      attempts++
      const key = pick(keys)
      const gen = GENERATORS[key]
      if (!gen) continue
      const q = gen()
      if (!q || q.tier !== tier) continue
      augmented.push({ ...q, id: `gen_${tier}_${Date.now()}_${attempts}`, generated: true, skill_id: skill.id })
      added++
    }
  }

  return augmented
}

export { SKILL_GENERATOR_MAP, getGeneratorKeys }
