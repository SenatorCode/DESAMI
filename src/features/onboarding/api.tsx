import { api } from '@/lib/axios'
import type { HobbyFormValues } from './schema'

export async function addHobby(values: HobbyFormValues) {
  const { data } = await api.post('/api/hobbies/', values)
  return data
}