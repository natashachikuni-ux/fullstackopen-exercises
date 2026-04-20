import { useState } from 'react'

const PersonForm = ({ createPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    createPerson({
      name: newName,
      number: newNumber
    })
    setNewName('')
    setNewNumber('')
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          name="name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number: <input
          name="number"
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

export default PersonForm