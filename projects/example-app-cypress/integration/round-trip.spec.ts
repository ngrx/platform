context('Full round trip', () => {
  before(() => {
    window.indexedDB.deleteDatabase('books_app');
    cy.visit('/');
  });

  it('shows a message when the credentials are wrong', () => {
    cy.get('[placeholder=Username]').type('wronguser');
    cy.get('[placeholder=Password]').type('supersafepassword');
    cy.get('[type="submit"]').click();

    cy.contains('Invalid username or password').should('be.visible');
  });

  it('is possible to login', () => {
    cy.get('[placeholder=Username]')
      .clear()
      .type('test');
    cy.get('[type="submit"]').click();
  });

  it('is possible to search for books', () => {
    cy.contains('My Collection');
    cy.contains('menu').click();
    cy.contains('Browse Books').click();

    cy.get('[placeholder="Search for a book"]').type('The Alchemist');
    cy.get('bc-book-preview')
      .its('length')
      .should('be.gte', 1);
  });

  it('is possible to add books', () => {
    cy.get('bc-book-preview')
      .eq(2)
      .click();

    cy.contains('Add Book to Collection').click();
    cy.contains('Add Book to Collection').should('not.exist');
  });

  it('is possible to remove books', () => {
    cy.go('back');

    cy.get('bc-book-preview')
      .eq(4)
      .click();

    cy.contains('Add Book to Collection').click();
    cy.contains('Remove Book from Collection').click();
    cy.contains('Remove Book from Collection').should('not.exist');
  });

  it('is possible to show the collection', () => {
    cy.contains('menu').click();
    cy.contains('My Collection').click();

    cy.get('bc-book-preview')
      .its('length')
      .should('be', 1);
  });

  it('is possible to sign out', () => {
    cy.contains('menu').click();
    cy.contains('Sign Out').click();
    cy.contains('OK').click();

    cy.get('[placeholder=Username]').should('exist');
    cy.get('[placeholder=Password]').should('exist');
  });
});
