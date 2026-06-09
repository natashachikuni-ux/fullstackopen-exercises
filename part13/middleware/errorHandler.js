const errorHandler = (error, req, res, next) => {
  console.error('--- Global Error Caught ---')
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map(e => e.message) })
  }
  
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'Malformatted database operation request' })
  }

  res.status(500).json({ error: 'An internal server error occurred' })
}

module.exports = errorHandler