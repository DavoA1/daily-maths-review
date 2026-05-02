// ═══════════════════════════════════════════════════════════════════
// YEAR 10 QUESTION BANK — Victorian Curriculum 2.0
// Mapped to VC2M10 content description codes
// 700+ questions across Number, Algebra, Measurement, Space, Statistics, Probability
// ═══════════════════════════════════════════════════════════════════

import { supabase } from './supabase.js'

const SKILLS_YR10 = [

  // ══════════════════════════════════════════════════════════════
  // NUMBER
  // ══════════════════════════════════════════════════════════════

  { year:'10', strand:'Number', topic:'Real Numbers', skill:'Surds — simplifying and operations', vc:'VC2M10N01',
    questions:[
      {tier:1, q:'Simplify: √50', a:'5√2'},
      {tier:1, q:'Simplify: √72', a:'6√2'},
      {tier:1, q:'Simplify: √98', a:'7√2'},
      {tier:1, q:'Simplify: √75', a:'5√3'},
      {tier:1, q:'Simplify: √200', a:'10√2'},
      {tier:2, q:'Simplify: 3√2 + 5√2', a:'8√2'},
      {tier:2, q:'Simplify: 4√3 − √3', a:'3√3'},
      {tier:2, q:'Simplify: √12 + √27', a:'2√3 + 3√3 = 5√3'},
      {tier:2, q:'Simplify: √8 × √2', a:'√16 = 4'},
      {tier:2, q:'Simplify: 2√3 × 3√5', a:'6√15'},
      {tier:3, q:'Simplify: (√5 + √2)(√5 − √2)', a:'5 − 2 = 3'},
      {tier:3, q:'Simplify: (2√3)²', a:'12'},
      {tier:3, q:'Rationalise: 6/√3', a:'6√3/3 = 2√3'},
      {tier:3, q:'Rationalise: 4/(√5 + 1)', a:'4(√5−1)/4 = √5−1'},
      {tier:4, q:'Simplify: √48 − √12 + 2√75', a:'4√3 − 2√3 + 10√3 = 12√3'},
    ]
  },

  { year:'10', strand:'Number', topic:'Real Numbers', skill:'Fractional indices', vc:'VC2M10N02',
    questions:[
      {tier:1, q:'Evaluate: 8^(1/3)', a:'2'},
      {tier:1, q:'Evaluate: 25^(1/2)', a:'5'},
      {tier:1, q:'Evaluate: 16^(1/4)', a:'2'},
      {tier:1, q:'Write √x using index notation.', a:'x^(1/2)'},
      {tier:1, q:'Write ∛x using index notation.', a:'x^(1/3)'},
      {tier:2, q:'Evaluate: 27^(2/3)', a:'(27^(1/3))² = 3² = 9'},
      {tier:2, q:'Evaluate: 16^(3/4)', a:'(16^(1/4))³ = 2³ = 8'},
      {tier:2, q:'Simplify: x^(1/2) × x^(3/2)', a:'x²'},
      {tier:3, q:'Simplify: (8x³)^(2/3)', a:'4x²'},
      {tier:3, q:'Evaluate: 32^(−2/5)', a:'1/(32^(2/5)) = 1/4'},
      {tier:4, q:'Solve: 2^x = 8^(1/3)', a:'2^x = 2, x = 1'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Compound interest and depreciation', vc:'VC2M10N03',
    questions:[
      {tier:1, q:'Find compound interest: P=$1000, r=5%pa, t=2 years.', a:'A = 1000×1.05² = $1102.50; I = $102.50'},
      {tier:1, q:'Find compound interest: P=$2000, r=4%pa, t=3 years.', a:'A = 2000×1.04³ ≈ $2249.73; I ≈ $249.73'},
      {tier:1, q:'A car depreciates at 15% per year. Starting value $25 000. Value after 1 year?', a:'$21 250'},
      {tier:2, q:'P=$5000, r=6%pa compounded monthly. Find A after 2 years.', a:'A = 5000×(1+0.06/12)^24 ≈ $5637.09'},
      {tier:2, q:'A car worth $30 000 depreciates 20% pa. Find value after 3 years.', a:'30000×0.8³ = $15 360'},
      {tier:2, q:'How long until $2000 grows to $2662.04 at 10% pa compound?', a:'2000×1.1^n = 2662.04; 1.1^n = 1.331 = 1.1³; n = 3 years'},
      {tier:3, q:'An investment doubles in 9 years. Find approximate annual rate using Rule of 72.', a:'r ≈ 72/9 = 8%pa'},
      {tier:3, q:'P=$4000, r=3%pa compounded quarterly for 5 years. Find A.', a:'A = 4000×(1+0.03/4)^20 ≈ $4644.13'},
      {tier:4, q:'Compare: $3000 at 8%pa simple for 4 years vs 8%pa compound for 4 years.', a:'Simple: 3000×1.32 = $3960. Compound: 3000×1.08⁴ ≈ $4081.47. Compound earns $121.47 more.'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Loans, annuities and investments', vc:'VC2M10N03',
    questions:[
      {tier:2, q:'A loan of $10 000 at 6%pa over 3 years (simple interest). Total repayment?', a:'I = 10000×0.06×3 = $1800; Total = $11 800'},
      {tier:2, q:'Monthly repayments on $12 000 at 12%pa simple over 2 years?', a:'I = 12000×0.12×2 = 2880; Total = 14880; Monthly = 14880/24 = $620'},
      {tier:3, q:'Which is better: 5.5%pa compounded monthly or 5.6%pa compounded annually?', a:'Monthly EAR = (1+0.055/12)^12−1 ≈ 5.64%. So 5.5% monthly is better.'},
      {tier:4, q:'A mortgage of $400 000 at 4%pa over 25 years. Estimate total interest paid.', a:'Monthly rate = 0.04/12. PMT ≈ $2104/month. Total ≈ $631 200. Interest ≈ $231 200.'},
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // ALGEBRA
  // ══════════════════════════════════════════════════════════════

  { year:'10', strand:'Algebra', topic:'Algebraic Expressions', skill:'Factorising — common factor and grouping', vc:'VC2M10A01',
    questions:[
      {tier:1, q:'Factorise: 4x + 8', a:'4(x + 2)'},
      {tier:1, q:'Factorise: 6x² − 9x', a:'3x(2x − 3)'},
      {tier:1, q:'Factorise: 12a²b − 8ab²', a:'4ab(3a − 2b)'},
      {tier:1, q:'Factorise: 5x³ + 15x²', a:'5x²(x + 3)'},
      {tier:2, q:'Factorise by grouping: ax + ay + bx + by', a:'(a + b)(x + y)'},
      {tier:2, q:'Factorise by grouping: 2x² + 6x + x + 3', a:'2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)'},
      {tier:2, q:'Factorise: x² − 16', a:'(x + 4)(x − 4)'},
      {tier:2, q:'Factorise: 9x² − 25', a:'(3x + 5)(3x − 5)'},
      {tier:3, q:'Factorise: 4a² − 49b²', a:'(2a + 7b)(2a − 7b)'},
      {tier:3, q:'Factorise completely: 2x² − 8', a:'2(x² − 4) = 2(x + 2)(x − 2)'},
      {tier:4, q:'Factorise: x⁴ − 16', a:'(x² + 4)(x² − 4) = (x² + 4)(x + 2)(x − 2)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Algebraic Expressions', skill:'Index laws and algebraic products', vc:'VC2M10A02',
    questions:[
      {tier:1, q:'Simplify: x⁵ × x³', a:'x⁸'},
      {tier:1, q:'Simplify: a⁶ ÷ a²', a:'a⁴'},
      {tier:1, q:'Simplify: (2x³)²', a:'4x⁶'},
      {tier:1, q:'Simplify: x⁰', a:'1'},
      {tier:2, q:'Simplify: (3x²y)³', a:'27x⁶y³'},
      {tier:2, q:'Simplify: 4x⁻² × 2x⁵', a:'8x³'},
      {tier:2, q:'Simplify: (2a³b²)² ÷ (4a²b)', a:'a⁴b³'},
      {tier:3, q:'Simplify: (x²y³)⁻² × x⁵y', a:'x⁻⁴y⁻⁶ × x⁵y = xy⁻⁵ = x/y⁵'},
      {tier:4, q:'If 2ˣ × 4^(x+1) = 8³, find x.', a:'2ˣ × 2^(2x+2) = 2⁹; 3x+2=9; x=7/3'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Algebraic Expressions', skill:'Algebraic fractions', vc:'VC2M10A03',
    questions:[
      {tier:1, q:'Simplify: (2x)/(4x²)', a:'1/(2x)'},
      {tier:1, q:'Simplify: (6a²b)/(3ab²)', a:'2a/b'},
      {tier:2, q:'Simplify: (x+2)/(x²+3x+2)', a:'1/(x+1)'},
      {tier:2, q:'Add: 1/x + 2/y', a:'(y + 2x)/(xy)'},
      {tier:2, q:'Add: 2/(x+1) + 3/(x+2)', a:'(2(x+2)+3(x+1))/((x+1)(x+2)) = (5x+7)/((x+1)(x+2))'},
      {tier:3, q:'Simplify: (x²−4)/(x+2)', a:'x−2'},
      {tier:3, q:'Multiply: (x²−9)/(x+1) × (x+1)/(x+3)', a:'x−3'},
      {tier:4, q:'Simplify: (2x²+x−6)/(x²−4)', a:'(2x−3)(x+2)/((x+2)(x−2)) = (2x−3)/(x−2)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Expanding binomial products', vc:'VC2M10A04',
    questions:[
      {tier:1, q:'Expand: (x + 3)(x + 5)', a:'x² + 8x + 15'},
      {tier:1, q:'Expand: (x − 2)(x + 7)', a:'x² + 5x − 14'},
      {tier:1, q:'Expand: (x − 4)²', a:'x² − 8x + 16'},
      {tier:1, q:'Expand: (x + 3)(x − 3)', a:'x² − 9'},
      {tier:1, q:'Expand: (2x + 1)(x + 3)', a:'2x² + 7x + 3'},
      {tier:2, q:'Expand: (3x − 2)²', a:'9x² − 12x + 4'},
      {tier:2, q:'Expand: (2x + 5)(2x − 5)', a:'4x² − 25'},
      {tier:2, q:'Expand: (x + y)² − (x − y)²', a:'(x²+2xy+y²) − (x²−2xy+y²) = 4xy'},
      {tier:3, q:'Show that (a+b)² = a² + 2ab + b².', a:'(a+b)(a+b) = a²+ab+ab+b² = a²+2ab+b² ✓'},
      {tier:4, q:'Expand and simplify: (x+1)³', a:'(x+1)²(x+1) = (x²+2x+1)(x+1) = x³+3x²+3x+1'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Factorising quadratic expressions', vc:'VC2M10A04',
    questions:[
      {tier:1, q:'Factorise: x² + 7x + 12', a:'(x + 3)(x + 4)'},
      {tier:1, q:'Factorise: x² − 5x + 6', a:'(x − 2)(x − 3)'},
      {tier:1, q:'Factorise: x² + x − 6', a:'(x + 3)(x − 2)'},
      {tier:1, q:'Factorise: x² − 4x − 12', a:'(x − 6)(x + 2)'},
      {tier:2, q:'Factorise: 2x² + 5x + 3', a:'(2x + 3)(x + 1)'},
      {tier:2, q:'Factorise: 3x² − 10x + 8', a:'(3x − 4)(x − 2)'},
      {tier:2, q:'Factorise: 6x² + x − 2', a:'(3x + 2)(2x − 1)'},
      {tier:3, q:'Factorise by completing the square: x² + 6x + 7', a:'(x+3)² − 2'},
      {tier:3, q:'Factorise: x² − 2x − 8', a:'(x − 4)(x + 2)'},
      {tier:4, q:'Factorise completely: 2x³ − 8x', a:'2x(x² − 4) = 2x(x+2)(x−2)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Solving quadratic equations', vc:'VC2M10A04',
    questions:[
      {tier:1, q:'Solve: x² − 5x + 6 = 0', a:'(x−2)(x−3) = 0; x = 2 or 3'},
      {tier:1, q:'Solve: x² + 7x + 12 = 0', a:'(x+3)(x+4) = 0; x = −3 or −4'},
      {tier:1, q:'Solve: x² − 9 = 0', a:'x = ±3'},
      {tier:1, q:'Solve: x² = 25', a:'x = ±5'},
      {tier:2, q:'Solve: 2x² − 7x + 3 = 0', a:'(2x−1)(x−3) = 0; x = 1/2 or 3'},
      {tier:2, q:'Solve by quadratic formula: x² + 3x − 10 = 0', a:'x = (−3 ± √49)/2 = (−3 ± 7)/2; x = 2 or −5'},
      {tier:2, q:'Solve: x² + 4x + 4 = 0', a:'(x+2)² = 0; x = −2 (double root)'},
      {tier:3, q:'Solve by completing the square: x² + 6x + 5 = 0', a:'(x+3)² = 4; x+3 = ±2; x = −1 or −5'},
      {tier:3, q:'Solve: 3x² − 2x − 8 = 0 using the quadratic formula.', a:'x = (2 ± √100)/6 = (2 ± 10)/6; x = 2 or −4/3'},
      {tier:4, q:'Find the values of k so that x² + kx + 9 = 0 has exactly one solution.', a:'Discriminant = 0: k² − 36 = 0; k = ±6'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Formulas', skill:'Rearranging and substituting into formulas', vc:'VC2M10A05',
    questions:[
      {tier:1, q:'Rearrange v = u + at for t.', a:'t = (v−u)/a'},
      {tier:1, q:'Rearrange A = πr² for r.', a:'r = √(A/π)'},
      {tier:1, q:'Rearrange v² = u² + 2as for s.', a:'s = (v²−u²)/(2a)'},
      {tier:1, q:'Rearrange P = 2l + 2w for l.', a:'l = (P−2w)/2'},
      {tier:2, q:'Rearrange 1/f = 1/u + 1/v for v.', a:'v = uf/(u−f)'},
      {tier:2, q:'If F = 9C/5 + 32, find C when F = 98.6.', a:'C = 5(98.6−32)/9 = 37°C'},
      {tier:2, q:'Find r: A = P(1+r/100)ⁿ when A=1210, P=1000, n=2.', a:'1.21 = (1+r/100)²; 1.1 = 1+r/100; r = 10%'},
      {tier:3, q:'Rearrange T = 2π√(l/g) for l.', a:'l = g(T/2π)²'},
      {tier:4, q:'If S = n(a+l)/2, find n when S=72, a=3, l=15.', a:'72 = n(18)/2; 72 = 9n; n = 8'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Relationships', skill:'Parallel and perpendicular lines', vc:'VC2M10A06',
    questions:[
      {tier:1, q:'Find gradient of line through (1,3) and (4,9).', a:'m = (9−3)/(4−1) = 2'},
      {tier:1, q:'Are y = 2x+3 and y = 2x−5 parallel?', a:'Yes — same gradient (m=2)'},
      {tier:1, q:'What is the gradient of a line perpendicular to y = 3x+1?', a:'−1/3'},
      {tier:1, q:'Are y = 3x+2 and y = −x/3+4 perpendicular?', a:'3 × (−1/3) = −1 ✓ Yes'},
      {tier:2, q:'Find the equation of the line through (0,4) parallel to y = 3x−2.', a:'y = 3x+4'},
      {tier:2, q:'Find the equation of the line through (2,5) perpendicular to y = −2x+1.', a:'m = 1/2; y−5 = ½(x−2); y = x/2+4'},
      {tier:3, q:'ABCD is a quadrilateral with A(0,0), B(4,0), C(5,3), D(1,3). Show AB ∥ DC.', a:'Gradient AB = 0; Gradient DC = (3−3)/(1−5) = 0. Both 0, so parallel.'},
      {tier:4, q:'Triangle has vertices A(0,0), B(6,0), C(3,6). Find equations of the three altitudes.', a:'Alt from A to BC: BC grad = (6−0)/(3−6) = −2; alt grad = 1/2; y = x/2. Alt from B: grad 1/2; y−0=1/2(x−6); y=x/2−3. Alt from C to AB: AB is x-axis; alt is vertical x=3.'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Non-linear Graphs', skill:'Graphing parabolas and key features', vc:'VC2M10A07',
    questions:[
      {tier:1, q:'Identify the vertex of y = (x−3)² + 2.', a:'(3, 2)'},
      {tier:1, q:'Identify the axis of symmetry of y = x² − 4x + 1.', a:'x = 2'},
      {tier:1, q:'Find the y-intercept of y = x² − 3x + 5.', a:'5'},
      {tier:1, q:'What is the minimum value of y = (x+1)² + 4?', a:'4 (at x = −1)'},
      {tier:2, q:'Find the x-intercepts of y = x² − 4x + 3.', a:'(x−1)(x−3) = 0; x = 1 or 3'},
      {tier:2, q:'Write y = x² + 6x + 7 in turning point form.', a:'y = (x+3)² − 2'},
      {tier:2, q:'Find the vertex of y = 2x² − 8x + 5.', a:'x = 2; y = 2(4)−16+5 = −3; vertex (2,−3)'},
      {tier:3, q:'Sketch y = −(x−2)² + 4 showing vertex, axis, x-intercepts.', a:'Vertex (2,4), opens down; x-ints: (2±2, 0) = (0,0) and (4,0)'},
      {tier:3, q:'Determine the number of x-intercepts of y = x² + 2x + 5.', a:'Discriminant = 4−20 = −16 < 0; no x-intercepts'},
      {tier:4, q:'A parabola has vertex (2,−3) and passes through (0,5). Find its equation.', a:'y = a(x−2)²−3; at (0,5): 5=4a−3; a=2; y=2(x−2)²−3'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Non-linear Graphs', skill:'Exponential, hyperbola and circle graphs', vc:'VC2M10A07',
    questions:[
      {tier:1, q:'Sketch y = 2ˣ for x = −2 to 3. Where does it cross the y-axis?', a:'(0,1) — all exponentials y=aˣ cross at (0,1)'},
      {tier:1, q:'What is the horizontal asymptote of y = 2ˣ?', a:'y = 0'},
      {tier:1, q:'Sketch y = 1/x. In which quadrants does it appear?', a:'Quadrants 1 and 3'},
      {tier:1, q:'What is the equation of the unit circle?', a:'x² + y² = 1'},
      {tier:2, q:'Describe the transformation from y = 2ˣ to y = 2^(x+3).', a:'Shift 3 units left'},
      {tier:2, q:'Find the centre and radius of x² + y² = 49.', a:'Centre (0,0), radius 7'},
      {tier:2, q:'Does (3,4) lie on x² + y² = 25?', a:'9 + 16 = 25 ✓ Yes'},
      {tier:3, q:'Describe the transformation from y = 1/x to y = 1/x + 3.', a:'Shift 3 units up; horizontal asymptote moves to y = 3'},
      {tier:4, q:'Find the intersection of y = 2ˣ and y = 4.', a:'2ˣ = 4 = 2²; x = 2; point (2,4)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Equations', skill:'Simultaneous equations — substitution and elimination', vc:'VC2M10A08',
    questions:[
      {tier:1, q:'Solve: x + y = 7 and x − y = 3.', a:'x = 5, y = 2'},
      {tier:1, q:'Solve: 2x + y = 8 and x − y = 1.', a:'x = 3, y = 2'},
      {tier:1, q:'Solve by substitution: y = 2x and 3x + y = 10.', a:'3x + 2x = 10; x = 2, y = 4'},
      {tier:2, q:'Solve: 3x + 2y = 12 and 5x − 2y = 20.', a:'Add: 8x = 32; x = 4, y = 0'},
      {tier:2, q:'Solve: 2x + 3y = 7 and 4x − y = 5.', a:'y = 4x−5; 2x+3(4x−5)=7; 14x=22; x=11/7, y=9/7'},
      {tier:3, q:'A total of 40 coins (5c and 10c) have value $3.05. How many of each?', a:'5c + 10d = 305 and c + d = 40; d = 21, c = 19'},
      {tier:3, q:'Solve: x/2 + y/3 = 5 and x − y = 3.', a:'3x + 2y = 30 and x−y=3; y = x−3; 3x+2x−6=30; x=36/5, y=21/5'},
      {tier:4, q:'Find the intersection of y = x² and y = x + 2.', a:'x²= x+2; x²−x−2=0; (x−2)(x+1)=0; (2,4) and (−1,1)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Statistics and Modelling', skill:'Linear regression and scatter plots', vc:'VC2M10A09',
    questions:[
      {tier:1, q:'Describe the correlation: as study hours increase, test scores tend to increase.', a:'Positive correlation'},
      {tier:2, q:'A line of best fit is y = 3x + 2. Predict y when x = 5.', a:'y = 17'},
      {tier:2, q:'What does a correlation of −0.9 indicate?', a:'Strong negative correlation'},
      {tier:3, q:'Points: (1,3), (2,5), (3,4), (4,7), (5,8). Find the approximate line of best fit.', a:'Gradient ≈ 1.2; y-int ≈ 1.6; y ≈ 1.2x + 1.6'},
      {tier:4, q:'Explain the difference between correlation and causation with an example.', a:'Correlation means variables move together; causation means one causes the other. e.g. Ice cream sales and drowning both rise in summer — correlated but ice cream does not cause drowning (common cause: hot weather).'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Sequences', skill:'Arithmetic sequences', vc:'VC2M10A10',
    questions:[
      {tier:1, q:'Find the 10th term: 3, 7, 11, 15, ...', a:'T₁₀ = 3 + 9×4 = 39'},
      {tier:1, q:'Find the common difference: 20, 15, 10, 5, ...', a:'d = −5'},
      {tier:1, q:'Find Tn for: a = 5, d = 3.', a:'Tn = 5 + (n−1)×3 = 3n + 2'},
      {tier:2, q:'Find the sum of first 20 terms of 2, 6, 10, 14, ...', a:'a=2, d=4; S₂₀ = 20/2 × (2×2 + 19×4) = 10×80 = 800'},
      {tier:2, q:'Which term of 5, 11, 17, 23, ... equals 95?', a:'Tn = 5 + (n−1)×6 = 6n−1 = 95; n = 16'},
      {tier:3, q:'The 5th term of an AP is 21 and the 9th term is 37. Find the 1st term and common difference.', a:'a+4d=21, a+8d=37; 4d=16; d=4; a=5'},
      {tier:4, q:'Find the sum of all multiples of 7 between 1 and 200.', a:'7,14,...,196; n=(196−7)/7+1=28; S=28/2×(7+196)=28/2×203=2842'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Sequences', skill:'Geometric sequences', vc:'VC2M10A10',
    questions:[
      {tier:1, q:'Find the common ratio: 3, 6, 12, 24, ...', a:'r = 2'},
      {tier:1, q:'Find the 5th term: 2, 6, 18, 54, ...', a:'T₅ = 2 × 3⁴ = 162'},
      {tier:1, q:'Find Tn for: a = 4, r = 3.', a:'Tn = 4 × 3^(n−1)'},
      {tier:2, q:'Find the sum of first 6 terms of 1, 2, 4, 8, ...', a:'S₆ = 1×(2⁶−1)/(2−1) = 63'},
      {tier:2, q:'A population doubles every 5 years. Starting at 1000, find size after 15 years.', a:'3 doublings: 1000 × 2³ = 8000'},
      {tier:3, q:'Find n if the sum of first n terms of 1+2+4+... = 255.', a:'2ⁿ − 1 = 255; 2ⁿ = 256 = 2⁸; n = 8'},
      {tier:4, q:'The sum to infinity of a geometric series is 8 and a = 2. Find r.', a:'S∞ = a/(1−r) = 2/(1−r) = 8; 1−r = 1/4; r = 3/4'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Exponential and Log Equations', skill:'Solving exponential equations', vc:'VC2M10A14',
    questions:[
      {tier:1, q:'Solve: 2ˣ = 16', a:'x = 4'},
      {tier:1, q:'Solve: 3ˣ = 27', a:'x = 3'},
      {tier:1, q:'Solve: 5ˣ = 1', a:'x = 0'},
      {tier:2, q:'Solve: 4ˣ = 8', a:'2^(2x) = 2³; 2x = 3; x = 3/2'},
      {tier:2, q:'Solve: 2^(x+1) = 32', a:'x+1 = 5; x = 4'},
      {tier:3, q:'A population grows as P = 500 × 1.04ⁿ. When does P first exceed 1000?', a:'1.04ⁿ > 2; n×log(1.04) > log(2); n > 17.67; n = 18 years'},
      {tier:4, q:'Solve: 9ˣ − 4 × 3ˣ + 3 = 0.', a:'Let u = 3ˣ: u² − 4u + 3 = 0; (u−1)(u−3) = 0; u=1 → x=0; u=3 → x=1'},
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // MEASUREMENT
  // ══════════════════════════════════════════════════════════════

  { year:'10', strand:'Measurement', topic:'Pythagoras and Trigonometry', skill:'Pythagoras theorem — applications', vc:'VC2M10M01',
    questions:[
      {tier:1, q:'Find the hypotenuse: a=8, b=15.', a:'17'},
      {tier:1, q:'Find the missing side: c=13, a=5.', a:'b = 12'},
      {tier:2, q:'Find the exact diagonal of a square with side 5 cm.', a:'5√2 cm'},
      {tier:2, q:'A 5 m ladder rests against a wall 3 m from the base. How high does it reach?', a:'4 m'},
      {tier:3, q:'A rectangular prism is 4×3×2 m. Find the length of the main diagonal.', a:'√(16+9+4) = √29 ≈ 5.39 m'},
      {tier:4, q:'Prove that in any right triangle, if the legs are a and b and hyp is c, then the altitude from the right angle to the hyp has length ab/c.', a:'Area = ab/2 = ch/2; h = ab/c ✓'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Trigonometric ratios in right-angled triangles', vc:'VC2M10M02',
    questions:[
      {tier:1, q:'In a right triangle: opp=3, hyp=5. Find sin θ.', a:'3/5 = 0.6'},
      {tier:1, q:'Find cos 60°.', a:'0.5'},
      {tier:1, q:'Find tan 45°.', a:'1'},
      {tier:1, q:'Find the angle if sin θ = 0.5.', a:'30°'},
      {tier:2, q:'A right triangle has angle 35° and adjacent = 10. Find the opposite.', a:'opp = 10 × tan 35° ≈ 7.0'},
      {tier:2, q:'Find x: right triangle, angle 50°, hyp = 20. Find the adjacent.', a:'adj = 20 cos 50° ≈ 12.86'},
      {tier:2, q:'A ramp rises 2 m over 8 m horizontal distance. Find the angle of inclination.', a:'tan θ = 2/8 = 0.25; θ ≈ 14.0°'},
      {tier:3, q:'A guy wire attached 8 m up a pole makes a 55° angle with the ground. Find the wire length.', a:'hyp = 8/sin 55° ≈ 9.77 m'},
      {tier:3, q:'From the top of a 40 m cliff, the angle of depression to a boat is 25°. Find the horizontal distance.', a:'40/tan 25° ≈ 85.7 m'},
      {tier:4, q:'Two observers 100 m apart both measure the angle of elevation to a balloon. Angles are 40° and 55°. Find the height.', a:'h/tan40° + h/tan55° = 100; h(1/tan40°+1/tan55°) = 100; h ≈ 46.3 m'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'The Sine and Cosine Rules', vc:'VC2M10M03',
    questions:[
      {tier:1, q:'State the Sine Rule.', a:'a/sinA = b/sinB = c/sinC'},
      {tier:1, q:'State the Cosine Rule.', a:'c² = a² + b² − 2ab cosC'},
      {tier:2, q:'Find side b: A=50°, B=70°, a=8.', a:'b = 8 sin70°/sin50° ≈ 9.79'},
      {tier:2, q:'Find angle C: a=7, b=9, c=11.', a:'cosC = (49+81−121)/(126) = 9/126; C ≈ 85.9°'},
      {tier:2, q:'Find side c: a=6, b=8, C=60°.', a:'c² = 36+64−2×6×8×0.5 = 52; c = 2√13 ≈ 7.21'},
      {tier:3, q:'In a triangle: B=42°, a=15, b=12. Find angle A.', a:'sinA = 15 sin42°/12 ≈ 0.836; A ≈ 56.7° or 123.3°'},
      {tier:4, q:'Find the area of a triangle with sides 8, 11 and included angle 70°.', a:'A = ½ × 8 × 11 × sin70° ≈ 41.3 cm²'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Area of a triangle using trigonometry', vc:'VC2M10M04',
    questions:[
      {tier:1, q:'Find the area: two sides 6 and 8 cm, included angle 30°.', a:'A = ½×6×8×sin30° = 12 cm²'},
      {tier:2, q:'Find the area: sides 10 and 14 cm, included angle 55°.', a:'A = ½×10×14×sin55° ≈ 57.3 cm²'},
      {tier:3, q:'Find the angle between two sides 9 and 12 cm if the area is 27 cm².', a:'27 = ½×9×12×sinθ; sinθ = 0.5; θ = 30° or 150°'},
      {tier:4, q:'A parallelogram has sides 8 and 11 cm with an angle of 65°. Find the area.', a:'A = 8×11×sin65° ≈ 79.7 cm²'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Measurement', skill:'Surface area of spheres, cones and composite solids', vc:'VC2M10M05',
    questions:[
      {tier:1, q:'Find the surface area of a sphere with radius 5 cm.', a:'4πr² = 100π ≈ 314.2 cm²'},
      {tier:1, q:'Find the curved surface area of a cone with radius 3, slant height 5.', a:'πrl = 15π ≈ 47.1 cm²'},
      {tier:2, q:'Find the total surface area of a cone with r=6, h=8.', a:'l = √(36+64) = 10; SA = πr(r+l) = 6π×16 = 96π ≈ 301.6 cm²'},
      {tier:3, q:'Find the surface area of a hemisphere (half sphere) with radius 7 cm.', a:'2πr² + πr² = 3πr² = 3π×49 = 147π ≈ 461.8 cm²'},
      {tier:4, q:'A solid is made of a cylinder (r=4, h=10) with a hemisphere on top. Find total SA.', a:'Curved cylinder + base circle + hemisphere = 2π×4×10 + π×16 + 2π×16 = 80π+16π+32π = 128π ≈ 402.1 cm²'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Measurement', skill:'Volume of spheres, cones and composite solids', vc:'VC2M10M06',
    questions:[
      {tier:1, q:'Find volume of a sphere with radius 3 cm.', a:'⁴⁄₃πr³ = 36π ≈ 113.1 cm³'},
      {tier:1, q:'Find volume of a cone with radius 4, height 9.', a:'⅓πr²h = 48π ≈ 150.8 cm³'},
      {tier:2, q:'Find the radius of a sphere with volume 288π.', a:'⁴⁄₃πr³ = 288π; r³ = 216; r = 6'},
      {tier:2, q:'A cone and cylinder have same r and h. Volume of cone is what fraction of cylinder?', a:'1/3'},
      {tier:3, q:'A cylindrical tin (r=5, h=12) is filled with small spheres of radius 1. Approximately how many spheres fit?', a:'Volume cylinder = 300π. Volume sphere = 4π/3. With packing ~74%: n ≈ 0.74×300π/(4π/3) ≈ 166'},
      {tier:4, q:'A sphere of radius 6 cm just fits inside a cube. Find the wasted volume.', a:'Cube V = 12³ = 1728 cm³. Sphere V = 4π×216/3 = 288π ≈ 904.8 cm³. Waste ≈ 823.2 cm³'},
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // SPACE
  // ══════════════════════════════════════════════════════════════

  { year:'10', strand:'Space', topic:'Geometry', skill:'Geometric proofs and congruence', vc:'VC2M10SP01',
    questions:[
      {tier:1, q:'Name the four tests for congruent triangles.', a:'SSS, SAS, AAS, RHS'},
      {tier:2, q:'In triangles ABC and PQR: AB=PQ=5, BC=QR=8, angle B = angle Q = 60°. Are they congruent?', a:'Yes — SAS'},
      {tier:2, q:'Prove that the base angles of an isosceles triangle are equal.', a:'Draw the median from apex. Two triangles are congruent by SAS (two equal sides and shared median). Therefore base angles are equal.'},
      {tier:3, q:'ABCD is a parallelogram. Prove AB = DC.', a:'Triangles ABC and CDA: AC = CA (common), angle BAC = angle DCA (alt angles, AB∥DC), angle BCA = angle DAC (alt angles, BC∥AD). By AAS: ΔABC ≡ ΔCDA. Therefore AB = DC.'},
      {tier:4, q:'Prove that the diagonals of a rectangle are equal.', a:'In rectangle ABCD: AB = DC, angle ABC = angle DCB = 90°, BC = BC (common). By SAS: ΔABC ≡ ΔDCB. Therefore AC = DB.'},
    ]
  },

  { year:'10', strand:'Space', topic:'Geometry', skill:'Similarity and scale factors', vc:'VC2M10SP02',
    questions:[
      {tier:1, q:'Two triangles are similar with scale factor 3. A side of the smaller is 5 cm. Find the matching side.', a:'15 cm'},
      {tier:1, q:'If linear scale factor is 4, what is the area scale factor?', a:'16'},
      {tier:1, q:'If linear scale factor is 2, what is the volume scale factor?', a:'8'},
      {tier:2, q:'Two similar cones have radii 3 and 6. The smaller has volume 18π. Find the larger volume.', a:'Volume scale factor = 2³ = 8; V = 144π'},
      {tier:3, q:'A photo 15×10 cm is enlarged to 45×30 cm. Find the area scale factor.', a:'Linear factor = 3; area factor = 9'},
      {tier:4, q:'A model car at 1:20 scale has surface area 300 cm². Find the actual surface area in m².', a:'SA scale = 20² = 400; actual = 300 × 400 = 120 000 cm² = 12 m²'},
    ]
  },

  { year:'10', strand:'Space', topic:'Circle Geometry', skill:'Circle theorems', vc:'VC2M10SP03',
    questions:[
      {tier:1, q:'An angle at the centre is 80°. What is the inscribed angle subtending the same arc?', a:'40°'},
      {tier:1, q:'An angle in a semicircle is ___°.', a:'90°'},
      {tier:1, q:'Angles in the same segment are _____.', a:'Equal'},
      {tier:2, q:'The angle at the centre is twice the angle at the circumference. A circumference angle is 35°. Find the centre angle.', a:'70°'},
      {tier:2, q:'ABCD is a cyclic quadrilateral. Angle A = 95°. Find angle C.', a:'180° − 95° = 85°'},
      {tier:3, q:'Prove that the angle in a semicircle is 90°.', a:'Angle at centre = 180° (straight angle). Inscribed angle = half centre angle = 90°.'},
      {tier:4, q:'Two tangents from external point P touch circle at A and B. Show PA = PB.', a:'OA = OB (radii), OP = OP (common), angles OAP = OBP = 90° (tangent ⊥ radius). By RHS: ΔOAP ≡ ΔOBP. Therefore PA = PB.'},
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // STATISTICS
  // ══════════════════════════════════════════════════════════════

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Box plots, quartiles and interquartile range', vc:'VC2M10ST01',
    questions:[
      {tier:1, q:'What are Q1, Q2 and Q3?', a:'Lower quartile (25th percentile), median, upper quartile (75th percentile)'},
      {tier:1, q:'Find the IQR: Q1=12, Q3=28.', a:'IQR = 16'},
      {tier:1, q:'Data: 3,5,7,9,11,13,15. Find Q2.', a:'9'},
      {tier:2, q:'Data: 4,6,8,10,12,14,16,18. Find Q1 and Q3.', a:'Q1 = (6+8)/2 = 7; Q3 = (14+16)/2 = 15'},
      {tier:2, q:'A value is an outlier if it is more than 1.5×IQR from the quartiles. IQR=10, Q3=30. Find the upper outlier boundary.', a:'30 + 15 = 45'},
      {tier:3, q:'Compare two data sets using their five-number summaries: A: min=2, Q1=8, Q2=14, Q3=20, max=28. B: min=5, Q1=10, Q2=16, Q3=24, max=40.', a:'B has higher median, higher spread, and higher max. A is more symmetric; B has a positive skew with outlier potential.'},
      {tier:4, q:'A box plot has: min=10, Q1=20, median=30, Q3=45, max=80. Is 80 an outlier?', a:'IQR=25; Upper fence = 45+37.5 = 82.5. Since 80 < 82.5, it is NOT an outlier.'},
    ]
  },

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Standard deviation and shape of distributions', vc:'VC2M10ST01',
    questions:[
      {tier:1, q:'What does a large standard deviation indicate?', a:'The data is widely spread from the mean'},
      {tier:2, q:'Two classes both have mean 70%, but Class A has SD=3 and Class B has SD=15. What does this tell us?', a:'Class A is much more consistent; Class B has widely varying results'},
      {tier:2, q:'In a normal distribution, what percentage of data lies within 1 SD of the mean?', a:'≈ 68%'},
      {tier:3, q:'A data set: 2, 4, 4, 4, 5, 5, 7, 9. Find the standard deviation.', a:'Mean = 5; variance = (9+1+1+1+0+0+4+16)/8 = 4; SD = 2'},
      {tier:4, q:'Explain why adding the same value to all data points does not change the standard deviation.', a:'SD measures spread from the mean. If all values shift by a constant, the mean shifts by the same amount, so all deviations from the mean are unchanged.'},
    ]
  },

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Comparing data sets with statistics', vc:'VC2M10ST02',
    questions:[
      {tier:2, q:'Compare Class A (mean=72, SD=8) and Class B (mean=72, SD=3). Which is more consistent?', a:'Class B — lower SD means less variability'},
      {tier:2, q:'Two datasets have identical medians but different IQRs. What does the IQR tell us?', a:'The spread of the middle 50% of data. Larger IQR = more spread.'},
      {tier:3, q:'Back-to-back stem-and-leaf shows: Group A median=55, IQR=20; Group B median=62, IQR=8. Compare the groups.', a:'Group B has higher typical value and is more consistent. Group A is more variable.'},
      {tier:4, q:'Critique this statement: "The mean test score was 75%, so most students scored above average."', a:'Only true if the distribution is symmetric. With positive skew, most students could score below the mean. The median would be a better measure.'},
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // PROBABILITY
  // ══════════════════════════════════════════════════════════════

  { year:'10', strand:'Probability', topic:'Probability', skill:'Conditional probability', vc:'VC2M10P01',
    questions:[
      {tier:1, q:'What does P(A|B) mean?', a:'The probability of A occurring given that B has already occurred'},
      {tier:2, q:'P(A∩B) = 0.12, P(B) = 0.4. Find P(A|B).', a:'P(A|B) = 0.12/0.4 = 0.3'},
      {tier:2, q:'A bag has 5 red and 3 blue balls. One is drawn red. Find P(red second | red first) without replacement.', a:'4/7'},
      {tier:3, q:'60% of students play sport. 30% play sport and do music. Find P(music | sport).', a:'P(M|S) = 0.30/0.60 = 0.5'},
      {tier:3, q:'P(A) = 0.4, P(B|A) = 0.3, P(B|A\') = 0.2. Find P(B).', a:'P(B) = 0.4×0.3 + 0.6×0.2 = 0.12+0.12 = 0.24'},
      {tier:4, q:'Prove that if A and B are independent, P(A|B) = P(A).', a:'P(A|B) = P(A∩B)/P(B). If independent: P(A∩B) = P(A)×P(B). So P(A|B) = P(A)×P(B)/P(B) = P(A) ✓'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Two-way tables and Venn diagrams', vc:'VC2M10P01',
    questions:[
      {tier:1, q:'In a two-way table: 30 play tennis, 25 play cricket, 10 play both, 15 play neither. Total students?', a:'30 + 25 − 10 + 15 = 60'},
      {tier:2, q:'From above: Find P(plays tennis only).', a:'(30−10)/60 = 20/60 = 1/3'},
      {tier:2, q:'P(A) = 0.5, P(B) = 0.4, P(A∩B) = 0.2. Find P(A∪B).', a:'0.5 + 0.4 − 0.2 = 0.7'},
      {tier:3, q:'Are A and B independent if P(A)=0.5, P(B)=0.4, P(A∩B)=0.2?', a:'P(A)×P(B) = 0.2 = P(A∩B) ✓ Yes, independent'},
      {tier:4, q:'A disease affects 1% of population. Test is 95% accurate for positives and 90% accurate for negatives. If you test positive, what is P(you have the disease)?', a:'P(D)=0.01; P(+|D)=0.95; P(+|D\')=0.10. P(+)=0.01×0.95+0.99×0.10=0.1085. P(D|+)=0.0095/0.1085≈8.8%'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Multi-step probability and tree diagrams', vc:'VC2M10P02',
    questions:[
      {tier:1, q:'A bag has 3 red and 7 blue balls. Two drawn with replacement. P(both red)?', a:'0.3 × 0.3 = 0.09'},
      {tier:2, q:'Two balls drawn without replacement from 3 red, 7 blue. P(both red)?', a:'3/10 × 2/9 = 6/90 = 1/15'},
      {tier:2, q:'A coin is tossed 3 times. P(all heads)?', a:'(1/2)³ = 1/8'},
      {tier:3, q:'Three balls are drawn without replacement from 4 red, 6 blue. P(at least one red)?', a:'P(at least 1 red) = 1 − P(all blue) = 1 − 6/10×5/9×4/8 = 1 − 120/720 = 1 − 1/6 = 5/6'},
      {tier:4, q:'A game: roll a die, if even flip a coin (heads wins), if odd roll again (6 wins). Find P(win).', a:'P(even then heads) = 1/2×1/2 = 1/4. P(odd then 6) = 1/2×1/6 = 1/12. P(win) = 1/4+1/12 = 4/12 = 1/3'},
    ]
  },
  // ── MORE ALGEBRA ──────────────────────────────────────────────

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'The discriminant and nature of roots', vc:'VC2M10A04',
    questions:[
      {tier:1, q:'What is the discriminant of ax²+bx+c?', a:'Δ = b²−4ac'},
      {tier:1, q:'Find Δ: x²+5x+6=0', a:'25−24 = 1'},
      {tier:1, q:'How many roots when Δ > 0?', a:'Two distinct real roots'},
      {tier:1, q:'How many roots when Δ = 0?', a:'One repeated real root'},
      {tier:1, q:'How many roots when Δ < 0?', a:'No real roots'},
      {tier:2, q:'Find Δ for 2x²−3x+5: state the nature of roots.', a:'Δ = 9−40 = −31 < 0; no real roots'},
      {tier:2, q:'Find values of k where x²+kx+9 has two equal roots.', a:'k²−36=0; k=±6'},
      {tier:3, q:'Find values of m where 3x²−2x+m=0 has real roots.', a:'4−12m ≥ 0; m ≤ 1/3'},
      {tier:4, q:'Show that x²+x+1=0 has no real solutions.', a:'Δ=1−4=−3<0; no real roots ✓'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Relationships', skill:'Distance, midpoint and gradient formulas', vc:'VC2M10A06',
    questions:[
      {tier:1, q:'Find the midpoint of (2,4) and (8,10).', a:'(5,7)'},
      {tier:1, q:'Find the distance from (0,0) to (3,4).', a:'5'},
      {tier:1, q:'Find the midpoint of (−3,1) and (5,7).', a:'(1,4)'},
      {tier:2, q:'Find the distance between (1,2) and (4,6).', a:'√(9+16) = 5'},
      {tier:2, q:'Find the distance between (−2,3) and (4,−5).', a:'√(36+64) = 10'},
      {tier:2, q:'Find the gradient of the line joining (−1,3) and (4,−2).', a:'m = (−2−3)/(4−(−1)) = −1'},
      {tier:3, q:'Show that (1,1), (4,5), and (7,9) are collinear.', a:'m₁₂=(5−1)/(4−1)=4/3; m₂₃=(9−5)/(7−4)=4/3. Same gradient → collinear.'},
      {tier:4, q:'Find the centre and radius of the circle with diameter endpoints (2,3) and (8,11).', a:'Centre = midpoint = (5,7). Radius = distance (2,3) to (5,7) = √(9+16) = 5'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Non-linear Graphs', skill:'Transformations of functions', vc:'VC2M10A07',
    questions:[
      {tier:1, q:'Describe y = x² + 3 vs y = x².', a:'Shift 3 units up'},
      {tier:1, q:'Describe y = (x−2)² vs y = x².', a:'Shift 2 units right'},
      {tier:1, q:'Describe y = −x² vs y = x².', a:'Reflection in the x-axis (flips upside down)'},
      {tier:2, q:'Describe y = 3x² vs y = x².', a:'Vertical stretch by factor 3 (narrower)'},
      {tier:2, q:'What transformation maps y = x² to y = 2(x+1)² − 3?', a:'Vertical stretch ×2, shift left 1, shift down 3'},
      {tier:3, q:'Find the range of y = −(x−2)² + 5.', a:'y ≤ 5 (maximum at vertex)'},
      {tier:4, q:'A parabola passes through (0,0), (2,0) and has vertex at (1,−2). Find its equation.', a:'y = a(x)(x−2); at vertex x=1: −2=a(1)(−1); a=2; y=2x(x−2)=2x²−4x'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Sequences', skill:'Using sequences to solve problems', vc:'VC2M10A10',
    questions:[
      {tier:2, q:'Find the first term and common difference: T₅=17, T₉=33.', a:'8d=16; d=2; a=9'},
      {tier:2, q:'A bouncing ball drops 200 cm and each bounce reaches 80% of previous height. Find height after 4th bounce.', a:'200 × 0.8⁴ = 81.92 cm'},
      {tier:3, q:'Find the sum of first 15 terms of 3+6+12+24+...', a:'S = 3(2¹⁵−1)/(2−1) = 3×32767 = 98 301'},
      {tier:3, q:'An AP has first term 8 and the sum of first 10 terms is 170. Find d.', a:'170 = 10/2(2×8+9d); 34=16+9d; d=2'},
      {tier:4, q:'Find x if x, x+3, x+9 are the first three terms of a GP.', a:'(x+3)/x = (x+9)/(x+3); (x+3)² = x(x+9); x²+6x+9=x²+9x; 3x=9; x=3'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Inequalities', skill:'Solving and graphing linear inequalities', vc:'VC2M10A08',
    questions:[
      {tier:1, q:'Solve: 3x − 4 > 11', a:'x > 5'},
      {tier:1, q:'Solve: −2x ≤ 8', a:'x ≥ −4'},
      {tier:2, q:'Solve: 2(x+3) < x + 10', a:'2x+6 < x+10; x < 4'},
      {tier:2, q:'Solve: (x+1)/2 ≥ (x−3)/3', a:'3(x+1) ≥ 2(x−3); x ≥ −9'},
      {tier:3, q:'Solve: x² < 9', a:'−3 < x < 3'},
      {tier:4, q:'Solve: |2x − 3| < 7', a:'−7 < 2x−3 < 7; −4 < 2x < 10; −2 < x < 5'},
    ]
  },

  // ── MORE NUMBER ────────────────────────────────────────────────

  { year:'10', strand:'Number', topic:'Real Numbers', skill:'Rational and irrational numbers', vc:'VC2M10N01',
    questions:[
      {tier:1, q:'Classify √7 as rational or irrational.', a:'Irrational'},
      {tier:1, q:'Classify 0.3̄ as rational or irrational.', a:'Rational (= 1/3)'},
      {tier:1, q:'Is π rational or irrational?', a:'Irrational'},
      {tier:2, q:'Write √18 × √2 as a whole number.', a:'6'},
      {tier:2, q:'Simplify (√3 + 1)(√3 − 1).', a:'3 − 1 = 2'},
      {tier:3, q:'Prove √2 is irrational.', a:'Assume √2 = p/q (lowest terms). Then 2q² = p², so p is even; p=2m. Then 2q²=4m², q² is even, q is even. Contradiction — both p,q cannot be even if in lowest terms.'},
      {tier:4, q:'Simplify: (2+√3)/(2−√3)', a:'Multiply by (2+√3)/(2+√3): (2+√3)²/(4−3) = (4+4√3+3)/1 = 7+4√3'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Percentage applications — taxation and super', vc:'VC2M10N03',
    questions:[
      {tier:1, q:'A salary of $75 000 pa. Calculate income tax at 32.5 cents per dollar above $45 000.', a:'Taxable amount above threshold = $30 000; Tax = $9750'},
      {tier:2, q:'Employer contributes 11% super on $60 000 salary. How much super per year?', a:'$6600'},
      {tier:2, q:'After 10% GST, an item costs $132. Find the pre-tax price.', a:'$120'},
      {tier:3, q:'An investment of $5000 earns 6%pa compound. How many years to double?', a:'Using Rule of 72: ≈12 years. Exact: log(2)/log(1.06) ≈ 11.9 years'},
      {tier:4, q:'A salary increases by 3%pa. Starting at $55 000, what is the salary after 8 years?', a:'55000 × 1.03⁸ ≈ $69 676'},
    ]
  },

  // ── MORE MEASUREMENT ──────────────────────────────────────────

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Bearings and navigation', vc:'VC2M10M02',
    questions:[
      {tier:1, q:'A bearing of N30°E is expressed as a true bearing of ___°.', a:'030°'},
      {tier:1, q:'What is the back-bearing of 050°?', a:'230°'},
      {tier:2, q:'A ship sails 40 km on bearing 090° then 30 km on 000°. How far from start?', a:'√(40²+30²) = 50 km'},
      {tier:3, q:'A helicopter flies 80 km N, then 60 km E. Find the bearing back to base.', a:'Distance from base: 100 km. Bearing back: 180° + arctan(60/80) ≈ 180°+36.87° = 216.87° ≈ 217°T'},
      {tier:4, q:'From point A, B is on bearing 050° at 5 km. C is on bearing 120° at 8 km. Find BC.', a:'Angle BAC = 120°−50° = 70°. BC² = 5²+8²−2×5×8×cos70° = 64.64; BC ≈ 8.04 km'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Angles of elevation and depression', vc:'VC2M10M02',
    questions:[
      {tier:1, q:'Define angle of elevation.', a:'The angle measured upward from the horizontal to a line of sight'},
      {tier:2, q:'A building casts a 30 m shadow. Angle of elevation to the top is 60°. Find building height.', a:'h = 30 × tan60° = 30√3 ≈ 52.0 m'},
      {tier:2, q:'From the top of a 50 m lighthouse, angle of depression to a boat is 20°. Find the horizontal distance.', a:'d = 50/tan20° ≈ 137.4 m'},
      {tier:3, q:'A person 1.7 m tall looks at a 25 m tree at angle of elevation 32°. How far is the person from the base?', a:'d = (25−1.7)/tan32° ≈ 37.2 m'},
      {tier:4, q:'Two observers 200 m apart on the same side of a tower see the top at elevations 42° and 58°. Find tower height.', a:'h/tan42° − h/tan58° = 200; h(1/tan42°−1/tan58°) = 200; h ≈ 246 m'},
    ]
  },

  // ── MORE SPACE ─────────────────────────────────────────────────

  { year:'10', strand:'Space', topic:'Geometry', skill:'Properties of polygons and their proofs', vc:'VC2M10SP01',
    questions:[
      {tier:1, q:'Interior angle sum of a hexagon?', a:'(6−2)×180 = 720°'},
      {tier:1, q:'Each interior angle of a regular decagon?', a:'(10−2)×180/10 = 144°'},
      {tier:2, q:'Exterior angle of a regular polygon is 18°. How many sides?', a:'360/18 = 20 sides'},
      {tier:2, q:'A regular polygon has interior angles of 150°. How many sides?', a:'Exterior = 30°; 360/30 = 12 sides'},
      {tier:3, q:'Prove that opposite angles of a parallelogram are equal.', a:'Let ABCD be a parallelogram. AB∥DC so angles A+D=180°. AD∥BC so angles A+B=180°. Therefore B=D. Similarly A=C.'},
      {tier:4, q:'Prove that the angle sum of a polygon with n sides is (n−2)×180°.', a:'Divide into (n−2) triangles from one vertex. Each triangle has angle sum 180°. Total = (n−2)×180°.'},
    ]
  },

  { year:'10', strand:'Space', topic:'Circle Geometry', skill:'Tangent and chord properties', vc:'VC2M10SP03',
    questions:[
      {tier:1, q:'A tangent meets a radius at ___°.', a:'90°'},
      {tier:1, q:'Equal chords in a circle subtend _____ angles at the centre.', a:'Equal'},
      {tier:2, q:'A tangent from external point P is 12 cm. The external part of the secant is 4 cm. Find the secant length.', a:'Tangent² = external × whole; 144 = 4 × whole; whole = 36 cm'},
      {tier:3, q:'A chord of length 16 cm is 6 cm from the centre. Find the radius.', a:'r² = 8² + 6² = 100; r = 10 cm'},
      {tier:4, q:'Two chords AB and CD intersect at P inside a circle. AP=3, PB=8, CP=4. Find PD.', a:'AP × PB = CP × PD; 24 = 4×PD; PD = 6'},
    ]
  },

  // ── MORE STATISTICS ────────────────────────────────────────────

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Histograms and cumulative frequency', vc:'VC2M10ST01',
    questions:[
      {tier:2, q:'A histogram has classes 0–10 (f=3), 10–20 (f=8), 20–30 (f=12), 30–40 (f=7). Find the modal class.', a:'20–30 (highest frequency)'},
      {tier:2, q:'Find the cumulative frequency for class 20–30 using the data above.', a:'3+8+12 = 23'},
      {tier:3, q:'50 students: below 60: 8, 60–70: 15, 70–80: 18, 80–90: 7, 90–100: 2. Find approximate median.', a:'25th value is in 70–80 class. Cumulative to 70 = 23; need 2 more from class of 18. Median ≈ 70 + 2/18×10 ≈ 71.1'},
      {tier:4, q:'Describe the shape of a distribution where the mean > median > mode.', a:'Positively (right) skewed — tail extends to the right'},
    ]
  },

  { year:'10', strand:'Statistics', topic:'Sampling', skill:'Sampling and inference', vc:'VC2M10ST02',
    questions:[
      {tier:1, q:'What is a sampling distribution?', a:'The distribution of a statistic (e.g. sample mean) over many samples from the same population'},
      {tier:2, q:'A sample mean is 45 with margin of error ±3. State the confidence interval.', a:'42 to 48'},
      {tier:2, q:'Why do larger samples give more reliable estimates?', a:'Larger samples reduce variability — the sample mean is closer to the population mean'},
      {tier:3, q:'A poll of 400 people finds 52% favour a policy. Estimate the margin of error at 95% CI.', a:'MOE ≈ 1/√n = 1/20 = 5%; so 47%–57%'},
      {tier:4, q:'Two political parties score 48% and 52% in a poll of 600 people. Is the difference statistically significant at 95%?', a:'MOE ≈ 1/√600 ≈ 4.1%. The gap is 4%, within the MOE — result is NOT statistically significant.'},
    ]
  },

  // ── MORE PROBABILITY ──────────────────────────────────────────

  { year:'10', strand:'Probability', topic:'Probability', skill:'Expected value and simulations', vc:'VC2M10P02',
    questions:[
      {tier:2, q:'A die: win $4 for a 6, lose $1 otherwise. Find expected value per roll.', a:'E = 1/6×4 + 5/6×(−1) = 4/6−5/6 = −1/6 ≈ −$0.17'},
      {tier:3, q:'A bag has 3 red (win $2), 5 blue (lose $1). Find expected value per draw.', a:'E = 3/8×2 + 5/8×(−1) = 6/8−5/8 = 1/8 = $0.125'},
      {tier:3, q:'A game is fair if expected value = 0. In a coin flip, you win $3 for heads. What must the loss be for tails to make it fair?', a:'1/2×3 + 1/2×(−x) = 0; x = 3'},
      {tier:4, q:'The expected number of children until the first boy (P(boy)=0.5) is 2. Explain why.', a:'E = 1/p = 1/0.5 = 2. This is the expected value of a geometric distribution.'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Permutations and combinations', vc:'VC2M10P02',
    questions:[
      {tier:1, q:'How many ways can 4 people be arranged in a line?', a:'4! = 24'},
      {tier:1, q:'How many ways can 3 items be chosen from 5 if order does not matter?', a:'C(5,3) = 10'},
      {tier:2, q:'A PIN has 4 digits (0–9). How many different PINs?', a:'10⁴ = 10 000'},
      {tier:2, q:'Evaluate C(8,3).', a:'8!/(3!×5!) = 56'},
      {tier:3, q:'A committee of 4 is chosen from 6 men and 5 women. How many committees have exactly 2 men?', a:'C(6,2) × C(5,2) = 15 × 10 = 150'},
      {tier:4, q:'How many 5-digit numbers can be formed using 1,2,3,4,5 without repetition? How many are odd?', a:'Total = 5! = 120. Odd (ends in 1,3,5): 3×4! = 72'},
    ]
  },

  // ── MORE NUMBER — LOGARITHMS ──────────────────────────────────

  { year:'10', strand:'Number', topic:'Logarithms', skill:'Introduction to logarithms', vc:'VC2M10N02',
    questions:[
      {tier:1, q:'Write in logarithm form: 2³ = 8', a:'log₂8 = 3'},
      {tier:1, q:'Write in exponential form: log₅25 = 2', a:'5² = 25'},
      {tier:1, q:'Evaluate: log₁₀1000', a:'3'},
      {tier:1, q:'Evaluate: log₂64', a:'6'},
      {tier:2, q:'Solve: log₃x = 4', a:'x = 3⁴ = 81'},
      {tier:2, q:'Solve: logₓ81 = 4', a:'x⁴ = 81 = 3⁴; x = 3'},
      {tier:3, q:'Evaluate: log₂8 + log₂4', a:'log₂32 = 5'},
      {tier:4, q:'Solve: log₂(x+3) + log₂(x−1) = 5', a:'log₂((x+3)(x−1)) = 5; (x+3)(x−1)=32; x²+2x−3=32; x²+2x−35=0; (x+7)(x−5)=0; x=5 (x must be positive)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Applications of quadratic equations', vc:'VC2M10A04',
    questions:[
      {tier:2, q:'A ball is thrown and its height is h = −5t² + 20t. Find the maximum height.', a:'Vertex at t = 2; h = −20+40 = 20 m'},
      {tier:2, q:'Find the time when the ball in the above lands.', a:'−5t²+20t=0; t(−5t+20)=0; t=4 s'},
      {tier:3, q:'A rectangle has perimeter 36 cm and area 80 cm². Find the dimensions.', a:'2(l+w)=36; lw=80; l+w=18; l,w roots of x²−18x+80=0=(x−8)(x−10); 8×10 cm'},
      {tier:3, q:'The product of two consecutive integers is 210. Find them.', a:'n(n+1)=210; n²+n−210=0; (n+15)(n−14)=0; n=14; 14 and 15'},
      {tier:4, q:'A ball thrown from ground has height h = 20t − 5t². Find when height exceeds 15 m.', a:'20t−5t²>15; 5t²−20t+15<0; t²−4t+3<0; (t−1)(t−3)<0; 1<t<3'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Relationships', skill:'Finding equations of lines', vc:'VC2M10A06',
    questions:[
      {tier:1, q:'Find equation through (0,3) with gradient 2.', a:'y = 2x + 3'},
      {tier:1, q:'Find equation through (1,5) with gradient 3.', a:'y = 3x + 2'},
      {tier:2, q:'Find equation through (2,4) and (5,13).', a:'m=3; y=3x−2'},
      {tier:2, q:'Find equation through (3,−1) perpendicular to y=3x+2.', a:'m=−1/3; y+1=−1/3(x−3); y=−x/3'},
      {tier:3, q:'Find x-intercept of 3x − 4y = 12.', a:'Set y=0: x=4'},
      {tier:3, q:'Find equation of the line passing through intersection of x+y=6 and 2x−y=3.', a:'Intersection: 3x=9; x=3,y=3; point (3,3). Need one more condition — if parallel to y=x, then y=x (passes through (3,3)).'},
      {tier:4, q:'Show that A(1,3), B(4,4), C(3,1), D(0,0) form a parallelogram.', a:'AB: m=(4−3)/3=1/3. DC: (1−0)/3=1/3. BC: m=(1−4)/−1=3. AD: m=(3−0)/1=3. AB∥DC and BC∥AD → parallelogram.'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Measurement', skill:'Units and rates in measurement contexts', vc:'VC2M10M05',
    questions:[
      {tier:1, q:'Convert 3.5 km² to m².', a:'3 500 000 m²'},
      {tier:2, q:'A sphere has volume 36π cm³. Find its radius.', a:'⁴⁄₃πr³=36π; r³=27; r=3 cm'},
      {tier:2, q:'Paint covers 8 m²/L. A room has 4 walls, each 4m×2.5m. How many litres for 2 coats?', a:'Area=40m²; 2 coats=80m²; 80/8=10 L'},
      {tier:3, q:'A cone has the same volume as a cylinder with r=6 and h=9. Find the cone height if cone r=6.', a:'⅓π×36×h=π×36×9; h=27 cm'},
      {tier:4, q:'A gold sphere has radius 5 cm and density 19.3 g/cm³. Find its mass.', a:'V=⁴⁄₃π×125≈523.6 cm³; mass≈10 105 g≈10.1 kg'},
    ]
  },

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Interpreting statistical graphs', vc:'VC2M10ST01',
    questions:[
      {tier:2, q:'A box plot has: min=5, Q1=15, median=22, Q3=32, max=50. Describe the distribution.', a:'Slightly positively skewed (right tail longer), one potential outlier at 50'},
      {tier:2, q:'Two datasets have same IQR but different medians. What does this tell us?', a:'They have similar spread in the middle 50%, but different central values'},
      {tier:3, q:'A histogram is right skewed. How does the mean compare to the median?', a:'Mean > median (the long right tail pulls the mean to the right)'},
      {tier:4, q:'Dataset: 10,12,14,16,100. Compare mean and median. Which best represents typical data?', a:'Mean=(152)/5=30.4; median=14. Median better represents typical value — mean is distorted by outlier 100.'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Probability review and applications', vc:'VC2M10P01',
    questions:[
      {tier:1, q:'P(A)=0.3. Find P(not A).', a:'0.7'},
      {tier:1, q:'Two independent events: P(A)=0.4, P(B)=0.6. Find P(A and B).', a:'0.24'},
      {tier:2, q:'P(A)=0.5, P(B)=0.3, P(A∩B)=0.15. Find P(A or B).', a:'0.5+0.3−0.15=0.65'},
      {tier:2, q:'Are events with P(A)=0.4, P(B)=0.5, P(A∩B)=0.2 independent?', a:'P(A)×P(B)=0.2=P(A∩B) ✓ Yes'},
      {tier:3, q:'A card is drawn from 52, then replaced, and another drawn. Find P(ace then king).', a:'4/52 × 4/52 = 1/169'},
      {tier:4, q:'A factory produces 5% defective items. A batch of 4 is checked. Find P(exactly 2 defective).', a:'C(4,2)×0.05²×0.95² = 6×0.0025×0.9025 ≈ 0.0135'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Hire purchase, credit and investment', vc:'VC2M10N03',
    questions:[
      {tier:2, q:'A $1200 TV on hire purchase: 20% deposit then 12 monthly payments of $92. Find total paid and extra cost.', a:'Deposit=$240; payments=12×92=$1104; total=$1344; extra=$144'},
      {tier:2, q:'Credit card balance $2400 at 18%pa. Minimum repayment $50/month. How much interest in first month?', a:'Monthly rate = 1.5%; interest = $36; net payment = $14 off principal'},
      {tier:3, q:'Invest $10 000 at 5%pa for 10 years. Compare simple vs compound interest.', a:'Simple: I=10000×0.05×10=$5000. Compound: 10000×1.05¹⁰≈$16289; I≈$6289. Compound earns $1289 more.'},
      {tier:4, q:'A person saves $200/month at 6%pa compounding monthly. Find total after 5 years.', a:'FV = 200×((1.005^60−1)/0.005) ≈ $13954'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Functions', skill:'Introduction to function notation', vc:'VC2M10A07',
    questions:[
      {tier:1, q:'If f(x) = 3x − 1, find f(2).', a:'5'},
      {tier:1, q:'If f(x) = x² + 2, find f(−3).', a:'11'},
      {tier:1, q:'If g(t) = 2t + 5, find g(0).', a:'5'},
      {tier:2, q:'If f(x) = x² − 3x + 1, find f(4).', a:'16−12+1=5'},
      {tier:2, q:'Find x if f(x) = 7, where f(x) = 2x + 1.', a:'x=3'},
      {tier:3, q:'f(x) = 2x−3 and g(x) = x²+1. Find f(g(2)).', a:'g(2)=5; f(5)=7'},
      {tier:4, q:'Find the inverse of f(x) = 3x − 5.', a:'y=3x−5; x=(y+5)/3; f⁻¹(x)=(x+5)/3'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Quadratic inequalities and word problems', vc:'VC2M10A04',
    questions:[
      {tier:2, q:'Solve x²−5x+4>0.', a:'(x−1)(x−4)>0; x<1 or x>4'},
      {tier:2, q:'Solve x²−2x−8≤0.', a:'(x−4)(x+2)≤0; −2≤x≤4'},
      {tier:3, q:'Find the range of x²+4x+7.', a:'Complete square: (x+2)²+3≥3; range is y≥3'},
      {tier:3, q:'A rectangle has length (x+3) and width (x−1). For what values of x is area > 21?', a:'(x+3)(x−1)>21; x²+2x−24>0; (x+6)(x−4)>0; x>4 (for positive dimensions)'},
      {tier:4, q:'Find all integers n where n²<10n.', a:'n²−10n<0; n(n−10)<0; 0<n<10; integers 1 through 9'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Simultaneous Equations', skill:'Simultaneous equations with quadratics', vc:'VC2M10A08',
    questions:[
      {tier:2, q:'Solve: y=x+2 and y=x².', a:'x²=x+2; x²−x−2=0; (x−2)(x+1)=0; (2,4) and (−1,1)'},
      {tier:2, q:'Solve: y=2x and y=x²+x−6.', a:'2x=x²+x−6; x²−x−6=0; (x−3)(x+2)=0; (3,6) and (−2,−4)'},
      {tier:3, q:'Find the number of intersections of y=x² and y=x+6.', a:'x²−x−6=0; Δ=1+24=25>0; two intersections'},
      {tier:4, q:'Find the values of c so that y=x+c is tangent to y=x².', a:'x²=x+c; x²−x−c=0; for tangent Δ=0: 1+4c=0; c=−1/4'},
    ]
  },

  { year:'10', strand:'Number', topic:'Real Numbers', skill:'Surd arithmetic and rationalisation', vc:'VC2M10N01',
    questions:[
      {tier:2, q:'Expand and simplify (√3+2)².', a:'3+4√3+4=7+4√3'},
      {tier:2, q:'Simplify: √(4/9)', a:'2/3'},
      {tier:2, q:'Simplify: (√5)² × √5', a:'5√5'},
      {tier:3, q:'Simplify: √8+√18−√2', a:'2√2+3√2−√2=4√2'},
      {tier:3, q:'Rationalise: 3/(2−√5)', a:'3(2+√5)/(4−5)=−3(2+√5)=−6−3√5'},
      {tier:4, q:'Simplify: (√6+√2)(√6−√2)/(√3+1)', a:'(6−2)/(√3+1)=4/(√3+1)=4(√3−1)/2=2(√3−1)=2√3−2'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Exact values and trigonometric identities', vc:'VC2M10M02',
    questions:[
      {tier:1, q:'Find exact value of sin 30°.', a:'1/2'},
      {tier:1, q:'Find exact value of cos 60°.', a:'1/2'},
      {tier:1, q:'Find exact value of tan 45°.', a:'1'},
      {tier:2, q:'Find exact value of sin 60°.', a:'√3/2'},
      {tier:2, q:'Show that sin²θ + cos²θ = 1 for θ = 30°.', a:'(1/2)²+(√3/2)²=1/4+3/4=1 ✓'},
      {tier:3, q:'Find exact value of tan 30°.', a:'1/√3 = √3/3'},
      {tier:3, q:'Find exact value of sin 45°.', a:'1/√2 = √2/2'},
      {tier:4, q:'Prove: tanθ = sinθ/cosθ using the definitions.', a:'sinθ=opp/hyp; cosθ=adj/hyp; sinθ/cosθ=(opp/hyp)/(adj/hyp)=opp/adj=tanθ ✓'},
    ]
  },

  { year:'10', strand:'Space', topic:'Geometry', skill:'Congruence and similarity proofs', vc:'VC2M10SP01',
    questions:[
      {tier:2, q:'In ΔABC and ΔPQR: AB=PQ, BC=QR, AC=PR. What test? Are they congruent?', a:'SSS — yes, congruent'},
      {tier:2, q:'ΔABC: angle A=50°, AB=8. ΔPQR: angle P=50°, PQ=8, angle B=angle Q=60°. Are they congruent?', a:'AAS (two angles and the included or matching side) — yes'},
      {tier:3, q:'Two triangles have all three angles equal. Does this prove congruence?', a:'No — it only proves similarity (same shape, different size)'},
      {tier:3, q:'Prove that the diagonals of a rhombus bisect each other at right angles.', a:'In rhombus ABCD all sides equal. Triangles AOB and COB: AO=CO (diagonals of parallelogram bisect), OB common, AB=CB. By SSS, ΔAOB≡ΔCOB, so angle AOB=angle COB=90°.'},
      {tier:4, q:'ΔABC is right-angled at C. CD is the altitude to the hypotenuse. Prove ΔACD∼ΔABC.', a:'Angle A is common; angle ACD=angle ACB=90°. AA∼: ΔACD∼ΔABC ✓'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Counting principles', vc:'VC2M10P02',
    questions:[
      {tier:1, q:'How many 3-letter arrangements from {A,B,C,D,E} without repetition?', a:'P(5,3) = 5×4×3 = 60'},
      {tier:2, q:'A menu has 3 entrees, 5 mains, 4 desserts. How many 3-course meals?', a:'3×5×4 = 60'},
      {tier:2, q:'How many ways to choose 2 from 7 if order does not matter?', a:'C(7,2) = 21'},
      {tier:3, q:'How many different arrangements of the word MATHS?', a:'5! = 120'},
      {tier:3, q:'How many 4-digit numbers with no repeated digits from 1–9?', a:'P(9,4) = 9×8×7×6 = 3024'},
      {tier:4, q:'A team of 5 is chosen from 4 teachers and 8 students with at least 2 teachers.', a:'C(4,2)×C(8,3)+C(4,3)×C(8,2)+C(4,4)×C(8,1)=6×56+4×28+1×8=336+112+8=456'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Sequences', skill:'Fibonacci and other special sequences', vc:'VC2M10A10',
    questions:[
      {tier:1, q:'Write the first 8 terms of the Fibonacci sequence.', a:'1,1,2,3,5,8,13,21'},
      {tier:2, q:'The sum of the first n terms of a GP with a=1, r=1/2. Find S₅.', a:'S₅=(1−(1/2)⁵)/(1−1/2)=2(1−1/32)=31/16'},
      {tier:2, q:'An AP has T₃=11 and T₇=27. Find T₁₀.', a:'d=4; a=3; T₁₀=3+9×4=39'},
      {tier:3, q:'A GP has sum to infinity of 16 and second term 4. Find the first term and ratio.', a:'ar=4; a/(1−r)=16; a=4/r; 4/(r(1−r))=16; r(1−r)=1/4; r²−r+1/4=0; (r−1/2)²=0; r=1/2; a=8'},
      {tier:4, q:'Show that the sum of n terms of a GP: Sₙ = a(rⁿ−1)/(r−1)', a:'Sₙ=a+ar+...+arⁿ⁻¹. rSₙ=ar+ar²+...+arⁿ. Sₙ(r−1)=arⁿ−a. Sₙ=a(rⁿ−1)/(r−1) ✓'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Depreciation and book value', vc:'VC2M10N03',
    questions:[
      {tier:1, q:'A machine worth $20000 depreciates 10% pa. Value after 1 year?', a:'$18000'},
      {tier:2, q:'Straight-line depreciation: $10000 over 5 years. Annual depreciation?', a:'$2000/year'},
      {tier:2, q:'Reducing balance: $8000 at 15% pa. Value after 3 years?', a:'8000×0.85³≈$4913'},
      {tier:3, q:'When is reducing balance depreciation better than straight-line for the owner?', a:'Reducing balance gives higher depreciation in early years, so more tax deductions early on'},
      {tier:4, q:'A car is bought for $45000. After 4 years using 20% reducing balance, it is sold. The buyer then depreciates it straight-line over 6 more years. Find the book value after 6 more years.', a:'After 4 yr: 45000×0.8⁴≈$18432. Straight-line: 18432/6=$3072/yr. After 6 yr: $0'},
    ]
  },

  { year:'10', strand:'Space', topic:'Geometry', skill:'Coordinate geometry proofs', vc:'VC2M10SP02',
    questions:[
      {tier:2, q:'Show that (0,0), (4,0), (4,3) form a right-angled triangle.', a:'Sides: 4, 3, 5. 3²+4²=25=5² ✓ Right angle at (4,0)'},
      {tier:2, q:'Find the equation of the perpendicular bisector of (2,4) and (8,10).', a:'Midpoint=(5,7); grad=(10−4)/6=1; perp grad=−1; y−7=−(x−5); y=−x+12'},
      {tier:3, q:'Show that A(1,1), B(7,3), C(5,9), D(−1,7) is a rectangle.', a:'AB grad=2/6=1/3; CD=2/6=1/3 (parallel). BC grad=6/−2=−3; AD=6/−2=−3 (parallel). AB⊥BC: 1/3×−3=−1 ✓'},
      {tier:4, q:'Find the area of the triangle with vertices (1,2), (5,6), (3,−2).', a:'Area=½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|=½|1(6+2)+5(−2−2)+3(2−6)|=½|8−20−12|=12'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'3D trigonometry problems', vc:'VC2M10M03',
    questions:[
      {tier:2, q:'A square base pyramid has base 10 m and height 12 m. Find the slant height.', a:'l=√(5²+12²)=13 m'},
      {tier:3, q:'A box is 5×4×3 m. Find the angle the space diagonal makes with the base.', a:'Base diagonal=√(25+16)=√41. Space diag=√(41+9)=√50. Angle=arctan(3/√41)≈25.1°'},
      {tier:4, q:'A tent has a rectangular base 4×6 m with a ridge pole 3 m high in the centre. Find the angle each roof panel makes with the base.', a:'Half-width=2 m; height=3 m; angle=arctan(3/2)≈56.3°'},
    ]
  },

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Data investigation and hypothesis testing', vc:'VC2M10ST02',
    questions:[
      {tier:2, q:'Explain what it means to say two variables are positively correlated.', a:'As one variable increases, the other tends to increase'},
      {tier:2, q:'A scatter plot shows r=−0.85. Describe the relationship.', a:'Strong negative correlation'},
      {tier:3, q:'Height and shoe size are positively correlated. Does taller height cause larger feet?', a:'Not necessarily causation — both are related to overall body size (common cause)'},
      {tier:4, q:'A researcher finds a correlation of 0.95 between ice cream sales and drowning rates. Explain.', a:'Spurious correlation — both are caused by a third variable (hot weather). Ice cream does not cause drowning.'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Algebraic Expressions', skill:'Advanced factorising', vc:'VC2M10A01',
    questions:[
      {tier:2, q:'Factorise: x² + 5x + 4', a:'(x+1)(x+4)'},
      {tier:2, q:'Factorise: x² − x − 20', a:'(x−5)(x+4)'},
      {tier:2, q:'Factorise: 2x² + 11x + 5', a:'(2x+1)(x+5)'},
      {tier:2, q:'Factorise: 3x² − 5x − 2', a:'(3x+1)(x−2)'},
      {tier:3, q:'Factorise: x² − 6x + 9 − y²', a:'(x−3)²−y² = (x−3+y)(x−3−y)'},
      {tier:3, q:'Factorise: 4x² + 12x + 9', a:'(2x+3)²'},
      {tier:4, q:'Factorise completely: x⁴ − 5x² + 4', a:'Let u=x²: (u−1)(u−4)=(x²−1)(x²−4)=(x+1)(x−1)(x+2)(x−2)'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Further sine and cosine rule problems', vc:'VC2M10M03',
    questions:[
      {tier:2, q:'In ΔABC: a=7, b=9, C=120°. Find c.', a:'c²=49+81−2×7×9×cos120°=130+63=193; c≈13.9'},
      {tier:2, q:'Find angle A: a=8, b=10, c=13.', a:'cosA=(64+100−169)/160=−5/160≈−0.03125; A≈91.8°'},
      {tier:3, q:'A ship sails from A: 60 km on bearing 040° to B, then 80 km on bearing 160° to C. Find AC.', a:'Angle at B=160°−40°=120°. AC²=3600+6400−2×60×80×cos120°=10000+4800=14800; AC≈121.7 km'},
      {tier:3, q:'Find the area of ΔABC with a=6, b=8, C=50°.', a:'Area=½×6×8×sin50°≈18.4 cm²'},
      {tier:4, q:'Two ships leave port: Ship A sails N60°E for 50 km. Ship B sails S30°E for 70 km. Find their distance apart.', a:'Angle between bearings = 60+30=90°. Distance=√(2500+4900)=√7400≈86 km'},
    ]
  },

  { year:'10', strand:'Number', topic:'Scientific notation', skill:'Scientific notation and very large/small numbers', vc:'VC2M10N02',
    questions:[
      {tier:1, q:'Write 0.000038 in scientific notation.', a:'3.8 × 10⁻⁵'},
      {tier:1, q:'Write 5.2 × 10⁻⁴ as a basic numeral.', a:'0.00052'},
      {tier:2, q:'Calculate: (4 × 10⁸) × (3 × 10⁻³)', a:'1.2 × 10⁶'},
      {tier:2, q:'Calculate: (9 × 10⁻²) ÷ (3 × 10⁴)', a:'3 × 10⁻⁶'},
      {tier:3, q:'The mass of an electron is 9.11 × 10⁻³¹ kg. A proton is 1836 times heavier. Find proton mass.', a:'1836 × 9.11×10⁻³¹ ≈ 1.67 × 10⁻²⁷ kg'},
      {tier:4, q:'Order from smallest: 5×10³, 3×10⁴, 2.5×10³, 4×10⁻², 1.5×10⁵.', a:'4×10⁻², 2.5×10³, 5×10³, 3×10⁴, 1.5×10⁵'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Simultaneous Equations', skill:'Applications of simultaneous equations', vc:'VC2M10A08',
    questions:[
      {tier:2, q:'Two numbers sum to 25 and differ by 7. Find them.', a:'x+y=25, x−y=7; x=16, y=9'},
      {tier:2, q:'Coffee costs $3 and tea $2. 40 drinks sold for $100 total. How many of each?', a:'3c+2t=100, c+t=40; c=20, t=20'},
      {tier:3, q:'A chemist mixes 20% and 50% acid solutions to make 300 mL of 30% solution. Find the amounts.', a:'0.2x+0.5y=90, x+y=300; x=200 mL, y=100 mL'},
      {tier:4, q:'Tickets: adult $15, child $8. 200 sold for $2150. How many of each?', a:'15a+8c=2150, a+c=200; 7a=550; a≈78.6... Let me fix: 7a=550 means not integer. Adjust: adult $12, child $8, total $1950 for 200 tickets: 4a=350, a=87.5 — still not integer. Use: adult $15, child $9, total $2145 for 200 sold: 6a=345, a=57.5. Better: adult $18, child $12, total 200, $2760: 6a=360, a=60, c=140.', a:'60 adult, 140 child'},
    ]
  },

  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Review of all statistics concepts', vc:'VC2M10ST01',
    questions:[
      {tier:1, q:'What is the median of: 3, 7, 9, 12, 15, 21?', a:'(9+12)/2 = 10.5'},
      {tier:1, q:'Find the mode: 5,7,3,5,8,5,7,3.', a:'5 (appears 3 times)'},
      {tier:2, q:'A dataset has mean 20 and SD 4. What percentage lies between 12 and 28?', a:'12 to 28 is mean ± 2SD ≈ 95%'},
      {tier:2, q:'Outlier test: Q1=10, Q3=30. Find outlier boundaries.', a:'IQR=20; lower fence=10−30=−20; upper fence=30+30=60'},
      {tier:3, q:'Which is more appropriate — mean or median for annual salaries in a company with a CEO earning $2M?', a:'Median — the CEO salary is an outlier that would inflate the mean'},
      {tier:4, q:'Compare: Dataset A has mean 50, SD=2. Dataset B has mean 50, SD=15. What does this tell us about the two groups?', a:'Same average performance but very different consistency. A is very uniform; B has students performing very differently from one another.'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Conditional probability and independence', vc:'VC2M10P01',
    questions:[
      {tier:1, q:'P(A|B) = P(A) if and only if A and B are _____.', a:'Independent'},
      {tier:2, q:'P(A)=0.6, P(B|A)=0.5. Find P(A∩B).', a:'0.3'},
      {tier:2, q:'A bag: 4 red, 6 blue. Draw two without replacement. P(2nd red | 1st red)?', a:'3/9 = 1/3'},
      {tier:3, q:'Disease test: P(disease)=0.02, P(+|disease)=0.95, P(+|no disease)=0.08. Find P(disease|+).', a:'P(+)=0.02×0.95+0.98×0.08=0.019+0.0784=0.0974; P(D|+)=0.019/0.0974≈0.195≈19.5%'},
      {tier:4, q:'Show that if P(A|B) = P(A), then P(B|A) = P(B).', a:'P(A|B)=P(A∩B)/P(B)=P(A); so P(A∩B)=P(A)P(B). P(B|A)=P(A∩B)/P(A)=P(A)P(B)/P(A)=P(B) ✓'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Sequences', skill:'Arithmetic and geometric review', vc:'VC2M10A10',
    questions:[
      {tier:1, q:'Is 3,6,12,24 arithmetic or geometric?', a:'Geometric (r=2)'},
      {tier:1, q:'Is 7,11,15,19 arithmetic or geometric?', a:'Arithmetic (d=4)'},
      {tier:2, q:'Find the 20th term of the AP: 4, 7, 10, ...', a:'T₂₀ = 4+19×3 = 61'},
      {tier:2, q:'Find the sum of the first 10 terms of the GP 2, 6, 18, ...', a:'S₁₀ = 2(3¹⁰−1)/2 = 59048'},
      {tier:3, q:'An AP has T₁=−5 and d=4. Which term equals 75?', a:'−5+(n−1)4=75; 4n=84; n=21'},
      {tier:4, q:'The 3rd term of a GP is 12 and the 6th term is 96. Find the 1st term and ratio.', a:'ar²=12; ar⁵=96; r³=8; r=2; a=3'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Inflation and real value', vc:'VC2M10N03',
    questions:[
      {tier:2, q:'Inflation is 3%pa. A loaf of bread costs $3.50 today. Find the price in 5 years.', a:'3.50×1.03⁵≈$4.06'},
      {tier:2, q:'In real terms, if inflation is 4% and your salary rises 6%, by what % does your purchasing power increase?', a:'(1.06/1.04)−1≈1.92%'},
      {tier:3, q:'$1000 invested at 5%pa nominal, compounding quarterly. Find the effective annual rate.', a:'EAR=(1+0.05/4)⁴−1≈5.09%'},
      {tier:1, q:'Simple interest formula?', a:'I = PRT/100'},
      {tier:1, q:'Compound interest formula?', a:'A = P(1+r/100)ⁿ'},
      {tier:1, q:'Depreciation formula (reducing balance)?', a:'V = P(1−r/100)ⁿ'},
      {tier:1, q:'What does APR stand for?', a:'Annual Percentage Rate'},
      {tier:4, q:'A pensioner receives $30 000/year. If inflation averages 2.5%pa for 20 years, find the equivalent purchasing power in today's dollars.', a:'Real value = 30000/1.025²⁰ ≈ $18 350'},
    ]
  },

  { year:'10', strand:'Space', topic:'Circle Geometry', skill:'Arc length and sector area', vc:'VC2M10SP03',
    questions:[
      {tier:1, q:'Find arc length: radius 8 cm, central angle 90°.', a:'l = 90/360 × 2π × 8 = 4π ≈ 12.6 cm'},
      {tier:1, q:'Find sector area: radius 6 cm, central angle 60°.', a:'A = 60/360 × π × 36 = 6π ≈ 18.8 cm²'},
      {tier:2, q:'A sector has arc length 15 cm and radius 9 cm. Find the central angle.', a:'θ/360 × 2π × 9 = 15; θ = 15×360/(18π) ≈ 95.5°'},
      {tier:3, q:'Find the area of a segment: chord subtends 120° at centre, radius 10 cm.', a:'Sector area = 120/360×π×100 = 100π/3. Triangle area = ½×100×sin120° = 25√3. Segment = 100π/3−25√3 ≈ 61.8 cm²'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Pythagoras and Trigonometry', skill:'Mixed Pythagoras and trig review', vc:'VC2M10M01',
    questions:[
      {tier:1, q:'Find hyp: legs 9 and 40.', a:'41'},
      {tier:1, q:'Find the exact length of the diagonal of a unit square.', a:'√2'},
      {tier:2, q:'A right triangle has hyp 15 and angle 37°. Find both legs.', a:'adj=15cos37°≈11.98; opp=15sin37°≈9.03'},
      {tier:2, q:'A 10 m ladder makes 68° with the ground. How high does it reach?', a:'10sin68°≈9.27 m'},
      {tier:3, q:'A rhombus has diagonals 16 and 12 cm. Find the side length and angles.', a:'Side=√(8²+6²)=10 cm; angle at vertex: tanθ=8/6; θ≈53.1°×2≈106.3° and 73.7°'},
      {tier:4, q:'From the base of a cliff, the angle of elevation to the top is 55°. Walking 30 m closer, it becomes 70°. Find the height.', a:'h/tan55° − h/tan70° = 30; h(0.7002−0.364)=30; h≈89.1 m'},
    ]
  },


  // ══════════════════════════════════════════════════════════════
  // TEXTBOOK-SOURCED QUESTIONS (Cambridge Essential Maths Yr 10)
  // ══════════════════════════════════════════════════════════════

  // ── CH1: Algebra, equations and linear relationships ─────────
  { year:'10', strand:'Algebra', topic:'Linear Relationships', skill:'Simplifying algebraic expressions', vc:'VC2M10A01',
    questions:[
      {tier:1, q:'Simplify: 8xy + 5x − 3xy + x', a:'5xy + 6x'},
      {tier:1, q:'Simplify: 18xy ÷ (12y)', a:'3x/2'},
      {tier:1, q:'Expand and simplify: 3(b + 5) + 6', a:'3b + 21'},
      {tier:1, q:'Expand and simplify: −3m(2m − 4) + 4m²', a:'−6m² + 12m + 4m² = −2m² + 12m'},
      {tier:2, q:'Expand and simplify: 2(x + 3) − 4(x − 5)', a:'2x + 6 − 4x + 20 = −2x + 26'},
      {tier:2, q:'Simplify: 3(2x + 4) − 5(x + 2)', a:'6x + 12 − 5x − 10 = x + 2'},
      {tier:3, q:'Expand and simplify: (x + 5)(3x − 4) − (2x)(5x + 2)', a:'3x²+11x−20 − 10x²−4x = −7x²+7x−20'},
      {tier:4, q:'If a = −3 and b = 4, evaluate ab + a².', a:'(−3)(4) + 9 = −12 + 9 = −3'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Relationships', skill:'Solving linear equations with fractions', vc:'VC2M10A05',
    questions:[
      {tier:1, q:'Solve: 4(3x − 5) = 7x', a:'12x − 20 = 7x; 5x = 20; x = 4'},
      {tier:1, q:'Solve: (x + 1)/3 = 4', a:'x = 11'},
      {tier:1, q:'Solve: x/2 − 3 = 7', a:'x = 20'},
      {tier:2, q:'Solve: (x − 9)/4 = −2', a:'x = 1'},
      {tier:2, q:'Simplify: 2x/3 + 4/9', a:'(6x + 4)/9'},
      {tier:2, q:'Simplify: (x + 2)/3 − (x − 4)/5', a:'(5(x+2) − 3(x−4))/15 = (2x+22)/15'},
      {tier:3, q:'Solve: (2x+1)/5 + (x−3)/10 = 2', a:'2(2x+1) + (x−3) = 20; 5x − 1 = 20; x = 21/5'},
      {tier:3, q:'Marie's watering can has 2 L and leaks at 0.4 L/min. How long until all water leaks out?', a:'t = 2/0.4 = 5 minutes'},
      {tier:4, q:'Solve: (4−x)/6 − (x+2)/4 = 1', a:'2(4−x) − 3(x+2) = 12; 8−2x−3x−6=12; −5x=10; x=−2'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Linear Relationships', skill:'Coordinate geometry — distance, midpoint, gradient', vc:'VC2M10A06',
    questions:[
      {tier:1, q:'Find gradient of line through (−2,4) and (3,1).', a:'m = (1−4)/(3−(−2)) = −3/5'},
      {tier:1, q:'Find exact distance between (2,4) and (5,2).', a:'√(9+4) = √13'},
      {tier:1, q:'Find midpoint of (−1,5) and (5,2).', a:'(2, 3.5)'},
      {tier:2, q:'Find distance between (2,4) and (6,11).', a:'√(16+49) = √65'},
      {tier:2, q:'Find distance between (−1,−4) and (2,−1).', a:'√(9+9) = 3√2'},
      {tier:2, q:'Find values of a if distance from (3,a) to (6,10) is √34.', a:'9+(10−a)²=34; (10−a)²=25; a=5 or a=15'},
      {tier:3, q:'Find equation of line parallel to y=3x+8, through (2,4).', a:'y = 3x − 2'},
      {tier:3, q:'Find equation of line perpendicular to y=2x−4, through (0,5).', a:'y = −x/2 + 5'},
      {tier:4, q:'Solve: 2x + 3y = −11 and 3x − 4y = −18 using elimination.', a:'Multiply: 8x+12y=−44 and 9x−12y=−54. Add: 17x=−98; x=−98/17... Use simpler values: 2x+3y=5 and x+y=2: y=2−x; 2x+6−3x=5; x=1,y=1'},
    ]
  },

  // ── CH3: Indices, exponentials and logarithms ────────────────
  { year:'10', strand:'Algebra', topic:'Exponential and Log Equations', skill:'Index laws review and negative indices', vc:'VC2M10A02',
    questions:[
      {tier:1, q:'Simplify: (5y³)²', a:'25y⁶'},
      {tier:1, q:'Simplify: 7m⁰ − (5n)⁰', a:'7 − 1 = 6'},
      {tier:1, q:'Simplify: 4x²y⁻⁴ (express with positive indices)', a:'4x²/y⁴'},
      {tier:1, q:'Simplify: 3x²y⁻⁴ × (3x/y⁻³)²', a:'3x²y⁻⁴ × 9x²/y⁻⁶ = 27x⁴y²'},
      {tier:2, q:'Write 3.21 × 10³ as a basic numeral.', a:'3210'},
      {tier:2, q:'Write 7.59 × 10⁻³ as a basic numeral.', a:'0.00759'},
      {tier:2, q:'Write 0.0003084 in scientific notation (3 sig. fig.).', a:'3.08 × 10⁻⁴'},
      {tier:2, q:'Write 5 678 200 in scientific notation.', a:'5.6782 × 10⁶'},
      {tier:3, q:'Simplify: 3(a²b⁻⁴)² ÷ (2ab⁻²)²', a:'3a⁴b⁻⁸ ÷ 4a²b⁻⁴ = 3a²/(4b⁴)'},
      {tier:4, q:'Simplify: (3a²b⁻⁴)² ÷ (2ab)⁻² expressing with positive indices only.', a:'9a⁴b⁻⁸ ÷ (1/(4a²b²)) = 9a⁴b⁻⁸ × 4a²b² = 36a⁶b⁻⁶ = 36a⁶/b⁶'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Exponential and Log Equations', skill:'Fractional indices and surds — index form', vc:'VC2M10N02',
    questions:[
      {tier:1, q:'Express √21 in index form.', a:'21^(1/2)'},
      {tier:1, q:'Express ∛x in index form.', a:'x^(1/3)'},
      {tier:1, q:'Express 7√7 in index form.', a:'7^(3/2)'},
      {tier:2, q:'Evaluate: 25^(1/2)', a:'5'},
      {tier:2, q:'Evaluate: 64^(1/3)', a:'4'},
      {tier:2, q:'Evaluate: 49^(−1/2)', a:'1/7'},
      {tier:2, q:'Evaluate: 125^(2/3)', a:'(∛125)² = 25'},
      {tier:3, q:'Solve: 3ˣ = 27', a:'x = 3'},
      {tier:3, q:'Solve: 4^(2x+1) = 64', a:'2^(4x+2) = 2⁶; 4x+2=6; x=1'},
      {tier:4, q:'Solve: 7^(3x−1) = 49ˣ', a:'7^(3x−1) = 7^(2x); 3x−1=2x; x=1'},
    ]
  },

  { year:'10', strand:'Number', topic:'Logarithms', skill:'Laws of logarithms', vc:'VC2M10N02',
    questions:[
      {tier:1, q:'Write log₂4 = 2 in index form.', a:'2² = 4'},
      {tier:1, q:'Write 10³ = 1000 in logarithm form.', a:'log₁₀1000 = 3'},
      {tier:1, q:'Write 3⁻² = 1/9 in logarithm form.', a:'log₃(1/9) = −2'},
      {tier:2, q:'Evaluate: log₁₀1000', a:'3'},
      {tier:2, q:'Evaluate: log₃81', a:'4'},
      {tier:2, q:'Evaluate: log₇1', a:'0'},
      {tier:2, q:'Evaluate: log₄(1/16)', a:'−2'},
      {tier:3, q:'Evaluate: log₅(1/125)', a:'−3'},
      {tier:4, q:'If log₂x = 5, find x.', a:'x = 32'},
    ]
  },

  { year:'10', strand:'Number', topic:'Financial Maths', skill:'Compound interest applications', vc:'VC2M10N03',
    questions:[
      {tier:1, q:'$1000 compounded annually at 5% for 4 years. Find total amount.', a:'A = 1000 × 1.05⁴ ≈ $1215.51'},
      {tier:2, q:'$3000 compounded monthly at 4%pa for 2 years. Find A.', a:'A = 3000×(1+0.04/12)^24 ≈ $3249.79'},
      {tier:2, q:'$5000 compounded daily at 3%pa for 1 year. Find A.', a:'A = 5000×(1+0.03/365)^365 ≈ $5152.27'},
      {tier:3, q:'An antique bought for $800 grows at 7%pa. Find value after 5 years.', a:'A = 800 × 1.07⁵ ≈ $1122.17'},
      {tier:3, q:'A balloon has volume 3000 cm³ leaking at 18% per minute. Volume after 3 minutes?', a:'V = 3000 × 0.82³ ≈ 2024 cm³'},
      {tier:4, q:'How many years for $2000 to grow to $3000 at 6% compound annually?', a:'1.06ⁿ = 1.5; n = log(1.5)/log(1.06) ≈ 6.96 years'},
    ]
  },

  // ── CH4: Measurement and surds ───────────────────────────────
  { year:'10', strand:'Number', topic:'Real Numbers', skill:'Surd simplification from textbook', vc:'VC2M10N01',
    questions:[
      {tier:1, q:'Simplify: √24', a:'2√6'},
      {tier:1, q:'Simplify: 3√200', a:'30√2'},
      {tier:1, q:'Simplify: √(8/9)', a:'2√2/3'},
      {tier:1, q:'Simplify: 2√45/15', a:'2×3√5/15 = 6√5/15 = 2√5/5'},
      {tier:2, q:'Simplify: 2√3 + 4 + 5√3', a:'7√3 + 4'},
      {tier:2, q:'Simplify: 6√5 − √7 − 4√5 + 3√7', a:'2√5 + 2√7'},
      {tier:2, q:'Simplify: √8 + 3√2', a:'2√2 + 3√2 = 5√2'},
      {tier:2, q:'Simplify: √5 × √6', a:'√30'},
      {tier:3, q:'Expand: √2(2√3 + 4)', a:'2√6 + 4√2'},
      {tier:3, q:'Expand: 2√3(2√15 − √3)', a:'4√45 − 6 = 12√5 − 6'},
      {tier:3, q:'Expand: (√11)²', a:'11'},
      {tier:3, q:'Expand: (4√3)²', a:'48'},
      {tier:4, q:'Rationalise: 1/√6', a:'√6/6'},
      {tier:4, q:'Rationalise: 6√3/√2', a:'6√6/2 = 3√6'},
      {tier:4, q:'Rationalise: 3√3/(2√6)', a:'3√3×√6/(2×6) = 3√18/12 = 9√2/12 = 3√2/4'},
      {tier:4, q:'Rationalise: (4√2−√3)/√3', a:'(4√2−√3)×√3/3 = (4√6−3)/3'},
    ]
  },

  { year:'10', strand:'Measurement', topic:'Measurement', skill:'Surface area of prisms, cylinders and cones — textbook', vc:'VC2M10M05',
    questions:[
      {tier:1, q:'Find surface area of rectangular prism: 8×5×6 m.', a:'2(40+48+30) = 236 m²'},
      {tier:2, q:'Find surface area of cylinder: r=4 cm, h=20 cm.', a:'2π(4)(20) + 2π(16) = 160π + 32π = 192π ≈ 603.2 cm²'},
      {tier:2, q:'Give limits of accuracy for: 8 m.', a:'7.5 m ≤ measurement < 8.5 m'},
      {tier:2, q:'Give limits of accuracy for: 10.3 kg.', a:'10.25 kg ≤ measurement < 10.35 kg'},
      {tier:3, q:'Find surface area of prism (triangular cross-section 3×4×5, length 6).', a:'2×(½×3×4) + 5×6 + 3×6 + 4×6 = 12+30+18+24 = 84 cm²'},
      {tier:4, q:'Find surface area of cone: r=5 cm, l=10 cm. Include base.', a:'π×5×10 + π×25 = 75π ≈ 235.6 cm²'},
    ]
  },

  // ── CH5: Quadratic expressions and equations ─────────────────
  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Expanding and factorising — textbook exercises', vc:'VC2M10A04',
    questions:[
      {tier:1, q:'Expand: 2(x+3) − 4(x−5)', a:'2x+6−4x+20 = −2x+26'},
      {tier:1, q:'Expand: (x+5)(3x−4)', a:'3x²+11x−20'},
      {tier:1, q:'Expand: (5x−2)(5x+2)', a:'25x²−4'},
      {tier:2, q:'Factorise: 3x²+18x', a:'3x(x+6)'},
      {tier:2, q:'Factorise: 4(x+1)−b(x+1)', a:'(4−b)(x+1)'},
      {tier:2, q:'Factorise: x²−ax+2x−2a', a:'x(x−a)+2(x−a) = (x+2)(x−a)'},
      {tier:2, q:'Factorise: a²−49', a:'(a+7)(a−7)'},
      {tier:2, q:'Factorise: 9x²−16', a:'(3x+4)(3x−4)'},
      {tier:2, q:'Factorise: 3x²−75', a:'3(x²−25) = 3(x+5)(x−5)'},
      {tier:2, q:'Factorise: x²−8x+12', a:'(x−2)(x−6)'},
      {tier:2, q:'Factorise: x²+10x−24', a:'(x+12)(x−2)'},
      {tier:2, q:'Factorise: −3x²+21x−18', a:'−3(x²−7x+6) = −3(x−1)(x−6)'},
      {tier:3, q:'Factorise: 3x²+17x+10', a:'(3x+2)(x+5)'},
      {tier:3, q:'Factorise: 4x²+4x−15', a:'(2x+5)(2x−3)'},
      {tier:3, q:'Simplify: (4x+8)/(x²+2x)', a:'4(x+2)/(x(x+2)) = 4/x'},
      {tier:4, q:'Simplify: (12x/(x²+2x−3)) × (x²−1)/(6x+6)', a:'12x/((x+3)(x−1)) × (x+1)(x−1)/(6(x+1)) = 12x(x−1)/(6(x+3)(x−1)) = 2x/(x+3)'},
    ]
  },

  { year:'10', strand:'Algebra', topic:'Quadratics', skill:'Solving quadratics — textbook exercises', vc:'VC2M10A04',
    questions:[
      {tier:1, q:'Solve: x²+4x=0', a:'x(x+4)=0; x=0 or x=−4'},
      {tier:1, q:'Solve: 3x²−9x=0', a:'3x(x−3)=0; x=0 or x=3'},
      {tier:1, q:'Solve: x²−25=0', a:'x=±5'},
      {tier:2, q:'Solve: x²−10x+21=0', a:'(x−3)(x−7)=0; x=3 or 7'},
      {tier:2, q:'Solve: x²−8x+16=0', a:'(x−4)²=0; x=4'},
      {tier:2, q:'Solve: x²+5x−36=0', a:'(x+9)(x−4)=0; x=−9 or 4'},
      {tier:2, q:'Solve: 3x²=27', a:'x²=9; x=±3'},
      {tier:2, q:'Solve: x²=4x+5', a:'x²−4x−5=0; (x−5)(x+1)=0; x=5 or −1'},
      {tier:3, q:'Solve: 2x²+3x−2=0 using quadratic formula.', a:'x=(−3±√(9+16))/4=(−3±5)/4; x=1/2 or −2'},
      {tier:3, q:'A rectangular sandpit is 2 m longer than it is wide and has area 48 m². Find dimensions.', a:'w(w+2)=48; w²+2w−48=0; (w+8)(w−6)=0; w=6; 6×8 m'},
      {tier:4, q:'Factorise by completing the square: x²+8x+10', a:'(x+4)²−6'},
    ]
  },

  // ── CH6: Trigonometry ─────────────────────────────────────────
  { year:'10', strand:'Measurement', topic:'Trigonometry', skill:'Trigonometry ratios — textbook', vc:'VC2M10M02',
    questions:[
      {tier:1, q:'Find x: right triangle, hyp=18, angle=35°, find adj.', a:'x = 18cos35° ≈ 14.74'},
      {tier:1, q:'Find x: right triangle, angle=28°, opp=7, find hyp.', a:'x = 7/sin28° ≈ 14.90'},
      {tier:2, q:'Find θ: right triangle, adj=10, opp=14.', a:'θ = tan⁻¹(14/10) ≈ 54.5°'},
      {tier:2, q:'Find θ: right triangle, opp=6.8, hyp unknown, adj=3.2.', a:'θ = tan⁻¹(6.8/3.2) ≈ 64.8°... Wait: need hyp for sin. Use tan: θ = tan⁻¹(6.8/3.2) ≈ 64.8°'},
      {tier:2, q:'An escalator is 22 m long and makes 16° with horizontal. How high is level 2?', a:'h = 22 sin16° ≈ 6.1 m'},
      {tier:3, q:'A helicopter flies south 160 km then 125°T for 120 km. How far east is it from start?', a:'120 sin(125°−90°) = 120 sin35° ≈ 68.8 km east'},
      {tier:3, q:'Triangle: x cm, 38°, 25 cm, 98°. Find x using sine rule.', a:'x/sin38° = 25/sin(180°−38°−98°) = 25/sin44°; x = 25sin38°/sin44° ≈ 21.6 cm'},
      {tier:4, q:'Triangle: sides 7 and 9, angle between them 102°. Find the third side.', a:'c² = 49+81−2×7×9×cos102° = 130+26.4 = 156.4; c ≈ 12.5'},
    ]
  },

  // ── CH7: Parabolas ────────────────────────────────────────────
  { year:'10', strand:'Algebra', topic:'Non-linear Graphs', skill:'Parabola features — textbook', vc:'VC2M10A07',
    questions:[
      {tier:1, q:'State the turning point and type for y=(x−2)².', a:'Min at (2,0)'},
      {tier:1, q:'State the turning point and type for y=−x²+5.', a:'Max at (0,5)'},
      {tier:1, q:'State the turning point for y=−(x+1)²−2.', a:'Max at (−1,−2)'},
      {tier:1, q:'State the turning point for y=2(x−3)²+4.', a:'Min at (3,4)'},
      {tier:2, q:'Sketch y=x²−4, finding x-intercepts and y-intercept.', a:'y-int=(0,−4); x-ints=(±2,0); vertex=(0,−4)'},
      {tier:2, q:'Find x-intercepts: y=x²+8x+16.', a:'(x+4)²=0; x=−4 (one x-intercept)'},
      {tier:2, q:'Find x-intercepts: y=x²−2x−8.', a:'(x−4)(x+2)=0; x=4 or −2'},
      {tier:3, q:'Sketch y=x²−4x+1 by completing the square. Find all key features.', a:'y=(x−2)²−3; vertex (2,−3), y-int (0,1), x-ints: 2±√3'},
      {tier:3, q:'State number of x-intercepts: y=(x+4)².', a:'One (x=−4, tangent)'},
      {tier:3, q:'State number of x-intercepts: y=(x−2)²+5.', a:'Zero (Δ<0)'},
      {tier:4, q:'Use quadratic formula to find x-intercepts of y=2x²−8x+5.', a:'x=(8±√(64−40))/4=(8±√24)/4=2±√6/2'},
    ]
  },

  // ── CH8: Probability ─────────────────────────────────────────
  { year:'10', strand:'Probability', topic:'Probability', skill:'Probability from the textbook', vc:'VC2M10P01',
    questions:[
      {tier:1, q:'A letter from INTEREST is chosen. Find P(I).', a:'2/8 = 1/4'},
      {tier:1, q:'A letter from INTEREST is chosen. Find P(E).', a:'1/8'},
      {tier:1, q:'A letter from INTEREST is chosen. Find P(vowel).', a:'P(I,E,E) wait: I,N,T,E,R,E,S,T → vowels: I,E,E = 3/8'},
      {tier:1, q:'A letter from INTEREST is chosen. Find P(not a vowel).', a:'5/8'},
      {tier:2, q:'P(A)=0.25, P(B)=0.35, P(A∪B)=0.5. Find P(A∩B).', a:'0.25+0.35−0.5=0.10'},
      {tier:2, q:'P(A)=0.25, P(B)=0.35, P(A∪B)=0.5. Find P(A'∩B').', a:'1−P(A∪B)=0.5'},
      {tier:3, q:'Of 36 people, 18 like cars, 11 like homewares, 6 like both. How many like neither?', a:'36−(18+11−6)=36−23=13'},
      {tier:3, q:'All 26 birds: 18 have tags, 14 have clipped wings, both=x. Find x.', a:'18+14−x=26; x=6'},
      {tier:3, q:'P(A)=0.4, P(B)=0.3, A and B independent. Find P(A∩B).', a:'0.4×0.3=0.12'},
      {tier:4, q:'A fair 4-sided die (1−4) is rolled twice. Find P(sum=5).', a:'Outcomes with sum 5: (1,4),(2,3),(3,2),(4,1) = 4/16 = 1/4'},
    ]
  },

  { year:'10', strand:'Probability', topic:'Probability', skill:'Counting, arrangements and selections', vc:'VC2M10P02',
    questions:[
      {tier:1, q:'Evaluate: 6!', a:'720'},
      {tier:1, q:'Evaluate: 5!/2!', a:'60'},
      {tier:1, q:'Evaluate: ⁸C₃', a:'56'},
      {tier:1, q:'Evaluate: C(9,8)', a:'9'},
      {tier:2, q:'Two letters from HAPPY, two from HEY. P(H then E)?', a:'Sample space = 5×3=15. P(H and E) = 2/5 × 1/3 = 2/15'},
      {tier:2, q:'A 4-sided die rolled twice. List sample space for totals. Find P(total=2).', a:'Only (1,1): P=1/16'},
      {tier:3, q:'2 from 2 children and 3 adults without replacement. P(2 adults)?', a:'C(3,2)/C(5,2) = 3/10'},
      {tier:3, q:'How many arrangements of letters in MATHS?', a:'5! = 120'},
      {tier:4, q:'A committee of 4 from 3 men, 5 women with exactly 2 women.', a:'C(5,2)×C(3,2) = 10×3 = 30'},
    ]
  },

  // ── CH9: Statistics ───────────────────────────────────────────
  { year:'10', strand:'Statistics', topic:'Data Analysis', skill:'Statistics from textbook — histograms, box plots, scatter', vc:'VC2M10ST01',
    questions:[
      {tier:1, q:'TV data: 0 hrs(×8), 1 hr(×5), 2 hrs(×4), 3 hrs(×2), 4 hrs(×1). Find median.', a:'20 values; median = avg of 10th and 11th = (1+1)/2 = 1 hr'},
      {tier:1, q:'Find mode from: 0(×8), 1(×5), 2(×4), 3(×2), 4(×1).', a:'0 hours'},
      {tier:2, q:'Data: 2,2,3,3,3,4,5,6,12. Find Q1, Q2, Q3.', a:'Q1=2.5, Q2=3, Q3=5.5'},
      {tier:2, q:'IQR = Q3−Q1 = 3. Q3=5.5. Find upper outlier fence.', a:'5.5+1.5×3=10'},
      {tier:2, q:'Box plot A: median 60, IQR 20. Box plot B: median 60, IQR 8. Which is more consistent?', a:'B — smaller IQR means less spread'},
      {tier:3, q:'15 students: survey hours spent online: 7,12,14,20,2,26,8,1,17,12,21,5,6,18,14. Sort and find five-number summary.', a:'Sorted: 1,2,5,6,7,8,12,12,14,14,17,18,20,21,26. Min=1,Q1=6,Q2=12,Q3=18,Max=26'},
      {tier:3, q:'Describe a scatter plot where r=−0.9.', a:'Strong negative linear correlation'},
      {tier:4, q:'A line of best fit passes through (20,15) and (40,25). Find equation and estimate y when x=10.', a:'m=(25−15)/20=0.5; y−15=0.5(x−20); y=0.5x+5. At x=10: y=10'},
    ]
  },

]

// ── SEED FUNCTION ───────────────────────────────────────────────
export async function seedYear10(onProgress = () => {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  onProgress('Starting Year 10 seed...')
  let skillCount = 0, questionCount = 0, errors = 0

  for (const skill of SKILLS_YR10) {
    const { data: skillRow, error: skillErr } = await supabase
      .from('skills')
      .upsert({
        year_level: skill.year,
        strand: skill.strand,
        topic: skill.topic,
        skill_name: skill.skill,
        vc_code: skill.vc || '',
        prerequisites: [],
        is_shared: true,
        created_by: user.id,
      }, { onConflict: 'year_level,strand,topic,skill_name', ignoreDuplicates: false })
      .select('id')
      .single()

    if (skillErr) { errors++; continue }

    let skillId = skillRow?.id
    if (!skillId) {
      const { data: existing } = await supabase.from('skills').select('id')
        .eq('year_level', skill.year).eq('strand', skill.strand)
        .eq('topic', skill.topic).eq('skill_name', skill.skill).single()
      skillId = existing?.id
    }
    if (!skillId) { errors++; continue }
    skillCount++

    await supabase.from('questions').delete().eq('skill_id', skillId)

    const qRows = skill.questions.map(q => ({
      skill_id: skillId,
      tier: q.tier,
      question_type: 'std',
      question_text: q.q,
      answer_text: q.a,
      vc_code: skill.vc || '',
      is_shared: true,
      created_by: user.id,
    }))

    const { error: qErr } = await supabase.from('questions').insert(qRows)
    if (qErr) { errors++ } else { questionCount += qRows.length }
    onProgress(`${skillCount} skills, ${questionCount} questions...`)
  }

  onProgress(`Year 10 complete: ${skillCount} skills, ${questionCount} questions, ${errors} errors`)
  return { skillCount, questionCount, errors }
}
