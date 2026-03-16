import { useEffect, useState, useRef } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

const ALL_QUESTIONS = [
  { q: '7 × 6 = ?', a: 42 },
  { q: '5 + 8 = ?', a: 13 },
  { q: '10 − 4 = ?', a: 6 },
  { q: '2 × 2 = ?', a: 4 },
  { q: '2 × 8 = ?', a: 16 },
  // Add more as needed – you can push duplicates to reach desired count
]
// Repeat to have enough questions
for (let i = 0; i < 10; i++) {
  ALL_QUESTIONS.push(...ALL_QUESTIONS.slice(0, 5))
}

const TASKS_PER_DAY = 3
const TASK_REWARD = 250
const LOCK_HOURS = 20

// Simple confetti component
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {[...Array(40)].map((_, i) => (
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

const TasksPage = () => {
  const username = localStorage.getItem('currentUser') || 'User'
  const [answered, setAnswered] = useState<number[]>([])
  const [lastTaskTime, setLastTaskTime] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [balance, setBalance] = useState(0)
  const [todayEarned, setTodayEarned] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [submitScale, setSubmitScale] = useState(1)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedAnswered = JSON.parse(
      localStorage.getItem(`${username}_answeredQuestions`) || '[]'
    )
    setAnswered(storedAnswered)

    const storedLastTime = parseInt(
      localStorage.getItem(`${username}_lastTaskTime`) || '0'
    )
    setLastTaskTime(storedLastTime)

    const storedEarnings = parseInt(
      localStorage.getItem(`${username}_earnings`) || '0'
    )
    setEarnings(storedEarnings)

    const storedBalance = parseFloat(
      localStorage.getItem(`${username}_balance`) || '0'
    )
    setBalance(storedBalance)

    const todayCount = storedAnswered.length % TASKS_PER_DAY
    setTodayEarned(todayCount * TASK_REWARD)
  }, [username])

  const isLocked = () => {
    if (answered.length === 0) return false
    if (answered.length % TASKS_PER_DAY !== 0) return false
    const now = Date.now()
    const unlockTime = lastTaskTime + LOCK_HOURS * 60 * 60 * 1000
    return now < unlockTime
  }

  const getLockHoursLeft = () => {
    const now = Date.now()
    const unlockTime = lastTaskTime + LOCK_HOURS * 60 * 60 * 1000
    const diff = unlockTime - now
    return Math.ceil(diff / (60 * 60 * 1000))
  }

  const getTodaysQuestions = () => {
    const start = answered.length
    return ALL_QUESTIONS.slice(start, start + TASKS_PER_DAY)
  }

  const handleSubmit = (idx: number, correctAnswer: number) => {
    if (isLocked()) return

    const input = document.getElementById(
      `task-answer-${idx}`
    ) as HTMLInputElement
    const resultSpan = document.getElementById(`task-result-${idx}`)
    if (!input || !resultSpan) return

    const answer = parseInt(input.value)
    if (answer === correctAnswer) {
      // Button tap animation
      setSubmitScale(0.95)
      setTimeout(() => setSubmitScale(1), 150)

      resultSpan.innerText = `✅ Correct! ₦${TASK_REWARD} added.`
      resultSpan.style.color = '#10b981'

      const newAnswered = [...answered, Date.now()]
      const newEarnings = earnings + TASK_REWARD
      const newBalance = balance + TASK_REWARD

      setAnswered(newAnswered)
      setEarnings(newEarnings)
      setBalance(newBalance)

      localStorage.setItem(
        `${username}_answeredQuestions`,
        JSON.stringify(newAnswered)
      )
      localStorage.setItem(`${username}_earnings`, newEarnings.toString())
      localStorage.setItem(`${username}_balance`, newBalance.toString())

      if (newAnswered.length % TASKS_PER_DAY === 0) {
        const now = Date.now()
        setLastTaskTime(now)
        localStorage.setItem(`${username}_lastTaskTime`, now.toString())
      }

      setTodayEarned((newAnswered.length % TASKS_PER_DAY) * TASK_REWARD)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    } else {
      resultSpan.innerText = '❌ Try again'
      resultSpan.style.color = '#ef4444'
    }
  }

  const locked = isLocked()
  const todaysQuestions = locked ? [] : getTodaysQuestions()
  const completedToday = answered.length % TASKS_PER_DAY
  const progressPercent = (completedToday / TASKS_PER_DAY) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-background to-gray-900">
      <Confetti active={showConfetti} />

      {/* Header with progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-white/20 bg-white/10 px-4 py-6 text-white shadow-2xl backdrop-blur-lg sm:px-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
            Daily Tasks
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-300">Today's earnings</p>
            <p className="text-2xl font-bold text-primary">
              ₦{todayEarned} / ₦{TASKS_PER_DAY * TASK_REWARD}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-gray-700">
          <motion.div
            ref={progressRef}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
          />
        </div>
      </motion.div>

      {/* Tasks section - full width */}
      <section className="w-full px-4 pb-24 pt-6 sm:px-6">
        {locked ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
          >
            <i className="fa-solid fa-lock mb-4 text-5xl text-yellow-400"></i>
            <h2 className="mb-2 text-2xl font-bold text-secondary">
              Tasks Locked
            </h2>
            <p className="text-gray-300">
              You've completed today's tasks. Come back in{' '}
              <span className="font-bold text-cyan-400">
                {getLockHoursLeft()} hour(s)
              </span>
              !
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {todaysQuestions.map((q, idx) => (
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
                    id={`task-answer-${idx}`}
                    type="number"
                    className="flex-1 rounded-xl bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/20 transition focus:ring-2 focus:ring-cyan-400"
                    placeholder="Your answer"
                  />
                  <motion.button
                    animate={{ scale: submitScale }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={() => handleSubmit(idx, q.a)}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-cyan-500/30"
                  >
                    Submit
                  </motion.button>
                </div>
                <AnimatePresence>
                  <motion.span
                    id={`task-result-${idx}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 block text-sm font-medium"
                  />
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Floating background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-700/20 blur-3xl"></div>
      </div>
    </div>
  )
}

export default TasksPage
