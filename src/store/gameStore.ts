import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  xp: number
  stars: number
  currentLevelId: string | null
  unlockedLevels: string[]
  completedLevels: string[]
  addXp: (amount: number) => void
  addStars: (amount: number) => void
  setCurrentLevel: (levelId: string) => void
  unlockLevel: (levelId: string) => void
  completeLevel: (levelId: string) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      xp: 0,
      stars: 0,
      currentLevelId: null,
      unlockedLevels: ['lvl-01', 'lvl-cg-01', 'lvl-trig-01'], // Only first level per chapter unlocked initially
      completedLevels: [],
      
      addXp: (amount) => set((state) => ({ xp: Math.max(0, state.xp + amount) })),
      addStars: (amount) => set((state) => ({ stars: state.stars + amount })),
      setCurrentLevel: (levelId) => set({ currentLevelId: levelId }),
      unlockLevel: (levelId) => set((state) => {
        if (!state.unlockedLevels.includes(levelId)) {
          return { unlockedLevels: [...state.unlockedLevels, levelId] }
        }
        return state
      }),
      completeLevel: (levelId) => set((state) => {
        if (!state.completedLevels.includes(levelId)) {
          return { completedLevels: [...state.completedLevels, levelId] }
        }
        return state
      }),
    }),
    {
      name: 'ganitquest-game-store',
      partialize: (state) => ({
        xp: state.xp,
        stars: state.stars,
        currentLevelId: state.currentLevelId,
        unlockedLevels: state.unlockedLevels,
        completedLevels: state.completedLevels,
      }),
    }
  )
)
