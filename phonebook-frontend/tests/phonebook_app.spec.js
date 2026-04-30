import { test, expect } from '@playwright/test'

test.describe('Phonebook', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('http://localhost:3001/api/testing/reset')
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    }
    await page.request.post('http://localhost:3001/api/users', { data: newUser })
    await page.context().addInitScript(() => { window.localStorage.clear(); })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /log/i })).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.locator('input[name="username"]').fill('testuser')
    await page.locator('input[name="password"]').fill('password123')
    await page.locator('input[name="password"]').press('Enter')
    await expect(page.getByRole('heading', { name: 'Phonebook' })).toBeVisible()
  })

  // NEW: Test for failed login (Exercise 5.19 requirement)
  test('login fails with wrong password', async ({ page }) => {
    await page.locator('input[name="username"]').fill('testuser')
    await page.locator('input[name="password"]').fill('wrong')
    await page.locator('input[name="password"]').press('Enter')

    const errorDiv = page.getByText(/wrong credentials/i)
    await expect(errorDiv).toBeVisible()
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)') // Checks for red color
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('input[name="username"]').fill('testuser')
      await page.locator('input[name="password"]').fill('password123')
      await page.locator('input[name="password"]').press('Enter')
    })

    test('a new person can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new person' }).click()
      await page.locator('input[name="name"]').fill('Arto Hellas')
      await page.locator('input[name="number"]').fill('040-123456')
      await page.locator('input[name="number"]').press('Enter')

      await expect(page.locator('li', { hasText: 'Arto Hellas 040-123456' })).toBeVisible()
    })

    // NEW: Test for deletion (Final touch for 5.22)
    test('a person can be deleted', async ({ page }) => {
      // First, create a person to delete
      await page.getByRole('button', { name: 'new person' }).click()
      await page.locator('input[name="name"]').fill('Delete Me')
      await page.locator('input[name="number"]').fill('000')
      await page.locator('input[name="number"]').press('Enter')

      // Set up the listener for the window.confirm dialog
      page.on('dialog', dialog => dialog.accept())

      // Find the specific row for "Delete Me" and click its delete button
      const personRow = page.locator('li', { hasText: 'Delete Me' })
      await personRow.getByRole('button', { name: 'delete' }).click()

      // Verify they are gone
      await expect(page.getByText('Delete Me')).not.toBeVisible()
    })
  })
})