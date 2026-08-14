// src/features/waitlist/components/WaitlistForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { waitlistSchema, type WaitlistFormValues } from '../schema'
import { mockJoinWaitlist } from '../api'

export function WaitlistForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WaitlistFormValues>({ resolver: zodResolver(waitlistSchema) })

  const mutation = useMutation({
    mutationFn: mockJoinWaitlist,
    onSuccess: (data) => {
      toast.success(`You're #${data.position} on the list`)
      reset()
    },
    onError: () => toast.error('Could not join the waitlist. Try again.'),
  })

  const onSubmit = (values: WaitlistFormValues) => mutation.mutate(values)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-label="Email address"
            aria-invalid={!!errors.email}
            className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground placeholder:text-muted-foreground outline-none ring-primary/50 focus:ring-2"
            {...register('email')}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 shrink-0 rounded-xl bg-primary px-6 font-medium text-primary-foreground transition active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? 'Joining…' : 'Join waitlist'}
        </button>
      </div>
      {errors.email && (
        <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
      )}
    </form>
  )
}