import jwt from 'jsonwebtoken'

const signToken = (user) => {
  // jwt.sign(payload,token,option)
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },

    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    },
  )
}

export { signToken }
