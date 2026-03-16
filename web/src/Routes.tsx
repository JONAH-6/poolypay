// web/src/Routes.jsx
import { Router, Route, Set, Redirect } from '@redwoodjs/router'

import AuthGuard from 'src/components/AuthGuard/AuthGuard'
import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { AuthProvider, useAuth } from './context/authcontext'
const Private = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-4 text-white">Loading...</div>
  if (!user) return <Redirect to="/login" />
  return <>{children}</>
}

const Routes = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path="/plan-selection" page={PlanSelectionPage} name="planSelection" />
        <Route path="/login" page={LoginPage} name="login" />
        <Set wrap={[MainLayout, AuthGuard]}>
          <Set wrap={Private}>
            <Route path="/" page={HomePage} name="home" />
            <Route path="/tasks" page={TasksPage} name="tasks" />
            <Route path="/withdraw" page={WithdrawPage} name="withdraw" />
            <Route path="/invite" page={InvitePage} name="invite" />
          </Set>
        </Set>
        <Route notfound page={NotFoundPage} />
      </Router>
    </AuthProvider>
  )
}

export default Routes
