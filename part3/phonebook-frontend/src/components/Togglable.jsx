import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types' // 1. Import PropTypes

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

// 2. Define the requirements
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

// 3. Set a display name (helpful for debugging)
Togglable.displayName = 'Togglable'

export default Togglable