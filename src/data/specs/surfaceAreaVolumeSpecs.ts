import type { LevelSpecification } from '../levelSpecs';

const surfaceAreaVolumeSpecs: Record<string, LevelSpecification> = {
  "lvl-01": {
    id: "lvl-01",
    question: "Calculate the required edge (side length) of the cube so that its total Volume is exactly 1000 cubic units.",
    inputLabel: "Edge Length (s)",
    placeholder: "Type side length (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 0.1,
    calculateValue: (s) => Math.pow(s, 3),
    getDimensionsLabel: (s) => `side (s) = ${s.toFixed(1)}`,
    formulaDisplay: "Volume = s³",
    bookPage: {
      title: "📖 The Cube's Core Space",
      concept: "Volume is the measure of 3D space inside an object. A Cube is the most fundamental 3D shape because its Length, Width, and Height are all exactly equal to its edge side ($s$).",
      formulaBreakdown: "Volume = side × side × side = s³",
      stepByStep: [
        "Imagine placing 1×1×1 water blocks inside a container.",
        "A cube of side length 1 holds 1 block. A cube of side length 2 holds 2 × 2 × 2 = 8 blocks.",
        "We want our cube to hold exactly 1000 blocks.",
        "To find the required side, we solve: s³ = 1000.",
        "Taking the cube root: s = ∛1000 = 10."
      ],
      visualTip: "Type 10 to watch the cube expand to full size! Every change you type automatically animates in real-time."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Target Volume of Cube = 1000 cubic units" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "Let the edge length of the cube be s." },
      { lineNum: 5, textBefore: "Formula: Volume = s³" },
      { lineNum: 6, textBefore: "  s³ = 1000" },
      { lineNum: 7, textBefore: "  s = ∛1000" },
      { lineNum: 8, textBefore: "  s = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "side", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-02": {
    id: "lvl-02",
    question: "Resize the height of the cuboid cargo box (with length = 20, width = 10) so that its Volume is exactly 2400 cubic units.",
    inputLabel: "Height (h)",
    placeholder: "Type height (e.g. 12)...",
    correctAnswer: 12,
    tolerance: 0.1,
    calculateValue: (h) => 20 * 10 * h,
    getDimensionsLabel: (h) => `l = 20, w = 10, height (h) = ${h.toFixed(1)}`,
    formulaDisplay: "Volume = l × w × h",
    bookPage: {
      title: "📖 Resizing Cuboids",
      concept: "Unlike a cube, a cuboid can have different values for length ($l$), width ($w$), and height ($h$). Its volume is the product of its base area and its height.",
      formulaBreakdown: "Volume = Length (l) × Width (w) × Height (h)",
      stepByStep: [
        "First, calculate the base area: Area = Length × Width = 20 × 10 = 200.",
        "Now, multiply the base area by the height (h): Volume = 200 × h.",
        "We need the Volume to equal 2400. So we write the equation: 200 × h = 2400.",
        "Divide both sides by 200 to find the height: h = 2400 / 200 = 12."
      ],
      visualTip: "Watch the cuboid stretch vertically as you increase the height. Try entering 12!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Length of Cuboid (l) = 20 units" },
      { lineNum: 3, textBefore: "  Width of Cuboid (w) = 10 units" },
      { lineNum: 4, textBefore: "  Target Volume = 2400 cubic units" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: Volume = l × w × h" },
      { lineNum: 7, textBefore: "  2400 = 20 × 10 × h" },
      { lineNum: 8, textBefore: "  2400 = 200 × h" },
      { lineNum: 9, textBefore: "  h = 2400 / 200" },
      { lineNum: 10, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "12", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-03": {
    id: "lvl-03",
    question: "Adjust the height of the cylindrical water tank (with radius = 10, using π ≈ 3.14) to reach a Volume of exactly 3140 cubic units.",
    inputLabel: "Height (h)",
    placeholder: "Type height (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 0.1,
    calculateValue: (h) => 3.14 * Math.pow(10, 2) * h,
    getDimensionsLabel: (h) => `radius (r) = 10, height (h) = ${h.toFixed(1)}`,
    formulaDisplay: "Volume = π × r² × h",
    bookPage: {
      title: "📖 The Cylinder Formula",
      concept: "A cylinder consists of a circular base that is stacked vertically. The volume is calculated by multiplying the circular base area ($πr^2$) by the height ($h$).",
      formulaBreakdown: "Volume = Base Area × Height = (π × r²) × h",
      stepByStep: [
        "Calculate the circular base area first: Area = π × r² = 3.14 × 10² = 314.",
        "To find the volume, multiply by height (h): Volume = 314 × h.",
        "We want the total volume to be 3140. Let's solve: 314 × h = 3140.",
        "Divide 3140 by 314 to get height: h = 10."
      ],
      visualTip: "Increasing height extends the stacked circles. Input 10 to see it reach target height!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Base Radius of Cylinder (r) = 10 units" },
      { lineNum: 3, textBefore: "  Target Volume = 3140 cubic units" },
      { lineNum: 4, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: Volume = π × r² × h" },
      { lineNum: 7, textBefore: "  3140 = 3.14 × 10² × h" },
      { lineNum: 8, textBefore: "  3140 = 314 × h" },
      { lineNum: 9, textBefore: "  h = 3140 / 314" },
      { lineNum: 10, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-04": {
    id: "lvl-04",
    question: "Calculate the height of the cone-shaped ice cream cup (with radius = 10, using π ≈ 3.14) to hold exactly 1047 cubic units of dessert.",
    inputLabel: "Height (h)",
    placeholder: "Type height (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 1.0,
    calculateValue: (h) => (1/3) * 3.14 * Math.pow(10, 2) * h,
    getDimensionsLabel: (h) => `radius (r) = 10, height (h) = ${h.toFixed(1)}`,
    formulaDisplay: "Volume = 1/3 × π × r² × h",
    bookPage: {
      title: "📖 The Cone Principle",
      concept: "A cone is exactly 1/3 the volume of a cylinder with the same circular base radius and height. This means a cylinder can hold exactly three cones of the same dimensions!",
      formulaBreakdown: "Volume = 1/3 × (π × r²) × h",
      stepByStep: [
        "Calculate circular base area: Area = π × r² = 3.14 × 10² = 314.",
        "The volume of a cylinder would be 314 × h. A cone is one-third of that: Volume = 1/3 × 314 × h = 104.67 × h.",
        "We want Volume = 1047. Solve the equation: 104.67 × h = 1047.",
        "Divide 1047 by 104.67: h ≈ 10."
      ],
      visualTip: "Cones are sleek! As you adjust the height, the sides angle smoothly to the peak. Enter 10!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Base Radius of Cone (r) = 10 units" },
      { lineNum: 3, textBefore: "  Target Volume = 1047 cubic units" },
      { lineNum: 4, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: Volume = 1/3 × π × r² × h" },
      { lineNum: 7, textBefore: "  1047 ≈ 1/3 × 3.14 × 10² × h" },
      { lineNum: 8, textBefore: "  1047 ≈ 104.67 × h" },
      { lineNum: 9, textBefore: "  h ≈ 1047 / 104.67" },
      { lineNum: 10, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-05": {
    id: "lvl-05",
    question: "Find the required radius of a spherical spaceship capsule so that its internal Volume is exactly 4188 cubic units (using π ≈ 3.14).",
    inputLabel: "Radius (r)",
    placeholder: "Type radius (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 2.0,
    calculateValue: (r) => (4/3) * 3.14 * Math.pow(r, 3),
    getDimensionsLabel: (r) => `radius (r) = ${r.toFixed(1)}`,
    formulaDisplay: "Volume = 4/3 × π × r³",
    bookPage: {
      title: "📖 Spherical Volumes",
      concept: "A sphere is perfectly symmetrical in 3D. The volume depends entirely on its radius ($r$). The factor of 4/3 is derived from integration and Archimedes' classic studies.",
      formulaBreakdown: "Volume = 4/3 × π × r³",
      stepByStep: [
        "Set up the sphere formula with our target: Volume = 4/3 × 3.14 × r³ = 4188.",
        "Simplify the coefficient: 4/3 × 3.14 = 4.187.",
        "Our equation is now: 4.187 × r³ = 4188.",
        "Divide both sides by 4.187: r³ ≈ 1000.",
        "Take the cube root of 1000 to find radius: r = ∛1000 = 10."
      ],
      visualTip: "Watch the circle expand in all directions. Type 10 to see it inflate to full size!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Target Volume of Sphere = 4188 cubic units" },
      { lineNum: 3, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Formula: Volume = 4/3 × π × r³" },
      { lineNum: 6, textBefore: "  4188 = 4/3 × 3.14 × r³" },
      { lineNum: 7, textBefore: "  4188 ≈ 4.187 × r³" },
      { lineNum: 8, textBefore: "  r³ ≈ 4188 / 4.187 ≈ 1000" },
      { lineNum: 9, textBefore: "  r = ∛1000" },
      { lineNum: 10, textBefore: "  r = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "r", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-06": {
    id: "lvl-06",
    question: "Calculate the radius of a hemispherical biodome (using π ≈ 3.14) to reach an internal Volume of exactly 2094 cubic units.",
    inputLabel: "Radius (r)",
    placeholder: "Type radius (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 1.0,
    calculateValue: (r) => (2/3) * 3.14 * Math.pow(r, 3),
    getDimensionsLabel: (r) => `radius (r) = ${r.toFixed(1)}`,
    formulaDisplay: "Volume = 2/3 × π × r³",
    bookPage: {
      title: "📖 Hemispheres & Domes",
      concept: "A hemisphere is exactly half of a full sphere. Consequently, its volume is exactly half of the sphere's volume formula.",
      formulaBreakdown: "Volume = 2/3 × π × r³ (Half of 4/3 × π × r³)",
      stepByStep: [
        "Start with the hemisphere formula: Volume = 2/3 × 3.14 × r³.",
        "Calculate the constant: 2/3 × 3.14 ≈ 2.093.",
        "Set up equation for target 2094: 2.093 × r³ = 2094.",
        "Divide both sides by 2.093: r³ ≈ 1000.",
        "Find the cube root: r = ∛1000 = 10."
      ],
      visualTip: "Domes are very stable structures. Watch the dome size inflate as you enter 10."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Target Volume of Hemisphere = 2094 cubic units" },
      { lineNum: 3, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Formula: Volume = 2/3 × π × r³" },
      { lineNum: 6, textBefore: "  2094 = 2/3 × 3.14 × r³" },
      { lineNum: 7, textBefore: "  2094 ≈ 2.093 × r³" },
      { lineNum: 8, textBefore: "  r³ ≈ 2094 / 2.093 ≈ 1000" },
      { lineNum: 9, textBefore: "  r = ∛1000" },
      { lineNum: 10, textBefore: "  r = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "r", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-07": {
    id: "lvl-07",
    question: "Calculate the height of a cylindrical column (radius = 10, π ≈ 3.14) so its Curved Surface Area (CSA) is exactly 628 square units.",
    inputLabel: "Height (h)",
    placeholder: "Type height (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 0.1,
    calculateValue: (h) => 2 * 3.14 * 10 * h,
    getDimensionsLabel: (h) => `radius (r) = 10, height (h) = ${h.toFixed(1)}`,
    formulaDisplay: "CSA = 2 × π × r × h",
    bookPage: {
      title: "📖 Curved Surface Area (CSA)",
      concept: "Surface area is the measure of the outer face of a 3D shape. Curved Surface Area (CSA) is just the side jacket of a cylinder, excluding its top and bottom circle caps.",
      formulaBreakdown: "CSA = Circumference of Base × Height = 2 × π × r × h",
      stepByStep: [
        "Imagine unrolling the cylinder jacket into a flat rectangle.",
        "The width of this rectangle is the circular base perimeter: 2 × π × r = 2 × 3.14 × 10 = 62.8.",
        "The height of the rectangle is the cylinder height (h).",
        "Set up equation: Area = 62.8 × h = 628.",
        "Divide 628 by 62.8 to find height: h = 10."
      ],
      visualTip: "Only the curved jacket is measured here! Try entering 10."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Base Radius of Cylinder (r) = 10 units" },
      { lineNum: 3, textBefore: "  Target CSA = 628 square units" },
      { lineNum: 4, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: Curved Surface Area (CSA) = 2 × π × r × h" },
      { lineNum: 7, textBefore: "  628 = 2 × 3.14 × 10 × h" },
      { lineNum: 8, textBefore: "  628 = 62.8 × h" },
      { lineNum: 9, textBefore: "  h = 628 / 62.8" },
      { lineNum: 10, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-08": {
    id: "lvl-08",
    question: "Find the required height of a cuboid box (length = 20, width = 10) so its Total Surface Area (TSA) is exactly 1300 square units.",
    inputLabel: "Height (h)",
    placeholder: "Type height (e.g. 15)...",
    correctAnswer: 15,
    tolerance: 0.1,
    calculateValue: (h) => 2 * (20 * 10 + 20 * h + 10 * h),
    getDimensionsLabel: (h) => `l = 20, w = 10, height (h) = ${h.toFixed(1)}`,
    formulaDisplay: "TSA = 2(lw + lh + wh)",
    bookPage: {
      title: "📖 Total Surface Area (TSA)",
      concept: "Total Surface Area (TSA) measures the sum of the areas of all six rectangular faces of a cuboid (Front, Back, Top, Bottom, Left, Right).",
      formulaBreakdown: "TSA = 2 × (Length×Width + Length×Height + Width×Height)",
      stepByStep: [
        "Plug in given values length (l) = 20, width (w) = 10 into the formula: TSA = 2 × (200 + 20h + 10h) = 2 × (200 + 30h).",
        "Simplify the formula: TSA = 400 + 60h.",
        "We want TSA to equal 1300. Solve equation: 400 + 60h = 1300.",
        "Subtract 400: 60h = 900.",
        "Divide by 60 to find height: h = 900 / 60 = 15."
      ],
      visualTip: "All six sides are wrapped! Watch how height increases the areas of all four vertical faces. Enter 15!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Length of Cuboid (l) = 20 units" },
      { lineNum: 3, textBefore: "  Width of Cuboid (w) = 10 units" },
      { lineNum: 4, textBefore: "  Target TSA = 1300 square units" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: TSA = 2 × (l×w + l×h + w×h)" },
      { lineNum: 7, textBefore: "  1300 = 2 × (20×10 + 20×h + 10×h)" },
      { lineNum: 8, textBefore: "  1300 = 2 × (200 + 30h) = 400 + 60h" },
      { lineNum: 9, textBefore: "  60h = 1300 - 400 = 900" },
      { lineNum: 10, textBefore: "  h = 900 / 60" },
      { lineNum: 11, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "15", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-09": {
    id: "lvl-09",
    question: "Calculate the height of an industrial cylindrical pipe (radius = 20, π ≈ 3.14) with a target CSA of exactly 1256 square units.",
    inputLabel: "Height (h)",
    placeholder: "Type height (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 0.1,
    calculateValue: (h) => 2 * 3.14 * 20 * h,
    getDimensionsLabel: (h) => `radius (r) = 20, height (h) = ${h.toFixed(1)}`,
    formulaDisplay: "CSA = 2 × π × r × h",
    bookPage: {
      title: "📖 Cylindrical Pipe Area",
      concept: "For pipes, only the outer curved jacket (CSA) is insulated or painted. The top and bottom are open, so circular caps are ignored.",
      formulaBreakdown: "CSA = 2 × π × r × h",
      stepByStep: [
        "Calculate circular perimeter: 2 × π × r = 2 × 3.14 × 20 = 125.6.",
        "Set up CSA equation for target 1256: 125.6 × h = 1256.",
        "Divide both sides by 125.6: h = 10."
      ],
      visualTip: "Enter 10 to see the pipe length adjust perfectly."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Base Radius of Cylinder (r) = 20 units" },
      { lineNum: 3, textBefore: "  Target CSA = 1256 square units" },
      { lineNum: 4, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: CSA = 2 × π × r × h" },
      { lineNum: 7, textBefore: "  1256 = 2 × 3.14 × 20 × h" },
      { lineNum: 8, textBefore: "  1256 = 125.6 × h" },
      { lineNum: 9, textBefore: "  h = 1256 / 125.6" },
      { lineNum: 10, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-10": {
    id: "lvl-10",
    question: "Calculate the slant height (l) of a conical rocket nose cone (radius = 10, π ≈ 3.14) to reach an outer CSA of exactly 471 square units.",
    inputLabel: "Slant Height (l)",
    placeholder: "Type slant height (e.g. 15)...",
    correctAnswer: 15,
    tolerance: 0.1,
    calculateValue: (l) => 3.14 * 10 * l,
    getDimensionsLabel: (l) => `radius (r) = 10, slant height (l) = ${l.toFixed(1)}`,
    formulaDisplay: "CSA = π × r × l",
    bookPage: {
      title: "📖 Cone Slant Area",
      concept: "The Curved Surface Area of a cone depends on its base radius ($r$) and its slant height ($l$, the diagonal edge from peak to base border).",
      formulaBreakdown: "CSA = π × radius (r) × slant height (l)",
      stepByStep: [
        "Identify given value: radius (r) = 10.",
        "Plug into formula: CSA = 3.14 × 10 × l = 31.4 × l.",
        "Set equation for target 471: 31.4 × l = 471.",
        "Divide by 31.4: l = 15."
      ],
      visualTip: "Slant height is the slide length. Watch it change as you type 15."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Base Radius of Cone (r) = 10 units" },
      { lineNum: 3, textBefore: "  Target CSA = 471 square units" },
      { lineNum: 4, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 5, textBefore: "" },
      { lineNum: 6, textBefore: "Formula: Curved Surface Area (CSA) = π × r × l" },
      { lineNum: 7, textBefore: "  471 = 3.14 × 10 × l" },
      { lineNum: 8, textBefore: "  471 = 31.4 × l" },
      { lineNum: 9, textBefore: "  l = 471 / 31.4" },
      { lineNum: 10, textBefore: "  l = ", hasInput: true, inputIndex: 0, correctAnswer: "15", placeholder: "l", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-11": {
    id: "lvl-11",
    question: "Find the required radius of a spherical glass bubble so that its outer Surface Area is exactly 1256 square units (using π ≈ 3.14).",
    inputLabel: "Radius (r)",
    placeholder: "Type radius (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 1.0,
    calculateValue: (r) => 4 * 3.14 * Math.pow(r, 2),
    getDimensionsLabel: (r) => `radius (r) = ${r.toFixed(1)}`,
    formulaDisplay: "Surface Area = 4 × π × r²",
    bookPage: {
      title: "📖 Sphere Surface Area",
      concept: "A sphere's surface area is exactly 4 times the area of its flat central circular slice ($πr^2$). Think of wrapping a sphere perfectly with four circle sheets!",
      formulaBreakdown: "Surface Area = 4 × π × r²",
      stepByStep: [
        "Set up the area formula: 4 × 3.14 × r² = 1256.",
        "Simplify the coefficients: 12.56 × r² = 1256.",
        "Divide by 12.56: r² = 100.",
        "Take the square root: r = √100 = 10."
      ],
      visualTip: "Spherical surfaces wrap all around. Try entering 10!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Target Surface Area of Sphere = 1256 square units" },
      { lineNum: 3, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Formula: Surface Area = 4 × π × r²" },
      { lineNum: 6, textBefore: "  1256 = 4 × 3.14 × r²" },
      { lineNum: 7, textBefore: "  1256 = 12.56 × r²" },
      { lineNum: 8, textBefore: "  r² = 1256 / 12.56 = 100" },
      { lineNum: 9, textBefore: "  r = √100" },
      { lineNum: 10, textBefore: "  r = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "r", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-12": {
    id: "lvl-12",
    question: "Calculate the radius of a hemispherical bowl (using π ≈ 3.14) so that its Total Surface Area (TSA) is exactly 942 square units.",
    inputLabel: "Radius (r)",
    placeholder: "Type radius (e.g. 10)...",
    correctAnswer: 10,
    tolerance: 1.0,
    calculateValue: (r) => 3 * 3.14 * Math.pow(r, 2),
    getDimensionsLabel: (r) => `radius (r) = ${r.toFixed(1)}`,
    formulaDisplay: "TSA = 3 × π × r²",
    bookPage: {
      title: "📖 Hemisphere TSA",
      concept: "The Total Surface Area (TSA) of a solid hemisphere includes both the curved dome top ($2πr^2$) and the flat circular bottom base ($πr^2$). Adding them gives $3πr^2$!",
      formulaBreakdown: "TSA = Curved Dome + Flat circular base = 2πr² + πr² = 3 × π × r²",
      stepByStep: [
        "Set up the solid hemisphere area formula: 3 × 3.14 × r² = 942.",
        "Multiply constants: 9.42 × r² = 942.",
        "Divide by 9.42: r² = 100.",
        "Take the square root: r = √100 = 10."
      ],
      visualTip: "Watch the dome top and bottom base both scale together as you enter 10!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Target TSA of Hemispherical bowl = 942 square units" },
      { lineNum: 3, textBefore: "  Use π ≈ 3.14" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Formula: TSA = 3 × π × r²" },
      { lineNum: 6, textBefore: "  942 = 3 × 3.14 × r²" },
      { lineNum: 7, textBefore: "  942 = 9.42 × r²" },
      { lineNum: 8, textBefore: "  r² = 942 / 9.42 = 100" },
      { lineNum: 9, textBefore: "  r = √100" },
      { lineNum: 10, textBefore: "  r = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "r", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-13": {
    id: "lvl-13",
    question: "A warehouse is in the shape of a cuboid of dimensions 20m × 10m × 25m. How many smaller cuboid boxes of size 2m × 1m × 0.5m can be stored in it?",
    inputLabel: "Number of Boxes (N)",
    placeholder: "Type boxes...",
    correctAnswer: 5000,
    tolerance: 1.0,
    calculateValue: (n) => n,
    getDimensionsLabel: (n) => `Boxes: ${n}`,
    formulaDisplay: "Number of Boxes = V_warehouse / V_box",
    bookPage: {
      title: "📖 Warehouse Capacity",
      concept: "To find the number of identical smaller solids that can fit inside a larger solid, we divide the total volume of the larger container by the volume of a single small item.",
      formulaBreakdown: "N = Volume of Warehouse / Volume of 1 Box",
      stepByStep: [
        "Calculate the Volume of the cuboid warehouse: V1 = l × w × h = 20 × 10 × 25 = 5000 m³.",
        "Calculate the Volume of one cuboid cargo box: V2 = l × w × h = 2m × 1m × 0.5m = 1 m³.",
        "Divide warehouse volume by box volume: N = V1 / V2 = 5000 / 1 = 5000 boxes."
      ],
      visualTip: "Complete the steps to see the cargo boxes stack perfectly inside the warehouse!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Warehouse size = 20m × 10m × 25m" },
      { lineNum: 3, textBefore: "  Cargo box size = 2m × 1m × 0.5m" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Let the total number of boxes stored be N." },
      { lineNum: 6, textBefore: "" },
      { lineNum: 7, textBefore: "Step 1: Calculate Volume of Warehouse (V1)" },
      { lineNum: 8, textBefore: "  V1 = 20 × 10 × 25" },
      { lineNum: 9, textBefore: "  V1 = ", hasInput: true, inputIndex: 0, correctAnswer: "5000", placeholder: "V1", textAfter: " m³", widthChars: 6 },
      { lineNum: 10, textBefore: "" },
      { lineNum: 11, textBefore: "Step 2: Calculate Volume of 1 Cargo Box (V2)" },
      { lineNum: 12, textBefore: "  V2 = 2 × 1 × 0.5" },
      { lineNum: 13, textBefore: "  V2 = ", hasInput: true, inputIndex: 1, correctAnswer: "1", placeholder: "V2", textAfter: " m³", widthChars: 4 },
      { lineNum: 14, textBefore: "" },
      { lineNum: 15, textBefore: "Step 3: Solve for Number of Boxes (N)" },
      { lineNum: 16, textBefore: "  N = V1 / V2 = 5000 / 1" },
      { lineNum: 17, textBefore: "  N = ", hasInput: true, inputIndex: 2, correctAnswer: "5000", placeholder: "N", textAfter: " boxes", widthChars: 6 }
    ]
  },
  "lvl-14": {
    id: "lvl-14",
    question: "A cylindrical bucket of base radius 10cm and height 10cm is filled with water. The water is poured into another cylindrical vessel of radius 5cm. Find the height (h) to which water will rise.",
    inputLabel: "Height (h)",
    placeholder: "Type height...",
    correctAnswer: 40,
    tolerance: 0.1,
    calculateValue: (h) => 3.14 * Math.pow(5, 2) * h,
    getDimensionsLabel: (h) => `r = 5, h = ${h.toFixed(1)}`,
    formulaDisplay: "V_vessel = V_bucket",
    bookPage: {
      title: "📖 Predict Container Overflow",
      concept: "When liquid is poured from one container to another, the volume of water remains unchanged. Equate the two cylindrical volume formulas.",
      formulaBreakdown: "Volume = π × r² × h",
      stepByStep: [
        "Calculate water volume in the bucket: V = 3.14 × 10² × 10 = 3140 cm³.",
        "Equate to new vessel: Volume = 3.14 × 5² × h = 78.5 × h.",
        "Solve for height (h): 78.5 × h = 3140 ⇒ h = 40 cm."
      ],
      visualTip: "Watch the water level rise in the narrow cylindrical vessel as you enter the height!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Bucket: radius (r1) = 10cm, height (h1) = 10cm" },
      { lineNum: 3, textBefore: "  Vessel: radius (r2) = 5cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of water in bucket (V1)" },
      { lineNum: 6, textBefore: "  V1 = 3.14 × 10² × 10" },
      { lineNum: 7, textBefore: "  V1 = ", hasInput: true, inputIndex: 0, correctAnswer: "3140", placeholder: "V1", textAfter: " cm³", widthChars: 6 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Equate to vessel volume and solve for h" },
      { lineNum: 10, textBefore: "  Volume of Vessel = Volume of Bucket" },
      { lineNum: 11, textBefore: "  3.14 × 5² × h = 3140" },
      { lineNum: 12, textBefore: "  78.5 × h = 3140" },
      { lineNum: 13, textBefore: "  h = ", hasInput: true, inputIndex: 1, correctAnswer: "40", placeholder: "h", textAfter: " cm", widthChars: 4 }
    ]
  },
  "lvl-15": {
    id: "lvl-15",
    question: "Water in a conical cup of radius 6cm and height 12cm is poured into a cylindrical beaker of radius 4cm. Find the height (h) of water level in the beaker.",
    inputLabel: "Height (h)",
    placeholder: "Type height...",
    correctAnswer: 9,
    tolerance: 0.1,
    calculateValue: (h) => 3.14 * Math.pow(4, 2) * h,
    getDimensionsLabel: (h) => `r = 4, h = ${h.toFixed(1)}`,
    formulaDisplay: "V_cylinder = V_cone",
    bookPage: {
      title: "📖 Liquid Transfer: Cone to Cylinder",
      concept: "Equating the volume of a cone to the volume of a cylinder allows us to calculate how high the liquid will stack in the flat-sided beaker.",
      formulaBreakdown: "1/3 × π × r_cone² × h_cone = π × r_cyl² × h_cyl",
      stepByStep: [
        "Volume of cone = 1/3 × π × 6² × 12 = 144π cubic units.",
        "Volume of cylinder = π × 4² × h = 16π × h.",
        "Set them equal: 16π × h = 144π. Cancel π: 16 × h = 144.",
        "Divide by 16: h = 9 cm."
      ],
      visualTip: "Watch liquid drain from the cone funnel and fill the cylindrical beaker!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cone cup: r = 6cm, height = 12cm" },
      { lineNum: 3, textBefore: "  Cylinder beaker: R = 4cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Conical Cup in terms of π" },
      { lineNum: 6, textBefore: "  V_cone = 1/3 × π × 6² × 12" },
      { lineNum: 7, textBefore: "  V_cone = ", hasInput: true, inputIndex: 0, correctAnswer: "144", placeholder: "V", textAfter: " × π cm³", widthChars: 5 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Equate and solve for cylinder height (h)" },
      { lineNum: 10, textBefore: "  π × R² × h = V_cone" },
      { lineNum: 11, textBefore: "  π × 4² × h = 144 × π" },
      { lineNum: 12, textBefore: "  16 × h = 144" },
      { lineNum: 13, textBefore: "  h = ", hasInput: true, inputIndex: 1, correctAnswer: "9", placeholder: "h", textAfter: " cm", widthChars: 4 }
    ]
  },
  "lvl-16": {
    id: "lvl-16",
    question: "Find the volume of a spherical dome of radius 6m. (Use π ≈ 3.14)",
    inputLabel: "Volume (V)",
    placeholder: "Type volume...",
    correctAnswer: 904.32,
    tolerance: 1.0,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(2)}`,
    formulaDisplay: "Volume = 4/3 × π × r³",
    bookPage: {
      title: "📖 Spherical Dome Space",
      concept: "A sphere represents the largest volume a 3D shape can encapsulate for a fixed surface area. Use the standard sphere capacity formula.",
      formulaBreakdown: "Volume = 4/3 × π × r³",
      stepByStep: [
        "Plug in given radius (r = 6m) into the volume formula.",
        "V = 4/3 × 3.14 × 6³ = 4/3 × 3.14 × 216.",
        "Simplify the product: 216 / 3 = 72, then 4 × 72 = 288.",
        "V = 288 × 3.14 = 904.32 cubic meters."
      ],
      visualTip: "Watch the dome sphere inflate to exactly 904.32 units!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Radius of sphere (r) = 6m" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "Step 1: Write down volume formula" },
      { lineNum: 5, textBefore: "  Volume = 4/3 × 3.14 × r³" },
      { lineNum: 6, textBefore: "  Volume = 4/3 × 3.14 × ", hasInput: true, inputIndex: 0, correctAnswer: "216", placeholder: "r³", textAfter: "", widthChars: 5 },
      { lineNum: 7, textBefore: "" },
      { lineNum: 8, textBefore: "Step 2: Calculate final Volume value" },
      { lineNum: 9, textBefore: "  Volume = ", hasInput: true, inputIndex: 1, correctAnswer: "904.32", placeholder: "V", textAfter: " m³", widthChars: 8 }
    ]
  },
  "lvl-17": {
    id: "lvl-17",
    question: "A cylindrical water tower has a capacity of 3140 m³. If the radius is 10m, calculate the Curved Surface Area (CSA) of the tower. (Use π ≈ 3.14)",
    inputLabel: "CSA (A)",
    placeholder: "Type CSA...",
    correctAnswer: 628,
    tolerance: 1.0,
    calculateValue: (csa) => csa,
    getDimensionsLabel: (csa) => `CSA = ${csa.toFixed(1)}`,
    formulaDisplay: "CSA = 2 × π × r × h",
    bookPage: {
      title: "📖 Water Tower Area Optimization",
      concept: "To find surface area when only volume is given, we first use the volume formula to solve for the missing height (h), then apply the curved surface area formula.",
      formulaBreakdown: "Volume = π × r² × h  ⇒  CSA = 2 × π × r × h",
      stepByStep: [
        "First, write down volume equation: 3.14 × 10² × h = 3140.",
        "Simplify base area: 314 × h = 3140 ⇒ h = 10m.",
        "Now, compute curved surface area (CSA) using height = 10m.",
        "CSA = 2 × 3.14 × 10 × 10 = 628 square meters."
      ],
      visualTip: "As height is resolved, the cylindrical wall lights up to highlight the curved surface!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Volume (V) = 3140 m³" },
      { lineNum: 3, textBefore: "  Radius (r) = 10m" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Solve for height (h) using Volume formula" },
      { lineNum: 6, textBefore: "  V = 3.14 × r² × h" },
      { lineNum: 7, textBefore: "  3140 = 3.14 × 10² × h" },
      { lineNum: 8, textBefore: "  3140 = 314 × h" },
      { lineNum: 9, textBefore: "  h = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "h", textAfter: " m", widthChars: 4 },
      { lineNum: 10, textBefore: "" },
      { lineNum: 11, textBefore: "Step 2: Calculate Curved Surface Area (CSA)" },
      { lineNum: 12, textBefore: "  CSA = 2 × 3.14 × r × h" },
      { lineNum: 13, textBefore: "  CSA = 2 × 3.14 × 10 × 10" },
      { lineNum: 14, textBefore: "  CSA = ", hasInput: true, inputIndex: 1, correctAnswer: "628", placeholder: "CSA", textAfter: " m²", widthChars: 5 }
    ]
  },
  "lvl-18": {
    id: "lvl-18",
    question: "A spherical gas storage tank has a radius of 15m. Find its total outer surface area. (Use π ≈ 3.14)",
    inputLabel: "Surface Area",
    placeholder: "Type surface area...",
    correctAnswer: 2826,
    tolerance: 5.0,
    calculateValue: (sa) => sa,
    getDimensionsLabel: (sa) => `Surface Area = ${sa.toFixed(1)}`,
    formulaDisplay: "SA = 4 × π × r²",
    bookPage: {
      title: "📖 Outer Shield",
      concept: "Surface area is crucial for insulation planning. The total outer jacket surface of a sphere relies exclusively on the square of its radius.",
      formulaBreakdown: "Surface Area = 4 × π × r²",
      stepByStep: [
        "Plug in given radius (r = 15m) into the area formula.",
        "SA = 4 × 3.14 × 15² = 12.56 × 225.",
        "Multiply to get final area: SA = 2826 square meters."
      ],
      visualTip: "Watch the sphere wrap with glass insulation panels. Type 2826 to finish!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Radius of sphere (r) = 15m" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "Step 1: Write down surface area formula and substitute" },
      { lineNum: 5, textBefore: "  SA = 4 × 3.14 × r²" },
      { lineNum: 6, textBefore: "  SA = 12.56 × ", hasInput: true, inputIndex: 0, correctAnswer: "225", placeholder: "r²", textAfter: "", widthChars: 5 },
      { lineNum: 7, textBefore: "" },
      { lineNum: 8, textBefore: "Step 2: Calculate total outer Surface Area" },
      { lineNum: 9, textBefore: "  SA = ", hasInput: true, inputIndex: 1, correctAnswer: "2826", placeholder: "SA", textAfter: " m²", widthChars: 6 }
    ]
  },
  "lvl-19": {
    id: "lvl-19",
    question: "A solid toy is in the form of a hemisphere surmounted by a right circular cone. The radius of the hemisphere is 3cm and the height of the cone is 4cm. Find the total volume of the toy. (Use π ≈ 3.14)",
    inputLabel: "Total Volume",
    placeholder: "Type volume...",
    correctAnswer: 94.2,
    tolerance: 0.2,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(1)}`,
    formulaDisplay: "V_toy = V_cone + V_hemisphere",
    bookPage: {
      title: "📖 Toy Maker: Cone + Hemisphere",
      concept: "When solids are combined together, the total Volume is simply the sum of the volumes of all individual parts. Here, we add the cone top and hemisphere base.",
      formulaBreakdown: "Total Volume = V_cone + V_hemisphere = (1/3 × π × r² × h) + (2/3 × π × r³)",
      stepByStep: [
        "Cone Volume = 1/3 × 3.14 × 3² × 4 = 37.68 cm³.",
        "Hemisphere Volume = 2/3 × 3.14 × 3³ = 56.52 cm³.",
        "Total Volume = 37.68 + 56.52 = 94.2 cm³."
      ],
      visualTip: "Watch the cone slide down and weld with the hemisphere base to form the completed toy!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Common radius (r) = 3cm" },
      { lineNum: 3, textBefore: "  Height of cone part (h) = 4cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cone part (V_cone)" },
      { lineNum: 6, textBefore: "  V_cone = 1/3 × 3.14 × 3² × 4" },
      { lineNum: 7, textBefore: "  V_cone = ", hasInput: true, inputIndex: 0, correctAnswer: "37.68", placeholder: "V_cone", textAfter: " cm³", widthChars: 6 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of Hemisphere part (V_hemi)" },
      { lineNum: 10, textBefore: "  V_hemi = 2/3 × 3.14 × 3³" },
      { lineNum: 11, textBefore: "  V_hemi = ", hasInput: true, inputIndex: 1, correctAnswer: "56.52", placeholder: "V_hemi", textAfter: " cm³", widthChars: 6 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Sum the volumes for Total Volume (V_total)" },
      { lineNum: 14, textBefore: "  V_total = 37.68 + 56.52" },
      { lineNum: 15, textBefore: "  V_total = ", hasInput: true, inputIndex: 2, correctAnswer: "94.2", placeholder: "V_total", textAfter: " cm³", widthChars: 5 }
    ]
  },
  "lvl-20": {
    id: "lvl-20",
    question: "A space capsule is in the shape of a cylinder of radius 3m and height 10m, with hemispherical caps of the same radius at both ends. Find the total volume of the capsule. (Use π ≈ 3.14)",
    inputLabel: "Capsule Volume",
    placeholder: "Type volume...",
    correctAnswer: 395.64,
    tolerance: 1.0,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(2)}`,
    formulaDisplay: "V_capsule = V_cylinder + V_sphere",
    bookPage: {
      title: "📖 Constructing Space Capsules",
      concept: "A cylinder with two identical hemispherical caps on both ends forms a capsules. Adding two hemispheres of radius r is mathematically identical to adding one full sphere of radius r.",
      formulaBreakdown: "V = V_cylinder + 2 × V_hemisphere = (π × r² × h) + (4/3 × π × r³)",
      stepByStep: [
        "Cylinder Volume = 3.14 × 3² × 10 = 282.6 m³.",
        "Sphere Volume (2 caps) = 4/3 × 3.14 × 3³ = 113.04 m³.",
        "Total Volume = 282.6 + 113.04 = 395.64 m³."
      ],
      visualTip: "Watch the two hemispherical caps attach to the top and bottom of the cylinder!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cylinder: radius (r) = 3m, height (h) = 10m" },
      { lineNum: 3, textBefore: "  Caps: two hemispheres of radius (r) = 3m" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cylinder part (V_cyl)" },
      { lineNum: 6, textBefore: "  V_cyl = 3.14 × 3² × 10" },
      { lineNum: 7, textBefore: "  V_cyl = ", hasInput: true, inputIndex: 0, correctAnswer: "282.6", placeholder: "V_cyl", textAfter: " m³", widthChars: 6 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of two hemispherical caps (V_sphere)" },
      { lineNum: 10, textBefore: "  V_sphere = 4/3 × 3.14 × 3³" },
      { lineNum: 11, textBefore: "  V_sphere = ", hasInput: true, inputIndex: 1, correctAnswer: "113.04", placeholder: "V_sphere", textAfter: " m³", widthChars: 7 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Calculate Total Volume (V_total)" },
      { lineNum: 14, textBefore: "  V_total = 282.6 + 113.04" },
      { lineNum: 15, textBefore: "  V_total = ", hasInput: true, inputIndex: 2, correctAnswer: "395.64", placeholder: "V_total", textAfter: " m³", widthChars: 7 }
    ]
  },
  "lvl-21": {
    id: "lvl-21",
    question: "A chemical test tube consists of a cylindrical body of radius 2cm and height 10cm, with a hemispherical bottom of the same radius. Calculate its total capacity (volume). (Use π ≈ 3.14)",
    inputLabel: "Capacity (V)",
    placeholder: "Type volume...",
    correctAnswer: 142.35,
    tolerance: 0.5,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(2)}`,
    formulaDisplay: "V_total = V_cylinder + V_hemisphere",
    bookPage: {
      title: "📖 Scientific Test Tube Capacity",
      concept: "A classic NCERT laboratory question: adding the cylindrical fluid channel and the rounded hemispherical bottom container.",
      formulaBreakdown: "V = (π × r² × h) + (2/3 × π × r³)",
      stepByStep: [
        "Cylinder part volume = 3.14 × 2² × 10 = 125.6 cm³.",
        "Hemispherical cap volume = 2/3 × 3.14 × 2³ = 16.75 cm³.",
        "Total Volume = 125.6 + 16.75 = 142.35 cm³."
      ],
      visualTip: "Watch the test tube fill with vibrant golden reagent chemistry!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Radius (r) = 2cm" },
      { lineNum: 3, textBefore: "  Cylindrical part height (h) = 10cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cylinder part (V_cyl)" },
      { lineNum: 6, textBefore: "  V_cyl = 3.14 × 2² × 10" },
      { lineNum: 7, textBefore: "  V_cyl = ", hasInput: true, inputIndex: 0, correctAnswer: "125.6", placeholder: "V_cyl", textAfter: " cm³", widthChars: 6 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of Hemispherical bottom (V_hemi)" },
      { lineNum: 10, textBefore: "  V_hemi = 2/3 × 3.14 × 2³" },
      { lineNum: 11, textBefore: "  V_hemi = ", hasInput: true, inputIndex: 1, correctAnswer: "16.75", placeholder: "V_hemi", textAfter: " cm³", widthChars: 6 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Calculate Total Capacity (V_total)" },
      { lineNum: 14, textBefore: "  V_total = 125.6 + 16.75" },
      { lineNum: 15, textBefore: "  V_total = ", hasInput: true, inputIndex: 2, correctAnswer: "142.35", placeholder: "V_total", textAfter: " cm³", widthChars: 7 }
    ]
  },
  "lvl-22": {
    id: "lvl-22",
    question: "A castle tower is in the shape of a cylinder surmounted by a cone. The common radius is 6m. The cylinder height is 10m, and the cone height is 3m. Find the total volume of the tower. (Use π ≈ 3.14)",
    inputLabel: "Tower Volume",
    placeholder: "Type volume...",
    correctAnswer: 1243.44,
    tolerance: 2.0,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(2)}`,
    formulaDisplay: "V_tower = V_cylinder + V_cone",
    bookPage: {
      title: "📖 The Castle Tower Roof",
      concept: "To build a castle tower structure, add the main cylindrical column volume to the conical roof peak volume.",
      formulaBreakdown: "V = (π × r² × H) + (1/3 × π × r² × h)",
      stepByStep: [
        "Cylinder base column = 3.14 × 6² × 10 = 1130.4 m³.",
        "Cone roof spire = 1/3 × 3.14 × 6² × 3 = 113.04 m³.",
        "Total Volume = 1130.4 + 113.04 = 1243.44 m³."
      ],
      visualTip: "Watch the conical spire drop onto the tower column and align perfectly!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Radius (r) = 6m" },
      { lineNum: 3, textBefore: "  Cylinder height (H) = 10m, Cone height (h) = 3m" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cylindrical Column (V_cyl)" },
      { lineNum: 6, textBefore: "  V_cyl = 3.14 × 6² × 10" },
      { lineNum: 7, textBefore: "  V_cyl = ", hasInput: true, inputIndex: 0, correctAnswer: "1130.4", placeholder: "V_cyl", textAfter: " m³", widthChars: 7 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of Conical Spire (V_cone)" },
      { lineNum: 10, textBefore: "  V_cone = 1/3 × 3.14 × 6² × 3" },
      { lineNum: 11, textBefore: "  V_cone = ", hasInput: true, inputIndex: 1, correctAnswer: "113.04", placeholder: "V_cone", textAfter: " m³", widthChars: 7 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Calculate Total Tower Volume (V_total)" },
      { lineNum: 14, textBefore: "  V_total = 1130.4 + 113.04" },
      { lineNum: 15, textBefore: "  V_total = ", hasInput: true, inputIndex: 2, correctAnswer: "1243.44", placeholder: "V_total", textAfter: " m³", widthChars: 8 }
    ]
  },
  "lvl-23": {
    id: "lvl-23",
    question: "A robot's head consists of a large cuboid block of size 10cm × 8cm × 6cm, with a small cube sensor of side 3cm attached to the top. Find the total volume of the head.",
    inputLabel: "Head Volume",
    placeholder: "Type volume...",
    correctAnswer: 507,
    tolerance: 1.0,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(1)}`,
    formulaDisplay: "V_total = V_cuboid + V_cube",
    bookPage: {
      title: "📖 Assembling Robot Sensors",
      concept: "Adding orthogonal prismatic blocks is the easiest combination shape to calculate. Just add the volume of the rectangular block and the cube block.",
      formulaBreakdown: "V = (l × w × h) + s³",
      stepByStep: [
        "Cuboid volume = 10 × 8 × 6 = 480 cm³.",
        "Cube sensor volume = 3³ = 27 cm³.",
        "Total Volume = 480 + 27 = 507 cm³."
      ],
      visualTip: "Watch the small cube click onto the large cuboid head base!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cuboid dimensions = 10cm × 8cm × 6cm" },
      { lineNum: 3, textBefore: "  Cube side length = 3cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cuboid base (V_cuboid)" },
      { lineNum: 6, textBefore: "  V_cuboid = 10 × 8 × 6" },
      { lineNum: 7, textBefore: "  V_cuboid = ", hasInput: true, inputIndex: 0, correctAnswer: "480", placeholder: "V_cuboid", textAfter: " cm³", widthChars: 5 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of Cube top (V_cube)" },
      { lineNum: 10, textBefore: "  V_cube = 3³" },
      { lineNum: 11, textBefore: "  V_cube = ", hasInput: true, inputIndex: 1, correctAnswer: "27", placeholder: "V_cube", textAfter: " cm³", widthChars: 4 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Calculate Total Volume (V_total)" },
      { lineNum: 14, textBefore: "  V_total = 480 + 27" },
      { lineNum: 15, textBefore: "  V_total = ", hasInput: true, inputIndex: 2, correctAnswer: "507", placeholder: "V_total", textAfter: " cm³", widthChars: 4 }
    ]
  },
  "lvl-24": {
    id: "lvl-24",
    question: "A temple structure has a cuboid base of size 12m × 10m × 5m, surmounted by a pyramid shikhara of height 6m with the same rectangular base. Find the total volume of the temple.",
    inputLabel: "Temple Volume",
    placeholder: "Type volume...",
    correctAnswer: 840,
    tolerance: 2.0,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(1)}`,
    formulaDisplay: "V_total = V_cuboid + V_pyramid",
    bookPage: {
      title: "📖 Temple Pyramid Volumes",
      concept: "A pyramid's volume is exactly 1/3 of a cuboid sharing the same base area and height. Add both parts to get total space.",
      formulaBreakdown: "V = (Length × Width × Height) + (1/3 × Base Area × Pyramid Height)",
      stepByStep: [
        "Cuboid Base Volume = 12 × 10 × 5 = 600 m³.",
        "Pyramid Shikhara Volume = 1/3 × (12 × 10) × 6 = 240 m³.",
        "Total Volume = 600 + 240 = 840 m³."
      ],
      visualTip: "Watch the pyramid cap align and rest beautifully on the cuboid hall!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cuboid size = 12m × 10m × 5m" },
      { lineNum: 3, textBefore: "  Pyramid height (h) = 6m" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cuboid base (V_base)" },
      { lineNum: 6, textBefore: "  V_base = 12 × 10 × 5" },
      { lineNum: 7, textBefore: "  V_base = ", hasInput: true, inputIndex: 0, correctAnswer: "600", placeholder: "V_base", textAfter: " m³", widthChars: 5 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of Pyramid spire (V_spire)" },
      { lineNum: 10, textBefore: "  V_spire = 1/3 × (12 × 10) × 6" },
      { lineNum: 11, textBefore: "  V_spire = ", hasInput: true, inputIndex: 1, correctAnswer: "240", placeholder: "V_spire", textAfter: " m³", widthChars: 5 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Calculate Total Structure Volume (V_total)" },
      { lineNum: 14, textBefore: "  V_total = 600 + 240" },
      { lineNum: 15, textBefore: "  V_total = ", hasInput: true, inputIndex: 2, correctAnswer: "840", placeholder: "V_total", textAfter: " m³", widthChars: 4 }
    ]
  },
  "lvl-25": {
    id: "lvl-25",
    question: "A solid metal sphere of radius 3 units is melted and recast into a cylinder of radius 2 units. Find the height (h) of the recast cylinder. (Use π ≈ 3.14)",
    inputLabel: "Height (h)",
    placeholder: "Type height...",
    correctAnswer: 9,
    tolerance: 0.1,
    calculateValue: (h) => 3.14 * Math.pow(2, 2) * h,
    getDimensionsLabel: (h) => `r = 2, h = ${h.toFixed(1)}`,
    formulaDisplay: "Volume of Cylinder = Volume of Sphere",
    bookPage: {
      title: "📖 The Recasting Forge",
      concept: "When one solid shape is melted and recast into another, the total Volume remains perfectly conserved (constant). Therefore: Volume of Cylinder = Volume of Sphere.",
      formulaBreakdown: "Volume = π × R² × h  (Cylinder) = 4/3 × π × r³  (Sphere)",
      stepByStep: [
        "Write the conservation equation: Volume of Cylinder = Volume of Sphere.",
        "Calculate the Volume of the solid metal sphere: V_sphere = 4/3 × 3.14 × 3³ = 113.04 cubic units.",
        "Equate this to the cylinder volume formula: 3.14 × 2² × h = 113.04.",
        "Simplify the cylinder coefficient: 12.56 × h = 113.04.",
        "Divide 113.04 by 12.56 to find the height: h = 9 units."
      ],
      visualTip: "Complete the Board Exam Answer Sheet on the left to watch the sphere melt and pour into the cylinder mold!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Radius of sphere (r) = 3 units" },
      { lineNum: 3, textBefore: "  Radius of cylinder (R) = 2 units" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Let the height of the recast cylinder be h." },
      { lineNum: 6, textBefore: "" },
      { lineNum: 7, textBefore: "Since the sphere is melted and recast:" },
      { lineNum: 8, textBefore: "  Volume of Cylinder = Volume of Sphere" },
      { lineNum: 9, textBefore: "  π × R² × h = 4/3 × π × r³" },
      { lineNum: 10, textBefore: "" },
      { lineNum: 11, textBefore: "Step 1: Calculate Volume of Sphere (V_sphere)" },
      { lineNum: 12, textBefore: "  V_sphere = 4/3 × 3.14 × 3³" },
      { lineNum: 13, textBefore: "  V_sphere = ", hasInput: true, inputIndex: 0, correctAnswer: "113.04", placeholder: "V_sphere", textAfter: " units³", widthChars: 8 },
      { lineNum: 14, textBefore: "" },
      { lineNum: 15, textBefore: "Step 2: Equate and solve for Cylinder Height (h)" },
      { lineNum: 16, textBefore: "  3.14 × 2² × h = 113.04" },
      { lineNum: 17, textBefore: "  12.56 × h = 113.04" },
      { lineNum: 18, textBefore: "  h = ", hasInput: true, inputIndex: 1, correctAnswer: "9", placeholder: "h", textAfter: " units", widthChars: 4 }
    ]
  },
  "lvl-26": {
    id: "lvl-26",
    question: "A solid metallic cube of edge 22cm is melted and recast into small spherical balls of radius 1cm. Find the number of spherical balls that can be made. (Use π = 22/7)",
    inputLabel: "Spherical Balls (N)",
    placeholder: "Type number...",
    correctAnswer: 2541,
    tolerance: 1.0,
    calculateValue: (n) => n,
    getDimensionsLabel: (n) => `Balls: ${n}`,
    formulaDisplay: "N = V_cube / V_sphere",
    bookPage: {
      title: "📖 Cube to Sphere Recasting",
      concept: "Melt a large metallic cube and reshape it into a set of small identical sphere balls. Setting up equations with fraction π = 22/7 simplifies calculations perfectly.",
      formulaBreakdown: "Number of spheres = Volume of Cube / Volume of 1 Sphere",
      stepByStep: [
        "Calculate the Volume of the solid cube: V_cube = 22³ = 10648 cm³.",
        "Calculate the Volume of one small sphere (radius r = 1cm): V_sphere = 4/3 × 22/7 × 1³ = 88/21 cm³.",
        "Divide cube volume by sphere volume: N = 10648 / (88/21) = 10648 × 21 / 88 = 121 × 21 = 2541 spherical balls."
      ],
      visualTip: "Watch the metal cube melt into liquid and form thousands of small spheres!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cube edge (a) = 22cm" },
      { lineNum: 3, textBefore: "  Sphere radius (r) = 1cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of metal cube (V_cube)" },
      { lineNum: 6, textBefore: "  V_cube = a³ = 22³" },
      { lineNum: 7, textBefore: "  V_cube = ", hasInput: true, inputIndex: 0, correctAnswer: "10648", placeholder: "V_cube", textAfter: " cm³", widthChars: 6 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of one sphere using π = 22/7 (V_sphere)" },
      { lineNum: 10, textBefore: "  V_sphere = 4/3 × 22/7 × 1³" },
      { lineNum: 11, textBefore: "  V_sphere = 88 / 21 = ", hasInput: true, inputIndex: 1, correctAnswer: "4.19", placeholder: "V_sphere", textAfter: " cm³", widthChars: 5 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Solve for total number of sphere balls (N)" },
      { lineNum: 14, textBefore: "  N = V_cube / V_sphere = 10648 / (88/21)" },
      { lineNum: 15, textBefore: "  N = 121 × 21" },
      { lineNum: 16, textBefore: "  N = ", hasInput: true, inputIndex: 2, correctAnswer: "2541", placeholder: "N", textAfter: " balls", widthChars: 6 }
    ]
  },
  "lvl-27": {
    id: "lvl-27",
    question: "A solid cylindrical metal rod of radius 6cm and height 8cm is melted and recast into small solid cones of radius 2cm and height 4cm. Find the number of cones that can be made.",
    inputLabel: "Number of Cones (N)",
    placeholder: "Type cones...",
    correctAnswer: 54,
    tolerance: 1.0,
    calculateValue: (n) => n,
    getDimensionsLabel: (n) => `Cones: ${n}`,
    formulaDisplay: "N = V_cylinder / V_cone",
    bookPage: {
      title: "📖 Recasting Rods to Cones",
      concept: "A rod cylinder is melted down. Because the material doesn't change, its initial cylindrical volume equals the sum of all individual conical mold volumes.",
      formulaBreakdown: "Number of cones = Volume of Cylinder / Volume of 1 Cone",
      stepByStep: [
        "Volume of Cylindrical Rod = π × R² × H = π × 6² × 8 = 288π cm³.",
        "Volume of 1 Conical Mold = 1/3 × π × r² × h = 1/3 × π × 2² × 4 = 16/3 × π cm³.",
        "Divide total volume by cone volume: N = 288π / (16/3 π) = 288 × 3 / 16 = 54 cones."
      ],
      visualTip: "Watch the rod expand, melt, and fill the row of 54 conical molds!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cylinder: radius (R) = 6cm, height (H) = 8cm" },
      { lineNum: 3, textBefore: "  Cone: radius (r) = 2cm, height (h) = 4cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cylindrical Rod in terms of π" },
      { lineNum: 6, textBefore: "  V_cyl = π × R² × H" },
      { lineNum: 7, textBefore: "  V_cyl = ", hasInput: true, inputIndex: 0, correctAnswer: "288", placeholder: "V_cyl", textAfter: " × π cm³", widthChars: 5 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of 1 Cone in terms of π" },
      { lineNum: 10, textBefore: "  V_cone = 1/3 × π × r² × h = 16/3 × π" },
      { lineNum: 11, textBefore: "  V_cone = ", hasInput: true, inputIndex: 1, correctAnswer: "5.33", placeholder: "V_cone", textAfter: " × π cm³", widthChars: 5 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Solve for total number of recast cones (N)" },
      { lineNum: 14, textBefore: "  N = V_cyl / V_cone = 288 / (16/3)" },
      { lineNum: 15, textBefore: "  N = 18 × 3" },
      { lineNum: 16, textBefore: "  N = ", hasInput: true, inputIndex: 2, correctAnswer: "54", placeholder: "N", textAfter: " cones", widthChars: 4 }
    ]
  },
  "lvl-28": {
    id: "lvl-28",
    question: "A goldsmith melts a cuboid gold bar of dimensions 15cm × 10cm × 8cm to make small solid cubes of edge 2cm. How many such cubes can be formed?",
    inputLabel: "Number of Cubes (N)",
    placeholder: "Type cubes...",
    correctAnswer: 150,
    tolerance: 1.0,
    calculateValue: (n) => n,
    getDimensionsLabel: (n) => `Cubes: ${n}`,
    formulaDisplay: "N = V_cuboid / V_cube",
    bookPage: {
      title: "📖 Goldsmith's Reshaping Forge",
      concept: "A block of metal is reshaped into small identical cubes. Set up the volumetric ratio to find how many whole cubes can be recast.",
      formulaBreakdown: "N = Volume of Cuboid Bar / Volume of 1 Cube",
      stepByStep: [
        "Calculate the Volume of the solid rectangular gold bar: V1 = l × w × h = 15 × 10 × 8 = 1200 cm³.",
        "Calculate the Volume of one small recast cube: V2 = s³ = 2³ = 8 cm³.",
        "Divide to find number of cubes: N = 1200 / 8 = 150 cubes."
      ],
      visualTip: "Watch the massive gold bar dissolve into a neat matrix of 150 gold blocks!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cuboid gold bar size = 15cm × 10cm × 8cm" },
      { lineNum: 3, textBefore: "  Cube edge (s) = 2cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of gold bar (V_cuboid)" },
      { lineNum: 6, textBefore: "  V_cuboid = 15 × 10 × 8" },
      { lineNum: 7, textBefore: "  V_cuboid = ", hasInput: true, inputIndex: 0, correctAnswer: "1200", placeholder: "V_cuboid", textAfter: " cm³", widthChars: 5 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of 1 recast cube (V_cube)" },
      { lineNum: 10, textBefore: "  V_cube = 2³" },
      { lineNum: 11, textBefore: "  V_cube = ", hasInput: true, inputIndex: 1, correctAnswer: "8", placeholder: "V_cube", textAfter: " cm³", widthChars: 4 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Solve for number of gold cubes formed (N)" },
      { lineNum: 14, textBefore: "  N = V_cuboid / V_cube = 1200 / 8" },
      { lineNum: 15, textBefore: "  N = ", hasInput: true, inputIndex: 2, correctAnswer: "150", placeholder: "N", textAfter: " cubes", widthChars: 4 }
    ]
  },
  "lvl-29": {
    id: "lvl-29",
    question: "Liquid from a cylindrical container of radius 6cm and height 12cm is poured to fill spherical flasks of radius 3cm. Find the number of spherical flasks that can be filled.",
    inputLabel: "Number of Flasks (N)",
    placeholder: "Type flasks...",
    correctAnswer: 12,
    tolerance: 1.0,
    calculateValue: (n) => n,
    getDimensionsLabel: (n) => `Flasks: ${n}`,
    formulaDisplay: "N = V_cyl / V_sphere",
    bookPage: {
      title: "📖 Potion Transfer multi-step",
      concept: "Pour fluid from a giant cylindrical barrel into sphere flask bottles. The total volume remains conserved, allowing us to find the flask count easily.",
      formulaBreakdown: "Number of flasks = Volume of Cylinder / Volume of 1 Sphere",
      stepByStep: [
        "Volume of Cylinder Container = π × R² × H = π × 6² × 12 = 432π cm³.",
        "Volume of 1 Spherical Flask = 4/3 × π × r³ = 4/3 × π × 3³ = 36π cm³.",
        "Divide barrel volume by flask volume: N = 432π / 36π = 12 flasks."
      ],
      visualTip: "Watch the potion drain and fill exactly 12 small spherical flask containers!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Cylinder barrel: radius (R) = 6cm, height (H) = 12cm" },
      { lineNum: 3, textBefore: "  Spherical flask: radius (r) = 3cm" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cylindrical Barrel in terms of π" },
      { lineNum: 6, textBefore: "  V_cyl = π × R² × H = π × 36 × 12" },
      { lineNum: 7, textBefore: "  V_cyl = ", hasInput: true, inputIndex: 0, correctAnswer: "432", placeholder: "V_cyl", textAfter: " × π cm³", widthChars: 5 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of 1 Sphere Flask in terms of π" },
      { lineNum: 10, textBefore: "  V_sphere = 4/3 × π × r³ = 4/3 × π × 27" },
      { lineNum: 11, textBefore: "  V_sphere = ", hasInput: true, inputIndex: 1, correctAnswer: "36", placeholder: "V_sphere", textAfter: " × π cm³", widthChars: 4 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Solve for total number of flasks filled (N)" },
      { lineNum: 14, textBefore: "  N = V_cyl / V_sphere = 432 × π / (36 × π)" },
      { lineNum: 15, textBefore: "  N = 432 / 36" },
      { lineNum: 16, textBefore: "  N = ", hasInput: true, inputIndex: 2, correctAnswer: "12", placeholder: "N", textAfter: " flasks", widthChars: 4 }
    ]
  },
  "lvl-30": {
    id: "lvl-30",
    question: "An engineering model consists of a cylinder of radius 3m and height 10m, surmounted by a cone of height 4m at the top, and a hemispherical cap of radius 3m at the bottom. Find the total volume of this complex solid structure. (Use π ≈ 3.14)",
    inputLabel: "Total Volume",
    placeholder: "Type volume...",
    correctAnswer: 376.8,
    tolerance: 1.0,
    calculateValue: (v) => v,
    getDimensionsLabel: (v) => `Volume = ${v.toFixed(2)}`,
    formulaDisplay: "V_total = V_cyl + V_cone + V_hemi",
    bookPage: {
      title: "📖 FINAL BOSS: Mega engineering puzzle",
      concept: "Mastery of all shapes combined! Calculate the cylindrical column center, the conical top, and the hemispherical base, and sum them together.",
      formulaBreakdown: "V_total = V_cylinder + V_cone + V_hemisphere",
      stepByStep: [
        "Volume of Cylinder Column = 3.14 × 3² × 10 = 282.6 m³.",
        "Volume of Conical Roof Spire = 1/3 × 3.14 × 3² × 4 = 37.68 m³.",
        "Volume of Hemispherical Base Cap = 2/3 × 3.14 × 3³ = 56.52 m³.",
        "Sum all three volumes: V = 282.6 + 37.68 + 56.52 = 376.8 cubic meters."
      ],
      visualTip: "Watch the three components fly in, assemble, weld, and fill with golden victory glow!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given:" },
      { lineNum: 2, textBefore: "  Common radius of all parts (r) = 3m" },
      { lineNum: 3, textBefore: "  Cylinder height (H) = 10m, Cone height (h) = 4m" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Step 1: Calculate Volume of Cylindrical center (V_cyl)" },
      { lineNum: 6, textBefore: "  V_cyl = 3.14 × 3² × 10" },
      { lineNum: 7, textBefore: "  V_cyl = ", hasInput: true, inputIndex: 0, correctAnswer: "282.6", placeholder: "V_cyl", textAfter: " m³", widthChars: 6 },
      { lineNum: 8, textBefore: "" },
      { lineNum: 9, textBefore: "Step 2: Calculate Volume of Conical top spire (V_cone)" },
      { lineNum: 10, textBefore: "  V_cone = 1/3 × 3.14 × 3² × 4" },
      { lineNum: 11, textBefore: "  V_cone = ", hasInput: true, inputIndex: 1, correctAnswer: "37.68", placeholder: "V_cone", textAfter: " m³", widthChars: 6 },
      { lineNum: 12, textBefore: "" },
      { lineNum: 13, textBefore: "Step 3: Calculate Volume of Hemispherical bottom cap (V_hemi)" },
      { lineNum: 14, textBefore: "  V_hemi = 2/3 × 3.14 × 3³" },
      { lineNum: 15, textBefore: "  V_hemi = ", hasInput: true, inputIndex: 2, correctAnswer: "56.52", placeholder: "V_hemi", textAfter: " m³", widthChars: 6 },
      { lineNum: 16, textBefore: "" },
      { lineNum: 19, textBefore: "  V_total = ", hasInput: true, inputIndex: 3, correctAnswer: "376.8", placeholder: "V_total", textAfter: " m³", widthChars: 6 }
    ]
  }
};

export default surfaceAreaVolumeSpecs;
