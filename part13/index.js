const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')

// 1. Double-check these paths and variable names
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') 

// CRITICAL: This parser middleware MUST be above your routes!
app.use(express.json())

// 2. Make sure this is spelled exactly like this (all lowercase)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter) 

// The errorHandler MUST be registered LAST
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  await sequelize.sync()
  app.listen(PORT, () => {
    console.log(`Token Enabled Server running on port ${PORT}! 🚀`)
  })
}

start()