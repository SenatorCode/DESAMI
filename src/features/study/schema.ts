// src/features/study/schema.ts
import { z } from 'zod'

// ⚠️ UNCONFIRMED: v2.4 doc says "images, docx, pdf" for session uploads.
// The older (stale) error-responses doc says "PDF, DOCX, and TXT" instead — no images.
// Going with v2.4 as source of truth since it's the newer, authoritative doc.
// Flag this mismatch with the backend dev.
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/png',
  'image/jpeg',
]

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB, per error doc's FILE_TOO_LARGE case

const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, 'Each file must be under 50MB')
  .refine(
    (f) => ALLOWED_MIME_TYPES.includes(f.type),
    'Only PDF, DOCX, or image files are supported'
  )

export const studyUploadSchema = z.object({
  files: z.array(fileSchema).min(1, 'Please upload at least one file'),
})

export type StudyUploadValues = z.infer<typeof studyUploadSchema>