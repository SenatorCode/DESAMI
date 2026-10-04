// src/lib/placeholderContent.ts
//
// ⚠️ EVERYTHING HERE IS UI-ONLY PLACEHOLDER CONTENT.
// None of these concepts exist in the current v2.4 API/DB schema:
//   - "Level" / level titles / XP-to-next-level (backend only exposes raw `xp`)
//   - Daily target in minutes (backend has `daily_goal_level`, unit unconfirmed)
//   - Per-session "AI Synthesis Summary" text
//   - Per-module description text (StudyModules table only has `title`)
//   - "% Mastered" per session/module
//   - Uploaded file name / page count / size on a session
//   - "DESAMI AI Mentor" predictive insight text
//   - File type tags / flashcard-ready counts on session cards
//
// Purely so the UI/UX can be reviewed end-to-end before the backend dev
// confirms whether/how each of these will be supported. Don't treat any
// function here as source of truth — raise each with the backend dev.

const LEVEL_XP_STEP = 4000 // arbitrary — no real leveling formula exists yet

export function deriveLevel(xp: number) {
  const level = Math.floor(xp / LEVEL_XP_STEP) + 1
  const xpIntoLevel = xp % LEVEL_XP_STEP
  return {
    level,
    label: `Level ${level} Scholar`,
    xpIntoLevel,
    xpForLevel: LEVEL_XP_STEP,
    xpToNext: LEVEL_XP_STEP - xpIntoLevel,
  }
}

export function placeholderDailyTargetMinutes() {
  return 45
}

export function placeholderAiSummary(subjectName: string) {
  return `DESAMI parsed your material on ${subjectName} into key concepts and pre-indexed the high-yield sections for faster review.`
}

export function placeholderModuleDescription() {
  return 'Key definitions, worked examples, and the concepts most likely to appear on your next check-in.'
}

export function placeholderMasteryPercent(seed: number) {
  // Deterministic pseudo-value so it doesn't jump around between renders
  return 40 + ((seed * 17) % 55)
}

export function placeholderFileMeta() {
  return { fileName: 'Uploaded_Material.pdf', pages: 18, sizeMb: 4.2 }
}

export function placeholderAiInsight() {
  return "Keep going — a quick review of your most recent module could help lock in what you just learned."
}