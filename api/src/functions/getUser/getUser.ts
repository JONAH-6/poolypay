import type { APIGatewayEvent, Context } from 'aws-lambda'

import { getOrCreateUser } from 'src/lib/dbUser'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const { uid, email } = event.queryStringParameters || {}
  if (!uid || !email) {
    return { statusCode: 400, body: 'Missing uid or email' }
  }

  const user = await getOrCreateUser({ uid, email })
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }
}
