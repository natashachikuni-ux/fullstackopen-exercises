import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from './services/anecdotes'
import { setNotification } from './notificationReducer'
import Filter from './Filter'
import Notification from './Notification'

const App = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  // 1. Fetching logic
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false
  })

  // 2. Mutation for creating new anecdotes
  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  // 3. Mutation for updating votes
  const updateVoteMutation = useMutation({
    mutationFn: (updatedAnecdote) => 
      anecdoteService.update(updatedAnecdote.id, updatedAnecdote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const filter = useSelector(state => state.filter || '')

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data
    .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)

  // 6. Event Handlers
  const vote = (anecdote) => {
    const changedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updateVoteMutation.mutate(changedAnecdote)
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
    dispatch(setNotification(`new anecdote created: '${content}'`, 5))
  }

  return (
    <div>
      <h2>Anecdote app</h2>
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