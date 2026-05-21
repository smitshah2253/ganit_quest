import type { LevelSpecification } from '../levelSpecs';

const trigonometrySpecs: Record<string, LevelSpecification> = {
  "lvl-trig-01": {
    id: "lvl-trig-01",
    question: "Rotate the laser cannon to target exactly 45°. Enter the angle value in degrees.",
    inputLabel: "Rotation Angle (θ)",
    placeholder: "Type angle θ in degrees...",
    correctAnswer: 45,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Angle θ = 45°",
    trigMode: "angle",
    trigTargetAngle: 45,
    bookPage: {
      title: "📖 Angle Foundations",
      concept: "Angles are measured in degrees. An angle represents the amount of rotation between two lines meeting at a point (vertex).",
      formulaBreakdown: "Full circle = 360°, Right angle = 90°, Target angle = 45°",
      stepByStep: [
        "Rotate the slider or direct dial to align the laser beam.",
        "Observe the current angle value sweeping from 0°.",
        "Stop exactly when the angle indicator displays 45°.",
        "Submit the value 45 to proceed."
      ],
      visualTip: "Drag the laser cannon handle or adjust the slider to 45°! The input will sync to 45!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given Target Angle = 45°" },
      { lineNum: 2, textBefore: "Required rotation from horizontal baseline = ", hasInput: true, inputIndex: 0, correctAnswer: "45", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-02": {
    id: "lvl-trig-02",
    question: "Identify the interior angle between the two crossing robot paths. Calibrate the target to exactly 60°.",
    inputLabel: "Path Angle (θ)",
    placeholder: "Type angle θ...",
    correctAnswer: 60,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Angle θ = 60°",
    trigMode: "angle",
    trigTargetAngle: 60,
    bookPage: {
      title: "📖 Robot Path Angles",
      concept: "Angles between two intersecting paths represent standard spatial rotation. An equilateral alignment occurs at exactly 60°.",
      formulaBreakdown: "Target angle θ = 60°",
      stepByStep: [
        "Select the path rotator.",
        "Align the active tracking laser to target the second robot path.",
        "Ensure the angle measures exactly 60°.",
        "Submit 60 in the notebook."
      ],
      visualTip: "Rotate the second path until the interior laser beam shows exactly 60°!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Path 1 horizontal baseline = 0°" },
      { lineNum: 2, textBefore: "Path 2 incline relative to Path 1 = 60°" },
      { lineNum: 3, textBefore: "Measure of interior angle between robot paths = ", hasInput: true, inputIndex: 0, correctAnswer: "60", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-03": {
    id: "lvl-trig-03",
    question: "Aim the drone's pitch path using the slider to target exactly 30° above horizontal.",
    inputLabel: "Drone Pitch (θ)",
    placeholder: "Type pitch angle...",
    correctAnswer: 30,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Pitch Angle θ = 30°",
    trigMode: "angle",
    trigTargetAngle: 30,
    bookPage: {
      title: "📖 Pitch and Elevation",
      concept: "Pitch is the angle of elevation above the horizontal plane. A 30° elevation is the standard angle where the vertical rise is exactly half of the slant range.",
      formulaBreakdown: "Drone Pitch θ = 30°",
      stepByStep: [
        "Observe the drone scanner hovering in space.",
        "Slide the pitch control handle to adjust the vector beam.",
        "Stop at exactly 30° relative to the horizontal flight line.",
        "Submit the value 30."
      ],
      visualTip: "Calibrate the drone slider to 30° to align the navigation grid!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Horizontal baseline flight line = 0°" },
      { lineNum: 2, textBefore: "Angle of drone flight pitch above baseline = ", hasInput: true, inputIndex: 0, correctAnswer: "30", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-04": {
    id: "lvl-trig-04",
    question: "Adjust the viewing tower camera downward. Set the angle of depression to exactly 30° below horizontal.",
    inputLabel: "Angle of Depression (θ)",
    placeholder: "Type depression angle...",
    correctAnswer: 30,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Depression θ = ${val}°`,
    formulaDisplay: "Angle of Depression θ = 30°",
    trigMode: "angle",
    trigTargetAngle: 30,
    bookPage: {
      title: "📖 Angles of Depression",
      concept: "An angle of depression is the angle formed by the line of sight and the horizontal plane, when looking downwards. By alternate interior angles, it is equal to the angle of elevation from the target.",
      formulaBreakdown: "Depression Angle = Alternate Interior Elevation Angle = θ = 30°",
      stepByStep: [
        "Locate the horizontal baseline of the viewing tower.",
        "Rotate the camera tracker downwards.",
        "Match the depression sweep arc to 30°.",
        "Verify that alternate elevation angle is also 30°."
      ],
      visualTip: "Pivot the observer camera downward until the neon depression line is 30°!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Tower horizontal line of sight = 0°" },
      { lineNum: 2, textBefore: "Angle of sight line below horizontal = ", hasInput: true, inputIndex: 0, correctAnswer: "30", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-05": {
    id: "lvl-trig-05",
    question: "Navigate the climbing robot on a slope. Adjust the slope ramp angle to exactly 45°.",
    inputLabel: "Slope Angle (θ)",
    placeholder: "Type slope angle...",
    correctAnswer: 45,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Slope θ = ${val}°`,
    formulaDisplay: "Slope Angle θ = 45°",
    trigMode: "angle",
    trigTargetAngle: 45,
    bookPage: {
      title: "📖 Slope and Incline",
      concept: "A slope's steepness is represented by its angle θ. An angle of 45° represents a 1:1 ratio where the vertical rise equals the horizontal run.",
      formulaBreakdown: "tan θ = Rise / Run. If θ = 45°, Rise = Run (1:1 ratio)",
      stepByStep: [
        "Drag the slope ramp joint vertex.",
        "Resize the ramp until the incline slope makes a 45° angle with the ground.",
        "Ensure the vertical rise matches horizontal width.",
        "Enter 45 as your answer."
      ],
      visualTip: "Align the ramp joint to 45°. Notice how rise and run become perfectly equal!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Horizontal ramp run = x units" },
      { lineNum: 2, textBefore: "Vertical ramp rise = y units" },
      { lineNum: 3, textBefore: "If rise equals run (1:1 incline ratio):" },
      { lineNum: 4, textBefore: "  tan θ = rise / run = 1" },
      { lineNum: 5, textBefore: "  θ = tan⁻¹(1) = ", hasInput: true, inputIndex: 0, correctAnswer: "45", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-06": {
    id: "lvl-trig-06",
    question: "Trigger the laser cannon sweep and stop it exactly when the rotation is a right angle (90°).",
    inputLabel: "Sweep Angle (θ)",
    placeholder: "Type angle θ...",
    correctAnswer: 90,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Right Angle θ = 90°",
    trigMode: "angle",
    trigTargetAngle: 90,
    bookPage: {
      title: "📖 Right Angles in Trigonometry",
      concept: "A right angle measures exactly 90° and forms the perpendicular baseline for all trigonometric ratios in a right-angled triangle.",
      formulaBreakdown: "θ = 90° (Perpendicular alignment)",
      stepByStep: [
        "Observe the sweeping neon targeting line.",
        "Wait for the beam to align vertically with the Y-axis.",
        "Lock the angle when it indicates exactly 90°.",
        "Enter 90 to complete the foundations world."
      ],
      visualTip: "Press stop or drag the angle sweep handle to exactly 90° to activate perpendicular mode!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Perpendicular line of sweep relative to X-axis:" },
      { lineNum: 2, textBefore: "Angle of perpendicular intersection = ", hasInput: true, inputIndex: 0, correctAnswer: "90", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-07": {
    id: "lvl-trig-07",
    question: "A right-angled triangle has Opposite side AB = 3 and Adjacent side BC = 4. Calculate its Hypotenuse AC.",
    inputLabel: "Hypotenuse AC",
    placeholder: "Type hypotenuse...",
    correctAnswer: 5,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AC = ${val}`,
    formulaDisplay: "AC² = AB² + BC²",
    trigMode: "ratio",
    trigOpposite: 3,
    trigAdjacent: 4,
    trigHypotenuse: 5,
    bookPage: {
      title: "📖 Pythagoras Theorem",
      concept: "In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides: AC² = AB² + BC².",
      formulaBreakdown: "AC = √(AB² + BC²)",
      stepByStep: [
        "Identify sides: AB = 3 (Opposite), BC = 4 (Adjacent).",
        "Apply theorem: AC² = 3² + 4² = 9 + 16 = 25.",
        "Take square root: AC = √25 = 5.",
        "Verify on the interactive screen by scaling the triangle."
      ],
      visualTip: "Drag the triangle vertex to AB=3, BC=4, and notice the hypotenuse measures exactly 5!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "In right triangle ABC, ∠B = 90°" },
      { lineNum: 2, textBefore: "Given: Opposite side AB = 3, Adjacent side BC = 4" },
      { lineNum: 3, textBefore: "By Pythagoras Theorem: AC² = AB² + BC²" },
      { lineNum: 4, textBefore: "  AC² = 3² + 4² = 9 + 16 = 25" },
      { lineNum: 5, textBefore: "  AC = √25 = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "AC", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-trig-08": {
    id: "lvl-trig-08",
    question: "Calibrate the laser triangle. If Opposite side = 5 and Hypotenuse = 10, calculate the sine ratio (sin θ).",
    inputLabel: "Sine Ratio (sin θ)",
    placeholder: "Type sine value (e.g. 0.5)...",
    correctAnswer: 0.5,
    tolerance: 0.01,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `sin θ = ${val}`,
    formulaDisplay: "sin θ = Opposite / Hypotenuse",
    trigMode: "ratio",
    trigFormulaType: "sin",
    trigOpposite: 5,
    trigHypotenuse: 10,
    bookPage: {
      title: "📖 Discovering Sine",
      concept: "The sine of an angle θ in a right triangle is the ratio of the length of the opposite side to the length of the hypotenuse.",
      formulaBreakdown: "sin θ = Opposite / Hypotenuse",
      stepByStep: [
        "Locate the opposite side of length 5.",
        "Locate the hypotenuse of length 10.",
        "Calculate sine: sin θ = 5 / 10 = 0.5.",
        "Observe how sin θ matches 0.5 when θ = 30°."
      ],
      visualTip: "Drag the hypotenuse or adjust sliders to see sin θ = 5/10 = 0.5 on the display!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "In right triangle, Opposite side = 5, Hypotenuse = 10" },
      { lineNum: 2, textBefore: "Formula: sin θ = Opposite / Hypotenuse" },
      { lineNum: 3, textBefore: "  sin θ = 5 / 10" },
      { lineNum: 4, textBefore: "  sin θ = ", hasInput: true, inputIndex: 0, correctAnswer: "0.5", placeholder: "ratio", textAfter: "", widthChars: 4 }
    ]
  },
  "lvl-trig-09": {
    id: "lvl-trig-09",
    question: "Discover the cosine ratio. If Adjacent side (solar projection) = 8.66 and Hypotenuse = 10, find cos 30°.",
    inputLabel: "Cosine Ratio (cos θ)",
    placeholder: "Type cosine value (e.g. 0.866)...",
    correctAnswer: 0.866,
    tolerance: 0.01,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `cos θ = ${val}`,
    formulaDisplay: "cos θ = Adjacent / Hypotenuse",
    trigMode: "ratio",
    trigFormulaType: "cos",
    trigAdjacent: 8.66,
    trigHypotenuse: 10,
    bookPage: {
      title: "📖 Discovering Cosine",
      concept: "The cosine of an angle θ is the ratio of the length of the adjacent side (horizontal baseline projection shadow) to the length of the hypotenuse.",
      formulaBreakdown: "cos θ = Adjacent / Hypotenuse",
      stepByStep: [
        "Identify Adjacent side = 8.66, Hypotenuse = 10.",
        "Compute cos θ = 8.66 / 10 = 0.866.",
        "Notice that cos 30° is exactly √3/2 ≈ 0.866."
      ],
      visualTip: "Scale the horizontal shadow vector to 8.66 and watch the cosine ratio update to 0.866!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "In right triangle, Adjacent side = 8.66, Hypotenuse = 10" },
      { lineNum: 2, textBefore: "Formula: cos θ = Adjacent / Hypotenuse" },
      { lineNum: 3, textBefore: "  cos θ = 8.66 / 10" },
      { lineNum: 4, textBefore: "  cos θ = ", hasInput: true, inputIndex: 0, correctAnswer: "0.866", placeholder: "ratio", textAfter: "", widthChars: 6 }
    ]
  },
  "lvl-trig-10": {
    id: "lvl-trig-10",
    question: "A rover climbs a slope with a vertical rise of 3m and horizontal run of 4m. Find the tangent incline (tan θ).",
    inputLabel: "Tangent Ratio (tan θ)",
    placeholder: "Type tangent value (e.g. 0.75)...",
    correctAnswer: 0.75,
    tolerance: 0.01,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `tan θ = ${val}`,
    formulaDisplay: "tan θ = Opposite / Adjacent",
    trigMode: "ratio",
    trigFormulaType: "tan",
    trigOpposite: 3,
    trigAdjacent: 4,
    bookPage: {
      title: "📖 Discovering Tangent",
      concept: "The tangent of θ is the ratio of the opposite side (vertical rise) to the adjacent side (horizontal run).",
      formulaBreakdown: "tan θ = Opposite / Adjacent = Rise / Run",
      stepByStep: [
        "Identify Opposite side = 3, Adjacent side = 4.",
        "Calculate tangent ratio: tan θ = 3 / 4 = 0.75.",
        "This describes a slope grade of 75%."
      ],
      visualTip: "Observe the climb angle: tan θ = 3/4 = 0.75!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "In right triangle, Opposite side = 3, Adjacent side = 4" },
      { lineNum: 2, textBefore: "Formula: tan θ = Opposite / Adjacent" },
      { lineNum: 3, textBefore: "  tan θ = 3 / 4" },
      { lineNum: 4, textBefore: "  tan θ = ", hasInput: true, inputIndex: 0, correctAnswer: "0.75", placeholder: "ratio", textAfter: "", widthChars: 5 }
    ]
  },
  "lvl-trig-11": {
    id: "lvl-trig-11",
    question: "Match the reciprocal ratios. If sin θ = 0.5, calculate the cosecant of θ (cosec θ).",
    inputLabel: "Cosecant Ratio (cosec θ)",
    placeholder: "Type cosec value...",
    correctAnswer: 2,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `cosec θ = ${val}`,
    formulaDisplay: "cosec θ = 1 / sin θ",
    trigMode: "ratio",
    trigFormulaType: "cosec",
    bookPage: {
      title: "📖 Reciprocal Trigonometric Ratios",
      concept: "Cosecant, Secant, and Cotangent are the reciprocals of Sine, Cosine, and Tangent respectively.",
      formulaBreakdown: "cosec θ = 1 / sin θ, sec θ = 1 / cos θ, cot θ = 1 / tan θ",
      stepByStep: [
        "Identify given ratio: sin θ = 0.5.",
        "Apply reciprocal definition: cosec θ = 1 / sin θ.",
        "Calculate: cosec θ = 1 / 0.5 = 2.",
        "Submit 2 to complete this step."
      ],
      visualTip: "Cosec θ is the reciprocal of sin θ. If sin θ is 1/2, then cosec θ must be exactly 2!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: sin θ = 0.5" },
      { lineNum: 2, textBefore: "Formula: cosec θ = 1 / sin θ" },
      { lineNum: 3, textBefore: "  cosec θ = 1 / 0.5" },
      { lineNum: 4, textBefore: "  cosec θ = ", hasInput: true, inputIndex: 0, correctAnswer: "2", placeholder: "cosec", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-trig-12": {
    id: "lvl-trig-12",
    question: "Resize the triangle in real-time. If Opposite = 6, find the required Adjacent side length to make tan θ = 0.75.",
    inputLabel: "Adjacent Side Length",
    placeholder: "Type adjacent length...",
    correctAnswer: 8,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Adjacent = ${val}`,
    formulaDisplay: "Adjacent = Opposite / tan θ",
    trigMode: "ratio",
    trigOpposite: 6,
    trigTargetRatio: 0.75,
    bookPage: {
      title: "📖 Dynamic Inverses",
      concept: "By rearranging the tangent formula, we can solve for any unknown side: Adjacent = Opposite / tan θ.",
      formulaBreakdown: "Adjacent = Opposite / tan θ",
      stepByStep: [
        "We are given Opposite side = 6, and target ratio tan θ = 0.75.",
        "Substitute into formula: Adjacent = 6 / 0.75.",
        "Calculate: Adjacent = 8.",
        "Verify on screen: when Adjacent side is 8, the slope tangent ratio displays exactly 0.75."
      ],
      visualTip: "Drag the triangle base vertex to width 8, keeping height at 6, to match the target!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: Opposite side = 6, Target tan θ = 0.75" },
      { lineNum: 2, textBefore: "Formula: tan θ = Opposite / Adjacent" },
      { lineNum: 3, textBefore: "  Adjacent = Opposite / tan θ" },
      { lineNum: 4, textBefore: "  Adjacent = 6 / 0.75" },
      { lineNum: 5, textBefore: "  Adjacent Side = ", hasInput: true, inputIndex: 0, correctAnswer: "8", placeholder: "adj", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-trig-13": {
    id: "lvl-trig-13",
    question: "Balance the horizontal and vertical energy laser beams. If sin θ = 0.6, find the value of sin²θ + cos²θ.",
    inputLabel: "Identity Sum",
    placeholder: "Type identity sum...",
    correctAnswer: 1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Sum = ${val}`,
    formulaDisplay: "sin²θ + cos²θ = 1",
    trigMode: "identity",
    bookPage: {
      title: "📖 First Pythagorean Identity",
      concept: "For any angle θ, the sum of the squares of sine and cosine is always exactly equal to 1. This is the cornerstone of trigonometric identities.",
      formulaBreakdown: "sin²θ + cos²θ = 1",
      stepByStep: [
        "We are given sin θ = 0.6.",
        "Let's compute cos θ = √(1 - sin²θ) = √(1 - 0.36) = √0.64 = 0.8.",
        "Square and sum them: sin²θ + cos²θ = 0.6² + 0.8² = 0.36 + 0.64 = 1.00.",
        "Submit 1.00."
      ],
      visualTip: "No matter how you rotate the vector beam, the squared sum sin²θ + cos²θ is always exactly 1!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: sin θ = 0.6" },
      { lineNum: 2, textBefore: "We know that: cos²θ = 1 - sin²θ" },
      { lineNum: 3, textBefore: "  cos²θ = 1 - (0.6)² = 1 - 0.36 = 0.64" },
      { lineNum: 4, textBefore: "Expression: sin²θ + cos²θ = 0.36 + 0.64" },
      { lineNum: 5, textBefore: "  sin²θ + cos²θ = ", hasInput: true, inputIndex: 0, correctAnswer: "1", placeholder: "1", textAfter: "", widthChars: 2 }
    ]
  },
  "lvl-trig-14": {
    id: "lvl-trig-14",
    question: "Fix the broken trigonometric energy reactor. Evaluate the simplified expression: 5 sin²θ + 5 cos²θ.",
    inputLabel: "Reactor Value",
    placeholder: "Type reactor value...",
    correctAnswer: 5,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    formulaDisplay: "k(sin²θ + cos²θ) = k",
    trigMode: "identity",
    bookPage: {
      title: "📖 Factoring Identities",
      concept: "Using basic factoring, we can pull out constants from trigonometric sum terms. Since sin²θ + cos²θ = 1, k sin²θ + k cos²θ = k.",
      formulaBreakdown: "k sin²θ + k cos²θ = k(sin²θ + cos²θ) = k(1) = k",
      stepByStep: [
        "Identify expression: 5 sin²θ + 5 cos²θ.",
        "Factor out the common coefficient 5: 5(sin²θ + cos²θ).",
        "Substitute the identity sin²θ + cos²θ = 1.",
        "Calculate: 5(1) = 5."
      ],
      visualTip: "Factor out the common 5 to simplify! The system values will scale and stabilize at 5!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Expression: 5 sin²θ + 5 cos²θ" },
      { lineNum: 2, textBefore: "Factor out 5:" },
      { lineNum: 3, textBefore: "  5 sin²θ + 5 cos²θ = 5(sin²θ + cos²θ)" },
      { lineNum: 4, textBefore: "Since sin²θ + cos²θ = 1:" },
      { lineNum: 5, textBefore: "  5(sin²θ + cos²θ) = 5 × 1 = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "ans", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-trig-15": {
    id: "lvl-trig-15",
    question: "Transform a tangent beam into constituents. If sin θ = 0.6 and cos θ = 0.8, calculate the tangent (tan θ).",
    inputLabel: "Tangent Value",
    placeholder: "Type tan value...",
    correctAnswer: 0.75,
    tolerance: 0.01,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `tan θ = ${val}`,
    formulaDisplay: "tan θ = sin θ / cos θ",
    trigMode: "identity",
    bookPage: {
      title: "📖 Tangent as a Ratio of Sine and Cosine",
      concept: "Tangent represents the ratio of the vertical sine projection to the horizontal cosine projection.",
      formulaBreakdown: "tan θ = sin θ / cos θ",
      stepByStep: [
        "We are given sin θ = 0.6, cos θ = 0.8.",
        "Substitute: tan θ = 0.6 / 0.8.",
        "Simplify the fraction: tan θ = 3 / 4 = 0.75.",
        "Submit 0.75."
      ],
      visualTip: "タンジェント is exactly sin/cos! Notice how tan θ adapts to 0.75 as you match inputs!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: sin θ = 0.6, cos θ = 0.8" },
      { lineNum: 2, textBefore: "Formula: tan θ = sin θ / cos θ" },
      { lineNum: 3, textBefore: "  tan θ = 0.6 / 0.8" },
      { lineNum: 4, textBefore: "  tan θ = ", hasInput: true, inputIndex: 0, correctAnswer: "0.75", placeholder: "tan", textAfter: "", widthChars: 4 }
    ]
  },
  "lvl-trig-16": {
    id: "lvl-trig-16",
    question: "Solve the identity block matching puzzle. Find the value of: cosec²θ - cot²θ.",
    inputLabel: "Identity Value",
    placeholder: "Type value...",
    correctAnswer: 1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `cosec²θ - cot²θ = ${val}`,
    formulaDisplay: "cosec²θ - cot²θ = 1",
    trigMode: "identity",
    bookPage: {
      title: "📖 Reciprocal Pythagorean Identities",
      concept: "The second and third Pythagorean identities connect sec/tan and cosec/cot: 1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ.",
      formulaBreakdown: "cosec²θ - cot²θ = 1",
      stepByStep: [
        "Recall standard identity: 1 + cot²θ = cosec²θ.",
        "Subtract cot²θ from both sides: cosec²θ - cot²θ = 1.",
        "Hence, no matter the angle, this expression equals exactly 1."
      ],
      visualTip: "This is a direct reciprocal Pythagorean relation. The balanced sum is always exactly 1!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Recall identity: 1 + cot²θ = cosec²θ" },
      { lineNum: 2, textBefore: "Rearranging the terms:" },
      { lineNum: 3, textBefore: "  cosec²θ - cot²θ = ", hasInput: true, inputIndex: 0, correctAnswer: "1", placeholder: "1", textAfter: "", widthChars: 2 }
    ]
  },
  "lvl-trig-17": {
    id: "lvl-trig-17",
    question: "On a unit circle of radius 1, if cos θ = 0.6, find the absolute positive value of sin θ.",
    inputLabel: "Sine Projection",
    placeholder: "Type sine value...",
    correctAnswer: 0.8,
    tolerance: 0.01,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `sin θ = ${val}`,
    formulaDisplay: "sin θ = √(1 - cos²θ)",
    trigMode: "identity",
    bookPage: {
      title: "📖 Unit Circle Projections",
      concept: "On a unit circle (radius = 1), the coordinates of a swept point are (cos θ, sin θ). Applying the Pythagorean Theorem gives sin²θ + cos²θ = 1.",
      formulaBreakdown: "sin θ = √(1 - cos²θ)",
      stepByStep: [
        "Given: cos θ = 0.6.",
        "Apply formula: sin²θ = 1 - cos²θ = 1 - 0.36 = 0.64.",
        "Take square root: sin θ = √0.64 = 0.8.",
        "Observe the vertical height on the unit circle screen."
      ],
      visualTip: "Resize or drag the vector point until the horizontal cosine is 0.6. The height (sine) becomes 0.8!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "In a unit circle, radius r = 1" },
      { lineNum: 2, textBefore: "Given: cos θ = 0.6" },
      { lineNum: 3, textBefore: "Formula: sin²θ + cos²θ = 1" },
      { lineNum: 4, textBefore: "  sin²θ + (0.6)² = 1" },
      { lineNum: 5, textBefore: "  sin²θ = 1 - 0.36 = 0.64" },
      { lineNum: 6, textBefore: "  sin θ = √0.64 = ", hasInput: true, inputIndex: 0, correctAnswer: "0.8", placeholder: "sin", textAfter: "", widthChars: 4 }
    ]
  },
  "lvl-trig-18": {
    id: "lvl-trig-18",
    question: "Stabilize the timed identity reactor. Solve for the coefficient k: 3 sin²θ + 3 cos²θ = k.",
    inputLabel: "Coefficient k",
    placeholder: "Type k value...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `k = ${val}`,
    formulaDisplay: "k(sin²θ + cos²θ) = k",
    trigMode: "identity",
    bookPage: {
      title: "📖 Stabilizing Coefficients",
      concept: "Any common factor multiplied by the Pythagorean Identity yields the factor itself, because the identity acts as a multiplier of 1.",
      formulaBreakdown: "k sin²θ + k cos²θ = k",
      stepByStep: [
        "Expression: 3 sin²θ + 3 cos²θ.",
        "Factor out 3: 3(sin²θ + cos²θ).",
        "Since sin²θ + cos²θ = 1, we get 3(1) = 3.",
        "Thus, k must be exactly 3 to balance the equation."
      ],
      visualTip: "Factor out the 3 to see the reactor balance beautifully at 3!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given equation: 3 sin²θ + 3 cos²θ = k" },
      { lineNum: 2, textBefore: "Factor the left-hand side:" },
      { lineNum: 3, textBefore: "  3(sin²θ + cos²θ) = k" },
      { lineNum: 4, textBefore: "Since sin²θ + cos²θ = 1:" },
      { lineNum: 5, textBefore: "  3(1) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "k", textAfter: "", widthChars: 2 }
    ]
  },
  "lvl-trig-19": {
    id: "lvl-trig-19",
    question: "If a laser beam hits a mirror grid at an angle θ = 40°, calculate its complementary angle (90° - θ).",
    inputLabel: "Complementary Angle",
    placeholder: "Type angle in degrees...",
    correctAnswer: 50,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `90° - θ = ${val}°`,
    formulaDisplay: "Complementary = 90° - θ",
    trigMode: "complementary",
    bookPage: {
      title: "📖 Complementary Angles",
      concept: "Two angles are said to be complementary if their sum is exactly equal to 90°.",
      formulaBreakdown: "θ₁ + θ₂ = 90°",
      stepByStep: [
        "Identify given angle: θ = 40°.",
        "Calculate complement: 90° - 40° = 50°.",
        "Enter 50 to clear this level."
      ],
      visualTip: "Look at the visual grid: the sum of the incidence and mirror angles forms a perfect 90° corner!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given Angle θ = 40°" },
      { lineNum: 2, textBefore: "Complementary Angle = 90° - θ" },
      { lineNum: 3, textBefore: "  Angle = 90° - 40° = ", hasInput: true, inputIndex: 0, correctAnswer: "50", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-20": {
    id: "lvl-trig-20",
    question: "Align two complementary bridges. Bridge A is tilted at 35°. Find the required angle for Bridge B to lock them (A + B = 90°).",
    inputLabel: "Bridge B Angle",
    placeholder: "Type angle...",
    correctAnswer: 55,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Bridge B = ${val}°`,
    formulaDisplay: "A + B = 90°",
    trigMode: "complementary",
    bookPage: {
      title: "📖 Bridge Alignment Puzzles",
      concept: "For two rotating mechanical bridges to join at a perpendicular peak, their incline angles must sum to 90°.",
      formulaBreakdown: "Bridge B = 90° - Bridge A",
      stepByStep: [
        "Observe Bridge A inclined at 35°.",
        "Set Bridge B to complementary angle to form a rigid joint.",
        "B = 90° - 35° = 55°.",
        "Submit 55."
      ],
      visualTip: "Pivot Bridge B using the slider until it hits 55° to bridge the chasm!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Angle of Bridge A = 35°" },
      { lineNum: 2, textBefore: "For complementary perpendicular lock:" },
      { lineNum: 3, textBefore: "  Bridge A + Bridge B = 90°" },
      { lineNum: 4, textBefore: "  Bridge B = 90° - 35° = ", hasInput: true, inputIndex: 0, correctAnswer: "55", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-21": {
    id: "lvl-trig-21",
    question: "Convert a sine transceiver wave to cosine. If sin 30° = cos x, find the value of x in degrees.",
    inputLabel: "Degrees x",
    placeholder: "Type degrees...",
    correctAnswer: 60,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x = ${val}°`,
    formulaDisplay: "sin θ = cos(90° - θ)",
    trigMode: "complementary",
    bookPage: {
      title: "📖 Sine-Cosine Complementary Waveforms",
      concept: "Sine and Cosine are complementary co-functions: sin θ = cos(90° - θ) and cos θ = sin(90° - θ).",
      formulaBreakdown: "cos x = sin 30° = cos(90° - 30°) = cos 60°",
      stepByStep: [
        "Recall identity: sin θ = cos(90° - θ).",
        "We are given sin 30° = cos x.",
        "Therefore, x = 90° - 30° = 60°."
      ],
      visualTip: "Adjust the wave phase slider! At 60°, the sine wave shifts perfectly to match the cosine reference!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: sin 30° = cos x" },
      { lineNum: 2, textBefore: "Formula: sin θ = cos(90° - θ)" },
      { lineNum: 3, textBefore: "Substitute θ = 30°:" },
      { lineNum: 4, textBefore: "  sin 30° = cos(90° - 30°) = cos 60°" },
      { lineNum: 5, textBefore: "Hence, x = ", hasInput: true, inputIndex: 0, correctAnswer: "60", placeholder: "x", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-22": {
    id: "lvl-trig-22",
    question: "Unlock the gate. Evaluate the complementary fraction: sin 30° / cos 60°.",
    inputLabel: "Fraction Value",
    placeholder: "Type value...",
    correctAnswer: 1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    formulaDisplay: "sin 30° / cos 60° = 1",
    trigMode: "complementary",
    bookPage: {
      title: "📖 Ratio Simplifications",
      concept: "Since sin θ = cos(90° - θ), any ratio of complementary co-functions of corresponding complementary angles is always equal to 1.",
      formulaBreakdown: "sin θ / cos(90° - θ) = 1",
      stepByStep: [
        "Evaluate numerator: sin 30° = 0.5.",
        "Evaluate denominator: cos 60° = 0.5.",
        "Divide: 0.5 / 0.5 = 1."
      ],
      visualTip: "Since 30° + 60° = 90°, sin 30° is identical to cos 60°! The fraction simplifies to exactly 1!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Expression: sin 30° / cos 60°" },
      { lineNum: 2, textBefore: "Since cos 60° = cos(90° - 30°) = sin 30°:" },
      { lineNum: 3, textBefore: "  sin 30° / cos 60° = sin 30° / sin 30° = ", hasInput: true, inputIndex: 0, correctAnswer: "1", placeholder: "1", textAfter: "", widthChars: 2 }
    ]
  },
  "lvl-trig-23": {
    id: "lvl-trig-23",
    question: "Drone Alpha is tracking at elevation angle θ = 25°. Find the complementary tracking angle for Drone Beta.",
    inputLabel: "Beta Angle",
    placeholder: "Type angle...",
    correctAnswer: 65,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Beta = ${val}°`,
    formulaDisplay: "Beta = 90° - Alpha",
    trigMode: "complementary",
    bookPage: {
      title: "📖 Dual Target Tracking",
      concept: "Synchronized dual elevation observers require complementary angles to intersect their scan ranges at a perpendicular lock.",
      formulaBreakdown: "Beta = 90° - Alpha",
      stepByStep: [
        "Observe Drone Alpha tracking angle = 25°.",
        "Drone Beta requires complement: 90° - 25° = 65°.",
        "Set Drone Beta to 65°."
      ],
      visualTip: "Pivot Drone Beta's elevation pointer to 65° to align targets together!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Drone Alpha elevation = 25°" },
      { lineNum: 2, textBefore: "For complementary dual tracking:" },
      { lineNum: 3, textBefore: "  Beta = 90° - 25° = ", hasInput: true, inputIndex: 0, correctAnswer: "65", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-trig-24": {
    id: "lvl-trig-24",
    question: "Evaluate the complementary expression to navigate the labyrinth: cos 48° - sin 42°.",
    inputLabel: "Result Value",
    placeholder: "Type value...",
    correctAnswer: 0,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `cos 48° - sin 42° = ${val}`,
    formulaDisplay: "cos 48° - sin 42° = 0",
    trigMode: "complementary",
    bookPage: {
      title: "📖 Complementary Subtractions",
      concept: "Subtracting co-functions of complementary angles is identical to subtracting a value from itself, yielding exactly 0.",
      formulaBreakdown: "cos(90° - θ) - sin θ = 0",
      stepByStep: [
        "Observe angles: 48° and 42° are complementary because 48° + 42° = 90°.",
        "Apply identity: cos 48° = sin(90° - 48°) = sin 42°.",
        "Substitute: sin 42° - sin 42° = 0."
      ],
      visualTip: "Since cos 48° is exactly equal to sin 42°, their subtraction results in 0!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Expression: cos 48° - sin 42°" },
      { lineNum: 2, textBefore: "We know that cos 48° = cos(90° - 42°) = sin 42°" },
      { lineNum: 3, textBefore: "Substitute: sin 42° - sin 42° = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "0", textAfter: "", widthChars: 2 }
    ]
  },
  "lvl-trig-25": {
    id: "lvl-trig-25",
    question: "An observer 20m away from the base of a building sees its top at an angle of elevation of 45°. Calculate the building height.",
    inputLabel: "Building Height",
    placeholder: "Type building height...",
    correctAnswer: 20,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "tan 45° = Height / Base",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Heights and Distances: Incline 45°",
      concept: "For an angle of elevation of 45°, the tangent ratio is exactly 1. This means the height of the observed object is equal to the distance from its base.",
      formulaBreakdown: "Height = Base × tan 45° = Base × 1 = Base",
      stepByStep: [
        "Identify given base distance = 20m.",
        "Observe elevation angle = 45°.",
        "Apply tangent: tan 45° = Height / 20.",
        "Since tan 45° = 1: Height = 20 × 1 = 20m."
      ],
      visualTip: "Notice the green laser vector: at 45°, height and base form a perfect square boundary of 20m!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let the height of the building be h meters." },
      { lineNum: 2, textBefore: "Distance from base of building = 20m" },
      { lineNum: 3, textBefore: "Angle of elevation of the top = 45°" },
      { lineNum: 4, textBefore: "In right triangle, tan 45° = h / 20" },
      { lineNum: 5, textBefore: "  1 = h / 20" },
      { lineNum: 6, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "20", placeholder: "h", textAfter: " meters", widthChars: 3 }
    ]
  },
  "lvl-trig-26": {
    id: "lvl-trig-26",
    question: "A drone scanner at a horizontal distance of 100m measures the elevation of a mountain peak as 60°. Find the height (use √3 ≈ 1.732).",
    inputLabel: "Mountain Height",
    placeholder: "Type height...",
    correctAnswer: 173.2,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Height = ${val}m`,
    formulaDisplay: "Height = Base × tan 60°",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Mountain Elevation 60°",
      concept: "Tangent 60° is exactly equal to √3 ≈ 1.732. This represents a steep slope where height is 1.732 times the base distance.",
      formulaBreakdown: "Height = Base × tan 60° = Base × √3",
      stepByStep: [
        "Horizontal distance (Base) = 100m.",
        "Angle of elevation = 60°.",
        "Apply tangent: tan 60° = Height / 100.",
        "Height = 100 × √3 ≈ 100 × 1.732 = 173.2m."
      ],
      visualTip: "Observe the drone sweep: at 60°, height stretches to 1.732 times the 100m base length, matching 173.2m!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let the height of the mountain be h." },
      { lineNum: 2, textBefore: "Given: Distance from base = 100m" },
      { lineNum: 3, textBefore: "Angle of elevation = 60°" },
      { lineNum: 4, textBefore: "In right triangle, tan 60° = h / 100" },
      { lineNum: 5, textBefore: "  √3 = h / 100" },
      { lineNum: 6, textBefore: "  h = 100 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "173.2", placeholder: "h", textAfter: " meters", widthChars: 6 }
    ]
  },
  "lvl-trig-27": {
    id: "lvl-trig-27",
    question: "A rescue ladder makes an angle of 60° with the ground. If its foot is 10m away from the building base, find the length of the ladder.",
    inputLabel: "Ladder Length",
    placeholder: "Type ladder length...",
    correctAnswer: 20,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `L = ${val}m`,
    formulaDisplay: "cos 60° = Base / Hypotenuse",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Hypotenuse and Cosine",
      concept: "When the base and angle are known and the slant length (hypotenuse) is required, the Cosine ratio is the most direct tool.",
      formulaBreakdown: "Hypotenuse = Base / cos θ",
      stepByStep: [
        "Given Base (foot distance) = 10m.",
        "Incline angle θ = 60°.",
        "Apply cosine: cos 60° = 10 / L.",
        "Since cos 60° = 0.5: L = 10 / 0.5 = 20m."
      ],
      visualTip: "At 60° ground angle, the hypotenuse ladder length is exactly double the base offset: 20m!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let the length of the ladder be L meters." },
      { lineNum: 2, textBefore: "Distance of foot of ladder = 10m" },
      { lineNum: 3, textBefore: "Angle with ground = 60°" },
      { lineNum: 4, textBefore: "In right triangle, cos 60° = 10 / L" },
      { lineNum: 5, textBefore: "  0.5 = 10 / L" },
      { lineNum: 6, textBefore: "  L = 10 / 0.5 = ", hasInput: true, inputIndex: 0, correctAnswer: "20", placeholder: "L", textAfter: " meters", widthChars: 3 }
    ]
  },
  "lvl-trig-28": {
    id: "lvl-trig-28",
    question: "From the top of a 50m tower, the angle of depression to a landing ship is 45°. Find the ship's horizontal distance.",
    inputLabel: "Landing Distance",
    placeholder: "Type distance...",
    correctAnswer: 50,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "tan 45° = Height / Distance",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Depression alternate heights",
      concept: "An observer looking down measures an angle of depression. This translates directly to a congruent angle of elevation from the ship to the observer.",
      formulaBreakdown: "Distance = Height / tan(Depression Angle)",
      stepByStep: [
        "Lighthouse height = 50m.",
        "Angle of depression = 45°.",
        "By alternate interior angles, angle of elevation at ship is 45°.",
        "Distance = 50 / tan 45° = 50 / 1 = 50m."
      ],
      visualTip: "Depression angle of 45° forms a symmetrical right isosceles triangle: height = distance = 50m!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Height of tower = 50m" },
      { lineNum: 2, textBefore: "Angle of depression = 45°" },
      { lineNum: 3, textBefore: "Alternate interior angle of elevation = 45°" },
      { lineNum: 4, textBefore: "Let the horizontal distance be d." },
      { lineNum: 5, textBefore: "In right triangle, tan 45° = 50 / d" },
      { lineNum: 6, textBefore: "  1 = 50 / d" },
      { lineNum: 7, textBefore: "  d = ", hasInput: true, inputIndex: 0, correctAnswer: "50", placeholder: "d", textAfter: " meters", widthChars: 3 }
    ]
  },
  "lvl-trig-29": {
    id: "lvl-trig-29",
    question: "Two vertical towers are 80m apart. From a point on the road between them, their elevation angles are 60° and 30°. Find their height (use √3 ≈ 1.732).",
    inputLabel: "Tower Height",
    placeholder: "Type height...",
    correctAnswer: 34.64,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 20√3 ≈ 34.64m",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Double Angle Obelisks",
      concept: "Multi-angle observation puzzles involve setting up two equations using a shared variable (height) and segmenting the baseline distance.",
      formulaBreakdown: "x + y = 80, h = x tan 60° = y tan 30°",
      stepByStep: [
        "Let the height of towers be h, and point division be x and 80-x.",
        "In triangle 1: h = x tan 60° = x√3.",
        "In triangle 2: h = (80 - x) tan 30° = (80 - x)/√3.",
        "Equate: x√3 = (80 - x)/√3  ⇒  3x = 80 - x  ⇒  4x = 80  ⇒  x = 20m.",
        "Find height: h = 20√3 ≈ 20 × 1.732 = 34.64m."
      ],
      visualTip: "Observe the two triangles: the closer one has 60° elevation, the farther has 30° elevation, sharing height 34.64m!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let height of towers = h meters, and first distance = x" },
      { lineNum: 2, textBefore: "Then, second distance = 80 - x" },
      { lineNum: 3, textBefore: "From triangle 1: h = x × tan 60° = x√3" },
      { lineNum: 4, textBefore: "From triangle 2: h = (80 - x) × tan 30° = (80 - x)/√3" },
      { lineNum: 5, textBefore: "Equating equations: x√3 = (80 - x)/√3" },
      { lineNum: 6, textBefore: "  3x = 80 - x  ⇒  4x = 80  ⇒  x = 20 meters" },
      { lineNum: 7, textBefore: "Hence, h = 20√3 ≈ 20 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "34.64", placeholder: "h", textAfter: " meters", widthChars: 6 }
    ]
  },
  "lvl-trig-30": {
    id: "lvl-trig-30",
    question: "Planetary defense tracking. Asteroid A is at 60m height and elevation 30°. Asteroid B directly above it has elevation 45°. Calculate the vertical distance AB (use √3 ≈ 1.732).",
    inputLabel: "Vertical Distance AB",
    placeholder: "Type distance AB...",
    correctAnswer: 43.92,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AB = ${val}m`,
    formulaDisplay: "AB = d × (tan 45° - tan 30°) ≈ 43.92m",
    trigMode: "boss",
    bookPage: {
      title: "📖 FINAL BOSS: Observatory Calibration",
      concept: "A synthesis of heights & distances. When two objects are aligned vertically, their heights are determined using the shared horizontal range baseline.",
      formulaBreakdown: "d = Height A / tan 30°, Height B = d × tan 45°, AB = Height B - Height A",
      stepByStep: [
        "Calculate base distance d: tan 30° = 60 / d  ⇒  d = 60 / (1/√3) = 60√3 ≈ 103.92m.",
        "Calculate Height B: tan 45° = Height B / d  ⇒  Height B = d × 1 = 103.92m.",
        "Calculate distance AB: Height B - Height A = 103.92m - 60m = 43.92m.",
        "Submit 43.92 to save the reactor!"
      ],
      visualTip: "Observe the two target layers A and B. Visualizing the base range of 103.92m unlocks the solution!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Height of Asteroid A = 60m, elevation = 30°" },
      { lineNum: 2, textBefore: "Let shared base distance = d meters." },
      { lineNum: 3, textBefore: "In triangle A: tan 30° = 60 / d  ⇒  d = 60 / (1/√3) = 60√3 ≈ 103.92m" },
      { lineNum: 4, textBefore: "For Asteroid B at elevation 45°:" },
      { lineNum: 5, textBefore: "  tan 45° = Height B / d  ⇒  Height B = 103.92 × 1 = 103.92m" },
      { lineNum: 6, textBefore: "Vertical distance between B and A = Height B - Height A" },
      { lineNum: 7, textBefore: "  AB = 103.92 - 60 = ", hasInput: true, inputIndex: 0, correctAnswer: "43.92", placeholder: "AB", textAfter: " meters", widthChars: 6 }
    ]
  }
};

export default trigonometrySpecs;
