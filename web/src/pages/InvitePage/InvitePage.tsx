import { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

// Simple confetti component
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {[...Array(30)].map((_, i) => (
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

const InvitePage = () => {
  const [username, setUsername] = useState('User')
  const [copyMsg, setCopyMsg] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [referralCount, setReferralCount] = useState(0) // This would come from backend
  const [referralEarnings, setReferralEarnings] = useState(0)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser') || 'User'
    setUsername(storedUser)

    // Load referral data (dummy for now, replace with actual)
    const storedReferrals = parseInt(
      localStorage.getItem(`${storedUser}_referrals`) || '0'
    )
    setReferralCount(storedReferrals)
    setReferralEarnings(storedReferrals * 1000)
  }, [])

  const inviteLink = `https://wa.me/2347013639093?text=Text%20this%20number%20(+2347013639093)%20for%20registration%20to%20join%20PoolyPay.`

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopyMsg('Invite link copied!')
      setShowConfetti(true)
      setTimeout(() => {
        setCopyMsg('')
        setShowConfetti(false)
      }, 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-background to-gray-900">
      <Confetti active={showConfetti} />

      {/* Header with stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-white/20 bg-white/10 px-4 py-6 text-white shadow-2xl backdrop-blur-lg sm:px-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
            Invite & Earn
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-300">Referral Earnings</p>
            <motion.p
              key={referralEarnings}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-primary"
            >
              ₦{referralEarnings}
            </motion.p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-300">Total Referrals</span>
          <span className="font-bold text-cyan-400">{referralCount}</span>
        </div>
      </motion.div>

      {/* Main invite card */}
      <section className="w-full px-4 pb-24 pt-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm"
        >
          <h2 className="mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-center text-2xl font-bold text-transparent">
            Invite Friends, Earn ₦1,000 Each!
          </h2>
          <p className="mb-6 text-center text-gray-300">
            Share your unique invite link. When your friend registers and
            activates their account, you earn{' '}
            <span className="font-bold text-cyan-400">₦1,000</span> instantly!
          </p>

          {/* Invite link box */}
          <div className="mb-4 text-center">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 rounded-xl bg-gray-800/80 px-4 py-3 text-sm text-white placeholder-gray-400 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-cyan-400"
              />
              <motion.button
                onClick={copyInvite}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-cyan-500/30"
              >
                Copy Link
              </motion.button>
            </div>
            <AnimatePresence>
              {copyMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-secondary"
                >
                  {copyMsg} 🎉
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Social share buttons (optional, but nice) */}
          <div className="mt-6 flex justify-center gap-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Join PoolyPay and earn money! Use my invite link: ${inviteLink}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white transition hover:scale-110"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                inviteLink
              )}&text=${encodeURIComponent('Join PoolyPay and start earning!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white transition hover:scale-110"
            >
              <i className="fa-brands fa-telegram text-xl"></i>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Earn money with PoolyPay! Join using my invite link: ${inviteLink}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white transition hover:scale-110"
            >
              <i className="fa-brands fa-twitter text-xl"></i>
            </a>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Tip: Share on WhatsApp, Telegram, or Twitter for maximum referrals!
          </p>
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

export default InvitePage
