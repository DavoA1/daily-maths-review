// ═══════════════════════════════════════════════════════════════
// BEAT THE BOMB — CHAIN CHALLENGES
// Format matches the classroom BtB format:
//   - Starting number shown at top
//   - Normal column (left): accessible operations + running totals
//   - Challenge column (right): harder operations + running totals
//   - Both start from the same number
//   - At least 5 steps each
// ═══════════════════════════════════════════════════════════════

// Each chain entry: { start, normal: [{op, result},...], challenge: [{op, result},...] }
// topic key maps to an array of chain objects

export const BTC_CHAINS = {

  // ── GENERAL / WARM-UP ───────────────────────────────────
  'default': [
    {
      start: 50,
      normal: [
        { op: '+ 10',       result: 60 },
        { op: '÷ 10',       result: 6  },
        { op: '× 2',        result: 12 },
        { op: '+ 3',        result: 15 },
        { op: '÷ 5',        result: 3  },
        { op: '× by itself',result: 9  },
      ],
      challenge: [
        { op: '3/5 of',              result: 30   },
        { op: '× 2.5',               result: 75   },
        { op: '+ 1/3 of answer',     result: 100  },
        { op: '× 13',                result: 1300 },
        { op: '÷ 50',                result: 26   },
        { op: '× 5',                 result: 130  },
      ],
    },
    {
      start: 36,
      normal: [
        { op: '÷ 4',         result: 9  },
        { op: '× 5',         result: 45 },
        { op: '+ 15',        result: 60 },
        { op: '÷ 6',         result: 10 },
        { op: '× 7',         result: 70 },
        { op: '− 10',        result: 60 },
      ],
      challenge: [
        { op: '√ of start',           result: 6   },
        { op: '× 2.5',                result: 15  },
        { op: '+ 25% of 100',         result: 40  },
        { op: '× 1.5',                result: 60  },
        { op: '− 1/3 of answer',      result: 40  },
        { op: '²',                    result: 1600},
      ],
    },
  ],

  // ── INTEGER OPERATIONS ──────────────────────────────────
  'Integer operations': [
    {
      start: 64,
      normal: [
        { op: '÷ 8',      result: 8    },
        { op: '× 3',      result: 24   },
        { op: '− 6',      result: 18   },
        { op: '÷ 2',      result: 9    },
        { op: '+ 11',     result: 20   },
        { op: '÷ 4',      result: 5    },
      ],
      challenge: [
        { op: '× (−3)',    result: -192 },
        { op: '+ 100',     result: -92  },
        { op: '÷ (−4)',    result: 23   },
        { op: '− 30',      result: -7   },
        { op: '× (−2)',    result: 14   },
        { op: '÷ 7',       result: 2    },
      ],
    },
  ],

  // ── PERCENTAGES ─────────────────────────────────────────
  'Percentages': [
    {
      start: 200,
      normal: [
        { op: 'find 50%',     result: 100 },
        { op: '+ 20',         result: 120 },
        { op: 'find 10%',     result: 12  },
        { op: '× 3',          result: 36  },
        { op: '− 6',          result: 30  },
        { op: 'find 20%',     result: 6   },
      ],
      challenge: [
        { op: 'increase by 20%', result: 240  },
        { op: 'decrease by 25%', result: 180  },
        { op: 'find 15%',        result: 27   },
        { op: '× 4',             result: 108  },
        { op: 'increase by 50%', result: 162  },
        { op: 'find 33⅓%',       result: 54   },
      ],
    },
    {
      start: 80,
      normal: [
        { op: 'find 25%',     result: 20  },
        { op: '× 3',          result: 60  },
        { op: 'find 10%',     result: 6   },
        { op: '+ 14',         result: 20  },
        { op: 'find 50%',     result: 10  },
        { op: '× 9',          result: 90  },
      ],
      challenge: [
        { op: 'decrease by 15%', result: 68   },
        { op: 'find 50%',        result: 34   },
        { op: 'increase by 200%',result: 102  },
        { op: '÷ 6',             result: 17   },
        { op: 'increase by 100%',result: 34   },
        { op: 'decrease by 50%', result: 17   },
      ],
    },
  ],

  // ── SIMPLE & COMPOUND INTEREST ──────────────────────────
  'Simple interest': [
    {
      start: 1000,
      normal: [
        { op: 'find 5%',       result: 50   },
        { op: '× 3 years',     result: 150  },
        { op: '+ principal',   result: 1150 },
        { op: '÷ 100',         result: 11.5 },
        { op: '× 8',           result: 92   },
        { op: '+ 8',           result: 100  },
      ],
      challenge: [
        { op: 'SI: P=$2000, r=4%, t=3yr → I', result: 240  },
        { op: '+ principal',                   result: 2240 },
        { op: 'find 10%',                      result: 224  },
        { op: '× 0.5',                         result: 112  },
        { op: '+ 88',                          result: 200  },
        { op: '÷ 4',                           result: 50   },
      ],
    },
  ],
  'Compound interest': [
    {
      start: 1000,
      normal: [
        { op: 'CI 10% 1yr → A',  result: 1100 },
        { op: 'CI 10% again',    result: 1210 },
        { op: '− original',      result: 210  },
        { op: '÷ 21',            result: 10   },
        { op: '× 7',             result: 70   },
        { op: '+ 30',            result: 100  },
      ],
      challenge: [
        { op: 'CI: P=$500, r=8%, t=2yr → A',  result: 583.2 },
        { op: 'round to nearest dollar',       result: 583   },
        { op: '− original $500',               result: 83    },
        { op: '× 2',                           result: 166   },
        { op: '÷ 83',                          result: 2     },
        { op: '× 50',                          result: 100   },
      ],
    },
  ],

  // ── EXPANDING ───────────────────────────────────────────
  'Expanding': [
    {
      start: 'x = 3',
      normal: [
        { op: 'expand 2(x+4)',    result: '2x+8'   },
        { op: 'substitute x=3',  result: 14       },
        { op: '÷ 7',             result: 2        },
        { op: '× 5',             result: 10       },
        { op: '− 4',             result: 6        },
        { op: '÷ 3',             result: 2        },
      ],
      challenge: [
        { op: 'expand (x+3)(x−2)', result: 'x²+x−6' },
        { op: 'substitute x=3',    result: 6        },
        { op: '+ expand −2(x+1) at x=3', result: -2 },
        { op: '× (−3)',            result: 6        },
        { op: '+ 14',              result: 20       },
        { op: '÷ 4',               result: 5        },
      ],
    },
  ],

  // ── LINEAR EQUATIONS ────────────────────────────────────
  'Linear equations': [
    {
      start: 'solve each',
      normal: [
        { op: '3x = 21 → x =',      result: 7  },
        { op: '× 4',                 result: 28 },
        { op: '− 3',                 result: 25 },
        { op: '÷ 5',                 result: 5  },
        { op: '2x+1=11 → x =',      result: 5  },
        { op: '× by itself',         result: 25 },
      ],
      challenge: [
        { op: '3(x−2)=12 → x =',     result: 6  },
        { op: '× 5',                  result: 30 },
        { op: '5x−3=27 → x =',       result: 6  },
        { op: '+ first answer',       result: 12 },
        { op: '÷ 4',                  result: 3  },
        { op: '2(3x+1)=20 → x =',    result: 3  },
      ],
    },
  ],

  // ── PYTHAGORAS ───────────────────────────────────────────
  'Pythagoras': [
    {
      start: 'use Pythagoras',
      normal: [
        { op: 'a=3, b=4 → c =',       result: 5   },
        { op: '× 3',                   result: 15  },
        { op: '+ 2',                   result: 17  },
        { op: 'a=8, b=15 → c =',      result: 17  },
        { op: '− 10',                  result: 7   },
        { op: '× by itself',           result: 49  },
      ],
      challenge: [
        { op: 'c=13, b=5 → a =',       result: 12  },
        { op: '× 2.5',                  result: 30  },
        { op: '÷ 6',                    result: 5   },
        { op: 'c=10, a=6 → b =',       result: 8   },
        { op: '+ first answer',         result: 20  },
        { op: '÷ 4',                    result: 5   },
      ],
    },
  ],

  // ── TRIGONOMETRY ────────────────────────────────────────
  'Trigonometry': [
    {
      start: 'use trig',
      normal: [
        { op: 'sin 30° =',         result: 0.5  },
        { op: '× 20',              result: 10   },
        { op: '+ cos 60° × 10',    result: 15   },
        { op: '÷ 3',               result: 5    },
        { op: 'tan 45° × 8',       result: 8    },
        { op: '− 3',               result: 5    },
      ],
      challenge: [
        { op: 'sin 45° (exact)',    result: '√2/2' },
        { op: '× √2',              result: 1      },
        { op: '× 100',             result: 100    },
        { op: 'cos 30° × 2 (dec)', result: 1.73   },
        { op: '× 100 round whole', result: 173    },
        { op: '÷ 173',             result: 1      },
      ],
    },
  ],

  // ── INDEX LAWS ──────────────────────────────────────────
  'Index laws': [
    {
      start: 2,
      normal: [
        { op: '² (2 squared)',   result: 4   },
        { op: '³ (cube it)',     result: 64  },
        { op: '÷ 8',            result: 8   },
        { op: '× 2³',           result: 64  },
        { op: '÷ 2⁴',           result: 4   },
        { op: '× 2⁰',           result: 4   },
      ],
      challenge: [
        { op: 'x⁵ × x³ → index',    result: 8    },
        { op: '× 2',                 result: 16   },
        { op: 'a⁶ ÷ a² → index',    result: 4    },
        { op: '+ prev answer',       result: 20   },
        { op: '(2³)² → value',       result: 64   },
        { op: '÷ 16',                result: 4    },
      ],
    },
  ],

  // ── SURDS ───────────────────────────────────────────────
  'Surds': [
    {
      start: 48,
      normal: [
        { op: '√ of 48 simplified', result: '4√3' },
        { op: '× √3',               result: 12    },
        { op: '+ √25',              result: 17    },
        { op: '× 2',                result: 34    },
        { op: '− √49',              result: 27    },
        { op: '÷ 3',                result: 9     },
      ],
      challenge: [
        { op: '√12 + √27 simplified', result: '5√3' },
        { op: '× √3',                 result: 15    },
        { op: '− √144',               result: 3     },
        { op: '(3+√4)²  expand',      result: 25    },
        { op: '÷ 5',                  result: 5     },
        { op: '+ √ of 11² − 2',       result: 16    },
      ],
    },
  ],

  // ── LINEAR GRAPHS ───────────────────────────────────────
  'Linear graphs': [
    {
      start: 'y = 2x + 3',
      normal: [
        { op: 'y when x = 4',        result: 11  },
        { op: '− 3',                 result: 8   },
        { op: '÷ 4',                 result: 2   },
        { op: 'gradient of y=2x+3',  result: 2   },
        { op: '× 5',                 result: 10  },
        { op: 'y-intercept of line', result: 3   },
      ],
      challenge: [
        { op: 'gradient (2,5) to (6,13)',     result: 2   },
        { op: '× 3',                          result: 6   },
        { op: 'find b: y=3x+b thru (2,8)',    result: 2   },
        { op: '+ prev answer',                result: 8   },
        { op: 'y when x=−2, y=3x+b',         result: -4  },
        { op: '× (−2)',                       result: 8   },
      ],
    },
  ],

  // ── QUADRATICS ──────────────────────────────────────────
  'Quadratic equations': [
    {
      start: 'factorise',
      normal: [
        { op: 'x²+5x+6=0: larger root', result: -2  },
        { op: '× (−3)',                  result: 6   },
        { op: '+ 4',                     result: 10  },
        { op: 'x²−9: positive root',     result: 3   },
        { op: '× prev answer',           result: 30  },
        { op: '÷ 6',                     result: 5   },
      ],
      challenge: [
        { op: 'x²+7x+12=0: roots',        result: '-3,-4' },
        { op: 'product of roots',          result: 12     },
        { op: '÷ 3',                       result: 4      },
        { op: 'x²−5x+6=0: roots',         result: '2,3'  },
        { op: 'sum of roots',              result: 5      },
        { op: '× prev product ÷ 3',       result: 20     },
      ],
    },
  ],

  // ── PARABOLAS ───────────────────────────────────────────
  'Parabolas': [
    {
      start: 'y = x²',
      normal: [
        { op: 'vertex of y=(x−3)²+2', result: '(3,2)' },
        { op: 'x-coord of vertex',    result: 3       },
        { op: '× 4',                  result: 12      },
        { op: 'axis of y=(x+1)²−4',  result: -1      },
        { op: '+ prev answer × 3',    result: 9       },
        { op: '÷ 3',                  result: 3       },
      ],
      challenge: [
        { op: 'x-ints of y=x²−4x+3',       result: '1,3'  },
        { op: 'sum of x-intercepts',        result: 4      },
        { op: 'min value of y=(x−2)²−1',   result: -1     },
        { op: '+ 5',                        result: 4      },
        { op: '× sum of ints',              result: 16     },
        { op: '÷ 4',                        result: 4      },
      ],
    },
  ],

  // ── PROBABILITY ─────────────────────────────────────────
  'Probability': [
    {
      start: 60,
      normal: [
        { op: '× P(even on dice)',    result: 30  },
        { op: '÷ P(head on coin)',    result: 60  },
        { op: '× P(>4 on dice)',      result: 20  },
        { op: '+ 10',                 result: 30  },
        { op: '× P(any on dice)',     result: 30  },
        { op: '÷ 5',                  result: 6   },
      ],
      challenge: [
        { op: 'P(A)=0.3 → P(not A)',             result: 0.7 },
        { op: '× 100',                            result: 70  },
        { op: '÷ P(A or B) if P(B)=0.2, mut.ex.',result: 140 },
        { op: '÷ 14',                             result: 10  },
        { op: '× P(2 heads, 2 flips)',            result: 2.5 },
        { op: '× 4',                              result: 10  },
      ],
    },
  ],

  // ── MEAN & MEDIAN ───────────────────────────────────────
  'Mean and median': [
    {
      start: '3, 7, 8, 8, 9',
      normal: [
        { op: 'find the mean',      result: 7   },
        { op: '× 2',                result: 14  },
        { op: '− median',           result: 6   },
        { op: '+ range',            result: 12  },
        { op: '÷ 4',                result: 3   },
        { op: '× mode',             result: 24  },
      ],
      challenge: [
        { op: 'mean of 2,5,5,8,10,12', result: 7   },
        { op: '+ median of same set',  result: 13  },
        { op: '× 2',                   result: 26  },
        { op: '÷ range of set',        result: 2.6 },
        { op: '× 5',                   result: 13  },
        { op: '− mode of first set',   result: 5   },
      ],
    },
  ],
}

// Map skill/topic names to chain keys
export function getChainsForSkill(skillName) {
  if (!skillName) return BTC_CHAINS['default']
  const name = skillName.toLowerCase()
  
  const keyMap = [
    ['integer', 'Integer operations'],
    ['bidmas', 'Integer operations'],
    ['percent', 'Percentages'],
    ['simple interest', 'Simple interest'],
    ['compound interest', 'Compound interest'],
    ['interest', 'Simple interest'],
    ['expand', 'Expanding'],
    ['factoris', 'Quadratic equations'],
    ['quadrat', 'Quadratic equations'],
    ['parabola', 'Parabolas'],
    ['linear equat', 'Linear equations'],
    ['equation', 'Linear equations'],
    ['linear graph', 'Linear graphs'],
    ['gradient', 'Linear graphs'],
    ['pythag', 'Pythagoras'],
    ['trig', 'Trigonometry'],
    ['sine', 'Trigonometry'],
    ['cosine', 'Trigonometry'],
    ['tangent', 'Trigonometry'],
    ['index', 'Index laws'],
    ['indic', 'Index laws'],
    ['surd', 'Surds'],
    ['probability', 'Probability'],
    ['mean', 'Mean and median'],
    ['median', 'Mean and median'],
    ['statistic', 'Mean and median'],
  ]
  
  for (const [kw, key] of keyMap) {
    if (name.includes(kw)) return BTC_CHAINS[key] || BTC_CHAINS['default']
  }
  return BTC_CHAINS['default']
}

// Pick chain for today (rotates daily)
export function getDailyChain(skillName) {
  const chains = getChainsForSkill(skillName)
  if (!chains?.length) return null
  const day = Math.floor(Date.now() / 86400000)
  return chains[day % chains.length]
}
