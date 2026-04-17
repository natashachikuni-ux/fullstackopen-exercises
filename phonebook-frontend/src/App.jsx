import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import personService from './services/persons'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import PersonForm from './components/PersonForm'

const App = () => {
  const personFormRef = useRef()
  const [persons, setPersons] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const initialized = useRef(false)

  // Fetch persons when app starts
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  // Restore user from localStorage
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const loggedUserJSON = window.localStorage.getItem('loggedPhonebookUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        // eslint-disable-next-line
        setUser(user)
        personService.setToken(user.token)
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(user))
      personService.setToken(user.token) 
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(null)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedPhonebookUser')
    personService.setToken(null)
  }

  const createPerson = (personObject) => {
    personService
      .create(personObject)
      .then(returnedPerson => {
        personFormRef.current.toggleVisibility() 
        setPersons(persons.concat(returnedPerson))
        setErrorMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage(`Error: ${error.response.data.error}`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <Notification message={errorMessage} type='error' />
        <form onSubmit={handleLogin}>
          <div>
            username <input value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type='success' />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="new person" ref={personFormRef}>
        <PersonForm createPerson={createPerson} />
      </Togglable>

      <h3>Numbers</h3>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App