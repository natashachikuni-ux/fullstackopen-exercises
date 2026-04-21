import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// 1. Make sure to import initializeAnecdotes and createNewAnecdote (the thunks)
import { initializeAnecdotes, createNewAnecdote, voteAnecdote } from './reducer'
import Filter from './Filter'

const App = () => {
  const dispatch = useDispatch()

  // Load data from server using the Thunk
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const anecdotes = useSelector(state => {
    const list = state.anecdotes || [] 
    const filter = state.filter || ''

    return [...list]
      .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  })

 const vote = (id) => {
  dispatch(voteAnecdote(id))
}

  // 2. ADD THIS FUNCTION: The handler for creating a new anecdote
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    // We dispatch the Thunk!
    dispatch(createNewAnecdote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}

      {/* 3. ADD THIS FORM: To allow the user to type new anecdotes */}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App