context('Full round trip', () => {
  before(() => {
    window.localStorage.removeItem('books_app');
    cy.visit('/');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('shows a message when the credentials are wrong', () => {
    cy.findByRole('textbox', { name: /username/i })
      .clear()
      .type('wronguser');
    cy.findByLabelText(/password/i).type('supersafepassword');
    cy.findByRole('button', { name: /login/i }).click();
    cy.contains('Invalid username or password').should('be.visible');
  });

  it('is possible to login', () => {
    cy.findByRole('textbox', { name: /username/i })
      .clear()
      .type('test{enter}');
  });

  it('is possible to search for books', () => {
    cy.contains('My Collection');
    cy.findByRole('button', { name: /menu/i }).click();
    cy.findByText(/browse books/i).click();
    cy.findByRole('textbox', { name: /search for a book/i }).type(
      'The Alchemist'
    );
    cy.get('bc-book-preview').its('length').should('be.gte', 1);
  });

  it('is possible to add books', () => {
    cy.get('bc-book-preview').eq(2).click();

    cy.findByRole('button', { name: /add book to collection/i }).click();
    cy.findByRole('button', { name: /add book to collection/i }).should(
      'not.exist'
    );
  });

  it('is possible to remove books', () => {
    cy.go('back');

    cy.get('bc-book-preview').eq(4).click();

    cy.findByRole('button', { name: /add book to collection/i }).click();
    cy.findByRole('button', { name: /remove book from collection/i }).click();
    cy.findByRole('button', { name: /remove book from collection/i }).should(
      'not.exist'
    );
  });

  it('is possible to show the collection', () => {
    cy.findByRole('button', { name: /menu/i }).click();
    cy.findByText(/my collection/i).click();
    cy.get('bc-book-preview').its('length').should('eq', 1);
  });

  it('is possible to sign out', () => {
    cy.findByRole('button', { name: /menu/i }).click();
    cy.findByText(/sign out/i).click();
    cy.findByRole('button', { name: /ok/i }).click();
    cy.findByRole('textbox', { name: /username/i }).should('exist');
    cy.findByLabelText(/password/i).should('exist');
  });
});
