import type { LevelSpecification } from '../levelSpecs';

const circleSpecs: Record<string, LevelSpecification> = {

  // ═════════════════════════════════════════════════════════════════
  // WORLD 1 — Circle & Tangent Foundations (Levels 1–6)
  // ═════════════════════════════════════════════════════════════════

  "lvl-circle-01": {
    id: "lvl-circle-01",
    question: "We have an orbital shield of radius 5. An emitter P is placed at distance 10 from the center. Adjust the laser firing angle so it touches the shield at exactly one point (becomes tangent). What is the angle in degrees that the beam makes with the center line OP?",
    inputLabel: "Aiming Angle",
    placeholder: "Enter angle in degrees...",
    correctAnswer: 30,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Aim Angle = ${val}°`,
    formulaDisplay: "sin θ = Radius / Distance = r / d",
    bookPage: {
      title: "📖 Introduction to Tangents",
      concept: "A tangent is a straight line that touches a circle at exactly one point. If a point P lies outside a circle, we can draw exactly two tangents from it. The line from the center O to the contact point T forms a right-angled triangle OPT.",
      formulaBreakdown: "sin(∠OPT) = Opp / Hyp = r / d",
      stepByStep: [
        "Identify the radius of the circle: r.",
        "Identify the distance of the external point P from center O: d.",
        "Set up the sine relationship: sin θ = r / d.",
        "Solve for the angle θ that makes the beam tangent to the circle."
      ],
      visualTip: "Use the interactive slider or input to rotate the beam. Watch it graze the circle's boundary at exactly one point!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "The distance from center O to external point P is " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "10", correctAnswer: "10", widthChars: 4, hint: "Given in the problem" },
      { lineNum: 3, textBefore: " units. The circle radius r is " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "5", correctAnswer: "5", widthChars: 4, hint: "Given radius" },
      { lineNum: 5, textBefore: " units. Therefore sin θ = r/d = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "0.5", correctAnswer: "0.5", widthChars: 5, hint: "Divide radius by distance" },
      { lineNum: 7, textBefore: ", so θ = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "30", correctAnswer: "30", widthChars: 4, hint: "sin⁻¹(0.5) in degrees" },
      { lineNum: 9, textBefore: "°" }
    ]
  },

  "lvl-circle-02": {
    id: "lvl-circle-02",
    question: "Identify the laser beam trajectory that forms a tangent to the orbital reactor core. Beam 1 cuts through the core (intersects at 2 points), Beam 2 grazes the edge (intersects at 1 point), and Beam 3 misses it entirely. Enter the number of the beam that is a true tangent.",
    inputLabel: "Beam Number",
    placeholder: "Enter beam (1, 2, or 3)...",
    correctAnswer: 2,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Selected Beam = ${val}`,
    formulaDisplay: "Tangent cuts at 1 point | Secant cuts at 2 points",
    bookPage: {
      title: "📖 Tangent vs Secant",
      concept: "A tangent is a line that intersects the circle at exactly one point. A secant is a line that intersects the circle at two distinct points. A non-intersecting line does not touch the circle at all.",
      formulaBreakdown: "Number of contact points: Tangent = 1, Secant = 2, Non-intersecting = 0",
      stepByStep: [
        "Observe the three lines on the holographic grid.",
        "Count the points of intersection for each line with the circle.",
        "The line that touches at exactly one point is the tangent.",
        "Enter the number corresponding to the tangent line."
      ],
      visualTip: "Look for the beam that grazes the reactor core at a single point without entering its glowing interior."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "A tangent line intersects a circle at exactly " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "1", correctAnswer: "1", widthChars: 4, hint: "How many points?" },
      { lineNum: 3, textBefore: " point(s). A secant intersects at " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "2", correctAnswer: "2", widthChars: 4, hint: "Secant cuts through" },
      { lineNum: 5, textBefore: " point(s). Beam " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "2", correctAnswer: "2", widthChars: 4, hint: "Which beam is tangent?" },
      { lineNum: 7, textBefore: " is the tangent." }
    ]
  },

  "lvl-circle-03": {
    id: "lvl-circle-03",
    question: "A laser transmitter is at position (0, -120), and a circular power shield of radius 60 is at the center (0, 0). Find the deflection angle (in degrees) from the center line to lock the laser as a tangent onto the shield's surface.",
    inputLabel: "Deflection Angle",
    placeholder: "Enter angle...",
    correctAnswer: 30,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Deflection = ${val}°`,
    formulaDisplay: "sin θ = r / d",
    bookPage: {
      title: "📖 Laser Aiming Mechanics",
      concept: "Tangent aiming uses trigonometry on the right-angled triangle formed by the center, the emitter, and the point of tangency. The angle offset is determined by the sine of the angle.",
      formulaBreakdown: "sin θ = Circle Radius / Distance from Center",
      stepByStep: [
        "Identify the radius of the circular shield: r.",
        "Identify the distance from the transmitter to the center: d.",
        "Calculate the sine ratio of the aiming angle: sin θ = r / d.",
        "Find the deflection angle θ using the inverse sine function: θ = sin⁻¹(r / d)."
      ],
      visualTip: "Rotate the laser beam until the snapping system locks it onto the shield's circumference."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: Radius r = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "60", correctAnswer: "60", widthChars: 5, hint: "Radius value" },
      { lineNum: 3, textBefore: ", Distance d = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "120", correctAnswer: "120", widthChars: 5, hint: "Distance from center" },
      { lineNum: 5, textBefore: ". sin θ = r/d = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "0.5", correctAnswer: "0.5", widthChars: 5, hint: "60/120" },
      { lineNum: 7, textBefore: ", so θ = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "30", correctAnswer: "30", widthChars: 4, hint: "sin⁻¹(0.5)" },
      { lineNum: 9, textBefore: "°" }
    ]
  },

  "lvl-circle-04": {
    id: "lvl-circle-04",
    question: "Construct a direct tangent bridge from a refueling dock P to a circular orbital station. The distance from dock P to the station's center is 150 km, and the station's radius is 90 km. What must be the length of the tangent bridge (in km)?",
    inputLabel: "Bridge Length",
    placeholder: "Enter bridge length...",
    correctAnswer: 120,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Bridge = ${val} km`,
    formulaDisplay: "Tangent Length PT = √(OP² - r²)",
    bookPage: {
      title: "📖 Tangent Bridge Construction",
      concept: "Because a tangent is perpendicular to the radius at the point of contact, the radius, tangent, and center line form a right-angled triangle. We can calculate the exact tangent length using the Pythagorean theorem.",
      formulaBreakdown: "PT² + OT² = OP²  →  PT = √(OP² - OT²)",
      stepByStep: [
        "Identify the hypotenuse: distance OP from external point to center.",
        "Identify the base leg: radius OT of the circle.",
        "Apply the Pythagorean theorem to find the tangent length PT.",
        "Calculate: PT = √(OP² - r²)."
      ],
      visualTip: "A solid holographic bridge will form connecting the external dock directly to the station surface at a right angle to the radius."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Using Pythagoras: PT² = OP² - OT²" },
      { lineNum: 2, textBefore: "OP (distance from dock to center) = " },
      { lineNum: 3, hasInput: true, inputIndex: 0, placeholder: "150", correctAnswer: "150", widthChars: 5, hint: "Given distance" },
      { lineNum: 4, textBefore: " km, OT (radius) = " },
      { lineNum: 5, hasInput: true, inputIndex: 1, placeholder: "90", correctAnswer: "90", widthChars: 5, hint: "Given radius" },
      { lineNum: 6, textBefore: " km. PT² = " },
      { lineNum: 7, hasInput: true, inputIndex: 2, placeholder: "14400", correctAnswer: "14400", widthChars: 7, hint: "150² - 90²" },
      { lineNum: 8, textBefore: ", so PT = " },
      { lineNum: 9, hasInput: true, inputIndex: 3, placeholder: "120", correctAnswer: "120", widthChars: 5, hint: "√14400" },
      { lineNum: 10, textBefore: " km" }
    ]
  },

  "lvl-circle-05": {
    id: "lvl-circle-05",
    question: "A defensive laser beam runs along a straight line at a distance d from the center of a circular reactor of radius 8. If d < 8, the beam cuts through the interior, causing a critical reactor breach! What is the exact perpendicular distance d (in units) at which the beam is a perfect tangent and perfectly safe?",
    inputLabel: "Perpendicular Distance",
    placeholder: "Enter distance...",
    correctAnswer: 8,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Distance d = ${val}`,
    formulaDisplay: "Distance from Center d = Radius r",
    bookPage: {
      title: "📖 Point of Tangency Proximity",
      concept: "The shortest distance from the center of a circle to any straight line is the perpendicular distance. If this distance is greater than the radius, the line misses. If it equals the radius, it is tangent. If it is less, it is a secant.",
      formulaBreakdown: "Tangent condition: Perpendicular Distance (d) = Radius (r)",
      stepByStep: [
        "Identify the radius r of the circular core.",
        "Recognize that a tangent line is at exactly distance r from the center.",
        "Set the beam distance d equal to the radius to maintain single-point contact.",
        "Ensure the beam does not enter the circle's interior."
      ],
      visualTip: "Adjust the distance slider. Observe the breach warnings turn green when the distance perfectly matches the radius!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "For a line to be tangent to a circle, the perpendicular distance from center must equal the " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "radius", correctAnswer: "radius", widthChars: 8, hint: "r = ?" },
      { lineNum: 3, textBefore: ". Given r = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "Radius value" },
      { lineNum: 5, textBefore: ", the safe distance d = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "d must equal r" },
      { lineNum: 7, textBefore: " units." }
    ]
  },

  "lvl-circle-06": {
    id: "lvl-circle-06",
    question: "Complete the orbital laboratory's standard operating manual for Circle and Tangent Foundations by solving the step questions on your board exam sheet.",
    inputLabel: "Manual Verifier",
    placeholder: "Solve the notebooks...",
    correctAnswer: 0,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (_val) => `Manual Synced`,
    formulaDisplay: "Core Definitions of Tangent Geometry",
    bookPage: {
      title: "📖 Circles & Tangents Review",
      concept: "A tangent is a special line that intersects a circle at exactly one point. There is only one tangent at any point on a circle. A point inside the circle has zero tangents.",
      formulaBreakdown: "Number of tangents: Inside Point = 0, On Circle Point = 1, Outside Point = 2",
      stepByStep: [
        "Read the conceptual definitions on the board sheet.",
        "Recall that a line intersecting a circle at exactly one point is a tangent.",
        "Recall that the point of contact is where the tangent touches the circle.",
        "Enter these terms to calibrate the manual."
      ],
      visualTip: "Fill in the blank fields on the lined notebook to verify your understanding of tangent terminology."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "A line that intersects a circle in exactly one point is called a " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "tangent", correctAnswer: "tangent", widthChars: 10, hint: "A line touching at one point" },
      { lineNum: 3, textBefore: "The point where the tangent touches the circle is the point of " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "contact", correctAnswer: "contact", widthChars: 10, hint: "Point of intersection" },
      { lineNum: 5, textBefore: "The number of tangents drawn from a point inside the circle is " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "0", correctAnswer: "0", widthChars: 4, hint: "Can an interior point touch only once?" }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 2 — Radius & Tangent Mechanics (Levels 7–12)
  // ═════════════════════════════════════════════════════════════════

  "lvl-circle-07": {
    id: "lvl-circle-07",
    question: "A solar harvester uses a tangent collector panel. A radial fuel line runs from the center O to the contact point T. What is the angle (in degrees) between the radial fuel line OT and the tangent collector panel PT?",
    inputLabel: "Contact Angle",
    placeholder: "Enter angle...",
    correctAnswer: 90,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `∠OTP = ${val}°`,
    formulaDisplay: "Radius ⊥ Tangent at Point of Contact",
    bookPage: {
      title: "📖 Theorem: Radius-Tangent Perpendicularity",
      concept: "NCERT Theorem 10.1: The tangent at any point of a circle is perpendicular to the radius through the point of contact. This means the angle between the radius and the tangent is always exactly 90 degrees.",
      formulaBreakdown: "Radius (OT) ⊥ Tangent Line (PT)  →  ∠OTP = 90°",
      stepByStep: [
        "Locate the radius OT drawn to the point of contact T.",
        "Locate the tangent line PT grazing the circle at T.",
        "Recall the perpendicularity theorem: Radius ⊥ Tangent.",
        "The angle formed between these two lines is always a right angle (90°)."
      ],
      visualTip: "Watch a glowing perpendicular right-angle symbol lock at the point of contact when the collector panel is correctly aligned."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "By the perpendicularity theorem, the radius is " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "perpendicular", correctAnswer: "perpendicular", widthChars: 13, hint: "Relationship to tangent" },
      { lineNum: 3, textBefore: " to the tangent at the point of contact. The angle between radius OT and tangent PT is " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "90", correctAnswer: "90", widthChars: 4, hint: "Angle in degrees" },
      { lineNum: 5, textBefore: " degrees." }
    ]
  },

  "lvl-circle-08": {
    id: "lvl-circle-08",
    question: "An orbital defense shield is misaligned! The energy beam is currently at an angle of 85° to the radius at the contact point T, leaking shield power. What angle (in degrees) must the defense beam make with the radius to align perfectly as a lossless tangent?",
    inputLabel: "Target Angle",
    placeholder: "Enter angle...",
    correctAnswer: 90,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Angle = ${val}°`,
    formulaDisplay: "Target Angle = 90° (Perpendicularity)",
    bookPage: {
      title: "📖 Aligning Tangent Fields",
      concept: "Optimal alignment in circle engineering requires strict adherence to geometric theorems. A perfect tangent must form an exact 90° angle with the radius to be stable.",
      formulaBreakdown: "Ideal Angle θ = 90°",
      stepByStep: [
        "Analyze the current alignment error between the beam and the radius.",
        "Recall that the radius must be perpendicular to the tangent at the point of contact.",
        "Set the target angle to the standard right angle (90°) to satisfy the perpendicularity theorem.",
        "Observe the energy flow stabilize on the monitor."
      ],
      visualTip: "Enforce a right angle at the contact point to prevent energy leaks and align the defense beam."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Current misalignment angle = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "85", correctAnswer: "85", widthChars: 4, hint: "Given angle" },
      { lineNum: 3, textBefore: "°. Required tangent angle = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "90", correctAnswer: "90", widthChars: 4, hint: "Perfect perpendicular" },
      { lineNum: 5, textBefore: "°. Correction needed = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "5", correctAnswer: "5", widthChars: 4, hint: "Difference" },
      { lineNum: 7, textBefore: "°" }
    ]
  },

  "lvl-circle-09": {
    id: "lvl-circle-09",
    question: "A laser transmitter P is situated 130 meters away from the center of a circular magnetic shield of radius 50 meters. The laser beam is tangent to the shield at T. What is the length of the tangent shield path PT (in meters)?",
    inputLabel: "Path Length PT",
    placeholder: "Enter length...",
    correctAnswer: 120,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `PT = ${val} m`,
    formulaDisplay: "PT = √(OP² - OT²)",
    bookPage: {
      title: "📖 Calculating Tangent Path Length",
      concept: "Using the perpendicularity theorem, we know ∠OTP = 90°. This allows us to use the Pythagorean theorem on △OPT to find the unknown tangent length.",
      formulaBreakdown: "OP² = OT² + PT²  →  PT = √(OP² - OT²)",
      stepByStep: [
        "Identify the radius of the circular magnetic shield: r = OT.",
        "Identify the distance of the transmitter from the center: d = OP.",
        "Set up the Pythagorean relationship for the right-angled triangle OPT: OP² = OT² + PT².",
        "Solve for the tangent path length: PT = √(OP² - OT²)."
      ],
      visualTip: "The right triangle OPT is formed. You can see the 5-12-13 Pythagorean triple scaled by 10!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: OP = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "130", correctAnswer: "130", widthChars: 5, hint: "Distance" },
      { lineNum: 3, textBefore: " m, OT = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "50", correctAnswer: "50", widthChars: 5, hint: "Radius" },
      { lineNum: 5, textBefore: " m. PT² = OP² - OT² = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "14400", correctAnswer: "14400", widthChars: 7, hint: "130² - 50²" },
      { lineNum: 7, textBefore: ", so PT = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "120", correctAnswer: "120", widthChars: 5, hint: "√14400" },
      { lineNum: 9, textBefore: " m" }
    ]
  },

  "lvl-circle-10": {
    id: "lvl-circle-10",
    question: "A spacecraft is at position P, docking tangent to a circular space harbor of radius 7 km. The docking beam PT measures 24 km. How far (in km) is the spacecraft's center P from the harbor's center O?",
    inputLabel: "Distance OP",
    placeholder: "Enter distance...",
    correctAnswer: 25,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `OP = ${val} km`,
    formulaDisplay: "OP = √(PT² + OT²)",
    bookPage: {
      title: "📖 Space Docking Triangulation",
      concept: "To find the distance from an external anchor to the center of a circle, use the tangent length and radius as legs of a right-angled triangle.",
      formulaBreakdown: "OP = √(Tangent² + Radius²) = √(PT² + r²)",
      stepByStep: [
        "Identify the radius of the circular harbor: r = OT.",
        "Identify the tangent docking path length: PT.",
        "Set up the Pythagorean relation for the right triangle OPT: OP² = PT² + OT².",
        "Solve for the distance from the center: OP = √(PT² + r²)."
      ],
      visualTip: "The 7-24-25 right triangle is constructed between the harbor's center, contact point, and ship."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: PT = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "24", correctAnswer: "24", widthChars: 4, hint: "Tangent length" },
      { lineNum: 3, textBefore: " km, OT = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "7", correctAnswer: "7", widthChars: 4, hint: "Radius" },
      { lineNum: 5, textBefore: " km. OP² = PT² + OT² = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "625", correctAnswer: "625", widthChars: 6, hint: "24² + 7²" },
      { lineNum: 7, textBefore: ", so OP = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "25", correctAnswer: "25", widthChars: 4, hint: "√625" },
      { lineNum: 9, textBefore: " km" }
    ]
  },

  "lvl-circle-11": {
    id: "lvl-circle-11",
    question: "An orbital laser grid is down. The central ring has radius 8 units. A diagnostic node is placed at P, which is 17 units away from the center O. The laser beam is tangent at T. Find the required length of the tangent beam PT (in units) to complete the grid repair.",
    inputLabel: "Beam Length PT",
    placeholder: "Enter beam length...",
    correctAnswer: 15,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `PT = ${val}`,
    formulaDisplay: "PT = √(OP² - OT²)",
    bookPage: {
      title: "📖 Laser Grid Calibration",
      concept: "Calculations on tangent grids ensure that lasers do not clip through central structures. The length is found using standard right-triangle mechanics.",
      formulaBreakdown: "PT = √(Distance² - Radius²)",
      stepByStep: [
        "Identify the radius of the central circle: r = OT.",
        "Identify the distance of the diagnostic node from the center: d = OP.",
        "Use the perpendicularity theorem to form right-angled triangle OPT.",
        "Solve for the tangent beam length using Pythagoras: PT = √(OP² - OT²)."
      ],
      visualTip: "The 8-15-17 Pythagorean triple is displayed to visually verify the perpendicular beam path."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: OP = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "17", correctAnswer: "17", widthChars: 4, hint: "Distance" },
      { lineNum: 3, textBefore: ", OT = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "Radius" },
      { lineNum: 5, textBefore: ". PT² = OP² - OT² = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "225", correctAnswer: "225", widthChars: 6, hint: "17² - 8²" },
      { lineNum: 7, textBefore: ", so PT = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "15", correctAnswer: "15", widthChars: 4, hint: "√225" },
      { lineNum: 9, textBefore: " units" }
    ]
  },

  "lvl-circle-12": {
    id: "lvl-circle-12",
    question: "Calibrate the defense reactor's alignment computer by proving the perpendicular properties of the radius-tangent theorem on the board sheet.",
    inputLabel: "Verifier",
    placeholder: "Solve the notebook...",
    correctAnswer: 0,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (_val) => `Grid Aligned`,
    formulaDisplay: "Theorem: Radius ⊥ Tangent at Contact Point",
    bookPage: {
      title: "📖 Perpendicularity Theorem Review",
      concept: "The angle between a tangent and the radius at the point of contact is exactly 90 degrees. This creates a right-angled triangle OPT with OP as the hypotenuse.",
      formulaBreakdown: "∠OTP = 90°  |  OP² = OT² + PT²",
      stepByStep: [
        "Fill in the theorem parameters on your notebook sheet.",
        "State that the tangent is perpendicular to the radius at the point of contact.",
        "Use 90 degrees as the contact angle.",
        "Apply OP = √(OT² + PT²) to compute the center distance."
      ],
      visualTip: "Complete the blank steps on the notebook to calibrate the alignment computer and engage full power."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "A tangent to a circle is " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "perpendicular", correctAnswer: "perpendicular", widthChars: 13, hint: "Relationship to radius (perpendicular/parallel)" },
      { lineNum: 3, textBefore: "to the radius through the point of contact. The angle is " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "90", correctAnswer: "90", widthChars: 4, hint: "Value in degrees" },
      { lineNum: 5, textBefore: "In △OPT, if OT = 6 and PT = 8, then OP = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "10", correctAnswer: "10", widthChars: 4, hint: "Hypotenuse length" }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 3 — Equal Tangent Systems (Levels 13–18)
  // ═════════════════════════════════════════════════════════════════

  "lvl-circle-13": {
    id: "lvl-circle-13",
    question: "Two symmetric structural support beams are anchored at an external station P. They run tangent to a circular storage reactor, touching at A and B. If beam PA measures 15 meters, what is the length of support beam PB (in meters)?",
    inputLabel: "Beam PB Length",
    placeholder: "Enter length...",
    correctAnswer: 15,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `PB = ${val} m`,
    formulaDisplay: "PA = PB",
    bookPage: {
      title: "📖 Theorem: Tangents from External Point",
      concept: "NCERT Theorem 10.2: The lengths of tangents drawn from an external point to a circle are equal. This elegant symmetry is used in engineering to balance loads on circular containers.",
      formulaBreakdown: "Tangent PA = Tangent PB  (from same point P)",
      stepByStep: [
        "Identify the common external point: P.",
        "Identify the two points of tangency on the circle: A and B.",
        "Recall Theorem 10.2: The lengths of tangents drawn from an external point to a circle are equal.",
        "Set the length of support beam PB equal to the length of beam PA."
      ],
      visualTip: "Compare both support lines. Notice how they are perfectly identical in length due to the circle's curvature!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "By Theorem 10.2, tangents from an external point are " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "equal", correctAnswer: "equal", widthChars: 8, hint: "PA = PB" },
      { lineNum: 3, textBefore: " in length. Given PA = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "15", correctAnswer: "15", widthChars: 4, hint: "Given length" },
      { lineNum: 5, textBefore: " m, then PB = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "15", correctAnswer: "15", widthChars: 4, hint: "Same as PA" },
      { lineNum: 7, textBefore: " m." }
    ]
  },

  "lvl-circle-14": {
    id: "lvl-circle-14",
    question: "Twin tangent energy lines are drawn to a circular power core from an anchor station P, touching at A and B. If PA is calibrated to 2x + 5 and PB is measured at 17, find the value of x to balance the core's magnetic field.",
    inputLabel: "Calibration x",
    placeholder: "Enter x...",
    correctAnswer: 6,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x = ${val}`,
    formulaDisplay: "PA = PB  →  2x + 5 = 17",
    bookPage: {
      title: "📖 Balancing Equal Tangents",
      concept: "We can set up algebraic equations using the equal tangents theorem to solve for unknown system variables.",
      formulaBreakdown: "Set expression PA equal to PB and solve for x",
      stepByStep: [
        "By the equal tangents theorem (Theorem 10.2), the tangent lengths are equal: PA = PB.",
        "Equate the algebraic expressions for PA and PB to form a linear equation.",
        "Isolate the variable term on one side of the equation.",
        "Solve for the calibration factor x."
      ],
      visualTip: "Enter the correct calibration factor. Watch the energy lines turn from unstable orange to balanced blue!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "By equal tangents theorem: PA = PB" },
      { lineNum: 2, textBefore: "PA = 2x + 5 = " },
      { lineNum: 3, hasInput: true, inputIndex: 0, placeholder: "17", correctAnswer: "17", widthChars: 4, hint: "Given PB" },
      { lineNum: 4, textBefore: ", PB = 17. So 2x + 5 = 17" },
      { lineNum: 5, textBefore: " → 2x = " },
      { lineNum: 6, hasInput: true, inputIndex: 1, placeholder: "12", correctAnswer: "12", widthChars: 4, hint: "17 - 5" },
      { lineNum: 7, textBefore: " → x = " },
      { lineNum: 8, hasInput: true, inputIndex: 2, placeholder: "6", correctAnswer: "6", widthChars: 4, hint: "12/2" }
    ]
  },

  "lvl-circle-15": {
    id: "lvl-circle-15",
    question: "A satellite at P transmits two equal tangent beams to Earth, touching at receiver stations A and B. Beam PA has segment length 3y - 4, and beam PB is measured at 2y + 8. Calibrate the transmitter by finding the value of y.",
    inputLabel: "Calibration y",
    placeholder: "Enter y...",
    correctAnswer: 12,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `y = ${val}`,
    formulaDisplay: "PA = PB  →  3y - 4 = 2y + 8",
    bookPage: {
      title: "📖 Satellite Beam Symmetry",
      concept: "Broadcast satellites use equal tangent envelopes to cover hemispheres uniformly. Solving the coordinate variables ensures even beam timing.",
      formulaBreakdown: "PA = PB",
      stepByStep: [
        "Recall that the two tangent beams from the same satellite are equal: PA = PB.",
        "Set the expression for PA equal to the expression for PB.",
        "Simplify the algebraic equation by collecting variable terms on one side and constants on the other.",
        "Solve for the variable y to calibrate the transmitter."
      ],
      visualTip: "Adjust y to align the transmission beams perfectly on the receiver stations."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "By equal tangents theorem: PA = PB" },
      { lineNum: 2, textBefore: "PA = 3y - 4, PB = 2y + 8" },
      { lineNum: 3, textBefore: " → 3y - 4 = 2y + 8" },
      { lineNum: 4, textBefore: " → 3y - 2y = 8 + " },
      { lineNum: 5, hasInput: true, inputIndex: 0, placeholder: "4", correctAnswer: "4", widthChars: 4, hint: "Bring -4 to right" },
      { lineNum: 6, textBefore: " → y = " },
      { lineNum: 7, hasInput: true, inputIndex: 1, placeholder: "12", correctAnswer: "12", widthChars: 4, hint: "Sum" }
    ]
  },

  "lvl-circle-16": {
    id: "lvl-circle-16",
    question: "A futuristic shield reactor has a quadrilateral frame ABCD circumscribed around a circular core (meaning all four sides of ABCD are tangent to the circle). The side lengths are AB = 6, BC = 7, and CD = 4. What must be the length of side AD (in units) to maintain reactor symmetry?",
    inputLabel: "Side AD",
    placeholder: "Enter AD...",
    correctAnswer: 3,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AD = ${val}`,
    formulaDisplay: "AB + CD = BC + AD",
    bookPage: {
      title: "📖 Circumscribed Quadrilaterals",
      concept: "When a quadrilateral ABCD circumscribes a circle, the sum of lengths of opposite sides is equal. This is proved using the equal tangents theorem from each vertex.",
      formulaBreakdown: "Opposite sides sum: AB + CD = BC + AD",
      stepByStep: [
        "Identify the opposite pairs of sides in the circumscribed quadrilateral: (AB, CD) and (BC, AD).",
        "Apply the circumscribed quadrilateral theorem: The sum of opposite sides is equal (AB + CD = BC + AD).",
        "Calculate the sum of the known opposite pair AB and CD.",
        "Solve for the missing side AD by subtracting BC from this sum."
      ],
      visualTip: "Examine the quadrilateral surrounding the circle. Notice how the opposite side sums balance perfectly!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "For circumscribed quadrilateral: AB + CD = BC + AD" },
      { lineNum: 2, textBefore: "Given: AB = " },
      { lineNum: 3, hasInput: true, inputIndex: 0, placeholder: "6", correctAnswer: "6", widthChars: 4, hint: "Side AB" },
      { lineNum: 4, textBefore: ", BC = " },
      { lineNum: 5, hasInput: true, inputIndex: 1, placeholder: "7", correctAnswer: "7", widthChars: 4, hint: "Side BC" },
      { lineNum: 6, textBefore: ", CD = " },
      { lineNum: 7, hasInput: true, inputIndex: 2, placeholder: "4", correctAnswer: "4", widthChars: 4, hint: "Side CD" },
      { lineNum: 8, textBefore: ". AB + CD = " },
      { lineNum: 9, hasInput: true, inputIndex: 3, placeholder: "10", correctAnswer: "10", widthChars: 4, hint: "6+4" },
      { lineNum: 10, textBefore: " = BC + AD → AD = " },
      { lineNum: 11, hasInput: true, inputIndex: 4, placeholder: "3", correctAnswer: "3", widthChars: 4, hint: "10-7" }
    ]
  },

  "lvl-circle-17": {
    id: "lvl-circle-17",
    question: "An advanced defense network consists of a central anchor P and three circles. Tangents PA and PB are drawn to Circle 1, and tangents PB and PC are drawn to Circle 2. If the laser path PA is exactly 14 units, what is the length of laser path PC (in units)?",
    inputLabel: "Path PC Length",
    placeholder: "Enter length...",
    correctAnswer: 14,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `PC = ${val}`,
    formulaDisplay: "PA = PB and PB = PC  →  PA = PC",
    bookPage: {
      title: "📖 Transitive Tangent Networks",
      concept: "By the transitive property of equality, if two separate tangents are equal to a common middle tangent drawn from the same point, they are equal to each other.",
      formulaBreakdown: "If PA = PB and PB = PC, then PA = PC",
      stepByStep: [
        "For Circle 1, identify the two tangents drawn from external point P: PA and PB. (PA = PB).",
        "For Circle 2, identify the two tangents drawn from external point P: PB and PC. (PB = PC).",
        "Apply the transitive property of equality: if PA = PB and PB = PC, then PA = PC.",
        "Use the given length of PA to determine the length of PC."
      ],
      visualTip: "Follow the energy flow from PA to PB, and then from PB to PC. All three glowing lines maintain the same length!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "PA = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "14", correctAnswer: "14", widthChars: 4, hint: "Given PA" },
      { lineNum: 3, textBefore: " units. By equal tangents: PA = PB = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "14", correctAnswer: "14", widthChars: 4, hint: "PB = PA" },
      { lineNum: 5, textBefore: " and PB = PC. Therefore PC = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "14", correctAnswer: "14", widthChars: 4, hint: "Same as PA" },
      { lineNum: 7, textBefore: " units." }
    ]
  },

  "lvl-circle-18": {
    id: "lvl-circle-18",
    question: "Approve the defense station's structural design by solving the equal-tangent questions on your board exam sheet.",
    inputLabel: "Design Verifier",
    placeholder: "Solve the notebook...",
    correctAnswer: 0,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (_val) => `Network Calibrated`,
    formulaDisplay: "Theorem: Tangents from External Point are Equal",
    bookPage: {
      title: "📖 Equal Tangents Theorem Review",
      concept: "Tangents drawn from an external point to a circle are equal. If the angle between them is 60°, the triangle formed by the two tangents and the chord joining the points of contact is equilateral.",
      formulaBreakdown: "PA = PB  |  ∠APB = 60° → △PAB is equilateral",
      stepByStep: [
        "Complete the theorem questions on your notebook sheet.",
        "Recall that tangents from an external point are equal.",
        "Recall that if the angle is 60°, △PAB is equilateral because PA = PB.",
        "Calculate the hypotenuse OP using the radius and tangent length."
      ],
      visualTip: "Solve the notebook fields to prove structural stability and engage the defense shield."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "The lengths of tangents drawn from an external point to a circle are " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "equal", correctAnswer: "equal", widthChars: 8, hint: "Are they different or equal?" },
      { lineNum: 3, textBefore: "If PA and PB are tangents from P, and ∠APB = 60°, then △PAB is an " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "equilateral", correctAnswer: "equilateral", widthChars: 11, hint: "Type of triangle (isosceles/equilateral/scalene)" },
      { lineNum: 5, textBefore: "If radius OA = 5 and PA = 12, then the distance OP is " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "13", correctAnswer: "13", widthChars: 4, hint: "Use Pythagoras on △OAP" }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 4 — Circle Construction Challenges (Levels 19–24)
  // ═════════════════════════════════════════════════════════════════

  "lvl-circle-19": {
    id: "lvl-circle-19",
    question: "A triangular road network ABC circumscribes a circular city park of radius 4 km. The road segment BC is touched by the park boundary at D, dividing it into two segments BD = 6 km and DC = 8 km. If the area of triangle ABC is exactly 84 km², what is the total perimeter of the triangular road network ABC (in km)?",
    inputLabel: "Road Perimeter",
    placeholder: "Enter perimeter...",
    correctAnswer: 42,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Perimeter = ${val} km`,
    formulaDisplay: "Area = r × s",
    bookPage: {
      title: "📖 Circumscribed Triangle Roads",
      concept: "A classic NCERT problem! A triangle ABC circumscribing a circle of radius r can be split into three smaller triangles: OBC, OCA, and OAB. The sum of their areas is equal to the total area.",
      formulaBreakdown: "Total Area = (1/2 × r × a) + (1/2 × r × b) + (1/2 × r × c) = r × s",
      stepByStep: [
        "Let the equal tangent segments from vertex A be x. The sides are AB = x + BD and AC = x + CD.",
        "Express the semi-perimeter s in terms of x: s = x + BD + CD.",
        "Use the triangle area formula: Area = r × s, where r is the inradius.",
        "Solve the linear equation for x using the given total area and radius.",
        "Calculate the final perimeter: Perimeter = 2 × s."
      ],
      visualTip: "Observe the city park ringed by the triangular roads. Notice how the three smaller sector triangles combine to cover the entire area!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: Inradius r = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "4", correctAnswer: "4", widthChars: 4, hint: "Radius" },
      { lineNum: 3, textBefore: " km, Area = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "84", correctAnswer: "84", widthChars: 5, hint: "Area" },
      { lineNum: 5, textBefore: " km². Semi-perimeter s = Area/r = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "21", correctAnswer: "21", widthChars: 5, hint: "84/4" },
      { lineNum: 7, textBefore: ". Perimeter = 2s = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "42", correctAnswer: "42", widthChars: 5, hint: "2×21" },
      { lineNum: 9, textBefore: " km" }
    ]
  },

  "lvl-circle-20": {
    id: "lvl-circle-20",
    question: "An orbital docking port consists of two concentric circular shields of radii 3 km and 5 km. A straight docking platform chord of the outer circle touches the inner circle as a tangent. Find the total length of this docking platform chord (in km).",
    inputLabel: "Chord Length",
    placeholder: "Enter length...",
    correctAnswer: 8,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Docking Length = ${val} km`,
    formulaDisplay: "Chord Length = 2 × √(R² - r²)",
    bookPage: {
      title: "📖 Concentric Shield Docking",
      concept: "For two concentric circles, the chord of the larger circle that touches the smaller circle is bisected at the point of contact. This forms a right-angled triangle between the inner radius, half-chord, and outer radius.",
      formulaBreakdown: "Half-Chord = √(R² - r²)  |  Total Chord = 2 × √(R² - r²)",
      stepByStep: [
        "Identify the inner radius r and outer radius R of the concentric circles.",
        "Recall that the radius r to the point of contact is perpendicular to the tangent chord, bisecting it.",
        "Form a right-angled triangle with hypotenuse R and base leg r.",
        "Calculate the half-chord length using Pythagoras: half-chord = √(R² - r²).",
        "Double this result to find the total chord length: Chord = 2 × √(R² - r²)."
      ],
      visualTip: "A glowing chord spans the outer shield, perfectly kissing the inner shield's boundary. The perpendicular radius bisects it!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: Outer radius R = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "5", correctAnswer: "5", widthChars: 4, hint: "Outer R" },
      { lineNum: 3, textBefore: " km, Inner radius r = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "3", correctAnswer: "3", widthChars: 4, hint: "Inner r" },
      { lineNum: 5, textBefore: " km. Half-chord = √(R² - r²) = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "4", correctAnswer: "4", widthChars: 4, hint: "√(25-9)" },
      { lineNum: 7, textBefore: " km. Full chord = 2 × 4 = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "2×4" },
      { lineNum: 9, textBefore: " km" }
    ]
  },

  "lvl-circle-21": {
    id: "lvl-circle-21",
    question: "A triangular laser grid circumscribes a circular shield. The points of contact divide the vertices into segments. The segments from vertices A, B, and C to their respective contact points measure AD = 4, BE = 5, and CF = 6. What is the total perimeter of the triangular laser grid?",
    inputLabel: "Total Perimeter",
    placeholder: "Enter perimeter...",
    correctAnswer: 30,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Perimeter = ${val}`,
    formulaDisplay: "Perimeter = 2 × (AD + BE + CF)",
    bookPage: {
      title: "📖 Triangular Contact Checkpoints",
      concept: "Because tangents from each vertex to the circle are equal, the three vertices produce three pairs of equal segments around the circle.",
      formulaBreakdown: "Perimeter = 2 × (segment₁ + segment₂ + segment₃)",
      stepByStep: [
        "Recall that tangents from each vertex to the inscribed circle are equal in length.",
        "Identify the three pairs of equal tangent segments from vertices A, B, and C.",
        "Calculate the perimeter by summing all six segments (two of each length).",
        "Formula: Perimeter = 2 × (segment_A + segment_B + segment_C)."
      ],
      visualTip: "The triangle sides are segmented into matching color-coded pairs. Adding them up gives the exact perimeter."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: AD = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "4", correctAnswer: "4", widthChars: 4, hint: "From vertex A" },
      { lineNum: 3, textBefore: ", BE = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "5", correctAnswer: "5", widthChars: 4, hint: "From vertex B" },
      { lineNum: 5, textBefore: ", CF = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "6", correctAnswer: "6", widthChars: 4, hint: "From vertex C" },
      { lineNum: 7, textBefore: ". Perimeter = 2 × (4+5+6) = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "30", correctAnswer: "30", widthChars: 5, hint: "2×15" }
    ]
  },

  "lvl-circle-22": {
    id: "lvl-circle-22",
    question: "A quadrilateral ABCD is circumscribed around a circular central hub. Three of its sides are AB = 8, CD = 9, and BC = 10. Find the length of the fourth side AD to close the network loop.",
    inputLabel: "Side AD Length",
    placeholder: "Enter length...",
    correctAnswer: 7,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AD = ${val}`,
    formulaDisplay: "AB + CD = BC + AD",
    bookPage: {
      title: "📖 Circumscribed Quad Boundary",
      concept: "A circumscribed quadrilateral boundary satisfies the opposite side sum theorem. This is a robust framework used to contain circular high-pressure chambers.",
      formulaBreakdown: "AB + CD = BC + AD",
      stepByStep: [
        "Recall the opposite side sum theorem for circumscribed quadrilaterals: AB + CD = BC + AD.",
        "Sum the lengths of the first opposite pair AB and CD.",
        "Equate this sum to the sum of the second opposite pair BC and AD.",
        "Solve for the missing side AD."
      ],
      visualTip: "Adjust the length of AD. The frame becomes a secure geometric fit when AD is exactly 7."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "For circumscribed quadrilateral: AB + CD = BC + AD" },
      { lineNum: 2, textBefore: "Given: AB = " },
      { lineNum: 3, hasInput: true, inputIndex: 0, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "Side AB" },
      { lineNum: 4, textBefore: ", CD = " },
      { lineNum: 5, hasInput: true, inputIndex: 1, placeholder: "9", correctAnswer: "9", widthChars: 4, hint: "Side CD" },
      { lineNum: 6, textBefore: ", BC = " },
      { lineNum: 7, hasInput: true, inputIndex: 2, placeholder: "10", correctAnswer: "10", widthChars: 5, hint: "Side BC" },
      { lineNum: 8, textBefore: ". AB + CD = " },
      { lineNum: 9, hasInput: true, inputIndex: 3, placeholder: "17", correctAnswer: "17", widthChars: 5, hint: "8+9" },
      { lineNum: 10, textBefore: " = BC + AD → AD = " },
      { lineNum: 11, hasInput: true, inputIndex: 4, placeholder: "7", correctAnswer: "7", widthChars: 4, hint: "17-10" }
    ]
  },

  "lvl-circle-23": {
    id: "lvl-circle-23",
    question: "A circular energy core is inscribed in a triangle ABC with sides AB = 12, BC = 8, and AC = 10. The core is tangent to side AB at D. Find the length of the tangent segment AD.",
    inputLabel: "Segment AD",
    placeholder: "Enter length...",
    correctAnswer: 7,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AD = ${val}`,
    formulaDisplay: "AD = (AB + AC - BC) / 2",
    bookPage: {
      title: "📖 Inner Contact Segments",
      concept: "To find individual tangent segments of an inscribed circle, represent the segments as variables and solve using the perimeter of the triangle.",
      formulaBreakdown: "Let AD = x. Then AF = x, BD = AB - x, CF = AC - x",
      stepByStep: [
        "Let the target tangent segment AD be x. Since tangents from vertex A are equal, AF = x.",
        "Express the remaining segments on sides AB and AC in terms of x: BD = AB - x, and CF = AC - x.",
        "Recall that BD = BE and CF = CE. Therefore, side BC = BE + CE = (AB - x) + (AC - x).",
        "Set up the algebraic equation: BC = AB + AC - 2x.",
        "Solve for x: x = (AB + AC - BC) / 2."
      ],
      visualTip: "Solve for x. The contact point D shifts to show the exact partition on side AB!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: AB = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "12", correctAnswer: "12", widthChars: 5, hint: "Side AB" },
      { lineNum: 3, textBefore: ", BC = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "Side BC" },
      { lineNum: 5, textBefore: ", AC = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "10", correctAnswer: "10", widthChars: 5, hint: "Side AC" },
      { lineNum: 7, textBefore: ". AD = (AB + AC - BC)/2 = (12+10-8)/2 = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "7", correctAnswer: "7", widthChars: 4, hint: "14/2" }
    ]
  },

  "lvl-circle-24": {
    id: "lvl-circle-24",
    question: "Verify the core coordinates of the circular city road and concentric shield designs on the board sheet.",
    inputLabel: "City Verifier",
    placeholder: "Solve the notebook...",
    correctAnswer: 0,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (_val) => `Systems Synced`,
    formulaDisplay: "Concentric Circles & Quadrilateral Theorems",
    bookPage: {
      title: "📖 Circumscription Review",
      concept: "Concentric circles share the same center. The chord of the larger circle tangent to the smaller circle is bisected by the radius. Quadrilaterals circumscribing circles have equal opposite side sums.",
      formulaBreakdown: "Chord L = 2 × √(R² - r²)  |  AB + CD = BC + AD",
      stepByStep: [
        "Resolve the questions on your exam sheet.",
        "Recall that concentric circles share the same center.",
        "Compute the chord length using the formula: L = 2 × √(R² - r²).",
        "Confirm opposite side sums: AB + CD = BC + AD."
      ],
      visualTip: "Solve all notebook entries to verify the grid and sync the systems."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Concentric circles have the same " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "center", correctAnswer: "center", widthChars: 8, hint: "Shared geometric property" },
      { lineNum: 3, textBefore: "A chord of the larger circle (R=10) tangent to the smaller (r=6) has length " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "16", correctAnswer: "16", widthChars: 4, hint: "Double the Pythagorean half-chord" },
      { lineNum: 5, textBefore: "If a quadrilateral ABCD circumscribes a circle, then AB + CD = BC + " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "AD", correctAnswer: "AD", widthChars: 4, hint: "The remaining opposite side" }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  // WORLD 5 — Orbital Mastery Challenges (Levels 25–30)
  // ═════════════════════════════════════════════════════════════════

  "lvl-circle-25": {
    id: "lvl-circle-25",
    question: "A circular shield core has two parallel tangent defense beams. If the radius of the core is 6 meters, what is the perpendicular distance (in meters) between the two parallel defense beams?",
    inputLabel: "Distance",
    placeholder: "Enter distance...",
    correctAnswer: 12,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Distance = ${val} m`,
    formulaDisplay: "Distance d = 2 × r (Diameter)",
    bookPage: {
      title: "📖 Parallel Tangents Distance",
      concept: "A circle can have at most two parallel tangents at any given time. These parallel tangents must occur at opposite ends of a diameter. Therefore, the distance between them is always equal to the diameter.",
      formulaBreakdown: "Distance between parallel tangents = Diameter = 2 × Radius",
      stepByStep: [
        "Identify the radius r of the circular shield core.",
        "Recall that parallel tangents to a circle can only exist at the endpoints of a diameter.",
        "Recognize that the perpendicular distance between these parallel lines is equal to the diameter.",
        "Calculate the distance: d = 2 × r."
      ],
      visualTip: "Notice how the two glowing parallel laser lines are positioned on opposite sides of the reactor. The distance is exactly the diameter!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Parallel tangents to a circle are at opposite ends of a " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "diameter", correctAnswer: "diameter", widthChars: 10, hint: "Longest chord" },
      { lineNum: 3, textBefore: ". Given radius r = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "6", correctAnswer: "6", widthChars: 4, hint: "Radius" },
      { lineNum: 5, textBefore: " m, distance between parallel tangents = 2r = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "12", correctAnswer: "12", widthChars: 5, hint: "Diameter" },
      { lineNum: 7, textBefore: " m" }
    ]
  },

  "lvl-circle-26": {
    id: "lvl-circle-26",
    question: "From an external satellite station P, situated 26 km away from the center O of a circular communication hub of radius 10 km, two direct laser tangents PA and PB are fired. Find the total area (in km²) of the quadrilateral region OAPB enclosed by the beams and radii.",
    inputLabel: "Enclosed Area",
    placeholder: "Enter area...",
    correctAnswer: 240,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Area = ${val} km²`,
    formulaDisplay: "Area OAPB = r × PT",
    bookPage: {
      title: "📖 Area of Tangent Quadrilaterals",
      concept: "The quadrilateral OAPB is formed by two congruent right-angled triangles, △OAP and △OBP. The total area is simply the sum of their individual areas.",
      formulaBreakdown: "Area = 2 × (1/2 × base × height) = Radius (r) × Tangent (PT)",
      stepByStep: [
        "Identify the radius r = OA and distance from external point to center OP.",
        "Find the tangent length PT using the Pythagorean theorem: PT = √(OP² - r²).",
        "Understand that quadrilateral OAPB is formed by two congruent right-angled triangles △OAP and △OBP.",
        "Calculate the area of the quadrilateral: Area = 2 × (1/2 × r × PT) = r × PT."
      ],
      visualTip: "The quadrilateral is bisected by the line OP into two equal right triangles. The total shaded area is 240!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: OP = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "26", correctAnswer: "26", widthChars: 5, hint: "Distance" },
      { lineNum: 3, textBefore: " km, r = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "10", correctAnswer: "10", widthChars: 5, hint: "Radius" },
      { lineNum: 5, textBefore: " km. PT = √(OP² - r²) = √(676-100) = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "24", correctAnswer: "24", widthChars: 5, hint: "√576" },
      { lineNum: 7, textBefore: " km. Area OAPB = r × PT = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "240", correctAnswer: "240", widthChars: 5, hint: "10×24" },
      { lineNum: 9, textBefore: " km²" }
    ]
  },

  "lvl-circle-27": {
    id: "lvl-circle-27",
    question: "A futuristic tangent bridge system connects two terminals A and B on a circular reactor of radius 5. The chord AB measures 8. The tangents at A and B intersect at an external junction P. Find the length of the bridge tangent PA.",
    inputLabel: "Bridge PA Length",
    placeholder: "Enter length...",
    correctAnswer: 6.67,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `PA = ${val}`,
    formulaDisplay: "PA = (Radius × Half-Chord) / OM",
    bookPage: {
      title: "📖 Tangent Bridge Junctions",
      concept: "A highly challenging NCERT problem! By drawing the perpendicular bisector OM from center O to chord AB, we create similar right-angled triangles △OMA and △OAP, which allows us to solve for PA.",
      formulaBreakdown: "OM = √(r² - AM²)  |  PA / AM = OA / OM  →  PA = (r × AM) / OM",
      stepByStep: [
        "Find the midpoint M of the chord AB. The half-chord AM is AB / 2.",
        "Find the perpendicular distance from center to chord OM using Pythagoras: OM = √(OA² - AM²).",
        "Identify the similar right-angled triangles: △OMA is similar to △OAP (sharing angle O).",
        "Set up the ratio of corresponding sides: PA / AM = OA / OM.",
        "Solve for the tangent bridge length: PA = (OA × AM) / OM."
      ],
      visualTip: "The two right triangles are overlayed. Watch the ratio lock and bridge PA form at length 6.67!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: r = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "5", correctAnswer: "5", widthChars: 4, hint: "Radius" },
      { lineNum: 3, textBefore: ", chord AB = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "Chord" },
      { lineNum: 5, textBefore: ", so AM = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "4", correctAnswer: "4", widthChars: 4, hint: "Half chord" },
      { lineNum: 7, textBefore: ". OM = √(r² - AM²) = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "3", correctAnswer: "3", widthChars: 4, hint: "√(25-16)" },
      { lineNum: 9, textBefore: ". By similar triangles, PA = (r × AM)/OM = " },
      { lineNum: 10, hasInput: true, inputIndex: 4, placeholder: "6.67", correctAnswer: "6.67", widthChars: 6, hint: "(5×4)/3" }
    ]
  },

  "lvl-circle-28": {
    id: "lvl-circle-28",
    question: "Two orbital space stations are modeled as circles of radii 8 km and 3 km. Their centers O and Q are separated by a distance of 13 km. A direct common tangent beam is constructed between them. Find the exact length of this direct common tangent beam (in km).",
    inputLabel: "Tangent Length",
    placeholder: "Enter length...",
    correctAnswer: 12,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Tangent = ${val} km`,
    formulaDisplay: "Common Tangent = √(d² - (R - r)²)",
    bookPage: {
      title: "📖 Direct Common Tangents",
      concept: "A direct common tangent touches both circles on the same side. By drawing a line parallel to the tangent from the smaller center, we form a right-angled triangle containing the center distance and difference in radii.",
      formulaBreakdown: "Direct Tangent = √(Center Distance² - (Radius Difference)²)",
      stepByStep: [
        "Identify centers separation distance d, larger radius R, and smaller radius r.",
        "Project the direct common tangent to form a right-angled triangle with legs (R - r) and the tangent length, and hypotenuse d.",
        "Apply the Pythagorean theorem to this helper triangle.",
        "Calculate the tangent length: Common Tangent = √(d² - (R - r)²)."
      ],
      visualTip: "A line connects the outer rims of both circles. A helper triangle shows how the tangent projects parallel to the center line!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: R = " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "8", correctAnswer: "8", widthChars: 4, hint: "Larger radius" },
      { lineNum: 3, textBefore: " km, r = " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "3", correctAnswer: "3", widthChars: 4, hint: "Smaller radius" },
      { lineNum: 5, textBefore: " km, d = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "13", correctAnswer: "13", widthChars: 5, hint: "Center distance" },
      { lineNum: 7, textBefore: " km. R - r = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "5", correctAnswer: "5", widthChars: 4, hint: "8-3" },
      { lineNum: 9, textBefore: ". Tangent = √(d² - (R-r)²) = √(169-25) = " },
      { lineNum: 10, hasInput: true, inputIndex: 4, placeholder: "12", correctAnswer: "12", widthChars: 5, hint: "√144" },
      { lineNum: 11, textBefore: " km" }
    ]
  },

  "lvl-circle-29": {
    id: "lvl-circle-29",
    question: "Master the core relationships between tangents, angles, and diameters on the board sheet to unlock the central reactor.",
    inputLabel: "Calibrator",
    placeholder: "Solve the notebook...",
    correctAnswer: 0,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (_val) => `Calibration Complete`,
    formulaDisplay: "Supplementary Angles & Tangent Lengths",
    bookPage: {
      title: "📖 Master Theorem Review",
      concept: "The angle between two tangents from an external point is supplementary to the angle subtended by the radii at the center. Tangents from an external point are equal. Parallel tangents exist only at the endpoints of a diameter.",
      formulaBreakdown: "∠APB + ∠AOB = 180°  |  PA = PB",
      stepByStep: [
        "Resolve the master theorem questions on your notebook.",
        "Recall that the angle between two tangents from an external point and the center angle are supplementary (sum is 180°).",
        "Calculate the tangent length from center distance and radius using Pythagoras: PT = √(OP² - r²).",
        "Recall that parallel tangents must lie at the endpoints of a diameter."
      ],
      visualTip: "Solve all three questions to prepare the reactor for its final startup sequence."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "If the angle between two tangents is 120°, the center angle is " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "60", correctAnswer: "60", widthChars: 4, hint: "Angles are supplementary (sum is 180)" },
      { lineNum: 3, textBefore: "With radius 5, the tangent from a point 13 units from center is " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "12", correctAnswer: "12", widthChars: 4, hint: "Standard 5-12-13 right triangle" },
      { lineNum: 5, textBefore: "Parallel tangents can only be drawn at the two ends of a " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "diameter", correctAnswer: "diameter", widthChars: 8, hint: "Chord passing through the center" }
    ]
  },

  "lvl-circle-30": {
    id: "lvl-circle-30",
    question: "FINAL BOSS: Calibrate the massive Orbital Geometry Reactor by proving all foundational circle geometry theorems step-by-step on the board sheet.",
    inputLabel: "Reactor Master",
    placeholder: "Solve the final sheet...",
    correctAnswer: 0,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (_val) => `REACTOR IGNITED ⚡`,
    formulaDisplay: "Synthesis of Chapters 10.1 & 10.2 Theorems",
    bookPage: {
      title: "📖 Final Boss: Circles Mastery",
      concept: "Master all Circle geometry theorems: Tangent ⊥ Radius (90°), equal tangents from external points, circumscribed triangles, and Pythagorean triples. Synthesize these to ignite the reactor!",
      formulaBreakdown: "r ⊥ PT (90°) | PA = PB | AD = (AB + AC - BC) / 2 | c² = a² + b²",
      stepByStep: [
        "Review the final comprehensive sheet on your notebook.",
        "Q1: Recall the perpendicularity theorem: Radius ⊥ Tangent.",
        "Q2: Recall Theorem 10.2: Tangents from an external point are equal.",
        "Q3: Apply segment calculation formula for inscribed circle: AD = (AB + AC - BC) / 2.",
        "Q4: Apply Pythagoras to find the hypotenuse: OP = √(OT² + PT²)."
      ],
      visualTip: "Solve the final four master blanks to prove complete circle geometry mastery and save the nexus!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "The angle between a tangent and the radius is always " },
      { lineNum: 2, hasInput: true, inputIndex: 0, placeholder: "90", correctAnswer: "90", widthChars: 4, hint: "Perpendicular angle" },
      { lineNum: 3, textBefore: "Tangents drawn from an external point to a circle are " },
      { lineNum: 4, hasInput: true, inputIndex: 1, placeholder: "equal", correctAnswer: "equal", widthChars: 8, hint: "Relationship of lengths" },
      { lineNum: 5, textBefore: "If a circle is inscribed in △ABC with AB=12, BC=8, AC=10, then AD = " },
      { lineNum: 6, hasInput: true, inputIndex: 2, placeholder: "7", correctAnswer: "7", widthChars: 4, hint: "Tangent segment (AB+AC-BC)/2" },
      { lineNum: 7, textBefore: "In a right △OPT with radius OT=5 and tangent PT=12, then OP = " },
      { lineNum: 8, hasInput: true, inputIndex: 3, placeholder: "13", correctAnswer: "13", widthChars: 4, hint: "Pythagorean hypotenuse" }
    ]
  }
};

export default circleSpecs;
