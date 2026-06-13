import type { LevelSpecification } from '../levelSpecs';

const trianglesSpecs: Record<string, LevelSpecification> = {

  // ═════════════════════════════════════════════════════════════════
  // WORLD 1 — Triangle Foundations (Levels 1–6)
  // ═════════════════════════════════════════════════════════════════

  "lvl-tri-01": {
    id: "lvl-tri-01",
    question: "Construct a triangle with vertices at draggable points. Enter the perimeter when sides are 3, 4, and 5 units.",
    inputLabel: "Perimeter",
    placeholder: "Enter perimeter...",
    correctAnswer: 12,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Perimeter = ${val}`,
    formulaDisplay: "Perimeter = a + b + c = 3 + 4 + 5 = 12",
    bookPage: {
      title: "📖 Triangle Construction",
      concept: "A triangle has 3 sides, 3 vertices, and 3 angles. The sum of any two sides must be greater than the third side (Triangle Inequality Theorem).",
      formulaBreakdown: "Perimeter = side₁ + side₂ + side₃",
      stepByStep: [
        "Identify the three sides of the triangle.",
        "Add all three sides together: 3 + 4 + 5.",
        "The result is the perimeter: 12 units.",
        "Verify: 3+4>5 ✓, 4+5>3 ✓, 3+5>4 ✓"
      ],
      visualTip: "Drag vertices to form a stable triangle. Ensure sides satisfy triangle inequality!"
    }
  },

  "lvl-tri-02": {
    id: "lvl-tri-02",
    question: "Match the target triangle shape. If target sides are 6, 8, 10, what is the ratio to the reference triangle with sides 3, 4, 5?",
    inputLabel: "Scale Ratio",
    placeholder: "Enter ratio...",
    correctAnswer: 2,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `k = ${val}`,
    formulaDisplay: "k = 6/3 = 8/4 = 10/5 = 2",
    bookPage: {
      title: "📖 Matching Triangle Shapes",
      concept: "Two triangles have the same shape if their corresponding sides are in proportion. This is the foundation of similar triangles!",
      formulaBreakdown: "Scale Factor k = New Side / Original Side",
      stepByStep: [
        "Compare corresponding sides: 6/3 = 2.",
        "Verify: 8/4 = 2 ✓, 10/5 = 2 ✓.",
        "All ratios equal 2, so k = 2.",
        "The triangles are similar with scale factor 2."
      ],
      visualTip: "Look for triangles where all sides scale by the same factor. The 3-4-5 and 6-8-10 are both right triangles!"
    }
  },

  "lvl-tri-03": {
    id: "lvl-tri-03",
    question: "Resize a triangle from sides 5, 12, 13 to double the size. What is the new longest side?",
    inputLabel: "New Hypotenuse",
    placeholder: "Enter length...",
    correctAnswer: 26,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Longest side = ${val}`,
    formulaDisplay: "New Side = Original × k = 13 × 2 = 26",
    bookPage: {
      title: "📖 Scaling Triangles",
      concept: "When you scale a triangle, all sides multiply by the same factor k. Angles remain unchanged! The 5-12-13 triangle is a Pythagorean triple.",
      formulaBreakdown: "Scaled Side = Original Side × k (scale factor)",
      stepByStep: [
        "Identify the scale factor: k = 2 (doubling).",
        "Original sides: 5, 12, 13.",
        "New sides: 5×2=10, 12×2=24, 13×2=26.",
        "The longest side (hypotenuse) = 26."
      ],
      visualTip: "Scaling preserves angles. A scaled triangle is similar to the original!"
    }
  },

  "lvl-tri-04": {
    id: "lvl-tri-04",
    question: "Balance a triangular support structure. If two sides are 6 and 8 units, what is the minimum possible third side?",
    inputLabel: "Minimum Third Side",
    placeholder: "Enter length...",
    correctAnswer: 3,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `c > ${val}`,
    formulaDisplay: "c > |8 - 6| = 2, so minimum integer = 3",
    bookPage: {
      title: "📖 Triangular Stability",
      concept: "For any triangle, the sum of any two sides must exceed the third side. This is the Triangle Inequality Theorem.",
      formulaBreakdown: "a + b > c, b + c > a, a + c > b",
      stepByStep: [
        "Apply triangle inequality: third side > |a - b|.",
        "Calculate: |8 - 6| = 2.",
        "Third side must be > 2.",
        "Minimum integer value = 3."
      ],
      visualTip: "A stable triangle cannot be 'flat'. The third side must be long enough to connect the other two!"
    }
  },

  "lvl-tri-05": {
    id: "lvl-tri-05",
    question: "Build a geometric frame using two identical triangles. Each triangle has sides 6, 8, and 10. What is the combined total perimeter of both triangles together?",
    inputLabel: "Combined Perimeter",
    placeholder: "Enter total...",
    correctAnswer: 48,
    tolerance: 1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Total = ${val}`,
    formulaDisplay: "Perimeter₁ + Perimeter₂ = (6+8+10) + (6+8+10) = 24 + 24 = 48",
    bookPage: {
      title: "📖 Geometric Frame Building",
      concept: "When two identical triangles form a frame, the combined perimeter is simply the sum of both individual perimeters. Each triangle with sides 6, 8, 10 is a right triangle (Pythagorean triple: 3-4-5 scaled by 2).",
      formulaBreakdown: "Total = Perimeter₁ + Perimeter₂ = (6+8+10) × 2",
      stepByStep: [
        "Triangle 1 sides: 6, 8, 10. Perimeter₁ = 6 + 8 + 10 = 24.",
        "Triangle 2 sides: 6, 8, 10 (identical). Perimeter₂ = 24.",
        "Combined total = 24 + 24 = 48.",
        "Note: 6-8-10 is a right triangle (3-4-5 scaled by 2) ✓"
      ],
      visualTip: "Both triangles are right triangles. Combined perimeter = 2 × 24 = 48."
    }
  },

  "lvl-tri-06": {
    id: "lvl-tri-06",
    question: "Timed Challenge: Construct a right triangle with legs 6 and 8. What is the hypotenuse?",
    inputLabel: "Hypotenuse",
    placeholder: "Enter length...",
    correctAnswer: 10,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `c = ${val}`,
    formulaDisplay: "c = √(6² + 8²) = √(36 + 64) = √100 = 10",
    bookPage: {
      title: "📖 Right Triangle Mastery",
      concept: "In a right triangle: hypotenuse² = leg₁² + leg₂². This is the Pythagorean theorem!",
      formulaBreakdown: "c² = a² + b², so c = √(a² + b²)",
      stepByStep: [
        "Square both legs: 6² = 36, 8² = 64.",
        "Add: 36 + 64 = 100.",
        "Take square root: √100 = 10.",
        "The 6-8-10 triangle is a scaled 3-4-5 triple!"
      ],
      visualTip: "The 6-8-10 triangle is a scaled 3-4-5 right triangle - memorize common Pythagorean triples!"
    }
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 2 — Similar Triangles (Levels 7–12)
  // ═════════════════════════════════════════════════════════════════

  "lvl-tri-07": {
    id: "lvl-tri-07",
    question: "Scale Match: Two triangles are similar with ratio 2:1. If the smaller triangle has area 12, what is the area of the larger triangle?",
    inputLabel: "Larger Area",
    placeholder: "Enter area...",
    correctAnswer: 48,
    tolerance: 1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Area = ${val}`,
    formulaDisplay: "Area Ratio = k² = 2² = 4, so Area = 12 × 4 = 48",
    bookPage: {
      title: "📖 Similar Triangles Basics",
      concept: "Two triangles are similar if their corresponding angles are equal and sides are proportional. Area scales with the SQUARE of the scale factor!",
      formulaBreakdown: "Area Ratio = k² where k is the scale factor",
      stepByStep: [
        "Identify the scale factor: k = 2 (ratio 2:1).",
        "Area ratio = k² = 4.",
        "Larger area = 12 × 4 = 48.",
        "When sides double, area becomes 4× larger!"
      ],
      visualTip: "When you double all sides, area becomes 4× larger! Area grows as the SQUARE of scale factor."
    }
  },

  "lvl-tri-08": {
    id: "lvl-tri-08",
    question: "Corresponding Sides: Triangle ABC ~ Triangle DEF. If AB=6, BC=8, AC=10, and DE=3, find EF.",
    inputLabel: "Side EF",
    placeholder: "Enter length...",
    correctAnswer: 4,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `EF = ${val}`,
    formulaDisplay: "AB/DE = BC/EF → 6/3 = 8/EF → EF = 4",
    bookPage: {
      title: "📖 Identifying Corresponding Sides",
      concept: "In similar triangles, corresponding sides are opposite equal angles and are in proportion.",
      formulaBreakdown: "Corresponding sides maintain constant ratio",
      stepByStep: [
        "Find scale factor: AB/DE = 6/3 = 2.",
        "Corresponding side EF = BC/2 = 8/2 = 4.",
        "Verify: All corresponding sides have ratio 2:1.",
        "Match angles first, then find corresponding sides."
      ],
      visualTip: "Match angles first, then sides opposite those angles correspond."
    }
  },

  "lvl-tri-09": {
    id: "lvl-tri-09",
    question: "Holographic Triangle: A triangle with sides 4, 6, 8 is scaled to ratio 3:1. What is the perimeter of the scaled triangle?",
    inputLabel: "New Perimeter",
    placeholder: "Enter perimeter...",
    correctAnswer: 54,
    tolerance: 1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Perimeter = ${val}`,
    formulaDisplay: "New Perimeter = (4+6+8) × 3 = 18 × 3 = 54",
    bookPage: {
      title: "📖 Scaling with Ratio 3:1",
      concept: "Scale factor 3 means every linear dimension triples. Perimeter scales LINEARLY with the scale factor.",
      formulaBreakdown: "New Side = Original × k, Perimeter scales linearly",
      stepByStep: [
        "Original perimeter: 4 + 6 + 8 = 18.",
        "Scale factor k = 3.",
        "New perimeter: 18 × 3 = 54.",
        "Perimeter scales linearly, unlike area which scales squared."
      ],
      visualTip: "Perimeter scales linearly with the scale factor, but area scales as k²!"
    }
  },

  "lvl-tri-10": {
    id: "lvl-tri-10",
    question: "Reactor Repair: Two similar triangles have areas 25 and 100. What is their scale factor?",
    inputLabel: "Scale Factor",
    placeholder: "Enter ratio...",
    correctAnswer: 2,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `k = ${val}`,
    formulaDisplay: "k = √(100/25) = √4 = 2",
    bookPage: {
      title: "📖 Area Ratio and Scale Factor",
      concept: "Area ratio equals the square of the scale factor. If you know the areas, you can find k!",
      formulaBreakdown: "k = √(Area Ratio)",
      stepByStep: [
        "Calculate area ratio: 100/25 = 4.",
        "Scale factor = √4 = 2.",
        "The larger triangle has sides twice as long.",
        "Verify: k² = 4 ✓ matches area ratio."
      ],
      visualTip: "Area grows faster than side length - it is squared!"
    }
  },

  "lvl-tri-11": {
    id: "lvl-tri-11",
    question: "Perfect Clone: Create a scaled clone with ratio 1.5. If original sides are 4, 6, 8, what is the middle side of the clone?",
    inputLabel: "Middle Side",
    placeholder: "Enter length...",
    correctAnswer: 9,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Middle side = ${val}`,
    formulaDisplay: "New Side = 6 × 1.5 = 9",
    bookPage: {
      title: "📖 Creating Perfect Scaled Clones",
      concept: "To clone a triangle perfectly, scale all sides by the same factor. The shape stays identical!",
      formulaBreakdown: "Each side × scale factor",
      stepByStep: [
        "Identify middle side: 6.",
        "Apply scale factor: 6 × 1.5 = 9.",
        "All sides scale proportionally: 6, 9, 12.",
        "New triangle sides: 4×1.5=6, 6×1.5=9, 8×1.5=12."
      ],
      visualTip: "A perfect clone maintains all angles and proportions."
    }
  },

  "lvl-tri-12": {
    id: "lvl-tri-12",
    question: "Synchronization Puzzle: Three similar triangles have scale factors 2, 3, and 4 from a reference. If the reference has area 5, what is the total area of all three?",
    inputLabel: "Total Area",
    placeholder: "Enter total...",
    correctAnswer: 145,
    tolerance: 2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Total = ${val}`,
    formulaDisplay: "Areas: 5×4 + 5×9 + 5×16 = 20 + 45 + 80 = 145",
    bookPage: {
      title: "📖 Multiple Similar Triangles",
      concept: "When working with multiple similar triangles, each area scales by k². Sum them up for total area!",
      formulaBreakdown: "Area = Reference × k²",
      stepByStep: [
        "k=2: Area = 5 × 4 = 20.",
        "k=3: Area = 5 × 9 = 45.",
        "k=4: Area = 5 × 16 = 80.",
        "Total: 20 + 45 + 80 = 145."
      ],
      visualTip: "Synchronize multiple triangles by maintaining common ratios."
    }
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 3 — Basic Proportionality Theorem (Levels 13–18)
  // ═════════════════════════════════════════════════════════════════

  "lvl-tri-13": {
    id: "lvl-tri-13",
    question: "BPT Division: In triangle ABC, DE || BC with AD=2, DB=3. If AE=4, find EC.",
    inputLabel: "Length EC",
    placeholder: "Enter length...",
    correctAnswer: 6,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `EC = ${val}`,
    formulaDisplay: "AD/DB = AE/EC → 2/3 = 4/EC → EC = 6",
    bookPage: {
      title: "📖 Basic Proportionality Theorem (BPT)",
      concept: "If a line is parallel to one side of a triangle and intersects the other two sides, it divides them proportionally. This is also called Thales Theorem!",
      formulaBreakdown: "AD/DB = AE/EC (Thales Theorem)",
      stepByStep: [
        "Identify parallel line DE to base BC.",
        "Set up proportion: AD/DB = AE/EC.",
        "Substitute: 2/3 = 4/EC.",
        "Cross multiply: 2×EC = 12, so EC = 6."
      ],
      visualTip: "Parallel lines create proportional segments on transversals."
    }
  },

  "lvl-tri-14": {
    id: "lvl-tri-14",
    question: "Bridge Balance: A triangular bridge has DE || BC. If AD=3, AB=12, and AE=4, find AC.",
    inputLabel: "Length AC",
    placeholder: "Enter length...",
    correctAnswer: 16,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AC = ${val}`,
    formulaDisplay: "AD/AB = AE/AC → 3/12 = 4/AC → AC = 16",
    bookPage: {
      title: "📖 BPT in Real Structures",
      concept: "BPT helps engineers design stable triangular supports and bridges. The proportionality ensures even load distribution!",
      formulaBreakdown: "AD/AB = AE/AC or AD/DB = AE/EC",
      stepByStep: [
        "Given: AD=3, AB=12, so DB=9.",
        "Apply BPT: 3/12 = 4/AC.",
        "Cross multiply: 3×AC = 48.",
        "AC = 16."
      ],
      visualTip: "Bridges use triangular trusses with parallel supports for stability."
    }
  },

  "lvl-tri-15": {
    id: "lvl-tri-15",
    question: "Parallel Energy Beams: DE || BC. If AD=4, DB=6, and the whole side AC=25, find AE.",
    inputLabel: "Length AE",
    placeholder: "Enter length...",
    correctAnswer: 10,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AE = ${val}`,
    formulaDisplay: "AD/AB = AE/AC → 4/10 = AE/25 → AE = 10",
    bookPage: {
      title: "📖 Creating Parallel Systems",
      concept: "Parallel lines in triangles create energy-efficient structural designs. The ratio of parts equals the ratio of wholes!",
      formulaBreakdown: "Ratio of parts equals ratio of wholes",
      stepByStep: [
        "Calculate AB = AD + DB = 4 + 6 = 10.",
        "Set up: 4/10 = AE/25.",
        "Cross multiply: 10×AE = 100.",
        "AE = 10."
      ],
      visualTip: "Parallel beams distribute load proportionally in structures."
    }
  },

  "lvl-tri-16": {
    id: "lvl-tri-16",
    question: "Proportion Gate: Unlock the gate using ratio AD/DB = AE/EC. If AD=5, DB=3, AE=10, verify EC=6.",
    inputLabel: "Verify EC",
    placeholder: "Enter EC...",
    correctAnswer: 6,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `EC = ${val}`,
    formulaDisplay: "5/3 = 10/6 ✓ (Both equal 1.67)",
    bookPage: {
      title: "📖 Using Proportions to Solve",
      concept: "Verify proportional relationships to unlock geometric puzzles. Cross-multiply to check if ratios are equal!",
      formulaBreakdown: "Cross-multiply to verify: AD×EC = DB×AE",
      stepByStep: [
        "Set up proportion: 5/3 = 10/EC.",
        "Cross multiply: 5×EC = 30.",
        "EC = 6.",
        "Verify: 5×6 = 3×10 = 30 ✓"
      ],
      visualTip: "When cross-products are equal, the proportion is valid!"
    }
  },

  "lvl-tri-17": {
    id: "lvl-tri-17",
    question: "Line Adjustment: Move line DE parallel to BC. If AD=2x and DB=3x, find the ratio AE:EC.",
    inputLabel: "Ratio AE:EC",
    placeholder: "Enter ratio (e.g., 0.67)...",
    correctAnswer: 0.67,
    tolerance: 0.05,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AE:EC = ${val}`,
    formulaDisplay: "AD/DB = 2x/3x = 2/3 = 0.67",
    bookPage: {
      title: "📖 Adjusting While Maintaining Ratios",
      concept: "Parallel lines maintain proportional divisions regardless of position. The ratio stays constant even as the line moves!",
      formulaBreakdown: "AE:EC = AD:DB = 2:3",
      stepByStep: [
        "By BPT: AD/DB = AE/EC.",
        "AD/DB = 2x/3x = 2/3.",
        "Therefore AE:EC = 2:3.",
        "As decimal: 2/3 ≈ 0.67."
      ],
      visualTip: "Moving parallel lines changes lengths but preserves ratios!"
    }
  },

  "lvl-tri-18": {
    id: "lvl-tri-18",
    question: "Advanced BPT: In triangle ABC, DE || BC. Given AD/DB = 3/4 and AC=28, find AE and EC.",
    inputLabel: "Length AE",
    placeholder: "Enter AE...",
    correctAnswer: 12,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AE = ${val}, EC = 16`,
    formulaDisplay: "Let AE=3k, EC=4k. Then 7k=28, k=4. AE=12, EC=16",
    bookPage: {
      title: "📖 Advanced Proportionality",
      concept: "Combine BPT with algebra to solve complex triangle problems. Use variables to represent unknown proportional parts!",
      formulaBreakdown: "Let AE=3k, EC=4k. Then 7k=28, k=4",
      stepByStep: [
        "Set AE = 3k, EC = 4k (maintaining 3:4 ratio).",
        "3k + 4k = 28 → 7k = 28 → k = 4.",
        "AE = 3×4 = 12.",
        "EC = 4×4 = 16."
      ],
      visualTip: "Use variables to represent unknown proportional parts."
    }
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 4 — Areas & Scaling (Levels 19–24)
  // ═════════════════════════════════════════════════════════════════

  "lvl-tri-19": {
    id: "lvl-tri-19",
    question: "Area Growth: Two similar triangles have scale factor 2. If smaller area is 9, what is the larger area?",
    inputLabel: "Larger Area",
    placeholder: "Enter area...",
    correctAnswer: 36,
    tolerance: 1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Area = ${val}`,
    formulaDisplay: "Area Ratio = k² = 2² = 4, Area = 9 × 4 = 36",
    bookPage: {
      title: "📖 Area Relationships in Similar Triangles",
      concept: "The ratio of areas of two similar triangles equals the square of the ratio of their corresponding sides. Remember: Area ∝ k²!",
      formulaBreakdown: "Area₁/Area₂ = (side₁/side₂)² = k²",
      stepByStep: [
        "Identify scale factor k = 2.",
        "Area ratio = k² = 4.",
        "Larger area = 9 × 4 = 36.",
        "When sides double, area quadruples!"
      ],
      visualTip: "Area grows as the SQUARE of the scale factor!"
    }
  },

  "lvl-tri-20": {
    id: "lvl-tri-20",
    question: "Land Distribution: Divide a triangular plot into 4 equal-area smaller triangles using midpoints. What is the area ratio of small to large?",
    inputLabel: "Area Ratio",
    placeholder: "Enter ratio (e.g., 0.25)...",
    correctAnswer: 0.25,
    tolerance: 0.02,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Ratio = ${val}`,
    formulaDisplay: "Area Ratio = 1/4 = 0.25",
    bookPage: {
      title: "📖 Dividing Triangular Land",
      concept: "Joining midpoints divides a triangle into 4 congruent triangles, each with 1/4 the area. This is the Midpoint Theorem in action!",
      formulaBreakdown: "Each small triangle = 1/4 of original",
      stepByStep: [
        "Connect midpoints of all three sides.",
        "This creates 4 congruent triangles.",
        "Each has equal area: 1/4 of total.",
        "Midpoint theorem creates 4 equal children!"
      ],
      visualTip: "Midpoint theorem creates 4 equal children triangles!"
    }
  },

  "lvl-tri-21": {
    id: "lvl-tri-21",
    question: "Equal Area Zones: Three similar triangles have areas 12, 27, and 48. Find the ratio of their corresponding sides.",
    inputLabel: "Side Ratio (smallest)",
    placeholder: "Enter ratio...",
    correctAnswer: 2,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Ratio = ${val}:3:4`,
    formulaDisplay: "√12 : √27 : √48 = 2√3 : 3√3 : 4√3 = 2:3:4",
    bookPage: {
      title: "📖 Finding Side Ratios from Areas",
      concept: "Side ratio is the square root of area ratio for similar triangles. Side ∝ √Area!",
      formulaBreakdown: "Side ∝ √Area",
      stepByStep: [
        "Take square root of each area: √12, √27, √48.",
        "Simplify: 2√3, 3√3, 4√3.",
        "Ratio of sides = 2:3:4.",
        "Enter the smallest ratio: 2."
      ],
      visualTip: "Side length grows slower than area - it is the square root relationship."
    }
  },

  "lvl-tri-22": {
    id: "lvl-tri-22",
    question: "Reactor Scaling: A triangle reactor with area 50 needs to be scaled to area 200. What is the scale factor?",
    inputLabel: "Scale Factor",
    placeholder: "Enter factor...",
    correctAnswer: 2,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `k = ${val}`,
    formulaDisplay: "k = √(200/50) = √4 = 2",
    bookPage: {
      title: "📖 Efficient Geometric Scaling",
      concept: "To achieve 4× area, scale sides by factor of 2. This is the inverse relationship: k = √(Area Ratio).",
      formulaBreakdown: "k = √(New Area/Old Area)",
      stepByStep: [
        "Calculate area ratio: 200/50 = 4.",
        "Scale factor = √4 = 2.",
        "All sides double in length.",
        "Doubling sides quadruples the area!"
      ],
      visualTip: "Doubling sides quadruples the power (area) of the reactor!"
    }
  },

  "lvl-tri-23": {
    id: "lvl-tri-23",
    question: "Area-Ratio Balance: Two similar triangles have side ratio 3:5. If the smaller has perimeter 27, find the larger perimeter.",
    inputLabel: "Larger Perimeter",
    placeholder: "Enter perimeter...",
    correctAnswer: 45,
    tolerance: 1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Perimeter = ${val}`,
    formulaDisplay: "Perimeter scales linearly: 27 × (5/3) = 45",
    bookPage: {
      title: "📖 Perimeter Scaling (Linear)",
      concept: "Perimeter scales linearly with the side ratio, unlike area which scales squared. Perimeter is a LINEAR measure!",
      formulaBreakdown: "P₂/P₁ = side₂/side₁ = 5/3",
      stepByStep: [
        "Side ratio = 3:5.",
        "Perimeter ratio = same = 3:5.",
        "Larger perimeter = 27 × (5/3) = 45.",
        "Linear scaling for perimeter!"
      ],
      visualTip: "Perimeter is a LINEAR measure - it scales directly with sides."
    }
  },

  "lvl-tri-24": {
    id: "lvl-tri-24",
    question: "Geometric Scaling Puzzle: A triangle is scaled by factor 3. If original area is 15 and perimeter is 18, find new area.",
    inputLabel: "New Area",
    placeholder: "Enter new area...",
    correctAnswer: 135,
    tolerance: 2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Area = ${val}`,
    formulaDisplay: "New Area = 15 × 3² = 15 × 9 = 135",
    bookPage: {
      title: "📖 Combined Scaling Effects",
      concept: "Scale factor k affects: Sides ×k, Perimeter ×k, Area ×k². Remember these different scaling behaviors!",
      formulaBreakdown: "New Area = Original × k², New Perimeter = Original × k",
      stepByStep: [
        "Scale factor k = 3.",
        "New Area = 15 × 3² = 15 × 9 = 135.",
        "New Perimeter = 18 × 3 = 54.",
        "Area grows FASTER than perimeter!"
      ],
      visualTip: "Remember: Area grows FASTER than perimeter when scaling!"
    }
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 5 — Pythagoras & Mastery (Levels 25–30)
  // ═════════════════════════════════════════════════════════════════

  "lvl-tri-25": {
    id: "lvl-tri-25",
    question: "Shortest Path: Find the hypotenuse of a right triangle with legs 9 and 12.",
    inputLabel: "Hypotenuse",
    placeholder: "Enter length...",
    correctAnswer: 15,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `c = ${val}`,
    formulaDisplay: "c = √(9² + 12²) = √(81 + 144) = √225 = 15",
    bookPage: {
      title: "📖 Pythagorean Theorem",
      concept: "In a right triangle: hypotenuse² = leg₁² + leg₂². This fundamental theorem connects geometry and algebra!",
      formulaBreakdown: "c² = a² + b²",
      stepByStep: [
        "Square the legs: 9² = 81, 12² = 144.",
        "Add: 81 + 144 = 225.",
        "Square root: √225 = 15.",
        "The 9-12-15 triangle is a 3-4-5 scaled by 3!"
      ],
      visualTip: "The 9-12-15 triangle is a 3-4-5 triangle scaled by 3!"
    }
  },

  "lvl-tri-26": {
    id: "lvl-tri-26",
    question: "Laser Distance: A laser is positioned 8m high, hitting a target 15m away horizontally. What is the laser beam length?",
    inputLabel: "Beam Length",
    placeholder: "Enter length...",
    correctAnswer: 17,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Beam = ${val}m`,
    formulaDisplay: "Beam = √(8² + 15²) = √(64 + 225) = √289 = 17",
    bookPage: {
      title: "📖 Right Triangle in 3D Space",
      concept: "The Pythagorean theorem applies to any right triangle, including elevation problems. The 8-15-17 is a common Pythagorean triple!",
      formulaBreakdown: "Distance = √(horizontal² + vertical²)",
      stepByStep: [
        "Identify right triangle legs: 8 and 15.",
        "This is a scaled 8-15-17 Pythagorean triple!",
        "Hypotenuse = 17 meters.",
        "Memorize common triples: 3-4-5, 5-12-13, 8-15-17!"
      ],
      visualTip: "8-15-17 is a Pythagorean triple - memorize common ones!"
    }
  },

  "lvl-tri-27": {
    id: "lvl-tri-27",
    question: "Bridge Optimization: A bridge support forms a right triangle with base 20m and hypotenuse 25m. Find the height.",
    inputLabel: "Support Height",
    placeholder: "Enter height...",
    correctAnswer: 15,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = √(25² - 20²) = √(625 - 400) = √225 = 15",
    bookPage: {
      title: "📖 Construction Optimization",
      concept: "Pythagorean theorem helps engineers calculate support structures. The 20-15-25 triangle is a 4-3-5 scaled by 5!",
      formulaBreakdown: "a = √(c² - b²) when finding a leg",
      stepByStep: [
        "Rearrange: height² = hypotenuse² - base².",
        "Calculate: 25² - 20² = 625 - 400 = 225.",
        "Height = √225 = 15m.",
        "20-15-25 is a 4-3-5 triangle scaled by 5!"
      ],
      visualTip: "20-15-25 is a 4-3-5 triangle scaled by 5!"
    }
  },

  "lvl-tri-28": {
    id: "lvl-tri-28",
    question: "Navigation System: You travel 12km east and 5km north. What is the straight-line distance from start?",
    inputLabel: "Straight Distance",
    placeholder: "Enter distance...",
    correctAnswer: 13,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}km`,
    formulaDisplay: "d = √(12² + 5²) = √(144 + 25) = √169 = 13",
    bookPage: {
      title: "📖 Navigation with Right Triangles",
      concept: "GPS and navigation use right triangles to calculate shortest paths. The classic 5-12-13 Pythagorean triple!",
      formulaBreakdown: "Displacement = √(east² + north²)",
      stepByStep: [
        "East and North form perpendicular directions.",
        "Classic 5-12-13 Pythagorean triple!",
        "Distance = 13 km.",
        "5-12-13 is one of the most common triples!"
      ],
      visualTip: "5-12-13 is one of the most common Pythagorean triples!"
    }
  },

  "lvl-tri-29": {
    id: "lvl-tri-29",
    question: "Multi-Step Reasoning: In similar triangles ABC and DEF, AB=6, DE=9, and area of ABC=24. Find area of DEF.",
    inputLabel: "Area of DEF",
    placeholder: "Enter area...",
    correctAnswer: 54,
    tolerance: 1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Area = ${val}`,
    formulaDisplay: "k=9/6=1.5, Area ratio=k²=2.25, Area DEF=24×2.25=54",
    bookPage: {
      title: "📖 Combining Similarity and Area",
      concept: "First find scale factor, then apply area ratio formula. Multi-step problems require systematic approach!",
      formulaBreakdown: "k = DE/AB, Area₂ = Area₁ × k²",
      stepByStep: [
        "Find scale factor: k = 9/6 = 1.5.",
        "Area ratio = k² = 2.25.",
        "Area of DEF = 24 × 2.25 = 54.",
        "Multi-step: find k first, then calculate!"
      ],
      visualTip: "Multi-step problems: find k first, then calculate what you need!"
    }
  },

  "lvl-tri-30": {
    id: "lvl-tri-30",
    question: "FINAL BOSS: Triangle ABC ~ Triangle DEF with scale factor 2. If AB=5, BC=12, angle B=90°, find the hypotenuse DE of the larger triangle.",
    inputLabel: "Hypotenuse DE",
    placeholder: "Enter DE...",
    correctAnswer: 26,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `DE = ${val}`,
    formulaDisplay: "AC=√(5²+12²)=13, DE=13×2=26",
    bookPage: {
      title: "📖 Master Reactor: All Concepts Combined",
      concept: "Combine Pythagorean theorem with similarity scaling for the ultimate challenge! The 5-12-13 scaled by 2 becomes 10-24-26!",
      formulaBreakdown: "1. Find AC using Pythagoras: √(25+144)=13. 2. Scale by factor 2: DE = 13×2 = 26",
      stepByStep: [
        "Recognize right triangle ABC (5-12-13 triple).",
        "Find hypotenuse AC = √(25 + 144) = 13.",
        "Scale factor k = 2.",
        "Corresponding hypotenuse DE = 13 × 2 = 26."
      ],
      visualTip: "5-12-13 scaled by 2 becomes 10-24-26 with hypotenuse 26!"
    }
  }
};

export default trianglesSpecs;
