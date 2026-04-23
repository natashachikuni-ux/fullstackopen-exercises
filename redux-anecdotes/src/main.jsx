import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter as Router } from 'react-router-dom' // 1. Add this import

import App from './App'
import anecdoteReducer from './reducer'
import filterReducer from './filterReducer'
import notificationReducer from './notificationReducer'

const queryClient = new QueryClient()

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      {/* 2. Wrap App inside Router here */}
      <Router>
        <App />
      </Router>
    </Provider>
  </QueryClientProvider>
)