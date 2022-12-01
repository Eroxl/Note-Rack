describe('Edit Page', () => {
  before(() => {
    // Log in before each test
    const accountDetails = {
      email: 'edit-test@test.com',
      username: 'editTest',
      password: '123456',
    }

    cy.request(
      {
        method: 'POST',
        url: 'http://127.0.0.1:8000/account/register',
        body: accountDetails,
        failOnStatusCode: false,
      }
    )

    // Wait for the account to be created
    cy.wait(100)

    cy.request(
      {
        method: 'POST',
        url: 'http://127.0.0.1:8000/account/login',
        body: accountDetails,
        failOnStatusCode: false,
      }
    )

    // Wait for the account to be logged in
    cy.wait(100)

    // Get cookies from login request
    cy.getCookies().then((cookies) => {
      cookies.forEach((cookie) => {
        // Set cookies in browser
        cy.setCookie(cookie.name, cookie.value)
      })
    })
  })

  it('Navigates to the edit page', () => {
    cy.visit('http://127.0.0.1:3000')

    cy.wait(1000)

    cy.url().should('include', '/note-rack/')
  })
})
