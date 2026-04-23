import { Table, Alert, Navbar, Nav } from 'react-bootstrap'
import { useState } from 'react'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'

// 1. THE CUSTOM HOOK
const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (event) => { setValue(event.target.value) }
  const reset = () => { setValue('') }

  return { type, value, onChange, reset }
}

// 2. SUB-COMPONENTS
const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table striped bordered hover>
      <tbody>
        {anecdotes.map(anecdote => (
          <tr key={anecdote.id}>
            <td>
              <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            </td>
            <td>{anecdote.author}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)

const Anecdote = ({ anecdote }) => (
  <div>
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <div>has {anecdote.votes} votes</div>
    <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...</em>
  </div>
)

const CreateNew = ({ addNew }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  const { reset: _, ...contentInput } = content
  const { reset: __, ...authorInput } = author
  const { reset: ___, ...infoInput } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">content: <input className="form-control" {...contentInput} /></div>
        <div className="mb-2">author: <input className="form-control" {...authorInput} /></div>
        <div className="mb-2">url: <input className="form-control" {...infoInput} /></div>
        <button className="btn btn-primary me-2" type="submit">create</button>
        <button className="btn btn-secondary" type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

// 3. MAIN APP COMPONENT
const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0, id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0, id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const match = useMatch('/anecdotes/:id')
  const anecdote = match 
    ? anecdotes.find(a => a.id === Number(match.params.id))
    : null

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`a new anecdote '${anecdote.content}' created!`)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="mb-3">
        <Navbar.Brand className="ms-3">Anecdote App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">anecdotes</Nav.Link>
            <Nav.Link as={Link} to="/create">create new</Nav.Link>
            <Nav.Link as={Link} to="/about">about</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {notification && <Alert variant="success">{notification}</Alert>}

      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <footer className="mt-5 p-4 bg-light text-center">
        <i>Anecdote app, for <a href='https://fullstackopen.com/'>Full Stack Open</a>.</i>
      </footer>
    </div>
  )
}

export default App