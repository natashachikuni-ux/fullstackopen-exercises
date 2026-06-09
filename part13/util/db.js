const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to the PostgreSQL database via Sequelize pool. 🐘')
  } catch (err) {
    console.log('Failed to connect to the database!', err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }