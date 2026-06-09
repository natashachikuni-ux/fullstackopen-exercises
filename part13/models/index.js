const Blog = require('./blog')
const User = require('./user')

// 🔗 The Relational Database Connection Link (One-to-Many)
User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog,
  User
}