const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User } = require('../models')

// 🎯 CRITICAL: This must be '/' because '/api/login' is already handled by index.js!
// If it says router.post('/api/login'), Express tries to look for '/api/login/api/login'
router.post('/', async (req, res, next) => {
  try {
    const { username } = req.body

    const user = await User.findOne({
      where: { username: username }
    })

    if (!user) {
      return res.status(401).json({ error: 'invalid username' })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, 'secret_passphrase')

    res.status(200).send({ token, username: user.username, name: user.name })
  } catch (error) { next(error) }
})

module.exports = router // Make sure this line is exactly here!