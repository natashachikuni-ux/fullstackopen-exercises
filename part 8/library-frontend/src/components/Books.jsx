import { useState } from 'react' // 1. Import useState
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('all genres')

  // 1. Always fetch all books to keep the genre buttons list complete
  const allBooksResult = useQuery(ALL_BOOKS)

  // 2. Fetch books based on the current filter state
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: filter === 'all genres' ? null : filter },
    fetchPolicy: 'cache-and-network' // Ensures the table updates when you click buttons
  })

  if (!props.show) return null
  if (allBooksResult.loading || filteredBooksResult.loading) return <div>loading...</div>

  const books = allBooksResult.data.allBooks
  const displayBooks = filteredBooksResult.data.allBooks

  // Extract unique genres for buttons
  const genres = [...new Set(books.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>
      <p>in genre <strong>{filter}</strong></p>

      <table>
        <tbody>
          <tr><th></th><th>author</th><th>published</th></tr>
          {displayBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.map(g => (
        <button key={g} onClick={() => setFilter(g)}>{g}</button>
      ))}
      <button onClick={() => setFilter('all genres')}>all genres</button>
    </div>
  )
}

export default Books