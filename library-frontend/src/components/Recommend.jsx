import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const meResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (!props.show) return null

  if (meResult.loading || booksResult.loading) {
    return <div>loading recommendations...</div>
  }

  // Safety nets!
  if (!meResult.data?.me) {
    return <div>Not logged in or user data missing.</div>
  }
  if (!booksResult.data?.allBooks) {
    return <div>No books available.</div>
  }

  const favoriteGenre = meResult.data.me.favoriteGenre
  const books = booksResult.data.allBooks

  // Filter books to only show the user's favorite genre
  const recommendedBooks = books.filter(b => b.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
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

export default Recommend