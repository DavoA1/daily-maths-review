// ═══════════════════════════════════════════════════════════════════════════
// YEAR 8 QUESTION BANK SEED
// Source: Essential Mathematics for the Victorian Curriculum Year 8
//         (Greenwood et al., 2024, Cambridge University Press)
// Mapped to Victorian Curriculum 2.0 (VC2) Mathematics Year 8
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from './supabase.js'

const YEAR8_CURRICULUM = [

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 1: COMPUTATION WITH INTEGERS (Strand: Number)
  // VC2M8N04: Use the 4 operations with integers
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Number', topic: 'Computation with integers',
    skill: 'Adding and subtracting positive integers',
    vc: 'VC2M8N04',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 324 + 173', a: '497' },
      { tier: 1, type: 'std', q: 'Evaluate: 592 − 180', a: '412' },
      { tier: 1, type: 'std', q: 'Evaluate: 89 + 40', a: '129' },
      { tier: 1, type: 'std', q: 'Evaluate: 1001 + 998', a: '1999' },
      { tier: 1, type: 'std', q: 'Evaluate: 55 + 57', a: '112' },
      { tier: 1, type: 'std', q: 'Evaluate: 280 − 141', a: '139' },
      { tier: 2, type: 'std', q: 'Evaluate: 392 + 147', a: '539' },
      { tier: 2, type: 'std', q: 'Evaluate: 1031 + 999', a: '2030' },
      { tier: 2, type: 'std', q: 'Evaluate: 3970 − 896', a: '3074' },
      { tier: 2, type: 'std', q: 'Evaluate: 10 000 − 4325', a: '5675' },
      { tier: 3, type: 'worded', q: 'The temperature was −8°C and rose by 15°C. What is the new temperature?', a: '7°C' },
      { tier: 3, type: 'worded', q: 'A submarine is at −240 m. It rises 85 m. What is its new depth?', a: '−155 m' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Computation with integers',
    skill: 'Multiplying and dividing positive integers',
    vc: 'VC2M8N04',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 2 × 17 × 5', a: '170' },
      { tier: 1, type: 'std', q: 'Evaluate: 3 × 99', a: '297' },
      { tier: 1, type: 'std', q: 'Evaluate: 8 × 42', a: '336' },
      { tier: 1, type: 'std', q: 'Evaluate: 164 ÷ 4', a: '41' },
      { tier: 1, type: 'std', q: 'Evaluate: 357 ÷ 3', a: '119' },
      { tier: 1, type: 'std', q: 'Evaluate: 618 ÷ 6', a: '103' },
      { tier: 2, type: 'std', q: 'Evaluate: 139 × 12', a: '1668' },
      { tier: 2, type: 'std', q: 'Evaluate: 507 × 42', a: '21294' },
      { tier: 2, type: 'std', q: 'Find the remainder when 673 is divided by 7', a: '1' },
      { tier: 3, type: 'worded', q: 'A cinema has 18 rows of 24 seats. How many seats in total?', a: '432 seats' },
      { tier: 3, type: 'worded', q: '156 students are split equally into groups of 12. How many groups?', a: '13 groups' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Computation with integers',
    skill: 'Number properties — factors, multiples and primes',
    vc: 'VC2M8N04',
    questions: [
      { tier: 1, type: 'std', q: 'Find all factors of 60', a: '1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60' },
      { tier: 1, type: 'std', q: 'List all prime numbers between 30 and 60', a: '31, 37, 41, 43, 47, 53, 59' },
      { tier: 1, type: 'std', q: 'Find the LCM of 8 and 6', a: '24' },
      { tier: 1, type: 'std', q: 'Find the HCF of 24 and 30', a: '6' },
      { tier: 1, type: 'std', q: 'Find √81', a: '9' },
      { tier: 1, type: 'std', q: 'Evaluate: 7²', a: '49' },
      { tier: 1, type: 'std', q: 'Evaluate: ∛27', a: '3' },
      { tier: 2, type: 'std', q: 'Write 36 in prime factor form', a: '2² × 3²' },
      { tier: 2, type: 'std', q: 'Write 84 in prime factor form', a: '2² × 3 × 7' },
      { tier: 2, type: 'std', q: 'Find LCM of 20 and 38 using prime factors', a: '380' },
      { tier: 2, type: 'std', q: 'Find HCF of 20 and 38 using prime factors', a: '2' },
      { tier: 3, type: 'worded', q: 'Two buses leave together. One comes every 8 min, the other every 12 min. When do they next leave together?', a: 'In 24 minutes' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Computation with integers',
    skill: 'Negative integers — adding and subtracting',
    vc: 'VC2M8N04',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: −6 + 9', a: '3' },
      { tier: 1, type: 'std', q: 'Evaluate: −24 + 19', a: '−5' },
      { tier: 1, type: 'std', q: 'Evaluate: 5 − 13', a: '−8' },
      { tier: 1, type: 'std', q: 'Evaluate: −7 − 24', a: '−31' },
      { tier: 1, type: 'std', q: 'Evaluate: −62 − 14', a: '−76' },
      { tier: 1, type: 'std', q: 'Evaluate: −111 + 110', a: '−1' },
      { tier: 2, type: 'std', q: 'Evaluate: 5 + (−3)', a: '2' },
      { tier: 2, type: 'std', q: 'Evaluate: −2 + (−6)', a: '−8' },
      { tier: 2, type: 'std', q: 'Evaluate: 10 − (−6)', a: '16' },
      { tier: 2, type: 'std', q: 'Evaluate: −20 − (−32)', a: '12' },
      { tier: 2, type: 'std', q: 'Evaluate: 162 + (−201)', a: '−39' },
      { tier: 3, type: 'worded', q: 'The temperature fell from 4°C to −11°C overnight. What was the temperature drop?', a: '15°C' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Computation with integers',
    skill: 'Multiplying and dividing negative integers',
    vc: 'VC2M8N04',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: −5 × 2', a: '−10' },
      { tier: 1, type: 'std', q: 'Evaluate: −11 × (−8)', a: '88' },
      { tier: 1, type: 'std', q: 'Evaluate: 9 × (−7)', a: '−63' },
      { tier: 1, type: 'std', q: 'Evaluate: −100 × (−2)', a: '200' },
      { tier: 1, type: 'std', q: 'Evaluate: −10 ÷ (−5)', a: '2' },
      { tier: 1, type: 'std', q: 'Evaluate: 48 ÷ (−16)', a: '−3' },
      { tier: 1, type: 'std', q: 'Evaluate: −32 ÷ 8', a: '−4' },
      { tier: 2, type: 'std', q: 'Evaluate: −4 × 2 ÷ (−8)', a: '1' },
      { tier: 2, type: 'std', q: 'Evaluate: 30 ÷ (−15) × (−7)', a: '14' },
      { tier: 2, type: 'std', q: 'Evaluate: −15 × (−2) ÷ (−3) × (−2)', a: '20' },
      { tier: 3, type: 'worded', q: 'The product of two numbers is −24 and their sum is −5. What are the two numbers?', a: '−8 and 3 (or 8 and −3... check: −8 + 3 = −5 ✓, −8 × 3 = −24 ✓)' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Computation with integers',
    skill: 'Order of operations with integers',
    vc: 'VC2M8N04',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 2 + 3 × (−2)', a: '−4' },
      { tier: 1, type: 'std', q: 'Evaluate: −3 ÷ (11 + (−8))', a: '−1' },
      { tier: 1, type: 'std', q: 'Let a = −2, b = 3. Evaluate: ab + c where c = −5', a: '−11' },
      { tier: 2, type: 'std', q: 'Evaluate: −2 × 3 + 10 ÷ (−5)', a: '−8' },
      { tier: 2, type: 'std', q: 'Evaluate: −20 ÷ 10 − 4 × (−7)', a: '26' },
      { tier: 2, type: 'std', q: 'Let a = −2, b = 3, c = −5. Evaluate: a² − b', a: '1' },
      { tier: 2, type: 'std', q: 'Let a = −2, b = 3, c = −5. Evaluate: ac − b', a: '7' },
      { tier: 3, type: 'std', q: 'Evaluate: 5 × (−2 − (−3)) × (−2)', a: '−10' },
      { tier: 3, type: 'std', q: 'Evaluate: 15 ÷ (−2 + (−3)) + (−17)', a: '−20' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 2: ANGLE RELATIONSHIPS (Strand: Space)
  // VC2M8SP02: Establish properties using congruent triangles
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Space', topic: 'Angle relationships and geometrical figures',
    skill: 'Angle relationships — complementary, supplementary, vertically opposite',
    vc: 'VC2M8SP02',
    questions: [
      { tier: 1, type: 'std', q: 'Two angles are complementary. One is 40°. Find the other.', a: '50°' },
      { tier: 1, type: 'std', q: 'Two angles are supplementary. One is 115°. Find the other.', a: '65°' },
      { tier: 1, type: 'std', q: 'Vertically opposite angles: one is 36°. Find the other.', a: '36°' },
      { tier: 1, type: 'std', q: 'Angles on a straight line: one is 120°. Find the other.', a: '60°' },
      { tier: 2, type: 'std', q: 'Three angles on a straight line are 29°, 42° and a°. Find a.', a: '109°' },
      { tier: 2, type: 'std', q: 'Revolution: angles are 90°, 120° and a°. Find a.', a: '150°' },
      { tier: 3, type: 'worded', q: 'Angle AOB: OA makes 45° above horizontal left, OB makes 50° below horizontal right. Find ∠AOB.', a: '85°' },
    ]
  },

  {
    year: '8', strand: 'Space', topic: 'Angle relationships and geometrical figures',
    skill: 'Parallel lines — co-interior, alternate and corresponding angles',
    vc: 'VC2M8SP02',
    questions: [
      { tier: 1, type: 'std', q: 'Parallel lines: corresponding angle to 81° is:', a: '81° (corresponding angles are equal)' },
      { tier: 1, type: 'std', q: 'Parallel lines: co-interior angles are 132° and a°. Find a.', a: '48°' },
      { tier: 1, type: 'std', q: 'Parallel lines: alternate angle to 51° is:', a: '51° (alternate angles are equal)' },
      { tier: 2, type: 'std', q: 'Parallel lines cut by transversal: one co-interior angle is 103°. Find the other.', a: '77°' },
      { tier: 2, type: 'std', q: 'Find a in diagram with parallel lines where angles are 80°, 116° and a°.', a: '116° (co-interior with 64°, but alt angle with 116° gives a = 116°... check diagram)' },
      { tier: 3, type: 'worded', q: 'Two parallel lines cut by transversal. One angle is 150°. Find all 8 angles.', a: '150°, 30°, 150°, 30° (repeating — corresponding and vertical pairs)' },
    ]
  },

  {
    year: '8', strand: 'Space', topic: 'Angle relationships and geometrical figures',
    skill: 'Triangles — angle sum and exterior angles',
    vc: 'VC2M8SP02',
    questions: [
      { tier: 1, type: 'std', q: 'Triangle angles: 75° and 80°. Find the third angle.', a: '25°' },
      { tier: 1, type: 'std', q: 'Isosceles triangle: base angles each 71°. Find the apex angle.', a: '38°' },
      { tier: 1, type: 'std', q: 'Exterior angle of triangle is 85°. Two non-adjacent interior angles are 40° and a°. Find a.', a: '45°' },
      { tier: 2, type: 'std', q: 'Right triangle: one acute angle is 19°. Find the other.', a: '71°' },
      { tier: 2, type: 'std', q: 'Exterior angle = 152°. One non-adjacent angle = 70°. Find the other.', a: '82°' },
      { tier: 3, type: 'worded', q: 'A triangle has angles in ratio 2:3:4. Find each angle.', a: '40°, 60°, 80°' },
    ]
  },

  {
    year: '8', strand: 'Space', topic: 'Angle relationships and geometrical figures',
    skill: 'Quadrilaterals and polygons — angle sum',
    vc: 'VC2M8SP02',
    questions: [
      { tier: 1, type: 'std', q: 'Quadrilateral angles: 95°, 82°, 52° and a°. Find a.', a: '131°' },
      { tier: 1, type: 'std', q: 'Find the angle sum of a heptagon (7 sides)', a: '900°' },
      { tier: 1, type: 'std', q: 'Find the angle sum of a nonagon (9 sides)', a: '1260°' },
      { tier: 2, type: 'std', q: 'Find the size of each interior angle of a regular pentagon', a: '108°' },
      { tier: 2, type: 'std', q: 'Find the size of each interior angle of a regular dodecagon (12 sides)', a: '150°' },
      { tier: 3, type: 'worded', q: 'A regular polygon has interior angles of 162°. How many sides does it have?', a: '20 sides' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 3: FRACTIONS, DECIMALS AND PERCENTAGES (Strand: Number)
  // VC2M8N03, VC2M8N05
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Number', topic: 'Fractions, decimals and percentages',
    skill: 'Operations with fractions',
    vc: 'VC2M8N03',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 5/11 + 2/11', a: '7/11' },
      { tier: 1, type: 'std', q: 'Evaluate: 3/8 − 3/4 + 1/2', a: '1/8' },
      { tier: 1, type: 'std', q: 'Evaluate: (2/3) × 12', a: '8' },
      { tier: 1, type: 'std', q: 'Evaluate: 3 ÷ (1/2)', a: '6' },
      { tier: 1, type: 'std', q: 'Simplify: 25/45', a: '5/9' },
      { tier: 1, type: 'std', q: 'Evaluate: 3(1/4) − 1(2/3)', a: '1(7/12)' },
      { tier: 2, type: 'std', q: 'Evaluate: 2(1/3) + 3(1/5)', a: '5(8/15)' },
      { tier: 2, type: 'std', q: 'Evaluate: 3/7 × 1(1/12)', a: '5/12' },
      { tier: 2, type: 'std', q: 'Evaluate: 2(1/3) ÷ (3/4)', a: '3(1/9)' },
      { tier: 3, type: 'worded', q: 'A recipe needs 3/4 cup of sugar. If you make 2.5 batches, how much sugar?', a: '1(7/8) cups' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Fractions, decimals and percentages',
    skill: 'Operations with negative fractions',
    vc: 'VC2M8N03',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 2/5 − 1/3', a: '1/15' },
      { tier: 1, type: 'std', q: 'Evaluate: −(3/5) × (1/5)', a: '−3/25' },
      { tier: 2, type: 'std', q: 'Evaluate: 3/4 − (−1/5)', a: '19/20' },
      { tier: 2, type: 'std', q: 'Evaluate: 5/3 ÷ (−1/3)', a: '−5' },
      { tier: 2, type: 'std', q: 'Evaluate: −6(1/4) + (−1(1/3))', a: '−7(7/12)' },
      { tier: 3, type: 'worded', q: 'The temperature changes by −2/3°C each hour for 4.5 hours. Find total change.', a: '−3°C' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Fractions, decimals and percentages',
    skill: 'Operations with decimals',
    vc: 'VC2M8N03',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 12.31 + 2.34 + 15.73', a: '30.38' },
      { tier: 1, type: 'std', q: 'Evaluate: 14.203 − 1.4', a: '12.803' },
      { tier: 1, type: 'std', q: 'Evaluate: 569.74 × 100', a: '56974' },
      { tier: 1, type: 'std', q: 'Evaluate: 25.14 × 2000', a: '50280' },
      { tier: 1, type: 'std', q: 'Evaluate: 2.67 × 4', a: '10.68' },
      { tier: 1, type: 'std', q: 'Evaluate: 1.02 ÷ 4', a: '0.255' },
      { tier: 2, type: 'std', q: 'Evaluate: 2.67 × 0.04', a: '0.1068' },
      { tier: 2, type: 'std', q: 'Evaluate: 9.856 ÷ 0.05', a: '197.12' },
      { tier: 2, type: 'std', q: 'Evaluate: 1.8 ÷ 0.5', a: '3.6' },
      { tier: 3, type: 'worded', q: 'A car travels 12.6 km on 1.8 L of fuel. How many km per litre?', a: '7 km/L' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Fractions, decimals and percentages',
    skill: 'Converting fractions, decimals and percentages',
    vc: 'VC2M8N03',
    questions: [
      { tier: 1, type: 'std', q: 'Convert 0.75 to a fraction', a: '3/4' },
      { tier: 1, type: 'std', q: 'Convert 5% to a decimal', a: '0.05' },
      { tier: 1, type: 'std', q: 'Convert 1/3 to a percentage', a: '33.3%' },
      { tier: 1, type: 'std', q: 'Convert 0.1 to a percentage', a: '10%' },
      { tier: 1, type: 'std', q: 'Convert 50% to a fraction', a: '1/2' },
      { tier: 2, type: 'std', q: 'Convert 590% to a decimal', a: '5.9' },
      { tier: 2, type: 'std', q: 'Insert < or >: 11/20 __ 0.55', a: '= (they are equal)' },
      { tier: 2, type: 'std', q: 'Insert < or >: 2/3 __ 0.7', a: '< (0.667 < 0.7)' },
      { tier: 3, type: 'worded', q: 'A student scored 36/40 on a test. Express as a percentage.', a: '90%' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Fractions, decimals and percentages',
    skill: 'Finding percentages and percentage change',
    vc: 'VC2M8N05',
    questions: [
      { tier: 1, type: 'std', q: 'Find 30% of 80', a: '24' },
      { tier: 1, type: 'std', q: 'Find 15% of $70', a: '$10.50' },
      { tier: 1, type: 'std', q: 'Express $35 out of $40 as a percentage', a: '87.5%' },
      { tier: 1, type: 'std', q: 'Express 6 out of 24 as a percentage', a: '25%' },
      { tier: 2, type: 'std', q: 'Increase $560 by 10%', a: '$616' },
      { tier: 2, type: 'std', q: 'Decrease $4000 by 18%', a: '$3280' },
      { tier: 2, type: 'worded', q: 'A TV was $3999. Discounted 9%. Find the sale price.', a: '$3639.09' },
      { tier: 2, type: 'worded', q: 'Increase $980 by 5% then decrease by 5%. Find overall % loss.', a: '0.25% loss' },
      { tier: 3, type: 'worded', q: 'Johan saved 15% of his weekly wage. He saved $5304 per year. Find his weekly wage.', a: '$68 per week' },
      { tier: 3, type: 'worded', q: 'If 5% of an amount equals 56, what is 100%?', a: '1120' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 4: MEASUREMENT AND PYTHAGORAS (Strand: Measurement)
  // VC2M8M01, VC2M8M02, VC2M8M03
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Measurement', topic: 'Measurement and Pythagoras theorem',
    skill: 'Perimeter and circumference',
    vc: 'VC2M8M01',
    questions: [
      { tier: 1, type: 'std', q: 'Find circumference of circle with diameter 8 m (2 d.p.)', a: '25.13 m' },
      { tier: 1, type: 'std', q: 'Find perimeter of rectangle: 5 m × 3 m', a: '16 m' },
      { tier: 1, type: 'std', q: 'Convert: 2 m to mm', a: '2000 mm' },
      { tier: 1, type: 'std', q: 'Convert: 50 000 cm to km', a: '0.5 km' },
      { tier: 2, type: 'std', q: 'Find circumference of circle with radius 10 cm (2 d.p.)', a: '62.83 cm' },
      { tier: 2, type: 'std', q: 'A rectangle has perimeter 20 cm and length 6 cm. Find width.', a: '4 cm' },
      { tier: 3, type: 'worded', q: 'A wheel has diameter 60 cm. How many full rotations to travel 100 m?', a: 'approx. 53 rotations' },
    ]
  },

  {
    year: '8', strand: 'Measurement', topic: 'Measurement and Pythagoras theorem',
    skill: 'Area of triangles, quadrilaterals and circles',
    vc: 'VC2M8M01',
    questions: [
      { tier: 1, type: 'std', q: 'Find area of triangle: base 6 cm, height 11 cm', a: '33 cm²' },
      { tier: 1, type: 'std', q: 'Find area of circle: radius 7 m (2 d.p.)', a: '153.94 m²' },
      { tier: 1, type: 'std', q: 'Find area of rectangle: 18 m × 7 m', a: '126 m²' },
      { tier: 1, type: 'std', q: 'Convert: 3 cm² to mm²', a: '300 mm²' },
      { tier: 2, type: 'std', q: 'Find area of trapezium: parallel sides 8 m and 12 m, height 6 m', a: '60 m²' },
      { tier: 2, type: 'std', q: 'Find area of rhombus: diagonals 10 km and 14 km', a: '70 km²' },
      { tier: 2, type: 'std', q: 'Find area of sector: radius 3 cm, angle 110° (2 d.p.)', a: '8.64 cm²' },
      { tier: 3, type: 'worded', q: 'A circular pond has diameter 8 m. Find area of grass surrounding it in a 12 m × 12 m yard.', a: '(144 − 16π) ≈ 93.73 m²' },
    ]
  },

  {
    year: '8', strand: 'Measurement', topic: 'Measurement and Pythagoras theorem',
    skill: 'Volume of prisms and cylinders',
    vc: 'VC2M8M02',
    questions: [
      { tier: 1, type: 'std', q: 'Find volume of rectangular prism: 8 cm × 40 cm × 3 cm', a: '960 cm³' },
      { tier: 1, type: 'std', q: 'Convert: 400 cm³ to litres', a: '0.4 L' },
      { tier: 2, type: 'std', q: 'Find volume of cylinder: radius 7.5 mm, height 20 mm (2 d.p.)', a: '3534.29 mm³' },
      { tier: 2, type: 'std', q: 'Find volume of triangular prism: base triangle has b=12 cm, h=20 cm, length=10 cm', a: '1200 cm³' },
      { tier: 3, type: 'worded', q: 'A fish tank is 80 cm × 40 cm × 30 cm. How many litres does it hold?', a: '96 L' },
      { tier: 3, type: 'worded', q: 'Find volume of cylinder (r=14 cm, h=20 cm) in litres (2 d.p.)', a: '12.32 L' },
    ]
  },

  {
    year: '8', strand: 'Measurement', topic: 'Measurement and Pythagoras theorem',
    skill: 'Pythagoras theorem — finding the hypotenuse',
    vc: 'VC2M8M03',
    questions: [
      { tier: 1, type: 'std', q: 'Find hypotenuse: a = 6, b = 8', a: 'c = 10' },
      { tier: 1, type: 'std', q: 'Find hypotenuse: a = 8, b = 24 (use Pythagoras)', a: 'c = √640 ≈ 25.30' },
      { tier: 1, type: 'std', q: 'Find hypotenuse: a = 7, b = 7 (2 d.p.)', a: 'c ≈ 9.90' },
      { tier: 2, type: 'std', q: 'Is a triangle with sides 8, 15, 17 right-angled? Show working.', a: 'Yes: 8² + 15² = 64 + 225 = 289 = 17²' },
      { tier: 2, type: 'std', q: 'Find hypotenuse: legs 3 cm and 4 cm', a: '5 cm' },
      { tier: 3, type: 'worded', q: 'A ladder 5 m long leans against a wall. Its foot is 3 m from the wall. How high up the wall does it reach?', a: '4 m' },
    ]
  },

  {
    year: '8', strand: 'Measurement', topic: 'Measurement and Pythagoras theorem',
    skill: 'Pythagoras theorem — finding a shorter side',
    vc: 'VC2M8M03',
    questions: [
      { tier: 1, type: 'std', q: 'Find the missing side: hypotenuse = 20, one leg = 12', a: '16' },
      { tier: 1, type: 'std', q: 'Find the missing side: hypotenuse = 10, one leg = 8 (2 d.p.)', a: '6' },
      { tier: 1, type: 'std', q: 'Find the missing side: hypotenuse = 17, one leg = 8', a: '15' },
      { tier: 2, type: 'std', q: 'Find b: c = 23, a = 5 (2 d.p.)', a: 'b ≈ 22.45' },
      { tier: 3, type: 'worded', q: 'A 13 m rope is tied from the top of a pole to a point 5 m from the base. How tall is the pole?', a: '12 m' },
      { tier: 3, type: 'worded', q: 'A rectangle has diagonal 10 m and one side 6 m. Find the other side and area.', a: 'Other side = 8 m, Area = 48 m²' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 5: ALGEBRAIC TECHNIQUES AND INDEX LAWS (Strand: Algebra)
  // VC2M8A01, VC2M8N02
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Algebraic notation and substitution',
    vc: 'VC2M8A01',
    questions: [
      { tier: 1, type: 'std', q: 'For expression 6xy + 2x − 4y² + 3: state the coefficient of x', a: '2' },
      { tier: 1, type: 'std', q: 'For expression 6xy + 2x − 4y² + 3: state the constant term', a: '3' },
      { tier: 1, type: 'std', q: 'For expression 6xy + 2x − 4y² + 3: state number of terms', a: '4' },
      { tier: 1, type: 'std', q: 'Substitute a = −1 into 8 − a + 2a²', a: '11' },
      { tier: 1, type: 'std', q: 'Substitute a = 2 into 8 − a + 2a²', a: '14' },
      { tier: 2, type: 'std', q: 'Substitute x = 2, y = −3: find 2y + 3', a: '−3' },
      { tier: 2, type: 'std', q: 'Substitute x = 2, y = −3: find 4x − 2y', a: '14' },
      { tier: 2, type: 'std', q: 'Substitute x = 2, y = −3: find (−3x + 2y) ÷ (x + y)', a: '12' },
      { tier: 3, type: 'std', q: 'For what value of x is 3 − x equal to x − 3?', a: 'x = 3' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Adding and subtracting algebraic terms',
    vc: 'VC2M8A01',
    questions: [
      { tier: 1, type: 'std', q: 'Simplify: 7m + 9m', a: '16m' },
      { tier: 1, type: 'std', q: 'Simplify: 3a + 5b − a', a: '2a + 5b' },
      { tier: 1, type: 'std', q: 'Simplify: 5x + 3y + 2x + 4y', a: '7x + 7y' },
      { tier: 1, type: 'std', q: 'Simplify: x² − x + x² + 1', a: '2x² − x + 1' },
      { tier: 2, type: 'std', q: 'Simplify: 7x − 4x² + 5x² + 2x', a: 'x² + 9x' },
      { tier: 2, type: 'std', q: 'Simplify: −8m + 7m + 6n − 18n', a: '−m − 12n' },
      { tier: 3, type: 'worded', q: 'A rectangle has length (3x + 2) cm and width (x + 1) cm. Write a simplified expression for its perimeter.', a: '(8x + 6) cm' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Multiplying and dividing algebraic terms',
    vc: 'VC2M8A01',
    questions: [
      { tier: 1, type: 'std', q: 'Simplify: 9a × 4b', a: '36ab' },
      { tier: 1, type: 'std', q: 'Simplify: 30 × x × y ÷ 2', a: '15xy' },
      { tier: 1, type: 'std', q: 'Simplify: 12ab ÷ (24a²)', a: 'b/(2a)' },
      { tier: 2, type: 'std', q: 'Simplify: −8x × 4y ÷ (−2)', a: '16xy' },
      { tier: 2, type: 'std', q: 'Simplify: 5x/(2x²)', a: '5/(2x)' },
      { tier: 3, type: 'worded', q: 'A rectangle has area 12ab cm² and width 3a cm. Find the length.', a: '4b cm' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Expanding brackets',
    vc: 'VC2M8A01',
    questions: [
      { tier: 1, type: 'std', q: 'Expand: 3(x − 4)', a: '3x − 12' },
      { tier: 1, type: 'std', q: 'Expand: −2(5 + x)', a: '−10 − 2x' },
      { tier: 1, type: 'std', q: 'Expand: k(3l − 4m)', a: '3kl − 4km' },
      { tier: 1, type: 'std', q: 'Expand: 10(1 − 2x)', a: '10 − 20x' },
      { tier: 2, type: 'std', q: 'Expand and simplify: 7 + 3(2 − x)', a: '13 − 3x' },
      { tier: 2, type: 'std', q: 'Expand and simplify: 4(3x − 2) + 2(3x + 5)', a: '18x + 2' },
      { tier: 2, type: 'std', q: 'Expand and simplify: 2(x − 3y) + 5x', a: '7x − 6y' },
      { tier: 3, type: 'worded', q: 'Company A charges $120 + $80n. Company B charges $80 + $100n. When does A cost less than B?', a: 'When n < 2 (less than 2 hours)' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Factorising expressions',
    vc: 'VC2M8A01',
    questions: [
      { tier: 1, type: 'std', q: 'Factorise: 2x + 6', a: '2(x + 3)' },
      { tier: 1, type: 'std', q: 'Factorise: 24 − 16g', a: '8(3 − 2g)' },
      { tier: 1, type: 'std', q: 'Factorise: 12x + 3xy', a: '3x(4 + y)' },
      { tier: 2, type: 'std', q: 'Factorise: 7a² + 14ab', a: '7a(a + 2b)' },
      { tier: 2, type: 'std', q: 'Factorise fully: 3a² − 6ab', a: '3a(a − 2b)' },
      { tier: 3, type: 'worded', q: 'The area of a rectangle is (10x + 15) cm². One side is 5 cm. Find the other side.', a: '(2x + 3) cm' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Index laws — multiplication and division',
    vc: 'VC2M8N02',
    questions: [
      { tier: 1, type: 'std', q: 'Simplify: 7⁵ × 7²', a: '7⁷' },
      { tier: 1, type: 'std', q: 'Simplify: 5⁴ ÷ 5', a: '5³' },
      { tier: 1, type: 'std', q: 'Simplify: m² × m⁵', a: 'm⁷' },
      { tier: 1, type: 'std', q: 'Simplify: m⁵ ÷ m³', a: 'm²' },
      { tier: 2, type: 'std', q: 'Simplify: 3m⁷ × 4m', a: '12m⁸' },
      { tier: 2, type: 'std', q: 'Simplify: 12a⁶ ÷ (6a²)', a: '2a⁴' },
      { tier: 2, type: 'std', q: 'Simplify: (x³)⁴', a: 'x¹²' },
      { tier: 3, type: 'std', q: 'Simplify: (2a²)³', a: '8a⁶' },
      { tier: 3, type: 'std', q: 'Simplify: (m⁴)³ ÷ (m³)²', a: 'm⁶' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Algebraic techniques and index laws',
    skill: 'Zero index and power of a power',
    vc: 'VC2M8N02',
    questions: [
      { tier: 1, type: 'std', q: 'Evaluate: 7a⁰', a: '7' },
      { tier: 1, type: 'std', q: 'Evaluate: (2x³)⁰ × 2(x³)⁰', a: '2' },
      { tier: 2, type: 'std', q: 'Simplify: (2y³)² × y⁴', a: '4y¹⁰' },
      { tier: 2, type: 'std', q: 'Simplify: (2b)³ ÷ (4b²)', a: '2b' },
      { tier: 2, type: 'std', q: 'Simplify: −10x⁶y³z⁴ ÷ (5x²yz²)', a: '−2x⁴y²z²' },
      { tier: 3, type: 'std', q: 'Simplify: (d³e³y⁵)² × e⁶ ÷ e⁷ ÷ (dy)', a: 'd⁵e⁵y⁹' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 6: RATIOS AND RATES (Strand: Number)
  // VC2M8N05
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Number', topic: 'Ratios and rates',
    skill: 'Simplifying and applying ratios',
    vc: 'VC2M8N05',
    questions: [
      { tier: 1, type: 'std', q: 'Simplify the ratio 10 : 40', a: '1 : 4' },
      { tier: 1, type: 'std', q: 'Simplify the ratio 36 : 24', a: '3 : 2' },
      { tier: 1, type: 'std', q: 'Simplify: 52 : 26', a: '2 : 1' },
      { tier: 1, type: 'std', q: 'Simplify: 5 : 25', a: '1 : 5' },
      { tier: 1, type: 'std', q: 'Simplify: 30 min : 1 hour', a: '1 : 2' },
      { tier: 2, type: 'std', q: 'Divide $80 in the ratio 7 : 9', a: '$35 : $45' },
      { tier: 2, type: 'std', q: 'Divide 200 kg in the ratio 4 : 1', a: '160 kg : 40 kg' },
      { tier: 2, type: 'worded', q: 'Orange and pineapple juice mixed 4:3. If 250 mL pineapple used, find total volume.', a: '583.3 mL' },
      { tier: 3, type: 'worded', q: 'Sally and Ben\'s heights are in ratio 12:17. The difference is 60 cm. How tall is Sally?', a: '144 cm' },
    ]
  },

  {
    year: '8', strand: 'Number', topic: 'Ratios and rates',
    skill: 'Rates and speed',
    vc: 'VC2M8N05',
    questions: [
      { tier: 1, type: 'std', q: 'Convert 60 km/h to m/s', a: '16.67 m/s' },
      { tier: 1, type: 'std', q: 'A car travels 240 km in 3 hours. Find speed in km/h.', a: '80 km/h' },
      { tier: 1, type: 'std', q: 'Find time to travel 150 km at 50 km/h', a: '3 hours' },
      { tier: 2, type: 'std', q: 'Find distance if speed = 72 km/h for 2.5 hours', a: '180 km' },
      { tier: 2, type: 'worded', q: 'A tap fills a 120 L tank in 8 minutes. How long to fill 300 L tank?', a: '20 minutes' },
      { tier: 3, type: 'worded', q: 'Train A travels at 80 km/h, Train B at 100 km/h. They start 540 km apart heading toward each other. When do they meet?', a: '3 hours' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 7: EQUATIONS AND INEQUALITIES (Strand: Algebra)
  // VC2M8A03
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Algebra', topic: 'Equations and inequalities',
    skill: 'Solving linear equations — one and two steps',
    vc: 'VC2M8A03',
    questions: [
      { tier: 1, type: 'std', q: 'Solve: 4m = 16', a: 'm = 4' },
      { tier: 1, type: 'std', q: 'Solve: m/3 = −4', a: 'm = −12' },
      { tier: 1, type: 'std', q: 'Solve: 9 − a = 10', a: 'a = −1' },
      { tier: 1, type: 'std', q: 'Solve: a + 8 = 12', a: 'a = 4' },
      { tier: 1, type: 'std', q: 'Solve: 5 + 3x = 17', a: 'x = 4' },
      { tier: 1, type: 'std', q: 'Solve: 2x − 1 = −9', a: 'x = −4' },
      { tier: 2, type: 'std', q: 'Solve: 5x/2 = 20', a: 'x = 8' },
      { tier: 2, type: 'std', q: 'Solve: k/3 + 3 = −5', a: 'k = −24' },
      { tier: 2, type: 'std', q: 'Solve: (2a − 8)/6 = 13', a: 'a = 47' },
      { tier: 3, type: 'worded', q: 'The sum of three consecutive numbers is 39. Find the smallest.', a: '12' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Equations and inequalities',
    skill: 'Equations with brackets and both sides',
    vc: 'VC2M8A03',
    questions: [
      { tier: 1, type: 'std', q: 'Solve: 8a − 3 = 7a + 5', a: 'a = 8' },
      { tier: 1, type: 'std', q: 'Solve: 2 − 3m = m', a: 'm = 1/2' },
      { tier: 1, type: 'std', q: 'Solve: 2(x + 5) = 16', a: 'x = 3' },
      { tier: 2, type: 'std', q: 'Solve: 3(x + 1) = −9', a: 'x = −4' },
      { tier: 2, type: 'std', q: 'Solve: 3(2a + 1) = 27', a: 'a = 4' },
      { tier: 2, type: 'std', q: 'Solve: 5(a + 4) = 3(a + 2)', a: 'a = −7' },
      { tier: 2, type: 'std', q: 'Solve: 4(2x − 1) − 3(x − 2) = 10x − 3', a: 'x = 7' },
      { tier: 3, type: 'worded', q: 'Four times a number less 5 equals double the number plus 3. Find the number.', a: '4' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Equations and inequalities',
    skill: 'Formulas and solving inequalities',
    vc: 'VC2M8A03',
    questions: [
      { tier: 1, type: 'std', q: 'If P = 2(l + b), find l when P = 48 and b = 3', a: 'l = 21' },
      { tier: 1, type: 'std', q: 'If F = 2.5c + 20, find c when F = 30', a: 'c = 4' },
      { tier: 1, type: 'std', q: 'Solve inequality: x + 3 > 5', a: 'x > 2' },
      { tier: 1, type: 'std', q: 'Solve inequality: x − 2 < 6', a: 'x < 8' },
      { tier: 2, type: 'std', q: 'Solve: 6x ≥ 12', a: 'x ≥ 2' },
      { tier: 2, type: 'std', q: 'Solve: 4x < −8', a: 'x < −2' },
      { tier: 2, type: 'std', q: 'Solve: (2x + 1)/3 > 9', a: 'x > 13' },
      { tier: 3, type: 'worded', q: 'To ride a roller-coaster height must be between 1.54 m and 1.9 m. Write an inequality.', a: '1.54 ≤ h ≤ 1.9' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 8: PROBABILITY AND STATISTICS (Strand: Statistics/Probability)
  // VC2M8ST01, VC2M8P01
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Statistics and Probability', topic: 'Probability and statistics',
    skill: 'Measures of centre — mean, median and mode',
    vc: 'VC2M8ST01',
    questions: [
      { tier: 1, type: 'std', q: 'Find mean: 3, 7, 8, 8, 9', a: '7' },
      { tier: 1, type: 'std', q: 'Find median: 2, 5, 5, 8, 10, 12', a: '6.5' },
      { tier: 1, type: 'std', q: 'Find mode: 3, 7, 8, 8, 9', a: '8' },
      { tier: 2, type: 'std', q: 'Data: 2, 5, 5, 8, 10, 12. Find mean.', a: '7' },
      { tier: 2, type: 'worded', q: '20 students studied. Hours: 0(2), 1(6), 2(3), 3(3), 4(8). Find mean hours (1 d.p.)', a: '2.4 hours' },
      { tier: 2, type: 'worded', q: 'Ages of boys: 10(3), 11(8), 12(12), 13(4), 14(3). Find mean age (2 d.p.)', a: '11.73' },
      { tier: 3, type: 'worded', q: 'Mean of 5 numbers is 12. A 6th number is added making mean 13. Find the 6th number.', a: '18' },
    ]
  },

  {
    year: '8', strand: 'Statistics and Probability', topic: 'Probability and statistics',
    skill: 'Probability of single and two-step events',
    vc: 'VC2M8P01',
    questions: [
      { tier: 1, type: 'std', q: 'A fair die is rolled. P(even) = ?', a: '1/2' },
      { tier: 1, type: 'std', q: 'A fair die is rolled. P(>4) = ?', a: '1/3' },
      { tier: 1, type: 'std', q: 'A bag has 3 red and 5 blue. P(red) = ?', a: '3/8' },
      { tier: 2, type: 'std', q: 'Two coins flipped. List sample space and find P(2 heads).', a: 'Sample space: HH, HT, TH, TT. P(HH) = 1/4' },
      { tier: 2, type: 'std', q: 'A card is drawn from {1,2,3,4,5,6,7,8,9,10}. P(even or >7) = ?', a: '7/10' },
      { tier: 3, type: 'worded', q: 'P(A) = 0.3, P(B) = 0.2, A and B mutually exclusive. Find P(A or B).', a: '0.5' },
      { tier: 3, type: 'worded', q: 'Two dice rolled. Find P(sum = 7).', a: '6/36 = 1/6' },
    ]
  },

  {
    year: '8', strand: 'Statistics and Probability', topic: 'Probability and statistics',
    skill: 'Venn diagrams and two-way tables',
    vc: 'VC2M8P01',
    questions: [
      { tier: 1, type: 'std', q: '30 students: 18 play soccer, 12 play tennis, 5 play both. How many play neither?', a: '5' },
      { tier: 2, type: 'std', q: 'In a class of 30: 15 like maths, 12 like science, 8 like both. Find P(likes maths only).', a: '7/30' },
      { tier: 2, type: 'std', q: 'A two-way table shows: 20 students total — 12 boys (8 pass, 4 fail), 8 girls (6 pass, 2 fail). P(girl | pass) = ?', a: '6/14 = 3/7' },
      { tier: 3, type: 'worded', q: 'Of 100 people: 60 own a cat, 40 own a dog, 20 own both. Find P(own a cat but not a dog).', a: '40/100 = 2/5' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 9: LINEAR RELATIONSHIPS (Strand: Algebra)
  // VC2M8A02, VC2M8A04
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Algebra', topic: 'Linear relationships',
    skill: 'Graphing linear relationships — tables and rules',
    vc: 'VC2M8A02',
    questions: [
      { tier: 1, type: 'std', q: 'For y = 2x, find y when x = −3', a: '−6' },
      { tier: 1, type: 'std', q: 'For y = 3x − 1, find y when x = 2', a: '5' },
      { tier: 1, type: 'std', q: 'Write the rule for: x: −2,−1,0,1,2 and y: −3,−1,1,3,5', a: 'y = 2x + 1' },
      { tier: 1, type: 'std', q: 'Write the rule for: x: 3,4,5,6,7 and y: 6,7,8,9,10', a: 'y = x + 3' },
      { tier: 2, type: 'std', q: 'Find x-intercept of y = 2x − 12', a: 'x = 6' },
      { tier: 2, type: 'std', q: 'Find y-intercept of y = 3x + 9', a: 'y = 9' },
      { tier: 2, type: 'std', q: 'Find both intercepts of y = −4x + 8', a: 'x-int = 2, y-int = 8' },
      { tier: 3, type: 'worded', q: 'A plumber charges $60 call-out plus $45/hour. Write rule for cost C after h hours.', a: 'C = 45h + 60' },
    ]
  },

  {
    year: '8', strand: 'Algebra', topic: 'Linear relationships',
    skill: 'Gradient and y = mx + c',
    vc: 'VC2M8A02',
    questions: [
      { tier: 1, type: 'std', q: 'Find gradient of line through (0,0) and (3,−12)', a: '−4' },
      { tier: 1, type: 'std', q: 'Find gradient of line through (1,1) and (4,4)', a: '1' },
      { tier: 1, type: 'std', q: 'State gradient and y-intercept of y = 5x + 2', a: 'm = 5, c = 2' },
      { tier: 1, type: 'std', q: 'State gradient and y-intercept of y = −3x + 7', a: 'm = −3, c = 7' },
      { tier: 2, type: 'std', q: 'Find gradient of line through (−4,2) and (0,0)', a: '−1/2' },
      { tier: 2, type: 'std', q: 'Find rule of line through (0,0) and (1,6)', a: 'y = 6x' },
      { tier: 2, type: 'std', q: 'Find rule of line through (−2,3) and (0,1)', a: 'y = −x + 1' },
      { tier: 3, type: 'worded', q: 'A taxi charges $3 flag fall plus $2.50/km. Write equation and find cost for 12 km.', a: 'C = 2.5d + 3; $33' },
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 10: TRANSFORMATIONS AND CONGRUENCE (Strand: Space)
  // VC2M8SP01, VC2M8SP02, VC2M8SP03
  // ══════════════════════════════════════════════════════════════════

  {
    year: '8', strand: 'Space', topic: 'Transformations and congruence',
    skill: 'Reflection, translation and rotation',
    vc: 'VC2M8SP01',
    questions: [
      { tier: 1, type: 'std', q: 'Triangle A(1,2), B(3,4), C(0,2) reflected in x-axis. Find A\'', a: "A'(1,−2)" },
      { tier: 1, type: 'std', q: 'Triangle A(1,2), B(3,4), C(0,2) reflected in y-axis. Find B\'', a: "B'(−3,4)" },
      { tier: 1, type: 'std', q: 'How many lines of symmetry does a rectangle have?', a: '2' },
      { tier: 1, type: 'std', q: 'How many lines of symmetry does a regular hexagon have?', a: '6' },
      { tier: 2, type: 'std', q: 'A(2,5) translated to A\'(3,9). Write the translation vector.', a: '(1, 4)' },
      { tier: 2, type: 'std', q: 'A(−1,4) translated to A\'(2,−2). Write the translation vector.', a: '(3, −6)' },
      { tier: 3, type: 'worded', q: 'A shape has rotational symmetry of order 4. What is the smallest rotation angle?', a: '90°' },
    ]
  },

  {
    year: '8', strand: 'Space', topic: 'Transformations and congruence',
    skill: 'Congruent triangles — conditions SSS, SAS, AAS, RHS',
    vc: 'VC2M8SP02',
    questions: [
      { tier: 1, type: 'std', q: 'Two triangles have all three sides equal. Which congruence test applies?', a: 'SSS (Side-Side-Side)' },
      { tier: 1, type: 'std', q: 'Two triangles have two sides and the included angle equal. Which test?', a: 'SAS (Side-Angle-Side)' },
      { tier: 1, type: 'std', q: 'Two right triangles have equal hypotenuses and one equal leg. Which test?', a: 'RHS (Right angle-Hypotenuse-Side)' },
      { tier: 2, type: 'std', q: 'Congruent triangles: one has angles 18° and 25°, x° is corresponding to 18°. Find x.', a: 'x = 18°' },
      { tier: 2, type: 'std', q: 'If triangles ABC ≅ DEF, name the side in DEF corresponding to BC.', a: 'EF' },
      { tier: 3, type: 'worded', q: 'Prove a diagonal of a rectangle creates two congruent triangles. State which test.', a: 'SAS (two sides are equal as opposite sides of rectangle, angle between them = 90°)' },
    ]
  },

  {
    year: '8', strand: 'Space', topic: 'Transformations and congruence',
    skill: 'Similar figures and scale factor',
    vc: 'VC2M8SP03',
    questions: [
      { tier: 1, type: 'std', q: 'Two similar triangles have scale factor 3. If smaller has side 5 cm, find corresponding larger side.', a: '15 cm' },
      { tier: 1, type: 'std', q: 'Find scale factor: original side 8 cm, image side 12 cm', a: '3/2 or 1.5' },
      { tier: 2, type: 'std', q: 'Similar rectangles: small is 4 cm × 6 cm, large has longer side 9 cm. Find shorter side.', a: '6 cm' },
      { tier: 2, type: 'std', q: 'Map scale 1:1000. Scale length 2.7 cm → real length?', a: '27 m' },
      { tier: 3, type: 'worded', q: 'A photo 10 cm × 15 cm is enlarged with scale factor 2.5. Find dimensions and area of enlargement.', a: '25 cm × 37.5 cm, area = 937.5 cm²' },
    ]
  },
]

// ── SEED FUNCTION ─────────────────────────────────────────────
export async function seedYear8(user) {
  console.log('Starting Year 8 seed...')
  let skillCount = 0
  let questionCount = 0
  let errors = 0

  for (const item of YEAR8_CURRICULUM) {
    // Upsert skill
    const { data: skillRow, error: skillErr } = await supabase
      .from('skills')
      .upsert({
        year_level: item.year,
        strand: item.strand,
        topic: item.topic,
        skill_name: item.skill,
        vc_code: item.vc || '',
        prerequisites: [],
        is_shared: true,
        created_by: user.id,
      }, { onConflict: 'year_level,strand,topic,skill_name', ignoreDuplicates: false })
      .select('id')
      .single()

    if (skillErr) {
      console.error('Skill error:', skillErr.message, item.skill)
      errors++
      continue
    }

    let skillId = skillRow?.id
    if (!skillId) {
      const { data: existing } = await supabase
        .from('skills')
        .select('id')
        .eq('year_level', item.year)
        .eq('strand', item.strand)
        .eq('topic', item.topic)
        .eq('skill_name', item.skill)
        .single()
      skillId = existing?.id
    }
    if (!skillId) { errors++; continue }

    skillCount++

    // Delete existing questions for this skill
    await supabase.from('questions').delete().eq('skill_id', skillId)

    // Insert questions
    for (const q of item.questions) {
      const { error: qErr } = await supabase.from('questions').insert({
        skill_id: skillId,
        tier: q.tier,
        question_type: q.type || 'std',
        question_text: q.q,
        answer_text: q.a,
        vc_code: item.vc || '',
        is_shared: true,
        created_by: user.id,
      })
      if (qErr) { errors++ } else { questionCount++ }
    }
  }

  console.log(`Year 8 seed complete: ${skillCount} skills, ${questionCount} questions, ${errors} errors`)
  return { skillCount, questionCount, errors }
}
