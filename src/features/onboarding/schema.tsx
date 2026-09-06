import { z } from 'zod'

export const hobbySchema = z.object({
  hobby_name: z.string().min(1, 'Give this hobby a name'),
  hobby_description: z.string().min(1, 'Add a short description'),
})
export type HobbyFormValues = z.infer<typeof hobbySchema>