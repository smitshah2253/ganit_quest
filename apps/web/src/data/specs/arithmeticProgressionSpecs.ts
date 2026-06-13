import type { LevelSpecification } from '../levelSpecs';

const arithmeticProgressionSpecs: Record<string, LevelSpecification> = {

  // ──────────────────────────────────────────────────────────────────
  // WORLD 1 — Pattern Discovery (Levels 1–6)
  // ──────────────────────────────────────────────────────────────────

  "lvl-ap-01": {
    id: "lvl-ap-01",
    question: "The sequence belt shows: 3, 7, 11, 15, ... Identify the common difference (d) between consecutive terms.",
    inputLabel: "Common Difference (d)",
    placeholder: "Type d value...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}`,
    formulaDisplay: "d = a₂ − a₁ = a₃ − a₂ = ...",
    apMode: "pattern",
    apFirstTerm: 3,
    apCommonDiff: 4,
    apN: 5,
    apSequence: [3, 7, 11, 15, null],
    apAnswerType: "difference",
    bookPage: {
      title: "📖 Arithmetic Progressions — Pattern Discovery",
      concept: "An Arithmetic Progression (AP) is a sequence where each term increases by the same fixed amount. This fixed amount is called the Common Difference (d). Example: 3, 7, 11, 15 — the difference between every pair of consecutive terms is 4.",
      formulaBreakdown: "d = a₂ − a₁ = a₃ − a₂ = (any term) − (previous term)",
      stepByStep: [
        "List the first few terms of the sequence from the belt.",
        "Subtract the 1st term from the 2nd term: 7 − 3 = ?",
        "Subtract the 2nd term from the 3rd term: 11 − 7 = ?",
        "If both differences are equal, that value is d.",
        "Confirm: 15 − 11 = same d. Enter the common difference."
      ],
      visualTip: "Watch the glowing blocks on the belt. The gap between each lit block is exactly d — count the gap, not the numbers!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given sequence: 3, 7, 11, 15, ..." },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "Common difference d = a₂ − a₁" },
      { lineNum: 4, textBefore: "  d = 7 − 3" },
      { lineNum: 5, textBefore: "  d = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "d", textAfter: "", widthChars: 2 }
    ]
  },

  "lvl-ap-02": {
    id: "lvl-ap-02",
    question: "The conveyor shows: 5, __, 17, 23, 29. A term is missing! Find the missing 2nd term.",
    inputLabel: "Missing Term (a₂)",
    placeholder: "Type the missing term...",
    correctAnswer: 11,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₂ = ${val}`,
    formulaDisplay: "aₙ = a + (n−1)d",
    apMode: "pattern",
    apFirstTerm: 5,
    apCommonDiff: 6,
    apN: 2,
    apSequence: [5, null, 17, 23, 29],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Finding a Missing Term",
      concept: "When a term is missing from an AP, use the constant difference property. Since d is the same between every consecutive pair, find d from two known terms and work backwards.",
      formulaBreakdown: "d = a₃ − a₁ ÷ 2  (when 2nd term is missing)  →  a₂ = a₁ + d",
      stepByStep: [
        "Note known terms: a₁ = 5, a₃ = 17, and so on.",
        "Find d: the gap between a₁ and a₃ spans 2 steps, so d = (17 − 5) ÷ 2.",
        "Calculate: d = 12 ÷ 2 = 6.",
        "Now find a₂: a₂ = a₁ + d = 5 + 6.",
        "Enter the missing term."
      ],
      visualTip: "See the blinking blank block on the belt? The blocks on both sides tell you d. Fill the gap!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a₁ = 5, a₃ = 17, a₄ = 23" },
      { lineNum: 2, textBefore: "d = (a₃ − a₁) ÷ 2 = (17 − 5) ÷ 2 = 12 ÷ 2 = 6" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "Missing term a₂ = a₁ + d = 5 + 6" },
      { lineNum: 5, textBefore: "a₂ = ", hasInput: true, inputIndex: 0, correctAnswer: "11", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-03": {
    id: "lvl-ap-03",
    question: "The sequence 4, 7, 10, ? follows a constant difference. Find the next term.",
    inputLabel: "Next Term",
    placeholder: "Type the 4th term...",
    correctAnswer: 13,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₄ = ${val}`,
    formulaDisplay: "aₙ₊₁ = aₙ + d",
    apMode: "pattern",
    apFirstTerm: 4,
    apCommonDiff: 3,
    apN: 4,
    apSequence: [4, 7, 10, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Extending an AP",
      concept: "Every term in an AP equals the previous term plus the common difference d. Once you know d, any subsequent term can be found by simply adding d.",
      formulaBreakdown: "Next term = Current term + d",
      stepByStep: [
        "Identify d: 7 − 4 = 3, confirm 10 − 7 = 3.",
        "The common difference is d = 3.",
        "To find the next term: add d to the last known term.",
        "a₄ = a₃ + d = 10 + 3.",
        "Enter your answer."
      ],
      visualTip: "Each glowing block on the belt adds exactly d to reach the next. Keep adding!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Sequence: 4, 7, 10, ?" },
      { lineNum: 2, textBefore: "d = 7 − 4 = 3" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "a₄ = a₃ + d = 10 + 3" },
      { lineNum: 5, textBefore: "a₄ = ", hasInput: true, inputIndex: 0, correctAnswer: "13", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-04": {
    id: "lvl-ap-04",
    question: "The sequence generator outputs: 2, 6, 10, 14, __. Find the 5th term to fix the broken output.",
    inputLabel: "5th Term (a₅)",
    placeholder: "Type 5th term...",
    correctAnswer: 18,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₅ = ${val}`,
    formulaDisplay: "a₅ = a + 4d",
    apMode: "pattern",
    apFirstTerm: 2,
    apCommonDiff: 4,
    apN: 5,
    apSequence: [2, 6, 10, 14, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Repairing a Sequence",
      concept: "To find any term in an AP, add d to the term before it. This is the simplest way to extend a sequence forward one step at a time.",
      formulaBreakdown: "a₅ = a₄ + d = a + 4d",
      stepByStep: [
        "Identify the sequence: 2, 6, 10, 14.",
        "Common difference: d = 6 − 2 = 4.",
        "Extend: a₅ = a₄ + d = 14 + 4.",
        "Verify: 2 + 4×4 = 2 + 16 = 18 ✓",
        "Enter the 5th term."
      ],
      visualTip: "The broken block on the belt is a₅. Add d once more to the last lit block to repair it!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given AP: 2, 6, 10, 14, ..." },
      { lineNum: 2, textBefore: "d = 6 − 2 = 4" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "a₅ = a₄ + d = 14 + 4" },
      { lineNum: 5, textBefore: "a₅ = ", hasInput: true, inputIndex: 0, correctAnswer: "18", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-05": {
    id: "lvl-ap-05",
    question: "Build an AP with first term a = 8 and common difference d = 5. Find the 4th term.",
    inputLabel: "4th Term (a₄)",
    placeholder: "Type a₄...",
    correctAnswer: 23,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₄ = ${val}`,
    formulaDisplay: "a₄ = a + 3d",
    apMode: "pattern",
    apFirstTerm: 8,
    apCommonDiff: 5,
    apN: 4,
    apSequence: [8, 13, 18, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Building an AP from Scratch",
      concept: "Given a (first term) and d (common difference), you can build any term of the AP. Each step forward in position adds one d to the value.",
      formulaBreakdown: "a₄ = a + 3d  (since position 4 is 3 steps from position 1)",
      stepByStep: [
        "Start with first term a = 8.",
        "Add d = 5 once: a₂ = 8 + 5 = 13.",
        "Add d again: a₃ = 13 + 5 = 18.",
        "Add d one more time: a₄ = 18 + 5.",
        "Or use formula: a₄ = 8 + (4−1)×5 = 8 + 15."
      ],
      visualTip: "Watch the belt light up block by block as you increment by d each step!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 8, d = 5" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "Using formula: a₄ = a + (4−1)×d" },
      { lineNum: 4, textBefore: "  a₄ = 8 + 3×5 = 8 + 15" },
      { lineNum: 5, textBefore: "  a₄ = ", hasInput: true, inputIndex: 0, correctAnswer: "23", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-06": {
    id: "lvl-ap-06",
    question: "The sequence engine runs: 10, 14, 18, 22, ... Predict the 8th output value.",
    inputLabel: "8th Term (a₈)",
    placeholder: "Type a₈...",
    correctAnswer: 38,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₈ = ${val}`,
    formulaDisplay: "a₈ = a + 7d",
    apMode: "pattern",
    apFirstTerm: 10,
    apCommonDiff: 4,
    apN: 8,
    apSequence: [10, 14, 18, 22, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Predicting Future Terms",
      concept: "To find a term far ahead in the sequence, instead of adding d repeatedly, use the nth term formula: aₙ = a + (n−1)d. This lets you jump directly to any position.",
      formulaBreakdown: "a₈ = a + (8−1)×d = a + 7d",
      stepByStep: [
        "Identify a = 10 and d = 14 − 10 = 4.",
        "You need the 8th term, so n = 8.",
        "Apply formula: a₈ = a + (n−1)×d.",
        "a₈ = 10 + (8−1)×4 = 10 + 7×4.",
        "a₈ = 10 + 28 = 38."
      ],
      visualTip: "Count 7 steps of +4 on the belt from the first block to land on a₈!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given AP: 10, 14, 18, 22, ..." },
      { lineNum: 2, textBefore: "a = 10, d = 4, n = 8" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "a₈ = a + (8−1)×d = 10 + 7×4 = 10 + 28" },
      { lineNum: 5, textBefore: "a₈ = ", hasInput: true, inputIndex: 0, correctAnswer: "38", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 2 — Common Difference Mechanics (Levels 7–12)
  // ──────────────────────────────────────────────────────────────────

  "lvl-ap-07": {
    id: "lvl-ap-07",
    question: "An AP has first term a = 5 and its 4th term a₄ = 17. Find the common difference d.",
    inputLabel: "Common Difference (d)",
    placeholder: "Type d...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}`,
    formulaDisplay: "d = (aₙ − a) ÷ (n−1)",
    apMode: "difference",
    apFirstTerm: 5,
    apCommonDiff: 4,
    apN: 4,
    apSequence: [5, null, null, 17],
    apAnswerType: "difference",
    bookPage: {
      title: "📖 Deriving d from Two Terms",
      concept: "If you know two terms and their positions, you can calculate d by rearranging the nth term formula: d = (aₙ − a) ÷ (n − 1).",
      formulaBreakdown: "d = (a₄ − a₁) ÷ (4 − 1) = (a₄ − a) ÷ 3",
      stepByStep: [
        "Known: a = 5 (1st term), a₄ = 17 (4th term).",
        "From the nth term formula: a₄ = a + 3d.",
        "Rearrange: 3d = a₄ − a = 17 − 5 = 12.",
        "Solve: d = 12 ÷ 3.",
        "Enter the common difference d."
      ],
      visualTip: "The machine shows positions 1 and 4. The total gap (12) is spread evenly over 3 steps — that's d!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 5, a₄ = 17" },
      { lineNum: 2, textBefore: "Using: a₄ = a + 3d" },
      { lineNum: 3, textBefore: "  17 = 5 + 3d" },
      { lineNum: 4, textBefore: "  3d = 17 − 5 = 12" },
      { lineNum: 5, textBefore: "  d = 12 ÷ 3 = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "d", textAfter: "", widthChars: 2 }
    ]
  },

  "lvl-ap-08": {
    id: "lvl-ap-08",
    question: "In an energy flow AP, a₁ = 8 and a₄ = 20. Find the common difference d to balance the system.",
    inputLabel: "Common Difference (d)",
    placeholder: "Type d...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}`,
    formulaDisplay: "d = (a₄ − a₁) ÷ 3",
    apMode: "difference",
    apFirstTerm: 8,
    apCommonDiff: 4,
    apN: 4,
    apSequence: [8, null, null, 20],
    apAnswerType: "difference",
    bookPage: {
      title: "📖 Balancing an AP",
      concept: "When first and last positions are known, find d by dividing the total change by the number of gaps. There are (n−1) gaps between positions 1 and n.",
      formulaBreakdown: "d = (aₙ − a) ÷ (n − 1)",
      stepByStep: [
        "Known: a₁ = 8, a₄ = 20.",
        "Total change from pos 1 to pos 4: 20 − 8 = 12.",
        "Number of gaps between positions 1 and 4: (4 − 1) = 3.",
        "d = Total change ÷ Number of gaps = 12 ÷ 3.",
        "Enter d to balance the AP energy flow."
      ],
      visualTip: "Spread the total gap of 12 equally over 3 steps on the belt — each step is d!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a₁ = 8, a₄ = 20" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "d = (a₄ − a₁) ÷ (4 − 1) = (20 − 8) ÷ 3" },
      { lineNum: 4, textBefore: "d = 12 ÷ 3" },
      { lineNum: 5, textBefore: "d = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "d", textAfter: "", widthChars: 2 }
    ]
  },

  "lvl-ap-09": {
    id: "lvl-ap-09",
    question: "The sequence 9, 15, __, 27 has a corrupted 3rd term. Find the correct 3rd term.",
    inputLabel: "3rd Term (a₃)",
    placeholder: "Type the 3rd term...",
    correctAnswer: 21,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₃ = ${val}`,
    formulaDisplay: "a₃ = a₁ + 2d",
    apMode: "difference",
    apFirstTerm: 9,
    apCommonDiff: 6,
    apN: 3,
    apSequence: [9, 15, null, 27],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Repairing a Corrupted Term",
      concept: "Find d from any two known consecutive terms. Then use it to calculate the corrupted position.",
      formulaBreakdown: "d = a₂ − a₁ = 15 − 9 = 6;  a₃ = a₁ + 2d",
      stepByStep: [
        "From known terms: d = 15 − 9 = 6.",
        "Verify: a₄ − d = 27 − 6 = 21 (should match a₃). ✓",
        "Calculate: a₃ = a₁ + 2d = 9 + 2×6.",
        "a₃ = 9 + 12 = 21.",
        "Enter the corrected 3rd term."
      ],
      visualTip: "The belt shows 9 and 15 (d=6). Add d twice from 9 to land on a₃!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a₁ = 9, a₂ = 15, a₄ = 27" },
      { lineNum: 2, textBefore: "d = a₂ − a₁ = 15 − 9 = 6" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "a₃ = a₁ + 2d = 9 + 2×6 = 9 + 12" },
      { lineNum: 5, textBefore: "a₃ = ", hasInput: true, inputIndex: 0, correctAnswer: "21", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-10": {
    id: "lvl-ap-10",
    question: "A wrong term was injected: 4, 8, 13, 16. The sequence should be an AP with d = 4. What should the correct 3rd term be?",
    inputLabel: "Correct 3rd Term",
    placeholder: "Type corrected a₃...",
    correctAnswer: 12,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₃ = ${val}`,
    formulaDisplay: "a₃ = a₁ + 2d",
    apMode: "difference",
    apFirstTerm: 4,
    apCommonDiff: 4,
    apN: 3,
    apSequence: [4, 8, null, 16],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Detecting Injection Errors",
      concept: "In a valid AP, every term equals the previous term plus d. Any term that breaks this rule is wrong. Fix it using the formula: aₙ = a + (n−1)d.",
      formulaBreakdown: "a₃ (correct) = a₁ + 2d = 4 + 2×4 = 12",
      stepByStep: [
        "Check: d = 8 − 4 = 4.",
        "Expected a₃ = 8 + 4 = 12, but sequence shows 13 — that's wrong!",
        "Correct a₃ using formula: a₃ = a₁ + 2d = 4 + 8.",
        "a₃ = 12.",
        "Enter 12 as the corrected term."
      ],
      visualTip: "The belt flags the glitched block in red. Use a + 2d to compute the correct value!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a₁ = 4, d = 4" },
      { lineNum: 2, textBefore: "Wrong 3rd term detected: 13 (should differ by 4)" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "Correct a₃ = a₁ + 2d = 4 + 2×4 = 4 + 8" },
      { lineNum: 5, textBefore: "a₃ = ", hasInput: true, inputIndex: 0, correctAnswer: "12", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-11": {
    id: "lvl-ap-11",
    question: "Build a stable AP chain with a = 3 and d = 8. Find the 9th term a₉.",
    inputLabel: "9th Term (a₉)",
    placeholder: "Type a₉...",
    correctAnswer: 67,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₉ = ${val}`,
    formulaDisplay: "a₉ = a + 8d",
    apMode: "difference",
    apFirstTerm: 3,
    apCommonDiff: 8,
    apN: 9,
    apSequence: [3, 11, 19, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 High-Position Term Calculation",
      concept: "Rather than adding d eight times to reach a₉, use the nth term formula to jump directly: aₙ = a + (n−1)d.",
      formulaBreakdown: "a₉ = a + (9−1)×d = a + 8d = 3 + 8×8",
      stepByStep: [
        "a = 3, d = 8, n = 9.",
        "Apply formula: a₉ = a + (n−1)×d.",
        "a₉ = 3 + (9−1)×8.",
        "a₉ = 3 + 8×8 = 3 + 64.",
        "a₉ = 67."
      ],
      visualTip: "The chain shows first 3 blocks. Count 8 jumps of +8 from block 1 to reach block 9!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 3, d = 8, n = 9" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₉ = a + (9−1)×d = 3 + 8×8" },
      { lineNum: 4, textBefore: "a₉ = 3 + 64" },
      { lineNum: 5, textBefore: "a₉ = ", hasInput: true, inputIndex: 0, correctAnswer: "67", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-12": {
    id: "lvl-ap-12",
    question: "An AP has a = 50 and d = −4 (decreasing). Find the 10th term a₁₀.",
    inputLabel: "10th Term (a₁₀)",
    placeholder: "Type a₁₀...",
    correctAnswer: 14,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₁₀ = ${val}`,
    formulaDisplay: "a₁₀ = a + 9d",
    apMode: "difference",
    apFirstTerm: 50,
    apCommonDiff: -4,
    apN: 10,
    apSequence: [50, 46, 42, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Decreasing AP — Negative d",
      concept: "When d is negative, the AP decreases. The nth term formula works exactly the same way — just substitute d as a negative number.",
      formulaBreakdown: "a₁₀ = a + 9d = 50 + 9×(−4) = 50 − 36",
      stepByStep: [
        "a = 50, d = −4 (sequence goes down), n = 10.",
        "Apply: a₁₀ = a + (n−1)×d.",
        "a₁₀ = 50 + (10−1)×(−4).",
        "a₁₀ = 50 + 9×(−4) = 50 − 36.",
        "a₁₀ = 14."
      ],
      visualTip: "The belt moves downward! Each block is 4 less than the previous one."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 50, d = −4, n = 10" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₁₀ = a + (10−1)×d = 50 + 9×(−4)" },
      { lineNum: 4, textBefore: "a₁₀ = 50 − 36" },
      { lineNum: 5, textBefore: "a₁₀ = ", hasInput: true, inputIndex: 0, correctAnswer: "14", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 3 — Nth Term Engine (Levels 13–18)
  // ──────────────────────────────────────────────────────────────────

  "lvl-ap-13": {
    id: "lvl-ap-13",
    question: "Sequence Reactor: a = 5, d = 3. Find the 10th element a₁₀ of the sequence.",
    inputLabel: "10th Term (a₁₀)",
    placeholder: "Type a₁₀...",
    correctAnswer: 32,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₁₀ = ${val}`,
    formulaDisplay: "aₙ = a + (n−1)d",
    apMode: "nth_term",
    apFirstTerm: 5,
    apCommonDiff: 3,
    apN: 10,
    apSequence: [5, 8, 11, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 The Nth Term Formula",
      concept: "The heart of AP: aₙ = a + (n−1)d. This formula gives the value of ANY term directly, without needing to calculate all previous terms.",
      formulaBreakdown: "aₙ = a + (n−1)×d",
      stepByStep: [
        "Identify: a = 5 (first term), d = 3 (common diff), n = 10.",
        "Apply formula: a₁₀ = a + (10−1)×d.",
        "a₁₀ = 5 + 9×3.",
        "a₁₀ = 5 + 27.",
        "a₁₀ = 32."
      ],
      visualTip: "The reactor shows the first 3 blocks and the 10th position lit up. Compute 5 + 9×3 directly!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 5, d = 3, n = 10" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₁₀ = a + (10−1)×d = 5 + 9×3" },
      { lineNum: 4, textBefore: "a₁₀ = 5 + 27" },
      { lineNum: 5, textBefore: "a₁₀ = ", hasInput: true, inputIndex: 0, correctAnswer: "32", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-14": {
    id: "lvl-ap-14",
    question: "The position-value calculator runs: a = 7, d = 4. Find the 15th term a₁₅.",
    inputLabel: "15th Term (a₁₅)",
    placeholder: "Type a₁₅...",
    correctAnswer: 63,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₁₅ = ${val}`,
    formulaDisplay: "a₁₅ = a + 14d",
    apMode: "nth_term",
    apFirstTerm: 7,
    apCommonDiff: 4,
    apN: 15,
    apSequence: [7, 11, 15, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Finding a High-Position Term",
      concept: "For high-position terms, always use the formula. Counting up by d each time is slow and error-prone. aₙ = a + (n−1)d is instant.",
      formulaBreakdown: "a₁₅ = 7 + (15−1)×4 = 7 + 14×4 = 7 + 56",
      stepByStep: [
        "a = 7, d = 4, n = 15.",
        "a₁₅ = 7 + (15−1)×4.",
        "= 7 + 14×4.",
        "= 7 + 56.",
        "= 63."
      ],
      visualTip: "Position 15 is far on the belt. Multiply 14×4 in your head — faster than counting each step!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 7, d = 4, n = 15" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₁₅ = a + 14d = 7 + 14×4 = 7 + 56" },
      { lineNum: 4, textBefore: "a₁₅ = ", hasInput: true, inputIndex: 0, correctAnswer: "63", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-15": {
    id: "lvl-ap-15",
    question: "An AP begins: 2, 4.5, 7, 9.5, ... Find the 12th term a₁₂.",
    inputLabel: "12th Term (a₁₂)",
    placeholder: "Type a₁₂...",
    correctAnswer: 29.5,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₁₂ = ${val}`,
    formulaDisplay: "a₁₂ = a + 11d",
    apMode: "nth_term",
    apFirstTerm: 2,
    apCommonDiff: 2.5,
    apN: 12,
    apSequence: [2, 4.5, 7, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Decimal Common Difference",
      concept: "APs can have decimal common differences. The formula works identically — just substitute d = 2.5.",
      formulaBreakdown: "a₁₂ = 2 + (12−1)×2.5 = 2 + 11×2.5 = 2 + 27.5",
      stepByStep: [
        "a = 2, d = 4.5 − 2 = 2.5, n = 12.",
        "a₁₂ = 2 + (12−1)×2.5.",
        "= 2 + 11×2.5.",
        "= 2 + 27.5.",
        "= 29.5."
      ],
      visualTip: "Decimal d works fine! Compute 11 × 2.5 = 27.5, then add 2."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 2, d = 2.5, n = 12" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₁₂ = 2 + 11×2.5 = 2 + 27.5" },
      { lineNum: 4, textBefore: "a₁₂ = ", hasInput: true, inputIndex: 0, correctAnswer: "29.5", placeholder: "term", textAfter: "", widthChars: 5 }
    ]
  },

  "lvl-ap-16": {
    id: "lvl-ap-16",
    question: "The door unlocks when aₙ = 45. The AP has a = 3, d = 6. Find the position n to open the door.",
    inputLabel: "Position (n)",
    placeholder: "Type n...",
    correctAnswer: 8,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n = ${val}`,
    formulaDisplay: "n = (aₙ − a)/d + 1",
    apMode: "nth_term",
    apFirstTerm: 3,
    apCommonDiff: 6,
    apN: 8,
    apSequence: [3, 9, 15, null],
    apAnswerType: "position",
    bookPage: {
      title: "📖 Finding the Position n",
      concept: "Reverse the nth term formula to find the position: n = [(aₙ − a) ÷ d] + 1. This is used when you know the term value and want to find WHERE it is.",
      formulaBreakdown: "n = (aₙ − a) ÷ d + 1 = (45 − 3) ÷ 6 + 1",
      stepByStep: [
        "aₙ = 45, a = 3, d = 6.",
        "From formula: aₙ = a + (n−1)d → n−1 = (aₙ − a)/d.",
        "n − 1 = (45 − 3) ÷ 6 = 42 ÷ 6 = 7.",
        "n = 7 + 1 = 8.",
        "Enter n = 8 to unlock the door."
      ],
      visualTip: "Work backwards from 45. Subtract 3 (first term), divide by d=6. That's how many steps. Add 1 for the position!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: aₙ = 45, a = 3, d = 6" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "aₙ = a + (n−1)d  →  45 = 3 + (n−1)×6" },
      { lineNum: 4, textBefore: "(n−1)×6 = 42  →  n−1 = 7" },
      { lineNum: 5, textBefore: "n = ", hasInput: true, inputIndex: 0, correctAnswer: "8", placeholder: "n", textAfter: "", widthChars: 2 }
    ]
  },

  "lvl-ap-17": {
    id: "lvl-ap-17",
    question: "Reverse-engineer: aₙ = 89, a = 5, d = 7. Find the term number n.",
    inputLabel: "Term Number (n)",
    placeholder: "Type n...",
    correctAnswer: 13,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n = ${val}`,
    formulaDisplay: "n = (aₙ − a)/d + 1",
    apMode: "nth_term",
    apFirstTerm: 5,
    apCommonDiff: 7,
    apN: 13,
    apSequence: [5, 12, 19, null],
    apAnswerType: "position",
    bookPage: {
      title: "📖 Reverse Engineering n",
      concept: "When you know the value of a term (aₙ) but not its position, rearrange: n = (aₙ − a)/d + 1.",
      formulaBreakdown: "n = (89 − 5) ÷ 7 + 1 = 84 ÷ 7 + 1 = 12 + 1",
      stepByStep: [
        "aₙ = 89, a = 5, d = 7.",
        "Rearrange nth term formula: n − 1 = (aₙ − a) ÷ d.",
        "n − 1 = (89 − 5) ÷ 7 = 84 ÷ 7 = 12.",
        "n = 12 + 1 = 13.",
        "Enter n = 13."
      ],
      visualTip: "Find the gap (84), divide by d (7) to get steps (12), then add 1 — that's the position!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: aₙ = 89, a = 5, d = 7" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "89 = 5 + (n−1)×7  →  (n−1) = 84 ÷ 7 = 12" },
      { lineNum: 4, textBefore: "n = 12 + 1" },
      { lineNum: 5, textBefore: "n = ", hasInput: true, inputIndex: 0, correctAnswer: "13", placeholder: "n", textAfter: "", widthChars: 3 }
    ]
  },

  "lvl-ap-18": {
    id: "lvl-ap-18",
    question: "Descending AP: a = 100, d = −4. Find the 20th term a₂₀.",
    inputLabel: "20th Term (a₂₀)",
    placeholder: "Type a₂₀...",
    correctAnswer: 24,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `a₂₀ = ${val}`,
    formulaDisplay: "a₂₀ = 100 + 19×(−4)",
    apMode: "nth_term",
    apFirstTerm: 100,
    apCommonDiff: -4,
    apN: 20,
    apSequence: [100, 96, 92, null],
    apAnswerType: "term",
    bookPage: {
      title: "📖 Nth Term of a Descending AP",
      concept: "A descending AP has negative d. The nth term formula handles this naturally. Be careful with signs: (n−1)×d will be negative.",
      formulaBreakdown: "a₂₀ = 100 + (20−1)×(−4) = 100 + 19×(−4) = 100 − 76",
      stepByStep: [
        "a = 100, d = −4, n = 20.",
        "a₂₀ = 100 + (20−1)×(−4).",
        "= 100 + 19×(−4).",
        "= 100 − 76.",
        "= 24."
      ],
      visualTip: "The belt counts down from 100. 20th block is 19 steps of −4 away. That's 100 − 76!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 100, d = −4, n = 20" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₂₀ = 100 + 19×(−4) = 100 − 76" },
      { lineNum: 4, textBefore: "a₂₀ = ", hasInput: true, inputIndex: 0, correctAnswer: "24", placeholder: "term", textAfter: "", widthChars: 3 }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 4 — Sum of AP Factory (Levels 19–24)
  // ──────────────────────────────────────────────────────────────────

  "lvl-ap-19": {
    id: "lvl-ap-19",
    question: "Calculate total energy output: a = 1, d = 2, n = 10. Find S₁₀.",
    inputLabel: "Sum S₁₀",
    placeholder: "Type S₁₀...",
    correctAnswer: 100,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `S₁₀ = ${val}`,
    formulaDisplay: "Sₙ = n/2 × [2a + (n−1)d]",
    apMode: "sum",
    apFirstTerm: 1,
    apCommonDiff: 2,
    apN: 10,
    apSequence: [1, 3, 5, 7, 9],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 Sum of n Terms",
      concept: "Sₙ is the total of the first n terms of an AP. Formula: Sₙ = n/2 × [2a + (n−1)d]. Think of it as averaging the first and last term, then multiplying by n.",
      formulaBreakdown: "S₁₀ = 10/2 × [2×1 + (10−1)×2] = 5 × [2 + 18] = 5 × 20",
      stepByStep: [
        "a = 1, d = 2, n = 10.",
        "S₁₀ = n/2 × [2a + (n−1)d].",
        "= 10/2 × [2×1 + 9×2].",
        "= 5 × [2 + 18].",
        "= 5 × 20 = 100."
      ],
      visualTip: "The factory bars show each term stacking up. 1+3+5+...+19 = 100 (sum of first 10 odd numbers!)"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 1, d = 2, n = 10" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₁₀ = 10/2 × [2×1 + (10−1)×2]" },
      { lineNum: 4, textBefore: "S₁₀ = 5 × [2 + 18] = 5 × 20" },
      { lineNum: 5, textBefore: "S₁₀ = ", hasInput: true, inputIndex: 0, correctAnswer: "100", placeholder: "sum", textAfter: "", widthChars: 4 }
    ]
  },

  "lvl-ap-20": {
    id: "lvl-ap-20",
    question: "Production line AP: a = 3, d = 4, n = 8. Calculate total output S₈.",
    inputLabel: "Sum S₈",
    placeholder: "Type S₈...",
    correctAnswer: 136,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `S₈ = ${val}`,
    formulaDisplay: "S₈ = 8/2 × [2×3 + 7×4]",
    apMode: "sum",
    apFirstTerm: 3,
    apCommonDiff: 4,
    apN: 8,
    apSequence: [3, 7, 11, 15, 19],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 Sum Formula with Higher d",
      concept: "The larger the common difference, the faster the sum grows. Apply Sₙ = n/2 × [2a + (n−1)d] carefully for any d.",
      formulaBreakdown: "S₈ = 8/2 × [2×3 + 7×4] = 4 × [6 + 28] = 4 × 34",
      stepByStep: [
        "a = 3, d = 4, n = 8.",
        "S₈ = 8/2 × [2×3 + (8−1)×4].",
        "= 4 × [6 + 28].",
        "= 4 × 34.",
        "= 136."
      ],
      visualTip: "8 bars on the factory floor. Their total height equals S₈. Watch the accumulator reach 136!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 3, d = 4, n = 8" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₈ = 8/2 × [6 + 7×4] = 4 × [6 + 28] = 4 × 34" },
      { lineNum: 4, textBefore: "S₈ = ", hasInput: true, inputIndex: 0, correctAnswer: "136", placeholder: "sum", textAfter: "", widthChars: 4 }
    ]
  },

  "lvl-ap-21": {
    id: "lvl-ap-21",
    question: "Resource accumulation: a = 5, d = 3, n = 12. Find total accumulated sum S₁₂.",
    inputLabel: "Sum S₁₂",
    placeholder: "Type S₁₂...",
    correctAnswer: 258,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `S₁₂ = ${val}`,
    formulaDisplay: "S₁₂ = 12/2 × [2×5 + 11×3]",
    apMode: "sum",
    apFirstTerm: 5,
    apCommonDiff: 3,
    apN: 12,
    apSequence: [5, 8, 11, 14, 17],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 Sum of 12 Terms",
      concept: "As n grows, the Sₙ formula becomes increasingly powerful. It replaces 12 separate additions with a single calculation.",
      formulaBreakdown: "S₁₂ = 12/2 × [10 + 11×3] = 6 × [10 + 33] = 6 × 43",
      stepByStep: [
        "a = 5, d = 3, n = 12.",
        "S₁₂ = 12/2 × [2×5 + (12−1)×3].",
        "= 6 × [10 + 33].",
        "= 6 × 43.",
        "= 258."
      ],
      visualTip: "12 accumulation bars. 6 × 43 = 258. The factory counter shows the running total!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 5, d = 3, n = 12" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₁₂ = 12/2 × [10 + 11×3] = 6 × 43" },
      { lineNum: 4, textBefore: "S₁₂ = ", hasInput: true, inputIndex: 0, correctAnswer: "258", placeholder: "sum", textAfter: "", widthChars: 4 }
    ]
  },

  "lvl-ap-22": {
    id: "lvl-ap-22",
    question: "A block structure has AP layers: a = 2, d = 2, n = 15. Find the total number of blocks S₁₅.",
    inputLabel: "Total Blocks S₁₅",
    placeholder: "Type S₁₅...",
    correctAnswer: 240,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `S₁₅ = ${val}`,
    formulaDisplay: "S₁₅ = 15/2 × [2×2 + 14×2]",
    apMode: "sum",
    apFirstTerm: 2,
    apCommonDiff: 2,
    apN: 15,
    apSequence: [2, 4, 6, 8, 10],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 Sum with Equal a and d",
      concept: "When a = d, the Sₙ formula simplifies nicely. The sequence 2, 4, 6, 8, ... is the series of even numbers!",
      formulaBreakdown: "S₁₅ = 15/2 × [4 + 14×2] = 15/2 × 32 = 15 × 16",
      stepByStep: [
        "a = 2, d = 2, n = 15.",
        "S₁₅ = 15/2 × [2×2 + (15−1)×2].",
        "= 15/2 × [4 + 28].",
        "= 15/2 × 32.",
        "= 15 × 16 = 240."
      ],
      visualTip: "The 15 bars show even numbers 2,4,6,...,30. Their total is 15 × 16 = 240!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 2, d = 2, n = 15" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₁₅ = 15/2 × [4 + 14×2] = 15/2 × 32" },
      { lineNum: 4, textBefore: "S₁₅ = 15 × 16" },
      { lineNum: 5, textBefore: "S₁₅ = ", hasInput: true, inputIndex: 0, correctAnswer: "240", placeholder: "sum", textAfter: "", widthChars: 4 }
    ]
  },

  "lvl-ap-23": {
    id: "lvl-ap-23",
    question: "Reverse sum puzzle: S₁₀ = 100, a = 1, n = 10. Find the common difference d.",
    inputLabel: "Common Difference (d)",
    placeholder: "Type d...",
    correctAnswer: 2,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}`,
    formulaDisplay: "d = [(2Sₙ/n) − 2a] ÷ (n−1)",
    apMode: "sum",
    apFirstTerm: 1,
    apCommonDiff: 2,
    apN: 10,
    apSequence: [1, 3, 5, 7, 9],
    apAnswerType: "difference",
    bookPage: {
      title: "📖 Reverse-Engineering d from Sₙ",
      concept: "When Sₙ is known, rearrange the sum formula to solve for d: Sₙ = n/2 × [2a + (n−1)d].",
      formulaBreakdown: "100 = 5×[2 + 9d]  →  20 = 2 + 9d  →  9d = 18  →  d = 2",
      stepByStep: [
        "Sₙ = 100, a = 1, n = 10.",
        "Apply: 100 = 10/2 × [2×1 + (10−1)d].",
        "100 = 5 × [2 + 9d].",
        "20 = 2 + 9d  →  9d = 18.",
        "d = 18 ÷ 9 = 2."
      ],
      visualTip: "The factory total is known (100). Work backwards through the formula to find d!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: S₁₀ = 100, a = 1, n = 10" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "100 = 5×[2 + 9d]  →  20 = 2 + 9d" },
      { lineNum: 4, textBefore: "9d = 18  →  d = 18 ÷ 9" },
      { lineNum: 5, textBefore: "d = ", hasInput: true, inputIndex: 0, correctAnswer: "2", placeholder: "d", textAfter: "", widthChars: 2 }
    ]
  },

  "lvl-ap-24": {
    id: "lvl-ap-24",
    question: "Large-scale AP: a = 5, d = 2, n = 20. Find the total sum S₂₀.",
    inputLabel: "Sum S₂₀",
    placeholder: "Type S₂₀...",
    correctAnswer: 480,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `S₂₀ = ${val}`,
    formulaDisplay: "S₂₀ = 20/2 × [2×5 + 19×2]",
    apMode: "sum",
    apFirstTerm: 5,
    apCommonDiff: 2,
    apN: 20,
    apSequence: [5, 7, 9, 11, 13],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 Sum of 20 Terms",
      concept: "For large n, the sum formula is essential. It compresses 20 additions into one clean calculation.",
      formulaBreakdown: "S₂₀ = 20/2 × [10 + 19×2] = 10 × [10 + 38] = 10 × 48",
      stepByStep: [
        "a = 5, d = 2, n = 20.",
        "S₂₀ = 20/2 × [2×5 + (20−1)×2].",
        "= 10 × [10 + 38].",
        "= 10 × 48.",
        "= 480."
      ],
      visualTip: "20 bars in the factory! First term 5, last term 5+19×2=43. Average = (5+43)/2=24, times 20 = 480!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 5, d = 2, n = 20" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₂₀ = 10 × [10 + 19×2] = 10 × 48" },
      { lineNum: 4, textBefore: "S₂₀ = ", hasInput: true, inputIndex: 0, correctAnswer: "480", placeholder: "sum", textAfter: "", widthChars: 4 }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 5 — Real World Sequence Simulation (Levels 25–30)
  // ──────────────────────────────────────────────────────────────────

  "lvl-ap-25": {
    id: "lvl-ap-25",
    question: "A town's population is 5000 and grows by 200 people each year. What will the population be after 6 years (at the start of year 7)?",
    inputLabel: "Population after 6 years",
    placeholder: "Type population...",
    correctAnswer: 6200,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Population = ${val}`,
    formulaDisplay: "a₇ = 5000 + 6×200",
    apMode: "realworld",
    apFirstTerm: 5000,
    apCommonDiff: 200,
    apN: 7,
    apSequence: [5000, 5200, 5400, 5600, 5800],
    apAnswerType: "term",
    bookPage: {
      title: "📖 AP in Real Life — Population Growth",
      concept: "When a quantity grows by a fixed amount each period, it forms an AP. Here, population starts at 5000 (a₁ = 5000) and increases by d = 200 each year.",
      formulaBreakdown: "After 6 years = 7th year's value = a₇ = 5000 + 6×200",
      stepByStep: [
        "Year 1 population: a₁ = 5000.",
        "Each year adds d = 200.",
        "After 6 years = position n = 7 (counting year 1 as n=1).",
        "a₇ = 5000 + (7−1)×200 = 5000 + 6×200.",
        "= 5000 + 1200 = 6200."
      ],
      visualTip: "The simulator shows each year's population growing. Track 6 steps of +200 from 5000!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 5000 (Year 1), d = 200" },
      { lineNum: 2, textBefore: "After 6 years = 7th term (n = 7)" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "a₇ = 5000 + 6×200 = 5000 + 1200" },
      { lineNum: 5, textBefore: "Population = ", hasInput: true, inputIndex: 0, correctAnswer: "6200", placeholder: "people", textAfter: "", widthChars: 5 }
    ]
  },

  "lvl-ap-26": {
    id: "lvl-ap-26",
    question: "An employee's Year 1 salary is ₹25,000/month. It increases by ₹500 every year. Find the salary in Year 8.",
    inputLabel: "Year 8 Salary (₹)",
    placeholder: "Type salary...",
    correctAnswer: 28500,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `₹${val}/month`,
    formulaDisplay: "a₈ = 25000 + 7×500",
    apMode: "realworld",
    apFirstTerm: 25000,
    apCommonDiff: 500,
    apN: 8,
    apSequence: [25000, 25500, 26000, 26500, 27000],
    apAnswerType: "term",
    bookPage: {
      title: "📖 AP in Real Life — Salary Progression",
      concept: "A fixed annual increment creates an AP of salaries. Year 1 is a₁, Year 2 is a₂ = a₁ + d, and so on.",
      formulaBreakdown: "a₈ = 25000 + (8−1)×500 = 25000 + 7×500 = 25000 + 3500",
      stepByStep: [
        "Year 1 salary: a = 25000. Annual increment: d = 500.",
        "Find Year 8 salary: n = 8.",
        "a₈ = a + (n−1)×d.",
        "= 25000 + 7×500.",
        "= 25000 + 3500 = 28500."
      ],
      visualTip: "The salary engine shows 5 years. Extend it to year 8 — 7 increments of 500 from 25000!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a₁ = 25000, d = 500, n = 8" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "a₈ = 25000 + 7×500 = 25000 + 3500" },
      { lineNum: 4, textBefore: "Year 8 salary = ₹", hasInput: true, inputIndex: 0, correctAnswer: "28500", placeholder: "amount", textAfter: "/month", widthChars: 6 }
    ]
  },

  "lvl-ap-27": {
    id: "lvl-ap-27",
    question: "A staircase has 10 steps. Row 1 has 3 bricks, each row adds 2 more bricks. Find the total bricks needed.",
    inputLabel: "Total Bricks",
    placeholder: "Type total...",
    correctAnswer: 120,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Bricks = ${val}`,
    formulaDisplay: "S₁₀ = 10/2 × [2×3 + 9×2]",
    apMode: "realworld",
    apFirstTerm: 3,
    apCommonDiff: 2,
    apN: 10,
    apSequence: [3, 5, 7, 9, 11],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 AP in Real Life — Staircase Construction",
      concept: "The number of bricks in each row forms an AP: 3, 5, 7, 9, 11, ... Total bricks = sum of all rows = Sₙ.",
      formulaBreakdown: "S₁₀ = 10/2 × [2×3 + (10−1)×2] = 5 × [6 + 18] = 5 × 24",
      stepByStep: [
        "Row 1 = 3 bricks, each row adds 2. AP: 3,5,7,9,...",
        "Total = S₁₀ (sum of 10 terms).",
        "S₁₀ = 10/2 × [2×3 + 9×2].",
        "= 5 × [6 + 18] = 5 × 24.",
        "= 120 bricks."
      ],
      visualTip: "The staircase bars grow step by step. Their total height is S₁₀ = 120!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 3 (row 1), d = 2, n = 10 rows" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₁₀ = 10/2 × [6 + 9×2] = 5 × 24" },
      { lineNum: 4, textBefore: "Total bricks = ", hasInput: true, inputIndex: 0, correctAnswer: "120", placeholder: "bricks", textAfter: "", widthChars: 4 }
    ]
  },

  "lvl-ap-28": {
    id: "lvl-ap-28",
    question: "In a game, Level 1 gives 10 points. Each level gives 5 more points than the previous. Find total score after completing 15 levels.",
    inputLabel: "Total Score",
    placeholder: "Type total score...",
    correctAnswer: 675,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Score = ${val}`,
    formulaDisplay: "S₁₅ = 15/2 × [2×10 + 14×5]",
    apMode: "realworld",
    apFirstTerm: 10,
    apCommonDiff: 5,
    apN: 15,
    apSequence: [10, 15, 20, 25, 30],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 AP in Real Life — Scoring Systems",
      concept: "Scoring that increases by a constant per level is an AP. Total score = sum of all levels = Sₙ.",
      formulaBreakdown: "S₁₅ = 15/2 × [20 + 14×5] = 15/2 × [20 + 70] = 15/2 × 90 = 15 × 45",
      stepByStep: [
        "Level 1: 10 pts, increment: 5 pts/level. AP: 10,15,20,...",
        "Total after 15 levels = S₁₅.",
        "S₁₅ = 15/2 × [2×10 + 14×5].",
        "= 15/2 × 90 = 15 × 45.",
        "= 675."
      ],
      visualTip: "15 game levels each adding 5 more points. Watch the score bars stack to 675!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 10, d = 5, n = 15" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₁₅ = 15/2 × [20 + 14×5] = 15/2 × 90" },
      { lineNum: 4, textBefore: "S₁₅ = 15 × 45" },
      { lineNum: 5, textBefore: "Total score = ", hasInput: true, inputIndex: 0, correctAnswer: "675", placeholder: "pts", textAfter: "", widthChars: 4 }
    ]
  },

  "lvl-ap-29": {
    id: "lvl-ap-29",
    question: "A runner trains for 14 days. Day 1: 500m. Each day adds 100m more. Find total distance run over all 14 days.",
    inputLabel: "Total Distance (m)",
    placeholder: "Type total metres...",
    correctAnswer: 16100,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `${val} m`,
    formulaDisplay: "S₁₄ = 14/2 × [1000 + 13×100]",
    apMode: "realworld",
    apFirstTerm: 500,
    apCommonDiff: 100,
    apN: 14,
    apSequence: [500, 600, 700, 800, 900],
    apAnswerType: "sum",
    bookPage: {
      title: "📖 AP in Real Life — Training Program",
      concept: "Daily distances increasing by a fixed amount form an AP. Total distance = Sₙ where n is the number of days.",
      formulaBreakdown: "S₁₄ = 14/2 × [2×500 + 13×100] = 7 × [1000 + 1300] = 7 × 2300",
      stepByStep: [
        "Day 1: 500m, daily increase: 100m. AP: 500, 600, 700,...",
        "Total over 14 days = S₁₄.",
        "S₁₄ = 14/2 × [2×500 + (14−1)×100].",
        "= 7 × [1000 + 1300] = 7 × 2300.",
        "= 16100 m."
      ],
      visualTip: "14 training day bars. First = 500m, last = 500+13×100=1800m. Total = 7×(500+1800)!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: a = 500, d = 100, n = 14" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "S₁₄ = 7 × [1000 + 1300] = 7 × 2300" },
      { lineNum: 4, textBefore: "Total distance = ", hasInput: true, inputIndex: 0, correctAnswer: "16100", placeholder: "metres", textAfter: " m", widthChars: 6 }
    ]
  },

  "lvl-ap-30": {
    id: "lvl-ap-30",
    question: "BOSS: The sum of 10 terms of an AP is S₁₀ = 175. The first term is a = 4. Find the common difference d.",
    inputLabel: "Common Difference (d)",
    placeholder: "Type d...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}`,
    formulaDisplay: "Sₙ = n/2[2a + (n−1)d]",
    apMode: "boss",
    apFirstTerm: 4,
    apCommonDiff: 3,
    apN: 10,
    apSequence: [4, 7, 10, 13, 16],
    apAnswerType: "difference",
    bookPage: {
      title: "📖 BOSS — Sequence Master Reactor",
      concept: "The final challenge: reverse-engineer d from a known Sₙ. This combines all AP skills — the Sₙ formula, algebraic rearrangement, and pattern intuition.",
      formulaBreakdown: "175 = 5×[8 + 9d]  →  35 = 8 + 9d  →  9d = 27  →  d = 3",
      stepByStep: [
        "S₁₀ = 175, a = 4, n = 10.",
        "Apply sum formula: 175 = 10/2 × [2×4 + (10−1)d].",
        "175 = 5 × [8 + 9d].",
        "35 = 8 + 9d  →  9d = 27.",
        "d = 27 ÷ 9 = 3."
      ],
      visualTip: "The reactor shows 175 total. Work backward: 175÷5=35, then 35-8=27, then 27÷9=3. That's d!",
      analogy: "Think of d as the slope of a staircase — the steeper the slope, the faster the sum grows. Finding d from Sₙ is like measuring the slope from the total area!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: S₁₀ = 175, a = 4, n = 10" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "175 = 10/2 × [2×4 + (10−1)×d]" },
      { lineNum: 4, textBefore: "175 = 5[8 + 9d]  →  35 = 8 + 9d  →  9d = 27" },
      { lineNum: 5, textBefore: "d = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "d", textAfter: "", widthChars: 2 }
    ]
  }

};

export default arithmeticProgressionSpecs;
