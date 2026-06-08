const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
      {errorMessage}
    </div>
  )
}

export default Notify