import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

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

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
   allAuthors: () => {
      console.log('Calculating book counts in memory')
      return authors.map(author => {
        // We filter the local 'books' array instead of doing a DB query
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

      // Broadcast the new book to any connected clients
      pubSub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },

    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) return null

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    },

    login: async (root, args) => {
      if (args.username !== 'natasha_c' || args.password !== 'Tashkunnie@7777') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const userForToken = { username: args.username }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },

  // Notice how Subscription is on the same level as Query and Mutation now!
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

// ==========================================
// THE NEW SERVER SETUP (EXPRESS + WEBSOCKETS)
// ==========================================

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = http.createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
})
const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
})

await server.start()

app.use(
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
        const currentUser = {
          username: decodedToken.username,
          favoriteGenre: 'Religion', 
          id: 'user-id-12345'
        }
        return { currentUser }
      }
    },
  })
)

const PORT = 4000
httpServer.listen(PORT, () =>
  console.log(`🚀 Server is now running on http://localhost:${PORT}`)
)