// src/features/waitlist/components/WaitlistForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { waitlistSchema, type WaitlistFormValues } from '../schema'
import { joinWaitlist } from '../api'

export function WaitlistForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WaitlistFormValues>({ resolver: zodResolver(waitlistSchema) })

  const mutation = useMutation({
  mutationFn: joinWaitlist,
  onSuccess: (data) => {
    toast.success(`You're #${data.id} on the list!`)
    reset()
  },
  onError: (error: Error) => toast.error(error.message),
})

  const onSubmit = (values: WaitlistFormValues) => mutation.mutate(values)

  return (
    <form id="waitlist-form" onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md" noValidate>
      <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@university.edu"
            aria-invalid={!!errors.email}
            className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground placeholder:text-muted-foreground outline-none ring-primary/50 focus:ring-2"
            {...register('email')}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 shrink-0 rounded-xl bg-accent px-6 font-medium text-accent-foreground transition active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? 'Joining…' : 'Secure My Spot'}
        </button>
      </div>
      {errors.email && (
        <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
      )}
    </form>
  )
}