import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// We are splitting the imports to help Vite find them
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'

// ... the rest of your code (httpLink, authLink, client) stays the same!
// 1. Define the link to your backend
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

// 2. Define the "middleman" that adds the token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

// 3. Chain them together: authLink runs FIRST, then httpLink
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)