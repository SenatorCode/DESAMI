import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../api'

export function useUserProfile(enabled = true) {
  return useQuery({ queryKey: ['user-profile'], queryFn: getUserProfile, enabled })
}