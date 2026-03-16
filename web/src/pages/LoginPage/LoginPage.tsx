// web/src/pages/LoginPage/LoginPage.tsx
import { useState, useEffect } from 'react'

import { GoogleButton } from 'react-google-button'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/context/authcontext'

const LoginPage = () => {
  const { user, googleSignIn, emailSignUp, emailSignIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(routes.home())
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      if (isLogin) {
        await emailSignIn(email, password)
      } else {
        await emailSignUp(email, password)
      }
      // On success, the useEffect above will redirect
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setMessage('')
    setLoading(true)
    try {
      await googleSignIn()
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Google sign‑in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl bg-background-light p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-primary">
          Welcome to <i className="not-italic text-secondary">PoolyPay</i>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-2xl text-primary">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <div>
            <label className="mb-1 block font-bold text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-primary bg-background-dark p-3 text-white focus:border-secondary focus:outline-none"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-primary bg-background-dark p-3 text-white focus:border-secondary focus:outline-none"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-cyan-400 hover:underline disabled:opacity-50"
            disabled={loading}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </form>

        <div className="my-4 text-center text-white">or</div>

        <GoogleButton
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full"
        />

        {message && (
          <p className="mt-4 text-center font-bold text-red-400">{message}</p>
        )}
      </div>
    </div>
  )
}

export default LoginPage
