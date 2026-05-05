import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

// Fetches all anecdotes from the json-server
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Sends a new anecdote to the json-server
const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}
const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

export default { getAll, createNew, update } // Make sure to export it!