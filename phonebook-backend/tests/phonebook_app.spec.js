const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Phonebook', () => {
  beforeEach(async ({ page }) => {
    // 1. Reset database
    await page.request.post('http://localhost:3001/api/testing/reset')

    // 2. Create test user
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    }
    await page.request.post('http://localhost:3001/api/users', { data: newUser })

    // 3. Go to app
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      // Check for the error notification (Exercise 5.19)
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)') // Red color
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new person can be created', async ({ page }) => {
      // Click the "new person" button if it's inside a Togglable
      await page.getByRole('button', { name: 'new person' }).click()

      // Fill form using the placeholders we added to PersonForm.jsx
      await page.getByPlaceholder('write name here').fill('Arto Hellas')
      await page.getByPlaceholder('write number here').fill('040-123456')
      await page.getByRole('button', { name: 'add' }).click()

      // Verify success
      await expect(page.getByText('Arto Hellas')).toBeVisible()
    })
  })
})