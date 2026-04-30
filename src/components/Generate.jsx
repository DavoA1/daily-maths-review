import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { useSettings } from '../lib/settings.jsx'
import { supabase } from '../lib/supabase.js'
import { getDueConcepts, getUpcomingSkills, getRetrievalGaps } from '../lib/spacedRep.js'
import { FOUNDATIONAL } from '../lib/curriculum.js'
import { useNavigate } from 'react-router-dom'
import { getDailyChain } from '../lib/btbChains.js'
import { getSlides, setStoredSlides, setTimerConfig, hasSlides } from '../lib/slideStore.js'
import { openHomeworkPrint } from '../lib/homeworkPrint.js'


// ─── INLINE QUESTION GENERATOR ───────────────────────────────
// Generates fresh T1/T2 questions algorithmically to fill gaps in the question bank
let _gseed = Date.now()
function _rng() { _gseed = (_gseed * 1664525 + 1013904223) & 0xffffffff; return ((_gseed >>> 0) / 0xffffffff) }
function _rand(min, max) { return Math.floor(_rng() * (max - min + 1)) + min }
function _pick(arr) { return arr[Math.floor(_rng() * arr.length)] }
function _gcd(a, b) { return b === 0 ? Math.abs(a) : _gcd(b, a % b) }
function _simplify(n, d) { const g = _gcd(Math.abs(n), Math.abs(d)); return [n/g, d/g] }
function _frac(n, d) {
  if (d === 1) return `${n}`
  const [sn, sd] = _simplify(n, d)
  if (sd < 0) return _frac(-sn, -sd)
  const w = Math.floor(Math.abs(sn)/sd), r = Math.abs(sn)%sd, sg = sn<0?'−':''
  if (r === 0) return `${sn}`
  return w === 0 ? `${sg}${Math.abs(sn)}⁄${sd}` : `${sg}${w} ${r}⁄${sd}`
}

// ── MATH NOTATION ────────────────────────────────────────────
// Convert x^2 → x², a^3 → a³, etc. using Unicode superscripts
const _SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'}
function _sup(n) { return String(n).split('').map(c=>_SUP[c]||c).join('') }
function _mathNotation(s) {
  if (!s) return s
  // x^{n} or x^n patterns
  return s
    .replace(/\^{?(-?\d+)}?/g, (_, n) => _sup(n))
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/sqrt/g, '√')
}

const _GENS = {
  bidmas_t1: () => {
    const t = _pick([
      () => { const a=_rand(2,9),b=_rand(2,9),c=_rand(1,9); return {q:`Evaluate: ${a} × ${b} − ${c}`,a:`${a*b-c}`} },
      () => { const a=_rand(2,8); return {q:`Evaluate: (−${a})²`,a:`${a*a}`} },
      () => { const a=_rand(2,5); return {q:`Evaluate: −${a}²`,a:`${-(a*a)}`} },
      () => { const a=_rand(1,9),b=_rand(1,9),c=_rand(2,6); return {q:`Evaluate: ${a} + ${b} × ${c}`,a:`${a+b*c}`} },
      () => { const a=_rand(-9,-2),b=_rand(2,8); return {q:`Evaluate: ${a} × ${b}`,a:`${a*b}`} },
      () => { const a=_rand(-8,-2),b=_rand(-6,-2); return {q:`Evaluate: (${a}) × (${b})`,a:`${a*b}`} },
      () => { const a=_rand(2,4); return {q:`Evaluate: (−${a})³`,a:`${-(a*a*a)}`} },
    ])(); return {tier:1,type:'std',q:t.q,a:t.a}
  },
  bidmas_t2: () => {
    const t = _pick([
      () => { const a=_rand(2,5),b=_rand(2,8),c=_rand(1,6),d=_rand(1,5); return {q:`Evaluate: ${a} × ${b} − ${c} × ${d}`,a:`${a*b-c*d}`} },
      () => { const a=_rand(2,6),b=_rand(2,4); return {q:`Evaluate: ${a}³ − ${_rand(1,10)}`,a:`${Math.pow(a,3)-_rand(1,10)}`} },
      () => { const sq=[4,9,16,25,36,49,64],s=_pick(sq),r=Math.sqrt(s),aa=_rand(2,5); return {q:`Evaluate: √${s} + ${aa}²`,a:`${r+aa*aa}`} },
    ])(); return {tier:2,type:'std',q:t.q,a:t.a}
  },
  expand_t1: () => {
    const a=_pick([2,3,4,5,6,7]),c=_rand(1,9),sg=_pick(['+','−'])
    const ans = sg==='+' ? `${a}x + ${a*c}` : `${a}x − ${a*c}`
    return {tier:1,type:'std',q:`Expand: ${a}(x ${sg} ${c})`,a:ans}
  },
  expand_neg_t1: () => {
    const a=_rand(2,8),c=_rand(1,9),sg=_pick(['+','−'])
    const ans = sg==='+' ? `−${a}x − ${a*c}` : `−${a}x + ${a*c}`
    return {tier:1,type:'std',q:`Expand: −${a}(x ${sg} ${c})`,a:ans}
  },
  expand_t2: () => {
    const a=_rand(2,5),b=_rand(1,6),c=_rand(2,5),d=_rand(1,6)
    return {tier:2,type:'std',q:`Expand and simplify: ${a}(x + ${b}) + ${c}(x + ${d})`,a:`${a+c}x + ${a*b+c*d}`}
  },
  binomial_t2: () => {
    const a=_rand(1,6),b=_rand(1,6)
    return {tier:2,type:'std',q:`Expand: (x + ${a})(x + ${b})`,a:`x² + ${a+b}x + ${a*b}`}
  },
  eq_t1: () => {
    const x=_rand(-8,8),a=_rand(2,8),b=_rand(-15,15)
    return {tier:1,type:'std',q:`Solve: ${a}x + ${b} = ${a*x+b}`,a:`x = ${x}`}
  },
  eq_t2: () => {
    const x=_rand(-6,6),a=_rand(2,6),b=_rand(2,6),c=_rand(-8,8)
    return {tier:2,type:'std',q:`Solve: ${a}(x + ${b}) + ${c} = ${a*(x+b)+c}`,a:`x = ${x}`}
  },
  sub_t1: () => {
    const a=_rand(2,9),b=_rand(-5,5),x=_pick([-3,-2,-1,1,2,3,4])
    const t=_pick([
      {q:`${a}x + ${b}`,fn:x=>a*x+b},
      {q:`x² + ${b}`,fn:x=>x*x+b},
      {q:`−${a}x + ${b}`,fn:x=>-a*x+b},
    ])
    return {tier:1,type:'std',q:`Evaluate ${t.q} when x = ${x}`,a:`${t.fn(x)}`}
  },
  idx_mult_t1: () => {
    const base=_pick(['x','a','m','p']),p1=_rand(2,6),p2=_rand(2,6)
    return {tier:1,type:'std',q:`Simplify: ${base}^${p1} × ${base}^${p2}`,a:`${base}^${p1+p2}`}
  },
  idx_div_t1: () => {
    const base=_pick(['x','a','m']),p1=_rand(4,9),p2=_rand(1,p1-1)
    return {tier:1,type:'std',q:`Simplify: ${base}^${p1} ÷ ${base}^${p2}`,a:`${base}^${p1-p2}`}
  },
  idx_coeff_t2: () => {
    const b=_pick(['x','a','m']),c1=_rand(2,6),p1=_rand(2,5),c2=_rand(2,6),p2=_rand(2,5)
    return {tier:2,type:'std',q:`Simplify: ${c1}${b}^${p1} × ${c2}${b}^${p2}`,a:`${c1*c2}${b}^${p1+p2}`}
  },
  zero_t1: () => {
    const base=_pick(['x','a','(2m)','(3y)'])
    return {tier:1,type:'std',q:`Evaluate: ${base}⁰`,a:`1`}
  },
  neg_idx_t1: () => {
    const b=_pick([2,3,4,5]),p=_rand(1,4)
    return {tier:1,type:'std',q:`Evaluate: ${b}^−${p}`,a:`1/${Math.pow(b,p)}`}
  },
  sci_t1: () => {
    const n=_rand(10000,9999999)
    const exp = Math.floor(Math.log10(n))
    const coeff = (n/Math.pow(10,exp)).toFixed(2).replace(/\.?0+$/,'')
    return {tier:1,type:'std',q:`Write in scientific notation: ${n}`,a:`${coeff} × 10^${exp}`}
  },
  surd_t1: () => {
    const a=_pick([2,3,4,5,6,7]),k=_pick([2,3,5,6,7])
    return {tier:1,type:'std',q:`Simplify: √${a*a*k}`,a:`${a}√${k}`}
  },
  perc_t1: () => {
    const p=_pick([5,10,12.5,15,20,25,30,50]),amt=_pick([20,40,60,80,100,120,150,200,250,400])
    const ans=p*amt/100
    return {tier:1,type:'std',q:`Find ${p}% of $${amt}`,a:`$${ans%1===0?ans:ans.toFixed(2)}`}
  },
  perc_t2: () => {
    const p=_pick([5,10,15,20,25]),amt=_pick([80,100,120,150,200,250,300,400]),dir=_pick(['Increase','Decrease'])
    const ans=dir==='Increase'?amt*(1+p/100):amt*(1-p/100)
    return {tier:2,type:'std',q:`${dir} $${amt} by ${p}%`,a:`$${ans%1===0?ans:ans.toFixed(2)}`}
  },
  frac_t1: () => {
    const t=_pick([
      () => { const d1=_pick([2,3,4,5,6]),n1=_rand(1,d1-1),d2=_pick([2,3,4,5,6]),n2=_rand(1,d2-1); const lcd=d1*d2/_gcd(d1,d2); return {q:`${_frac(n1,d1)} + ${_frac(n2,d2)}`,a:_frac(n1*(lcd/d1)+n2*(lcd/d2),lcd)} },
      () => { const d1=_pick([2,3,4,5]),n1=_rand(1,d1-1),d2=_pick([2,3,4,5]),n2=_rand(1,d2-1); const [rn,rd]=_simplify(n1*n2,d1*d2); return {q:`${_frac(n1,d1)} × ${_frac(n2,d2)}`,a:_frac(rn,rd)} },
    ])()
    return {tier:1,type:'std',q:`Calculate: ${t.q} =`,a:`${t.a}`}
  },
  grad_t1: () => {
    const x1=_rand(-4,3),y1=_rand(-4,4),run=_pick([1,2,3,4,-1,-2,-3]),rise=_rand(-5,5)
    if(rise===0&&run===0) return null
    const [gn,gd]=_simplify(rise,run)
    return {tier:1,type:'std',q:`Gradient through (${x1},${y1}) and (${x1+run},${y1+rise})`,a:gd===1?`${gn}`:`${gn}/${gd}`}
  },
  pyth_t1: () => {
    const triples=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]]
    const [a,b,c]=_pick(triples),sc=_pick([1,1,2])
    return {tier:1,type:'std',q:`Pythagoras: a=${a*sc}, b=${b*sc}. Find c.`,a:`c = ${c*sc}`}
  },
  pyth_short_t1: () => {
    const triples=[[3,4,5],[5,12,13],[8,15,17],[6,8,10]]
    const [a,b,c]=_pick(triples)
    return {tier:1,type:'std',q:`Pythagoras: c=${c}, b=${b}. Find a.`,a:`a = ${a}`}
  },
  area_t1: () => {
    const t=_pick([
      () => { const l=_rand(3,15),w=_rand(2,12); return {q:`Area of rectangle: ${l}×${w} cm`,a:`${l*w} cm²`} },
      () => { const b=_rand(4,16),h=_rand(3,12); return {q:`Area of triangle: base ${b}, height ${h}`,a:`${b*h/2} cm²`} },
      () => { const r=_rand(2,9); return {q:`Area of circle: r = ${r} cm (nearest whole)`,a:`${Math.round(Math.PI*r*r)} cm²`} },
    ])()
    return {tier:1,type:'std',q:t.q,a:t.a}
  },
  si_t1: () => {
    const P=_pick([500,1000,2000,5000]),r=_pick([3,4,5,6,8]),t=_pick([1,2,3,4])
    return {tier:1,type:'std',q:`SI: P=$${P}, r=${r}%, t=${t}yr. Find I.`,a:`$${P*r*t/100}`}
  },
  mean_t1: () => {
    const n=_pick([4,5,6]),vals=Array.from({length:n},()=>_rand(2,20))
    const sum=vals.reduce((a,b)=>a+b,0),mean=sum/n
    return {tier:1,type:'std',q:`Mean of: ${vals.join(', ')}`,a:`${mean%1===0?mean:mean.toFixed(1)}`}
  },
  prob_t1: () => {
    const total=_pick([5,6,8,10,12,20]),fav=_rand(1,Math.floor(total/2))
    return {tier:1,type:'std',q:`${fav} favourable out of ${total} equally likely outcomes. P =`,a:`${fav}/${total}`}
  },
  ineq_t1: () => {
    const a=_rand(2,8),b=_rand(-10,10),op=_pick(['<','≤','>','≥']),rhs=_rand(-5,20)
    const xVal=((rhs-b)/a).toFixed(2).replace(/\.0+$/,'')
    const ansOp=op==='<'?'<':op==='≤'?'≤':op==='>'?'>':'≥'
    return {tier:1,type:'std',q:`Solve: ${a}x + ${b} ${op} ${rhs}`,a:`x ${ansOp} ${xVal}`}
  },
}

// Map VC codes / topics to generator keys
const _SKILL_MAP = {
  'VC2M9N01':['bidmas_t1','bidmas_t2'], 'VC2M9N02':['bidmas_t1'],
  'VC2M9N04':['frac_t1'], 'VC2M9N07':['perc_t1','perc_t2'],
  'VC2M9A01':['sub_t1'], 'VC2M9A02':['sub_t1','expand_t1'],
  'VC2M9A03':['expand_t1','expand_neg_t1','expand_t2','binomial_t2'],
  'VC2M9A04':['eq_t1','eq_t2'], 'VC2M9A04a':['eq_t1','eq_t2'],
  'VC2M9A04b':['eq_t2'], 'VC2M9A05':['ineq_t1'],
  'VC2M9A08d':['grad_t1'], 'VC2M9A08f':['eq_t1'],
  'VC2M9N11a':['idx_mult_t1'], 'VC2M9N11b':['idx_mult_t1','idx_div_t1','idx_coeff_t2'],
  'VC2M9N11c':['zero_t1'], 'VC2M9N11e':['neg_idx_t1'],
  'VC2M9N12a':['sci_t1'], 'VC2M9N13a':['surd_t1'],
  'VC2M9M01a':['pyth_t1'], 'VC2M9M01b':['pyth_short_t1'],
  'VC2M9M03d':['area_t1'], 'VC2M9M05a':['si_t1'],
  'VC2M9P01a':['prob_t1'], 'VC2M9D01b':['mean_t1'],
}
const _TOPIC_MAP = {
  'integer':['bidmas_t1','bidmas_t2'], 'bidmas':['bidmas_t1','bidmas_t2'],
  'rounding':['bidmas_t1'], 'fraction':['frac_t1'], 'percentage':['perc_t1','perc_t2'],
  'substitut':['sub_t1'], 'expand':['expand_t1','expand_neg_t1','expand_t2','binomial_t2'],
  'equation':['eq_t1','eq_t2'], 'inequalit':['ineq_t1'],
  'index':['idx_mult_t1','idx_div_t1','zero_t1','neg_idx_t1'],
  'indices':['idx_mult_t1','idx_div_t1','zero_t1','neg_idx_t1'],
  'scientific':['sci_t1'], 'surd':['surd_t1'],
  'pythagoras':['pyth_t1','pyth_short_t1'], 'trigonometr':['pyth_t1'],
  'area':['area_t1'], 'volume':['area_t1'], 'gradient':['grad_t1'],
  'probability':['prob_t1'], 'mean':['mean_t1'], 'interest':['si_t1'],
}

const _TIER_TARGETS = {1:6, 2:6, 3:2, 4:1}

function augmentWithGenerated(skill, bankedQuestions) {
  // Get generator keys for this skill
  const vc = (skill.vc_code || '').trim()
  let keys = _SKILL_MAP[vc] || []
  if (!keys.length) {
    const topic = (skill.topic || skill.skill_name || '').toLowerCase()
    for (const [kw, ks] of Object.entries(_TOPIC_MAP)) {
      if (topic.includes(kw)) { keys = ks; break }
    }
  }
  if (!keys.length) return bankedQuestions  // no generators — return as-is

  _gseed = Date.now() + Math.random() * 999999  // reseed for variety

  const byTier = {1:[],2:[],3:[],4:[]}
  bankedQuestions.forEach(q => { if(byTier[q.tier]) byTier[q.tier].push(q) })

  const result = [...bankedQuestions]

  // Only auto-generate for T1 and T2
  for (const tier of [1, 2]) {
    const needed = _TIER_TARGETS[tier] - byTier[tier].length
    if (needed <= 0) continue
    let added = 0, attempts = 0
    while (added < needed && attempts < needed * 8) {
      attempts++
      const key = _pick(keys)
      const gen = _GENS[key]
      if (!gen) continue
      const q = gen()
      if (!q || q.tier !== tier) continue
      result.push({ ...q, q: _mathNotation(q.q), question_text: _mathNotation(q.question_text || q.q), id: `gen_${tier}_${Date.now()}_${attempts}`, generated: true, skill_id: skill.id })
      added++
    }
  }
  return result
}
// ─────────────────────────────────────────────────────────────
// setCurrentSlides now writes to the shared slideStore
function setCurrentSlides(s) { setStoredSlides(s) }
const channel = new BroadcastChannel('dmr_student_view')

const TIER_LABELS = ['', 'T1 · Foundation', 'T2 · Core', 'T3 · Extension', 'T4 · Challenge']
const TIER_FULL  = ['', 'Foundation', 'Core', 'Extension', 'Challenge']
const QTYPE_LABELS = { std: 'Std', mc: 'MC', tf: 'T/F', fill: 'Fill', worded: 'Word', error: 'Error', show: 'Show' }
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000)

// Generate a number chain challenge (start → operations → target)
function generateChain() {
  const chains = [
    'Start: 3\n× 4 → − 7 → × 2 → + 1 = ?\n(Answer: 19)',
    'Start: 48\n÷ 6 → × 3 → − 5 → + 8 = ?\n(Answer: 27)',
    'Start: 5\n² → − 7 → × 2 → ÷ 6 = ?\n(Answer: 6)',
    'Start: 100\n÷ 4 → + 17 → × 2 → − 9 = ?\n(Answer: 57)',
    'Start: 7\n× 8 → − 16 → ÷ 4 → + 3 = ?\n(Answer: 15)',
    'Start: 36\n√  → × 7 → − 9 → ÷ 3 = ?\n(Answer: 11)',
    'Start: 2\n³ → + 17 → ÷ 5 → × 4 = ?\n(Answer: 20)',
    'Start: 15\n× 3 → − 5 → ² → ÷ 4 = ?\n(Answer: 400)',
  ]
  const day = Math.floor(Date.now() / 86400000)
  return chains[day % chains.length]
}

export default function Generate() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [activeClass, setActiveClass] = useState('')
  const [classSkills, setClassSkills] = useState([])
  const [skills, setSkills] = useState([]) // full skill objects
  const [questions, setQuestions] = useState([]) // all questions keyed by skill_id
  const [slides, setSlides] = useState([])
  const [maxTopics, setMaxTopics] = useState(15)
  const [timerSecs, setTimerSecs] = useState(settings.defaultTimer || 15)
  const [btbSecs, setBtbSecs] = useState(settings.btbTimer || 90)
  const [loading, setLoading] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [selectedWarmups, setSelectedWarmups] = useState(new Set([0,1,2,3,4])) // all 5 on by default
  const [addTopicOpen, setAddTopicOpen] = useState(false)
  const [allSkills, setAllSkills] = useState([])
  const [skippedSlides, setSkippedSlides] = useState(new Set())
  const [btbMode, setBtbMode] = useState('chain') // 'chain' | 'content'
  const [expModalOpen, setExpModalOpen] = useState(false)
  const [editingExpSlide, setEditingExpSlide] = useState(null) // {si, slide} for editing existing
  const qMap_ref = useRef({})
  const [editQ, setEditQ] = useState({ tier: 1, type: 'std', q: '', a: '', vc: '' })
  const [summary, setSummary] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    loadClasses()
    loadAllSkills()
  }, [user])

  // Restore slides on every mount (including returning from Present)
  useEffect(() => {
    if (hasSlides()) {
      setSlides(getSlides())
    }
  }, [])  // [] = runs on every mount
  useEffect(() => { if (activeClass) loadClassData(activeClass) }, [activeClass])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function loadAllSkills() {
    const { data } = await supabase.from('skills').select('*').order('year_level,strand,topic,skill_name').range(0, 9999)
    setAllSkills(data || [])
  }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('name')
    setClasses(data || [])
    if (data && data.length > 0) setActiveClass(data[0].id)
  }

  async function loadClassData(classId) {
    // Fetch class skills — skill data is embedded via the join (skill:skills(*))
    // so we don't need a separate skills table query at all
    const { data: csData } = await supabase
      .from('class_skills')
      .select(`*, skill:skills(*)`)
      .eq('class_id', classId)

    const cs = csData || []

    // Only fetch questions for the specific skills in this class.
    // This naturally scopes to the right year level + any earlier prerequisites
    // that have been added to this class's schedule.
    const skillIds = cs.map(c => c.skill_id).filter(Boolean)

    const { data: qData } = skillIds.length > 0
      ? await supabase
          .from('questions')
          .select('id,skill_id,tier,question_type,question_text,answer_text,vc_code,image_url')
          .in('skill_id', skillIds)
      : { data: [] }

    const qs = qData || []
    setClassSkills(cs)
    setQuestions(qs)
    return { classSkills: cs, questions: qs }
  }

  function getQuestionsForSkill(skillId) {
    return questions.filter(q => q.skill_id === skillId).sort((a, b) => a.tier - b.tier)
  }

  // Build a SLIDE SET for a skill:
  // Returns an array of slides — spotlight singles + final full bank
  function buildSlideSet(cs, tag = '', opts = {}, qMap = {}) {
    const sk = cs.skill || {}
    const bankedQs = (qMap[sk.id || cs.skill_id] || []).sort((a,b) => a.tier - b.tier)
    // Augment with generated questions — wrapped in try/catch so one bad generator
    // can never crash the whole slide generation
    let allQs = bankedQs
    try {
      allQs = augmentWithGenerated(sk, bankedQs).sort((a, b) => a.tier - b.tier)
    } catch(e) {
      console.warn('[buildSlideSet] Generator failed for', sk.skill_name, e.message)
      allQs = bankedQs.sort((a, b) => a.tier - b.tier)
    }
    const btbEasy = sk.btb_easy || ''
    const btbHard = sk.btb_hard || ''
    const btbChain = sk.btb_chain || ''
    const base = { skill: sk, classSkill: cs, tag, btbEasy, btbHard, btbChain, ...opts }

    if (!allQs.length) {
      // No questions — just a full bank placeholder
      return [{ ...base, id: cs.id, singleMode: false, isBank: true, questions: [] }]
    }

    // Pick spotlight questions: 1 from T1, 1 from T2, 1 from T3 (or T4)
    // These are the individually-revealed slides teachers work through with the class
    const byTier = { 1: [], 2: [], 3: [], 4: [] }
    allQs.forEach(q => { if (byTier[q.tier]) byTier[q.tier].push(q) })

    const spotlights = []
    // T1: pick 1 for the opener (verbal/whiteboard)
    if (byTier[1].length) spotlights.push(byTier[1][0])
    // T2: pick 1 
    if (byTier[2].length) spotlights.push(byTier[2][0])
    // T3 or T4: pick 1 for the class discussion/show-work question
    const higherTier = [...byTier[3], ...byTier[4]]
    if (higherTier.length) spotlights.push(higherTier[0])

    const slides = []

    // Spotlight slides — one question per slide, interactive
    spotlights.forEach((q, i) => {
      slides.push({
        ...base,
        id: `${cs.id}-spot${i}`,
        singleMode: true,
        isBank: false,
        isSpotlight: true,
        spotlightIndex: i,
        spotlightTotal: spotlights.length,
        questions: [q],
      })
    })

    // Final slide = full tiered bank of ALL questions
    slides.push({
      ...base,
      id: `${cs.id}-bank`,
      singleMode: false,
      isBank: true,
      isSpotlight: false,
      questions: allQs,
    })

    return slides
  }

  // Legacy single-slide builder (used for retrieval/prereq where we don't want full sets)
  function buildSingleSlide(cs, tag = '', opts = {}, qMap = {}) {
    const sk = cs.skill || {}
    const banked = (qMap[sk.id || cs.skill_id] || []).sort((a,b) => a.tier - b.tier)
    const qs = augmentWithGenerated(sk, banked).sort((a, b) => a.tier - b.tier)
    return {
      id: cs.id,
      skill: sk,
      classSkill: cs,
      tag,
      singleMode: false,
      isBank: true,
      questions: qs,
      btbEasy: sk.btb_easy || '',
      btbHard: sk.btb_hard || '',
      btbChain: sk.btb_chain || '',
      ...opts
    }
  }

  function buildFoundational(idx) {
    const f = FOUNDATIONAL[idx % FOUNDATIONAL.length]
    return {
      id: 'fndl-' + idx,
      type: 'tiered',  // warm-up shows all questions tiered
      skill: { skill_name: f.label, strand: f.strand, year_level: 'F', topic: 'Foundational', btb_easy: f.btbEasy, btb_hard: f.btbHard },
      classSkill: null,
      tag: '⚡ Warm-up',
      isFoundational: true,
      questions: f.questions,
      btbEasy: f.btbEasy,
      btbHard: f.btbHard,
    }
  }

  async function doGenerate() {
    if (!activeClass) { showToast('No class selected'); return }
    setLoading(true)
    setSkippedSlides(new Set())
    setTimerConfig(timerSecs, btbSecs)
    try {
      console.log('[Generate] Starting...')
      const freshData = await loadClassData(activeClass)
      const allClassSkills = freshData.classSkills
      const allQuestions = freshData.questions
      console.log('[Generate] Loaded:', allClassSkills.length, 'skills,', allQuestions.length, 'questions')

      if (!allClassSkills.length) {
        showToast('No skills added to this class yet — add topics in Dashboard first')
        setLoading(false)
        return
      }

      // Build question map keyed by skill_id
      const qMap = {}
      allQuestions.forEach(q => {
        if (!qMap[q.skill_id]) qMap[q.skill_id] = []
        qMap[q.skill_id].push(q)
      })
      qMap_ref.current = qMap  // store for add-topic modal

      // ── SESSION SHUFFLE ──────────────────────────────────────
      // Shuffle T1/T2 banked questions so different ones appear each session
      const sessionSeed = Date.now()
      function shuffledSkillQs(skillId) {
        const qs = [...(qMap[skillId] || [])]
        // Fisher-Yates with session seed for T1/T2, stable for T3/T4
        for (let i = qs.length - 1; i > 0; i--) {
          const j = Math.floor(((sessionSeed * (i + 1)) % 999983) / 999983 * (i + 1))
          if (qs[i] && qs[j]) [qs[i], qs[j]] = [qs[j], qs[i]]
        }
        return qs.sort((a,b) => a.tier - b.tier) // keep tier order but shuffle within tiers
      }

      // ── INCLUSION TIERS ──────────────────────────────────────
      const due = getDueConcepts(allClassSkills, maxTopics)
      const retrieval = getRetrievalGaps(allClassSkills)
      const upcoming = getUpcomingSkills(allClassSkills, 7)
      console.log('[Generate] Inclusion tiers:', due.map(d => `${d.skill?.skill_name}(${d._inclusionTier})`).join(', '))

      // Upcoming prereqs
      const upcomingPrereqs = []
      const addedSkills = new Set(due.map(d => d.skill?.skill_name))
      upcoming.forEach(u => {
        const prereqs = u.skill?.prerequisites || []
        prereqs.forEach(p => {
          if (addedSkills.has(p)) return
          const match = allClassSkills.find(c => c.skill?.skill_name === p)
          if (match) { addedSkills.add(p); upcomingPrereqs.push({ ...match, _tag: `🔜 Prereq for ${u.skill?.skill_name}` }) }
        })
      })

      const built = []

      // ── WARM-UPS ────────────────────────────────────────────
      // Only include selected warm-up sets
      const warmupIndices = [...selectedWarmups].sort()
      warmupIndices.forEach(wIdx => {
        const f = FOUNDATIONAL[wIdx]
        if (!f) return
        built.push({
          id: `fndl-${wIdx}`,
          skill: { skill_name: f.label, strand: f.strand, year_level: 'F', topic: 'Foundational' },
          classSkill: null, tag: '⚡ Warm-up', isFoundational: true,
          singleMode: false, isBank: true,
          questions: [...f.questions],
          btbEasy: f.btbEasy, btbHard: f.btbHard, btbChain: '',
        })
      })

      // ── PREREQS ─────────────────────────────────────────────
      upcomingPrereqs.forEach(c => {
        const sk = c.skill || {}
        const qs = shuffledSkillQs(sk.id).filter(q => q.tier <= 2).slice(0, 3)
        qs.forEach((q, i) => built.push({
          id: `${c.id}-pre${i}`, skill: sk, classSkill: c, tag: c._tag,
          singleMode: true, isBank: false, isSpotlight: true,
          questions: [q],
          btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || '', btbChain: sk.btb_chain || getDailyChain(sk.skill_name) || '',
        }))
      })

      // ── RETRIEVAL ───────────────────────────────────────────
      retrieval.forEach(c => {
        const sk = c.skill || {}
        const qs = shuffledSkillQs(sk.id)
        let allQs = qs
        try { allQs = augmentWithGenerated(sk, qs) } catch(e) {}
        built.push({
          id: `${c.id}-ret`, skill: sk, classSkill: c, tag: '🧠 Retrieval',
          singleMode: false, isBank: true,
          questions: allQs,
          btbEasy: sk.btb_easy || '', btbHard: sk.btb_hard || '', btbChain: sk.btb_chain || getDailyChain(sk.skill_name) || '',
        })
      })

      // ── DUE TOPICS — SLIDE SETS based on inclusion tier ─────
      due.forEach((c, ci) => {
        const sk = c.skill || {}
        const inclusionTier = c._inclusionTier || 'review'
        const mastery = c.mastery || 1
        const lowStreak = (c.rating_history||[]).slice(-3).filter(r=>r.rating<=2).length >= 2
        const tag = mastery <= 2 ? '⚠ Low mastery' : ''
        const qs = shuffledSkillQs(sk.id)
        let allQs = qs
        try { allQs = augmentWithGenerated(sk, qs) } catch(e) { console.warn('[Generate] Generator failed:', sk.skill_name, e.message) }
        allQs.sort((a,b) => a.tier - b.tier)

        const byTier = {1:[],2:[],3:[],4:[]}
        allQs.forEach(q => { if(byTier[q.tier]) byTier[q.tier].push(q) })

        const base = { skill: sk, classSkill: c, tag, btbEasy: sk.btb_easy||'', btbHard: sk.btb_hard||'', btbChain: sk.btb_chain || getDailyChain(sk.skill_name) || '', isWC: lowStreak }

        console.log(`[Generate] ${ci+1}/${due.length}: ${sk.skill_name} [${inclusionTier}]`)

        // intensive: WC spotlight (T1) + MC spotlight + full bank
        if (inclusionTier === 'intensive') {
          // WC spotlight — T1 question for whole class
          const wcQ = byTier[1][0] || byTier[2][0]
          if (wcQ) built.push({ ...base, id: `${c.id}-wc`, singleMode: true, isBank: false, isSpotlight: true, isWC: true, spotlightIndex: 0, spotlightTotal: 2, questions: [wcQ] })
          // MC spotlight — find a MC question or use T2
          const mcQ = allQs.find(q => q.question_type === 'mc' || q.type === 'mc') || byTier[2][0] || byTier[1][1]
          if (mcQ) built.push({ ...base, id: `${c.id}-mc`, singleMode: true, isBank: false, isSpotlight: true, isMC: true, spotlightIndex: 1, spotlightTotal: 2, questions: [mcQ] })
          // Full bank
          built.push({ ...base, id: `${c.id}-bank`, singleMode: false, isBank: true, questions: allQs })
        }
        // moderate: T2 spotlight + MC + full bank
        else if (inclusionTier === 'moderate') {
          const t2Q = byTier[2][0] || byTier[1][0]
          if (t2Q) built.push({ ...base, id: `${c.id}-t2`, singleMode: true, isBank: false, isSpotlight: true, spotlightIndex: 0, spotlightTotal: 2, questions: [t2Q] })
          const mcQ = allQs.find(q => q.question_type === 'mc' || q.type === 'mc') || byTier[2][1]
          if (mcQ) built.push({ ...base, id: `${c.id}-mc`, singleMode: true, isBank: false, isSpotlight: true, isMC: true, spotlightIndex: 1, spotlightTotal: 2, questions: [mcQ] })
          built.push({ ...base, id: `${c.id}-bank`, singleMode: false, isBank: true, questions: allQs })
        }
        // light: MC + full bank
        else if (inclusionTier === 'light') {
          const mcQ = allQs.find(q => q.question_type === 'mc' || q.type === 'mc') || byTier[2][0]
          if (mcQ) built.push({ ...base, id: `${c.id}-mc`, singleMode: true, isBank: false, isSpotlight: true, isMC: true, spotlightIndex: 0, spotlightTotal: 1, questions: [mcQ] })
          built.push({ ...base, id: `${c.id}-bank`, singleMode: false, isBank: true, questions: allQs })
        }
        // review: full bank only
        else {
          built.push({ ...base, id: `${c.id}-bank`, singleMode: false, isBank: true, questions: allQs })
        }
      })

      console.log('[Generate] Total slides:', built.length)
      setSlides(built)
      setCurrentSlides(built)
      setSummary({ fndl: warmupIndices.length, prereqs: upcomingPrereqs.length, retrieval: retrieval.length, due: due.length, total: built.length })
      setLoading(false)
      showToast(`✓ Generated ${built.length} slides for ${due.length} skills`)

    } catch(err) {
      console.error('[Generate] ERROR:', err.message, err.stack)
      showToast(`Error: ${err.message}`)
      setLoading(false)
    }
  }
  function removeSlide(idx) {
    setSlides(s => { const n = [...s]; n.splice(idx, 1); setCurrentSlides(n); return n })
  }
  function moveSlide(idx, dir) {
    setSlides(s => {
      const n = [...s]
      const swapIdx = idx + dir
      if (swapIdx < 0 || swapIdx >= n.length) return s
      ;[n[idx], n[swapIdx]] = [n[swapIdx], n[idx]]
      setCurrentSlides(n)
      return n
    })
  }

  function regenerateSlide(idx) {
    const slide = slides[idx]
    if (!slide || slide.isExplanation || slide.isFoundational) return
    const sk = slide.skill || {}
    const cs = slide.classSkill
    if (!sk.id) return

    // Re-shuffle questions with a new seed
    const newSeed = Date.now() + Math.random() * 999999
    const qMap = {}
    ;(questions || []).forEach(q => {
      if (!qMap[q.skill_id]) qMap[q.skill_id] = []
      qMap[q.skill_id].push(q)
    })

    // Fisher-Yates shuffle with new seed
    const qs = [...(qMap[sk.id] || [])]
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(((newSeed * (i+1)) % 999983) / 999983 * (i+1))
      if (qs[i] && qs[j]) [qs[i], qs[j]] = [qs[j], qs[i]]
    }
    qs.sort((a, b) => a.tier - b.tier)

    let allQs = qs
    try { allQs = augmentWithGenerated(sk, qs) } catch(e) {}
    allQs.sort((a,b) => a.tier - b.tier)

    // Rebuild the slide with fresh questions
    setSlides(s => {
      const n = [...s]
      if (slide.isBank) {
        n[idx] = { ...n[idx], questions: allQs }
      } else if (slide.isSpotlight) {
        const byTier = {1:[],2:[],3:[],4:[]}
        allQs.forEach(q => { if(byTier[q.tier]) byTier[q.tier].push(q) })
        const spotQ = slide.isMC
          ? (allQs.find(q => q.question_type==='mc') || byTier[2][0] || byTier[1][0])
          : (slide.isWC ? byTier[1][0] : byTier[2][0] || byTier[1][0])
        if (spotQ) n[idx] = { ...n[idx], questions: [spotQ] }
      }
      setCurrentSlides(n)
      return n
    })
    showToast('↺ Slide regenerated')
  }

  function removeQuestion(slideIdx, qIdx) {
    setSlides(s => {
      const n = s.map((sl, i) => i !== slideIdx ? sl : { ...sl, questions: sl.questions.filter((_, qi) => qi !== qIdx) })
      setCurrentSlides(n); return n
    })
  }

  function openEditQ(slideIdx, qIdx) {
    const q = slides[slideIdx].questions[qIdx] || { tier: 1, type: 'std', question_text: '', answer_text: '', vc_code: '' }
    setEditQ({ tier: q.tier || 1, type: q.question_type || q.type || 'std', q: q.question_text || q.q || '', a: q.answer_text || q.a || '', vc: q.vc_code || q.vc || '' })
    setEditingSlide({ slideIdx, qIdx })
  }

  function openAddQ(slideIdx) {
    setEditQ({ tier: 2, type: 'std', q: '', a: '', vc: '' })
    setEditingSlide({ slideIdx, qIdx: -1 })
  }

  function saveEditQ() {
    const { slideIdx, qIdx } = editingSlide
    const newQ = { tier: editQ.tier, question_type: editQ.type, question_text: editQ.q, answer_text: editQ.a, vc_code: editQ.vc }
    setSlides(s => {
      const n = s.map((sl, i) => {
        if (i !== slideIdx) return sl
        const qs = [...sl.questions]
        if (qIdx === -1) qs.push(newQ)
        else qs[qIdx] = newQ
        return { ...sl, questions: qs }
      })
      setCurrentSlides(n); return n
    })
    setEditingSlide(null)
    showToast('✓ Saved')
  }

  const tierCls = ['', 't1', 't2', 't3', 't4']
  const tierBg  = ['', 'rgba(74,240,160,.08)', 'rgba(74,200,240,.08)', 'rgba(240,148,74,.08)', 'rgba(240,74,107,.08)']

  return (
    <div className="page-wrap">
      <div className="page-title">Generate Review Session</div>

      {/* Controls */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field" style={{ margin: 0, flex: 1, minWidth: 160 }}>
            <label>Class</label>
            <select className="input select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Max topics</label>
            <select className="input select" value={maxTopics} onChange={e => setMaxTopics(parseInt(e.target.value))}>
              {[10,12,15,18,20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Slide timer</label>
            <select className="input select" value={timerSecs} onChange={e => setTimerSecs(parseInt(e.target.value))}>
              {[10,15,20,30,45,60].map(t => <option key={t} value={t}>{t}s</option>)}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Bomb timer</label>
            <select className="input select" value={btbSecs} onChange={e => setBtbSecs(parseInt(e.target.value))}>
              {[60,90,120,180].map(t => <option key={t} value={t}>{t}s</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={doGenerate} disabled={loading} style={{ padding: '10px 24px' }}>
            {loading ? 'Building...' : 'Generate Slides'}
          </button>
          {slides.length > 0 && (
            <>
              <button className="btn" onClick={() => navigate('/present', { state: { slides, timerSecs, btbSecs } })}
                style={{ background: 'rgba(74,200,240,.14)', borderColor: 'var(--blu)', color: 'var(--blu)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                ▶ Present ({slides.length + 1} slides)
              </button>
              <button className="btn btn-secondary" onClick={() => openHomeworkPrint(slides, classes.find(c=>c.id===activeClass)?.name || '')} style={{ fontSize: 12 }}>
                📄 Homework Sheet
              </button>
              <button className="btn btn-secondary" onClick={() => setAddTopicOpen(true)} style={{ fontSize: 12 }}>
                + Add Topic
              </button>
              <button className="btn btn-secondary" onClick={() => { setEditingExpSlide(null); setExpModalOpen(true) }} style={{ fontSize: 12 }}>
                + Explanation Slide
              </button>
            </>
          )}
        </div>
      </div>

      {/* Warm-up Set Selector */}
      <div className="card card-pad" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--td)', marginBottom: 8 }}>⚡ Warm-up Sets (select to include)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FOUNDATIONAL.map((f, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--rs)', border: `1px solid ${selectedWarmups.has(i) ? 'var(--blu)' : 'var(--b2)'}`, background: selectedWarmups.has(i) ? 'rgba(74,200,240,.1)' : 'transparent', cursor: 'pointer', fontSize: 12, color: selectedWarmups.has(i) ? 'var(--blu)' : 'var(--td)', transition: 'all .15s', userSelect: 'none' }}>
              <input type="checkbox" checked={selectedWarmups.has(i)} onChange={() => {
                setSelectedWarmups(prev => {
                  const n = new Set(prev)
                  n.has(i) ? n.delete(i) : n.add(i)
                  return n
                })
              }} style={{ display: 'none' }} />
              {selectedWarmups.has(i) ? '✓' : '○'} {f.label}
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ padding: '10px 16px', background: 'rgba(74,200,240,.06)', border: '1px solid rgba(74,200,240,.2)', borderRadius: 'var(--rs)', fontSize: 12, color: 'var(--td)', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ color: 'var(--blu)' }}>Session:</strong>
          <span>{summary.fndl} warm-up</span> ·
          <span>{summary.prereqs} prereqs</span> ·
          <span>{summary.retrieval} retrieval</span> ·
          <span>{summary.due} scheduled</span> ·
          <span>1 Beat the Bomb</span> =
          <strong style={{ color: 'var(--tx)' }}>{summary.total + 1} slides (~{Math.round((summary.total + 1) * timerSecs / 60)} min)</strong>
        </div>
      )}

      {/* Slide cards */}
      {(() => {
        // Group slides by skill for visual grouping
        // Spotlight slides + bank slide for the same skill appear together
        const groups = []
        let curGroup = null
        slides.forEach((slide, si) => {
          // Explanation slides always get their own group
          if (slide.isExplanation) {
            if (curGroup) { groups.push(curGroup); curGroup = null }
            groups.push({ skillKey: slide.id, slides: [{ slide, si }], isFoundational: false, isExplanation: true })
            return
          }
          const skillKey = slide.skill?.skill_name || slide.id
          if (!curGroup || curGroup.skillKey !== skillKey || slide.isBank || slide.isFoundational) {
            if (curGroup) groups.push(curGroup)
            curGroup = { skillKey, slides: [], isFoundational: slide.isFoundational }
          }
          curGroup.slides.push({ slide, si })
          if (slide.isBank) {
            groups.push(curGroup)
            curGroup = null
          }
        })
        if (curGroup) groups.push(curGroup)

        return groups.map((group, gi) => {
          const firstSlide = group.slides[0]?.slide || {}
          const sk = firstSlide.skill || {}
          const strandCls = 'st-' + (sk.strand || '').toLowerCase().split(' ')[0]
          const spotCount = group.slides.filter(s => s.slide.isSpotlight).length
          const hasBank = group.slides.some(s => s.slide.isBank)
          const isFoundational = group.isFoundational
          const isExplanationGroup = group.isExplanation

          return (
            <div key={gi} style={{ marginBottom: 20 }}>
              {/* Group header */}
              {!isFoundational && group.slides.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 12px', background: 'var(--s2)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)' }}>
                  <span className={`strand-tag ${strandCls}`}>{sk.strand}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{sk.skill_name}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: 'var(--tm)' }}>
                    {spotCount > 0 && `${spotCount} spotlight${spotCount > 1 ? 's' : ''} → `}
                    {hasBank && '1 full bank'}
                  </span>
                  {sk.year_level !== 'F' && <span className="yr-tag">Yr {sk.year_level}</span>}
                </div>
              )}

              {/* Individual slides in group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: !isFoundational && group.slides.length > 1 ? 16 : 0, borderLeft: !isFoundational && group.slides.length > 1 ? '2px solid var(--b2)' : 'none' }}>
                {group.slides.map(({ slide, si }) => {
                  const isSpotlight = slide.isSpotlight
                  const isBank = slide.isBank
                  const slideTag = isSpotlight
                    ? `💡 Spotlight Q (${slide.spotlightIndex + 1}/${slide.spotlightTotal})`
                    : isBank ? '📋 Full Bank' : slide.tag || ''
                  const borderCol = isBank ? 'rgba(74,200,240,.35)' : isSpotlight ? 'rgba(160,74,240,.25)' : 'var(--b1)'
                  const bgCol = isBank ? 'rgba(74,200,240,.03)' : isSpotlight ? 'rgba(160,74,240,.02)' : 'var(--s1)'

                  // ── EXPLANATION SLIDE ──
                if (slide.isExplanation) {
                  return (
                    <div key={slide.id} className="card" style={{ border: '1px solid rgba(160,74,240,.3)', background: 'rgba(160,74,240,.04)', marginBottom: 5 }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(160,74,240,.15)', color: 'var(--pur)' }}>📖 Explanation Slide</span>
                        <span style={{ flex: 1, fontSize: 12, color: 'var(--td)' }}>{slide.expTitle || 'Untitled explanation'}</span>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--pur)', fontSize: 11 }} onClick={() => { setEditingExpSlide({si, slide}); setExpModalOpen(true) }}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--td)', fontSize: 12 }} onClick={() => moveSlide(si, -1)}>↑</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--td)', fontSize: 12 }} onClick={() => moveSlide(si, 1)}>↓</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: 14 }} onClick={() => removeSlide(si)}>✕</button>
                      </div>
                      {/* Compact preview of content */}
                      <div style={{ padding: '8px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        {slide.expImage && <img src={slide.expImage} alt="" style={{ height: 48, width: 64, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {slide.expText && <div style={{ fontSize: 11, color: 'var(--td)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{slide.expText}</div>}
                          {slide.expVideo && <div style={{ fontSize: 10, color: 'var(--blu)', marginTop: 2 }}>🎬 Video attached</div>}
                          {!slide.expText && !slide.expImage && !slide.expVideo && <div style={{ fontSize: 11, color: 'var(--tm)', fontStyle: 'italic' }}>Click Edit to add content</div>}
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                    <div key={slide.id} className="card" style={{ border: `1px solid ${borderCol}`, background: bgCol }}>
                      {/* Slide header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '10px 14px', borderBottom: '1px solid var(--b1)' }}>
                        <span style={{ fontSize: 10, color: 'var(--tm)', fontWeight: 600, minWidth: 32 }}>#{si + 1}</span>
                        {/* Slide type badge */}
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
                          background: isBank ? 'rgba(74,200,240,.15)' : isSpotlight ? 'rgba(160,74,240,.15)' : 'rgba(74,240,160,.1)',
                          color: isBank ? 'var(--blu)' : isSpotlight ? 'var(--pur)' : 'var(--grn)',
                        }}>{slideTag}</span>
                        {slide.tag && !isSpotlight && !isBank && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: slide.tag.includes('⚠') ? 'var(--org)' : 'var(--blu)', padding: '2px 6px', background: slide.tag.includes('⚠') ? 'rgba(240,148,74,.1)' : 'rgba(74,200,240,.1)', borderRadius: 4 }}>{slide.tag}</span>
                        )}
                        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: isBank ? 700 : 500, fontSize: 13, color: isBank ? 'var(--tx)' : 'var(--td)' }}>
                          {isFoundational || group.slides.length === 1 ? sk.skill_name : (isBank ? 'All questions — work independently' : '')}
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {isBank && (
                            <button onClick={() => setSlides(s => { const n = [...s]; n[si] = { ...n[si], singleMode: !n[si].singleMode }; setCurrentSlides(n); return n })}
                              style={{ padding: '4px 10px', border: `1px solid ${slides[si]?.singleMode ? 'var(--blu)' : 'var(--b2)'}`, borderRadius: 4, background: slides[si]?.singleMode ? 'rgba(74,200,240,.1)' : 'transparent', color: slides[si]?.singleMode ? 'var(--blu)' : 'var(--tm)', fontSize: 10, cursor: 'pointer' }}>
                              {slides[si]?.singleMode ? '1️⃣ Single ✓' : '📋 Tiered'}
                            </button>
                          )}
                          {!slide.isExplanation && !slide.isFoundational && (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--acc)', fontSize: 11, padding: '2px 6px' }} onClick={() => regenerateSlide(si)} title="Regenerate questions">↺</button>
                          )}
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--td)', fontSize: 12, padding: '2px 5px' }} onClick={() => moveSlide(si, -1)} title="Move up">↑</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--td)', fontSize: 12, padding: '2px 5px' }} onClick={() => moveSlide(si, 1)} title="Move down">↓</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: 14 }} onClick={() => removeSlide(si)}>✕</button>
                        </div>
                      </div>

                      {/* Questions */}
                      <div style={{ padding: '8px 12px' }}>
                        {slide.questions.map((q, qi) => {
                          const qt = q.question_type || q.type || 'std'
                          const qtext = q.question_text || q.q || ''
                          const atext = q.answer_text || q.a || ''
                          const vccode = q.vc_code || q.vc || ''
                          return (
                            <div key={qi} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 8, alignItems: 'start', padding: '7px 10px', background: 'var(--s2)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)', marginBottom: 5 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: ['','rgba(74,240,160,.15)','rgba(74,200,240,.15)','rgba(240,148,74,.15)','rgba(240,74,107,.15)'][q.tier || 1], color: ['','var(--grn)','var(--blu)','var(--org)','var(--red)'][q.tier || 1], whiteSpace: 'nowrap', marginTop: 2 }}>
                                T{q.tier}
                              </span>
                              <div>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 3, flexWrap: 'wrap' }}>
                                  {qt !== 'std' && <span className={`qtype-badge qt-${qt}`}>{QTYPE_LABELS[qt] || qt}</span>}
                                  {vccode && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tm)', padding: '1px 4px', border: '1px solid var(--b1)', borderRadius: 3 }}>{vccode}</span>}
                                  {q.image_url && <span style={{ fontSize: 9, color: 'var(--blu)' }}>🖼</span>}
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{qtext}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tm)', marginTop: 3 }}>→ {atext}</div>
                              </div>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--blu)' }} onClick={() => openEditQ(si, qi)}>Edit</button>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => removeQuestion(si, qi)}>✕</button>
                            </div>
                          )
                        })}
                        {isBank && (
                          <button onClick={() => openAddQ(si)} style={{ width: '100%', padding: '6px', border: '1px dashed var(--b2)', borderRadius: 'var(--rs)', background: 'transparent', color: 'var(--tm)', fontSize: 11, cursor: 'pointer' }}>
                            + Add question to bank
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      })()}
      {/* Beat the Bomb preview card */}
      {slides.length > 0 && (() => {
        const bombSlide = [...slides].reverse().find(s => s.btbEasy || s.btbChain) || slides[slides.length - 1] || {}
        const chain = bombSlide.btbChain || ''
        const easy = bombSlide.btbEasy || ''
        const hard = bombSlide.btbHard || ''
        const skillName = bombSlide.skill?.skill_name || ''
        return (
          <div className="card card-pad" style={{ background:'linear-gradient(135deg,rgba(240,74,107,.05),rgba(160,74,240,.05))', border:'1px solid rgba(240,74,107,.2)', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, flexWrap:'wrap' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--red)' }}>
                💣 Beat the Bomb — {btbSecs}s
              </div>
              <div style={{ flex:1 }} />
              {/* Mode toggle */}
              <div style={{ display:'flex', gap:6 }}>
                {[
                  { key:'chain', label:'⛓ Chain Operations', desc:'Students apply sequential operations to a starting number' },
                  { key:'content', label:'📚 Lesson Content', desc:'Questions based on the skill being reviewed' },
                ].map(m => (
                  <button key={m.key} onClick={() => setBtbMode(m.key)} title={m.desc}
                    style={{ padding:'6px 14px', borderRadius:'var(--rs)', fontSize:11, fontWeight:600, cursor:'pointer',
                      border:`1px solid ${btbMode===m.key?'var(--red)':'var(--b2)'}`,
                      background: btbMode===m.key?'rgba(240,74,107,.15)':'transparent',
                      color: btbMode===m.key?'var(--red)':'var(--tm)',
                      transition:'all .15s' }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {btbMode === 'chain' ? (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div style={{ background:'rgba(167,139,250,.07)', border:'1px solid rgba(167,139,250,.3)', borderRadius:'var(--rs)', padding:'10px 14px' }}>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:'var(--pur)', marginBottom:6, letterSpacing:'.1em' }}>⛓ Chain Challenge</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.7, color:'var(--tx)', whiteSpace:'pre-wrap' }}>{chain || <span style={{ color:'var(--tm)', fontStyle:'italic' }}>Chain will auto-populate from btbChains library</span>}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ background:'rgba(74,240,160,.05)', border:'1px solid rgba(74,240,160,.3)', borderRadius:'var(--rs)', padding:'8px 12px' }}>
                    <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:'var(--grn)', marginBottom:4 }}>⚡ Standard</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:11, lineHeight:1.5 }}>{easy || <span style={{ color:'var(--tm)', fontStyle:'italic' }}>Set in Question Bank → Skill → BtB Easy</span>}</div>
                  </div>
                  <div style={{ background:'rgba(240,74,107,.05)', border:'1px solid rgba(240,74,107,.3)', borderRadius:'var(--rs)', padding:'8px 12px' }}>
                    <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:'var(--red)', marginBottom:4 }}>💀 Elite</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:11, lineHeight:1.5 }}>{hard || <span style={{ color:'var(--tm)', fontStyle:'italic' }}>Set in Question Bank → Skill → BtB Hard</span>}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div style={{ background:'rgba(74,240,160,.05)', border:'1px solid rgba(74,240,160,.3)', borderRadius:'var(--rs)', padding:'10px 14px' }}>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:'var(--grn)', marginBottom:6 }}>⚡ Standard — {skillName}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.5 }}>{easy || <span style={{ color:'var(--tm)', fontStyle:'italic' }}>Set in Question Bank → Skill → BtB Easy</span>}</div>
                </div>
                <div style={{ background:'rgba(240,74,107,.05)', border:'1px solid rgba(240,74,107,.3)', borderRadius:'var(--rs)', padding:'10px 14px' }}>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:'var(--red)', marginBottom:6 }}>💀 Elite — {skillName}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.5 }}>{hard || <span style={{ color:'var(--tm)', fontStyle:'italic' }}>Set in Question Bank → Skill → BtB Hard</span>}</div>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {slides.length === 0 && !loading && (
        <div className="empty-state">
          <div className="icon">⚡</div>
          <p>Click Generate Slides to build today's review session. The system will automatically include foundational warm-ups, prerequisite checks and spaced repetition topics.</p>
        </div>
      )}

      {/* Edit modal */}
      {editingSlide && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditingSlide(null)}>
          <div className="modal">
            <h3>{editingSlide.qIdx === -1 ? 'Add Question' : 'Edit Question'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Tier</label>
                <select className="input select" value={editQ.tier} onChange={e => setEditQ(q => ({ ...q, tier: parseInt(e.target.value) }))}>
                  {[1,2,3,4].map(t => <option key={t} value={t}>T{t} — {TIER_FULL[t]}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Type</label>
                <select className="input select" value={editQ.type} onChange={e => setEditQ(q => ({ ...q, type: e.target.value }))}>
                  {Object.entries(QTYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>VC Code</label>
                <input className="input" value={editQ.vc} onChange={e => setEditQ(q => ({ ...q, vc: e.target.value }))} placeholder="e.g. VC2M9A01" />
              </div>
            </div>
            <div className="field">
              <label>Question</label>
              <textarea className="input textarea" value={editQ.q} onChange={e => setEditQ(q => ({ ...q, q: e.target.value }))} />
            </div>
            <div className="field">
              <label>Answer</label>
              <textarea className="input textarea" style={{ minHeight: 60 }} value={editQ.a} onChange={e => setEditQ(q => ({ ...q, a: e.target.value }))} />
            </div>
            <div className="modal-footer">
              {editingSlide.qIdx !== -1 && <button className="btn btn-danger" onClick={() => { removeQuestion(editingSlide.slideIdx, editingSlide.qIdx); setEditingSlide(null) }}>Remove</button>}
              <button className="btn btn-secondary" onClick={() => setEditingSlide(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEditQ} disabled={!editQ.q || !editQ.a}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      {/* ── ADD TOPIC MODAL ── */}
      {expModalOpen && <ExplanationSlideModal
        initial={editingExpSlide?.slide || null}
        onSave={(data) => {
          console.log('[ExpModal] Saving data:', JSON.stringify({ expTitle: data.expTitle, expText: data.expText?.slice(0,50), expImage: data.expImage?.slice(0,30), expVideo: data.expVideo }))
          if (editingExpSlide) {
            const si = editingExpSlide.si
            setSlides(s => { const n=[...s]; n[si]={...n[si],...data}; setCurrentSlides(n); return n })
          } else {
            const newSlide = {
              id: `exp-${Date.now()}`, isExplanation: true, singleMode: true, isBank: false,
              skill: { skill_name: data.expTitle || 'Explanation', strand: '', year_level: '', topic: '' },
              questions: [], btbEasy: '', btbHard: '', btbChain: '',
              expTitle: data.expTitle || '',
              expText:  data.expText  || '',
              expImage: data.expImage || '',
              expVideo: data.expVideo || '',
            }
            console.log('[ExpModal] New slide created:', JSON.stringify({ expTitle: newSlide.expTitle, expText: newSlide.expText?.slice(0,50), isExplanation: newSlide.isExplanation }))
            setSlides(s => { const n=[...s, newSlide]; setCurrentSlides(n); return n })
          }
          setExpModalOpen(false)
          setEditingExpSlide(null)
        }}
        onClose={() => { setExpModalOpen(false); setEditingExpSlide(null) }}
      />}

      {addTopicOpen && <AddTopicToSlides
        allSkills={allSkills}
        onAdd={(sk) => {
          // Create a full review slide for the added skill
          const fakeCS = { id: `manual-${sk.id}`, skill_id: sk.id, skill: sk, mastery: 1, last_reviewed: null, rating_history: [] }
          const qs = (qMap_ref.current[sk.id] || []).sort((a,b) => a.tier-b.tier)
          let allQs = qs
          try { allQs = augmentWithGenerated(sk, qs) } catch(e) {}
          const newSlide = { id: `manual-${sk.id}-bank`, skill: sk, classSkill: fakeCS,
            tag: '➕ Added', singleMode: false, isBank: true, questions: allQs,
            btbEasy: sk.btb_easy||'', btbHard: sk.btb_hard||'', btbChain: sk.btb_chain||'' }
          setSlides(s => { const n = [...s, newSlide]; setCurrentSlides(n); return n })
          setAddTopicOpen(false)
          showToast(`Added: ${sk.skill_name}`)
        }}
        onClose={() => setAddTopicOpen(false)}
      />}

      {/* ── EXPLANATION SLIDE EDITOR ── */}
      {slides.some(s => s.isExplanation) && slides.map((slide, si) => slide.isExplanation && (
        <div key={slide.id} style={{ display:'none' }} /> // Explanation slides are edited inline in the slide list
      ))}
    </div>
  )
}

// ── ADD TOPIC TO SLIDES MODAL ──────────────────────────────
function AddTopicToSlides({ allSkills, onAdd, onClose }) {
  const [yr, setYr] = useState('')
  const [strand, setStrand] = useState('')
  const [topic, setTopic] = useState('')
  const [skillId, setSkillId] = useState('')

  const years = [...new Set(allSkills.map(s => s.year_level))].sort((a,b)=>{
    if(a==='F') return -1; if(b==='F') return 1; return a-b
  })
  const strands = [...new Set(allSkills.filter(s=>!yr||s.year_level==yr).map(s=>s.strand))].sort()
  const topics = [...new Set(allSkills.filter(s=>(!yr||s.year_level==yr)&&(!strand||s.strand===strand)).map(s=>s.topic))].sort()
  const filteredSkills = allSkills.filter(s=>(!yr||s.year_level==yr)&&(!strand||s.strand===strand)&&(!topic||s.topic===topic))
  const selectedSkill = allSkills.find(s=>s.id===skillId)

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div className="card card-pad" style={{ width:500,maxHeight:'80vh',overflow:'auto' }}>
        <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:16 }}>Add Topic to Review</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12 }}>
          <div className="field" style={{margin:0}}>
            <label>Year Level</label>
            <select className="input select" value={yr} onChange={e=>{setYr(e.target.value);setStrand('');setTopic('');setSkillId('')}}>
              <option value="">All years</option>
              {years.map(y=><option key={y} value={y}>{y==='F'?'Foundational':`Year ${y}`}</option>)}
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label>Strand</label>
            <select className="input select" value={strand} onChange={e=>{setStrand(e.target.value);setTopic('');setSkillId('')}}>
              <option value="">All strands</option>
              {strands.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label>Topic</label>
            <select className="input select" value={topic} onChange={e=>{setTopic(e.target.value);setSkillId('')}}>
              <option value="">All topics</option>
              {topics.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label>Skill</label>
            <select className="input select" value={skillId} onChange={e=>setSkillId(e.target.value)}>
              <option value="">Select skill...</option>
              {filteredSkills.map(s=><option key={s.id} value={s.id}>{s.skill_name}</option>)}
            </select>
          </div>
        </div>
        {selectedSkill && (
          <div style={{ padding:'10px 12px',background:'var(--s2)',borderRadius:'var(--rs)',fontSize:12,marginBottom:12,color:'var(--td)' }}>
            <strong>{selectedSkill.skill_name}</strong><br/>
            {selectedSkill.strand} · Year {selectedSkill.year_level} · {selectedSkill.topic}
            {selectedSkill.vc_code && <span style={{marginLeft:8,opacity:.6}}>{selectedSkill.vc_code}</span>}
          </div>
        )}
        <div style={{ display:'flex',gap:8 }}>
          <button className="btn btn-primary" disabled={!skillId} onClick={() => onAdd(selectedSkill)}>Add to Review</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── EXPLANATION SLIDE MODAL ────────────────────────────────
function ExplanationSlideModal({ initial, onSave, onClose }) {
  const [expTitle, setExpTitle] = useState(initial?.expTitle || '')
  const [expText,  setExpText]  = useState(initial?.expText  || '')
  const [expImage, setExpImage] = useState(initial?.expImage || '')
  const [expVideo, setExpVideo] = useState(initial?.expVideo || '')
  const [uploading, setUploading] = useState(false)

  async function handleImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = ev => { setExpImage(ev.target.result); setUploading(false) }
    reader.readAsDataURL(file)
  }

  function save() {
    onSave({ expTitle, expText, expImage, expVideo })
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(6px)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'var(--s1)', border:'1px solid var(--pur)', borderRadius:14, width:'100%', maxWidth:600, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--b2)', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:16 }}>📖</span>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, flex:1 }}>
            {initial ? 'Edit Explanation Slide' : 'New Explanation Slide'}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--tm)', cursor:'pointer', fontSize:18, padding:'0 4px' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>

          <div className="field" style={{ margin:0 }}>
            <label>Title / Heading</label>
            <input className="input" placeholder="e.g. How to expand brackets..." value={expTitle} onChange={e => setExpTitle(e.target.value)} autoFocus />
          </div>

          <div className="field" style={{ margin:0 }}>
            <label>Explanation Text</label>
            <textarea className="input textarea" rows={5} placeholder="Write your explanation, worked example, key steps, or hint here..." value={expText} onChange={e => setExpText(e.target.value)} style={{ resize:'vertical', fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.6 }} />
          </div>

          <div className="field" style={{ margin:0 }}>
            <label>Image</label>
            <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
              <input className="input" style={{ flex:1, minWidth:200 }} placeholder="Paste image URL..." value={expImage.startsWith('data:') ? '' : expImage} onChange={e => setExpImage(e.target.value)} />
              <label style={{ padding:'9px 14px', background:'var(--s2)', border:'1px solid var(--b2)', borderRadius:'var(--rs)', cursor:'pointer', fontSize:12, color:'var(--td)', whiteSpace:'nowrap', flexShrink:0 }}>
                {uploading ? '⏳ Uploading...' : '📁 Upload file'}
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageFile} />
              </label>
            </div>
            {expImage && (
              <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'var(--s2)', borderRadius:'var(--rs)' }}>
                <img src={expImage} alt="" style={{ height:60, maxWidth:120, objectFit:'contain', borderRadius:4 }} />
                <div style={{ flex:1, fontSize:11, color:'var(--tm)', wordBreak:'break-all' }}>{expImage.startsWith('data:') ? '📎 Uploaded image' : expImage.slice(0,60)+'...'}</div>
                <button onClick={() => setExpImage('')} style={{ background:'none', border:'1px solid var(--red)', color:'var(--red)', borderRadius:4, padding:'3px 8px', cursor:'pointer', fontSize:11, flexShrink:0 }}>Remove</button>
              </div>
            )}
          </div>

          <div className="field" style={{ margin:0 }}>
            <label>Video URL (YouTube or other)</label>
            <input className="input" placeholder="https://youtube.com/watch?v=..." value={expVideo} onChange={e => setExpVideo(e.target.value)} />
            {expVideo && <div style={{ fontSize:11, color:'var(--blu)', marginTop:4 }}>🎬 Video will be embedded in the slide</div>}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid var(--b2)', display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={!expTitle && !expText && !expImage}>
            {initial ? 'Save Changes' : 'Add Slide'}
          </button>
        </div>
      </div>
    </div>
  )
}
