import { Routes, Route } from 'react-router-dom'
import { WaitlistPage } from '@/features/waitlist/WaitlistPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WaitlistPage />} />
    </Routes>
  )
}