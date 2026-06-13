import type { LevelSpecification } from '../levelSpecs';

const applicationsTrigSpecs: Record<string, LevelSpecification> = {
  // ==========================================
  // WORLD 1: Observation Basics (Levels 1–6)
  // ==========================================
  "lvl-apptrig-01": {
    id: "lvl-apptrig-01",
    question: "Rotate the laser telescope to align the line of sight with the hovering research drone. Target exactly 45° elevation.",
    inputLabel: "Elevation Angle (θ)",
    placeholder: "Type elevation angle...",
    correctAnswer: 45,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Angle θ = 45°",
    trigMode: "angle",
    trigTargetAngle: 45,
    bookPage: {
      title: "📖 Line of Sight & Elevation",
      concept: "The line of sight is the straight line drawn from the eye of an observer to the object. The angle of elevation is the angle formed by the line of sight with the horizontal plane when the object is above horizontal level.",
      formulaBreakdown: "Telescope elevation θ = 45°",
      stepByStep: [
        "Rotate the telescope using the slider or drag handle.",
        "Observe the laser beam projecting from the lens to the drone.",
        "Set the angle of elevation exactly to the target value (45°).",
        "Enter 45 as the answer to lock coordinates."
      ],
      visualTip: "Aim the telescope directly at the drone! When the angle is exactly 45°, you will get a perfect lock."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Observer elevation target = 45°" },
      { lineNum: 2, textBefore: "Required telescope elevation angle = ", hasInput: true, inputIndex: 0, correctAnswer: "45", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-apptrig-02": {
    id: "lvl-apptrig-02",
    question: "Adjust the observation tower scanner to spot the drone. Set the angle of elevation to exactly 30°.",
    inputLabel: "Elevation Angle (θ)",
    placeholder: "Type elevation angle...",
    correctAnswer: 30,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Angle θ = 30°",
    trigMode: "angle",
    trigTargetAngle: 30,
    bookPage: {
      title: "📖 Viewing from a Height",
      concept: "When the observer climbs higher, the horizontal baseline remains parallel to the ground. Angles of elevation are still measured relative to this horizontal line of sight.",
      formulaBreakdown: "Angle of elevation θ = 30°",
      stepByStep: [
        "Position the tower lens tilt.",
        "Pivot the scanner upward until the target drone intersects the laser beam.",
        "Match the indicator value to 30°.",
        "Submit the correct angle."
      ],
      visualTip: "Adjust the pitch pointer to 30° to scan the target zone."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Baseline target elevation = 30°" },
      { lineNum: 2, textBefore: "Set scanning angle to = ", hasInput: true, inputIndex: 0, correctAnswer: "30", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-apptrig-03": {
    id: "lvl-apptrig-03",
    question: "Calibrate the main communications laser telescope. Aim at the high altitude transceiver satellite at exactly 60° elevation.",
    inputLabel: "Telescope Angle (θ)",
    placeholder: "Type angle...",
    correctAnswer: 60,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `θ = ${val}°`,
    formulaDisplay: "Angle θ = 60°",
    trigMode: "angle",
    trigTargetAngle: 60,
    bookPage: {
      title: "📖 Steeper Angles of Elevation",
      concept: "A steeper angle of elevation means the observed object is closer horizontally or higher vertically. 60° represents a steep slope (rise to run ratio of √3 ≈ 1.732).",
      formulaBreakdown: "Target angle θ = 60°",
      stepByStep: [
        "Rotate the communications laser telescope upward.",
        "Observe the path sweep across the telemetry screen.",
        "Calibrate to exactly 60°.",
        "Lock values by submitting your calibration answer."
      ],
      visualTip: "Drag the telescope scope pointer upward to target 60°."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Satellite elevation path = 60°" },
      { lineNum: 2, textBefore: "Adjusted telescope elevation angle = ", hasInput: true, inputIndex: 0, correctAnswer: "60", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-apptrig-04": {
    id: "lvl-apptrig-04",
    question: "From the tower observation deck, locate the hidden valley cargo box. Adjust the angle of depression downward to exactly 45°.",
    inputLabel: "Depression Angle (θ)",
    placeholder: "Type depression angle...",
    correctAnswer: 45,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Depression θ = ${val}°`,
    formulaDisplay: "Angle of Depression θ = 45°",
    trigMode: "angle",
    trigTargetAngle: 45,
    bookPage: {
      title: "📖 Angles of Depression",
      concept: "The angle of depression is the angle formed by the line of sight with the horizontal plane when the observed object is below horizontal level.",
      formulaBreakdown: "Angle of Depression = Alternate Interior Elevation Angle = θ = 45°",
      stepByStep: [
        "Identify the horizontal reference line of the observer.",
        "Rotate the camera scope downward below the horizontal baseline.",
        "Set the angle of depression to exactly 45°.",
        "Submit the value."
      ],
      visualTip: "Rotate the scope downward from the horizontal line of sight until the indicator shows 45°."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Tower horizontal line of sight = 0°" },
      { lineNum: 2, textBefore: "Angle of depression downward = ", hasInput: true, inputIndex: 0, correctAnswer: "45", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-apptrig-05": {
    id: "lvl-apptrig-05",
    question: "Track a moving cargo drone on the valley floor. Set the telescope angle of depression to exactly 30° below horizontal.",
    inputLabel: "Depression Angle (θ)",
    placeholder: "Type depression angle...",
    correctAnswer: 30,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Depression θ = ${val}°`,
    formulaDisplay: "Angle of Depression θ = 30°",
    trigMode: "angle",
    trigTargetAngle: 30,
    bookPage: {
      title: "📖 Alternate Interior Angles",
      concept: "Because the horizontal line of the observer and the horizontal ground plane are parallel, the angle of depression from the observer equals the angle of elevation from the target by alternate interior angles.",
      formulaBreakdown: "Depression θ = Alternate Elevation θ = 30°",
      stepByStep: [
        "Track the logistics drone's approach path.",
        "Tilt the viewing scope downward.",
        "Align the laser scanner at 30° depression.",
        "Submit the tracking code."
      ],
      visualTip: "Lock the scope to 30° depression. Notice that the angle of elevation from the drone to the tower is also 30°."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Drone alternate elevation angle = 30°" },
      { lineNum: 2, textBefore: "Telescope depression angle downward = ", hasInput: true, inputIndex: 0, correctAnswer: "30", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },
  "lvl-apptrig-06": {
    id: "lvl-apptrig-06",
    question: "Perform a high-accuracy canyon scanning sweep. Calibrate the telescope depression angle to exactly 60° downward.",
    inputLabel: "Depression Angle (θ)",
    placeholder: "Type depression angle...",
    correctAnswer: 60,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `Depression θ = ${val}°`,
    formulaDisplay: "Angle of Depression θ = 60°",
    trigMode: "angle",
    trigTargetAngle: 60,
    bookPage: {
      title: "📖 Deep Depression Scans",
      concept: "A larger angle of depression indicates that the target is closer horizontally to the tower base. A 60° depression angle is steep, meaning the object is close to the base.",
      formulaBreakdown: "Depression θ = 60°",
      stepByStep: [
        "Sweep the observation laser steeply downward.",
        "Calibrate the tilt slider to exactly 60°.",
        "Check that the laser intersects the base target.",
        "Submit 60 to verify tracking."
      ],
      visualTip: "Steer the laser scope steeply downwards. A 60° angle of depression targets zones near the tower's base."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Scanner horizontal reference = 0°" },
      { lineNum: 2, textBefore: "Required angle of depression = ", hasInput: true, inputIndex: 0, correctAnswer: "60", placeholder: "deg", textAfter: "°", widthChars: 3 }
    ]
  },

  // ==========================================
  // WORLD 2: Angle of Elevation (Levels 7–12)
  // ==========================================
  "lvl-apptrig-07": {
    id: "lvl-apptrig-07",
    question: "A ground radar observes a mountain peak. The horizontal distance is 50m and the elevation angle is 60°. Calculate the height of the mountain. (Use √3 ≈ 1.732)",
    inputLabel: "Mountain Height (h)",
    placeholder: "Type mountain height...",
    correctAnswer: 86.6,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = Distance × tan(60°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Mountain Elevation 60°",
      concept: "Using the tangent ratio (tan θ = opposite / adjacent), we can find the height of a distant object if we know the horizontal distance and the angle of elevation. tan(60°) = √3 ≈ 1.732.",
      formulaBreakdown: "Height = Base × tan(60°) = 50 × 1.732 = 86.6m",
      stepByStep: [
        "Identify the base distance (50m) and the elevation angle (60°).",
        "Set up the tangent ratio: tan(60°) = Height / 50.",
        "Substitute tan(60°) = √3 ≈ 1.732.",
        "Multiply 50 by 1.732 to find the mountain height: 86.6m."
      ],
      visualTip: "Observe the scaling height: at 60°, height is √3 ≈ 1.732 times the horizontal range!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let the height of the mountain peak be h meters." },
      { lineNum: 2, textBefore: "Horizontal distance from base = 50 m" },
      { lineNum: 3, textBefore: "Angle of elevation = 60°" },
      { lineNum: 4, textBefore: "In right triangle, tan 60° = h / 50" },
      { lineNum: 5, textBefore: "  1.732 = h / 50" },
      { lineNum: 6, textBefore: "  h = 50 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "86.6", placeholder: "h", textAfter: " meters", widthChars: 5 }
    ]
  },
  "lvl-apptrig-08": {
    id: "lvl-apptrig-08",
    question: "An engineer surveys a skyscraper. From a distance of 100m, the angle of elevation to the roof edge is 30°. Find the height of the building. (Use √3 ≈ 1.732, round to 1 decimal place)",
    inputLabel: "Building Height (h)",
    placeholder: "Type building height...",
    correctAnswer: 57.7,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = Distance × tan(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Skyscraper Surveying",
      concept: "When the angle of elevation is 30°, the tangent ratio is 1/√3 ≈ 0.577. The height of the skyscraper is shorter than the horizontal distance.",
      formulaBreakdown: "Height = Base × tan(30°) = 100 × (1 / √3) ≈ 100 / 1.732 = 57.7m",
      stepByStep: [
        "Recall: tan(30°) = 1/√3 ≈ 0.577.",
        "Set up formula: tan(30°) = Height / 100.",
        "Solve: Height = 100 / 1.732 ≈ 57.7m.",
        "Input 57.7 to lock building dimensions."
      ],
      visualTip: "At 30°, the vertical height is shorter than the horizontal distance. It is exactly 1/√3 times the distance."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Skyscraper horizontal range = 100 m" },
      { lineNum: 2, textBefore: "Elevation angle = 30°" },
      { lineNum: 3, textBefore: "tan 30° = Height / 100" },
      { lineNum: 4, textBefore: "Height = 100 / √3 = 100 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "57.7", placeholder: "h", textAfter: " m", widthChars: 4 }
    ]
  },
  "lvl-apptrig-09": {
    id: "lvl-apptrig-09",
    question: "A rescue helicopter spots a stranded climber on a mountain cliff. The distance from the observer ground station to the cliff base is 30m. The climber is at an angle of elevation of 45°. Calculate the climber's height.",
    inputLabel: "Climber Height (h)",
    placeholder: "Type height...",
    correctAnswer: 30,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = Distance × tan(45°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 The 45° Angle Sweet Spot",
      concept: "For an angle of elevation of 45°, the opposite side is exactly equal to the adjacent side since tan(45°) = 1.",
      formulaBreakdown: "Height = Distance × tan(45°) = 30 × 1 = 30m",
      stepByStep: [
        "Identify the horizontal distance = 30m.",
        "Identify the elevation angle = 45°.",
        "tan(45°) = Height / Distance => 1 = Height / 30.",
        "Height = 30m. Submit 30 to unlock the helicopter rescue coordinates."
      ],
      visualTip: "At 45°, the triangle is isosceles right-angled. The height and the base distance are equal!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Cliff base distance = 30 m" },
      { lineNum: 2, textBefore: "Climber elevation = 45°" },
      { lineNum: 3, textBefore: "tan 45° = height / 30" },
      { lineNum: 4, textBefore: "height = 30 × 1 = ", hasInput: true, inputIndex: 0, correctAnswer: "30", placeholder: "h", textAfter: " meters", widthChars: 3 }
    ]
  },
  "lvl-apptrig-10": {
    id: "lvl-apptrig-10",
    question: "Guide a survey drone to a skyscraper rooftop target. The drone is at a horizontal distance of 60m and reads an elevation angle of 60° to the roof edge. Find the height of the rooftop. (Use √3 ≈ 1.732)",
    inputLabel: "Rooftop Height (h)",
    placeholder: "Type rooftop height...",
    correctAnswer: 103.9,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 60 × tan(60°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Rooftop Elevation",
      concept: "Angle of elevation of 60° means the vertical height is √3 times the base range. h = d × tan(60°).",
      formulaBreakdown: "Height = 60 × √3 = 60 × 1.732 = 103.92m",
      stepByStep: [
        "Drone horizontal offset = 60m.",
        "Elevation scan angle = 60°.",
        "Formula: Height = 60 × tan(60°) = 60 × 1.732 = 103.92m.",
        "Submit 103.9 as the correct height."
      ],
      visualTip: "A 60° climb line indicates a height of 103.9m for a 60m base range."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Skyscraper base range = 60 m" },
      { lineNum: 2, textBefore: "Rooftop elevation angle = 60°" },
      { lineNum: 3, textBefore: "tan 60° = height / 60" },
      { lineNum: 4, textBefore: "height = 60 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "103.9", placeholder: "h", textAfter: " m", widthChars: 5 }
    ]
  },
  "lvl-apptrig-11": {
    id: "lvl-apptrig-11",
    question: "Estimate the height of a communication tower. An engineer standing 150m from the tower base measures the angle of elevation of the tower top as 30°. (Use √3 ≈ 1.732)",
    inputLabel: "Tower Height (h)",
    placeholder: "Type tower height...",
    correctAnswer: 86.6,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 150 × tan(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Communication Tower Calibration",
      concept: "For a 30° elevation from 150m, the opposite height h = 150 × tan(30°). Since tan(30°) = 1/√3, h = 150 / √3.",
      formulaBreakdown: "Height = 150 / 1.732 = 86.6m",
      stepByStep: [
        "Horizontal range = 150m.",
        "Angle of elevation = 30°.",
        "h = 150 × (1 / √3) = 150 / 1.732 ≈ 86.6m.",
        "Submit 86.6."
      ],
      visualTip: "At 30°, the laser range is longer than the vertical climb height. The height resolves to 86.6m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Horizontal baseline = 150 m" },
      { lineNum: 2, textBefore: "Top angle of elevation = 30°" },
      { lineNum: 3, textBefore: "tan 30° = h / 150" },
      { lineNum: 4, textBefore: "h = 150 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "86.6", placeholder: "h", textAfter: " meters", widthChars: 5 }
    ]
  },
  "lvl-apptrig-12": {
    id: "lvl-apptrig-12",
    question: "Timed elevation pulse. Set the height of the perpendicular laser line to match a 40m base distance when the angle of elevation is exactly 45°.",
    inputLabel: "Height (h)",
    placeholder: "Type laser height...",
    correctAnswer: 40,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 40 × tan(45°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Level 12: Timed Elevation Challenge",
      concept: "At 45° elevation, vertical height is identical to horizontal range. h = base × tan(45°) = base × 1.",
      formulaBreakdown: "Height = 40 × 1 = 40m",
      stepByStep: [
        "Note the base distance is 40m.",
        "Aim for a 45° elevation sweep.",
        "The target vertical height is exactly 40m.",
        "Enter 40 to pass the final elevation stage."
      ],
      visualTip: "Set the vertical laser slide to 40. Notice how the elevation sweep locks perfectly at 45°."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Base target range = 40 m" },
      { lineNum: 2, textBefore: "Elevation sweep angle = 45°" },
      { lineNum: 3, textBefore: "Perpendicular laser height = ", hasInput: true, inputIndex: 0, correctAnswer: "40", placeholder: "h", textAfter: " m", widthChars: 3 }
    ]
  },

  // ==========================================
  // WORLD 3: Angle of Depression (Levels 13–18)
  // ==========================================
  "lvl-apptrig-13": {
    id: "lvl-apptrig-13",
    question: "From a 100m high observation deck, an engineer spots a moving robot vehicle below. If the angle of depression is 30°, calculate the horizontal distance to the vehicle. (Use √3 ≈ 1.732)",
    inputLabel: "Horizontal Distance (d)",
    placeholder: "Type horizontal distance...",
    correctAnswer: 173.2,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = Height / tan(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Distances from Depression",
      concept: "The angle of depression is measured downward from the horizontal line of sight of the observer. Alternate interior angles show that the angle of elevation from the target to the observer is equal to this angle of depression.",
      formulaBreakdown: "Distance = Height / tan(30°) = 100 / (1/√3) = 100 × √3 ≈ 173.2m",
      stepByStep: [
        "Angle of depression = 30° downward.",
        "This implies the angle of elevation from the vehicle to the deck is 30°.",
        "Use the tangent ratio: tan(30°) = Height / Distance = 100 / d.",
        "Solve: d = 100 / tan(30°) = 100 × 1.732 = 173.2m."
      ],
      visualTip: "Look at the orange laser sweep: a 30° angle of depression extends the horizontal distance to 173.2m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let the horizontal range of the vehicle be x meters." },
      { lineNum: 2, textBefore: "Deck height = 100 m, Angle of depression = 30°" },
      { lineNum: 3, textBefore: "By alternate interior angles, angle of elevation = 30°" },
      { lineNum: 4, textBefore: "In right triangle, tan 30° = 100 / x" },
      { lineNum: 5, textBefore: "  1/1.732 = 100 / x" },
      { lineNum: 6, textBefore: "  x = 100 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "173.2", placeholder: "x", textAfter: " meters", widthChars: 5 }
    ]
  },
  "lvl-apptrig-14": {
    id: "lvl-apptrig-14",
    question: "A rescue helicopter hovers at a height of 120m. The pilot locates a drop zone below at an angle of depression of 45°. Find the horizontal range to the drop zone.",
    inputLabel: "Horizontal Range (d)",
    placeholder: "Type horizontal range...",
    correctAnswer: 120,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 120 / tan(45°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Helicopter Drop Zone",
      concept: "An angle of depression of 45° implies the observer's height is identical to the target's horizontal range. tan(45°) = height / distance = 1.",
      formulaBreakdown: "Distance = 120 / 1 = 120m",
      stepByStep: [
        "Observer height = 120m.",
        "Angle of depression = 45°.",
        "Alternate interior angle of elevation = 45°.",
        "Distance = 120 / tan(45°) = 120m.",
        "Enter 120 as the horizontal distance."
      ],
      visualTip: "At 45° depression, the horizontal distance to the landing target is exactly equal to the helicopter's altitude."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Helicopter altitude = 120 m" },
      { lineNum: 2, textBefore: "Angle of depression = 45°" },
      { lineNum: 3, textBefore: "tan 45° = 120 / distance" },
      { lineNum: 4, textBefore: "distance = 120 / 1 = ", hasInput: true, inputIndex: 0, correctAnswer: "120", placeholder: "d", textAfter: " m", widthChars: 3 }
    ]
  },
  "lvl-apptrig-15": {
    id: "lvl-apptrig-15",
    question: "From the summit of a 300m high mountain, a surveyor monitors a valley station. If the angle of depression is 60°, find the horizontal distance to the station. (Use √3 ≈ 1.732)",
    inputLabel: "Horizontal Distance (d)",
    placeholder: "Type distance...",
    correctAnswer: 173.2,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 300 / tan(60°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Deep Valley Observations",
      concept: "A steep angle of depression of 60° means the horizontal distance is shorter than the height. d = height / tan(60°) = height / √3.",
      formulaBreakdown: "Distance = 300 / 1.732 = 173.2m",
      stepByStep: [
        "Mountain peak height = 300m.",
        "Depression scan angle = 60°.",
        "Formula: d = 300 / √3 = 300 / 1.732.",
        "Calculate d ≈ 173.2m.",
        "Submit 173.2 to verify valley telemetry."
      ],
      visualTip: "At 60° depression, the horizontal distance is shorter, resolving to 173.2m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Peak elevation height = 300 m" },
      { lineNum: 2, textBefore: "Valley depression angle = 60°" },
      { lineNum: 3, textBefore: "tan 60° = 300 / distance" },
      { lineNum: 4, textBefore: "distance = 300 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "173.2", placeholder: "d", textAfter: " meters", widthChars: 5 }
    ]
  },
  "lvl-apptrig-16": {
    id: "lvl-apptrig-16",
    question: "From the lantern deck of an 80m high lighthouse, the angle of depression of a cargo ship is 30°. Find the distance of the ship from the base of the lighthouse. (Use √3 ≈ 1.732)",
    inputLabel: "Ship Distance (d)",
    placeholder: "Type ship distance...",
    correctAnswer: 138.6,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 80 / tan(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Lighthouse Ship Observation",
      concept: "The lighthouse observer looks down at 30°. The horizontal distance is longer than the height of the lighthouse. d = height × √3.",
      formulaBreakdown: "Distance = 80 × 1.732 = 138.56m ≈ 138.6m",
      stepByStep: [
        "Lighthouse deck height = 80m.",
        "Depression angle = 30°.",
        "d = 80 / tan(30°) = 80 × √3 = 80 × 1.732.",
        "Multiply to get 138.56m, rounded to 138.6m."
      ],
      visualTip: "A 30° depression angle means the horizontal ocean range is √3 times the lighthouse height, giving 138.6m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Lighthouse tower height = 80 m" },
      { lineNum: 2, textBefore: "Depression angle to cargo ship = 30°" },
      { lineNum: 3, textBefore: "tan 30° = 80 / distance" },
      { lineNum: 4, textBefore: "distance = 80 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "138.6", placeholder: "d", textAfter: " m", widthChars: 5 }
    ]
  },
  "lvl-apptrig-17": {
    id: "lvl-apptrig-17",
    question: "An observer on a 60m high cliff spots a research rover. The angle of depression is 45°. Calculate the horizontal distance to the rover.",
    inputLabel: "Rover Distance (d)",
    placeholder: "Type rover distance...",
    correctAnswer: 60,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 60 / tan(45°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Rover Cliff Tracking",
      concept: "Angle of depression of 45° corresponds to an isosceles right triangle, meaning horizontal distance equals vertical cliff height.",
      formulaBreakdown: "Distance = 60 / tan(45°) = 60m",
      stepByStep: [
        "Cliff height = 60m.",
        "Depression angle = 45°.",
        "d = 60 / 1 = 60m.",
        "Submit 60 as the answer."
      ],
      visualTip: "At 45° depression, the distance to the base is exactly equal to the height of the cliff."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Cliff vertical height = 60 m" },
      { lineNum: 2, textBefore: "Depression tracking angle = 45°" },
      { lineNum: 3, textBefore: "tan 45° = 60 / distance" },
      { lineNum: 4, textBefore: "distance = 60 / 1 = ", hasInput: true, inputIndex: 0, correctAnswer: "60", placeholder: "d", textAfter: " m", widthChars: 3 }
    ]
  },
  "lvl-apptrig-18": {
    id: "lvl-apptrig-18",
    question: "From a 50m watchtower, a boundary marker is scanned. If the scanner tilt angle of depression is 60°, find the horizontal range. (Use √3 ≈ 1.732, round to 1 decimal place)",
    inputLabel: "Horizontal Range (d)",
    placeholder: "Type horizontal range...",
    correctAnswer: 28.9,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 50 / tan(60°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Watchtower Boundary Scan",
      concept: "For a steep 60° depression angle, the horizontal range is height divided by √3. d = 50 / 1.732 ≈ 28.87m.",
      formulaBreakdown: "Distance = 50 / tan(60°) = 50 / 1.732 ≈ 28.9m",
      stepByStep: [
        "Identify height = 50m.",
        "Identify depression angle = 60°.",
        "d = 50 / √3 = 50 / 1.732 ≈ 28.87m.",
        "Round to 28.9m and submit."
      ],
      visualTip: "A 60° angle of depression restricts the scan range to just 28.9m from the watchtower base."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Watchtower scan height = 50 m" },
      { lineNum: 2, textBefore: "Scanner angle of depression = 60°" },
      { lineNum: 3, textBefore: "tan 60° = 50 / range" },
      { lineNum: 4, textBefore: "range = 50 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "28.9", placeholder: "d", textAfter: " meters", widthChars: 4 }
    ]
  },

  // ==========================================
  // WORLD 4: Heights & Distances (Levels 19–24)
  // ==========================================
  "lvl-apptrig-19": {
    id: "lvl-apptrig-19",
    question: "A vertical communication antenna stands on ground. From a point 90m away from the base, the angle of elevation of its top is 30°. Find the height. (Use √3 ≈ 1.732)",
    inputLabel: "Antenna Height (h)",
    placeholder: "Type antenna height...",
    correctAnswer: 52.0,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 90 × tan(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Vertical Antenna Height",
      concept: "Heights and distances problems require translating word descriptions into right-angled triangles and applying trigonometric ratios.",
      formulaBreakdown: "h = 90 × tan(30°) = 90 / √3 = 30√3 ≈ 51.96m ≈ 52.0m",
      stepByStep: [
        "Base distance = 90m.",
        "Elevation angle = 30°.",
        "h = 90 × (1 / √3) = 90 / 1.732 ≈ 51.96m.",
        "Enter 52.0 as the correct height."
      ],
      visualTip: "Draw the horizontal distance 90m, vertical height h, and angle of elevation 30°."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Distance from base of antenna = 90 m" },
      { lineNum: 2, textBefore: "Angle of elevation of top = 30°" },
      { lineNum: 3, textBefore: "tan 30° = height / 90" },
      { lineNum: 4, textBefore: "height = 90 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "52.0", placeholder: "h", textAfter: " meters", widthChars: 4 }
    ]
  },
  "lvl-apptrig-20": {
    id: "lvl-apptrig-20",
    question: "A surveying drone measures the height of a mountain peak. From a horizontal baseline distance of 200m, the angle of elevation to the peak is 60°. Calculate the height. (Use √3 ≈ 1.732)",
    inputLabel: "Mountain Height (h)",
    placeholder: "Type height...",
    correctAnswer: 346.4,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 200 × tan(60°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Surveying Mountain Peaks",
      concept: "At 60° elevation, the height is √3 times the horizontal range: h = base × √3.",
      formulaBreakdown: "Height = 200 × 1.732 = 346.4m",
      stepByStep: [
        "Base range = 200m.",
        "Elevation angle = 60°.",
        "h = 200 × tan(60°) = 200 × √3 = 200 × 1.732 = 346.4m.",
        "Enter 346.4."
      ],
      visualTip: "Notice how the laser sight stretches to 346.4m to clear the 60° elevation line."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Survey distance to peak = 200 m" },
      { lineNum: 2, textBefore: "Peak elevation angle = 60°" },
      { lineNum: 3, textBefore: "tan 60° = height / 200" },
      { lineNum: 4, textBefore: "height = 200 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "346.4", placeholder: "h", textAfter: " m", widthChars: 5 }
    ]
  },
  "lvl-apptrig-21": {
    id: "lvl-apptrig-21",
    question: "A surveyor measures a canyon crossing width. The canyon depth is 150m. If the angle of depression from the edge to the opposite base is 45°, calculate the canyon width.",
    inputLabel: "Canyon Width (w)",
    placeholder: "Type width...",
    correctAnswer: 150,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `w = ${val}m`,
    formulaDisplay: "w = 150 / tan(45°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Canyon Crossing Surveying",
      concept: "When targeting across a gorge at 45° depression, the width of the gorge is equal to the depth. tan(45°) = depth / width = 1.",
      formulaBreakdown: "Width = 150 / 1 = 150m",
      stepByStep: [
        "Canyon vertical depth = 150m.",
        "Survey depression angle = 45°.",
        "Canyon width = 150 / tan(45°) = 150m.",
        "Submit 150."
      ],
      visualTip: "At 45° depression, the canyon width matches the 150m depth perfectly."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Canyon vertical depth = 150 m" },
      { lineNum: 2, textBefore: "Angle of depression = 45°" },
      { lineNum: 3, textBefore: "tan 45° = 150 / width" },
      { lineNum: 4, textBefore: "width = 150 / 1 = ", hasInput: true, inputIndex: 0, correctAnswer: "150", placeholder: "w", textAfter: " m", widthChars: 3 }
    ]
  },
  "lvl-apptrig-22": {
    id: "lvl-apptrig-22",
    question: "A bridge support truss is being aligned. The horizontal width from the anchor is 120m. The required elevation angle of the support beam is 30°. Find the vertical height of the truss. (Use √3 ≈ 1.732)",
    inputLabel: "Truss Height (h)",
    placeholder: "Type height...",
    correctAnswer: 69.3,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 120 × tan(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Bridge Truss Support",
      concept: "Truss heights are solved using the 30° tangent ratio. h = width × tan(30°) = 120 / √3 = 40√3.",
      formulaBreakdown: "Height = 120 × (1/1.732) ≈ 69.28m ≈ 69.3m",
      stepByStep: [
        "Horizontal anchor distance = 120m.",
        "Truss inclination angle = 30°.",
        "h = 120 / √3 = 120 / 1.732 ≈ 69.28m.",
        "Submit 69.3."
      ],
      visualTip: "A 30° tilt at 120m horizontal width aligns the support height to 69.3m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Bridge horizontal span = 120 m" },
      { lineNum: 2, textBefore: "Support inclination elevation = 30°" },
      { lineNum: 3, textBefore: "tan 30° = height / 120" },
      { lineNum: 4, textBefore: "height = 120 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "69.3", placeholder: "h", textAfter: " m", widthChars: 4 }
    ]
  },
  "lvl-apptrig-23": {
    id: "lvl-apptrig-23",
    question: "A surveyor observes a target tower. From a distance of 50m, the angle of elevation of the top of the tower is 45°. Calculate the height of the tower.",
    inputLabel: "Tower Height (h)",
    placeholder: "Type tower height...",
    correctAnswer: 50,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 50 × tan(45°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Multi-Point Surveying",
      concept: "For standard elevation at 45°, opposite side matches adjacent side. h = base × tan(45°).",
      formulaBreakdown: "Height = 50 × 1 = 50m",
      stepByStep: [
        "Horizontal range = 50m.",
        "Elevation angle = 45°.",
        "h = 50 × tan(45°) = 50 × 1 = 50m.",
        "Enter 50."
      ],
      visualTip: "An elevation angle of 45° indicates that the target height matches the horizontal range of 50m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Horizontal baseline = 50 m" },
      { lineNum: 2, textBefore: "Elevation angle to top = 45°" },
      { lineNum: 3, textBefore: "tan 45° = height / 50" },
      { lineNum: 4, textBefore: "height = 50 × 1 = ", hasInput: true, inputIndex: 0, correctAnswer: "50", placeholder: "h", textAfter: " meters", widthChars: 3 }
    ]
  },
  "lvl-apptrig-24": {
    id: "lvl-apptrig-24",
    question: "From the top of a 75m high lighthouse, the angles of depression of two ships in line are 30° and 45°. Find the distance between the two ships. (Use √3 ≈ 1.732)",
    inputLabel: "Distance Between Ships (d)",
    placeholder: "Type distance...",
    correctAnswer: 55,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 75 × (√3 - 1)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Two-Ship Depression Challenge",
      concept: "This multi-step height problem requires analyzing two right-angled triangles sharing the same perpendicular lighthouse height. Distance = horizontal range for 30° minus horizontal range for 45°.",
      formulaBreakdown: "d = 75√3 - 75 = 75 × (1.732 - 1) = 75 × 0.732 = 54.9m ≈ 55m",
      stepByStep: [
        "Let ships be at distances x and y from the lighthouse base.",
        "For ship 1 (45°): tan(45°) = 75 / x => x = 75m.",
        "For ship 2 (30°): tan(30°) = 75 / y => y = 75√3 ≈ 130m.",
        "The distance between them is y - x = 130 - 75 = 55m."
      ],
      visualTip: "Observe the two ships: one is closer at 75m, the other is farther at 130m. The gap is 55m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Lighthouse height = 75 m" },
      { lineNum: 2, textBefore: "Distance to closer ship (45°): x = 75 / tan 45° = 75 m" },
      { lineNum: 3, textBefore: "Distance to farther ship (30°): y = 75 / tan 30° = 75√3 ≈ 130 m" },
      { lineNum: 4, textBefore: "Distance between ships = 130 - 75 = ", hasInput: true, inputIndex: 0, correctAnswer: "55", placeholder: "d", textAfter: " meters", widthChars: 3 }
    ]
  },

  // ==========================================
  // WORLD 5: Survey Commander (Levels 25–30)
  // ==========================================
  "lvl-apptrig-25": {
    id: "lvl-apptrig-25",
    question: "A rescue helicopter hovering at 150m observes two stranded climbers on opposite sides of a peak. If the angles of depression of the climbers are 45° and 30°, calculate the total distance between them. (Use √3 ≈ 1.732)",
    inputLabel: "Distance Between Climbers (d)",
    placeholder: "Type distance...",
    correctAnswer: 410,
    tolerance: 1.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 150 × (1 + √3)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Stranded Climber Rescue",
      concept: "When targets are on opposite sides, their horizontal ranges from the height baseline are added. Total distance = distance A + distance B.",
      formulaBreakdown: "d = 150 / tan(45°) + 150 / tan(30°) = 150 + 150√3 ≈ 150 + 260 = 410m",
      stepByStep: [
        "Climber A (45°): Distance = 150 / tan(45°) = 150m.",
        "Climber B (30°): Distance = 150 / tan(30°) = 150√3 ≈ 260m.",
        "Total distance = 150 + 260 = 410m.",
        "Submit 410."
      ],
      visualTip: "Sum the base distances of the two triangles on opposite sides: 150m (left) + 260m (right) = 410m total."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Helicopter height = 150 m" },
      { lineNum: 2, textBefore: "Distance A (45°): x = 150 / tan 45° = 150 m" },
      { lineNum: 3, textBefore: "Distance B (30°): y = 150 / tan 30° = 150 × 1.732 = 260 m" },
      { lineNum: 4, textBefore: "Total distance = x + y = 150 + 260 = ", hasInput: true, inputIndex: 0, correctAnswer: "410", placeholder: "d", textAfter: " meters", widthChars: 3 }
    ]
  },
  "lvl-apptrig-26": {
    id: "lvl-apptrig-26",
    question: "Drones Alpha and Beta hover vertically above each other. From a point 100m away on the ground, their elevation angles are 45° and 60° respectively. Find the vertical distance between them. (Use √3 ≈ 1.732)",
    inputLabel: "Vertical Distance (d)",
    placeholder: "Type vertical distance...",
    correctAnswer: 73.2,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `d = ${val}m`,
    formulaDisplay: "d = 100 × (√3 - 1)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Stacked Observers",
      concept: "Two objects stacked vertically share the same horizontal base. The height of the higher object is base × tan(60°), and the lower is base × tan(45°).",
      formulaBreakdown: "Vertical Gap = 100 × tan(60°) - 100 × tan(45°) = 100√3 - 100 = 100 × 1.732 - 100 = 73.2m",
      stepByStep: [
        "Horizontal baseline distance = 100m.",
        "Drone Beta height (60°): h₂ = 100 × √3 ≈ 173.2m.",
        "Drone Alpha height (45°): h₁ = 100 × tan(45°) = 100m.",
        "Vertical distance = 173.2 - 100 = 73.2m."
      ],
      visualTip: "Calculate the height of both drones: 173.2m and 100m. The difference between them is 73.2m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Horizontal baseline distance = 100 m" },
      { lineNum: 2, textBefore: "Height of Drone Alpha (45°): h1 = 100 m" },
      { lineNum: 3, textBefore: "Height of Drone Beta (60°): h2 = 100√3 ≈ 173.2 m" },
      { lineNum: 4, textBefore: "Vertical gap between drones = 173.2 - 100 = ", hasInput: true, inputIndex: 0, correctAnswer: "73.2", placeholder: "d", textAfter: " meters", widthChars: 4 }
    ]
  },
  "lvl-apptrig-27": {
    id: "lvl-apptrig-27",
    question: "The angle of depression of a runway threshold from an airplane at a height of 600m is 30°. Find the line-of-sight slant distance the plane must fly to land.",
    inputLabel: "Slant Distance (s)",
    placeholder: "Type slant range...",
    correctAnswer: 1200,
    tolerance: 1.0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `s = ${val}m`,
    formulaDisplay: "s = Height / sin(30°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Airport Glide Slant",
      concept: "Slant range is the hypotenuse of the right-angled triangle. To solve for hypotenuse when height (opposite) is known, use the sine ratio: sin θ = opposite / hypotenuse.",
      formulaBreakdown: "Slant = Height / sin(30°) = 600 / 0.5 = 1200m",
      stepByStep: [
        "Altitude = 600m.",
        "Angle of depression = 30° => Angle of elevation = 30°.",
        "Set up sine: sin(30°) = 600 / Slant.",
        "Since sin(30°) = 0.5, Slant = 600 / 0.5 = 1200m."
      ],
      visualTip: "At a 30° descent glide, the slant path the airplane flies is exactly double its altitude (1200m)."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Airplane altitude height = 600 m" },
      { lineNum: 2, textBefore: "Descent angle of depression = 30°" },
      { lineNum: 3, textBefore: "sin 30° = 600 / Slant" },
      { lineNum: 4, textBefore: "Slant = 600 / 0.5 = ", hasInput: true, inputIndex: 0, correctAnswer: "1200", placeholder: "s", textAfter: " m", widthChars: 4 }
    ]
  },
  "lvl-apptrig-28": {
    id: "lvl-apptrig-28",
    question: "A fire escape ladder must reach a window at a height of 15m. If the maximum safe tilt angle (elevation) is 60°, find the minimum required length of the ladder. (Use √3 ≈ 1.732)",
    inputLabel: "Ladder Length (l)",
    placeholder: "Type ladder length...",
    correctAnswer: 17.32,
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `l = ${val}m`,
    formulaDisplay: "l = Height / sin(60°)",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Rescue Ladder Alignment",
      concept: "Calculating hypotenuse (ladder length) from opposite height using the sine of 60°. Length = Height / sin(60°) = 15 / (√3/2).",
      formulaBreakdown: "Length = 30 / √3 = 10√3 = 10 × 1.732 = 17.32m",
      stepByStep: [
        "Target window height = 15m.",
        "Ladder elevation angle = 60°.",
        "sin(60°) = Height / Length => √3/2 = 15 / Length.",
        "Length = 30 / √3 = 30 / 1.732 ≈ 17.32m."
      ],
      visualTip: "At a 60° tilt, the required ladder length resolves to 17.32m to reach the 15m high window."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Window target height = 15 m" },
      { lineNum: 2, textBefore: "Safe ladder elevation tilt = 60°" },
      { lineNum: 3, textBefore: "sin 60° = 15 / Length" },
      { lineNum: 4, textBefore: "Length = 30 / 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "17.32", placeholder: "l", textAfter: " meters", widthChars: 5 }
    ]
  },
  "lvl-apptrig-29": {
    id: "lvl-apptrig-29",
    question: "Two poles of equal heights are standing opposite each other on either side of an 80m wide highway. From a point between them on the road, the angles of elevation of the tops of the poles are 60° and 30° respectively. Find the height of the poles. (Use √3 ≈ 1.732)",
    inputLabel: "Pole Height (h)",
    placeholder: "Type height...",
    correctAnswer: 34.64,
    tolerance: 0.2,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 20 × √3",
    trigMode: "heights_distances",
    bookPage: {
      title: "📖 Highway Poles Challenge",
      concept: "Two equal heights h separated by a width of 80m. The point divides the base into x and 80-x. Set up two tangent ratios to solve for h.",
      formulaBreakdown: "x = h/√3, 80 - x = h√3. Adding them: 80 = h(1/√3 + √3) = h(4/√3) => h = 20√3 ≈ 34.64m",
      stepByStep: [
        "Let the pole height be h meters.",
        "Distance to pole 1 (60°): x = h / √3.",
        "Distance to pole 2 (30°): 80 - x = h × √3.",
        "Add: 80 = h/√3 + h√3 = h(4/√3).",
        "h = 20√3 = 20 × 1.732 = 34.64m."
      ],
      visualTip: "For equal pole heights, the observation point divides the 80m highway into 20m (near the 60° pole) and 60m (near the 30° pole). The pole height is 34.64m."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Highway total width = 80 m, Pole height = h" },
      { lineNum: 2, textBefore: "Distance from 60° pole to point: x = h / √3" },
      { lineNum: 3, textBefore: "Distance from 30° pole to point: 80 - x = h√3" },
      { lineNum: 4, textBefore: "Substitute: 80 - h/√3 = h√3 => 80 = h(4/√3)" },
      { lineNum: 5, textBefore: "h = 20√3 = 20 × 1.732 = ", hasInput: true, inputIndex: 0, correctAnswer: "34.64", placeholder: "h", textAfter: " meters", widthChars: 5 }
    ]
  },
  "lvl-apptrig-30": {
    id: "lvl-apptrig-30",
    question: "The angle of elevation of a cloud from a point 60m above a lake is 30°, and the angle of depression of its reflection in the lake is 60°. Calculate the height of the cloud above the lake.",
    inputLabel: "Cloud Height (h)",
    placeholder: "Type cloud height...",
    correctAnswer: 120,
    tolerance: 0.5,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `h = ${val}m`,
    formulaDisplay: "h = 60 × (3 + 1) / 2 = 120m",
    trigMode: "boss",
    bookPage: {
      title: "📖 Lake Cloud Reflection: The Final Boss",
      concept: "This classic NCERT problem uses a horizontal coordinate offset 60m above a lake. The cloud is at height h above the water level, so its reflection is at depth h below the water level.",
      formulaBreakdown: "h = 60 × (tan 60° + tan 30°) / (tan 60° - tan 30°) = 120m",
      stepByStep: [
        "Let cloud height above lake = h. Let horizontal distance = x.",
        "Height of cloud above observer = h - 60.",
        "Depth of reflection below observer = h + 60.",
        "Equation 1: tan(30°) = (h - 60) / x => x = (h - 60)√3.",
        "Equation 2: tan(60°) = (h + 60) / x => x = (h + 60)/√3.",
        "Equate: (h - 60)√3 = (h + 60)/√3 => 3(h - 60) = h + 60.",
        "3h - 180 = h + 60 => 2h = 240 => h = 120m."
      ],
      visualTip: "Observe the reflection lines. The cloud floats 120m high above the lake surface, and its reflection matches at 120m depth."
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Let cloud height above water be h meters." },
      { lineNum: 2, textBefore: "Observer elevation = 60m above lake level." },
      { lineNum: 3, textBefore: "From 30° elevation: x = (h - 60)√3" },
      { lineNum: 4, textBefore: "From 60° depression: x = (h + 60)/√3" },
      { lineNum: 5, textBefore: "Equating: (h - 60)√3 = (h + 60)/√3" },
      { lineNum: 6, textBefore: "  3(h - 60) = h + 60 => 2h = 240" },
      { lineNum: 7, textBefore: "  Cloud Height h = ", hasInput: true, inputIndex: 0, correctAnswer: "120", placeholder: "h", textAfter: " meters", widthChars: 3 }
    ]
  }
};

export default applicationsTrigSpecs;
