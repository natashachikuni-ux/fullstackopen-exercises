import { useState, useEffect } from 'react'
import axios from 'axios'

// --- Sub-components (Exercise 2.10) ---
const Filter = ({ value, onChange }) => (
  <div>
    filter shown with: <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addName}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({ personsToShow }) => (
  <div>
    {personsToShow.map(person => 
      <p key={person.name}>{person.name} {person.number}</p>
    )}
  </div>
)

// --- Main App Component ---
const App = () => {
  const [persons, setPersons] = useState([]) // Start with an empty array
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Exercise 2.11: Fetching data from the server
  useEffect(() => {
    console.log('Effect running: Fetching data...')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('Promise fulfilled: Data received!')
        setPersons(response.data)
      })
  }, []) // Empty array [] ensures this runs only ONCE

 const addName = (event) => {
  event.preventDefault()
  
  if (persons.some(p => p.name === newName)) {
    alert(`${newName} is already added to phonebook`)
    return
  }

  const nameObject = { 
    name: newName, 
    number: newNumber 
    // Notice we don't add an ID here! 
    // json-server will create a unique ID for us automatically.
  }

  // Send the new object to the server
  axios
    .post('http://localhost:3001/persons', nameObject)
    .then(response => {
      // response.data contains the new person including the ID from the server
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
}

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm 
        addName={addName}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App