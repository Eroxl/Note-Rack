describe('Login and Signup Page', () => {
  it('Navigates to the login page', () => {
    cy.visit('http://127.0.0.1:3000');
    cy.get('a[href="/login#"]').click();
    
    cy.url().should('include', '/login');
  });

  it('Switches to the signup page', () => {
    cy.visit('http://127.0.0.1:3000/login');
    cy.get('button').contains('Sign Up').click();

    cy.get('button[type="submit"]').contains('Sign up').should('exist');
  });

  it('Registers with valid credentials', () => {
    cy.visit('http://127.0.0.1:3000/login');
    cy.get('button[type="button"]').contains('Sign Up').click();

    cy.get('input[name="username"]').type('test');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('test');

    cy.get('button[type="submit"]').contains('Sign up').click();

    cy.url().should('include', '/login');
  });

  it('Logs in with valid credentials', () => {
    cy.visit('http://127.0.0.1:3000/login');

    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('test');

    cy.get('button[type="submit"]').contains('Log in').click();

    cy.url().should('include', '/note-rack/');
  });
});
