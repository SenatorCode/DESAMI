// src/features/study/mocks.ts
// Local-only fixture data + simulated timing so the Study Mode UI/UX can be
// verified end-to-end without a live backend. Gated behind VITE_USE_MOCK_STUDY.
// This does NOT validate real API contracts — only screen flow and interactions.

import type {
  Session,
  SessionListItem,
  StudyData,
  HobbyAnalogy,
  ExplainResponse,
  LoseHeartResponse,
  SaveProgressResponse,
} from './types'

const MOCK_SESSION_ID = 'mock-session-001'
const sessionStartTimes = new Map<string, number>()
let mockHearts = 5

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockCreateSession(): Promise<Session> {
  await delay(600)
  sessionStartTimes.set(MOCK_SESSION_ID, Date.now())
  return {
    session_id: MOCK_SESSION_ID,
    status: 'queued',
    message: 'Upload accepted, processing has begun',
  }
}

export async function mockGetSessionStatus(sessionId: string): Promise<Session> {
  await delay(150)
  const startedAt = sessionStartTimes.get(sessionId) ?? Date.now()
  const elapsed = Date.now() - startedAt

  if (elapsed < 2000) return { session_id: sessionId, status: 'queued', progress: 0 }
  if (elapsed < 6000) {
    const progress = Math.min(95, Math.round(((elapsed - 2000) / 4000) * 95))
    return { session_id: sessionId, status: 'processing', progress }
  }
  return { session_id: sessionId, status: 'completed', progress: 100 }
}

export async function mockListSessions(): Promise<SessionListItem[]> {
  await delay(300)
  return [
    { session_id: 'mock-completed-1', name: 'Biology', upload_status: 'completed', visited_last: '2026-08-20T14:32:00Z' },
    { session_id: 'mock-completed-2', name: 'Chemistry', upload_status: 'completed', visited_last: '2026-08-19T09:10:00Z' },
    { session_id: 'mock-failed-1', name: 'Physics', upload_status: 'failed', visited_last: '2026-08-18T11:00:00Z' },
  ]
}

export async function mockGetStudyData(sessionId: string): Promise<StudyData> {
  await delay(400)
  return {
    session_id: sessionId,
    subject_name: 'Biology',
        modules: [
      {
        id: 1,
        title: 'Introduction to Biology',
        chunks: [
          {
            id: 1,
            text: 'Biology is the study of organisms and living things. We will study living things in this session.',
          },
          {
            id: 2,
            text: 'Why is biology important? Biology is important because we study animals and life processes.',
          },
        ],
        quiz: [
          {
            question_id: 101,
            question: 'What is Biology?',
            options: [
              { option_text: 'It is the study of organisms' },
              { option_text: 'It is the study of robots' },
            ],
            answer: 'It is the study of organisms',
          },
          {
            question_id: 102,
            question: 'Is biology the study of living matter?',
            options: [{ option_text: 'Yes' }, { option_text: 'No' }],
            answer: 'Yes',
          },
        ],
      },
      {
        id: 2,
        title: 'Cell as Unit of Life',
        chunks: [
          {
            id: 1,
            text: 'The cell is the basic structural and functional unit of all living organisms.',
          },
        ],
        quiz: [
          {
            question_id: 201,
            question: 'What is the basic unit of life?',
            options: [{ option_text: 'The cell' }, { option_text: 'The atom' }],
            answer: 'The cell',
          },
        ],
      },
    ],
  }
}

export async function mockGetHobbyAnalogy(): Promise<HobbyAnalogy> {
  await delay(700)
  return {
    id: 2,
    text: "Imagine Ronaldo passing the ball to Lionel Messi — he controls the exact weight of the pass so it arrives perfectly. That's how neurotransmitters deliver signals between neurons.",
  }
}

export async function mockGetExplanation(): Promise<ExplainResponse> {
  await delay(500)
  return {
    text: 'The correct answer reflects the core definition covered in this chunk. The other option describes an unrelated field of study.',
  }
}

export async function mockLoseHeart(): Promise<LoseHeartResponse> {
  await delay(200)
  mockHearts = Math.max(0, mockHearts - 1)
  return { hearts_remaining: mockHearts, max_hearts: 5, can_continue: mockHearts > 0 }
}

export async function mockSaveProgress(): Promise<SaveProgressResponse> {
  await delay(400)
  return {
    status: 'Progress saved',
    xp_gained: 500,
    new_achievements: [
      {
        id: 'FIRST_LESSON',
        title: 'First Timer',
        description: 'Completed your first desami lesson',
        icon: '',
      },
    ],
  }
}