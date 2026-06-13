import type { LevelSpecification, BookPage } from '../levelSpecs';

const generateData = (count: number, min: number, max: number): number[] => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

const createStatsBookPage = (title: string, conceptText: string): BookPage => ({
  title,
  concept: conceptText,
  formulaBreakdown: 'Analyze the given dataset in the Data City Command Center.',
  stepByStep: [
    'Observe the incoming data points in the HUD.',
    'Follow the objective displayed on the right panel.',
    'Use the interactive data tools (drag-and-drop, sliders) to organize or analyze the data.',
    'Input your final calculation to complete the mission.'
  ],
  visualTip: 'Watch out for neon glowing indicators which highlight anomalies or important data clusters.',
  analogy: 'Think of yourself as a City Analyst optimizing the infrastructure using raw data streams.'
});

const specs: Record<string, LevelSpecification> = {};

// Generate specs for 30 levels
for (let i = 1; i <= 30; i++) {
  const id = `lvl-stats-${i}`;
  let mode: 'collection' | 'frequency' | 'intervals' | 'cumulative' | 'median' | 'boss' = 'collection';
  let title = 'Data Collection Unit';
  let conceptText = 'Raw data is the first step of any investigation. Collect and sort the incoming data packets.';
  
  if (i >= 7 && i <= 12) {
    mode = 'frequency';
    title = 'Frequency Analysis Lab';
    conceptText = 'Frequency refers to how often a specific data point occurs. Build a frequency distribution to understand the patterns.';
  } else if (i >= 13 && i <= 18) {
    mode = 'intervals';
    title = 'Class Interval Systems';
    conceptText = 'When data is large, we group it into Class Intervals. Optimize the intervals for city reports.';
  } else if (i >= 19 && i <= 24) {
    mode = 'cumulative';
    title = 'Cumulative Frequency Engine';
    conceptText = 'Cumulative frequency tracks a running total. It helps to monitor progression over time.';
  } else if (i >= 25 && i <= 29) {
    mode = 'median';
    title = 'Median Investigation Headquarters';
    conceptText = 'The median is the middle value of a sorted dataset. It gives a robust central tendency for city planning.';
  } else if (i === 30) {
    mode = 'boss';
    title = 'Central Analytics Core';
    conceptText = 'Combine all your knowledge (Frequency, Intervals, Cumulative, Median) to save Data City from a system-wide resource crisis!';
  }

  let correctAnswer = 0;
  const data = generateData(10 + i, 10, 50 + i * 2);

  let boardExamLines: any[] = [];
  
  if (mode === 'collection') {
    correctAnswer = data.length;
    boardExamLines = [
      { text: `Data array provided contains n elements`, isMath: false },
      { text: `Total number of data points n = [?]`, isMath: true, inputs: [correctAnswer] }
    ];
  }
  if (mode === 'frequency') {
    const counts: Record<number, number> = {};
    let maxCount = 0;
    data.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
      if (counts[v] > maxCount) maxCount = counts[v];
    });
    correctAnswer = maxCount;
    boardExamLines = [
      { text: `Create a frequency distribution table`, isMath: false },
      { text: `Highest frequency recorded is f_max = [?]`, isMath: true, inputs: [correctAnswer] }
    ];
  }
  if (mode === 'intervals') {
    correctAnswer = 5; // e.g., number of class intervals
    boardExamLines = [
      { text: `Determine the range and decide on bin width h = [?]`, isMath: true, inputs: [correctAnswer] },
      { text: `Group the continuous data into corresponding class intervals`, isMath: false }
    ];
  }
  if (mode === 'cumulative') {
    correctAnswer = data.length; // max cumulative freq
    boardExamLines = [
      { text: `Sum frequencies to find cumulative frequency (cf)`, isMath: false },
      { text: `Total cumulative frequency N = \\sum f_i = [?]`, isMath: true, inputs: [correctAnswer] }
    ];
  }
  if (mode === 'median' || mode === 'boss') {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    correctAnswer = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    boardExamLines = [
      { text: `Sort data in ascending order`, isMath: false },
      { text: `Since n=${sorted.length}, median is the middle value`, isMath: false },
      { text: `Median = [?]`, isMath: true, inputs: [Math.round(correctAnswer)] }
    ];
  }

  specs[id] = {
    id,
    question: `Mission ${i}: Analyze the dataset to find the required metric.`,
    inputLabel: mode.charAt(0).toUpperCase() + mode.slice(1) + ' Value',
    placeholder: 'Enter answer...',
    correctAnswer: Math.round(correctAnswer),
    tolerance: 0.1,
    calculateValue: (input: number) => input,
    getDimensionsLabel: () => `Data Points: ${data.length}`,
    formulaDisplay: 'Analysis in Progress...',
    bookPage: createStatsBookPage(title, conceptText),
    statsMode: mode,
    statsData: data,
    boardExamLines
  };
}

export default specs;
