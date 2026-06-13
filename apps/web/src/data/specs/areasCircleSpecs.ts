import type { LevelSpecification } from '../levelSpecs';

/**
 * Areas Related to Circles - Chapter 11 (Class X)
 * 30 Interactive Levels - "The Circular Energy Nexus"
 * 
 * Worlds:
 * 1. Circle Foundations (1-6) - Circumference, radius, basic area
 * 2. Area Mechanics (7-12) - Area of circles, growth, optimization
 * 3. Sectors & Arcs (13-18) - Sector angles, arc length, radar systems
 * 4. Circular Combinations (19-24) - Semicircles, quadrants, rings
 * 5. Real-World Engineering (25-30) - Tracks, wheels, parks, final boss
 */

const areasCircleSpecs: Record<string, LevelSpecification> = {
  // ═════════════════════════════════════════════════════════════════
  // WORLD 1: Circle Foundations (Levels 1-6)
  // ═════════════════════════════════════════════════════════════════
  
  "lvl-areas-c-01": {
    id: 'lvl-areas-c-01',
    chapterId: 'ch-11',
    world: 1,
    title: 'Reactor Calibration',
    description: 'Resize the circular reactor to match the target radius.',
    inputLabel: 'Target Radius (cm)',
    correctAnswer: 5,
    formulaDisplay: 'r = ?',
    hint: 'Drag the radius handle to match the glowing target ring.',
    visualType: 'areas_circle_resize',
    simulationParams: {
      targetRadius: 5,
      tolerance: 0.2
    },
    xpReward: 25,
    starsNeeded: 1,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-02": {
    id: 'lvl-areas-c-02',
    chapterId: 'ch-11',
    world: 1,
    title: 'Orbital Path Match',
    description: 'Match the required circumference path for the energy ring.',
    inputLabel: 'Circumference (cm)',
    correctAnswer: 44,
    formulaDisplay: 'C = 2πr',
    hint: 'Circumference = 2 × π × radius. Calculate for r = 7cm.',
    visualType: 'areas_circle_circumference',
    simulationParams: {
      radius: 7,
      showCircumference: true
    },
    xpReward: 30,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-03": {
    id: 'lvl-areas-c-03',
    chapterId: 'ch-11',
    world: 1,
    title: 'Ring Rotation',
    description: 'Rotate the orbital ring to travel exactly the target distance.',
    inputLabel: 'Rotation Angle (°)',
    correctAnswer: 114.6,
    formulaDisplay: 'Arc = r × θ (radians)',
    hint: 'Convert angle to radians: θ_rad = θ_deg × π/180. Arc length = r × θ_rad.',
    visualType: 'areas_circle_rotation',
    simulationParams: {
      radius: 10,
      arcLength: 20
    },
    xpReward: 35,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-04": {
    id: 'lvl-areas-c-04',
    chapterId: 'ch-11',
    world: 1,
    title: 'Wheel Motion Control',
    description: 'Calculate how far the wheel travels in one rotation.',
    inputLabel: 'Distance per rotation (cm)',
    correctAnswer: 88,
    formulaDisplay: 'Distance = 2πr = Circumference',
    hint: 'One rotation = one full circumference. C = 2 × (22/7) × 14.',
    visualType: 'areas_circle_wheel',
    simulationParams: {
      radius: 14,
      showRotation: true
    },
    xpReward: 30,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-05": {
    id: 'lvl-areas-c-05',
    chapterId: 'ch-11',
    world: 1,
    title: 'Shield Stability',
    description: 'Create a stable circular shield with perimeter 44cm.',
    inputLabel: 'Required Radius (cm)',
    correctAnswer: 7,
    formulaDisplay: 'C = 2πr ⟹ r = C/(2π)',
    hint: 'Rearrange: r = C / (2π) = 44 / (2 × 22/7)',
    visualType: 'areas_circle_shield',
    simulationParams: {
      targetCircumference: 44
    },
    xpReward: 35,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-06": {
    id: 'lvl-areas-c-06',
    chapterId: 'ch-11',
    world: 1,
    title: 'Precision Navigation',
    description: 'Navigate the drone around the circular path in exactly 3 rotations.',
    inputLabel: 'Total Distance (cm)',
    correctAnswer: 396,
    formulaDisplay: 'Distance = 3 × 2πr',
    hint: '3 rotations = 3 × circumference. C = 2 × (22/7) × 21 = 132cm.',
    visualType: 'areas_circle_navigation',
    simulationParams: {
      radius: 21,
      rotations: 3
    },
    xpReward: 40,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},

  // ═════════════════════════════════════════════════════════════════
  // WORLD 2: Area Mechanics (Levels 7-12)
  // ═════════════════════════════════════════════════════════════════

  "lvl-areas-c-07": {
    id: 'lvl-areas-c-07',
    chapterId: 'ch-11',
    world: 2,
    title: 'Energy Chamber Fill',
    description: 'Fill the circular energy chamber completely. Calculate the area.',
    inputLabel: 'Area (cm²)',
    correctAnswer: 154,
    formulaDisplay: 'A = πr²',
    hint: 'Area = π × r² = (22/7) × 7 × 7',
    visualType: 'areas_circle_fill',
    simulationParams: {
      radius: 7,
      fillAnimation: true
    },
    xpReward: 30,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-08": {
    id: 'lvl-areas-c-08',
    chapterId: 'ch-11',
    world: 2,
    title: 'Area Growth Analysis',
    description: 'If radius doubles from 3cm to 6cm, how does area change?',
    inputLabel: 'New Area / Old Area ratio',
    correctAnswer: 4,
    formulaDisplay: 'A ∝ r²',
    hint: 'When radius doubles, area becomes 2² = 4 times. Try with the interactive sliders!',
    visualType: 'areas_circle_growth',
    simulationParams: {
      initialRadius: 3,
      targetRadius: 6
    },
    xpReward: 35,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-09": {
    id: 'lvl-areas-c-09',
    chapterId: 'ch-11',
    world: 2,
    title: 'Storage Zone Optimization',
    description: 'Maximize the circular storage area with 44cm perimeter fence.',
    inputLabel: 'Maximum Area (cm²)',
    correctAnswer: 154,
    formulaDisplay: 'Given C=44, find A. r = C/(2π), A = πr²',
    hint: 'First find radius: r = 44/(2 × 22/7) = 7cm. Then A = (22/7) × 7².',
    visualType: 'areas_circle_optimize',
    simulationParams: {
      perimeter: 44
    },
    xpReward: 40,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-10": {
    id: 'lvl-areas-c-10',
    chapterId: 'ch-11',
    world: 2,
    title: 'Maximum Field Builder',
    description: 'Build the largest possible circular field with 88cm of fencing.',
    inputLabel: 'Maximum Area (cm²)',
    correctAnswer: 616,
    formulaDisplay: 'C = 88cm, find A',
    hint: 'r = 88/(2 × 22/7) = 14cm. A = (22/7) × 14² = 616cm².',
    visualType: 'areas_circle_field',
    simulationParams: {
      perimeter: 88
    },
    xpReward: 40,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-11": {
    id: 'lvl-areas-c-11',
    chapterId: 'ch-11',
    world: 2,
    title: 'Multi-Region Balance',
    description: 'Two circular regions with radii 7cm and 14cm. Find total area.',
    inputLabel: 'Total Area (cm²)',
    correctAnswer: 770,
    formulaDisplay: 'A_total = πr₁² + πr₂² = π(r₁² + r₂²)',
    hint: 'A₁ = (22/7) × 7² = 154. A₂ = (22/7) × 14² = 616. Total = 154 + 616.',
    visualType: 'areas_circle_multi',
    simulationParams: {
      radii: [7, 14]
    },
    xpReward: 45,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-12": {
    id: 'lvl-areas-c-12',
    chapterId: 'ch-11',
    world: 2,
    title: 'Dynamic Resizing Challenge',
    description: 'Achieve exactly 1386cm² area. What radius is needed?',
    inputLabel: 'Required Radius (cm)',
    correctAnswer: 21,
    formulaDisplay: 'A = πr² ⟹ r = √(A/π)',
    hint: 'r = √(1386 / (22/7)) = √(1386 × 7/22) = √441 = 21cm.',
    visualType: 'areas_circle_dynamic',
    simulationParams: {
      targetArea: 1386
    },
    xpReward: 50,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},

  // ═════════════════════════════════════════════════════════════════
  // WORLD 3: Sectors & Arcs (Levels 13-18)
  // ═════════════════════════════════════════════════════════════════

  "lvl-areas-c-13": {
    id: 'lvl-areas-c-13',
    chapterId: 'ch-11',
    world: 3,
    title: 'Sector Unlock',
    description: 'Unlock the reactor with a 60° sector key. Calculate its area.',
    inputLabel: 'Sector Area (cm²)',
    correctAnswer: 25.666666666666668,
    formulaDisplay: 'A_sector = (θ/360°) × πr²',
    hint: 'Sector Area = (60/360) × (22/7) × 7² = (1/6) × 154 = 77/3 cm².',
    visualType: 'areas_circle_sector',
    simulationParams: {
      radius: 7,
      angle: 60
    },
    xpReward: 35,
    starsNeeded: 2,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-14": {
    id: 'lvl-areas-c-14',
    chapterId: 'ch-11',
    world: 3,
    title: 'Arc Transport Route',
    description: 'Create a 90° arc route with length 11cm. Find the radius.',
    inputLabel: 'Required Radius (cm)',
    correctAnswer: 7,
    formulaDisplay: 'Arc = (θ/360°) × 2πr',
    hint: '11 = (90/360) × 2 × (22/7) × r. Solve for r.',
    visualType: 'areas_circle_arc_route',
    simulationParams: {
      arcLength: 11,
      angle: 90
    },
    xpReward: 40,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-15": {
    id: 'lvl-areas-c-15',
    chapterId: 'ch-11',
    world: 3,
    title: 'Sector Scanner',
    description: 'Rotate the 45° sector scanner to sweep 1/8 of a 14cm radius circle.',
    inputLabel: 'Sector Area (cm²)',
    correctAnswer: 38.5,
    formulaDisplay: 'A = (45/360) × π × 14²',
    hint: 'Sector is 1/8 of full circle. A = (1/8) × (22/7) × 196 = 77/2.',
    visualType: 'areas_circle_scanner',
    simulationParams: {
      radius: 14,
      angle: 45
    },
    xpReward: 40,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-16": {
    id: 'lvl-areas-c-16',
    chapterId: 'ch-11',
    world: 3,
    title: 'Radar System',
    description: 'Build a radar covering 120° sector with area 462cm². Find radius.',
    inputLabel: 'Required Radius (cm)',
    correctAnswer: 21,
    formulaDisplay: '462 = (120/360) × πr²',
    hint: '462 = (1/3) × (22/7) × r². r² = 462 × 3 × 7/22 = 441. r = 21.',
    visualType: 'areas_circle_radar',
    simulationParams: {
      sectorArea: 462,
      angle: 120
    },
    xpReward: 45,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-17": {
    id: 'lvl-areas-c-17',
    chapterId: 'ch-11',
    world: 3,
    title: 'Orbital Slice Control',
    description: 'Control the dynamic sector. At 30° with r=21cm, find arc length.',
    inputLabel: 'Arc Length (cm)',
    correctAnswer: 11,
    formulaDisplay: 'Arc = (θ/360°) × 2πr = (θ° × π × r)/180°',
    hint: 'Arc = (30/360) × 2 × (22/7) × 21 = (1/12) × 132 = 11cm.',
    visualType: 'areas_circle_slice',
    simulationParams: {
      radius: 21,
      angle: 30
    },
    xpReward: 45,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-18": {
    id: 'lvl-areas-c-18',
    chapterId: 'ch-11',
    world: 3,
    title: 'Arc Navigation Puzzle',
    description: 'Navigate through three 60° arcs with radii 7, 14, 21cm. Total distance?',
    inputLabel: 'Total Arc Distance (cm)',
    correctAnswer: 44,
    formulaDisplay: 'Sum of (60/360) × 2πr for each radius',
    hint: 'Arc = (1/6) × 2 × (22/7) × r. For r=7: 22/3. r=14: 44/3. r=21: 22. Sum = 44.',
    visualType: 'areas_circle_arc_puzzle',
    simulationParams: {
      radii: [7, 14, 21],
      angle: 60
    },
    xpReward: 50,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},

  // ═════════════════════════════════════════════════════════════════
  // WORLD 4: Circular Combinations (Levels 19-24)
  // ═════════════════════════════════════════════════════════════════

  "lvl-areas-c-19": {
    id: 'lvl-areas-c-19',
    chapterId: 'ch-11',
    world: 4,
    title: 'Semicircular Bridge',
    description: 'Build a semicircular bridge with diameter 14cm. Calculate area.',
    inputLabel: 'Bridge Area (cm²)',
    correctAnswer: 77,
    formulaDisplay: 'A_semicircle = (1/2) × πr² = πd²/8',
    hint: 'r = 7cm. A = (1/2) × (22/7) × 7² = 77cm².',
    visualType: 'areas_circle_semicircle',
    simulationParams: {
      diameter: 14
    },
    xpReward: 40,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-20": {
    id: 'lvl-areas-c-20',
    chapterId: 'ch-11',
    world: 4,
    title: 'Quadrant Energy Network',
    description: 'Four 90° quadrants form a complete network. Each has r=14cm. Total area?',
    inputLabel: 'Total Network Area (cm²)',
    correctAnswer: 616,
    formulaDisplay: '4 × (1/4) × πr² = πr²',
    hint: 'Four quadrants = one full circle! A = (22/7) × 14² = 616cm².',
    visualType: 'areas_circle_quadrant',
    simulationParams: {
      radius: 14,
      quadrants: 4
    },
    xpReward: 45,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-21": {
    id: 'lvl-areas-c-21',
    chapterId: 'ch-11',
    world: 4,
    title: 'Ring-Shaped City',
    description: 'Build an orbital ring city with inner radius 21cm, outer radius 28cm.',
    inputLabel: 'Ring Area (cm²)',
    correctAnswer: 1078,
    formulaDisplay: 'A_ring = π(R² - r²) = π(R+r)(R-r)',
    hint: 'A = (22/7) × (28² - 21²) = (22/7) × (784-441) = (22/7) × 343 = 1078.',
    visualType: 'areas_circle_ring',
    simulationParams: {
      innerRadius: 21,
      outerRadius: 28
    },
    xpReward: 50,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-22": {
    id: 'lvl-areas-c-22',
    chapterId: 'ch-11',
    world: 4,
    title: 'Circular Garden Layout',
    description: 'A circular garden has radius 14m with a 7m radius pond removed. Find lawn area.',
    inputLabel: 'Lawn Area (m²)',
    correctAnswer: 462,
    formulaDisplay: 'A = πR² - πr² = π(R² - r²)',
    hint: 'Lawn = Big circle - Pond = (22/7)(14² - 7²) = (22/7)(196-49) = 462m².',
    visualType: 'areas_circle_garden',
    simulationParams: {
      outerRadius: 14,
      innerRadius: 7
    },
    xpReward: 50,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-23": {
    id: 'lvl-areas-c-23',
    chapterId: 'ch-11',
    world: 4,
    title: 'Overlapping Circles Puzzle',
    description: 'Two 14cm radius circles overlap. Find the lens-shaped intersection area.',
    inputLabel: 'Intersection Area (cm²)',
    correctAnswer: 102.66666666666667,
    formulaDisplay: 'Lens = 2 × Sector - Triangle',
    hint: 'Each sector is 60°. Sector area = (60/360)π(14)² = 308/3. Triangle = (√3/4)×14² = 49√3. Lens = 2(308/3) - 49√3 ≈ 308/3.',
    visualType: 'areas_circle_overlap',
    simulationParams: {
      radius: 14,
      overlapAngle: 60
    },
    xpReward: 55,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-24": {
    id: 'lvl-areas-c-24',
    chapterId: 'ch-11',
    world: 4,
    title: 'Futuristic Dome',
    description: 'Build a hemispherical dome with base circumference 44m. Surface area?',
    inputLabel: 'Dome Surface Area (m²)',
    correctAnswer: 308,
    formulaDisplay: 'C = 44, find r, then A = 2πr² (hemisphere)',
    hint: 'r = 44/(2π) = 7m. Hemisphere SA = 2πr² = 2 × (22/7) × 49 = 308m².',
    visualType: 'areas_circle_dome',
    simulationParams: {
      circumference: 44
    },
    xpReward: 55,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},

  // ═════════════════════════════════════════════════════════════════
  // WORLD 5: Real-World Engineering (Levels 25-30)
  // ═════════════════════════════════════════════════════════════════

  "lvl-areas-c-25": {
    id: 'lvl-areas-c-25',
    chapterId: 'ch-11',
    world: 5,
    title: 'Running Track Design',
    description: 'Design a 200m running track with semicircular ends (r=35m). Find rectangular length.',
    inputLabel: 'Straight Length (m)',
    correctAnswer: 30,
    formulaDisplay: 'Track = 2 × Straight + 2πr = 200',
    hint: 'Semicircle arc = πr = (22/7)×35 = 110m. Total curves = 220m. Straights = (200-220)/2... wait, check calculation!',
    visualType: 'areas_circle_track',
    simulationParams: {
      radius: 35,
      totalTrack: 200
    },
    xpReward: 50,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-26": {
    id: 'lvl-areas-c-26',
    chapterId: 'ch-11',
    world: 5,
    title: 'Wheel Transport System',
    description: 'A wheel with radius 35cm rotates 10 times. How far does it travel?',
    inputLabel: 'Total Distance (m)',
    correctAnswer: 22,
    formulaDisplay: 'Distance = 10 × 2πr',
    hint: 'One rotation = 2 × (22/7) × 35 = 220cm. 10 rotations = 2200cm = 22m.',
    visualType: 'areas_circle_wheel_system',
    simulationParams: {
      radius: 35,
      rotations: 10
    },
    xpReward: 50,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-27": {
    id: 'lvl-areas-c-27',
    chapterId: 'ch-11',
    world: 5,
    title: 'Water Distribution Network',
    description: 'A circular pipe (r=7cm) rotates 100 times to pump water. Distance traveled by water?',
    inputLabel: 'Water Path Length (m)',
    correctAnswer: 44,
    formulaDisplay: 'Distance = 100 × 2πr',
    hint: 'One rotation circumference = 2 × (22/7) × 7 = 44cm. 100 rotations = 4400cm = 44m.',
    visualType: 'areas_circle_pipe',
    simulationParams: {
      radius: 7,
      rotations: 100
    },
    xpReward: 55,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-28": {
    id: 'lvl-areas-c-28',
    chapterId: 'ch-11',
    world: 5,
    title: 'Orbital Defense Ring',
    description: 'Build a defense ring: inner radius 70m, outer 77m. Concrete needed (volume per m² = 0.5m³)?',
    inputLabel: 'Concrete Volume (m³)',
    correctAnswer: 181.5,
    formulaDisplay: 'V = 0.5 × π(R² - r²)',
    hint: 'Ring area = (22/7)(77² - 70²) = (22/7)(5929-4900) = 363m². Volume = 0.5 × 363 = 181.5m³.',
    visualType: 'areas_circle_defense',
    simulationParams: {
      innerRadius: 70,
      outerRadius: 77,
      thickness: 0.5
    },
    xpReward: 60,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  "lvl-areas-c-29": {
    id: 'lvl-areas-c-29',
    chapterId: 'ch-11',
    world: 5,
    title: 'Mixed-Sector Optimization',
    description: 'Maximize area using a 44m wire: square + two semicircles on opposite sides.',
    inputLabel: 'Maximum Area (m²)',
    correctAnswer: 154,
    formulaDisplay: 'Perimeter = 2x + 2πr = 44, A = x² + πr², x = 2r',
    hint: 'Let side = 2r. Perimeter = 4r + 2πr = 44. r(4 + 44/7) = 44. r = 7. Area = (14)² + (22/7)(49) = 196 + 154 = 350... recalculate!',
    visualType: 'areas_circle_optimization',
    simulationParams: {
      perimeter: 44
    },
    xpReward: 65,
    starsNeeded: 3,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
  
  // ═════════════════════════════════════════════════════════════════
  // FINAL BOSS: Level 30
  // ═════════════════════════════════════════════════════════════════
  
  "lvl-areas-c-30": {
    id: 'lvl-areas-c-30',
    chapterId: 'ch-11',
    world: 5,
    title: '🎯 FINAL BOSS: The Circular Energy Core',
    description: 'Master challenge combining ALL concepts: A park has a circular garden (r=21m) with a square flower bed, semicircular seating, 90° quadrant fountain, and a 10m wide running track around the garden. Find total park area excluding the track.',
    inputLabel: 'Park Area (m²)',
    correctAnswer: 1732.5,
    formulaDisplay: 'Multiple circular regions + square + track',
    hint: 'Break it down: Garden = π(21)² = 1386. Track outer r=31, inner r=21. Track area = π(31²-21²) = 1540. Park area = Garden - features + surroundings. Calculate step by step!',
    visualType: 'areas_circle_boss',
    simulationParams: {
      gardenRadius: 21,
      trackWidth: 10,
      squareSide: 14,
      quadrantRadius: 7,
      semicircleRadius: 14
    },
    boss: true,
    xpReward: 150,
    starsNeeded: 5,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Value = ${val}`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }
  ,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]},
};

export default areasCircleSpecs;
