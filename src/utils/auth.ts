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

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    // Bearer xxx
    const token = authorization.slice(7, authorization.length)
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' })
      } else {
        req.user = decode //ユーザーの持っている情報
        next()
      }
    })
  } else {
    res.status(401).send({ message: 'Token is not suppiled' })
  }
}

export { signToken, isAuth }
