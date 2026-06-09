const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { Blog, User } = require('../models')

// 🛰️ Helper middleware to strip the 'Bearer ' string from authorization headers
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      // Extract just the encrypted token payload string
      req.decodedToken = jwt.verify(authorization.substring(7), 'secret_passphrase')
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// helper middleware to fetch blog by ID cleanly
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

// 🌐 GET all blogs
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) { next(error) }
})

// 🌐 GET single blog (Exercise 13.5)
router.get('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

// 🌐 POST a new blog (Now fully secured via JWT verification!)
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    // 1. Find the exact user matching the ID stored securely inside the token
    const user = await User.findByPk(req.decodedToken.id)
    
    // 2. Instantiate and persist the blog using the authenticated user's ID
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) { next(error) }
})

// 🌐 DELETE a blog by ID
router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) { next(error) }
})

// 🌐 PUT/Update likes by ID (Exercise 13.6)
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch (error) { next(error) }
})

module.exports = router