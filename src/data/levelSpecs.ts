export interface BookPage {
  title: string;
  concept: string;
  formulaBreakdown: string;
  stepByStep: string[];
  visualTip: string;
}

export interface LevelSpecification {
  id: string;
  question: string;
  inputLabel: string;
  placeholder: string;
  correctAnswer: number;
  tolerance: number;
  calculateValue: (input: number) => number;
  getDimensionsLabel: (input: number) => string;
  formulaDisplay: string;
  bookPage: BookPage;
}

const defaultBookPage = (title: string, shape: string, formula: string, target: number, correctAns: number, inputName: string): BookPage => ({
  title: title,
  concept: `Volume / Surface Area of a ${shape} measures its three-dimensional capacity or outer boundary. In this challenge, your goal is to find the exact ${inputName} that achieves our target.`,
  formulaBreakdown: `Formula: ${formula}`,
  stepByStep: [
    `Identify the target value required: ${target}.`,
    `Apply the mathematical formula for the shape.`,
    `Substitute the given values into the equation.`,
    `Solve the equation to find the unknown ${inputName}.`,
    `Hint: The correct ${inputName} is exactly ${correctAns}!`
  ],
  visualTip: `Type ${correctAns} into the input to see the shape perfectly fit the target size!`
});

const specs: Record<string, LevelSpecification> = {
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
};

export const getLevelSpec = (levelId: string, levelData?: any): LevelSpecification => {
  if (specs[levelId]) return specs[levelId];
  
  // Dynamic fallback for levels lvl-13 to lvl-30
  const target = levelData?.targetValue || 1000;
  const shape = levelData?.shape || 'cube';
  const type = levelData?.type || 'volume';
  
  let correctAns = 10;
  let formula = "Volume = s³";
  let inputLabel = "Edge Length (s)";
  let calcFn = (s: number) => Math.pow(s, 3);
  let dimLabel = (s: number) => `side (s) = ${s.toFixed(1)}`;
  
  if (shape.includes('cylinder')) {
    correctAns = 10;
    formula = "Volume = π × r² × h";
    inputLabel = "Height (h)";
    calcFn = (h: number) => 3.14 * 100 * h;
    dimLabel = (h: number) => `r = 10, h = ${h.toFixed(1)}`;
  } else if (shape.includes('sphere')) {
    correctAns = 10;
    formula = "Volume = 4/3 × π × r³";
    inputLabel = "Radius (r)";
    calcFn = (r: number) => (4/3) * 3.14 * Math.pow(r, 3);
    dimLabel = (r: number) => `radius (r) = ${r.toFixed(1)}`;
  } else if (shape.includes('cuboid')) {
    correctAns = 10;
    formula = "Volume = l × w × h";
    inputLabel = "Height (h)";
    calcFn = (h: number) => 10 * 10 * h;
    dimLabel = (h: number) => `l = 10, w = 10, h = ${h.toFixed(1)}`;
  } else if (shape.includes('cone')) {
    correctAns = 10;
    formula = "Volume = 1/3 × π × r² × h";
    inputLabel = "Height (h)";
    calcFn = (h: number) => (1/3) * 3.14 * 100 * h;
    dimLabel = (h: number) => `r = 10, h = ${h.toFixed(1)}`;
  }

  // Calculate correctAnswer based on target value
  // Simple square/cube root solver
  if (shape.includes('cube')) {
    correctAns = Math.round(Math.cbrt(target));
  } else if (shape.includes('sphere')) {
    correctAns = Math.round(Math.cbrt((target * 3) / (4 * 3.14)));
  } else if (shape.includes('cylinder') && type === 'volume') {
    correctAns = Math.round(target / 314);
  } else if (shape.includes('cone') && type === 'volume') {
    correctAns = Math.round(target / 104.7);
  } else {
    correctAns = 10;
  }

  if (correctAns <= 0) correctAns = 10;

  return {
    id: levelId,
    question: `Adjust the ${inputLabel.toLowerCase()} of the ${shape} so that its ${type.replace('_', ' ')} reaches exactly ${target} units.`,
    inputLabel,
    placeholder: `Type ${inputLabel.toLowerCase()}...`,
    correctAnswer: correctAns,
    tolerance: Math.max(1, target * 0.05),
    calculateValue: calcFn,
    getDimensionsLabel: dimLabel,
    formulaDisplay: formula,
    bookPage: defaultBookPage(
      `📖 Chapter: ${levelData?.title || 'Advanced Masterclass'}`,
      shape,
      formula,
      target,
      correctAns,
      inputLabel
    )
  };
};
