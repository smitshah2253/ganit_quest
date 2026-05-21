import { create } from 'zustand'
import levels from '../data/levels'

interface GameState {
  xp: number
  stars: number
  currentLevelId: string | null
  unlockedLevels: string[]
  addXp: (amount: number) => void
  addStars: (amount: number) => void
  setCurrentLevel: (levelId: string) => void
  unlockLevel: (levelId: string) => void
}

export const useGameStore = create<GameState>((set) => ({
  xp: 0,
  stars: 0,
  currentLevelId: null,
  unlockedLevels: levels.map(l => l.id), // All levels unlocked for all 3 chapters
  
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  addStars: (amount) => set((state) => ({ stars: state.stars + amount })),
  setCurrentLevel: (levelId) => set({ currentLevelId: levelId }),
  unlockLevel: (levelId) => set((state) => {
    if (!state.unlockedLevels.includes(levelId)) {
      return { unlockedLevels: [...state.unlockedLevels, levelId] }
    }
    return state
  })
}))
