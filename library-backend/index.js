import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from 'graphql' // Added this
import jwt from 'jsonwebtoken' // Added this

// Note: Ensure you have a .env file with SECRET=your_secret_here
import 'dotenv/config' 

let authors = [
  { name: 'Robert Martin', id: "afa51ab0-344d-11e9-a414-719c6709cf3e", born: 1952 },
  { name: 'Martin Fowler', id: "afa51ab1-344d-11e9-a414-719c6709cf3e", born: 1963 }
]

let books = [
  { title: 'Clean Code', published: 2008, author: 'Robert Martin', id: "afa516d0-344d-11e9-a414-719c6709cf3e", genres: ['refactoring'] },
  { title: 'Agile Software Development', published: 2002, author: 'Robert Martin', id: "afa516d1-344d-11e9-a414-719c6709cf3e", genres: ['agile', 'patterns', 'design'] }
]

const typeDefs = `#graphql
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Token {
    value: String!
  }

  # Added User type so 'me' doesn't crash the schema
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User 
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthors: () => {
      return authors.map(author => {
        const booksByAuthor = books.filter(b => b.author === author.name)
        return { ...author, bookCount: booksByAuthor.length }
      })
    },
    allBooks: (root, args) => {
      let filteredBooks = books;
      if (args.author) {
        filteredBooks = filteredBooks.filter(b => b.author === args.author)
      }
      if (args.genre) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre))
      }
      return filteredBooks
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: Math.random().toString(36).substring(2, 9) }
      books = books.concat(book)
      
      if (!authors.find(a => a.name === args.author)) {
        authors = authors.concat({ 
          name: args.author, 
          id: Math.random().toString(36).substring(2, 9) 
        })
      }
      return book
    },

    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) return null

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    },

    // MOVED login INSIDE the Mutation object
    login: async (root, args) => {
      if (args.username !== 'natasha_c' || args.password !== 'Tashkunnie@7777') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: args.username,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  // 👇 WE ARE ADDING THIS ENTIRE CONTEXT FUNCTION 👇
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      
      // Since this file uses hardcoded data, we will hardcode your user here
      // so the 'me' query has exactly what it needs!
      const currentUser = {
        username: decodedToken.username,
        favoriteGenre: 'Religion', // <--- Your genre goes here!
        id: 'user-id-12345'
      }
      
      return { currentUser }
    }
  },
})

console.log(`🚀 Server ready at: ${url}`)