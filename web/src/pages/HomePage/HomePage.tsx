import { useEffect, useState, useRef } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { Link, routes } from '@redwoodjs/router'

const TASKS_PER_DAY = 3
const TASK_REWARD = 250
const TAP_REWARD = 0.2 // ₦0.20 per tap

// Confetti component (simple version)
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
          animate={{ y: window.innerHeight + 100, rotate: 360 }}
          transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut' }}
          className="absolute h-2 w-2 rounded-full bg-yellow-400"
          style={{ left: Math.random() * 100 + '%' }}
        />
      ))}
    </div>
  )
}

// Particle effect on tap
const TapParticles = ({ active }: { active: boolean }) => {
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 2 * Math.PI
        const distance = 60
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
          />
        )
      })}
    </div>
  )
}

const HomePage = () => {
  const username = localStorage.getItem('currentUser') || 'User'
  const [balance, setBalance] = useState(0)
  const [answered, setAnswered] = useState<number[]>([])
  const [lastTaskTime, setLastTaskTime] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [tapScale, setTapScale] = useState(1)
  const [tapRotate, setTapRotate] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const balanceRef = useRef<HTMLParagraphElement>(null)
  const tapTimeout = useRef<NodeJS.Timeout>()

  // Load user data
  useEffect(() => {
    const storedBalance = parseFloat(
      localStorage.getItem(`${username}_balance`) || '0'
    )
    setBalance(storedBalance)

    const storedAnswered = JSON.parse(
      localStorage.getItem(`${username}_answeredQuestions`) || '[]'
    )
    setAnswered(storedAnswered)

    const storedLastTime = parseInt(
      localStorage.getItem(`${username}_lastTaskTime`) || '0'
    )
    setLastTaskTime(storedLastTime)
  }, [username])

  // Animate balance changes
  useEffect(() => {
    if (balanceRef.current) {
      balanceRef.current.style.transform = 'scale(1.1)'
      setTimeout(() => {
        if (balanceRef.current) balanceRef.current.style.transform = 'scale(1)'
      }, 200)
    }
  }, [balance])

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance)
    localStorage.setItem(`${username}_balance`, newBalance.toString())
  }

  const handleTap = () => {
    // Cancel any pending timeout to avoid conflicts
    if (tapTimeout.current) clearTimeout(tapTimeout.current)

    // Complex animation sequence
    setTapScale(0.7)
    setTapRotate(-10)
    setShowParticles(true)
    tapTimeout.current = setTimeout(() => {
      setTapScale(1.2)
      setTapRotate(5)
      setTimeout(() => {
        setTapScale(1)
        setTapRotate(0)
        setShowParticles(false)
      }, 150)
    }, 100)

    // Increase balance by TAP_REWARD (₦0.20)
    const newBalance = Math.round((balance + TAP_REWARD) * 100) / 100
    updateBalance(newBalance)
  }

  const quickQuestions = [
    { q: '7 × 6 = ?', a: 42 },
    { q: '5 + 8 = ?', a: 13 },
    { q: '10 − 4 = ?', a: 6 },
    { q: '2 × 2 = ?', a: 4 },
    { q: '2 × 8 = ?', a: 16 },
  ]

  const handleQuickAnswer = (index: number, correctAnswer: number) => {
    const input = document.getElementById(
      `quick-answer-${index}`
    ) as HTMLInputElement
    const resultSpan = document.getElementById(`quick-result-${index}`)
    if (!input || !resultSpan) return

    const answer = parseInt(input.value)
    if (answer === correctAnswer) {
      resultSpan.innerText = '✅ Correct! ₦250 added.'
      resultSpan.style.color = '#10b981'

      const newBalance = balance + TASK_REWARD
      updateBalance(newBalance)

      const newAnswered = [...answered, Date.now()]
      setAnswered(newAnswered)
      localStorage.setItem(
        `${username}_answeredQuestions`,
        JSON.stringify(newAnswered)
      )

      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      resultSpan.innerText = '❌ Try again'
      resultSpan.style.color = '#ef4444'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-background to-gray-900">
      <Confetti active={showConfetti} />

      {/* Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-white/20 bg-white/10 px-4 py-6 text-white shadow-2xl backdrop-blur-lg sm:px-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-300">
              Your Balance
            </h2>
            <motion.p
              ref={balanceRef}
              key={balance}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent"
            >
              ₦{balance.toFixed(2)}
            </motion.p>
          </div>
          <Link
            to={routes.withdraw()}
            className="group flex flex-col items-center rounded-xl bg-white/5 p-3 backdrop-blur-sm transition hover:bg-white/10"
          >
            <i className="fa-solid fa-arrow-down text-2xl text-red-400 transition-transform group-hover:scale-110"></i>
            <span className="mt-1 text-xs text-gray-300">Withdraw</span>
          </Link>
        </div>
      </motion.div>

      {/* Tap to Earn - with particles and advanced animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full py-8 text-center"
      >
        <p className="mb-3 text-sm text-gray-300">Tap to earn ₦0.20</p>
        <motion.div
          animate={{ scale: tapScale }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mx-auto inline-block"
        >
          <div
            onClick={handleTap}
            className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:blur-xl before:content-[''] hover:shadow-cyan-500/50"
          >
            <i className="fa-solid fa-hand text-5xl text-white drop-shadow-lg"></i>
          </div>
          {/* The ping effect should not block clicks because it's a sibling, but if it does, add pointer-events-none */}
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-white/30"></span>
          <TapParticles active={showParticles} />
        </motion.div>
        <p className="mt-4 text-xs text-gray-400">
          Keep tapping, every tap counts!
        </p>
      </motion.div>

      {/* Quick Questions */}
      <section className="w-full px-4 pb-20 sm:px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-center text-2xl font-bold text-transparent"
        >
          Solve & Earn ₦250 Each!
        </motion.h2>

        <div className="space-y-4">
          {quickQuestions.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
              }}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm"
            >
              <label className="mb-2 block font-medium text-cyan-300">
                {q.q}
              </label>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <input
                  id={`quick-answer-${idx}`}
                  type="number"
                  className="flex-1 rounded-xl bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/20 transition focus:ring-2 focus:ring-cyan-400"
                  placeholder="Your answer"
                />
                <button
                  onClick={() => handleQuickAnswer(idx, q.a)}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-cyan-500/30"
                >
                  Submit
                </button>
              </div>
              <AnimatePresence>
                <motion.span
                  id={`quick-result-${idx}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 block text-sm font-medium"
                />
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <Link
            to={routes.tasks()}
            className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-purple-500/30"
          >
            See More Tasks
          </Link>
        </motion.div>
      </section>

      {/* Floating background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-700/20 blur-3xl"></div>
      </div>
    </div>
  )
}

export default HomePage
