import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeAnecdotes, createNewAnecdote, voteAnecdote } from './reducer'
import Filter from './Filter'
import Notification from './Notification'
// 👇 CHANGE: Import setNotification instead of show/clear
import { setNotification } from './notificationReducer' 

const App = () => {
  const dispatch = useDispatch()

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

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    // Clean and simple!
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createNewAnecdote(content))
    
    // 👇 Use the same clean thunk here too!
    dispatch(setNotification(`new anecdote created: '${content}'`, 5))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification /> 
      <Filter />
      
      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}

      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App