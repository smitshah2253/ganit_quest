import surfaceAreaVolumeSpecs from './specs/surfaceAreaVolumeSpecs';
import coordinateGeometrySpecs from './specs/coordinateGeometrySpecs';
import trigonometrySpecs from './specs/trigonometrySpecs';
import applicationsTrigSpecs from './specs/applicationsTrigSpecs';
import arithmeticProgressionSpecs from './specs/arithmeticProgressionSpecs';
import probabilitySpecs from './specs/probabilitySpecs';
import trianglesSpecs from './specs/trianglesSpecs';
import circleSpecs from './specs/circleSpecs';
import areasCircleSpecs from './specs/areasCircleSpecs';
import statisticsSpecs from './specs/statisticsSpecs';
import realNumbersSpecs from './specs/realNumbersSpecs';
import polynomialSpecs from './specs/polynomialSpecs';
import linearEquationsSpecs from './specs/linearEquationsSpecs';

export interface BookPage {
  title: string;
  concept: string;
  formulaBreakdown: string;
  stepByStep: string[];
  visualTip: string;
  analogy?: string;
}

export interface BoardExamLine {
  lineNum: number;
  textBefore?: string;
  textAfter?: string;
  hasInput?: boolean;
  inputIndex?: number;
  placeholder?: string;
  correctAnswer?: string;
  widthChars?: number;
  hint?: string;
  xpReward?: number;
  boss?: boolean;
}

export interface LevelSpecification {
  id: string;
  chapterId?: string;
  world?: number;
  question: string;
  title?: string;
  description?: string;
  hint?: string;
  xpReward?: number;
  boss?: boolean;
  starsNeeded?: number;
  inputLabel: string;
  placeholder: string;
  correctAnswer: number;
  tolerance: number;
  calculateValue: (input: number) => number;
  getDimensionsLabel: (input: number) => string;
  formulaDisplay: string;
  bookPage: BookPage;
  boardExamLines?: BoardExamLine[];
  // Extended Coordinate Geometry properties
  points?: Array<{ x: number, y: number, label: string, draggable?: boolean }>;
  lineConnections?: Array<[number, number]>;
  targetCoord?: { x: number, y: number };
  // Extended Trigonometry properties
  trigMode?: 'angle' | 'ratio' | 'identity' | 'complementary' | 'heights_distances' | 'boss';
  trigTargetAngle?: number;
  trigTargetRatio?: number;
  trigAdjacent?: number;
  trigOpposite?: number;
  trigHypotenuse?: number;
  trigFormulaType?: 'sin' | 'cos' | 'tan' | 'cosec' | 'sec' | 'cot' | 'identity' | 'complementary' | 'heights';
  // Extended Arithmetic Progression properties
  apMode?: 'pattern' | 'difference' | 'nth_term' | 'sum' | 'realworld' | 'boss';
  apFirstTerm?: number;
  apCommonDiff?: number;
  apN?: number;
  apSequence?: (number | null)[];
  apAnswerType?: 'term' | 'difference' | 'sum' | 'position';
  // Extended Probability properties
  probMode?: 'coin' | 'two_coin' | 'dice' | 'two_dice' | 'card' | 'bag' | 'formula' | 'boss';
  probSampleSpace?: string[];
  probFavorable?: string[];
  probTotalOutcomes?: number;
  probFavorableCount?: number;
  probAnswerType?: 'favorable_count' | 'total_count' | 'decimal';
  probBagColors?: { color: string; count: number; hex: number; isFav?: boolean }[];
  // Extended Areas Related to Circles properties
  visualType?: string;
  simulationParams?: {
    radius?: number;
    targetRadius?: number;
    angle?: number;
    innerRadius?: number;
    outerRadius?: number;
    diameter?: number;
    arcLength?: number;
    circumference?: number;
    targetCircumference?: number;
    sectorArea?: number;
    perimeter?: number;
    targetArea?: number;
    radii?: number[];
    rotations?: number;
    trackWidth?: number;
    gardenRadius?: number;
    quadrants?: number;
    quadrantRadius?: number;
    semicircleRadius?: number;
    overlapAngle?: number;
    thickness?: number;
    totalTrack?: number;
    tolerance?: number;
    initialRadius?: number;
    squareSide?: number;
    fillAnimation?: boolean;
    showCircumference?: boolean;
    showRotation?: boolean;
  };
  // Extended Statistics properties
  statsMode?: 'collection' | 'frequency' | 'intervals' | 'cumulative' | 'median' | 'boss';
  statsData?: number[];
  statsIntervals?: { min: number, max: number, freq: number }[];
  statsCategories?: string[];
  statsTargetMedian?: number;
  statsAnswerType?: 'value' | 'frequency' | 'interval' | 'median' | 'cumulative';
  
  // Allow arbitrary additional properties for specific modes (like polyMode, rnMode, etc.)
  [key: string]: any;
}

const defaultBookPage = (title: string, shape: string, formula: string, inputName: string): BookPage => ({
  title: title,
  concept: `Volume / Surface Area of a ${shape} measures its three-dimensional capacity or outer boundary. In this challenge, your goal is to find the exact ${inputName} that achieves our target.`,
  formulaBreakdown: `Formula: ${formula}`,
  stepByStep: [
    `Identify the target value required from the question.`,
    `Apply the mathematical formula for the shape.`,
    `Substitute the given values into the equation.`,
    `Solve the equation to find the unknown ${inputName}.`,
    `Use your interactive model to verify your answer matches the target.`,
  ],
  visualTip: `Adjust the ${inputName} in the interactive model until the calculated value matches the target.`,
});

const specs: Record<string, LevelSpecification> = {
  ...surfaceAreaVolumeSpecs,
  ...coordinateGeometrySpecs,
  ...trigonometrySpecs,
  ...applicationsTrigSpecs,
  ...arithmeticProgressionSpecs,
  ...probabilitySpecs,
  ...trianglesSpecs,
  ...circleSpecs,
  ...areasCircleSpecs,
  ...statisticsSpecs,
  ...realNumbersSpecs,
  ...polynomialSpecs,
  ...linearEquationsSpecs,
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
      inputLabel
    )
  };
};
