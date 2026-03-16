// api/src/functions/verifyPayment/verifyPayment.ts
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const AMOUNT_TO_PLAN = {
  300000: 'plan1',
  700000: 'plan2',
  5000000: 'plan3',
  10000000: 'plan4',
}

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: verifyPayment function`)

  const { reference, uid } = event.queryStringParameters || {}

  if (!reference || !uid) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Missing reference or uid',
      }),
    }
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY
    if (!secretKey) {
      logger.error('PAYSTACK_SECRET_KEY not set')
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error',
        }),
      }
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    )

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Payment not successful',
        }),
      }
    }

    const amount = data.data.amount
    const planId = AMOUNT_TO_PLAN[amount]

    if (!planId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Unknown plan amount' }),
      }
    }

    // Update user in database
    await db.user.update({
      where: { uid },
      data: {
        hasPaid: true,
        planId,
        planPurchaseAt: new Date(),
      },
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, planId }),
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Server error' }),
    }
  }
}
