import { useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

const WithdrawPage = () => {
  const username = localStorage.getItem('currentUser') || 'User'
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [bankName, setBankName] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedBalance = parseFloat(
      localStorage.getItem(`${username}_balance`) || '0'
    )
    setBalance(storedBalance)
  }, [username])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)

    // Validation
    if (amt < 7500) {
      setMessage({ text: 'Minimum withdrawal is ₦7,500.', type: 'error' })
      return
    }
    if (amt > balance) {
      setMessage({ text: 'You do not have enough balance.', type: 'error' })
      return
    }

    // Simulate sending request
    setIsSubmitting(true)
    setMessage({ text: '', type: '' })

    // Fake API call
    setTimeout(() => {
      setIsSubmitting(false)
      setMessage({
        text: 'Withdrawal request sent! Admin will process your payment.',
        type: 'success',
      })

      // Optionally deduct balance (uncomment to simulate)
      // const newBalance = balance - amt
      // setBalance(newBalance)
      // localStorage.setItem(`${username}_balance`, newBalance.toString())
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-background to-gray-900">
      {/* Header with balance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-white/20 bg-white/10 px-4 py-6 text-white shadow-2xl backdrop-blur-lg sm:px-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
            Withdraw Funds
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-300">Your Balance</p>
            <motion.p
              key={balance}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-primary"
            >
              ₦{balance.toFixed(2)}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Withdrawal form - full width with inner padding */}
      <section className="w-full px-4 pb-24 pt-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Amount (Minimum ₦7,500)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="7500"
                required
                className="w-full rounded-xl bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/20 transition focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter amount"
              />
            </div>

            {/* Account number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full rounded-xl bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/20 transition focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter account number"
              />
            </div>

            {/* Account name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Bank Account Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                className="w-full rounded-xl bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/20 transition focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter account name"
              />
            </div>

            {/* Bank name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full rounded-xl bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/20 transition focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter bank name"
              />
            </div>

            {/* Submit button with loading state */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
              className={`w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-cyan-500/30 ${
                isSubmitting ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Request Withdrawal'
              )}
            </motion.button>

            {/* Message display with animation */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 rounded-xl p-4 text-center font-medium ${
                    message.type === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
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

export default WithdrawPage
