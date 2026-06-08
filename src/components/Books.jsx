import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

// 1. Define the GraphQL query
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const Books = (props) => {
  // 2. Use the hook to fetch data
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  // 3. Handle the loading state
  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {/* 4. Map over the data from the server */}
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books