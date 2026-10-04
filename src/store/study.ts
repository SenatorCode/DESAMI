// src/store/study.ts
import { create } from 'zustand'

interface StudyRuntimeState {
  hearts: number
  maxHearts: number
  setHearts: (hearts: number, maxHearts: number) => void
}

// Runtime-only (not persisted) — hearts are authoritative from the backend
// via /api/lose_heart and /api/users/me, this just mirrors the latest known value
// for immediate UI feedback between requests.
export const useStudyRuntimeStore = create<StudyRuntimeState>((set) => ({
  hearts: 5,
  maxHearts: 5,
  setHearts: (hearts, maxHearts) => set({ hearts, maxHearts }),
}))