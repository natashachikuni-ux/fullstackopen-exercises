import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, vi, expect } from 'vitest'
import PersonForm from './PersonForm'

test('<PersonForm /> calls onSubmit with right details when a new person is added', async () => {
  const createPerson = vi.fn() // The "Spy" function
  const user = userEvent.setup()

  render(<PersonForm createPerson={createPerson} />)

  // We find inputs by their labels (or placeholder text)
  // Since your PersonForm uses "name:" and "number:" text:
  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('add')

  // inputs[0] is name, inputs[1] is number based on your JSX order
  await user.type(inputs[0], 'Natasha Chikuni')
  await user.type(inputs[1], '0777-123456')
  await user.click(sendButton)

  // 1. Check if the function was called exactly once
  expect(createPerson.mock.calls).toHaveLength(1)
  
  // 2. Check if the content of the call is correct
  expect(createPerson.mock.calls[0][0].name).toBe('Natasha Chikuni')
  expect(createPerson.mock.calls[0][0].number).toBe('0777-123456')
})