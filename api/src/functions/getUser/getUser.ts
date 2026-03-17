import type { APIGatewayEvent, Context } from 'aws-lambda'

import { db } from 'src/lib/db'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const { uid, email } = event.queryStringParameters || {}
  if (!uid || !email) {
    return { statusCode: 400, body: 'Missing uid or email' }
  }

  // Get or create user
  let user = await db.user.findUnique({ where: { uid } })
  if (!user) {
    user = await db.user.create({
      data: { uid, email, hasPaid: false },
    })
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      hasPaid: user.hasPaid,
    }),
  }
}
