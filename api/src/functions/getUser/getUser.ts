// api/src/functions/getUser/getUser.ts
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { db } from 'src/lib/db'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const { uid, email } = event.queryStringParameters || {}

  if (!uid || !email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing uid or email' }),
    }
  }

  let user = await db.user.findUnique({ where: { uid } })
  if (!user) {
    user = await db.user.create({
      data: { uid, email, hasPaid: false },
    })
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // ← add this for Netlify CORS
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      hasPaid: user.hasPaid,
    }),
  }
}
