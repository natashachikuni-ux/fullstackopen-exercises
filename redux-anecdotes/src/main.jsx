import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit' // Use this instead of createStore
import { Provider } from 'react-redux'

import App from './App'
import anecdoteReducer from './reducer'
import filterReducer from './filterReducer'

// configureStore handles the combining and setup in one go
const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)