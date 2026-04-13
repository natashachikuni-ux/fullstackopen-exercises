import { useState, useEffect } from 'react'
import personService from './services/persons' 

// Sub-components stay outside here - this is correct
const Filter = ({ value, onChange }) => (
  <div>filter shown with: <input value={value} onChange={onChange} /></div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addName}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => (
  <div>
    {personsToShow.map(person => 
      <p key={person.id}>
        {person.name} {person.number} 
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const deletePerson = (id, name) => {
  if (window.confirm(`Delete ${name}?`)) {
    personService
      .remove(id)
      .then(() => {
        // After deleting from server, update local state to remove the person
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        alert(`The person '${name}' was already deleted from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }
}

  // --- THIS MUST BE INSIDE THE APP COMPONENT ---
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  // ---------------------------------------------

const addName = (event) => {
  event.preventDefault()
  
  const existingPerson = persons.find(p => p.name === newName)

  if (existingPerson) {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          // Update the state: map through persons, replace the old one with the returned one
          setPersons(persons.map(person => 
            person.id !== existingPerson.id ? person : returnedPerson
          ))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(`Information of ${newName} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }
    return // Exit the function so we don't create a duplicate
  }

  // ... the rest of your original code for creating a NEW person ...
  const nameObject = { name: newName, number: newNumber }
  personService
    .create(nameObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
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
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App