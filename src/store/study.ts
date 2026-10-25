// src/store/study.ts
import { create } from 'zustand'

interface StudyRuntimeState {
  hearts: number
  maxHearts: number
  /** Epoch ms when the next heart regenerates; set when the backend says OUT_OF_HEARTS. */
  nextHeartAt: number | null
  setHearts: (hearts: number, maxHearts: number) => void
  setNextHeartIn: (seconds: number | null) => void
}

// Runtime-only (not persisted) — hearts are authoritative from the backend
// via /api/lose_heart/ and /api/users/me/, this just mirrors the latest known value
// for immediate UI feedback between requests.
export const useStudyRuntimeStore = create<StudyRuntimeState>((set) => ({
  hearts: 5,
  maxHearts: 5,
  nextHeartAt: null,
  setHearts: (hearts, maxHearts) => set({ hearts, maxHearts }),
  setNextHeartIn: (seconds) => set({ nextHeartAt: seconds == null ? null : Date.now() + seconds * 1000 }),
}))