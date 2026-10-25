// src/features/study/components/SessionUpload.tsx
import { useState, type DragEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UploadCloud, X, FileText, Layers, Brain, Sparkles, Loader2 } from 'lucide-react'
import { createSession } from '../api'
import { studyUploadSchema, ALLOWED_MIME_TYPES } from '../schema'
import { extractErrorMessage } from '@/lib/axios'

const NEXT_STEPS = [
  { icon: Layers, title: 'We structure it', text: 'Your notes are split into digestible study modules automatically.' },
  { icon: Brain, title: 'AI builds analogies', text: 'Each concept gets tied to the hobby you told us about at signup.' },
  { icon: Sparkles, title: 'You lock it in', text: 'Check-in questions confirm it actually stuck before you move on.' },
]

interface SessionUploadProps {
  onSessionCreated: (sessionId: string) => void
}

export function SessionUpload({ onSessionCreated }: SessionUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const mutation = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => onSessionCreated(data.session_id),
    onError: (err) => toast.error(extractErrorMessage(err)),
  })

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const merged = [...files, ...Array.from(incoming)]
    const result = studyUploadSchema.safeParse({ files: merged })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid file selection')
      return
    }
    setError(null)
    setFiles(merged)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const handleSubmit = () => {
    const result = studyUploadSchema.safeParse({ files })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid file selection')
      return
    }
    mutation.mutate(files)
  }

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <h1 className="text-2xl font-semibold">Turn your notes into a study session</h1>
        <p className="mt-2 text-muted-foreground">
          Drop in lecture slides, a syllabus, or photos of handwritten notes — DESAMI does the rest.
        </p>

        <label
          htmlFor="study-upload"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${
            isDragging ? 'scale-[1.01] border-primary bg-primary/5' : 'border-border bg-muted/40 hover:bg-muted/60'
          }`}
        >
          <div className={`grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary transition ${isDragging ? 'scale-110' : ''}`}>
            <UploadCloud size={26} />
          </div>
          <div>
            <p className="font-medium">Drop your notes here, or tap to browse</p>
            <p className="mt-1 text-sm text-muted-foreground">PDF, DOCX, or images — up to 50MB each</p>
          </div>
          <input
            id="study-upload"
            type="file"
            multiple
            accept={ALLOWED_MIME_TYPES.join(',')}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        {files.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5">
                <FileText size={16} className="shrink-0 text-primary" />
                <span className="flex-1 truncate text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                <button onClick={() => removeFile(i)} aria-label={`Remove ${file.name}`} className="text-muted-foreground transition hover:text-destructive">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleSubmit}
          disabled={files.length === 0 || mutation.isPending}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
          {mutation.isPending ? 'Uploading…' : 'Start Studying'}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What happens next</span>
        <div className="mt-4 flex flex-col gap-5">
          {NEXT_STEPS.map((step) => (
            <div key={step.title} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <step.icon size={16} />
              </div>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}