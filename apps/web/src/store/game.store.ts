import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// TEST MODE: All levels unlocked for testing
// Generate all level IDs for all chapters
const generateAllLevels = (): string[] => {
  const levels: string[] = []
  // Surface Areas and Volumes (lvl-01 to lvl-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-${i.toString().padStart(2, '0')}`)
  // Coordinate Geometry (lvl-cg-01 to lvl-cg-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-cg-${i.toString().padStart(2, '0')}`)
  // Trigonometry (lvl-trig-01 to lvl-trig-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-trig-${i.toString().padStart(2, '0')}`)
  // Applications of Trigonometry (lvl-apptrig-01 to lvl-apptrig-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-apptrig-${i.toString().padStart(2, '0')}`)
  // Arithmetic Progression (lvl-ap-01 to lvl-ap-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-ap-${i.toString().padStart(2, '0')}`)
  // Probability (lvl-prob-01 to lvl-prob-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-prob-${i.toString().padStart(2, '0')}`)
  // Triangles (lvl-tri-01 to lvl-tri-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-tri-${i.toString().padStart(2, '0')}`)
  // Circles (lvl-circle-01 to lvl-circle-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-circle-${i.toString().padStart(2, '0')}`)
  // Real Numbers (lvl-rn-01 to lvl-rn-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-rn-${i.toString().padStart(2, '0')}`)
  // Polynomials (lvl-poly-01 to lvl-poly-30)
  for (let i = 1; i <= 30; i++) levels.push(`lvl-poly-${i.toString().padStart(2, '0')}`)
  return levels
}

const INITIAL_UNLOCKED = generateAllLevels()

interface GameState {
  xp: number
  stars: number
  currentLevelId: string | null
  unlockedLevels: string[]
  completedLevels: string[]
  isSyncing: boolean
  addXp: (amount: number) => void
  addStars: (amount: number) => void
  setCurrentLevel: (levelId: string) => void
  unlockLevel: (levelId: string) => void
  completeLevel: (levelId: string) => void
  loadProgress: (progress: { xp: number; stars: number; completedLevels: string[]; unlockedLevels: string[] }) => void
  syncProgress: (token: string) => Promise<void>
  reset: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      stars: 0,
      currentLevelId: null,
      unlockedLevels: INITIAL_UNLOCKED,
      completedLevels: [],
      isSyncing: false,

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

      loadProgress: (progress) => set((state) => ({
        xp: progress.xp > 0 ? progress.xp : state.xp,
        stars: progress.stars > 0 ? progress.stars : state.stars,
        // Merge: server completed + local completed
        completedLevels: Array.from(new Set([...state.completedLevels, ...(progress.completedLevels ?? [])])),
        // Trust server's unlockedLevels if provided; otherwise use INITIAL_UNLOCKED for new users
        unlockedLevels: (progress.unlockedLevels && progress.unlockedLevels.length > 0)
          ? Array.from(new Set([...progress.unlockedLevels, ...state.unlockedLevels]))
          : Array.from(new Set([...INITIAL_UNLOCKED, ...state.unlockedLevels])),
      })),

      syncProgress: async (token: string) => {
        if (get().isSyncing) return
        set({ isSyncing: true })
        try {
          const { xp, stars, completedLevels, unlockedLevels } = get()
          await axios.post(
            `${API_URL}/progress/sync`,
            { xp, stars, completedLevels, unlockedLevels },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } catch (err) {
          console.warn('Progress sync failed (offline?):', err)
        } finally {
          set({ isSyncing: false })
        }
      },

      reset: () => set({
        xp: 0,
        stars: 0,
        currentLevelId: null,
        unlockedLevels: INITIAL_UNLOCKED,
        completedLevels: [],
        isSyncing: false,
      }),
    }),
    {
      name: 'ganitquest-game-store',
      version: 5, // TEST MODE: Bump version to force reset and unlock all levels
      partialize: (state) => ({
        xp: state.xp,
        stars: state.stars,
        currentLevelId: state.currentLevelId,
        unlockedLevels: state.unlockedLevels,
        completedLevels: state.completedLevels,
      }),
      migrate: (persistedState: any, version: number) => {
        // TEST MODE: Always reset to unlock all levels
        if (version < 2 || true) { // '|| true' forces reset every time for testing
          return {
            xp: 0,
            stars: 0,
            currentLevelId: null,
            unlockedLevels: INITIAL_UNLOCKED,
            completedLevels: [],
            isSyncing: false,
          }
        }
        return persistedState as any
      },
    }
  )
)
