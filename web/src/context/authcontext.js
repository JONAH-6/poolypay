// web/src/context/authcontext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from 'src/firebase'
import { navigate, routes } from '@redwoodjs/router' // ✅ ADD THIS

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // web/src/context/authcontext.js
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      setLoading(true)

      if (!firebaseUser) {
        setDbUser(null)
        setLoading(false)
        navigate(routes.login())
        return
      }

      try {
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? '/.redwood/functions'
          : '/.netlify/functions'

        const res = await fetch(
          `${API_BASE}/getUser?uid=${firebaseUser.uid}&email=${encodeURIComponent(firebaseUser.email)}`
        )

        if (!res.ok) throw new Error('Failed to fetch user')

        const raw = await res.json()

        // ✅ THE KEY FIX: Lambda returns data inside `body` as a JSON string
        const userData = raw

        console.log('userData:', userData) // ← keep this during testing
        setDbUser(userData)

        if (userData.hasPaid === true) {
          navigate(routes.home())
        } else {
          navigate(routes.planSelection())
        }

      } catch (error) {
        console.error('Failed to fetch user from DB:', error)
        navigate(routes.login())
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const emailSignUp = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const emailSignIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user: firebaseUser,
    dbUser,
    loading,
    googleSignIn,
    emailSignUp,
    emailSignIn,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
