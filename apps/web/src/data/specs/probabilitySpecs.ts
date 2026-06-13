import type { LevelSpecification } from '../levelSpecs';

const probabilitySpecs: Record<string, LevelSpecification> = {

  // ──────────────────────────────────────────────────────────────────
  // WORLD 1 — Random Experiment Basics (Levels 1–6)
  // ──────────────────────────────────────────────────────────────────

  "lvl-prob-01": {
    id: "lvl-prob-01",
    question: "A digital coin is flipped once. How many possible outcomes exist in the sample space? (Enter the total count)",
    inputLabel: "Total Outcomes",
    placeholder: "Type total outcomes...",
    correctAnswer: 2,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `S = {H, T}, |S| = ${val}`,
    formulaDisplay: "Sample Space S = { H, T }",
    probMode: "coin",
    probSampleSpace: ["H", "T"],
    probFavorable: ["H", "T"],
    probTotalOutcomes: 2,
    probFavorableCount: 2,
    probAnswerType: "total_count",
    bookPage: {
      title: "📖 Random Experiments & Sample Space",
      concept: "A random experiment has uncertain outcomes. The set of ALL possible outcomes is the Sample Space (S). Flipping a coin gives exactly 2 outcomes: Heads (H) and Tails (T). So S = {H, T} and |S| = 2.",
      formulaBreakdown: "Sample Space S = { all possible outcomes }",
      stepByStep: [
        "Identify the experiment: flip a coin once.",
        "List all possible outcomes: Heads (H) or Tails (T).",
        "The sample space S = { H, T }.",
        "Count the outcomes: |S| = 2.",
        "Enter 2 as the total number of outcomes."
      ],
      visualTip: "The coin in the lab shows two faces. Count both — that's your sample space size!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Experiment: Flip a coin once." },
      { lineNum: 2, textBefore: "Sample Space S = { H, T }" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "Total outcomes = n(S)" },
      { lineNum: 5, textBefore: "n(S) = ", hasInput: true, inputIndex: 0, correctAnswer: "2", placeholder: "count", widthChars: 2 }
    ]
  },

  "lvl-prob-02": {
    id: "lvl-prob-02",
    question: "A coin is flipped. Event E = getting Heads. How many favorable outcomes are there for event E?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type favorable count...",
    correctAnswer: 1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(E) = n(E) / n(S) = 1/2",
    probMode: "coin",
    probSampleSpace: ["H", "T"],
    probFavorable: ["H"],
    probTotalOutcomes: 2,
    probFavorableCount: 1,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Favorable Outcomes & P(E)",
      concept: "An Event E is a subset of the sample space. Favorable outcomes are the outcomes that satisfy event E. For P(Heads), only H is favorable. n(E) = 1, n(S) = 2, so P(H) = 1/2.",
      formulaBreakdown: "P(E) = n(E) / n(S)",
      stepByStep: [
        "Identify event E: getting Heads.",
        "List all outcomes where E occurs: { H }.",
        "Count favorable outcomes: n(E) = 1.",
        "Total outcomes n(S) = 2.",
        "P(H) = 1/2."
      ],
      visualTip: "Only the H side of the coin glows green — that's the single favorable outcome!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "S = { H, T },  E = { H }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = favorable outcomes for getting Heads" },
      { lineNum: 4, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "1", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "P(H) = n(E)/n(S) = 1/2" }
    ]
  },

  "lvl-prob-03": {
    id: "lvl-prob-03",
    question: "Two coins are tossed simultaneously. The sample space is {HH, HT, TH, TT}. What is the total number of outcomes?",
    inputLabel: "Sample Space Size",
    placeholder: "Type total outcomes...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(S) = ${val}`,
    formulaDisplay: "n(S) = 2 × 2 = 4",
    probMode: "two_coin",
    probSampleSpace: ["HH", "HT", "TH", "TT"],
    probFavorable: ["HH", "HT", "TH", "TT"],
    probTotalOutcomes: 4,
    probFavorableCount: 4,
    probAnswerType: "total_count",
    bookPage: {
      title: "📖 Two-Coin Experiment",
      concept: "When two coins are tossed, each coin independently gives H or T. The combined sample space has 2 × 2 = 4 outcomes: {HH, HT, TH, TT}. This uses the multiplication principle.",
      formulaBreakdown: "n(S) = 2 × 2 = 4 (multiplication principle)",
      stepByStep: [
        "Coin 1 outcomes: H or T (2 options).",
        "Coin 2 outcomes: H or T (2 options).",
        "Combined: HH, HT, TH, TT.",
        "n(S) = 2 × 2 = 4.",
        "Enter 4."
      ],
      visualTip: "The reactor shows a 2×2 grid — each cell is one outcome. Count all 4 cells!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Toss two coins simultaneously." },
      { lineNum: 2, textBefore: "S = { HH, HT, TH, TT }" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(S) = 2 × 2" },
      { lineNum: 5, textBefore: "n(S) = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "count", widthChars: 2 }
    ]
  },

  "lvl-prob-04": {
    id: "lvl-prob-04",
    question: "A fair die is rolled once. How many possible outcomes are in its sample space?",
    inputLabel: "Sample Space Size",
    placeholder: "Type total outcomes...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(S) = ${val}`,
    formulaDisplay: "S = { 1, 2, 3, 4, 5, 6 }",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["1", "2", "3", "4", "5", "6"],
    probTotalOutcomes: 6,
    probFavorableCount: 6,
    probAnswerType: "total_count",
    bookPage: {
      title: "📖 Die Experiment — Sample Space",
      concept: "Rolling a die gives 6 equally likely outcomes. The sample space S = {1, 2, 3, 4, 5, 6}. Each face is equally likely, so each has probability 1/6.",
      formulaBreakdown: "S = { 1, 2, 3, 4, 5, 6 },  n(S) = 6",
      stepByStep: [
        "A standard die has faces numbered 1 to 6.",
        "Each face is one possible outcome.",
        "S = { 1, 2, 3, 4, 5, 6 }.",
        "n(S) = 6.",
        "Enter 6."
      ],
      visualTip: "The glowing die in the lab shows all 6 faces. Every face is a possible outcome!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Experiment: Roll a fair die once." },
      { lineNum: 2, textBefore: "S = { 1, 2, 3, 4, 5, 6 }" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(S) = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "Each outcome has probability 1/6." }
    ]
  },

  "lvl-prob-05": {
    id: "lvl-prob-05",
    question: "A die is rolled. Event E = getting exactly 4. How many favorable outcomes are there?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type favorable count...",
    correctAnswer: 1,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(4) = 1/6",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["4"],
    probTotalOutcomes: 6,
    probFavorableCount: 1,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Single Outcome Event",
      concept: "When only one specific outcome satisfies event E, n(E) = 1. For E = {getting 4}, only the face showing 4 is favorable. P(4) = 1/6.",
      formulaBreakdown: "E = { 4 },  n(E) = 1,  P(4) = 1/6",
      stepByStep: [
        "Event E: roll a 4.",
        "Check each outcome: only 4 satisfies E.",
        "n(E) = 1 (just one outcome).",
        "P(4) = n(E)/n(S) = 1/6.",
        "Enter 1."
      ],
      visualTip: "On the die grid, only block '4' glows green — that's your single favorable outcome!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "S = { 1,2,3,4,5,6 },  E = { 4 }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "1", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(4) = n(E)/n(S) = 1/6" }
    ]
  },

  "lvl-prob-06": {
    id: "lvl-prob-06",
    question: "A die is rolled. Event E = getting an even number {2, 4, 6}. How many favorable outcomes are there?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type count of even numbers...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(even) = 3/6 = 1/2",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["2", "4", "6"],
    probTotalOutcomes: 6,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Multiple Favorable Outcomes",
      concept: "An event can have multiple favorable outcomes. E = {even number} = {2, 4, 6}. Three out of six outcomes satisfy this event, giving P(even) = 3/6 = 1/2.",
      formulaBreakdown: "E = { 2, 4, 6 },  n(E) = 3,  P(even) = 3/6 = 1/2",
      stepByStep: [
        "List even numbers from 1 to 6: 2, 4, 6.",
        "E = { 2, 4, 6 }.",
        "n(E) = 3.",
        "P(even) = 3/6 = 1/2.",
        "Enter 3."
      ],
      visualTip: "Three blocks (2, 4, 6) glow green on the die grid. Count the glowing ones!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = even number = { 2, 4, 6 }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(even) = 3/6 = 1/2" }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 2 — Sample Space Construction (Levels 7–12)
  // ──────────────────────────────────────────────────────────────────

  "lvl-prob-07": {
    id: "lvl-prob-07",
    question: "Two dice are rolled simultaneously. The sample space has all (Die1, Die2) pairs. What is the total number of outcomes?",
    inputLabel: "Total Outcomes",
    placeholder: "Type total outcomes...",
    correctAnswer: 36,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(S) = ${val}`,
    formulaDisplay: "n(S) = 6 × 6 = 36",
    probMode: "two_dice",
    probTotalOutcomes: 36,
    probFavorableCount: 36,
    probAnswerType: "total_count",
    bookPage: {
      title: "📖 Two-Dice Sample Space",
      concept: "When two dice are rolled, each die has 6 faces. By the multiplication principle, the total number of outcomes = 6 × 6 = 36. These are all ordered pairs (d₁, d₂) where d₁, d₂ ∈ {1..6}.",
      formulaBreakdown: "n(S) = 6 × 6 = 36",
      stepByStep: [
        "Die 1: 6 possible outcomes.",
        "Die 2: 6 possible outcomes.",
        "For each outcome of Die 1, Die 2 can show any of 6 faces.",
        "Total = 6 × 6 = 36.",
        "Enter 36."
      ],
      visualTip: "The twin-dice grid in the lab has 6 rows × 6 columns = 36 cells. Count the full grid!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Two dice rolled: Die1 × Die2" },
      { lineNum: 2, textBefore: "Die1 outcomes: 6,  Die2 outcomes: 6" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(S) = 6 × 6" },
      { lineNum: 5, textBefore: "n(S) = ", hasInput: true, inputIndex: 0, correctAnswer: "36", placeholder: "count", widthChars: 3 }
    ]
  },

  "lvl-prob-08": {
    id: "lvl-prob-08",
    question: "Two dice are rolled. Event E = sum equals 7. The favorable pairs are (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). Count them.",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type favorable count...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(sum=7) = 6/36 = 1/6",
    probMode: "two_dice",
    probFavorable: ["(1,6)", "(2,5)", "(3,4)", "(4,3)", "(5,2)", "(6,1)"],
    probTotalOutcomes: 36,
    probFavorableCount: 6,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Two-Dice Event: Sum = 7",
      concept: "From 36 total outcomes, we identify pairs (d₁, d₂) where d₁ + d₂ = 7. These are: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — exactly 6 pairs. P(sum=7) = 6/36 = 1/6.",
      formulaBreakdown: "n(E) = 6,  P(sum=7) = 6/36 = 1/6",
      stepByStep: [
        "Scan all 36 pairs for d₁ + d₂ = 7.",
        "(1,6): 1+6=7 ✓, (2,5): 2+5=7 ✓.",
        "(3,4): 3+4=7 ✓, (4,3): 4+3=7 ✓.",
        "(5,2): 5+2=7 ✓, (6,1): 6+1=7 ✓.",
        "Total: 6 pairs. Enter 6."
      ],
      visualTip: "6 highlighted cells run diagonally across the grid. Each is a favorable (sum=7) pair!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = {(d₁,d₂) : d₁+d₂ = 7}" },
      { lineNum: 2, textBefore: "E = {(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)}" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "P(sum=7) = 6/36 = 1/6" }
    ]
  },

  "lvl-prob-09": {
    id: "lvl-prob-09",
    question: "A standard playing card deck is fed into the card scanner. How many cards are in the deck (total outcomes)?",
    inputLabel: "Total Cards",
    placeholder: "Type total cards...",
    correctAnswer: 52,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(S) = ${val}`,
    formulaDisplay: "Deck = 4 suits × 13 cards = 52",
    probMode: "card",
    probTotalOutcomes: 52,
    probFavorableCount: 52,
    probAnswerType: "total_count",
    bookPage: {
      title: "📖 Card Deck Sample Space",
      concept: "A standard deck has 4 suits (♠ ♥ ♦ ♣) each with 13 cards (Ace, 2–10, J, Q, K). Total = 4 × 13 = 52 cards. This is the sample space for any single-card draw.",
      formulaBreakdown: "n(S) = 4 suits × 13 cards = 52",
      stepByStep: [
        "Identify suits: Spades (♠), Hearts (♥), Diamonds (♦), Clubs (♣).",
        "Each suit: Ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K = 13 cards.",
        "Total = 4 × 13 = 52.",
        "n(S) = 52.",
        "Enter 52."
      ],
      visualTip: "The card scanner shows 4 suit panels, 13 cards each. 4 × 13 = 52!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Deck: 4 suits × 13 cards each" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(S) = 4 × 13" },
      { lineNum: 4, textBefore: "n(S) = ", hasInput: true, inputIndex: 0, correctAnswer: "52", placeholder: "count", widthChars: 3 }
    ]
  },

  "lvl-prob-10": {
    id: "lvl-prob-10",
    question: "A card is drawn from a deck. Event E = getting an Ace. How many aces are there in a standard deck?",
    inputLabel: "Number of Aces",
    placeholder: "Type count of aces...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(Ace) = 4/52 = 1/13",
    probMode: "card",
    probFavorable: ["A♠", "A♥", "A♦", "A♣"],
    probTotalOutcomes: 52,
    probFavorableCount: 4,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Aces in a Deck",
      concept: "Each of the 4 suits contains exactly one Ace. So there are 4 Aces total. P(Ace) = 4/52 = 1/13.",
      formulaBreakdown: "n(Ace) = 4,  P(Ace) = 4/52 = 1/13",
      stepByStep: [
        "List aces: Ace of ♠, Ace of ♥, Ace of ♦, Ace of ♣.",
        "n(E) = 4.",
        "n(S) = 52.",
        "P(Ace) = 4/52 = 1/13.",
        "Enter 4."
      ],
      visualTip: "One glowing Ace in each suit panel — 4 total across all 4 suits!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = { A♠, A♥, A♦, A♣ }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(Ace) = 4/52 = 1/13" }
    ]
  },

  "lvl-prob-11": {
    id: "lvl-prob-11",
    question: "A card is drawn from a deck. Event E = getting a Heart (♥). How many hearts are in the deck?",
    inputLabel: "Number of Hearts",
    placeholder: "Type count of hearts...",
    correctAnswer: 13,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(Heart) = 13/52 = 1/4",
    probMode: "card",
    probFavorable: ["♥"],
    probTotalOutcomes: 52,
    probFavorableCount: 13,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Suit Selection Probability",
      concept: "The deck has 4 suits, each with 13 cards. Hearts (♥) has 13 cards. P(Heart) = 13/52 = 1/4. One quarter of the deck is any given suit.",
      formulaBreakdown: "n(♥) = 13,  P(Heart) = 13/52 = 1/4",
      stepByStep: [
        "Identify hearts: A♥ through K♥ = 13 cards.",
        "n(E) = 13.",
        "n(S) = 52.",
        "P(♥) = 13/52 = 1/4.",
        "Enter 13."
      ],
      visualTip: "The ♥ suit panel lights up fully — all 13 heart cards are favorable!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = all heart cards in deck" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(♥) = ", hasInput: true, inputIndex: 0, correctAnswer: "13", placeholder: "count", widthChars: 3 },
      { lineNum: 4, textBefore: "P(♥) = 13/52 = 1/4" }
    ]
  },

  "lvl-prob-12": {
    id: "lvl-prob-12",
    question: "A card is drawn. Event E = getting a face card (Jack, Queen, or King). How many face cards are in the deck?",
    inputLabel: "Number of Face Cards",
    placeholder: "Type count of face cards...",
    correctAnswer: 12,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(face) = 12/52 = 3/13",
    probMode: "card",
    probFavorable: ["J", "Q", "K"],
    probTotalOutcomes: 52,
    probFavorableCount: 12,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Face Cards in a Deck",
      concept: "Face cards are Jack (J), Queen (Q), and King (K). Each suit has 3 face cards. Total = 4 × 3 = 12 face cards. P(face card) = 12/52 = 3/13.",
      formulaBreakdown: "Face cards = J, Q, K per suit × 4 suits = 12",
      stepByStep: [
        "Face cards per suit: J, Q, K = 3.",
        "Number of suits = 4.",
        "Total face cards = 3 × 4 = 12.",
        "P(face) = 12/52 = 3/13.",
        "Enter 12."
      ],
      visualTip: "J, Q, K glow in all 4 suit panels — 3 per suit × 4 suits = 12!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Face cards: J, Q, K in each suit" },
      { lineNum: 2, textBefore: "Total = 3 face cards × 4 suits" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "12", placeholder: "count", widthChars: 3 },
      { lineNum: 5, textBefore: "P(face card) = 12/52 = 3/13" }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 3 — Events & Probability Intuition (Levels 13–18)
  // ──────────────────────────────────────────────────────────────────

  "lvl-prob-13": {
    id: "lvl-prob-13",
    question: "A die is rolled. Event E = getting a prime number. Prime numbers on a die: {2, 3, 5}. How many favorable outcomes?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type favorable count...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(prime) = 3/6 = 1/2",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["2", "3", "5"],
    probTotalOutcomes: 6,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Prime Number Event",
      concept: "Prime numbers on a die: 2, 3, 5 (divisible only by 1 and themselves). Note: 1 is NOT prime. So E = {2, 3, 5}, n(E) = 3, P(prime) = 3/6 = 1/2.",
      formulaBreakdown: "Primes on die: 2, 3, 5 → n(E) = 3",
      stepByStep: [
        "Recall prime numbers: only 1 and itself as factors.",
        "Check each: 1 (not prime), 2 ✓, 3 ✓, 4 (not), 5 ✓, 6 (not).",
        "E = { 2, 3, 5 }, n(E) = 3.",
        "P(prime) = 3/6 = 1/2.",
        "Enter 3."
      ],
      visualTip: "Three blocks glow: 2, 3, 5. Remember — 1 is NOT prime. Only three outcomes win!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Primes on die = { 2, 3, 5 }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(prime) = 3/6 = 1/2" }
    ]
  },

  "lvl-prob-14": {
    id: "lvl-prob-14",
    question: "A die is rolled. Event E = outcome is greater than 4. Favorable outcomes: {5, 6}. How many are there?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type favorable count...",
    correctAnswer: 2,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(>4) = 2/6 = 1/3",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["5", "6"],
    probTotalOutcomes: 6,
    probFavorableCount: 2,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Inequality Events",
      concept: "E = {outcomes > 4} means outcomes where the die shows a value strictly greater than 4. From {1,2,3,4,5,6}, only 5 and 6 qualify. n(E) = 2, P(>4) = 2/6 = 1/3.",
      formulaBreakdown: "E = { 5, 6 },  n(E) = 2,  P(>4) = 1/3",
      stepByStep: [
        "Which numbers from 1–6 are > 4?",
        "5 > 4 ✓, 6 > 4 ✓.",
        "E = { 5, 6 }, n(E) = 2.",
        "P(>4) = 2/6 = 1/3.",
        "Enter 2."
      ],
      visualTip: "Only 5 and 6 light up green on the die grid — the gate opens only for > 4!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = { outcomes > 4 } = { 5, 6 }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "2", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(>4) = 2/6 = 1/3" }
    ]
  },

  "lvl-prob-15": {
    id: "lvl-prob-15",
    question: "A die is rolled. Event E = NOT getting 6. How many outcomes satisfy this event?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type favorable count...",
    correctAnswer: 5,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(not 6) = 1 − P(6) = 1 − 1/6 = 5/6",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["1", "2", "3", "4", "5"],
    probTotalOutcomes: 6,
    probFavorableCount: 5,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Complementary Events",
      concept: "For complementary event Ē (not E): P(Ē) = 1 − P(E). Here E = {6}, P(6) = 1/6, so P(not 6) = 1 − 1/6 = 5/6. Or count directly: {1,2,3,4,5} = 5 outcomes.",
      formulaBreakdown: "P(not 6) = 1 − 1/6 = 5/6,  n(Ē) = 5",
      stepByStep: [
        "E = {6}, n(E) = 1.",
        "Complement Ē = {1,2,3,4,5}.",
        "n(Ē) = n(S) − n(E) = 6 − 1 = 5.",
        "P(not 6) = 5/6.",
        "Enter 5."
      ],
      visualTip: "5 blocks glow — everything except 6. The reactor blocks only the 6 face!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Ē = S − E = {1,2,3,4,5,6} − {6}" },
      { lineNum: 2, textBefore: "Ē = {1, 2, 3, 4, 5}" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(Ē) = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "P(not 6) = 5/6" }
    ]
  },

  "lvl-prob-16": {
    id: "lvl-prob-16",
    question: "A probability bag contains 3 red, 2 blue, and 5 green balls. What is the total number of balls (total outcomes)?",
    inputLabel: "Total Balls",
    placeholder: "Type total balls...",
    correctAnswer: 10,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(S) = ${val}`,
    formulaDisplay: "n(S) = 3 + 2 + 5 = 10",
    probMode: "bag",
    probTotalOutcomes: 10,
    probFavorableCount: 10,
    probAnswerType: "total_count",
    probBagColors: [
      { color: "red", count: 3, hex: 0xef4444 },
      { color: "blue", count: 2, hex: 0x3b82f6 },
      { color: "green", count: 5, hex: 0x22c55e }
    ],
    bookPage: {
      title: "📖 Probability Bag — Total Sample Space",
      concept: "When drawing one ball at random, each ball is equally likely. The total number of balls is n(S). Here: 3 red + 2 blue + 5 green = 10 balls.",
      formulaBreakdown: "n(S) = 3 + 2 + 5 = 10",
      stepByStep: [
        "Count red: 3.",
        "Count blue: 2.",
        "Count green: 5.",
        "Total = 3 + 2 + 5 = 10.",
        "Enter 10."
      ],
      visualTip: "Count all colored balls in the bag — red + blue + green = total!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Bag: 3 red + 2 blue + 5 green" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(S) = 3 + 2 + 5" },
      { lineNum: 4, textBefore: "n(S) = ", hasInput: true, inputIndex: 0, correctAnswer: "10", placeholder: "count", widthChars: 3 }
    ]
  },

  "lvl-prob-17": {
    id: "lvl-prob-17",
    question: "A bag has 3 red, 2 blue, 5 green balls. Event E = drawing a red ball. How many favorable outcomes?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type count of red balls...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(red) = 3/10",
    probMode: "bag",
    probTotalOutcomes: 10,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    probBagColors: [
      { color: "red", count: 3, hex: 0xef4444 },
      { color: "blue", count: 2, hex: 0x3b82f6 },
      { color: "green", count: 5, hex: 0x22c55e }
    ],
    bookPage: {
      title: "📖 Bag Probability — Favorable Outcomes",
      concept: "Only red balls are favorable for event E = {red}. There are 3 red balls out of 10 total. P(red) = 3/10.",
      formulaBreakdown: "n(red) = 3,  P(red) = 3/10",
      stepByStep: [
        "Count only red balls: 3.",
        "n(E) = 3 (favorable).",
        "n(S) = 10 (total).",
        "P(red) = 3/10.",
        "Enter 3."
      ],
      visualTip: "Only the red balls glow in the bag — count the 3 glowing ones!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = { red ball },  red balls = 3" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(red) = 3/10" }
    ]
  },

  "lvl-prob-18": {
    id: "lvl-prob-18",
    question: "Same bag: 3 red, 2 blue, 5 green. Event E = NOT drawing a green ball. How many non-green balls are there?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type non-green count...",
    correctAnswer: 5,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(not green) = 5/10 = 1/2",
    probMode: "bag",
    probTotalOutcomes: 10,
    probFavorableCount: 5,
    probAnswerType: "favorable_count",
    probBagColors: [
      { color: "red", count: 3, hex: 0xef4444 },
      { color: "blue", count: 2, hex: 0x3b82f6 },
      { color: "green", count: 5, hex: 0x22c55e }
    ],
    bookPage: {
      title: "📖 Complementary Bag Events",
      concept: "P(not green) = 1 − P(green) = 1 − 5/10 = 5/10 = 1/2. Or count directly: non-green = red (3) + blue (2) = 5.",
      formulaBreakdown: "n(not green) = 3 + 2 = 5,  P(not green) = 5/10",
      stepByStep: [
        "Identify non-green balls: red (3) + blue (2).",
        "n(not green) = 3 + 2 = 5.",
        "P(not green) = 5/10 = 1/2.",
        "Or: 1 − P(green) = 1 − 5/10.",
        "Enter 5."
      ],
      visualTip: "Red + blue balls glow (non-green). 3 red + 2 blue = 5 favorable!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Ē = not green = red + blue" },
      { lineNum: 2, textBefore: "n(Ē) = 3 + 2" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(Ē) = ", hasInput: true, inputIndex: 0, correctAnswer: "5", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "P(not green) = 5/10 = 1/2" }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 4 — Probability Formula Engine (Levels 19–24)
  // ──────────────────────────────────────────────────────────────────

  "lvl-prob-19": {
    id: "lvl-prob-19",
    question: "P(E) = 3/6. Express this probability as a decimal. (Hint: divide 3 by 6)",
    inputLabel: "Probability as Decimal",
    placeholder: "Type decimal (e.g. 0.5)...",
    correctAnswer: 0.5,
    tolerance: 0.01,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `P(E) = ${val}`,
    formulaDisplay: "P(E) = 3/6 = 0.5",
    probMode: "formula",
    probTotalOutcomes: 6,
    probFavorableCount: 3,
    probAnswerType: "decimal",
    bookPage: {
      title: "📖 Probability as a Decimal",
      concept: "Probability P(E) = n(E) / n(S) gives a number between 0 and 1. P(E) = 3/6 = 0.5 means a 50% chance of event E occurring. P = 0 means impossible; P = 1 means certain.",
      formulaBreakdown: "P(E) = 3 ÷ 6 = 0.5",
      stepByStep: [
        "n(E) = 3 (favorable).",
        "n(S) = 6 (total).",
        "P(E) = 3/6.",
        "Divide: 3 ÷ 6 = 0.5.",
        "Enter 0.5."
      ],
      visualTip: "The probability meter shows 3 out of 6 bars lit — exactly half = 0.5!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "P(E) = n(E) / n(S) = 3/6" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "3 ÷ 6 = ", hasInput: true, inputIndex: 0, correctAnswer: "0.5", placeholder: "decimal", widthChars: 4 }
    ]
  },

  "lvl-prob-20": {
    id: "lvl-prob-20",
    question: "A bag has 5 red and 3 blue balls (total 8). P(blue) = ?/8. How many favorable outcomes (blue balls)?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type count of blue balls...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(blue) = ${val}`,
    formulaDisplay: "P(blue) = 3/8",
    probMode: "bag",
    probTotalOutcomes: 8,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    probBagColors: [
      { color: "red", count: 5, hex: 0xef4444 },
      { color: "blue", count: 3, hex: 0x3b82f6 }
    ],
    bookPage: {
      title: "📖 P(E) Formula in Practice",
      concept: "P(blue) = n(blue) / n(S) = 3/8. The numerator of this fraction is the number of blue balls (favorable outcomes). It represents 3 chances out of 8 possible draws.",
      formulaBreakdown: "P(blue) = 3/8,  n(blue) = 3",
      stepByStep: [
        "Bag: 5 red + 3 blue = 8 total.",
        "Favorable: blue balls = 3.",
        "P(blue) = 3/8.",
        "The numerator = favorable count = 3.",
        "Enter 3."
      ],
      visualTip: "3 blue balls glow in the bag. They are your 3 favorable outcomes!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Bag: 5 red + 3 blue = 8 total" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "P(blue) = ?/8,  n(blue) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(blue) = 3/8" }
    ]
  },

  "lvl-prob-21": {
    id: "lvl-prob-21",
    question: "A card is drawn from a deck. Event E = black card (♠ or ♣). How many black cards are in the deck?",
    inputLabel: "Number of Black Cards",
    placeholder: "Type count of black cards...",
    correctAnswer: 26,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(black) = ${val}`,
    formulaDisplay: "P(black) = 26/52 = 1/2",
    probMode: "card",
    probFavorable: ["♠", "♣"],
    probTotalOutcomes: 52,
    probFavorableCount: 26,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Black Card Probability",
      concept: "Black suits are Spades (♠) and Clubs (♣), each with 13 cards. Total black cards = 13 + 13 = 26. P(black) = 26/52 = 1/2. Exactly half the deck is black.",
      formulaBreakdown: "n(black) = 13(♠) + 13(♣) = 26",
      stepByStep: [
        "Black suits: ♠ (Spades) and ♣ (Clubs).",
        "Each suit: 13 cards.",
        "n(black) = 13 + 13 = 26.",
        "P(black) = 26/52 = 1/2.",
        "Enter 26."
      ],
      visualTip: "♠ and ♣ panels glow — 13 + 13 = 26 black cards!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Black suits: ♠ (13) + ♣ (13)" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(black) = 13 + 13 = ", hasInput: true, inputIndex: 0, correctAnswer: "26", placeholder: "count", widthChars: 3 },
      { lineNum: 4, textBefore: "P(black) = 26/52 = 1/2" }
    ]
  },

  "lvl-prob-22": {
    id: "lvl-prob-22",
    question: "A die is rolled. Event E = getting a multiple of 3. Multiples of 3 from 1–6: {3, 6}. How many favorable outcomes?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type count...",
    correctAnswer: 2,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(mult of 3) = 2/6 = 1/3",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["3", "6"],
    probTotalOutcomes: 6,
    probFavorableCount: 2,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Multiples of 3 Event",
      concept: "Multiples of 3 in {1,2,3,4,5,6} are {3, 6}. n(E) = 2. P(multiple of 3) = 2/6 = 1/3.",
      formulaBreakdown: "E = { 3, 6 },  n(E) = 2,  P = 1/3",
      stepByStep: [
        "Identify multiples of 3 from 1–6.",
        "3 ÷ 3 = 1 ✓,  6 ÷ 3 = 2 ✓.",
        "E = { 3, 6 }, n(E) = 2.",
        "P = 2/6 = 1/3.",
        "Enter 2."
      ],
      visualTip: "Only 3 and 6 are divisible by 3 — two blocks glow on the die grid!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Multiples of 3 from die: { 3, 6 }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "2", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(mult of 3) = 2/6 = 1/3" }
    ]
  },

  "lvl-prob-23": {
    id: "lvl-prob-23",
    question: "If P(E) = 2/5, what is P(not E)? Express as a fraction: P(not E) = ?/5. Enter the numerator.",
    inputLabel: "Numerator of P(not E)",
    placeholder: "Type numerator...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `P(not E) = ${val}/5`,
    formulaDisplay: "P(E) + P(not E) = 1",
    probMode: "formula",
    probTotalOutcomes: 5,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Complementary Probability Rule",
      concept: "For any event E and its complement Ē (not E): P(E) + P(Ē) = 1. So P(Ē) = 1 − P(E) = 1 − 2/5 = 3/5. The numerator is 3.",
      formulaBreakdown: "P(not E) = 1 − P(E) = 1 − 2/5 = 3/5",
      stepByStep: [
        "P(E) = 2/5.",
        "P(E) + P(not E) = 1.",
        "P(not E) = 1 − 2/5.",
        "= 5/5 − 2/5 = 3/5.",
        "Numerator = 3. Enter 3."
      ],
      visualTip: "If 2 out of 5 bars are lit, then 3 out of 5 are dark — those 3 are P(not E)!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "P(E) = 2/5" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "P(not E) = 1 − 2/5 = 5/5 − 2/5" },
      { lineNum: 4, textBefore: "P(not E) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "num", widthChars: 2, textAfter: "/5" }
    ]
  },

  "lvl-prob-24": {
    id: "lvl-prob-24",
    question: "In a probability lab experiment, a coin was tossed 200 times. Heads appeared 80 times. What is the experimental probability of Heads as a percentage (%)?",
    inputLabel: "Probability (%)",
    placeholder: "Type percentage...",
    correctAnswer: 40,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `P(H) = ${val}%`,
    formulaDisplay: "P(H) = 80/200 = 0.4 = 40%",
    probMode: "formula",
    probTotalOutcomes: 200,
    probFavorableCount: 80,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Experimental Probability",
      concept: "Experimental probability is based on actual trials: P(E) = frequency / total trials. Here P(H) = 80/200 = 0.4 = 40%. Unlike theoretical probability (1/2), this is based on observed data.",
      formulaBreakdown: "P(H) experimental = 80/200 = 0.4 = 40%",
      stepByStep: [
        "Total trials = 200.",
        "Heads appeared 80 times.",
        "P(H) = 80/200 = 0.4.",
        "As percentage: 0.4 × 100 = 40%.",
        "Enter 40."
      ],
      visualTip: "The experiment meter shows 80 out of 200 successes — that's 40% of the bar!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Total tosses = 200,  Heads = 80" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "P(H) = 80/200 = 0.4" },
      { lineNum: 4, textBefore: "As % = 0.4 × 100 = ", hasInput: true, inputIndex: 0, correctAnswer: "40", placeholder: "percent", widthChars: 3, textAfter: "%" }
    ]
  },

  // ──────────────────────────────────────────────────────────────────
  // WORLD 5 — Real-World Probability Systems (Levels 25–30)
  // ──────────────────────────────────────────────────────────────────

  "lvl-prob-25": {
    id: "lvl-prob-25",
    question: "Two coins are tossed. Event E = at least one Head. Sample space: {HH, HT, TH, TT}. Favorable: {HH, HT, TH}. How many?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type count...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(≥1 Head) = 3/4",
    probMode: "two_coin",
    probSampleSpace: ["HH", "HT", "TH", "TT"],
    probFavorable: ["HH", "HT", "TH"],
    probTotalOutcomes: 4,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 At Least One Head",
      concept: "'At least one Head' means 1 or more Heads. From {HH, HT, TH, TT}, the outcomes with at least 1 H are {HH, HT, TH} — 3 out of 4. P(≥1H) = 3/4.",
      formulaBreakdown: "E = {HH, HT, TH},  n(E) = 3,  P = 3/4",
      stepByStep: [
        "S = {HH, HT, TH, TT}.",
        "Check each: HH (2H) ✓, HT (1H) ✓, TH (1H) ✓, TT (0H) ✗.",
        "E = {HH, HT, TH}.",
        "n(E) = 3.",
        "P(≥1H) = 3/4."
      ],
      visualTip: "3 out of 4 outcome circles glow — only TT has no heads!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "E = at least one Head" },
      { lineNum: 2, textBefore: "E = { HH, HT, TH }" },
      { lineNum: 3, textBefore: "" },
      { lineNum: 4, textBefore: "n(E) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "P(≥1H) = 3/4" }
    ]
  },

  "lvl-prob-26": {
    id: "lvl-prob-26",
    question: "A die game: you WIN if you roll greater than 3. Winning outcomes: {4, 5, 6}. How many favorable outcomes?",
    inputLabel: "Winning Outcomes",
    placeholder: "Type winning count...",
    correctAnswer: 3,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(E) = ${val}`,
    formulaDisplay: "P(win) = 3/6 = 1/2",
    probMode: "dice",
    probSampleSpace: ["1", "2", "3", "4", "5", "6"],
    probFavorable: ["4", "5", "6"],
    probTotalOutcomes: 6,
    probFavorableCount: 3,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Game Fairness Analysis",
      concept: "A fair game has P(win) = P(lose) = 1/2. Here, win = {4,5,6} (3 outcomes), lose = {1,2,3} (3 outcomes). P(win) = 3/6 = 1/2 — the game is perfectly fair!",
      formulaBreakdown: "E = {4, 5, 6},  n(E) = 3,  P(win) = 1/2",
      stepByStep: [
        "Win condition: roll > 3.",
        "Winning outcomes: 4 ✓, 5 ✓, 6 ✓.",
        "n(E) = 3.",
        "P(win) = 3/6 = 1/2.",
        "Enter 3 — the game is fair!"
      ],
      visualTip: "4, 5, 6 glow green on the die grid. 3 wins vs 3 losses — perfectly balanced!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Win if roll > 3: outcomes { 4, 5, 6 }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(win) = ", hasInput: true, inputIndex: 0, correctAnswer: "3", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(win) = 3/6 = 1/2" }
    ]
  },

  "lvl-prob-27": {
    id: "lvl-prob-27",
    question: "A card is drawn from a standard deck. Event E = drawing a Queen. How many queens are in the deck?",
    inputLabel: "Number of Queens",
    placeholder: "Type count of queens...",
    correctAnswer: 4,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(Q) = ${val}`,
    formulaDisplay: "P(Queen) = 4/52 = 1/13",
    probMode: "card",
    probFavorable: ["Q♠", "Q♥", "Q♦", "Q♣"],
    probTotalOutcomes: 52,
    probFavorableCount: 4,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Queen Card Probability",
      concept: "Each of the 4 suits has exactly one Queen. So there are 4 Queens total. P(Queen) = 4/52 = 1/13 ≈ 7.7%. Very unlikely but possible!",
      formulaBreakdown: "n(Queen) = 4,  P(Q) = 4/52 = 1/13",
      stepByStep: [
        "One Queen per suit: Q♠, Q♥, Q♦, Q♣.",
        "n(Q) = 4.",
        "n(S) = 52.",
        "P(Queen) = 4/52 = 1/13.",
        "Enter 4."
      ],
      visualTip: "One glowing Queen in each suit panel — 4 total across all 4 suits!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Deck: Q♠, Q♥, Q♦, Q♣" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(Queen) = ", hasInput: true, inputIndex: 0, correctAnswer: "4", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(Queen) = 4/52 = 1/13" }
    ]
  },

  "lvl-prob-28": {
    id: "lvl-prob-28",
    question: "A bag has 4 red and 6 blue balls (total 10). Event E = drawing a ball that is NOT red. How many non-red balls are there?",
    inputLabel: "Non-Red Balls",
    placeholder: "Type non-red count...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(not red) = ${val}`,
    formulaDisplay: "P(not red) = 6/10 = 3/5",
    probMode: "bag",
    probTotalOutcomes: 10,
    probFavorableCount: 6,
    probAnswerType: "favorable_count",
    probBagColors: [
      { color: "red", count: 4, hex: 0xef4444 },
      { color: "blue", count: 6, hex: 0x3b82f6 }
    ],
    bookPage: {
      title: "📖 Real-World: Non-Red Probability",
      concept: "When predicting draws, P(not red) = 1 − P(red) = 1 − 4/10 = 6/10 = 3/5. Or count: 6 blue balls out of 10. Both methods give the same answer.",
      formulaBreakdown: "n(not red) = 6,  P(not red) = 6/10 = 3/5",
      stepByStep: [
        "Total = 10, red = 4.",
        "Not red = total − red = 10 − 4 = 6.",
        "All 6 are blue.",
        "P(not red) = 6/10 = 3/5.",
        "Enter 6."
      ],
      visualTip: "6 blue balls glow — none of the red ones. That's your favorable count!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Bag: 4 red + 6 blue = 10 total" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(not red) = 10 − 4 = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(not red) = 6/10 = 3/5" }
    ]
  },

  "lvl-prob-29": {
    id: "lvl-prob-29",
    question: "Two dice are rolled. A 'doublet' means both dice show the same number: (1,1),(2,2),(3,3),(4,4),(5,5),(6,6). How many doublet outcomes are there?",
    inputLabel: "Doublet Outcomes",
    placeholder: "Type doublet count...",
    correctAnswer: 6,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(doublet) = ${val}`,
    formulaDisplay: "P(doublet) = 6/36 = 1/6",
    probMode: "two_dice",
    probFavorable: ["(1,1)", "(2,2)", "(3,3)", "(4,4)", "(5,5)", "(6,6)"],
    probTotalOutcomes: 36,
    probFavorableCount: 6,
    probAnswerType: "favorable_count",
    bookPage: {
      title: "📖 Doublets on Two Dice",
      concept: "A doublet means d₁ = d₂. The 6 doublets are: (1,1),(2,2),(3,3),(4,4),(5,5),(6,6). P(doublet) = 6/36 = 1/6 ≈ 16.7%. They form the main diagonal of the 6×6 grid.",
      formulaBreakdown: "n(doublet) = 6,  P = 6/36 = 1/6",
      stepByStep: [
        "Both dice must show same value.",
        "Possible: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6).",
        "n(doublet) = 6.",
        "P(doublet) = 6/36 = 1/6.",
        "Enter 6."
      ],
      visualTip: "6 cells on the diagonal of the 6×6 grid glow — those are the doublets!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Doublets: { (1,1),(2,2),(3,3),(4,4),(5,5),(6,6) }" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(doublet) = ", hasInput: true, inputIndex: 0, correctAnswer: "6", placeholder: "count", widthChars: 2 },
      { lineNum: 4, textBefore: "P(doublet) = 6/36 = 1/6" }
    ]
  },

  "lvl-prob-30": {
    id: "lvl-prob-30",
    question: "BOSS — Quantum Reactor: A bag has 3 red, 4 blue, 2 green, 1 white ball (total 10). Event E = NOT drawing a green ball. How many favorable outcomes?",
    inputLabel: "Favorable Outcomes",
    placeholder: "Type non-green count...",
    correctAnswer: 8,
    tolerance: 0,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => `n(not green) = ${val}`,
    formulaDisplay: "P(not green) = 8/10 = 4/5",
    probMode: "boss",
    probTotalOutcomes: 10,
    probFavorableCount: 8,
    probAnswerType: "favorable_count",
    probBagColors: [
      { color: "red",   count: 3, hex: 0xef4444 },
      { color: "blue",  count: 4, hex: 0x3b82f6 },
      { color: "green", count: 2, hex: 0x22c55e },
      { color: "white", count: 1, hex: 0xf1f5f9 }
    ],
    bookPage: {
      title: "📖 BOSS: Full Probability Mastery",
      concept: "P(not green) = 1 − P(green) = 1 − 2/10 = 8/10 = 4/5. Non-green = red(3) + blue(4) + white(1) = 8. This combines sample space, favorable outcomes, and complementary events!",
      formulaBreakdown: "n(not green) = 3+4+1 = 8,  P = 8/10 = 4/5",
      stepByStep: [
        "Total = 3+4+2+1 = 10 balls.",
        "Green balls = 2 (unfavorable).",
        "Method 1: Non-green = 3+4+1 = 8.",
        "Method 2: P(not green) = 1 − 2/10 = 8/10.",
        "n(not green) = 8. Enter 8."
      ],
      visualTip: "Red, blue and white glow — 8 out of 10 balls are non-green! Green ones are blocked!"
    },
    boardExamLines: [
      { lineNum: 1, textBefore: "Bag: 3R + 4B + 2G + 1W = 10" },
      { lineNum: 2, textBefore: "" },
      { lineNum: 3, textBefore: "n(not green) = 3 + 4 + 1" },
      { lineNum: 4, textBefore: "n(not green) = ", hasInput: true, inputIndex: 0, correctAnswer: "8", placeholder: "count", widthChars: 2 },
      { lineNum: 5, textBefore: "P(not green) = 8/10 = 4/5" }
    ]
  }

};

export default probabilitySpecs;
