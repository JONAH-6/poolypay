import { db } from 'src/lib/db'

export const getOrCreateUser = async (firebaseUser: {
  uid: string
  email: string
}) => {
  const { uid, email } = firebaseUser
  let user = await db.user.findUnique({ where: { uid } })
  if (!user) {
    user = await db.user.create({
      data: {
        uid,
        email,
        hasPaid: false,
      },
    })
  }
  return user
}
