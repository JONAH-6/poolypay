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

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      if (firebaseUser) {
        try {
          // Fetch user data from your backend
          const API_BASE = process.env.NODE_ENV === 'production'
            ? 'https://poolypays.netlify.app/.redwood/functions'
            : '/.redwood/functions'

          const res = await fetch(`${API_BASE}/getUser?uid=${firebaseUser.uid}&email=${firebaseUser.email}`)
          const data = await res.json()
          setDbUser(data)

          // Redirect based on payment status
          if (data.hasPaid) {
            navigate('/')
          } else {
            navigate('/plan-selection')
          }
        } catch (error) {
          console.error('Failed to fetch user from DB', error)
        }
      } else {
        setDbUser(null)
        navigate('/login')
      }
      setLoading(false)
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
