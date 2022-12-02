describe('Edit Page', () => {
  let cookies = {}

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
    );

    // Wait for the account to be created
    cy.wait(100);

    cy.request(
      {
        method: 'POST',
        url: 'http://127.0.0.1:8000/account/login',
        body: accountDetails,
        failOnStatusCode: false,
      }
    );

    // Wait for the account to be logged in
    cy.wait(100);

    // Get cookies from login request
    cy.getCookies().then((browserCookies) => {
      cookies = browserCookies;
    });
  });

  beforeEach(() => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value)
    });
  });

  afterEach(() => {
    cy.getCookies().then((browserCookies) => {
      cookies = browserCookies;
    });
  });


  it('Navigates to the edit page', () => {
    cy.visit('http://127.0.0.1:3000');

    cy.wait(1000);

    cy.url().should('include', '/note-rack/');
  });

  it('Edits the page title', () => {
    cy.get('[data-cy=page-title]').click();

    cy.get('[data-cy=page-title]').type(' - Edited');

    cy.get('[data-cy=page-title]').should('have.text', 'New Notebook - Edited');

    cy.get('body').click();

    cy.wait(2500);
  });

  it('Creates a new text block', () => {
    cy.get('[data-cy=page-title]').click();

    cy.get('[data-cy=page-title]').type('{enter}');

    cy.get('[data-cy=block-text]').should('have.length', 1);

    cy.get('[data-cy=page-title]').click();
    
    cy.wait(2500);
  });

  it('Edits the text block', () => {
    cy.get('[data-cy=block-text]').click();

    cy.get('[data-cy=block-text]').type('This is a test');

    cy.get('[data-cy=block-text]').should('have.text', 'This is a test');

    cy.get('[data-cy=page-title]').click();

    cy.wait(2500);
  });
});
