import { useState } from 'react'
import Select from 'react-select'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

const Authors = (props) => {
  const [selectedOption, setSelectedOption] = useState(null) // 2. State for the dropdown object
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) return null
  if (result.loading) return <div>loading...</div>

  const authors = result.data.allAuthors

  // 3. Transform the authors array into the format react-select wants
  const options = authors.map((a) => ({
    value: a.name,
    label: a.name,
  }))

  const submit = async (event) => {
    event.preventDefault()

    // 4. Access the 'value' property from the selected object
    if (selectedOption) {
      changeBorn({ 
        variables: { name: selectedOption.value, setBornTo: parseInt(born) } 
      })
    }

    setSelectedOption(null)
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div style={{ width: '300px', marginBottom: '10px' }}>
          {/* 5. The Select Component */}
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
            placeholder="Select an author..."
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors