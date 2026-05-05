import { useState } from 'react' // 1. Import useState
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('all genres') // 2. State to track the selected button

  if (!props.show) return null
  if (result.loading) return <div>loading books...</div>
  if (!result.data || !result.data.allBooks) return <div>No books found. Check your backend.</div>

  const books = result.data.allBooks

  // 3. Extract all unique genres from the books array
  // flatMap flattens the arrays, Set removes duplicates!
  const uniqueGenres = Array.from(new Set(books.flatMap(b => b.genres)))

  // 4. Determine which books to show based on the filter state
  const booksToShow = filter === 'all genres'
    ? books 
    : books.filter(b => b.genres.includes(filter))

  return (
    <div>
      <h2>books</h2>
      
      {/* Optional: Show the user what they are filtering by */}
      <p>in genre <strong>{filter}</strong></p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {/* 5. Map over booksToShow instead of books */}
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 6. Render the genre buttons dynamically */}
      <div style={{ marginTop: '20px' }}>
        {uniqueGenres.map(genre => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setFilter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books