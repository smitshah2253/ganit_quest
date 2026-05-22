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
      unlockedLevels: [
        'lvl-01', 'lvl-cg-01', 'lvl-trig-01',
        'lvl-ap-01', 'lvl-ap-02', 'lvl-ap-03', 'lvl-ap-04', 'lvl-ap-05', 'lvl-ap-06',
        'lvl-ap-07', 'lvl-ap-08', 'lvl-ap-09', 'lvl-ap-10', 'lvl-ap-11', 'lvl-ap-12',
        'lvl-ap-13', 'lvl-ap-14', 'lvl-ap-15', 'lvl-ap-16', 'lvl-ap-17', 'lvl-ap-18',
        'lvl-ap-19', 'lvl-ap-20', 'lvl-ap-21', 'lvl-ap-22', 'lvl-ap-23', 'lvl-ap-24',
        'lvl-ap-25', 'lvl-ap-26', 'lvl-ap-27', 'lvl-ap-28', 'lvl-ap-29', 'lvl-ap-30',
        'lvl-prob-01', 'lvl-prob-02', 'lvl-prob-03', 'lvl-prob-04', 'lvl-prob-05', 'lvl-prob-06',
        'lvl-prob-07', 'lvl-prob-08', 'lvl-prob-09', 'lvl-prob-10', 'lvl-prob-11', 'lvl-prob-12',
        'lvl-prob-13', 'lvl-prob-14', 'lvl-prob-15', 'lvl-prob-16', 'lvl-prob-17', 'lvl-prob-18',
        'lvl-prob-19', 'lvl-prob-20', 'lvl-prob-21', 'lvl-prob-22', 'lvl-prob-23', 'lvl-prob-24',
        'lvl-prob-25', 'lvl-prob-26', 'lvl-prob-27', 'lvl-prob-28', 'lvl-prob-29', 'lvl-prob-30'
      ], // All AP + Probability levels unlocked for testing
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
