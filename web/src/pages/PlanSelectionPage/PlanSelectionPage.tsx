// web/src/pages/PlanSelectionPage/PlanSelectionPage.tsx
import { useState } from 'react'

import { navigate, routes } from '@redwoodjs/router'

const PLANS = [
  {
    id: 'plan1',
    name: 'Plan 1',
    price: 3000,
    weeklyReturn: 7000,
    dailyEarnings: 1000,
    referralBonus: 500,
    tasksPerDay: 5,
    earningsPerTask: 200,
    paymentLink: 'https://paystack.shop/pay/plans1',
  },
  {
    id: 'plan2',
    name: 'Plan 2',
    price: 7000,
    weeklyReturn: 12000,
    dailyEarnings: 1714,
    referralBonus: 1000,
    tasksPerDay: 6,
    earningsPerTask: 286,
    paymentLink: 'https://paystack.shop/pay/plans2',
  },
  {
    id: 'plan3',
    name: 'Plan 3',
    price: 50000,
    weeklyReturn: 100000,
    dailyEarnings: 14286,
    referralBonus: 5000,
    tasksPerDay: 7,
    earningsPerTask: 2040,
    paymentLink: 'https://paystack.shop/pay/plans3',
  },
  {
    id: 'plan4',
    name: 'Plan 4',
    price: 100000,
    weeklyReturn: 400000,
    dailyEarnings: 57143,
    referralBonus: 10000,
    tasksPerDay: 8,
    earningsPerTask: 7143,
    paymentLink: 'https://paystack.shop/pay/plans4',
  },
]

const PlanSelectionPage = () => {
  const handlePurchase = (paymentLink: string) => {
    window.location.href = paymentLink
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-background to-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-center text-4xl font-extrabold">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Choose Plan
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              {/* Plan Name */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">
                  {plan.name}
                </h2>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-5xl font-black text-white">
                  ₦{plan.price.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-gray-400">one-time payment</p>
              </div>

              {/* Key financials */}
              <div className="mb-8 flex-1 space-y-4">
                <div>
                  <p className="mb-1 text-sm uppercase tracking-wider text-gray-400">
                    Weekly Return
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    ₦{plan.weeklyReturn.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm uppercase tracking-wider text-gray-400">
                    Daily Earnings
                  </p>
                  <p className="text-2xl font-semibold text-green-300">
                    ₦{plan.dailyEarnings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm uppercase tracking-wider text-gray-400">
                    Referral Bonus
                  </p>
                  <p className="text-xl font-medium text-yellow-400">
                    ₦{plan.referralBonus.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(plan.paymentLink)}
                className="w-full transform rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlanSelectionPage
