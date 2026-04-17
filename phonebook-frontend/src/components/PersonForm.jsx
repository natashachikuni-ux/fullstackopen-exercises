import { useState } from 'react'

const PersonForm = ({ createPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleAddPerson = (event) => {
    event.preventDefault()
    createPerson({
      name: newName,
      number: newNumber
    })

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h3>Add new person</h3>
      <form onSubmit={handleAddPerson}>
        <div>
          name: <input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
          />
        </div>
        <div>
          number: <input 
            value={newNumber} 
            onChange={(e) => setNewNumber(e.target.value)} 
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default PersonForm