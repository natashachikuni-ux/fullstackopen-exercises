import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">
          togglable content
        </div>
      </Togglable>
    )
  })

  afterEach(() => {
    cleanup()
  })

  test('renders its children', async () => {
    const element = await screen.findByText('togglable content')
    expect(element).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = screen.getByText('togglable content').parentElement
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = screen.getByText('togglable content').parentElement
    expect(div).not.toHaveStyle('display: none')
  })
})