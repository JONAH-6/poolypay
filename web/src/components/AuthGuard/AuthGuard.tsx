import { useEffect } from 'react'

import { useLocation, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/context/authcontext'
// web/src/components/AuthGuard/AuthGuard.tsx
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, dbUser, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate(routes.login())
      return
    }

    // ✅ Only act when dbUser is fully loaded and has the right shape
    if (!dbUser || typeof dbUser.hasPaid === 'undefined') return

    if (!dbUser.hasPaid && location.pathname !== routes.planSelection()) {
      navigate(routes.planSelection())
    }

    if (dbUser.hasPaid && location.pathname === routes.planSelection()) {
      navigate(routes.home())
    }
  }, [user, dbUser, loading, location.pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  // ✅ Don't block render while dbUser is still being fetched
  if (!user) return null

  if (
    dbUser &&
    !dbUser.hasPaid &&
    location.pathname !== routes.planSelection()
  ) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
