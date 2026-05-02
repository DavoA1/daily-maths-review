// ═══════════════════════════════════════════════════════════════════
// YEAR 7 QUESTION BANK — Victorian Curriculum 2.0
// Mapped to VC2M7 content description codes
// 700+ questions across Number, Algebra, Measurement, Space, Statistics, Probability
// ═══════════════════════════════════════════════════════════════════

import { supabase } from './supabase.js'

const SKILLS_YR7 = [

  // ══════════════════════════════════════════════════════════════
  // NUMBER
  // ══════════════════════════════════════════════════════════════

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Squares, square roots and perfect squares', vc: 'VC2M7N01',
    questions: [
      { tier:1, q:'Find 7²', a:'49' },
      { tier:1, q:'Find 12²', a:'144' },
      { tier:1, q:'Find √64', a:'8' },
      { tier:1, q:'Find √121', a:'11' },
      { tier:1, q:'Is 36 a perfect square?', a:'Yes — 6² = 36' },
      { tier:1, q:'Find √225', a:'15' },
      { tier:1, q:'Find 9²', a:'81' },
      { tier:2, q:'Between which two consecutive whole numbers does √50 lie?', a:'7 and 8 (7²=49, 8²=64)' },
      { tier:2, q:'Find the side length of a square with area 196 cm².', a:'14 cm' },
      { tier:2, q:'Evaluate: 5² + √144', a:'25 + 12 = 37' },
      { tier:2, q:'List all perfect squares between 50 and 130.', a:'64, 81, 100, 121' },
      { tier:2, q:'Evaluate: √(49 + 576)', a:'√625 = 25' },
      { tier:3, q:'A square garden has area 256 m². A path 1 m wide goes all around it. Find the total area including path.', a:'Side = 16 m. With path: 18 × 18 = 324 m²' },
      { tier:3, q:'Find all values of n where n² < 200.', a:'n = 1 to 14 (14²=196 < 200, 15²=225 > 200)' },
      { tier:4, q:'Prove that (n+1)² − n² = 2n + 1 and use this to find the 15th odd number.', a:'(n+1)² − n² = n²+2n+1−n² = 2n+1. 15th odd: 2(15)+1 = 31' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Prime numbers, factors and index notation', vc: 'VC2M7N02',
    questions: [
      { tier:1, q:'Write 36 as a product of prime factors.', a:'2² × 3²' },
      { tier:1, q:'Write 60 as a product of prime factors.', a:'2² × 3 × 5' },
      { tier:1, q:'Is 47 prime or composite?', a:'Prime' },
      { tier:1, q:'List all factors of 24.', a:'1, 2, 3, 4, 6, 8, 12, 24' },
      { tier:1, q:'Write 72 in index notation using prime factors.', a:'2³ × 3²' },
      { tier:1, q:'Find the HCF of 18 and 24.', a:'6' },
      { tier:1, q:'Find the LCM of 4 and 6.', a:'12' },
      { tier:2, q:'Write 120 as a product of prime factors.', a:'2³ × 3 × 5' },
      { tier:2, q:'Find HCF(36, 48).', a:'12' },
      { tier:2, q:'Find LCM(8, 12).', a:'24' },
      { tier:2, q:'Write 3000 in index notation.', a:'2³ × 3 × 5³' },
      { tier:2, q:'Find all prime numbers between 20 and 40.', a:'23, 29, 31, 37' },
      { tier:2, q:'Find HCF(84, 126).', a:'42' },
      { tier:3, q:'Three buses depart at 7 am. Bus A every 12 min, B every 15 min, C every 20 min. When do all three next depart together?', a:'LCM(12,15,20) = 60 min → 8:00 am' },
      { tier:3, q:'Find the smallest number divisible by both 18 and 24.', a:'LCM(18,24) = 72' },
      { tier:4, q:'Show that 2⁵ × 3² × 5 has exactly 18 factors.', a:'(5+1)(2+1)(1+1) = 6×3×2 = 36. Wait: 2⁵×3²×5¹ → (5+1)(2+1)(1+1)=36 factors. 18 factors would be 2⁵×3×5 = (5+1)(1+1)(1+1)=24. Check: e.g. 2¹×3²×5⁰ → (1+1)(2+1)(0+1)=6.' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Fractions', skill: 'Equivalent fractions and comparing fractions', vc: 'VC2M7N03',
    questions: [
      { tier:1, q:'Write an equivalent fraction for 3/4 with denominator 12.', a:'9/12' },
      { tier:1, q:'Simplify 18/24 to lowest terms.', a:'3/4' },
      { tier:1, q:'Which is larger: 3/5 or 5/8?', a:'5/8 (= 0.625 > 0.6)' },
      { tier:1, q:'Convert 2 3/4 to an improper fraction.', a:'11/4' },
      { tier:1, q:'Convert 17/5 to a mixed number.', a:'3 2/5' },
      { tier:1, q:'Place on a number line: −3/4', a:'Three-quarters of the way from 0 to −1' },
      { tier:2, q:'Order from smallest to largest: 2/3, 3/5, 5/8', a:'3/5 = 0.6, 5/8 = 0.625, 2/3 = 0.667 → 3/5, 5/8, 2/3' },
      { tier:2, q:'Simplify 48/72.', a:'2/3' },
      { tier:2, q:'Find a fraction between 1/3 and 1/2.', a:'5/12 (or many others)' },
      { tier:2, q:'Order: −1/2, −3/4, −1/3, −2/5', a:'−3/4, −1/2, −2/5, −1/3' },
      { tier:3, q:'Which is closer to 1: 7/8 or 8/9?', a:'8/9 (= 0.888... vs 7/8 = 0.875)' },
      { tier:3, q:'Find three fractions between 3/7 and 4/7.', a:'e.g. 13/28, 1/2, 15/28' },
      { tier:4, q:'Arrange in order: 5/6, 7/9, 11/12, 13/18', a:'LCM = 36: 30/36, 28/36, 33/36, 26/36 → 13/18, 7/9, 5/6, 11/12' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Decimals', skill: 'Rounding and estimation with decimals', vc: 'VC2M7N04',
    questions: [
      { tier:1, q:'Round 3.7462 to 2 decimal places.', a:'3.75' },
      { tier:1, q:'Round 0.0856 to 2 significant figures.', a:'0.086' },
      { tier:1, q:'Estimate: 4.89 × 3.1', a:'≈ 5 × 3 = 15' },
      { tier:1, q:'Round 47.356 to the nearest whole number.', a:'47' },
      { tier:1, q:'Round 2.9999 to 1 decimal place.', a:'3.0' },
      { tier:2, q:'Round 0.04567 to 3 significant figures.', a:'0.0457' },
      { tier:2, q:'Estimate the cost of 4.8 kg at $3.95/kg.', a:'≈ 5 × 4 = $20' },
      { tier:2, q:'Use estimation to check: 3.72 × 8.1 ≈ ?', a:'≈ 4 × 8 = 32 (actual ≈ 30.1)' },
      { tier:3, q:'A rectangle is 3.74 m × 2.18 m. Estimate then calculate the area to 2 d.p.', a:'Estimate: 4 × 2 = 8 m². Actual: 8.15 m²' },
      { tier:3, q:'Round 0.9995 to 3 decimal places.', a:'1.000' },
      { tier:4, q:'A supermarket bag holds 2 kg. You have items weighing 0.38, 0.72, 0.51, 0.63, 0.45 kg. Will they fit? Estimate first, then check.', a:'Estimate: 0.4+0.7+0.5+0.6+0.5 = 2.7 kg — probably not. Actual: 2.69 kg — does not fit.' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Fractions and Decimals', skill: 'Multiplying and dividing fractions and decimals', vc: 'VC2M7N05',
    questions: [
      { tier:1, q:'Calculate: 2/3 × 3/4', a:'1/2' },
      { tier:1, q:'Calculate: 5/6 ÷ 5/12', a:'2' },
      { tier:1, q:'Calculate: 1.8 × 0.4', a:'0.72' },
      { tier:1, q:'Calculate: 3.6 ÷ 0.9', a:'4' },
      { tier:1, q:'Calculate: 3/8 × 4', a:'3/2 = 1 1/2' },
      { tier:1, q:'Calculate: 2 1/2 × 1 1/3', a:'10/3 = 3 1/3' },
      { tier:2, q:'Calculate: 3/4 ÷ 1 1/2', a:'1/2' },
      { tier:2, q:'Calculate: 0.06 × 0.4', a:'0.024' },
      { tier:2, q:'Calculate: 5.4 ÷ 0.06', a:'90' },
      { tier:2, q:'How many pieces of 0.25 m can be cut from a 3.5 m length of rope?', a:'14 pieces' },
      { tier:2, q:'Calculate: 2 3/4 ÷ 1 1/4', a:'11/4 ÷ 5/4 = 11/5 = 2 1/5' },
      { tier:3, q:'A recipe uses 2/3 cup of flour per serve. How much for 7 1/2 serves?', a:'2/3 × 15/2 = 5 cups' },
      { tier:3, q:'Calculate: (3/4)² × 16', a:'9/16 × 16 = 9' },
      { tier:4, q:'A pool is being filled at 2 2/3 kL per hour. It needs 20 kL. How long in hours and minutes?', a:'20 ÷ 8/3 = 60/8 = 7.5 hours = 7 hours 30 min' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Fractions and Decimals', skill: 'Four operations with rational numbers', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Calculate: 1/4 + 3/8', a:'5/8' },
      { tier:1, q:'Calculate: 5/6 − 1/4', a:'7/12' },
      { tier:1, q:'Calculate: 3.4 + 2.87', a:'6.27' },
      { tier:1, q:'Calculate: 5.6 − 2.38', a:'3.22' },
      { tier:1, q:'Calculate: 1 3/4 + 2 1/2', a:'4 1/4' },
      { tier:1, q:'Calculate: 3 − 1 5/8', a:'1 3/8' },
      { tier:2, q:'Calculate: 2 1/3 + 1 3/4', a:'4 1/12' },
      { tier:2, q:'Calculate: 4.5 − 1 2/5', a:'4.5 − 1.4 = 3.1' },
      { tier:2, q:'Calculate: −3/4 + 1/2', a:'−1/4' },
      { tier:2, q:'A rope is 8 3/4 m. Pieces of 1 1/2 m and 2 3/8 m are cut. How much is left?', a:'8 3/4 − 1 1/2 − 2 3/8 = 4 7/8 m' },
      { tier:3, q:'Calculate: 3 1/2 × (2/3 + 1/4) − 1 1/8', a:'3.5 × 11/12 − 9/8 = 77/24 − 27/24 = 50/24 = 25/12 = 2 1/12' },
      { tier:4, q:'Find the missing fraction: □ + 2/3 = 1 5/6', a:'7/6 = 1 1/6' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Percentages', skill: 'Finding percentages of quantities', vc: 'VC2M7N07',
    questions: [
      { tier:1, q:'Find 20% of 80.', a:'16' },
      { tier:1, q:'Find 15% of 60.', a:'9' },
      { tier:1, q:'Find 5% of 240.', a:'12' },
      { tier:1, q:'Find 50% of 346.', a:'173' },
      { tier:1, q:'Find 10% of $75.', a:'$7.50' },
      { tier:1, q:'What percentage is 30 of 120?', a:'25%' },
      { tier:2, q:'Find 37.5% of 160.', a:'60' },
      { tier:2, q:'What percentage is 45 of 60?', a:'75%' },
      { tier:2, q:'A class of 25 has 16 girls. What percentage are boys?', a:'9/25 = 36%' },
      { tier:2, q:'A $120 shirt is discounted by 25%. Find the sale price.', a:'$90' },
      { tier:2, q:'Express 17 out of 40 as a percentage.', a:'42.5%' },
      { tier:3, q:'A mark of 56/80 on a test. Express as a percentage.', a:'70%' },
      { tier:3, q:'After a 15% discount a jacket costs $85. What was the original price?', a:'$100' },
      { tier:4, q:'The price of a phone increased by 10% then decreased by 10%. Is it back to the original? Show working.', a:'No. 100 × 1.1 × 0.9 = 99. It is 1% below original.' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Integers', skill: 'Adding and subtracting integers', vc: 'VC2M7N08',
    questions: [
      { tier:1, q:'Evaluate: 5 + (−3)', a:'2' },
      { tier:1, q:'Evaluate: −4 + 7', a:'3' },
      { tier:1, q:'Evaluate: −6 − 2', a:'−8' },
      { tier:1, q:'Evaluate: 3 − (−5)', a:'8' },
      { tier:1, q:'Evaluate: −8 + (−4)', a:'−12' },
      { tier:1, q:'Evaluate: 0 − (−7)', a:'7' },
      { tier:2, q:'The temperature is −6°C and rises by 10°C. New temperature?', a:'4°C' },
      { tier:2, q:'Evaluate: −15 + 8 − (−3)', a:'−4' },
      { tier:2, q:'A submarine at −80 m rises 45 m. New depth?', a:'−35 m' },
      { tier:2, q:'Find the difference between −12 and 8.', a:'20 (distance = |8−(−12)| = 20)' },
      { tier:3, q:'List all integers x where −3 ≤ x < 2.', a:'−3, −2, −1, 0, 1' },
      { tier:3, q:'Evaluate: −3 − (−8) + (−2) − 5', a:'−2' },
      { tier:4, q:'The sum of two integers is −5. Their difference is 11. Find both integers.', a:'3 and −8' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Ratios', skill: 'Ratios and their applications', vc: 'VC2M7N09',
    questions: [
      { tier:1, q:'Simplify ratio 12:16.', a:'3:4' },
      { tier:1, q:'Divide $60 in ratio 2:3.', a:'$24 and $36' },
      { tier:1, q:'Simplify 15:25:35.', a:'3:5:7' },
      { tier:1, q:'A fruit drink uses water and cordial in ratio 5:1. For 18 L, how much cordial?', a:'3 L' },
      { tier:2, q:'Three friends share $180 in ratio 2:3:4.', a:'$40, $60, $80' },
      { tier:2, q:'A 1:200 scale model is 8 cm long. How long is the real object?', a:'1600 cm = 16 m' },
      { tier:2, q:'The ratio of cats to dogs at a shelter is 5:3. There are 45 cats. How many dogs?', a:'27' },
      { tier:3, q:'Concrete is made from cement, sand and gravel in ratio 1:2:4. How much of each for 700 kg of concrete?', a:'100 kg cement, 200 kg sand, 400 kg gravel' },
      { tier:3, q:'Two numbers are in ratio 3:7. Their sum is 90. Find both numbers.', a:'27 and 63' },
      { tier:4, q:'A recipe serving 4 uses 1.5 cups of sugar. Adjust for 10 servings but halve the sugar ratio. How much sugar?', a:'Scale factor = 10/4 = 2.5. Half sugar: 1.5 × 2.5 × 0.5 = 1.875 cups' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Percentages and Ratios', skill: 'Mathematical modelling with rational numbers and percentages', vc: 'VC2M7N10',
    questions: [
      { tier:1, q:'Convert 3/4 to a percentage.', a:'75%' },
      { tier:1, q:'Convert 45% to a decimal.', a:'0.45' },
      { tier:1, q:'Convert 0.6 to a fraction.', a:'3/5' },
      { tier:2, q:'A savings account earns 4% interest per year. How much interest on $500 after 1 year?', a:'$20' },
      { tier:2, q:'Jeans cost $89.99. GST (10%) is added. Find the total price.', a:'$98.99' },
      { tier:2, q:'Order from smallest: 2/5, 38%, 0.41', a:'38%, 2/5 (=40%), 0.41' },
      { tier:3, q:'A property worth $350 000 increases in value by 8%. New value?', a:'$378 000' },
      { tier:3, q:'On a test, 85% of students passed. 306 passed. How many students altogether?', a:'360' },
      { tier:4, q:'Sarah spends 1/4 of her pay on rent, 30% on food, 15% on transport. She saves the rest. If she saves $310, what is her weekly pay?', a:'Saved: 1 − 0.25 − 0.30 − 0.15 = 0.30 = 30%. Pay = 310/0.30 ≈ $1033' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // ALGEBRA
  // ══════════════════════════════════════════════════════════════

  { year: '7', strand: 'Algebra', topic: 'Algebraic Expressions', skill: 'Variables, terms and expressions', vc: 'VC2M7A01',
    questions: [
      { tier:1, q:'Write an expression for: 5 more than x.', a:'x + 5' },
      { tier:1, q:'Write an expression for: 3 times a number n.', a:'3n' },
      { tier:1, q:'What is the coefficient of x in 7x − 3?', a:'7' },
      { tier:1, q:'How many terms in: 3x + 2y − 5?', a:'3' },
      { tier:1, q:'Identify the constant in: 4a − 7b + 9.', a:'9' },
      { tier:1, q:'Simplify: 4x + 3x', a:'7x' },
      { tier:1, q:'Simplify: 8m − 3m + 2m', a:'7m' },
      { tier:2, q:'Simplify: 3a + 4b − a + 2b', a:'2a + 6b' },
      { tier:2, q:'Simplify: 5x − 2y + 3x + y', a:'8x − y' },
      { tier:2, q:'If x = 3 and y = −2, evaluate 2x + 3y.', a:'2(3) + 3(−2) = 0' },
      { tier:2, q:'If a = 4, evaluate a² − 2a + 1.', a:'16 − 8 + 1 = 9' },
      { tier:3, q:'Simplify: 3(2x + 1) − 2(x − 4)', a:'6x + 3 − 2x + 8 = 4x + 11' },
      { tier:3, q:'The perimeter of a triangle is 3a + 2b + c. Find the perimeter when a=5, b=3, c=7.', a:'28' },
      { tier:4, q:'Show that (a+b)² − (a−b)² = 4ab.', a:'(a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b². Difference = 4ab ✓' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Algebraic Expressions', skill: 'Substitution into formulas', vc: 'VC2M7A01',
    questions: [
      { tier:1, q:'If n = 5, find 3n + 2.', a:'17' },
      { tier:1, q:'If x = −3, find x + 10.', a:'7' },
      { tier:1, q:'If a = 2, b = 3, find ab + b.', a:'9' },
      { tier:1, q:'Find A = lw when l = 8, w = 5.', a:'40' },
      { tier:1, q:'Find P = 2(l + w) when l = 6, w = 4.', a:'20' },
      { tier:2, q:'Find v = u + at when u = 0, a = 10, t = 5.', a:'50' },
      { tier:2, q:'If x = −2, evaluate x³ − x.', a:'−8 − (−2) = −6' },
      { tier:2, q:'Area of circle = πr². Find area when r = 7 (use π = 22/7).', a:'154' },
      { tier:3, q:'Find F = 9C/5 + 32 when C = 20.', a:'F = 68°F' },
      { tier:3, q:'Find the value of 2x² − 3x + 1 when x = −2.', a:'2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15' },
      { tier:4, q:'If E = ½mv², find E when m = 2.5 and v = 4.', a:'E = ½ × 2.5 × 16 = 20' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Solving simple linear equations', vc: 'VC2M7A02',
    questions: [
      { tier:1, q:'Solve: x + 5 = 12', a:'x = 7' },
      { tier:1, q:'Solve: 3x = 18', a:'x = 6' },
      { tier:1, q:'Solve: x − 4 = 9', a:'x = 13' },
      { tier:1, q:'Solve: x/3 = 7', a:'x = 21' },
      { tier:1, q:'Solve: 2x + 1 = 9', a:'x = 4' },
      { tier:2, q:'Solve: 5x − 3 = 12', a:'x = 3' },
      { tier:2, q:'Solve: 4(x + 1) = 20', a:'x = 4' },
      { tier:2, q:'Solve: x/4 + 2 = 5', a:'x = 12' },
      { tier:2, q:'A number is doubled and then 7 is added. The result is 21. Find the number.', a:'7' },
      { tier:3, q:'Solve: 3x + 4 = x + 12', a:'x = 4' },
      { tier:3, q:'The sum of three consecutive integers is 45. Find them.', a:'14, 15, 16' },
      { tier:4, q:'Solve: 2(3x − 1) = 4(x + 2)', a:'6x − 2 = 4x + 8, x = 5' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Writing and solving equations from worded problems', vc: 'VC2M7A03',
    questions: [
      { tier:1, q:'Write an equation: 5 more than a number is 17.', a:'n + 5 = 17' },
      { tier:1, q:'Write an equation: a number multiplied by 4 equals 36.', a:'4n = 36' },
      { tier:2, q:'Write and solve: twice a number minus 3 is 11.', a:'2n − 3 = 11, n = 7' },
      { tier:2, q:'A rectangle has perimeter 38 cm. The length is 5 more than the width. Find dimensions.', a:'2(w + w + 5) = 38, w = 7, l = 12' },
      { tier:2, q:'Tickets cost $8 each. Tom spends $40. Write and solve an equation for the number of tickets.', a:'8t = 40, t = 5' },
      { tier:3, q:'Maria has $x. She earns $25 more, then spends half. She has $40 left. Find x.', a:'(x + 25)/2 = 40, x = 55' },
      { tier:3, q:'A taxi charges $3 plus $2 per km. A ride costs $19. How far was the trip?', a:'3 + 2k = 19, k = 8 km' },
      { tier:4, q:'Four friends share the cost of a gift. If 2 more friends join, each pays $4 less. Find the total cost.', a:'C/4 − C/6 = 4, C = 48' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Patterns', skill: 'Sequences and number patterns', vc: 'VC2M7A03',
    questions: [
      { tier:1, q:'Find the next two terms: 5, 9, 13, 17, ___, ___', a:'21, 25' },
      { tier:1, q:'Find the next two terms: 2, 6, 18, 54, ___, ___', a:'162, 486' },
      { tier:1, q:'Find the rule for: 4, 7, 10, 13, ...', a:'Add 3 each time; T(n) = 3n + 1' },
      { tier:2, q:'Find the 8th term of the sequence 3, 7, 11, 15, ...', a:'T(8) = 3 + 7×4 = 31' },
      { tier:2, q:'A pattern has 1, 4, 9, 16, ... tiles in each stage. Describe the pattern.', a:'Square numbers: n²' },
      { tier:2, q:'What is the 10th term of: 100, 93, 86, 79, ...?', a:'T(10) = 100 + 9×(−7) = 37' },
      { tier:3, q:'How many matchsticks form n squares in a row? Find the rule.', a:'3n + 1' },
      { tier:4, q:'The nth term of a sequence is 4n − 3. Find n when the term is 97.', a:'4n − 3 = 97, n = 25' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Graphs', skill: 'Graphs from real-life data and tables of values', vc: 'VC2M7A04',
    questions: [
      { tier:1, q:'Plot the points (1,3), (2,5), (3,7) from the rule y = 2x + 1.', a:'Points lie on a straight line' },
      { tier:1, q:'What is the y-value when x = 4 for y = 3x − 2?', a:'10' },
      { tier:2, q:'A car travels at 60 km/h. Complete a table of distance vs time for t = 0,1,2,3,4.', a:'d: 0, 60, 120, 180, 240' },
      { tier:2, q:'What does a horizontal line on a distance-time graph mean?', a:'The object is stationary (not moving)' },
      { tier:3, q:'A mobile plan costs $20 + $0.10 per minute. Write a rule for total cost C after t minutes and plot for t = 0 to 50.', a:'C = 20 + 0.1t' },
      { tier:4, q:'Two taps fill a tank. Graph A fills at 15 L/min, Graph B at 10 L/min but starts 5 min later. When does the tank hold the same total from both (capacity = 200 L)?', a:'A: 200/15 ≈ 13.3 min. B: 200/10 = 20 + 5 = 25 min. They do not share the same "time for same level" — interpret as when both have emptied 200L.' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Graphs', skill: 'Cartesian plane and coordinates', vc: 'VC2M7A05',
    questions: [
      { tier:1, q:'Plot the point (−3, 4). Which quadrant?', a:'Quadrant II' },
      { tier:1, q:'What are the coordinates of the origin?', a:'(0, 0)' },
      { tier:1, q:'Which quadrant contains (−2, −5)?', a:'Quadrant III' },
      { tier:1, q:'Find the midpoint of (2, 4) and (6, 8).', a:'(4, 6)' },
      { tier:2, q:'Find the distance between (0, 0) and (3, 4).', a:'5 units' },
      { tier:2, q:'A shape has vertices (1,1), (5,1), (5,4), (1,4). Name the shape and find its area.', a:'Rectangle; 4 × 3 = 12 units²' },
      { tier:3, q:'Find the midpoint of (−3, 5) and (7, −1).', a:'(2, 2)' },
      { tier:4, q:'Triangle has vertices A(1,1), B(5,1), C(3,5). Find the area.', a:'Base = 4, height = 4, area = 8 units²' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Formulas', skill: 'Using and applying formulas', vc: 'VC2M7A06',
    questions: [
      { tier:1, q:'Find A = ½bh when b = 8, h = 5.', a:'20' },
      { tier:1, q:'Find C = 2πr when r = 7 (π = 22/7).', a:'44' },
      { tier:2, q:'Find the distance D = st when s = 80, t = 2.5.', a:'200 km' },
      { tier:2, q:'Rearrange D = st to find t.', a:'t = D/s' },
      { tier:3, q:'Find interest I = PRT/100 when P = 500, R = 4, T = 3.', a:'I = $60' },
      { tier:4, q:'Show that squaring both sides of s = √(2A/n) gives n = 2A/s².', a:'s² = 2A/n, ns² = 2A, n = 2A/s²' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // MEASUREMENT
  // ══════════════════════════════════════════════════════════════

  { year: '7', strand: 'Measurement', topic: 'Area and Perimeter', skill: 'Perimeter and area of triangles and rectangles', vc: 'VC2M7M01',
    questions: [
      { tier:1, q:'Find the perimeter of a rectangle 9 cm × 5 cm.', a:'28 cm' },
      { tier:1, q:'Find the area of a rectangle 7 m × 4 m.', a:'28 m²' },
      { tier:1, q:'Find the area of a triangle with base 10 cm, height 6 cm.', a:'30 cm²' },
      { tier:1, q:'Find the perimeter of an equilateral triangle with side 8 cm.', a:'24 cm' },
      { tier:1, q:'A square has side 9 m. Find its perimeter and area.', a:'Perimeter = 36 m; Area = 81 m²' },
      { tier:2, q:'Find the area of a parallelogram with base 12 cm, height 7 cm.', a:'84 cm²' },
      { tier:2, q:'A garden is 15 m × 8 m. Fencing costs $12/m. Find the total cost.', a:'Perimeter = 46 m; Cost = $552' },
      { tier:2, q:'Find the area of a trapezium with parallel sides 8 m and 12 m, height 5 m.', a:'50 m²' },
      { tier:3, q:'A right triangle has legs 6 cm and 8 cm. Find perimeter and area.', a:'Hypotenuse = 10 cm; P = 24 cm; A = 24 cm²' },
      { tier:3, q:'A kite has diagonals 10 cm and 6 cm. Find area.', a:'30 cm²' },
      { tier:4, q:'A rectangle has area 48 cm² and perimeter 28 cm. Find dimensions.', a:'2(l+w)=28, lw=48; l+w=14, lw=48; l and w are roots of x²−14x+48=0; (x−6)(x−8)=0; 6 cm × 8 cm' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Volume', skill: 'Volume of rectangular and triangular prisms', vc: 'VC2M7M02',
    questions: [
      { tier:1, q:'Find the volume of a rectangular prism: l=4, w=3, h=2 cm.', a:'24 cm³' },
      { tier:1, q:'Find the volume of a cube with side 5 m.', a:'125 m³' },
      { tier:1, q:'Find the volume of a triangular prism: triangle base 6, height 4 cm, length 10 cm.', a:'120 cm³' },
      { tier:2, q:'A box is 30 × 20 × 15 cm. Find its capacity in litres.', a:'9 L' },
      { tier:2, q:'A swimming pool 12 m × 4 m × 1.5 m deep. Find volume in kL.', a:'72 kL' },
      { tier:3, q:'A rectangular tank is 60 cm × 40 cm. Water is filled to 25 cm depth. Find volume in litres.', a:'60 L' },
      { tier:4, q:'Three cubes with sides 2, 3 and 4 cm are melted and recast into a single cube. Find the side length of the new cube.', a:'V = 8 + 27 + 64 = 99 cm³; s = ∛99 ≈ 4.63 cm' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Circles', skill: 'Circumference of circles', vc: 'VC2M7M03',
    questions: [
      { tier:1, q:'Find the circumference of a circle with radius 5 cm (π = 3.14).', a:'≈ 31.4 cm' },
      { tier:1, q:'Find the circumference of a circle with diameter 14 cm (π = 22/7).', a:'44 cm' },
      { tier:1, q:'Find the radius if the circumference is 62.8 cm.', a:'10 cm' },
      { tier:2, q:'A wheel has diameter 0.7 m. How many complete rotations to travel 100 m?', a:'100 ÷ (π × 0.7) ≈ 45.5 ≈ 45 rotations' },
      { tier:2, q:'Find the perimeter of a semicircle with diameter 8 cm.', a:'½ × π × 8 + 8 ≈ 12.57 + 8 = 20.57 cm' },
      { tier:3, q:'A circular track has outer radius 50 m, inner radius 40 m. How much longer is the outer lane? (1 lap)', a:'2π(50) − 2π(40) = 2π(10) ≈ 62.8 m' },
      { tier:4, q:'A semicircular window has a straight edge of 1.2 m. Find the perimeter of the window frame including the straight edge.', a:'½ × π × 1.2 + 1.2 ≈ 1.885 + 1.2 = 3.085 m' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Angles', skill: 'Angles in parallel lines and transversals', vc: 'VC2M7M04',
    questions: [
      { tier:1, q:'State the relationship between alternate angles.', a:'Equal when lines are parallel' },
      { tier:1, q:'State the relationship between co-interior angles.', a:'Add to 180° when lines are parallel' },
      { tier:1, q:'Find the alternate angle to 72°.', a:'72°' },
      { tier:1, q:'Find the co-interior angle to 65°.', a:'115°' },
      { tier:1, q:'Corresponding angles are _____ when lines are parallel.', a:'Equal' },
      { tier:2, q:'Find x if alternate angles are x° and 55°.', a:'x = 55°' },
      { tier:2, q:'Find x if co-interior angles are 3x + 10 and 2x + 5.', a:'5x + 15 = 180, x = 33°' },
      { tier:3, q:'Prove that when a transversal crosses parallel lines, alternate interior angles are equal.', a:'Corresponding angles equal (F shape); vertically opposite angles equal; so alternate angles = equal (Z shape)' },
      { tier:4, q:'Two parallel lines are cut by two transversals forming a triangle. The angles at the parallel lines are 65° and 75°. Find the apex angle of the triangle.', a:'180 − 65 − 75 = 40°' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Angles', skill: 'Interior angle sum of triangles and polygons', vc: 'VC2M7M05',
    questions: [
      { tier:1, q:'Find the missing angle in a triangle: 55°, 70°, ?', a:'55°' },
      { tier:1, q:'Find the missing angle in a triangle: 90°, 37°, ?', a:'53°' },
      { tier:1, q:'What is the interior angle sum of a quadrilateral?', a:'360°' },
      { tier:1, q:'An equilateral triangle has all angles equal to ___°.', a:'60°' },
      { tier:2, q:'Find the sum of interior angles of a pentagon.', a:'540°' },
      { tier:2, q:'Each interior angle of a regular polygon is 108°. How many sides?', a:'5 (pentagon)' },
      { tier:2, q:'Find x: triangle has angles 2x, 3x, 4x.', a:'9x = 180, x = 20°; angles 40°, 60°, 80°' },
      { tier:3, q:'A quadrilateral has angles 85°, 95°, 110°, x°. Find x.', a:'x = 70°' },
      { tier:3, q:'Find the exterior angle of a regular 9-gon.', a:'40°' },
      { tier:4, q:'Prove using parallel lines that the exterior angle of a triangle equals the sum of the two non-adjacent interior angles.', a:'Extend one side. Alternate angles + corresponding angles argument gives the result.' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Length and Units', skill: 'Units of length, area, volume and conversions', vc: 'VC2M7M06',
    questions: [
      { tier:1, q:'Convert 3.5 km to metres.', a:'3500 m' },
      { tier:1, q:'Convert 450 mm to cm.', a:'45 cm' },
      { tier:1, q:'Convert 2.4 m² to cm².', a:'24 000 cm²' },
      { tier:1, q:'Convert 5000 mL to litres.', a:'5 L' },
      { tier:2, q:'Convert 1.8 m³ to litres.', a:'1800 L' },
      { tier:2, q:'A container holds 750 cm³. Convert to mL and L.', a:'750 mL = 0.75 L' },
      { tier:3, q:'Express 2 km² in m².', a:'2 000 000 m²' },
      { tier:4, q:'A gold ring has volume 1.2 cm³ and mass 23.2 g. Find the density in g/cm³.', a:'Density = 23.2/1.2 ≈ 19.3 g/cm³' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // SPACE
  // ══════════════════════════════════════════════════════════════

  { year: '7', strand: 'Space', topic: '3D Objects', skill: 'Representing 3D objects in 2D', vc: 'VC2M7SP01',
    questions: [
      { tier:1, q:'Name a 3D shape with 6 faces, all rectangles.', a:'Rectangular prism (cuboid)' },
      { tier:1, q:'How many faces does a triangular prism have?', a:'5' },
      { tier:1, q:'What is a net?', a:'A 2D shape that folds to make a 3D object' },
      { tier:1, q:'How many edges does a cube have?', a:'12' },
      { tier:2, q:'Sketch the net of a square pyramid.', a:'One square base + 4 triangular faces' },
      { tier:2, q:'Apply Euler\’s formula to a pentagonal prism: F=7, E=15. Find V.', a:'V = 2 − F + E = 2 − 7 + 15 = 10' },
      { tier:3, q:'A box is 5 cm × 3 cm × 2 cm. Sketch two different nets.', a:'Multiple valid nets (11 different nets exist for a cuboid)' },
      { tier:4, q:'A triangular pyramid (tetrahedron) has 4 faces, 6 edges. Verify Euler\’s formula.', a:'V = 4 vertices; F+V−E = 4+4−6 = 2 ✓' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Triangles and Quadrilaterals', skill: 'Classifying triangles and quadrilaterals', vc: 'VC2M7SP02',
    questions: [
      { tier:1, q:'Name a triangle with all sides equal.', a:'Equilateral triangle' },
      { tier:1, q:'Name a quadrilateral with one pair of parallel sides.', a:'Trapezium' },
      { tier:1, q:'A scalene triangle has ___ equal sides.', a:'0' },
      { tier:1, q:'Name a triangle with a 90° angle.', a:'Right-angled triangle' },
      { tier:1, q:'Name all properties of a square.', a:'4 equal sides, 4 right angles, 2 pairs of parallel sides, diagonals bisect at right angles' },
      { tier:2, q:'A quadrilateral has 4 equal sides but no right angles. What is it?', a:'Rhombus' },
      { tier:2, q:'How many lines of symmetry does a rectangle have?', a:'2' },
      { tier:3, q:'Explain the difference between a parallelogram and a rhombus.', a:'A rhombus is a parallelogram with all sides equal; a parallelogram only has opposite sides equal' },
      { tier:4, q:'Prove that the diagonals of a rhombus bisect each other at right angles.', a:'Use congruent triangle argument: ΔAOB ≡ ΔAOD (SSS or SAS), so angle AOB = 90°.' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Transformations', skill: 'Reflections, rotations and translations', vc: 'VC2M7SP03',
    questions: [
      { tier:1, q:'Reflect point (3, 5) over the y-axis.', a:'(−3, 5)' },
      { tier:1, q:'Translate (2, −4) by (+3, +5).', a:'(5, 1)' },
      { tier:1, q:'Rotate (4, 0) by 90° anticlockwise about the origin.', a:'(0, 4)' },
      { tier:1, q:'Which transformation changes the size of a shape?', a:'Dilation/enlargement' },
      { tier:2, q:'Reflect triangle with vertices (1,2), (4,2), (2,5) over the x-axis.', a:'(1,−2), (4,−2), (2,−5)' },
      { tier:2, q:'What is the image of (a, b) when rotated 180° about the origin?', a:'(−a, −b)' },
      { tier:3, q:'A shape is translated then reflected. Is the final image congruent to the original?', a:'Yes — both transformations preserve shape and size' },
      { tier:4, q:'A point (3, 4) is reflected over the line y = x. Find the image.', a:'(4, 3)' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Transformations', skill: 'Enlargements and scale factors', vc: 'VC2M7SP03',
    questions: [
      { tier:1, q:'Enlarge point (2, 3) by scale factor 2 from the origin.', a:'(4, 6)' },
      { tier:1, q:'A triangle with sides 3, 4, 5 cm is enlarged by scale factor 3. Find new side lengths.', a:'9, 12, 15 cm' },
      { tier:2, q:'A photo 10 cm × 8 cm is enlarged to 25 cm × ? cm.', a:'20 cm' },
      { tier:2, q:'Two similar triangles have sides 6 and 9 cm. Find the scale factor.', a:'3/2 = 1.5' },
      { tier:3, q:'A shape is enlarged by scale factor 4. How many times bigger is the area?', a:'16 times (area scale factor = 4² = 16)' },
      { tier:4, q:'A model car at scale 1:24 is 15 cm long. How long is the real car in metres?', a:'15 × 24 = 360 cm = 3.6 m' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // STATISTICS
  // ══════════════════════════════════════════════════════════════

  { year: '7', strand: 'Statistics', topic: 'Data Collection', skill: 'Types of data and data collection', vc: 'VC2M7ST01',
    questions: [
      { tier:1, q:'Is "favourite colour" categorical or numerical data?', a:'Categorical' },
      { tier:1, q:'Is "height" discrete or continuous data?', a:'Continuous' },
      { tier:1, q:'Name two ways to collect data.', a:'Survey, observation, experiment, secondary sources' },
      { tier:2, q:'A researcher surveys 50 students from a school of 500. What type of sampling?', a:'Sample (systematic, random, or convenience depending on method)' },
      { tier:2, q:'Give an example of primary data collection.', a:'Conducting your own survey, measuring, observing directly' },
      { tier:3, q:'A researcher surveys students near the library at lunchtime. Identify the bias.', a:'Only students who use the library at lunchtime — not representative of all students' },
      { tier:4, q:'Design a survey question to find students\’ average daily screen time that avoids bias.', a:'Open-ended numeric question, no leading language; e.g. "How many hours per day do you use screens on average?"' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Representation', skill: 'Displaying data — column graphs, dot plots, stem-and-leaf', vc: 'VC2M7ST02',
    questions: [
      { tier:1, q:'What type of graph is best for comparing categories?', a:'Column (bar) graph' },
      { tier:1, q:'In a dot plot, what does each dot represent?', a:'One data value' },
      { tier:1, q:'In a stem-and-leaf plot: stem 5, leaf 3. What is the value?', a:'53' },
      { tier:2, q:'A stem-and-leaf has stems 4,5,6 with leaves: 4|2,5,8 5|1,3,6,9 6|0,4. List all values.', a:'42,45,48,51,53,56,59,60,64' },
      { tier:2, q:'What is the advantage of a dot plot over a bar graph?', a:'Shows individual data values; easy to see spread and clusters' },
      { tier:3, q:'Test scores: 72, 65, 88, 72, 91, 78, 65, 72. Create a stem-and-leaf plot.', a:'6|5,5 7|2,2,2,8 8|8 9|1' },
      { tier:4, q:'Describe the difference in distribution between these two sets: A: 70,72,74,76,78 vs B: 55,65,75,85,95. Both have same mean.', a:'A has small spread/range (8); B has large spread/range (40). A is clustered, B is spread out.' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Analysis', skill: 'Mean, median, mode and range', vc: 'VC2M7ST02',
    questions: [
      { tier:1, q:'Find the mean: 5, 8, 12, 7, 3', a:'7' },
      { tier:1, q:'Find the median: 4, 6, 8, 11, 15', a:'8' },
      { tier:1, q:'Find the mode: 3, 5, 7, 5, 9, 5, 3', a:'5' },
      { tier:1, q:'Find the range: 12, 7, 19, 4, 24', a:'20' },
      { tier:1, q:'Find the median: 3, 8, 5, 11, 6', a:'Sort: 3,5,6,8,11; Median = 6' },
      { tier:2, q:'Find the mean of: 3.5, 4.2, 6.8, 2.1, 5.4', a:'4.4' },
      { tier:2, q:'The mean of 6 numbers is 8. Five of the numbers are: 5, 9, 7, 10, 6. Find the sixth.', a:'Sum = 48; sixth = 11' },
      { tier:2, q:'A data set has no mode. What does this mean?', a:'All values appear the same number of times (no repeats)' },
      { tier:3, q:'Heights (cm): 152, 160, 155, 164, 158, 162, 155, 170. Find mean, median, mode, range.', a:'Mean = 159.5; Median = 159; Mode = 155; Range = 18' },
      { tier:3, q:'Adding a score of 100 to a set increases the mean by 4 and makes it a set of 6. Find the original mean.', a:'New mean = old mean + 4. New sum = 6×(old mean + 4). 100 is added as the 6th: so original sum + 100 = 6m+24 but 5m+100 = 6(m+4−4)... Let old mean = x, n=5. New mean = x+4 = (5x+100)/6, 6x+24 = 5x+100, x = 76.' },
      { tier:4, q:'A student needs a mean of at least 75 over 5 tests. First four scores: 68, 80, 72, 78. What minimum score is needed?', a:'Sum needed ≥ 375. So far: 298. Need ≥ 77.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // PROBABILITY
  // ══════════════════════════════════════════════════════════════

  { year: '7', strand: 'Probability', topic: 'Probability Basics', skill: 'Probability scale and listing outcomes', vc: 'VC2M7P01',
    questions: [
      { tier:1, q:'List all outcomes when rolling a standard die.', a:'{1, 2, 3, 4, 5, 6}' },
      { tier:1, q:'Find P(getting a 5 on a die).', a:'1/6' },
      { tier:1, q:'Find P(getting an even number on a die).', a:'1/2' },
      { tier:1, q:'A bag has 4 red and 6 blue marbles. P(red) = ?', a:'4/10 = 2/5' },
      { tier:1, q:'What probability means it is certain to happen?', a:'1' },
      { tier:1, q:'Find P(head) when flipping a fair coin.', a:'1/2' },
      { tier:2, q:'List all outcomes when flipping 2 coins.', a:'{HH, HT, TH, TT}' },
      { tier:2, q:'Find P(at least one head) when flipping 2 coins.', a:'3/4' },
      { tier:2, q:'A spinner has equal sections: 1,1,2,3,3,3. Find P(3).', a:'3/6 = 1/2' },
      { tier:3, q:'From cards 1−10, P(multiple of 3 or 4)?', a:'{3,4,6,8,9,12} — only up to 10: {3,4,6,8,9} = 5/10 = 1/2' },
      { tier:3, q:'A card is drawn from a standard deck (52 cards). Find P(king or red).', a:'P(K) + P(red) − P(red K) = 4/52 + 26/52 − 2/52 = 28/52 = 7/13' },
      { tier:4, q:'A biased die: P(6) = 1/4, other faces equally likely. Find P(not 6).', a:'P(not 6) = 3/4; P(each other) = (3/4)/5 = 3/20' },
    ]
  },

  { year: '7', strand: 'Probability', topic: 'Probability Experiments', skill: 'Conducting chance experiments and comparing results', vc: 'VC2M7P02',
    questions: [
      { tier:1, q:'A coin is flipped 20 times and lands heads 12 times. Find the experimental probability.', a:'12/20 = 3/5' },
      { tier:1, q:'Theoretical P(head) = 0.5. If 100 flips, how many heads expected?', a:'50' },
      { tier:2, q:'A die is rolled 60 times. Expected frequency of 3?', a:'10' },
      { tier:2, q:'Why might experimental results differ from theoretical probability?', a:'Chance variation; small sample sizes lead to greater differences' },
      { tier:2, q:'A drawing pin lands point-up 37 times in 80 trials. Experimental P(point-up)?', a:'37/80' },
      { tier:3, q:'In 200 trials a number cube showed: 1→36, 2→28, 3→38, 4→32, 5→30, 6→36. Is the cube likely fair?', a:'Expected each: 33.3. Results reasonably close — likely fair, though 2 is slightly low.' },
      { tier:3, q:'How many trials would make experimental results more reliable?', a:'More trials → closer to theoretical probability; typically 100+ gives reasonable estimates' },
      { tier:4, q:'Explain why P(rolling a 6) on a fair die remains 1/6 regardless of previous rolls.', a:'Dice have no memory — each roll is independent.' },
    ]
  },

  // ── EXTRA NUMBER ────────────────────────────────────────────

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Order of operations (BODMAS)', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Evaluate: 3 + 4 × 2', a:'11' },
      { tier:1, q:'Evaluate: (3 + 4) × 2', a:'14' },
      { tier:1, q:'Evaluate: 20 ÷ 4 + 3', a:'8' },
      { tier:1, q:'Evaluate: 18 − 3 × 5', a:'3' },
      { tier:1, q:'Evaluate: 4² − 6 ÷ 2', a:'13' },
      { tier:1, q:'Evaluate: √25 + 3 × 4', a:'17' },
      { tier:2, q:'Evaluate: 3 + 4² ÷ 2 − 1', a:'3 + 8 − 1 = 10' },
      { tier:2, q:'Evaluate: (5 + 3)² ÷ 16', a:'64/16 = 4' },
      { tier:2, q:'Evaluate: 2 × 3² + 4 ÷ 2', a:'18 + 2 = 20' },
      { tier:2, q:'Insert brackets to make true: 5 + 3 × 4 = 32', a:'(5 + 3) × 4 = 32' },
      { tier:3, q:'Evaluate: 4 × (3 + 2)² − √16 ÷ 2', a:'4 × 25 − 2 = 98' },
      { tier:3, q:'Is this correct: 2 + 3 × 4 = 20? Explain.', a:'No. By BODMAS: 2 + 12 = 14. Need brackets: (2+3) × 4 = 20.' },
      { tier:4, q:'Find the value: √(3² + 4²) × (5 − 2)² ÷ 9', a:'√25 × 9 ÷ 9 = 5 × 1 = 5' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Divisibility rules and number properties', vc: 'VC2M7N02',
    questions: [
      { tier:1, q:'Is 324 divisible by 4?', a:'Yes (last two digits 24 ÷ 4 = 6)' },
      { tier:1, q:'Is 7452 divisible by 3?', a:'Yes (7+4+5+2 = 18, divisible by 3)' },
      { tier:1, q:'Is 1560 divisible by 9?', a:'No (1+5+6+0 = 12, not divisible by 9)' },
      { tier:1, q:'Is 845 divisible by 5?', a:'Yes (ends in 5)' },
      { tier:2, q:'Find the smallest number greater than 100 divisible by both 6 and 8.', a:'LCM(6,8) = 24. Multiples: 24,48,72,96,120 → 120' },
      { tier:2, q:'Is 2 310 divisible by 6? Show working.', a:'Yes: even (div by 2) and 2+3+1+0=6 (div by 3)' },
      { tier:3, q:'A number is divisible by both 4 and 6. Must it be divisible by 24?', a:'No. Must be divisible by LCM(4,6) = 12. e.g. 12 is divisible by 4 and 6 but not 24.' },
      { tier:4, q:'Find all 3-digit multiples of 7 that are also perfect squares.', a:'Perfect squares between 100-999: 100,121,144,...961. Divisible by 7: 196 (=7×28), 441 (=7×63), 784 (=7×112)' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Fractions and Decimals', skill: 'Fraction-decimal-percentage conversions', vc: 'VC2M7N10',
    questions: [
      { tier:1, q:'Convert 1/5 to a decimal.', a:'0.2' },
      { tier:1, q:'Convert 0.75 to a fraction.', a:'3/4' },
      { tier:1, q:'Convert 30% to a fraction.', a:'3/10' },
      { tier:1, q:'Convert 0.08 to a percentage.', a:'8%' },
      { tier:1, q:'Convert 2/5 to a percentage.', a:'40%' },
      { tier:1, q:'Which is the largest: 0.6, 3/5, 61%?', a:'61% = 0.61 > 0.6 = 3/5, so 61%' },
      { tier:2, q:'Order from smallest to largest: 3/8, 0.4, 37%', a:'37% = 0.37 < 3/8 = 0.375 < 0.4' },
      { tier:2, q:'Convert 1 3/8 to a decimal.', a:'1.375' },
      { tier:3, q:'Which is between 0.3 and 0.4: 2/7, 3/8, 1/3?', a:'2/7≈0.286 (no), 3/8=0.375 (yes), 1/3≈0.333 (yes). Both 3/8 and 1/3.' },
      { tier:4, q:'A fraction has the same digits when written as a decimal: 0.abcabc... Find the fraction if the decimal is 0.142857142857...', a:'1/7' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Integers', skill: 'Comparing and ordering integers', vc: 'VC2M7N08',
    questions: [
      { tier:1, q:'Which is smaller: −8 or −3?', a:'−8' },
      { tier:1, q:'Order from smallest: 5, −2, 0, −7, 3', a:'−7, −2, 0, 3, 5' },
      { tier:1, q:'Write a number between −4 and −1.', a:'Any of: −3, −2' },
      { tier:2, q:'Write the integers from −3 to 3.', a:'−3, −2, −1, 0, 1, 2, 3' },
      { tier:2, q:'The highest point is 420 m, lowest is −85 m below sea level. What is the total height difference?', a:'505 m' },
      { tier:3, q:'Put in order: −1/2, −0.6, −3/5, −0.55', a:'−0.6, −3/5, −0.55, −1/2' },
    ]
  },

  // ── EXTRA ALGEBRA ──────────────────────────────────────────

  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Checking solutions and inverse operations', vc: 'VC2M7A02',
    questions: [
      { tier:1, q:'Check if x = 4 is a solution to 3x − 2 = 10.', a:'3(4)−2 = 10 ✓' },
      { tier:1, q:'What inverse operation undoes multiplication by 5?', a:'Division by 5' },
      { tier:1, q:'Solve using inverse operations: 2x + 5 = 13', a:'x = 4' },
      { tier:2, q:'Check if x = −3 is a solution to x² − x = 12.', a:'9−(−3) = 12 ✓' },
      { tier:2, q:'Solve: 3(x − 2) = 9', a:'x = 5' },
      { tier:2, q:'Solve: x/5 − 3 = 1', a:'x = 20' },
      { tier:3, q:'Solve and check: 5x + 2 = 3x + 10', a:'2x = 8, x = 4; check: 22 = 22 ✓' },
      { tier:4, q:'Find x if x + 1/x = 5/2.', a:'Multiply by 2x: 2x² + 2 = 5x, 2x²−5x+2=0, (2x−1)(x−2)=0, x=1/2 or x=2' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Patterns', skill: 'Geometric growing patterns', vc: 'VC2M7A03',
    questions: [
      { tier:1, q:'A pattern grows: 3, 6, 9, 12, ... What is the rule?', a:'Multiply position by 3 (T(n) = 3n)' },
      { tier:1, q:'How many dots in the 5th term if the pattern is 2, 5, 8, 11, ...?', a:'14' },
      { tier:2, q:'Triangular numbers: 1, 3, 6, 10, 15, ... Find the 8th triangular number.', a:'36' },
      { tier:2, q:'A pattern of squares: stage 1 = 1, stage 2 = 4, stage 3 = 9. What is stage 10?', a:'100' },
      { tier:3, q:'Each stage adds a row of 2 more tiles than previous row. Stage 1 has 1 tile. Find stage 5.', a:'1+3+5+7+9 = 25 = 5²' },
      { tier:4, q:'Show that the sum of the first n odd numbers equals n².', a:'1+3+5+...+(2n−1) = n². Proof by pattern or induction.' },
    ]
  },

  // ── EXTRA MEASUREMENT ──────────────────────────────────────

  { year: '7', strand: 'Measurement', topic: 'Area and Perimeter', skill: 'Composite area problems', vc: 'VC2M7M01',
    questions: [
      { tier:1, q:'A square has side 6 cm. Find its area.', a:'36 cm²' },
      { tier:1, q:'An L-shape: 8×6 cm rectangle with 3×2 cm removed from corner. Find area.', a:'48 − 6 = 42 cm²' },
      { tier:2, q:'A rectangle 12×8 cm has a square hole of side 3 cm. Find remaining area.', a:'96 − 9 = 87 cm²' },
      { tier:2, q:'A right trapezium has parallel sides 5 cm and 9 cm, height 4 cm. Area?', a:'½(5+9)×4 = 28 cm²' },
      { tier:3, q:'A shaded region consists of a 10×6 m rectangle with a triangle (base 6, height 4 m) removed. Find shaded area.', a:'60 − 12 = 48 m²' },
      { tier:3, q:'A shape has a semicircle of diameter 8 cm on top of a rectangle 8×5 cm. Find total area.', a:'40 + ½π×16 ≈ 40 + 25.1 = 65.1 cm²' },
      { tier:4, q:'A running track is made of a rectangle 100 m × 60 m with semicircles on each short end. Find total area enclosed by the track.', a:'Rectangle: 6000 m². Two semicircles = full circle with d=60: π×30² ≈ 2827 m². Total ≈ 8827 m²' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Time', skill: 'Time calculations and 24-hour time', vc: 'VC2M7M06',
    questions: [
      { tier:1, q:'Convert 2:30 pm to 24-hour time.', a:'14:30' },
      { tier:1, q:'Convert 08:45 to 12-hour time.', a:'8:45 am' },
      { tier:1, q:'How many minutes from 9:15 am to 11:50 am?', a:'155 minutes' },
      { tier:2, q:'A train departs at 13:27 and arrives at 16:05. How long is the journey?', a:'2 hours 38 minutes' },
      { tier:2, q:'A 3-hour film starts at 7:45 pm. When does it finish?', a:'10:45 pm' },
      { tier:3, q:'A car trip takes 4 h 35 min at 80 km/h. How far was the trip?', a:'D = 80 × 4.583 ≈ 366.7 km' },
      { tier:4, q:'A recipe takes 1 h 25 min prep and 2 h 40 min cooking. If guests arrive at 7:00 pm, when must you start?', a:'Total: 4 h 5 min before 7pm = 2:55 pm' },
    ]
  },

  // ── EXTRA SPACE ────────────────────────────────────────────

  { year: '7', strand: 'Space', topic: 'Triangles and Quadrilaterals', skill: 'Angle properties of triangles and quadrilaterals', vc: 'VC2M7SP02',
    questions: [
      { tier:1, q:'An isosceles triangle has a base angle of 50°. Find all angles.', a:'50°, 50°, 80°' },
      { tier:1, q:'Find x: angles in a triangle are 3x, 4x, 2x.', a:'9x = 180, x = 20°' },
      { tier:1, q:'Find the fourth angle of a quadrilateral: 90°, 85°, 100°.', a:'85°' },
      { tier:2, q:'Find the value of each interior angle of a regular hexagon.', a:'120°' },
      { tier:2, q:'An exterior angle of a triangle is 115°. One opposite interior angle is 60°. Find the other.', a:'55°' },
      { tier:2, q:'Find x in a triangle with angles x+10, 2x−5, and 40°.', a:'x+10+2x−5+40=180, 3x=135, x=45°' },
      { tier:3, q:'ABCD is a rhombus with angle A = 70°. Find all angles.', a:'A=70°, B=110°, C=70°, D=110°' },
      { tier:4, q:'Prove that the base angles of an isosceles triangle are equal, using the angle sum of a triangle.', a:'Let equal angles = x. Then x + x + apex = 180. No formal proof yet — need congruence. Suggest drawing altitude and using SAS.' },
    ]
  },

  { year: '7', strand: 'Space', topic: '3D Objects', skill: 'Surface area of rectangular prisms', vc: 'VC2M7SP01',
    questions: [
      { tier:1, q:'Find the surface area of a cube with side 3 cm.', a:'6 × 9 = 54 cm²' },
      { tier:2, q:'Find the surface area of a rectangular prism 5 × 4 × 3 cm.', a:'2(20 + 15 + 12) = 94 cm²' },
      { tier:2, q:'A cereal box is 25 × 8 × 35 cm. Find the total surface area.', a:'2(200 + 875 + 280) = 2710 cm²' },
      { tier:3, q:'A fish tank (open top) is 40 × 20 × 25 cm. Find the area of glass needed.', a:'Base + 4 sides: 800 + 2(1000) + 2(500) = 3800 cm²' },
      { tier:4, q:'A cube of surface area 150 cm² is painted on all faces. It is then cut into 27 equal smaller cubes. How many small cubes have exactly 2 painted faces?', a:'12 (the edge cubes, excluding corners)' },
    ]
  },

  // ── EXTRA STATISTICS ──────────────────────────────────────

  { year: '7', strand: 'Statistics', topic: 'Data Representation', skill: 'Frequency tables and histograms', vc: 'VC2M7ST02',
    questions: [
      { tier:1, q:'What does a frequency table show?', a:'How often each value (or class) appears in a data set' },
      { tier:1, q:'Complete: scores 3,5,3,4,5,5,3. Fill frequency table for 3, 4, 5.', a:'3:×3, 4:×1, 5:×3' },
      { tier:2, q:'A histogram shows: 0-10: 5, 10-20: 12, 20-30: 8. How many data values total?', a:'25' },
      { tier:2, q:'What is a class interval?', a:'A range of values grouped together in a frequency table or histogram' },
      { tier:3, q:'Describe a positively skewed distribution.', a:'Most values are low with a few very large values pulling the tail to the right' },
      { tier:3, q:'Explain the difference between a bar graph and a histogram.', a:'Bar graph: categorical data, gaps between bars. Histogram: continuous numerical data, no gaps.' },
      { tier:4, q:'20 students\’ scores: 45,52,58,61,65,67,70,72,73,74,75,76,77,78,80,82,84,88,91,95. Construct a frequency table with class intervals 40-59, 60-79, 80-99.', a:'40-59: 3; 60-79: 11; 80-99: 6' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Analysis', skill: 'Choosing measures of centre', vc: 'VC2M7ST02',
    questions: [
      { tier:2, q:'House prices: $450K, $480K, $500K, $520K, $1.8M. Which average best represents typical price?', a:'Median ($500K) — mean is pulled up by the outlier' },
      { tier:2, q:'Shoe sizes: 38, 40, 40, 42, 40. Which measure is most useful for a shoe shop?', a:'Mode (40) — most common size to stock' },
      { tier:3, q:'When is the mean the best measure of centre?', a:'When data is roughly symmetric and has no outliers' },
      { tier:3, q:'A class of 30 students scored a mean of 72. One student\’s score is not counted. The new mean is 73. Find the uncounted score.', a:'Total = 2160. New total = 29 × 73 = 2117. Missing = 43' },
      { tier:4, q:'Scores: 5, 8, x, 12, 15, 18. The mean is 11. Find x and determine if it\’s the median too.', a:'Sum = 66, 5+8+x+12+15+18=66, x=8. Sorted: 5,8,8,12,15,18. Median = (8+12)/2 = 10 ≠ 11.' },
    ]
  },

  // ── EXTRA PROBABILITY ────────────────────────────────────

  { year: '7', strand: 'Probability', topic: 'Probability Basics', skill: 'Probability with tables and Venn diagrams', vc: 'VC2M7P01',
    questions: [
      { tier:2, q:'List all outcomes when rolling two dice. How many outcomes in total?', a:'36 outcomes (6 × 6)' },
      { tier:2, q:'Find P(sum = 8) when rolling two dice.', a:'5/36 (pairs: (2,6),(3,5),(4,4),(5,3),(6,2))' },
      { tier:2, q:'Find P(sum > 9) when rolling two dice.', a:'6/36 = 1/6 (pairs: (4,6),(5,5),(6,4),(5,6),(6,5),(6,6))' },
      { tier:3, q:'A Venn diagram: A has 8, B has 6, both have 3, neither 5. Total = 22. Find P(A only).', a:'5/22' },
      { tier:3, q:'Find P(getting a prime or a multiple of 3) on a die.', a:'Primes: 2,3,5; Mult of 3: 3,6; Union: 2,3,5,6 = 4/6 = 2/3' },
      { tier:4, q:'Cards numbered 1-20. Find P(multiple of 3 and multiple of 4).', a:'Multiples of 12 up to 20: {12}. P = 1/20' },
    ]
  },

  { year: '7', strand: 'Probability', topic: 'Probability Experiments', skill: 'Simulations and relative frequency', vc: 'VC2M7P02',
    questions: [
      { tier:2, q:'A spinner with 4 equal sections is spun 200 times. Section 1 lands 56 times. Is this surprising?', a:'Expected: 50. 56 is slightly higher — within normal variation, not surprising.' },
      { tier:2, q:'What is the Law of Large Numbers?', a:'As the number of trials increases, experimental probability gets closer to theoretical probability.' },
      { tier:3, q:'How could you simulate rolling a die using a computer?', a:'Generate random integers from 1 to 6 using a random number generator' },
      { tier:4, q:'In a bag with 5 red and 3 blue balls (unknown at start), you draw 20 times with replacement: 14 red, 6 blue. Estimate the composition of the bag.', a:'Estimated P(red) ≈ 14/20 = 0.7 ≈ 7/10 of bag is red. If 8 balls total, ≈ 5-6 red.' },
    ]
  },


  // ── MORE NUMBER ────────────────────────────────────────────

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Mental strategies for multiplication and division', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Calculate: 25 × 4', a:'100' },
      { tier:1, q:'Calculate: 24 × 5', a:'120' },
      { tier:1, q:'Calculate: 360 ÷ 9', a:'40' },
      { tier:1, q:'Calculate: 48 × 25', a:'1200 (48 × 25 = 48 × 100/4 = 1200)' },
      { tier:1, q:'Calculate: 720 ÷ 8', a:'90' },
      { tier:1, q:'Calculate: 15 × 12', a:'180' },
      { tier:2, q:'Calculate: 35 × 14 using the split strategy.', a:'35 × 10 + 35 × 4 = 350 + 140 = 490' },
      { tier:2, q:'Calculate: 156 × 4', a:'624' },
      { tier:2, q:'Calculate: 504 ÷ 7', a:'72' },
      { tier:3, q:'Estimate then calculate: 47 × 53', a:'Estimate: 50 × 50 = 2500. Actual: 2491' },
      { tier:3, q:'Use the difference of squares: 49 × 51 = ?', a:'(50−1)(50+1) = 50² − 1 = 2499' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Decimals', skill: 'Adding and subtracting decimals', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Calculate: 3.7 + 2.4', a:'6.1' },
      { tier:1, q:'Calculate: 8.5 − 3.2', a:'5.3' },
      { tier:1, q:'Calculate: 4.67 + 1.34', a:'6.01' },
      { tier:1, q:'Calculate: 10.0 − 4.37', a:'5.63' },
      { tier:1, q:'Calculate: 0.8 + 0.35 + 0.127', a:'1.277' },
      { tier:2, q:'A shop has items costing $3.45, $7.20, and $1.99. Find the total.', a:'$12.64' },
      { tier:2, q:'Change from $50 for a purchase of $37.85.', a:'$12.15' },
      { tier:3, q:'Arrange to sum 1.0: pick some of 0.3, 0.25, 0.125, 0.2, 0.15, 0.175.', a:'e.g. 0.3 + 0.25 + 0.2 + 0.15 + 0.1 = 1.0' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Decimals', skill: 'Multiplying and dividing decimals', vc: 'VC2M7N05',
    questions: [
      { tier:1, q:'Calculate: 0.3 × 0.5', a:'0.15' },
      { tier:1, q:'Calculate: 1.2 × 4', a:'4.8' },
      { tier:1, q:'Calculate: 0.48 ÷ 0.6', a:'0.8' },
      { tier:1, q:'Calculate: 3.6 ÷ 4', a:'0.9' },
      { tier:2, q:'A ribbon is 5.4 m long. Cut into 0.3 m pieces. How many pieces?', a:'18' },
      { tier:2, q:'7 books each cost $8.95. Total cost?', a:'$62.65' },
      { tier:3, q:'A car uses 0.085 L/km. How much fuel for a 240 km trip?', a:'20.4 L' },
      { tier:4, q:'0.1 × 0.1 × 0.1 = ?', a:'0.001' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Fractions', skill: 'Adding and subtracting fractions', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Calculate: 1/3 + 1/4', a:'7/12' },
      { tier:1, q:'Calculate: 5/8 − 1/4', a:'3/8' },
      { tier:1, q:'Calculate: 2/5 + 3/10', a:'7/10' },
      { tier:1, q:'Calculate: 7/9 − 1/3', a:'4/9' },
      { tier:1, q:'Calculate: 1 1/2 + 2 1/4', a:'3 3/4' },
      { tier:2, q:'Calculate: 3 3/4 − 1 5/8', a:'2 1/8' },
      { tier:2, q:'A plank is 3 1/2 m. Pieces of 1 1/4 m and 3/4 m are cut. How much remains?', a:'1 1/2 m' },
      { tier:3, q:'Calculate: 2 1/3 + 4 3/4 − 1 5/6', a:'LCM=12: 28/12 + 57/12 − 22/12 = 63/12 = 5 1/4' },
      { tier:4, q:'Find the sum of the first 4 unit fractions: 1 + 1/2 + 1/3 + 1/4', a:'25/12 = 2 1/12' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Financial Maths', skill: 'Profit, loss and discounts', vc: 'VC2M7N10',
    questions: [
      { tier:1, q:'An item bought for $40 is sold for $52. Find the profit.', a:'$12' },
      { tier:1, q:'A $90 item is on 20% discount. Find the discount and sale price.', a:'$18 discount; $72 sale price' },
      { tier:2, q:'A phone bought for $300 is sold for $255. Find the percentage loss.', a:'15% loss' },
      { tier:2, q:'After a 30% discount a dress costs $63. Find the original price.', a:'$90' },
      { tier:3, q:'A market stallholder sells tomatoes at $3/kg, bought at $1.20/kg. Profit on 25 kg?', a:'Profit per kg: $1.80 × 25 = $45' },
      { tier:4, q:'A shopkeeper adds 40% markup and then offers 20% off. Is there still a profit? By what %?', a:'Final = 1.4 × 0.8 = 1.12. Yes, 12% profit.' },
    ]
  },

  // ── MORE ALGEBRA ──────────────────────────────────────────

  { year: '7', strand: 'Algebra', topic: 'Algebraic Expressions', skill: 'Expanding and simplifying', vc: 'VC2M7A01',
    questions: [
      { tier:1, q:'Expand: 2(x + 3)', a:'2x + 6' },
      { tier:1, q:'Expand: 5(2a − 4)', a:'10a − 20' },
      { tier:1, q:'Expand: −3(x + 2)', a:'−3x − 6' },
      { tier:2, q:'Expand and simplify: 2(x + 4) + 3(x − 1)', a:'5x + 5' },
      { tier:2, q:'Expand and simplify: 4(2m + 1) − 2(m + 3)', a:'6m − 2' },
      { tier:3, q:'Expand: −(3x − 2y + 5)', a:'−3x + 2y − 5' },
      { tier:3, q:'Factorise: 6x + 15', a:'3(2x + 5)' },
      { tier:4, q:'Expand and simplify: (x + 3)(x + 2)', a:'x² + 5x + 6' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Inequalities', skill: 'Simple inequalities and number lines', vc: 'VC2M7A02',
    questions: [
      { tier:1, q:'Write the inequality: x is less than 5.', a:'x < 5' },
      { tier:1, q:'Is x = 3 a solution to x + 2 < 8?', a:'Yes (5 < 8)' },
      { tier:1, q:'Write all integers satisfying x ≤ 4 and x > 1.', a:'2, 3, 4' },
      { tier:2, q:'Solve: x + 3 > 7', a:'x > 4' },
      { tier:2, q:'Solve: 3x ≤ 15', a:'x ≤ 5' },
      { tier:3, q:'Describe on a number line: −2 < x ≤ 3', a:'Open circle at −2, closed circle at 3, line between' },
      { tier:4, q:'Find integer values of x: 2x + 1 > 5 and x < 7.', a:'2x > 4, x > 2 and x < 7; integers: 3, 4, 5, 6' },
    ]
  },

  // ── MORE MEASUREMENT ────────────────────────────────────

  { year: '7', strand: 'Measurement', topic: 'Volume', skill: 'Volume problem solving', vc: 'VC2M7M02',
    questions: [
      { tier:2, q:'A cube has volume 343 cm³. Find its side length.', a:'7 cm (∛343 = 7)' },
      { tier:2, q:'A rectangular prism has volume 360 cm³, length 10 cm, width 6 cm. Find height.', a:'6 cm' },
      { tier:3, q:'How many 2 × 2 × 2 cm cubes fit in a box 10 × 8 × 6 cm?', a:'(10/2) × (8/2) × (6/2) = 5 × 4 × 3 = 60' },
      { tier:3, q:'Water fills a 30 × 20 × ? cm tank to 15 L. Find the height.', a:'15 000 cm³ = 30 × 20 × h, h = 25 cm' },
      { tier:4, q:'A box of volume 480 cm³ has dimensions in ratio 1:2:3. Find the dimensions.', a:'V = x × 2x × 3x = 6x³ = 480, x³ = 80, x ≈ 4.31; dims ≈ 4.31 × 8.62 × 12.93 cm' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Angles', skill: 'Types of angles and angle relationships', vc: 'VC2M7M04',
    questions: [
      { tier:1, q:'Name the angle type: 145°', a:'Obtuse angle' },
      { tier:1, q:'Name the angle type: 90°', a:'Right angle' },
      { tier:1, q:'Find the supplement of 72°.', a:'108°' },
      { tier:1, q:'Find the complement of 35°.', a:'55°' },
      { tier:1, q:'Vertically opposite angles are _____.', a:'Equal' },
      { tier:1, q:'Two angles on a straight line sum to ___°.', a:'180°' },
      { tier:2, q:'Find x if 3x and 2x are supplementary.', a:'5x = 180, x = 36°' },
      { tier:2, q:'Find x if x + 15 and 3x − 5 are complementary.', a:'4x + 10 = 90, x = 20°' },
      { tier:3, q:'Four angles around a point: 90°, 120°, 85°, x°. Find x.', a:'x = 65°' },
      { tier:4, q:'Two straight lines cross. One angle is 3x + 10 and its vertically opposite is 5x − 30. Find x and all four angles.', a:'3x+10=5x−30, 2x=40, x=20. Angles: 70°, 110°, 70°, 110°.' },
    ]
  },

  // ── MORE SPACE ────────────────────────────────────────────

  { year: '7', strand: 'Space', topic: 'Triangles and Quadrilaterals', skill: 'Drawing and constructing geometric shapes', vc: 'VC2M7SP02',
    questions: [
      { tier:1, q:'How do you construct a perpendicular bisector?', a:'Open compass to more than half the line length; draw arcs from each end; join intersections.' },
      { tier:2, q:'What equipment is used to accurately construct angles?', a:'Protractor and ruler, or compass' },
      { tier:2, q:'Describe how to construct a 60° angle.', a:'Draw an arc from the vertex; mark where it crosses the arms; the equilateral triangle gives 60°.' },
      { tier:3, q:'Explain why all triangles with a 90° angle and hypotenuse 10 cm lie on a semicircle.', a:'By Thales\’ theorem: the right angle is subtended by a diameter, so the vertex lies on the circle.' },
      { tier:4, q:'Using only a ruler and compass, construct a 45° angle. Describe each step.', a:'Construct 90° (perpendicular), then bisect it to get 45°.' },
    ]
  },

  // ── MORE STATISTICS ──────────────────────────────────────

  { year: '7', strand: 'Statistics', topic: 'Data Collection', skill: 'Surveys and questionnaires', vc: 'VC2M7ST01',
    questions: [
      { tier:1, q:'What is the difference between a survey and an experiment?', a:'Survey: asks questions/observes. Experiment: manipulates variables to test cause and effect.' },
      { tier:2, q:'Give an example of a biased survey question.', a:'e.g. "Don\’t you think homework is too much?" — leads respondent toward yes.' },
      { tier:2, q:'What is a census?', a:'A survey that includes every member of a population.' },
      { tier:3, q:'You want to find the favourite sport of Year 7 students. Describe a fair sampling method.', a:'Random sample: put all names in a hat and draw 30, or use a random number generator.' },
      { tier:4, q:'A survey asks "Do you prefer pizza or pasta?" but 40% of respondents are Italian. Is the sample likely representative? Why?', a:'No — the sample is biased toward Italian cuisine; results would not represent the whole population.' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Analysis', skill: 'Comparing data sets', vc: 'VC2M7ST02',
    questions: [
      { tier:2, q:'Class A mean = 72, range = 30. Class B mean = 72, range = 8. Which class is more consistent?', a:'Class B (smaller range = more consistent)' },
      { tier:2, q:'What does it mean if two groups have the same median but different ranges?', a:'Same middle value but one group is more spread out.' },
      { tier:3, q:'Back-to-back stem-and-leaf: A: 7|3 8|2,5 9|1. B: 7|6 8|0,4 9|3,7. Compare the two groups.', a:'A: min 73, max 91. B: min 76, max 97. B has higher values overall.' },
      { tier:4, q:'City A average temperatures: 22,25,28,32,29,26,23,21,18,16,19,21. City B: 15,17,20,24,27,29,30,30,26,22,18,16. Compare mean and range.', a:'A: mean≈23.3, range=16. B: mean≈22.8, range=15. Similar means, A slightly higher, similar range.' },
    ]
  },


  { year: '7', strand: 'Number', topic: 'Percentages', skill: 'Percentage applications', vc: 'VC2M7N07',
    questions: [
      { tier:1, q:'Find 10% of 850.', a:'85' },
      { tier:1, q:'Find 25% of 160.', a:'40' },
      { tier:1, q:'Find 1% of 2400.', a:'24' },
      { tier:1, q:'Find 75% of 48.', a:'36' },
      { tier:2, q:'A TV normally $800 is 15% off. Sale price?', a:'$680' },
      { tier:2, q:'A wage of $750/week increases by 4%. New wage?', a:'$780' },
      { tier:2, q:'What is 0.5% of 6000?', a:'30' },
      { tier:3, q:'In a class of 32, 75% passed. How many passed?', a:'24' },
      { tier:3, q:'A price increased by 20% to become $84. Original price?', a:'$70' },
      { tier:4, q:'A town\’s population was 4500. It grew by 12% in year 1 and 8% in year 2. New population?', a:'4500 × 1.12 × 1.08 = 5443 (approx)' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Ratios', skill: 'Unit rates and speed', vc: 'VC2M7N09',
    questions: [
      { tier:1, q:'A car travels 240 km in 4 hours. Speed?', a:'60 km/h' },
      { tier:1, q:'3 notebooks cost $6.60. Cost of 1?', a:'$2.20' },
      { tier:1, q:'A swimmer covers 100 m in 80 seconds. Speed in m/s?', a:'1.25 m/s' },
      { tier:2, q:'Which is better value: 400g for $2.80 or 600g for $4.02?', a:'400g: $7/kg; 600g: $6.70/kg → 600g is better value' },
      { tier:2, q:'A car travels at 90 km/h. How far in 2.5 hours?', a:'225 km' },
      { tier:2, q:'5 workers build a wall in 6 days. How many workers to build it in 3 days?', a:'10 workers' },
      { tier:3, q:'Light travels at 300 000 km/s. How far in 1 minute?', a:'18 000 000 km' },
      { tier:4, q:'Two cyclists start at the same point, one heading east at 15 km/h, the other west at 20 km/h. How far apart after 3 hours?', a:'(15 + 20) × 3 = 105 km' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Patterns', skill: 'Finding rules for tables of values', vc: 'VC2M7A03',
    questions: [
      { tier:1, q:'Input/output: 1→3, 2→5, 3→7. What is the rule?', a:'y = 2x + 1' },
      { tier:1, q:'Input/output: 1→4, 2→7, 3→10. Find the rule.', a:'y = 3x + 1' },
      { tier:2, q:'Complete the table: rule y = 5x − 2; x = 1,2,3,4', a:'3, 8, 13, 18' },
      { tier:2, q:'A rule gives: 1→2, 2→5, 3→10, 4→17. Describe the pattern.', a:'y = x² + 1' },
      { tier:3, q:'Find the rule: (1,5), (2,9), (3,13), (4,17)', a:'y = 4x + 1' },
      { tier:4, q:'Find the rule that fits: x=0→y=3, x=1→y=5, x=2→y=9, x=3→y=15.', a:'y = x² + x + 3' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Circles', skill: 'Area of circles', vc: 'VC2M7M03',
    questions: [
      { tier:1, q:'Find area of a circle with radius 4 cm (π ≈ 3.14).', a:'≈ 50.24 cm²' },
      { tier:1, q:'Find area of a circle with diameter 10 cm.', a:'≈ 78.5 cm²' },
      { tier:2, q:'Find the radius of a circle with area 113.1 cm².', a:'r = √(113.1/π) ≈ 6 cm' },
      { tier:2, q:'A circular pizza has radius 15 cm. Find its area to nearest cm².', a:'≈ 707 cm²' },
      { tier:3, q:'A circular pond is surrounded by a 2 m wide path. The pond has radius 5 m. Find the area of the path.', a:'π(7²) − π(5²) = π(49−25) = 24π ≈ 75.4 m²' },
      { tier:4, q:'A square has the same area as a circle of radius 10 cm. Find the side of the square to 2 d.p.', a:'s² = 100π, s = 10√π ≈ 17.72 cm' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Area and Perimeter', skill: 'Perimeter with algebra', vc: 'VC2M7M01',
    questions: [
      { tier:2, q:'A rectangle has perimeter 30 cm and length 3 times its width. Find dimensions.', a:'2(w + 3w) = 30, w = 3.75 cm, l = 11.25 cm' },
      { tier:2, q:'Write an expression for the perimeter of a triangle with sides x, x+3, 2x−1.', a:'4x + 2' },
      { tier:3, q:'A square has perimeter (8x+4) cm. A rectangle has length (2x+1) and width x. They have equal perimeters. Find x.', a:'8x+4 = 2(3x+1), 8x+4 = 6x+2, 2x = −2, x = −1. Check validity.' },
      { tier:4, q:'An equilateral triangle and a square have equal perimeters. The triangle\’s side is 4 m more than the square\’s side. Find both.', a:'3s = 4(s−4), 3s = 4s − 16, s = 16 m. Triangle side = 20 m; each perimeter = 64 m.' },
    ]
  },

  { year: '7', strand: 'Space', topic: '3D Objects', skill: 'Cross-sections and views', vc: 'VC2M7SP01',
    questions: [
      { tier:1, q:'What shape is the cross-section of a cylinder cut parallel to its base?', a:'Circle' },
      { tier:1, q:'What shape is the front view of a cube?', a:'Square' },
      { tier:2, q:'What is the cross-section of a cone cut parallel to its base?', a:'Circle' },
      { tier:2, q:'Describe the plan view (top view) of a square pyramid.', a:'A square with two diagonals drawn' },
      { tier:3, q:'A triangular prism is cut perpendicular to its length. What is the cross-section?', a:'Triangle' },
      { tier:4, q:'A sphere is cut by a plane at any position. What shape is always the cross-section?', a:'Circle (always)' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Transformations', skill: 'Identifying transformations', vc: 'VC2M7SP03',
    questions: [
      { tier:1, q:'A flag has been flipped. What transformation is this?', a:'Reflection' },
      { tier:1, q:'A shape slides to a new position without turning. What is this?', a:'Translation' },
      { tier:1, q:'A shape is turned about a point. What is this?', a:'Rotation' },
      { tier:2, q:'Which transformations produce congruent images?', a:'Reflections, rotations, and translations (not dilation)' },
      { tier:2, q:'A pattern on wallpaper repeats using translation. Describe this transformation.', a:'The motif is translated (shifted) by a fixed vector in one or two directions.' },
      { tier:3, q:'Describe the single transformation that maps (2,3) → (−3,2).', a:'Rotation 90° anticlockwise about the origin' },
      { tier:4, q:'What combination of transformations is equivalent to a 180° rotation?', a:'Two reflections over perpendicular lines through the centre of rotation' },
    ]
  },

  { year: '7', strand: 'Probability', topic: 'Probability Basics', skill: 'Sample spaces using tables', vc: 'VC2M7P01',
    questions: [
      { tier:1, q:'How many outcomes when flipping 3 coins?', a:'8 (2³)' },
      { tier:2, q:'List sample space for choosing from {A,B,C} then {1,2}.', a:'{A1,A2,B1,B2,C1,C2}' },
      { tier:2, q:'Find P(both heads) when flipping 2 fair coins.', a:'1/4' },
      { tier:2, q:'Find P(total > 7) when rolling two dice.', a:'15/36 = 5/12' },
      { tier:3, q:'Two bags: Bag 1 has {red,blue}, Bag 2 has {1,2,3}. List sample space.', a:'R1,R2,R3,B1,B2,B3 — 6 outcomes' },
      { tier:3, q:'A family has 3 children. Find P(at least 2 girls), assuming equal probability for each gender.', a:'Outcomes with ≥ 2 girls: GGG, GGB, GBG, BGG = 4/8 = 1/2' },
      { tier:4, q:'In a lucky dip of 20 prizes: 5 gold, 8 silver, 7 bronze. Two prizes drawn without replacement. Find P(both gold).', a:'5/20 × 4/19 = 20/380 = 1/19' },
    ]
  },


  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Estimating and place value', vc: 'VC2M7N04',
    questions: [
      { tier:1, q:'What is the value of 7 in 3 752 841?', a:'700 000' },
      { tier:1, q:'Round 48 392 to the nearest thousand.', a:'48 000' },
      { tier:1, q:'Write 5.2 × 10⁴ as a basic numeral.', a:'52 000' },
      { tier:1, q:'Write 3 600 000 in scientific notation.', a:'3.6 × 10⁶' },
      { tier:2, q:'Estimate: 387 × 52', a:'≈ 400 × 50 = 20 000' },
      { tier:2, q:'Round 0.04628 to 3 significant figures.', a:'0.0463' },
      { tier:3, q:'Estimate, then calculate: 493 + 617 + 289', a:'Estimate: ≈500+600+300=1400. Actual: 1399.' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Integers', skill: 'Multiplying and dividing negative numbers', vc: 'VC2M7N08',
    questions: [
      { tier:1, q:'Calculate: 4 × (−5)', a:'−20' },
      { tier:1, q:'Calculate: (−3) × (−6)', a:'18' },
      { tier:1, q:'Calculate: −24 ÷ 6', a:'−4' },
      { tier:1, q:'Calculate: −36 ÷ (−9)', a:'4' },
      { tier:2, q:'Calculate: (−2)³', a:'−8' },
      { tier:2, q:'Calculate: (−3)²', a:'9' },
      { tier:2, q:'The product of two integers is −18 and their sum is −3. Find them.', a:'3 and −6' },
      { tier:3, q:'Calculate: −2 × 3 − (−4) × (−2)', a:'−6 − 8 = −14' },
      { tier:4, q:'If a × b = −12 and a − b = 7, find a and b.', a:'From a=b+7: (b+7)b=−12, b²+7b+12=0, (b+3)(b+4)=0; b=−3,a=4 or b=−4,a=3. Check: 4×(−3)=−12 ✓ and 3×(−4)=−12 ✓' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Algebraic Expressions', skill: 'Index laws introduction', vc: 'VC2M7A01',
    questions: [
      { tier:1, q:'Write a × a × a × a using index notation.', a:'a⁴' },
      { tier:1, q:'Simplify: x³ × x²', a:'x⁵' },
      { tier:1, q:'Simplify: y⁶ ÷ y²', a:'y⁴' },
      { tier:2, q:'Simplify: 3a² × 4a³', a:'12a⁵' },
      { tier:2, q:'Simplify: 8x⁴ ÷ 2x', a:'4x³' },
      { tier:3, q:'If a² = 16, find all possible values of a.', a:'a = ±4' },
      { tier:4, q:'Find n: 2ⁿ × 4 = 128', a:'2ⁿ × 2² = 2⁷, 2^(n+2) = 2⁷, n = 5' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Angles', skill: 'Bearing and direction problems', vc: 'VC2M7M04',
    questions: [
      { tier:2, q:'A bearing of 090° means which direction?', a:'Due East' },
      { tier:2, q:'A bearing of 180° means which direction?', a:'Due South' },
      { tier:3, q:'A ship sails N30°E. What is its bearing?', a:'030°' },
      { tier:4, q:'A hiker walks 5 km east then 12 km north. How far from the start, and on what bearing?', a:'Distance: √(25+144) = 13 km. Bearing: arctan(5/12) ≈ 022.6° (N22.6°E)' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Representation', skill: 'Pie charts and percentage graphs', vc: 'VC2M7ST02',
    questions: [
      { tier:1, q:'A pie chart shows 25% for sport. In a group of 80, how many prefer sport?', a:'20' },
      { tier:1, q:'A pie chart for 120 people: 60 prefer movies. What angle represents movies?', a:'60/120 × 360 = 180°' },
      { tier:2, q:'Survey of 40 students: 15 science, 12 maths, 8 English, 5 history. Find the angle for each in a pie chart.', a:'Science: 135°, Maths: 108°, English: 72°, History: 45°' },
      { tier:3, q:'A pie chart has sector angles 90°, 120°, 60°, 90°. Find the percentage each represents.', a:'25%, 33.3%, 16.7%, 25%' },
      { tier:4, q:'Data: Mon: 20, Tue: 35, Wed: 15, Thu: 25, Fri: 45. Draw a percentage stacked bar chart (describe the percentages for each day).', a:'Total: 140. Mon: 14.3%, Tue: 25%, Wed: 10.7%, Thu: 17.9%, Fri: 32.1%' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Triangles and Quadrilaterals', skill: 'Types of triangles by sides and angles', vc: 'VC2M7SP02',
    questions: [
      { tier:1, q:'A triangle with sides 5, 5, 8 cm is called _____.', a:'Isosceles' },
      { tier:1, q:'A triangle with all sides different is called _____.', a:'Scalene' },
      { tier:1, q:'An obtuse triangle has one angle greater than ___°.', a:'90°' },
      { tier:2, q:'Can a triangle have two obtuse angles? Explain.', a:'No — two obtuse angles would sum to more than 180°.' },
      { tier:2, q:'Can a right triangle be isosceles?', a:'Yes — a 45°-45°-90° triangle is both right and isosceles.' },
      { tier:3, q:'A triangle has perimeter 36 cm. The sides are in ratio 2:3:4. Find the side lengths.', a:'8 cm, 12 cm, 16 cm' },
      { tier:4, q:'Prove that a triangle cannot have more than one right angle.', a:'If two angles are 90°, their sum = 180°, leaving 0° for the third angle — impossible.' },
    ]
  },

  { year: '7', strand: 'Probability', topic: 'Probability Experiments', skill: 'Frequency and relative frequency', vc: 'VC2M7P02',
    questions: [
      { tier:1, q:'A die is rolled 30 times. How many times is a 6 expected?', a:'5' },
      { tier:2, q:'A coin landed tails 38 times in 60 flips. What is the relative frequency of tails?', a:'38/60 = 19/30 ≈ 0.633' },
      { tier:2, q:'How does increasing the number of trials affect the experimental probability?', a:'It gets closer to the theoretical probability (Law of Large Numbers).' },
      { tier:3, q:'A ball is green or red. In 50 trials: 32 green. Estimate P(green) and the number of green balls if there are 10 total.', a:'P(green) ≈ 32/50 = 0.64 ≈ 6-7 green balls out of 10.' },
      { tier:4, q:'Design an experiment to test whether a drawing pin is fair (equal chance point-up or point-down). Describe results you would expect from 100 trials if P(up) = 0.6.', a:'Expect ≈ 60 point-up, 40 point-down. If observed counts are close to this, the model P(up)=0.6 is supported.' },
    ]
  },


  { year: '7', strand: 'Number', topic: 'Fractions', skill: 'Fraction word problems', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Sarah ate 3/8 of a pizza. How much is left?', a:'5/8' },
      { tier:2, q:'A tank is 2/5 full. After adding 120 L it is 3/4 full. Find the capacity.', a:'120/(3/4 − 2/5) = 120/(7/20) = 342.86 L ≈ 343 L' },
      { tier:2, q:'A bag of flour is 3/4 kg. You use 1/3 of it. How much is left?', a:'3/4 − 1/4 = 1/2 kg' },
      { tier:3, q:'Tom reads 2/5 of a book on Monday and 1/3 on Tuesday. What fraction is left?', a:'1 − 2/5 − 1/3 = 1 − 6/15 − 5/15 = 4/15' },
      { tier:4, q:'Three friends split a bill. A pays 1/3, B pays 2/5, C pays the rest. The bill is $90. How much does each pay?', a:'A=$30, B=$36, C=$24' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Number puzzles and unknowns', vc: 'VC2M7A02',
    questions: [
      { tier:1, q:'I think of a number, add 7, and get 15. What is my number?', a:'8' },
      { tier:1, q:'A number multiplied by 6 gives 42. Find the number.', a:'7' },
      { tier:2, q:'I think of a number, double it, add 5 and get 21. Find the number.', a:'8' },
      { tier:2, q:'Two consecutive numbers sum to 57. Find them.', a:'28 and 29' },
      { tier:3, q:'A number is 5 more than twice another. Their sum is 32. Find both.', a:'x + (2x+5) = 32, x = 9 and 2(9)+5 = 23' },
      { tier:4, q:'Think of any 3-digit number where first and last digits differ by more than 1. Reverse the digits. Subtract smaller from larger. What always happens?', a:'Always divisible by 99 (e.g. abc − cba = 99(a−c))' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Volume', skill: 'Capacity problems', vc: 'VC2M7M02',
    questions: [
      { tier:1, q:'Convert 4000 cm³ to litres.', a:'4 L' },
      { tier:1, q:'A bottle holds 750 mL. How many bottles fill a 6 L jug?', a:'8 bottles' },
      { tier:2, q:'A 1.5 L bottle is poured equally into 6 glasses. How much in each?', a:'250 mL' },
      { tier:2, q:'A bath holds 200 L and fills at 8 L/min. How long to fill?', a:'25 minutes' },
      { tier:3, q:'A rectangular pool 8 × 4 × 1.5 m is 60% full. How many kL of water?', a:'0.6 × 8 × 4 × 1.5 = 28.8 kL' },
      { tier:4, q:'An ice cube with side 5 cm melts completely. The water collects in a cylinder of radius 4 cm. How high is the water?', a:'V ice = 125 cm³ = πr²h = 16πh, h = 125/16π ≈ 2.49 cm' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Length and Units', skill: 'Perimeter with irregular shapes', vc: 'VC2M7M01',
    questions: [
      { tier:2, q:'Find the perimeter of a regular pentagon with side 7 cm.', a:'35 cm' },
      { tier:2, q:'Find the perimeter of a regular octagon with side 4.5 cm.', a:'36 cm' },
      { tier:3, q:'A path around a rectangular garden 20 m × 15 m is 1.5 m wide. Find the outer perimeter.', a:'2(23+18) = 82 m' },
      { tier:4, q:'A running track consists of a rectangle 100 × 60 m with semicircles on the short ends. Find the perimeter of the track.', a:'2 × 100 + π × 60 = 200 + 188.5 ≈ 388.5 m' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Collection', skill: 'Types of data and variables', vc: 'VC2M7ST01',
    questions: [
      { tier:1, q:'Is "number of siblings" discrete or continuous?', a:'Discrete' },
      { tier:1, q:'Is "time to complete a task" discrete or continuous?', a:'Continuous' },
      { tier:1, q:'Give an example of categorical data.', a:'Favourite colour, type of pet, country of birth' },
      { tier:2, q:'A survey asks "How many hours of TV do you watch?" Is this qualitative or quantitative?', a:'Quantitative (numerical)' },
      { tier:2, q:'Name one advantage of secondary data.', a:'Already collected — cheaper and faster to use' },
      { tier:3, q:'Explain the difference between discrete and continuous data with examples.', a:'Discrete: counts, e.g. number of goals (whole numbers). Continuous: measurements, e.g. height (any value in a range).' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Transformations', skill: 'Symmetry and line symmetry', vc: 'VC2M7SP03',
    questions: [
      { tier:1, q:'How many lines of symmetry does a square have?', a:'4' },
      { tier:1, q:'How many lines of symmetry does a regular hexagon have?', a:'6' },
      { tier:1, q:'Does a scalene triangle have any lines of symmetry?', a:'No' },
      { tier:2, q:'How many lines of symmetry does a rectangle (not square) have?', a:'2' },
      { tier:2, q:'What is rotational symmetry of order 4?', a:'The shape looks the same 4 times in one full rotation (every 90°)' },
      { tier:3, q:'A regular polygon has 5 lines of symmetry. How many sides?', a:'5' },
      { tier:4, q:'What is the order of rotational symmetry of a regular hexagon?', a:'6 (looks the same every 60°)' },
    ]
  },


  { year: '7', strand: 'Number', topic: 'Percentages', skill: 'Consumer percentages', vc: 'VC2M7N10',
    questions: [
      { tier:1, q:'A $200 item is sold for $170. What is the percentage discount?', a:'15%' },
      { tier:1, q:'Find the sale price of a $350 item with 30% off.', a:'$245' },
      { tier:2, q:'A bank charges 18% interest per year on a credit card balance of $500. Interest after 1 year?', a:'$90' },
      { tier:2, q:'A worker earns $1050/week after a 5% pay rise. What was their old wage?', a:'$1000' },
      { tier:3, q:'Compare: 30% off $80 vs $20 off $60. Which saves more money?', a:'30% of $80 = $24 saving vs $20 saving. 30% off $80 saves more.' },
      { tier:4, q:'After two successive 10% increases, an item costs $121. What was the original price?', a:'121 ÷ 1.21 = $100' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Equations in context', vc: 'VC2M7A03',
    questions: [
      { tier:2, q:'Chairs cost $45 each. Write and solve an equation to find the number of chairs for $315.', a:'45n = 315, n = 7' },
      { tier:2, q:'A plumber charges $80 call-out + $60/hour. A bill is $200. How many hours?', a:'80 + 60h = 200, h = 2' },
      { tier:3, q:'An isosceles triangle has two equal sides (2x+3) cm and base (x+7) cm. If perimeter is 37 cm, find x.', a:'2(2x+3) + x+7 = 37, 5x+13 = 37, x = 4.8' },
      { tier:4, q:'A number is increased by 10%, then decreased by 20%. What percentage of its original value remains?', a:'1.1 × 0.8 = 0.88 = 88%' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Angles', skill: 'Angles with parallel lines problem solving', vc: 'VC2M7M04',
    questions: [
      { tier:2, q:'Find x: parallel lines cut by a transversal where angles are (2x+10)° and (3x−20)° as alternate angles.', a:'2x+10 = 3x−20, x = 30°' },
      { tier:3, q:'A transversal crosses two parallel lines. One co-interior angle is (4x−10)° and the other is (2x+40)°. Find x and both angles.', a:'6x+30 = 180, x = 25°; angles: 90° and 90°' },
      { tier:4, q:'A ladder leans against a wall making a 72° angle with the ground. A horizontal line cuts the ladder. Find the angle the ladder makes with the horizontal.', a:'72° (alternate angles with parallel horizontal line and ground)' },
    ]
  },

  { year: '7', strand: 'Statistics', topic: 'Data Analysis', skill: 'Median from frequency tables', vc: 'VC2M7ST02',
    questions: [
      { tier:2, q:'Values and frequencies: 1(×3), 2(×4), 3(×2), 4(×1). Find the median.', a:'10 values total; median = 5th and 6th = (2+2)/2 = 2' },
      { tier:3, q:'Test scores: 5(×4), 6(×6), 7(×8), 8(×5), 9(×2), 10(×1). Find mean and median.', a:'n=26; median = 13th and 14th values = (7+7)/2 = 7. Mean = (20+36+56+40+18+10)/26 = 180/26 ≈ 6.9' },
      { tier:4, q:'Create a data set of 7 values where mean = median = mode = 6.', a:'e.g. 4, 5, 6, 6, 6, 7, 8 (mean = 42/7 = 6, median = 6, mode = 6)' },
    ]
  },


  // ══════════════════════════════════════════════════════════════
  // TEXTBOOK-SOURCED QUESTIONS (Cambridge Essential Maths Yr 7)
  // ══════════════════════════════════════════════════════════════

  // ── CH1: Computation with positive integers ──────────────────
  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Place value and expanded form', vc: 'VC2M7N02',
    questions: [
      { tier:1, q:'Write down the place value of the digit 5 in 357.', a:'50 (tens)' },
      { tier:1, q:'Write down the place value of the digit 5 in 5249.', a:'5000 (thousands)' },
      { tier:1, q:'Write down the place value of the digit 5 in 356 612.', a:'50 000 (ten-thousands)' },
      { tier:1, q:'Write 517 in expanded form with index notation.', a:'5 × 10² + 1 × 10¹ + 7 × 10⁰' },
      { tier:1, q:'What does 3 × 1000 + 9 × 10 + 2 × 1 equal?', a:'3092' },
      { tier:2, q:'Write 3 × 10⁴ + 2 × 10² + 5 × 10⁰ as a basic numeral.', a:'30 205' },
      { tier:2, q:'Round 72 to the nearest 10.', a:'70' },
      { tier:2, q:'Round 3268 to the nearest 100.', a:'3300' },
      { tier:2, q:'Round 951 to the nearest 100.', a:'1000' },
      { tier:3, q:'Use leading digit approximation to estimate 289 + 532.', a:'≈ 300 + 500 = 800' },
      { tier:3, q:'Use leading digit approximation to estimate 22 × 19.', a:'≈ 20 × 20 = 400' },
      { tier:4, q:'Estimate 452 × 11 then calculate exactly.', a:'Estimate: 450 × 11 = 4950. Exact: 4972' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Addition and subtraction algorithms', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Calculate: 124 + 335', a:'459' },
      { tier:1, q:'Calculate: 687 − 324', a:'363' },
      { tier:1, q:'Calculate: 59 + 36', a:'95' },
      { tier:1, q:'Calculate: 256 − 39', a:'217' },
      { tier:2, q:'Calculate: 1528 + 796', a:'2324' },
      { tier:2, q:'Calculate: 3240 − 2721', a:'519' },
      { tier:2, q:'Calculate: 439 + 172', a:'611' },
      { tier:2, q:'Calculate: 2109 − 1814', a:'295' },
      { tier:3, q:'Use order of operations: 3 × (2 + 6)', a:'24' },
      { tier:3, q:'Evaluate: [2 + 3 × (7 − 4)] ÷ 11', a:'[2 + 3×3] ÷ 11 = 11/11 = 1' },
      { tier:4, q:'The difference between 76 and 43 is tripled. Subtract the quotient of 35 and 7. What is the result?', a:'(76−43)×3 − 35/7 = 99 − 5 = 94' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'Multiplication and division algorithms', vc: 'VC2M7N06',
    questions: [
      { tier:1, q:'Calculate: 5 × 19', a:'95' },
      { tier:1, q:'Calculate: 22 × 6', a:'132' },
      { tier:1, q:'Calculate: 5 × 44', a:'220' },
      { tier:1, q:'Calculate: 123 ÷ 3', a:'41' },
      { tier:1, q:'Calculate: 264 ÷ 8', a:'33' },
      { tier:1, q:'Calculate: 96 ÷ 4', a:'24' },
      { tier:2, q:'Find the quotient and remainder when 195 is divided by 7.', a:'27 remainder 6' },
      { tier:2, q:'Calculate: 157 × 9', a:'1413' },
      { tier:2, q:'Calculate: 27 × 13', a:'351' },
      { tier:2, q:'Calculate: 614 × 14', a:'8596' },
      { tier:3, q:'A city tower uses 4520 tonnes of concrete carried in 7-tonne loads. How many loads are needed?', a:'646 loads (645 full + 1 with 5 tonnes)' },
      { tier:4, q:'Concrete costs $85 per truck load for the first 30 loads and $55 per load after that. Find the total cost for 646 loads.', a:'30×85 + 616×55 = 2550 + 33880 = $36 430' },
    ]
  },

  // ── CH2: Number properties and patterns ──────────────────────
  { year: '7', strand: 'Number', topic: 'Whole Numbers', skill: 'HCF, LCM and prime factorisation', vc: 'VC2M7N02',
    questions: [
      { tier:1, q:'Find the complete set of factors of 120.', a:'1,2,3,4,5,6,8,10,12,15,20,24,30,40,60,120' },
      { tier:1, q:'Find the HCF of 15 and 40.', a:'5' },
      { tier:1, q:'Find the HCF of 18 and 26.', a:'2' },
      { tier:1, q:'Find the HCF of 72 and 96.', a:'24' },
      { tier:1, q:'Find the LCM of 5 and 13.', a:'65' },
      { tier:1, q:'Find the LCM of 6 and 9.', a:'18' },
      { tier:1, q:'Find the LCM of 44 and 8.', a:'88' },
      { tier:2, q:'State the prime factors of 770.', a:'2 × 5 × 7 × 11' },
      { tier:2, q:'Write 32 as a product of prime numbers in index form.', a:'2⁵' },
      { tier:2, q:'Write 200 as a product of prime numbers in index form.', a:'2³ × 5²' },
      { tier:2, q:'Write 225 as a product of prime numbers in index form.', a:'3² × 5²' },
      { tier:3, q:'Evaluate: 5² − 3²', a:'16' },
      { tier:3, q:'Evaluate: 2 × 4² − 5²', a:'32 − 25 = 7' },
      { tier:3, q:'Evaluate: 5 × 3⁴ − 3² + 1⁶', a:'5×81 − 9 + 1 = 405 − 9 + 1 = 397' },
      { tier:4, q:'Find three composite numbers less than 100, each with only three factors that are all prime numbers less than 10.', a:'e.g. 8 (1,2,4,8 — wait, 4 factors). Factors: p×p×p format. e.g. 2³=8: factors 1,2,4,8. 2²×3=12: 1,2,3,4,6,12. Numbers with exactly 3 factors are squares of primes: 4,9,25,49.' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Patterns', skill: 'Tables and rules — input/output', vc: 'VC2M7A03',
    questions: [
      { tier:1, q:'Rule: output = input × 2. Input = 7. Find output.', a:'14' },
      { tier:1, q:'Rule: output = input − 5. Input = 20. Find output.', a:'15' },
      { tier:1, q:'Rule: output = input + 1. Input = 10. Find output.', a:'11' },
      { tier:1, q:'Rule: output = 5 + input. Input = 3. Find output.', a:'8' },
      { tier:2, q:'Complete the table for output = input − 2: inputs 3, 5, 7, 12, 20.', a:'1, 3, 5, 10, 18' },
      { tier:2, q:'Complete the table for output = (3 × input) + 1: inputs 4, 2, 9, 12, 0.', a:'13, 7, 28, 37, 1' },
      { tier:2, q:'What rule connects: input 20→15, 14→9, 6→1?', a:'output = input − 5' },
      { tier:2, q:'What rule connects: input 8→13, 10→15, 12→17?', a:'output = input + 5' },
      { tier:3, q:'A rule gives: input 4→16, 3→12, 2→8. What is the output when input = 10?', a:'output = 4 × input; output = 40' },
      { tier:4, q:'Find the rule: input 1→2, 2→5, 3→10, 4→17.', a:'output = input² + 1' },
    ]
  },

  // ── CH3: Fractions and percentages ───────────────────────────
  { year: '7', strand: 'Number', topic: 'Fractions', skill: 'Simplifying and ordering fractions', vc: 'VC2M7N03',
    questions: [
      { tier:1, q:'Write 18/30 in simplest form.', a:'3/5' },
      { tier:1, q:'Write 8/28 in simplest form.', a:'2/7' },
      { tier:1, q:'Write 35/49 in simplest form.', a:'5/7' },
      { tier:1, q:'Convert 15/10 to a mixed numeral in simplest form.', a:'1 1/2' },
      { tier:1, q:'Convert 63/36 to a mixed numeral in simplest form.', a:'1 3/4' },
      { tier:1, q:'Convert 45/27 to a mixed numeral in simplest form.', a:'1 2/3' },
      { tier:2, q:'Find the largest fraction in: 3/7, 2/7, 5/7, 1/7.', a:'5/7' },
      { tier:2, q:'Find the largest fraction in: 3/8, 2/8, 5/8, 1/8.', a:'5/8' },
      { tier:2, q:'State the LCM of 2 and 5.', a:'10' },
      { tier:2, q:'State the lowest common denominator of 1/3 and 2/5.', a:'15' },
      { tier:3, q:'Rearrange in descending order: 1/5, 3/5, 9/5, 2 1/5.', a:'2 1/5, 9/5, 3/5, 1/5' },
      { tier:4, q:'Rearrange in descending order: 5 2/3, 4 7/9, 5 7/18, 5 1/9.', a:'LCM of denominators = 18: 5 12/18, 4 14/18, 5 7/18, 5 2/18 → 5 2/3, 5 7/18, 5 1/9, 4 7/9' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Fractions', skill: 'Multiplying and dividing fractions', vc: 'VC2M7N05',
    questions: [
      { tier:1, q:'Find: 1/3 × 21', a:'7' },
      { tier:1, q:'Find: 4/5 of 100', a:'80' },
      { tier:1, q:'Find: 3/4 of 16', a:'12' },
      { tier:2, q:'Calculate: 8/10 × 25/4', a:'5' },
      { tier:2, q:'Calculate: 2 of 1/4', a:'1/2' },
      { tier:2, q:'Calculate: 3 1/8 × 2 2/5', a:'25/8 × 12/5 = 300/40 = 7 1/2' },
      { tier:2, q:'Determine the reciprocal of 3/4.', a:'4/3' },
      { tier:2, q:'Determine the reciprocal of 7/12.', a:'12/7' },
      { tier:2, q:'Determine the reciprocal of 2 3/4.', a:'4/11' },
      { tier:3, q:'Calculate: 6/10 ÷ 3', a:'1/5' },
      { tier:3, q:'Calculate: 64 ÷ 3 1/5', a:'64 × 5/16 = 20' },
      { tier:3, q:'Calculate: 6 2/5 ÷ 1 6/10', a:'32/5 ÷ 8/5 = 4' },
      { tier:4, q:'Calculate: 3/8 ÷ 1/4 ÷ 1 1/2', a:'3/8 × 4 × 2/3 = 1' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Percentages', skill: 'Fractions, decimals and percentages', vc: 'VC2M7N07',
    questions: [
      { tier:1, q:'Convert 36% to a fraction.', a:'9/25' },
      { tier:1, q:'Convert 2 1/5 to a percentage.', a:'220%' },
      { tier:1, q:'Convert 5/100 to a percentage.', a:'5%' },
      { tier:1, q:'Convert 11/25 to a percentage.', a:'44%' },
      { tier:2, q:'Find 25% of $200.', a:'$50' },
      { tier:2, q:'Find 20% of $260.', a:'$52' },
      { tier:2, q:'Which is larger: 25% of $200 or 20% of $260?', a:'They are equal — both $50 and $52; 20% of $260 is larger.' },
      { tier:2, q:'Find 5% of $1200.', a:'$60' },
      { tier:2, q:'Find 3% of $1900.', a:'$57' },
      { tier:3, q:'Which gives a larger discount: 25% off $200, or 20% off $260?', a:'25% of $200=$50; 20% of $260=$52. Second option saves more.' },
      { tier:4, q:'A shop shelf has 3 cakes, 5 slices and 4 pies. Write the ratio of slices to pies to cakes.', a:'5:4:3' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Ratios', skill: 'Introduction to ratios', vc: 'VC2M7N09',
    questions: [
      { tier:1, q:'Express these ratios in simplest form: 21:7', a:'3:1' },
      { tier:1, q:'Simplify: 3.2:0.6', a:'16:3' },
      { tier:1, q:'Simplify: $2.30:50 cents', a:'23:5' },
      { tier:2, q:'Divide $80 in ratio 7:1.', a:'$70 and $10' },
      { tier:2, q:'Divide $80 in ratio 2:3.', a:'$32 and $48' },
      { tier:3, q:'Three people share $180 in the ratio 2:3:4. How much does each get?', a:'$40, $60, $80' },
      { tier:4, q:'A recipe uses flour and sugar in ratio 3:1. If you have 500g flour, how much sugar do you need? If you only have 80g sugar, how much flour?', a:'Sugar: 500/3 ≈ 167g. Flour for 80g sugar: 240g.' },
    ]
  },

  // ── CH6: Integers ─────────────────────────────────────────────
  { year: '7', strand: 'Number', topic: 'Integers', skill: 'Comparing and computing with integers', vc: 'VC2M7N08',
    questions: [
      { tier:1, q:'Insert < or >: 0 ___ 7', a:'<' },
      { tier:1, q:'Insert < or >: −1 ___ 4', a:'<' },
      { tier:1, q:'Insert < or >: 3 ___ −7', a:'>' },
      { tier:1, q:'Insert < or >: −11 ___ −6', a:'<' },
      { tier:1, q:'Evaluate: 2 − 7', a:'−5' },
      { tier:1, q:'Evaluate: −4 + 2', a:'−2' },
      { tier:1, q:'Evaluate: 0 − 15', a:'−15' },
      { tier:1, q:'Evaluate: −1 + (−4)', a:'−5' },
      { tier:1, q:'Evaluate: 10 − (−2)', a:'12' },
      { tier:1, q:'Evaluate: −21 − (−3)', a:'−18' },
      { tier:2, q:'Evaluate: −3 + 7 − (−1)', a:'5' },
      { tier:2, q:'Evaluate: 0 + (−1) − 10', a:'−11' },
      { tier:2, q:'Find the missing number: −2 + □ = −3', a:'−1' },
      { tier:2, q:'Find the missing number: 5 − □ = 6', a:'−1' },
      { tier:3, q:'Evaluate: −2 + 5 × (−7)', a:'−2 + (−35) = −37' },
      { tier:3, q:'Evaluate: 5 − 4 × (−3) ÷ (−3)', a:'5 − 4 × 1 = 1' },
      { tier:4, q:'Evaluate if a = 7, b = −3, c = −1: find 2b − 5a', a:'2(−3) − 5(7) = −6 − 35 = −41' },
    ]
  },

  { year: '7', strand: 'Number', topic: 'Integers', skill: 'Multiplying and dividing integers', vc: 'VC2M7N08',
    questions: [
      { tier:1, q:'Evaluate: 5 × (−2)', a:'−10' },
      { tier:1, q:'Evaluate: −3 × 7', a:'−21' },
      { tier:1, q:'Evaluate: −2 × (−15)', a:'30' },
      { tier:1, q:'Evaluate: 10 ÷ (−2)', a:'−5' },
      { tier:1, q:'Evaluate: −36 ÷ 12', a:'−3' },
      { tier:1, q:'Evaluate: −100 ÷ (−25)', a:'4' },
      { tier:2, q:'Find the missing number: 4 × □ = −8', a:'−2' },
      { tier:2, q:'Find the missing number: □ ÷ (−5) = 10', a:'−50' },
      { tier:2, q:'Find the missing number: □ ÷ 9 = −4', a:'−36' },
      { tier:2, q:'Find the missing number: −1 × □ = 1', a:'−1' },
      { tier:3, q:'Evaluate: −38 ÷ (−19) × (−4)', a:'2 × (−4) = −8' },
      { tier:4, q:'Evaluate if a = 7, b = −3, c = −1: find bc − 2a', a:'(−3)(−1) − 2(7) = 3 − 14 = −11' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Graphs', skill: 'The Cartesian plane', vc: 'VC2M7A05',
    questions: [
      { tier:1, q:'Write the coordinates of a point 3 units right and 4 units up from the origin.', a:'(3, 4)' },
      { tier:1, q:'In which quadrant is (−2, 3)?', a:'Quadrant II' },
      { tier:1, q:'In which quadrant is (1, −5)?', a:'Quadrant IV' },
      { tier:1, q:'What are the coordinates of the origin?', a:'(0, 0)' },
      { tier:2, q:'A point is at (3, 2). Write the coordinates after moving 4 units left and 3 units down.', a:'(−1, −1)' },
      { tier:2, q:'Evaluate a − b if a = 7, b = −3.', a:'10' },
      { tier:2, q:'Evaluate ab + c if a = 7, b = −3, c = −1.', a:'−21 + (−1) = −22' },
      { tier:3, q:'Plot these points and name the shape: (−2,1), (2,1), (2,−1), (−2,−1).', a:'Rectangle' },
      { tier:4, q:'A point P is equidistant from (0,0) and (4,4). Describe the locus of all such points.', a:'The perpendicular bisector of segment from (0,0) to (4,4): the line y = −x + 4' },
    ]
  },

  // ── CH7: Geometry ─────────────────────────────────────────────
  { year: '7', strand: 'Space', topic: 'Angles', skill: 'Adjacent, vertically opposite and supplementary angles', vc: 'VC2M7M04',
    questions: [
      { tier:1, q:'Find a: a straight line has one angle 70°, the other is a°.', a:'110°' },
      { tier:1, q:'Find a: angles on a straight line are a° and 130°.', a:'50°' },
      { tier:1, q:'Find a: vertically opposite to 145°.', a:'145°' },
      { tier:1, q:'Find a: angles around a point include 52° and a°, they are supplementary.', a:'128°' },
      { tier:2, q:'Find a: angles on a straight line include a° and (2a)°.', a:'3a = 180, a = 60°' },
      { tier:2, q:'Two lines cross. One angle is (a + 30)° and its vertically opposite is a°. Find a.', a:'a + 30 = a → impossible! Actually vertically opposite means they are equal, so a+30 = a has no solution. Must be supplementary: (a+30) + a = 180, a = 75°' },
      { tier:3, q:'Angles around a point: 90°, (2a)°, a°, 75°. Find a.', a:'90 + 2a + a + 75 = 360, 3a = 195, a = 65°' },
      { tier:4, q:'Find a: parallel lines cut by transversal with co-interior angles (4a − 10)° and (2a + 40)°.', a:'4a−10+2a+40=180, 6a=150, a=25°; angles = 90° each' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Triangles and Quadrilaterals', skill: 'Classifying and finding angles in triangles', vc: 'VC2M7SP02',
    questions: [
      { tier:1, q:'A triangle has angles 40°, 60°, 80°. What type is it?', a:'Acute scalene' },
      { tier:1, q:'A triangle has angles 90°, 45°, 45°. What type is it?', a:'Right isosceles' },
      { tier:1, q:'An equilateral triangle has angles of ___°.', a:'60°' },
      { tier:2, q:'Find the third angle: triangle with 75° and 52°.', a:'53°' },
      { tier:2, q:'A triangle has angles a°, (a+10)°, (a+20)°. Find a and name the triangle type.', a:'3a+30=180, a=50°; angles 50°,60°,70° — acute scalene' },
      { tier:3, q:'Find x: a triangle has angles (2x)°, (3x)°, (x + 18)°.', a:'6x+18=180, x=27°; angles 54°,81°,45°' },
      { tier:4, q:'Classify this triangle: all angles less than 90°, no two sides equal.', a:'Acute scalene' },
    ]
  },

  { year: '7', strand: 'Space', topic: 'Triangles and Quadrilaterals', skill: 'Quadrilateral properties', vc: 'VC2M7SP02',
    questions: [
      { tier:1, q:'Name a quadrilateral with two pairs of parallel sides and all sides equal.', a:'Rhombus' },
      { tier:1, q:'Name a quadrilateral with exactly one pair of parallel sides.', a:'Trapezium' },
      { tier:1, q:'How many axes of symmetry does a square have?', a:'4' },
      { tier:1, q:'How many axes of symmetry does a non-square rectangle have?', a:'2' },
      { tier:2, q:'A parallelogram has one angle of 65°. Find all four angles.', a:'65°, 115°, 65°, 115°' },
      { tier:2, q:'A rhombus has one angle of 70°. Find all four angles.', a:'70°, 110°, 70°, 110°' },
      { tier:3, q:'Classify a quadrilateral with 4 right angles and opposite sides equal but not all sides equal.', a:'Rectangle' },
      { tier:4, q:'Prove the sum of interior angles of a quadrilateral is 360°.', a:'Divide into two triangles by a diagonal. Each triangle has angle sum 180°. Total = 360°.' },
    ]
  },

  // ── CH8: Statistics and probability ──────────────────────────
  { year: '7', strand: 'Statistics', topic: 'Data Analysis', skill: 'Mean, median, mode from real data', vc: 'VC2M7ST02',
    questions: [
      { tier:1, q:'Dataset: 1, 4, 2, 7, 3, 2, 9, 12. Find the range.', a:'11' },
      { tier:1, q:'Dataset: 1, 4, 2, 7, 3, 2, 9, 12. Find the mean.', a:'5' },
      { tier:1, q:'Dataset: 1, 4, 2, 7, 3, 2, 9, 12. Find the median.', a:'Sort: 1,2,2,3,4,7,9,12. Median = (3+4)/2 = 3.5' },
      { tier:1, q:'Dataset: 1, 4, 2, 7, 3, 2, 9, 12. Find the mode.', a:'2' },
      { tier:2, q:'TV hours per week: 8(×5), 9(×8), 10(×14), 11(×8), 12(×5). How many students?', a:'40' },
      { tier:2, q:'TV hours: 8(×5), 9(×8), 10(×14), 11(×8), 12(×5). Total hours watched?', a:'8×5+9×8+10×14+11×8+12×5 = 40+72+140+88+60 = 400 hours' },
      { tier:2, q:'TV hours: 8(×5), 9(×8), 10(×14), 11(×8), 12(×5). Mean hours watched?', a:'400/40 = 10 hours' },
      { tier:3, q:'Data: 0, 4, 2, 9, 3, 7, 3, 12. Find mean, median, range.', a:'Mean = 5, Sorted: 0,2,3,3,4,7,9,12, Median = 3.5, Range = 12' },
      { tier:4, q:'A set of six scores is 17, 24, 19, 36, 22 and □. The mean is 23. Find □.', a:'Sum = 138; 17+24+19+36+22+□ = 138; □ = 20' },
    ]
  },

  { year: '7', strand: 'Probability', topic: 'Probability Basics', skill: 'Theoretical probability in experiments', vc: 'VC2M7P01',
    questions: [
      { tier:1, q:'A standard deck has 52 cards. Find P(red card).', a:'26/52 = 1/2' },
      { tier:1, q:'Find P(black card) from a standard deck.', a:'1/2' },
      { tier:1, q:'Find P(a heart) from a standard deck.', a:'13/52 = 1/4' },
      { tier:1, q:'Find P(an ace) from a standard deck.', a:'4/52 = 1/13' },
      { tier:1, q:'Find P(a king) from a standard deck.', a:'4/52 = 1/13' },
      { tier:1, q:'Find P(a red 7) from a standard deck.', a:'2/52 = 1/26' },
      { tier:2, q:'One card is drawn. Find P(king or red).', a:'4/52 + 26/52 − 2/52 = 28/52 = 7/13' },
      { tier:3, q:'A spinner has sections 1,2,3,4,5. Which spinner (equally-spaced) has P(1) = 1/4?', a:'A 4-section spinner or one where section 1 takes up 1/4 of the area' },
      { tier:4, q:'A stem-and-leaf shows ages: 0|3,5; 1|1,7,9; 2|0,2,2,3; 3|6,9; 4|3,7. How many people? Find median and mode.', a:'13 people; median = 7th value = 20; mode = 22' },
    ]
  },

  // ── CH9: Equations ────────────────────────────────────────────
  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Writing and classifying equations', vc: 'VC2M7A02',
    questions: [
      { tier:1, q:'Is 4 + 2 = 10 − 2 true or false?', a:'True (both = 6... wait 4+2=6, 10−2=8. False)' },
      { tier:1, q:'Is 2(3 + 5) = 4(1 + 3) true or false?', a:'2×8=16, 4×4=16. True' },
      { tier:1, q:'Is 5w + 1 = 11 if w = 2 true or false?', a:'5(2)+1=11. True' },
      { tier:1, q:'Is 2x + 5 = 12 if x = 4 true or false?', a:'2(4)+5=13≠12. False' },
      { tier:2, q:'Write as an equation: the sum of 2 and u is 22.', a:'2 + u = 22' },
      { tier:2, q:'Write as an equation: the product of k and 5 is 41.', a:'5k = 41' },
      { tier:2, q:'Write as an equation: when z is tripled the result is 36.', a:'3z = 36' },
      { tier:3, q:'Solve by inspection: x + 1 = 4', a:'x = 3' },
      { tier:3, q:'Solve by inspection: x + 8 = 14', a:'x = 6' },
      { tier:3, q:'Solve by inspection: 5a = 10', a:'a = 2' },
      { tier:4, q:'Solve algebraically: 5x = 15', a:'x = 3' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Equations', skill: 'Solving equations algebraically', vc: 'VC2M7A02',
    questions: [
      { tier:1, q:'Solve: r + 25 = 70', a:'r = 45' },
      { tier:1, q:'Solve: 12p + 17 = 125', a:'p = 9' },
      { tier:1, q:'Solve: 12 = 4b − 12', a:'b = 6' },
      { tier:1, q:'Solve: 5 = 2x − 13', a:'x = 9' },
      { tier:1, q:'Solve: 13 = 2r + 5', a:'r = 4' },
      { tier:1, q:'Solve: 10 = 4q + 2', a:'q = 2' },
      { tier:1, q:'Solve: 8a + 2 = 66', a:'a = 8' },
      { tier:2, q:'Solve: 3u/4 = 6', a:'u = 8' },
      { tier:2, q:'Solve: 8p/3 = 8', a:'p = 3' },
      { tier:2, q:'Solve: 5y/2 + 10 = 30', a:'y = 8' },
      { tier:3, q:'Solve: 4x/3 + 4 = 24', a:'4x/3 = 20, x = 15' },
      { tier:4, q:'Expand then solve: 2(3 + 2p) = ?', a:'6 + 4p (expansion only, no equation to solve unless = value given)' },
    ]
  },

  { year: '7', strand: 'Algebra', topic: 'Formulas', skill: 'Using formulas to solve problems', vc: 'VC2M7A06',
    questions: [
      { tier:2, q:'Use the formula for speed: d = s × t. Find d when s = 60 km/h and t = 3 hours.', a:'180 km' },
      { tier:2, q:'Use I = PRT/100. Find I when P = 500, R = 4, T = 2.', a:'$40' },
      { tier:2, q:'Use A = ½bh. Find A when b = 10 cm and h = 7 cm.', a:'35 cm²' },
      { tier:3, q:'Use V = lwh. Find h when V = 60, l = 5, w = 4.', a:'h = 3' },
      { tier:3, q:'Use C = 2πr. Find r when C = 44 cm (use π = 22/7).', a:'r = 7 cm' },
      { tier:4, q:'The formula for the nth triangular number is T(n) = n(n+1)/2. Find T(8) and verify by summing 1+2+...+8.', a:'T(8) = 8×9/2 = 36. Sum = 36 ✓' },
    ]
  },

  // ── CH10: Measurement ────────────────────────────────────────
  { year: '7', strand: 'Measurement', topic: 'Length and Units', skill: 'Metric unit conversions', vc: 'VC2M7M06',
    questions: [
      { tier:1, q:'How many millimetres in 1 cm?', a:'10' },
      { tier:1, q:'How many metres in 1 km?', a:'1000' },
      { tier:1, q:'How many centimetres in 1 km?', a:'100 000' },
      { tier:1, q:'Convert 5 cm to mm.', a:'50 mm' },
      { tier:1, q:'Convert 200 cm to m.', a:'2 m' },
      { tier:1, q:'Convert 3.7 km to m.', a:'3700 m' },
      { tier:1, q:'Convert 421 000 cm to km.', a:'4.21 km' },
      { tier:2, q:'Convert 7.1 kg to g.', a:'7100 g' },
      { tier:2, q:'Convert 24 900 mg to g.', a:'24.9 g' },
      { tier:2, q:'Convert 28 490 kg to t.', a:'28.49 t' },
      { tier:2, q:'Convert 4000 mL to L.', a:'4 L' },
      { tier:2, q:'Convert 29 903 L to kL.', a:'29.903 kL' },
      { tier:3, q:'Convert 0.4 mL to L.', a:'0.0004 L' },
      { tier:4, q:'A container has volume 2000 cm³. Find its capacity in litres. If the container is a rectangular prism 20 × 10 × ? cm, find the missing dimension.', a:'2000 cm³ = 2 L. Height = 2000/(20×10) = 10 cm' },
    ]
  },

  { year: '7', strand: 'Measurement', topic: 'Area and Perimeter', skill: 'Perimeter of composite shapes', vc: 'VC2M7M01',
    questions: [
      { tier:1, q:'Find the perimeter of a square with side 4 m.', a:'16 m' },
      { tier:1, q:'Find the perimeter of a rectangle: l = 7.1 cm, w = 3.2 cm.', a:'20.6 cm' },
      { tier:2, q:'Find the perimeter of a right triangle with legs 5 m and 9 m (use Pythagoras).', a:'Hyp = √(106) ≈ 10.3 m; P ≈ 24.3 m' },
      { tier:2, q:'Find the perimeter of a regular octagon with side 0.4 mm.', a:'3.2 mm' },
      { tier:2, q:'A composite shape: 8 km × 4 km rectangle with a 3 km × 2 km notch cut from one corner. Find perimeter.', a:'8+4+7+2+3+4 = ... depends on exact shape. For L-shape: 8+4+2+2+6+2 = depends. Standard answer: trace all sides.' },
      { tier:3, q:'Find the area of a rectangle 10 mm × 4 mm.', a:'40 mm²' },
      { tier:3, q:'Find the area of a parallelogram with base 12 m, height 5 m.', a:'60 m²' },
      { tier:4, q:'Find the area of a triangle with base 10 cm and height 9 cm.', a:'45 cm²' },
    ]
  },

]

// ── SEED FUNCTION ───────────────────────────────────────────────
export async function seedYear7(onProgress = () => {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  onProgress('Starting Year 7 seed...')
  let skillCount = 0, questionCount = 0, errors = 0

  for (const skill of SKILLS_YR7) {
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
      question_type: q.type || 'std',
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

  onProgress(`Year 7 complete: ${skillCount} skills, ${questionCount} questions, ${errors} errors`)
  return { skillCount, questionCount, errors }
}
