import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { hobbySchema, type HobbyFormValues } from './schema'
import { addHobby } from './api'
import { extractErrorMessage } from '@/lib/axios'

export function HobbyOnboardingPage() {
  const navigate = useNavigate()
  const [added, setAdded] = useState<HobbyFormValues[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HobbyFormValues>({ resolver: zodResolver(hobbySchema) })

  const mutation = useMutation({
    mutationFn: addHobby,
    onSuccess: (_data, variables) => {
      setAdded((prev) => [...prev, variables])
      reset()
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold">What are you into?</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Add at least one hobby — we'll use it to re-explain everything you study.
        </p>

        {added.length > 0 && (
          <ul className="mb-6 flex flex-wrap gap-2">
            {added.map((h, i) => (
              <li
                key={i}
                className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
              >
                {h.hobby_name}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mb-6" noValidate>
          <div className="mb-3">
            <input
              placeholder="Hobby (e.g. Football)"
              aria-invalid={!!errors.hobby_name}
              className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground outline-none ring-primary/50 focus:ring-2"
              {...register('hobby_name')}
            />
            {errors.hobby_name && <p className="mt-1.5 text-sm text-destructive">{errors.hobby_name.message}</p>}
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Tell us a bit about it — what draws you to it, key terms you know"
              rows={3}
              aria-invalid={!!errors.hobby_description}
              className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-foreground outline-none ring-primary/50 focus:ring-2"
              {...register('hobby_description')}
            />
            {errors.hobby_description && (
              <p className="mt-1.5 text-sm text-destructive">{errors.hobby_description.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-medium transition hover:bg-muted disabled:opacity-60"
          >
            <Plus size={16} />
            {mutation.isPending ? 'Adding…' : 'Add hobby'}
          </button>
        </form>

        <button
          onClick={() => navigate('/dashboard')}
          disabled={added.length === 0}
          className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
        >
          Continue to dashboard
        </button>
        {added.length === 0 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">Add at least one hobby to continue</p>
        )}
      </div>
    </main>
  )
}