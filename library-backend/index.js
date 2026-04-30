import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
    }, // This comma was the missing piece!

    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀 Server ready at: ${url}`)