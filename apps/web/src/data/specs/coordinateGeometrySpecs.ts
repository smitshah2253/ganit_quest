import type { LevelSpecification } from '../levelSpecs';

const coordinateGeometrySpecs: Record<string, LevelSpecification> = {
  "lvl-cg-01": {
    id: "lvl-cg-01",
    question: "Plot the robot at coordinate point A(4, 3) on the graph. Enter the distance of this point from the Y-axis.",
    inputLabel: "Distance from Y-axis",
    placeholder: "Type distance (x-coordinate)...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x = ${val}`,
    formulaDisplay: "Distance from Y-axis = |x|",
    targetCoord: { x: 4, y: 3 },
    points: [{ x: 0, y: 0, label: "Robot", draggable: true }],
    bookPage: {
      title: "📖 Coordinates of a Point",
      concept: "For any point P(x, y), its perpendicular distance from the y-axis is its x-coordinate (abscissa), and its perpendicular distance from the x-axis is its y-coordinate (ordinate).",
      formulaBreakdown: "Distance from Y-axis = x, Distance from X-axis = y",
      stepByStep: [
        "Find the point on the grid from the question.",
        "The horizontal displacement from the origin along the X-axis is the x-coordinate.",
        "The vertical displacement along the Y-axis is the y-coordinate.",
        "The perpendicular distance to the Y-axis is the horizontal offset."
      ],
      visualTip: "Drag the Robot node on the screen to the target point and watch it snap! The input will auto-update!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given point: P(4, 3)" },
      { lineNum: 2, textBefore: "Here, x-coordinate (abscissa) = 4" },
      { lineNum: 3, textBefore: "and y-coordinate (ordinate) = 3" },
      { lineNum: 4, textBefore: "" },
      { lineNum: 5, textBefore: "Formula: Perpendicular distance from Y-axis = |x|" },
      { lineNum: 6, textBefore: "Hence, distance from Y-axis = |4| = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "x", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-02": {
    id: "lvl-cg-02",
    question: "Plot the surveyor probe at point B(-5, 6). Enter its distance from the X-axis.",
    inputLabel: "Distance from X-axis",
    placeholder: "Type distance (y-coordinate)...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `y = ${val}`,
    formulaDisplay: "Distance from X-axis = |y|",
    targetCoord: { x: -5, y: 6 },
    points: [{ x: 0, y: 0, label: "Probe", draggable: true }],
    bookPage: {
      title: "📖 Ordinates and Offsets",
      concept: "The y-coordinate represents a point's vertical offset. The perpendicular distance from the X-axis is always the absolute value of the y-coordinate.",
      formulaBreakdown: "Distance from X-axis = |y|",
      stepByStep: [
        "Plot the point in the appropriate quadrant.",
        "The y-coordinate of the point is the vertical coordinate.",
        "The absolute value of the y-coordinate represents vertical displacement.",
        "This represents its vertical displacement from the horizontal x-axis."
      ],
      visualTip: "Drag the probe to the target point. Notice how the projection drops down to the x-axis!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given point: B(-5, 6)" },
      { lineNum: 2, textBefore: "Ordinate (y-coordinate) = 6" },
      { lineNum: 3, textBefore: "Perpendicular distance from X-axis = |ordinate|" },
      { lineNum: 4, textBefore: "Distance from X-axis = |6| = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "y", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-03": {
    id: "lvl-cg-03",
    question: "Navigate the drone to C(6, -2). Enter the value of its abscissa (x-coordinate).",
    inputLabel: "Abscissa (x)",
    placeholder: "Type abscissa...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x = ${val}`,
    formulaDisplay: "Abscissa = x-coordinate",
    targetCoord: { x: 6, y: -2 },
    points: [{ x: 0, y: 0, label: "Drone", draggable: true }],
    bookPage: {
      title: "📖 Abscissa and Quadrants",
      concept: "An ordered pair is written as (x, y). The first number, x, is called the abscissa, representing horizontal location.",
      formulaBreakdown: "Abscissa = x-value of (x, y)",
      stepByStep: [
        "Plot the point in the appropriate quadrant.",
        "The ordered pair has two coordinates.",
        "The first coordinate represents the x-value.",
        "This is the abscissa."
      ],
      visualTip: "Move the drone to the target point. Abscissa indicates horizontal distance from the Y-axis."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given point C(6, -2)" },
      { lineNum: 2, textBefore: "In the ordered pair (x, y), x represents the Abscissa." },
      { lineNum: 3, textBefore: "Abscissa (x-coordinate) = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-04": {
    id: "lvl-cg-04",
    question: "Plot the hidden treasure chest at D(-3, -7). Enter the value of its ordinate (y-coordinate).",
    inputLabel: "Ordinate (y)",
    placeholder: "Type ordinate...",
    correctAnswer: -7,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `y = ${val}`,
    formulaDisplay: "Ordinate = y-coordinate",
    targetCoord: { x: -3, y: -7 },
    points: [{ x: 0, y: 0, label: "Treasure", draggable: true }],
    bookPage: {
      title: "📖 Ordinates and Quadrant III",
      concept: "The second number in the ordered pair, y, is called the ordinate, representing vertical location.",
      formulaBreakdown: "Ordinate = y-value of (x, y)",
      stepByStep: [
        "Plot the point in the appropriate quadrant.",
        "The ordered pair has two coordinates.",
        "The second coordinate represents the y-value.",
        "This is the ordinate."
      ],
      visualTip: "Slide the treasure chest into the appropriate quadrant. Ordinate indicates vertical position."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given point D(-3, -7)" },
      { lineNum: 2, textBefore: "In the ordered pair (x, y), y represents the Ordinate." },
      { lineNum: 3, textBefore: "Ordinate (y-coordinate) = ", hasInput: true, inputIndex: 0, correctAnswer: "-7", placeholder: "y", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-05": {
    id: "lvl-cg-05",
    question: "Move the surveyor probe into Quadrant III at point E(-4, -4). Enter the product of its coordinates (x * y).",
    inputLabel: "Product (x * y)",
    placeholder: "Type product...",
    correctAnswer: 16,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Product = ${val}`,
    formulaDisplay: "Product = x × y",
    targetCoord: { x: -4, y: -4 },
    points: [{ x: 0, y: 0, label: "Surveyor", draggable: true }],
    bookPage: {
      title: "📖 Quadrant Signs",
      concept: "In Quadrant III, both coordinates are negative: (-x, -y). Multiplying them yields a positive value.",
      formulaBreakdown: "(-x) × (-y) = +xy",
      stepByStep: [
        "Quadrant III is characterized by x < 0 and y < 0.",
        "Plot the point which resides in Quadrant III.",
        "Multiply the coordinates to find the product."
      ],
      visualTip: "Position the probe in the lower-left Quadrant III. Notice both coordinates are negative."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given point E(-4, -4) in Quadrant III." },
      { lineNum: 2, textBefore: "x-coordinate = -4, y-coordinate = -4" },
      { lineNum: 3, textBefore: "Product of coordinates = (-4) × (-4)" },
      { lineNum: 4, textBefore: "Product = ", hasInput: true, inputIndex: 0, correctAnswer: "16", placeholder: "prod", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-06": {
    id: "lvl-cg-06",
    question: "Navigate the drone to A(3, 4). Enter its straight-line distance from the origin (0, 0).",
    inputLabel: "Distance from (0,0)",
    placeholder: "Type distance...",
    correctAnswer: 5,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Distance = ${val}`,
    formulaDisplay: "Distance = √(x² + y²)",
    targetCoord: { x: 3, y: 4 },
    points: [{ x: 0, y: 0, label: "Checkpoint A", draggable: true }],
    bookPage: {
      title: "📖 Distance from the Origin",
      concept: "The distance of any point P(x, y) from the origin O(0, 0) is derived from the Pythagorean theorem: √(x² + y²).",
      formulaBreakdown: "d = √(x² + y²)",
      stepByStep: [
        "Identify the coordinates from the question.",
        "Square each coordinate.",
        "Sum the squares.",
        "Take the square root to find the distance."
      ],
      visualTip: "Move the checkpoint to the target point. A green laser segment will stretch back to (0,0)!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given point A(3, 4) and Origin O(0, 0)" },
      { lineNum: 2, textBefore: "Formula: Distance from origin = √(x² + y²)" },
      { lineNum: 3, textBefore: "  d = √(3² + 4²)" },
      { lineNum: 4, textBefore: "  d = √(9 + 16) = √25" },
      { lineNum: 5, textBefore: "  d = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "d", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-07": {
    id: "lvl-cg-07",
    question: "Place the energy node at (2, 3). Enter the sum of its coordinates (x + y).",
    inputLabel: "Sum (x + y)",
    placeholder: "Type sum...",
    correctAnswer: 5,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x+y = ${val}`,
    formulaDisplay: "Sum = x + y",
    targetCoord: { x: 2, y: 3 },
    points: [{ x: 0, y: 0, label: "Node", draggable: true }],
    bookPage: {
      title: "📖 Plotting Integer Coordinates",
      concept: "To plot a point P(2, 3), move 2 units right on the X-axis and 3 units up on the Y-axis.",
      formulaBreakdown: "Sum = 2 + 3 = 5",
      stepByStep: [
        "Locate the x-coordinate on the X-axis and y-coordinate on the Y-axis.",
        "The intersection point is the target point.",
        "Add the x and y coordinates to find the sum."
      ],
      visualTip: "Snap the node to the target point. The sum of coordinates will be displayed!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Point to plot: (2, 3)" },
      { lineNum: 2, textBefore: "x-coordinate = 2, y-coordinate = 3" },
      { lineNum: 3, textBefore: "Sum = x + y = 2 + 3" },
      { lineNum: 4, textBefore: "Sum = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "sum", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-08": {
    id: "lvl-cg-08",
    question: "Drag A to (1, 2) and B to (1, 8) to draw a vertical energy line. Enter the length of this line segment.",
    inputLabel: "Length of AB",
    placeholder: "Type length...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Length = ${val}`,
    formulaDisplay: "Vertical Length = |y₂ - y₁|",
    points: [
      { x: 1, y: 2, label: "Point A", draggable: true },
      { x: 1, y: 8, label: "Point B", draggable: true }
    ],
    lineConnections: [[0, 1]],
    bookPage: {
      title: "📖 Drawing Line Segments",
      concept: "When two points share the same x-coordinate, the segment between them is vertical. Its length is the difference between their y-coordinates.",
      formulaBreakdown: "Distance = |y₂ - y₁| since x₁ = x₂",
      stepByStep: [
        "Identify the coordinates of both points.",
        "Since the x-coordinates are equal, calculate the difference in y-coordinates.",
        "The absolute difference gives the length."
      ],
      visualTip: "Position the points as specified. A vertical energy line will be established!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: A(1, 2) and B(1, 8)" },
      { lineNum: 2, textBefore: "Since x-coordinates are equal, segment AB is vertical." },
      { lineNum: 3, textBefore: "Length AB = y₂ - y₁ = 8 - 2" },
      { lineNum: 4, textBefore: "Length AB = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "len", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-09": {
    id: "lvl-cg-09",
    question: "Plot point (0, 5) correctly on the Y-axis. Enter its x-coordinate.",
    inputLabel: "x-coordinate",
    placeholder: "Type x...",
    correctAnswer: 0,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x = ${val}`,
    formulaDisplay: "Points on Y-axis: x = 0",
    targetCoord: { x: 0, y: 5 },
    points: [{ x: 5, y: 0, label: "Point P", draggable: true }],
    bookPage: {
      title: "📖 Axis Intercepts",
      concept: "Any point lying on the y-axis has its x-coordinate equal to 0. It is of the form (0, y).",
      formulaBreakdown: "x-coordinate on Y-axis = 0",
      stepByStep: [
        "A point lying on the Y-axis has zero horizontal offset.",
        "The coordinate is specified with x = 0.",
        "Its x-coordinate is 0."
      ],
      visualTip: "Place the node exactly on the Y-axis at the specified height. Notice how its horizontal position becomes 0!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "For any point lying on the Y-axis, the abscissa is 0." },
      { lineNum: 2, textBefore: "Therefore, for point (0, 5):" },
      { lineNum: 3, textBefore: "x-coordinate = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-10": {
    id: "lvl-cg-10",
    question: "Reflect the point P(3, 4) across the Y-axis to P'. Plot P' on the grid and enter its x-coordinate.",
    inputLabel: "x-coordinate of P'",
    placeholder: "Type x'...",
    correctAnswer: -3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x' = ${val}`,
    formulaDisplay: "Reflect across Y: (x, y) → (-x, y)",
    targetCoord: { x: -3, y: 4 },
    points: [{ x: 3, y: 4, label: "P'", draggable: true }],
    bookPage: {
      title: "📖 Grid Reflection Symmetry",
      concept: "Reflecting a point across the Y-axis flips the sign of its x-coordinate, while the y-coordinate remains unchanged.",
      formulaBreakdown: "P(x, y) → P'(-x, y)",
      stepByStep: [
        "Start with the original point from the question.",
        "Reflect across the vertical Y-axis.",
        "The new x-coordinate becomes the negative of the original.",
        "The y-coordinate remains the same."
      ],
      visualTip: "Drag the reflected point to the opposite position across the center line!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Original point: P(3, 4)" },
      { lineNum: 2, textBefore: "Reflecting across the Y-axis changes the sign of x." },
      { lineNum: 3, textBefore: "Coordinates of P' = (-3, 4)" },
      { lineNum: 4, textBefore: "x-coordinate of P' = ", hasInput: true, inputIndex: 0, correctAnswer: "-3", placeholder: "x'", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-11": {
    id: "lvl-cg-11",
    question: "Plot the corners of a rectangular energy shield. Enter the perimeter of the rectangle formed by vertices (1, 1), (7, 1), (7, 5), and (1, 5).",
    inputLabel: "Perimeter",
    placeholder: "Type perimeter...",
    correctAnswer: 20,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Perimeter = ${val}`,
    formulaDisplay: "Perimeter = 2(length + width)",
    points: [
      { x: 1, y: 1, label: "A", draggable: true },
      { x: 7, y: 1, label: "B", draggable: true },
      { x: 7, y: 5, label: "C", draggable: true },
      { x: 1, y: 5, label: "D", draggable: true }
    ],
    lineConnections: [[0, 1], [1, 2], [2, 3], [3, 0]],
    bookPage: {
      title: "📖 Constructing Shapes on Grid",
      concept: "A rectangle on a coordinate grid has horizontal sides along constant y, and vertical sides along constant x.",
      formulaBreakdown: "Length = |x₂ - x₁|, Width = |y₂ - y₁|",
      stepByStep: [
        "Calculate the length using the difference in x-coordinates.",
        "Calculate the width using the difference in y-coordinates.",
        "Apply perimeter formula: 2 × (Length + Width)."
      ],
      visualTip: "Plot the 4 points to form a rectangle. A neon rectangle will light up!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Vertices: A(1, 1), B(7, 1), C(7, 5), D(1, 5)" },
      { lineNum: 2, textBefore: "Length AB = 7 - 1 = 6 units" },
      { lineNum: 3, textBefore: "Width BC = 5 - 1 = 4 units" },
      { lineNum: 4, textBefore: "Perimeter = 2 × (Length + Width) = 2 × (6 + 4)" },
      { lineNum: 5, textBefore: "Perimeter = ", hasInput: true, inputIndex: 0, correctAnswer: "20", placeholder: "perim", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-12": {
    id: "lvl-cg-12",
    question: "Plot the target node at (4, -5). Enter the absolute difference between its X and Y coordinates |x - y|.",
    inputLabel: "Absolute Difference",
    placeholder: "Type value...",
    correctAnswer: 9,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `|x-y| = ${val}`,
    formulaDisplay: "Difference = |x - y|",
    targetCoord: { x: 4, y: -5 },
    points: [{ x: 0, y: 0, label: "Target", draggable: true }],
    bookPage: {
      title: "📖 Precision Coordinates",
      concept: "Calculating coordinate relationships represents an essential grid mastery skill.",
      formulaBreakdown: "Difference = |x - y| = |4 - (-5)| = 9",
      stepByStep: [
        "Plot the target at the specified coordinates.",
        "Subtract the coordinates as specified.",
        "Calculate the absolute value of the result."
      ],
      visualTip: "Move the node to the target point. The distance difference value will be displayed."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Coordinates: x = 4, y = -5" },
      { lineNum: 2, textBefore: "Difference = |x - y| = |4 - (-5)|" },
      { lineNum: 3, textBefore: "Difference = |4 + 5| = ", hasInput: true, inputIndex: 0, correctAnswer: "9", placeholder: "diff", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-13": {
    id: "lvl-cg-13",
    question: "Calculate the shortest laser distance between energy nodes at A(1, 2) and B(4, 6).",
    inputLabel: "Distance (d)",
    placeholder: "Type distance...",
    correctAnswer: 5,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val.toFixed(1)}`,
    formulaDisplay: "d = √((x₂-x₁)² + (y₂-y₁)²)",
    points: [
      { x: 1, y: 2, label: "Node A", draggable: false },
      { x: 4, y: 6, label: "Node B", draggable: false }
    ],
    lineConnections: [[0, 1]],
    bookPage: {
      title: "📖 The Distance Formula",
      concept: "The Distance Formula calculates the straight-line segment length between any two points in the Cartesian plane.",
      formulaBreakdown: "d = √((x₂ - x₁)² + (y₂ - y₁)²)",
      stepByStep: [
        "Identify the coordinates of both points.",
        "Subtract coordinates to find the offsets.",
        "Square the offsets, add them, and take the square root."
      ],
      visualTip: "Observe the green connection line forming a right-angled triangle on the graph!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let A = (1, 2) and B = (4, 6)" },
      { lineNum: 2, textBefore: "Here, x₁ = 1, y₁ = 2, x₂ = 4, y₂ = 6" },
      { lineNum: 3, textBefore: "Formula: d = √((x₂-x₁)² + (y₂-y₁)²)" },
      { lineNum: 4, textBefore: "  d = √((4-1)² + (6-2)²)" },
      { lineNum: 5, textBefore: "  d = √(3² + 4²) = √(9 + 16)" },
      { lineNum: 6, textBefore: "  d = √25 = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "d", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-14": {
    id: "lvl-cg-14",
    question: "Calculate the travel distance between station A(-2, 3) and station B(4, -5).",
    inputLabel: "Distance",
    placeholder: "Type distance...",
    correctAnswer: 10,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val.toFixed(1)}`,
    formulaDisplay: "d = √((x₂-x₁)² + (y₂-y₁)²)",
    points: [
      { x: -2, y: 3, label: "Station A", draggable: false },
      { x: 4, y: -5, label: "Station B", draggable: false }
    ],
    lineConnections: [[0, 1]],
    bookPage: {
      title: "📖 Calculating Across Quadrants",
      concept: "When subtracting negative values, be careful with signs: x₂ - x₁ = 4 - (-2) = 4 + 2 = 6.",
      formulaBreakdown: "d = √((4 - (-2))² + (-5 - 3)²)",
      stepByStep: [
        "Calculate the x-offset and y-offset between the points.",
        "Square the offset values.",
        "Sum the squared values.",
        "Take the square root to find the distance."
      ],
      visualTip: "The line crosses between quadrants. The total distance will be displayed."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Points: A(-2, 3) and B(4, -5)" },
      { lineNum: 2, textBefore: "x₂-x₁ = 4 - (-2) = 6" },
      { lineNum: 3, textBefore: "y₂-y₁ = -5 - 3 = -8" },
      { lineNum: 4, textBefore: "d = √(6² + (-8)²) = √(36 + 64)" },
      { lineNum: 5, textBefore: "d = √100 = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "d", textAfter: " units", widthChars: 3 }
    ]
  },
  "lvl-cg-15": {
    id: "lvl-cg-15",
    question: "Space stations are located at A(0, 6) and B(8, 0). Calculate the straight-line distance between them.",
    inputLabel: "Distance",
    placeholder: "Type distance...",
    correctAnswer: 10,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val.toFixed(1)}`,
    formulaDisplay: "d = √((x₂-x₁)² + (y₂-y₁)²)",
    points: [
      { x: 0, y: 6, label: "Station A", draggable: false },
      { x: 8, y: 0, label: "Station B", draggable: false }
    ],
    lineConnections: [[0, 1]],
    bookPage: {
      title: "📖 Zero Coordinate Offsets",
      concept: "If points lie on the axes, their distance is simple to find via Pythagorean theorem: √(x² + y²).",
      formulaBreakdown: "d = √(8² + (-6)²) = 10",
      stepByStep: [
        "Calculate the x-offset and y-offset between the points.",
        "Square the offset values.",
        "Sum the squared values.",
        "Take the square root to find the distance."
      ],
      visualTip: "A connects the y-axis intercept to the x-axis intercept B."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Points: A(0, 6) and B(8, 0)" },
      { lineNum: 2, textBefore: "d = √((8-0)² + (0-6)²)" },
      { lineNum: 3, textBefore: "d = √(8² + (-6)²) = √(64 + 36)" },
      { lineNum: 4, textBefore: "d = √100 = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "d", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-16": {
    id: "lvl-cg-16",
    question: "Find the coordinate on the x-axis equidistant from A(2, -5) and B(-2, 9). Enter its x-coordinate.",
    inputLabel: "x-coordinate (P)",
    placeholder: "Type x-coordinate...",
    correctAnswer: -7,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x = ${val}`,
    formulaDisplay: "Equidistant: AP = BP",
    points: [
      { x: 2, y: -5, label: "A", draggable: false },
      { x: -2, y: 9, label: "B", draggable: false },
      { x: -7, y: 0, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 Equidistant Coordinate Points",
      concept: "A point equidistant from two vertices has equal distance segments. A point on X-axis is written as P(x, 0).",
      formulaBreakdown: "AP² = BP² → (x-2)² + (0+5)² = (x+2)² + (0-9)²",
      stepByStep: [
        "Let the point be P(x, 0) on the X-axis.",
        "Calculate AP² using the distance formula.",
        "Calculate BP² using the distance formula.",
        "Equate both expressions and solve for x."
      ],
      visualTip: "Move P along the X-axis to the calculated position. The two laser links to A and B will become equal!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let the point on X-axis be P(x, 0)." },
      { lineNum: 2, textBefore: "Since P is equidistant from A(2, -5) and B(-2, 9): AP = BP" },
      { lineNum: 3, textBefore: "  (x - 2)² + (0 - (-5))² = (x - (-2))² + (0 - 9)²" },
      { lineNum: 4, textBefore: "  x² - 4x + 4 + 25 = x² + 4x + 4 + 81" },
      { lineNum: 5, textBefore: "  -4x + 29 = 4x + 85" },
      { lineNum: 6, textBefore: "  -8x = 56" },
      { lineNum: 7, textBefore: "  x = ", hasInput: true, inputIndex: 0, correctAnswer: "-7", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-17": {
    id: "lvl-cg-17",
    question: "Check if points A(2, 3), B(4, k), and C(6, -3) are collinear. Find the value of k.",
    inputLabel: "k value",
    placeholder: "Type k...",
    correctAnswer: 0,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `k = ${val}`,
    formulaDisplay: "Collinear: Slope AB = Slope BC",
    points: [
      { x: 2, y: 3, label: "A", draggable: false },
      { x: 4, y: 0, label: "B", draggable: true },
      { x: 6, y: -3, label: "C", draggable: false }
    ],
    lineConnections: [[0, 1], [1, 2]],
    bookPage: {
      title: "📖 Collinearity of Points",
      concept: "Points are collinear if they lie on a single line. The slope between any two pairs must be equal.",
      formulaBreakdown: "(y₂-y₁)/(x₂-x₁) = (y₃-y₂)/(x₃-x₂)",
      stepByStep: [
        "Calculate the slope of AB using the formula.",
        "Calculate the slope of BC using the formula.",
        "Equate the slopes since points are collinear.",
        "Solve for the unknown k."
      ],
      visualTip: "Move B to the calculated position. The segments AB and BC will merge into a single straight line!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Points: A(2, 3), B(4, k), C(6, -3)" },
      { lineNum: 2, textBefore: "For collinear points, Slope of AB = Slope of BC" },
      { lineNum: 3, textBefore: "  (k - 3)/(4 - 2) = (-3 - k)/(6 - 4)" },
      { lineNum: 4, textBefore: "  (k - 3)/2 = (-3 - k)/2" },
      { lineNum: 5, textBefore: "  k - 3 = -3 - k" },
      { lineNum: 6, textBefore: "  2k = 0" },
      { lineNum: 7, textBefore: "  k = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "k", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-18": {
    id: "lvl-cg-18",
    question: "Verify if A(5, -2), B(6, 4), and C(7, -2) form an isosceles triangle. Enter the length of side AB (rounded to nearest integer).",
    inputLabel: "Side AB length",
    placeholder: "Type length...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AB = ${val}`,
    formulaDisplay: "Isosceles: Two sides are equal",
    points: [
      { x: 5, y: -2, label: "A", draggable: false },
      { x: 6, y: 4, label: "B", draggable: false },
      { x: 7, y: -2, label: "C", draggable: false }
    ],
    lineConnections: [[0, 1], [1, 2], [2, 0]],
    bookPage: {
      title: "📖 Isosceles Triangle Proofs",
      concept: "A triangle is isosceles if at least two of its sides are equal in length.",
      formulaBreakdown: "Calculate AB, BC, AC using Distance Formula",
      stepByStep: [
        "Calculate AB using the distance formula.",
        "Calculate BC using the distance formula.",
        "Calculate AC using the distance formula.",
        "Compare the sides to determine if the triangle is isosceles."
      ],
      visualTip: "A triangle will be drawn on the grid. Notice how the sides compare!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Vertices: A(5, -2), B(6, 4), C(7, -2)" },
      { lineNum: 2, textBefore: "AB = √((6-5)² + (4 - (-2))²)" },
      { lineNum: 3, textBefore: "AB = √(1² + 6²) = √37 ≈ 6.08" },
      { lineNum: 4, textBefore: "BC = √((7-6)² + (-2-4)²) = √37 ≈ 6.08" },
      { lineNum: 5, textBefore: "Since AB = BC, the triangle is Isosceles." },
      { lineNum: 6, textBefore: "Length of AB (nearest integer) = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "len", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-19": {
    id: "lvl-cg-19",
    question: "Find the midpoint of the line segment connecting A(2, 4) and B(6, 8). Enter the x-coordinate of the midpoint.",
    inputLabel: "Midpoint x-coordinate",
    placeholder: "Type x...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x_mid = ${val}`,
    formulaDisplay: "x_mid = (x₁ + x₂) / 2",
    points: [
      { x: 2, y: 4, label: "A", draggable: false },
      { x: 6, y: 8, label: "B", draggable: false },
      { x: 4, y: 6, label: "Midpoint", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 The Midpoint Formula",
      concept: "The midpoint of a segment is the average of its endpoints' coordinates.",
      formulaBreakdown: "Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2)",
      stepByStep: [
        "Identify the coordinates of both endpoints.",
        "Calculate the average of the x-coordinates.",
        "Calculate the average of the y-coordinates.",
        "The midpoint is at these averaged coordinates."
      ],
      visualTip: "Drag the Midpoint handle. It snaps exactly at the center of the segment!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Points: A(2, 4) and B(6, 8)" },
      { lineNum: 2, textBefore: "Formula: Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)" },
      { lineNum: 3, textBefore: "  x_mid = (2 + 6) / 2 = 4" },
      { lineNum: 4, textBefore: "  y_mid = (4 + 8) / 2 = 6" },
      { lineNum: 5, textBefore: "Midpoint coordinate x = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-20": {
    id: "lvl-cg-20",
    question: "Calculate the midpoint of the segment between A(-6, -4) and B(2, 6). Enter the y-coordinate of the midpoint.",
    inputLabel: "Midpoint y-coordinate",
    placeholder: "Type y...",
    correctAnswer: 1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `y_mid = ${val}`,
    formulaDisplay: "y_mid = (y₁ + y₂) / 2",
    points: [
      { x: -6, y: -4, label: "A", draggable: false },
      { x: 2, y: 6, label: "B", draggable: false },
      { x: -2, y: 1, label: "Midpoint", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 Midpoint with Negatives",
      concept: "Calculating midpoints follows the same averaging rule when dealing with negative coordinate ranges.",
      formulaBreakdown: "y_mid = (-4 + 6) / 2 = 1",
      stepByStep: [
        "Identify the coordinates of both endpoints.",
        "Calculate the x-midpoint using the formula.",
        "Calculate the y-midpoint using the formula.",
        "The midpoint is at these calculated coordinates."
      ],
      visualTip: "Place the Midpoint handle in the center. Notice its position!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Points: A(-6, -4) and B(2, 6)" },
      { lineNum: 2, textBefore: "  x_mid = (-6 + 2) / 2 = -2" },
      { lineNum: 3, textBefore: "  y_mid = (-4 + 6) / 2 = 2 / 2 = 1" },
      { lineNum: 4, textBefore: "Midpoint coordinate y = ", hasInput: true, inputIndex: 0, correctAnswer: "1", placeholder: "y", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-21": {
    id: "lvl-cg-21",
    question: "Find the coordinates of point P dividing the segment A(1, 3) and B(4, 6) in the ratio 2:1. Enter the x-coordinate of P.",
    inputLabel: "x-coordinate of P",
    placeholder: "Type x...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x_sec = ${val}`,
    formulaDisplay: "x = (m₁x₂ + m₂x₁) / (m₁ + m₂)",
    points: [
      { x: 1, y: 3, label: "A", draggable: false },
      { x: 4, y: 6, label: "B", draggable: false },
      { x: 3, y: 5, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 The Section Formula",
      concept: "The Section Formula finds the coordinates of a point dividing a line segment in a given ratio.",
      formulaBreakdown: "x = (mx₂ + nx₁) / (m + n)",
      stepByStep: [
        "Identify the endpoints and the ratio.",
        "Apply the section formula for x-coordinate.",
        "Apply the section formula for y-coordinate.",
        "The dividing point is at these calculated coordinates."
      ],
      visualTip: "Observe how the dividing point splits the segment in the specified ratio."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Endpoints: A(1, 3), B(4, 6); Ratio m₁:m₂ = 2:1" },
      { lineNum: 2, textBefore: "Formula: x = (m₁x₂ + m₂x₁) / (m₁ + m₂)" },
      { lineNum: 3, textBefore: "  x = (2 × 4 + 1 × 1) / (2 + 1)" },
      { lineNum: 4, textBefore: "  x = (8 + 1) / 3 = 9 / 3 = 3" },
      { lineNum: 5, textBefore: "  y = (2 × 6 + 1 × 3) / (2 + 1) = 15 / 3 = 5" },
      { lineNum: 6, textBefore: "Point x-coordinate = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-22": {
    id: "lvl-cg-22",
    question: "Find the coordinates of point P dividing segment A(-1, 7) and B(4, -3) in ratio 2:3. Enter the y-coordinate of P.",
    inputLabel: "y-coordinate of P",
    placeholder: "Type y...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `y_sec = ${val}`,
    formulaDisplay: "y = (m₁y₂ + m₂y₁) / (m₁ + m₂)",
    points: [
      { x: -1, y: 7, label: "A", draggable: false },
      { x: 4, y: -3, label: "B", draggable: false },
      { x: 1, y: 3, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 Ratio Division Puzzles",
      concept: "Applying the section formula with positive and negative y coordinates requires careful arithmetic.",
      formulaBreakdown: "y = (2 × (-3) + 3 × 7) / (2 + 3) = 3",
      stepByStep: [
        "Identify the endpoints and the ratio.",
        "Apply the section formula for x-coordinate.",
        "Apply the section formula for y-coordinate.",
        "The dividing point is at these calculated coordinates."
      ],
      visualTip: "Place the handle at the calculated position. Notice the segment splits in the specified ratio."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Endpoints: A(-1, 7), B(4, -3); Ratio = 2:3" },
      { lineNum: 2, textBefore: "  x = (2 × 4 + 3 × (-1)) / (2 + 3) = 5 / 5 = 1" },
      { lineNum: 3, textBefore: "  y = (2 × (-3) + 3 × 7) / (2 + 3)" },
      { lineNum: 4, textBefore: "  y = (-6 + 21) / 5 = 15 / 5 = 3" },
      { lineNum: 5, textBefore: "Point y-coordinate = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "y", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-23": {
    id: "lvl-cg-23",
    question: "If vertices of a parallelogram are A(6, 1), B(8, 2), C(9, 4), and D(p, 3) in order, find the value of p.",
    inputLabel: "value of p",
    placeholder: "Type p...",
    correctAnswer: 7,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `p = ${val}`,
    formulaDisplay: "Midpoint AC = Midpoint BD",
    points: [
      { x: 6, y: 1, label: "A", draggable: false },
      { x: 8, y: 2, label: "B", draggable: false },
      { x: 9, y: 4, label: "C", draggable: false },
      { x: 7, y: 3, label: "D", draggable: true }
    ],
    lineConnections: [[0, 1], [1, 2], [2, 3], [3, 0]],
    bookPage: {
      title: "📖 Parallelogram Diagonals",
      concept: "A key property of a parallelogram is that its diagonals bisect each other, meaning they share the same midpoint.",
      formulaBreakdown: "Midpoint AC = Midpoint BD",
      stepByStep: [
        "Calculate the midpoint of diagonal AC.",
        "Calculate the midpoint of diagonal BD.",
        "Equate the x-parts to find the unknown p."
      ],
      visualTip: "Move D to the calculated position to form a perfect parallel grid quadrilateral!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Vertices: A(6,1), B(8,2), C(9,4), D(p,3)" },
      { lineNum: 2, textBefore: "Diagonals AC and BD bisect each other." },
      { lineNum: 3, textBefore: "Midpoint AC x-coord = (6 + 9)/2 = 7.5" },
      { lineNum: 4, textBefore: "Midpoint BD x-coord = (8 + p)/2" },
      { lineNum: 5, textBefore: "  (8 + p)/2 = 15/2" },
      { lineNum: 6, textBefore: "  8 + p = 15" },
      { lineNum: 7, textBefore: "  p = ", hasInput: true, inputIndex: 0, correctAnswer: "7", placeholder: "p", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-24": {
    id: "lvl-cg-24",
    question: "Find coordinates of trisection points of segment joining A(2, -2) and B(-7, 4). Enter the x-coordinate of the point closer to A.",
    inputLabel: "x-coordinate of trisection point",
    placeholder: "Type x...",
    correctAnswer: -1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x_tri = ${val}`,
    formulaDisplay: "Trisection ratio = 1:2",
    points: [
      { x: 2, y: -2, label: "A", draggable: false },
      { x: -7, y: 4, label: "B", draggable: false },
      { x: -1, y: 0, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 Trisection of a Line Segment",
      concept: "Trisection points divide a line segment into three equal parts, in ratios 1:2 and 2:1.",
      formulaBreakdown: "P divides AB in ratio 1:2",
      stepByStep: [
        "To find P closer to A, use the appropriate ratio.",
        "Apply the section formula for x-coordinate.",
        "Apply the section formula for y-coordinate.",
        "Point P is at these calculated coordinates."
      ],
      visualTip: "Place the node at the calculated position to split segment AB into the specified fraction of its length!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: A(2, -2) and B(-7, 4)" },
      { lineNum: 2, textBefore: "Point P closer to A divides segment AB in ratio 1:2." },
      { lineNum: 3, textBefore: "  x = (1 × (-7) + 2 × 2) / (1 + 2)" },
      { lineNum: 4, textBefore: "  x = (-7 + 4) / 3 = -3 / 3 = -1" },
      { lineNum: 5, textBefore: "  y = (1 × 4 + 2 × (-2)) / 3 = 0 / 3 = 0" },
      { lineNum: 6, textBefore: "Point x-coordinate = ", hasInput: true, inputIndex: 0, correctAnswer: "-1", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-25": {
    id: "lvl-cg-25",
    question: "Find the area of the triangle whose vertices are A(2, 3), B(-1, 0), and C(2, -4).",
    inputLabel: "Area of Triangle",
    placeholder: "Type area...",
    correctAnswer: 10.5,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Area = ${val.toFixed(2)}`,
    formulaDisplay: "Area = 1/2 |x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|",
    points: [
      { x: 2, y: 3, label: "A", draggable: false },
      { x: -1, y: 0, label: "B", draggable: false },
      { x: 2, y: -4, label: "C", draggable: false }
    ],
    lineConnections: [[0, 1], [1, 2], [2, 0]],
    bookPage: {
      title: "📖 Area of a Triangle on Graph",
      concept: "The area of a triangle formed by three points can be found using their coordinates.",
      formulaBreakdown: "Area = 0.5 × |x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|",
      stepByStep: [
        "Substitute the coordinates into the area formula.",
        "Simplify the expression step by step.",
        "Calculate the final area value."
      ],
      visualTip: "Observe the bounded triangular zone formed by the nodes."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Vertices: A(2, 3), B(-1, 0), C(2, -4)" },
      { lineNum: 2, textBefore: "Area = 1/2 |2(0 - (-4)) + (-1)(-4 - 3) + 2(3 - 0)|" },
      { lineNum: 3, textBefore: "Area = 1/2 |8 + 7 + 6|" },
      { lineNum: 4, textBefore: "Area = 1/2 |21| = ", hasInput: true, inputIndex: 0, correctAnswer: "10.5", placeholder: "area", textAfter: " sq units", widthChars: 4 }
    ]
  },
  "lvl-cg-26": {
    id: "lvl-cg-26",
    question: "Find a relation between x and y such that (x, y) is equidistant from A(3, 6) and B(-3, 4). If the relation is 3x + y = k, find k.",
    inputLabel: "value of k",
    placeholder: "Type k...",
    correctAnswer: 5,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `k = ${val}`,
    formulaDisplay: "3x + y = k",
    points: [
      { x: 3, y: 6, label: "A", draggable: false },
      { x: -3, y: 4, label: "B", draggable: false },
      { x: 1, y: 2, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 Equidistant Loci Relations",
      concept: "All points equidistant from two points lie on their perpendicular bisector line.",
      formulaBreakdown: "(x-3)² + (y-6)² = (x+3)² + (y-4)² → 3x + y = 5",
      stepByStep: [
        "Set up the equation AP² = BP².",
        "Expand both sides using the distance formula.",
        "Simplify the equation by canceling terms.",
        "Reduce to the final linear equation."
      ],
      visualTip: "Moving P along the calculated line maintains exact equidistant branches!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let point be P(x, y) equidistant from A(3, 6) and B(-3, 4)." },
      { lineNum: 2, textBefore: "  (x - 3)² + (y - 6)² = (x - (-3))² + (y - 4)²" },
      { lineNum: 3, textBefore: "  x² - 6x + 9 + y² - 12y + 36 = x² + 6x + 9 + y² - 8y + 16" },
      { lineNum: 4, textBefore: "  -6x - 12y + 45 = 6x - 8y + 25" },
      { lineNum: 5, textBefore: "  -12x - 4y = -20  ⇒  3x + y = 5" },
      { lineNum: 6, textBefore: "Therefore, k = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "k", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-27": {
    id: "lvl-cg-27",
    question: "Find coordinates of center of circle passing through A(6, -6), B(3, -7), and C(3, 3). Enter the x-coordinate of the center.",
    inputLabel: "Center x-coordinate",
    placeholder: "Type x...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x_center = ${val}`,
    formulaDisplay: "Radius: PA = PB = PC",
    points: [
      { x: 6, y: -6, label: "A", draggable: false },
      { x: 3, y: -7, label: "B", draggable: false },
      { x: 3, y: 3, label: "C", draggable: false },
      { x: 3, y: -2, label: "Center", draggable: true }
    ],
    lineConnections: [[0, 3], [1, 3], [2, 3]],
    bookPage: {
      title: "📖 Circumcenter of a Triangle",
      concept: "The center P(x, y) of a circle passing through three points has equal distance to each of them (radii).",
      formulaBreakdown: "PA² = PB² = PC²",
      stepByStep: [
        "Let center be P(x, y). Use PB² = PC² to find y.",
        "Use PA² = PC² with the calculated y to find x.",
        "Solve for x by expanding and simplifying.",
        "The center is at the calculated coordinates."
      ],
      visualTip: "Place Center at the calculated position. Watch the circular laser overlay align with all three points!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let Center be P(x, y). PA = PB = PC" },
      { lineNum: 2, textBefore: "From PB = PC: (y + 7)² = (y - 3)² ⇒ y = -2" },
      { lineNum: 3, textBefore: "From PA = PC: (x - 6)² + (-2 + 6)² = (x - 3)² + (-2 - 3)²" },
      { lineNum: 4, textBefore: "  x² - 12x + 36 + 16 = x² - 6x + 9 + 25" },
      { lineNum: 5, textBefore: "  -6x = -18 ⇒ x = 3" },
      { lineNum: 6, textBefore: "Center coordinate x = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-28": {
    id: "lvl-cg-28",
    question: "Line segment connects A(-5, 7) and B(-1, 3). Find coordinates of point P dividing AB in ratio 1:3. Enter the x-coordinate of P.",
    inputLabel: "x-coordinate of P",
    placeholder: "Type x...",
    correctAnswer: -4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `x_sec = ${val}`,
    formulaDisplay: "x = (mx₂ + nx₁) / (m + n)",
    points: [
      { x: -5, y: 7, label: "A", draggable: false },
      { x: -1, y: 3, label: "B", draggable: false },
      { x: -4, y: 6, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 Grid Node Ratios",
      concept: "Internal division section formulas find segments dividing ratios.",
      formulaBreakdown: "x = (1 × (-1) + 3 × (-5)) / 4 = -4",
      stepByStep: [
        "Identify the endpoints and the ratio.",
        "Apply the section formula for x-coordinate.",
        "Apply the section formula for y-coordinate.",
        "Point P is at these calculated coordinates."
      ],
      visualTip: "Position P at the calculated position. The segment is cleanly divided in the specified ratio."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Given: A(-5, 7), B(-1, 3); Ratio = 1:3" },
      { lineNum: 2, textBefore: "  x = (1 × (-1) + 3 × (-5)) / (1 + 3)" },
      { lineNum: 3, textBefore: "  x = (-1 - 15) / 4 = -16 / 4 = -4" },
      { lineNum: 4, textBefore: "  y = (1 × 3 + 3 × 7) / 4 = 24 / 4 = 6" },
      { lineNum: 5, textBefore: "Point x-coordinate = ", hasInput: true, inputIndex: 0, correctAnswer: "-4", placeholder: "x", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-29": {
    id: "lvl-cg-29",
    question: "Find the centroid of the triangle with vertices A(1, 4), B(3, -2), and C(5, 7). Enter the y-coordinate of the centroid.",
    inputLabel: "Centroid y-coordinate",
    placeholder: "Type y...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `y_cen = ${val}`,
    formulaDisplay: "y_cen = (y₁ + y₂ + y₃) / 3",
    points: [
      { x: 1, y: 4, label: "A", draggable: false },
      { x: 3, y: -2, label: "B", draggable: false },
      { x: 5, y: 7, label: "C", draggable: false },
      { x: 3, y: 3, label: "Centroid", draggable: true }
    ],
    lineConnections: [[0, 3], [1, 3], [2, 3]],
    bookPage: {
      title: "📖 Centroid of a Triangle",
      concept: "The centroid of a triangle is the point of intersection of its medians, found by averaging all three vertices' coordinates.",
      formulaBreakdown: "Centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)",
      stepByStep: [
        "Identify the vertices of the triangle.",
        "Calculate the average of the x-coordinates.",
        "Calculate the average of the y-coordinates.",
        "The centroid is at these averaged coordinates."
      ],
      visualTip: "Move the Centroid handle to the calculated position to place it exactly at the center of the triangle's mass!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Vertices: A(1, 4), B(3, -2), C(5, 7)" },
      { lineNum: 2, textBefore: "Formula: Centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)" },
      { lineNum: 3, textBefore: "  x_cen = (1 + 3 + 5) / 3 = 3" },
      { lineNum: 4, textBefore: "  y_cen = (4 - 2 + 7) / 3 = 9 / 3 = 3" },
      { lineNum: 5, textBefore: "Centroid coordinate y = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "y", textAfter: "", widthChars: 3 }
    ]
  },
  "lvl-cg-30": {
    id: "lvl-cg-30",
    question: "The reactor primary cores are at A(-4, -6) and B(6, 9). If the stabilizer is placed at their midpoint, find the core distance AP (rounded to the nearest integer).",
    inputLabel: "Distance AP",
    placeholder: "Type distance...",
    correctAnswer: 9,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `AP = ${val.toFixed(1)}`,
    formulaDisplay: "AP = 1/2 × Distance AB",
    points: [
      { x: -4, y: -6, label: "A", draggable: false },
      { x: 6, y: 9, label: "B", draggable: false },
      { x: 1, y: 2, label: "P", draggable: true }
    ],
    lineConnections: [[0, 2], [1, 2]],
    bookPage: {
      title: "📖 FINAL BOSS: Reactor Alignment",
      concept: "Stabilize the primary fusion lines by finding the exact midpoint, drawing distance lines, and calculating core balances.",
      formulaBreakdown: "AP = AB / 2",
      stepByStep: [
        "Identify the primary cores from the question.",
        "Calculate AB using the distance formula.",
        "The stabilizer P lies at the midpoint, splitting the segment into equal halves.",
        "AP = AB / 2, round to the nearest integer."
      ],
      visualTip: "Stabilize the core by placing the node at the calculated position. Watch the reactor hum into full active operation!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Primary reactor cores: A(-4, -6) and B(6, 9)" },
      { lineNum: 2, textBefore: "Step 1: Calculate full distance AB" },
      { lineNum: 3, textBefore: "  AB = √((6 - (-4))² + (9 - (-6))²)" },
      { lineNum: 4, textBefore: "  AB = √(10² + 15²) = √325 ≈ 18.03" },
      { lineNum: 5, textBefore: "Step 2: Find distance AP (P is midpoint)" },
      { lineNum: 6, textBefore: "  AP = AB / 2 = 18.03 / 2 = 9.01" },
      { lineNum: 7, textBefore: "Core Distance AP (nearest integer) = ", hasInput: true, inputIndex: 0, correctAnswer: "9", placeholder: "d", textAfter: " units", widthChars: 3 }
    ]
  }
};

export default coordinateGeometrySpecs;
