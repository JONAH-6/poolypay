import { useEffect } from 'react'

import { useLocation, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/context/authcontext'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, dbUser, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (loading) return

    if (!user) {
      navigate(routes.login())
      return
    }

    // If user is logged in but hasn't paid, redirect to plan selection
    if (
      dbUser &&
      !dbUser.hasPaid &&
      location.pathname !== routes.planSelection()
    ) {
      navigate(routes.planSelection())
    }

    // If user has paid and is on plan selection, redirect to home
    if (
      dbUser &&
      dbUser.hasPaid &&
      location.pathname === routes.planSelection()
    ) {
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

  if (
    !user ||
    (dbUser && !dbUser.hasPaid && location.pathname !== routes.planSelection())
  ) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
