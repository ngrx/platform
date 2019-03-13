context('Full round trip', () => {
  before(() => {
    (cy as any).eyesOpen({
      appName: 'books_app',
      testName: 'round-trip',
      browser: { width: 800, height: 600 },
    });
    window.indexedDB.deleteDatabase('books_app');
    cy.visit('/');
  });

  after(() => {
    (cy as any).eyesClose();
  });

  it('shows a message when the credentials are wrong', () => {
    cy.get('[placeholder=Username]').type('wronguser');
    cy.get('[placeholder=Password]').type('supersafepassword');
    cy.get('[type="submit"]').click();

    (cy as any).eyesCheckWindow(
      'shows a message when the credentials are wrong'
    );
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

    (cy as any).eyesCheckWindow('is possible to search for books');
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
    (cy as any).eyesCheckWindow('is possible to add books');
    cy.contains('Add Book to Collection').should('not.exist');
  });

  it('is possible to remove books', () => {
    cy.go('back');

    cy.get('bc-book-preview')
      .eq(4)
      .click();

    cy.contains('Add Book to Collection').click();
    cy.contains('Remove Book from Collection').click();

    (cy as any).eyesCheckWindow('is possible to remove books');
    cy.contains('Remove Book from Collection').should('not.exist');
  });

  it('is possible to show the collection', () => {
    cy.contains('menu').click();
    cy.contains('My Collection').click();

    (cy as any).eyesCheckWindow('is possible to show the collection');
    cy.get('bc-book-preview')
      .its('length')
      .should('be', 1);
  });

  it('is possible to sign out', () => {
    cy.contains('menu').click();
    cy.contains('Sign Out').click();
    cy.contains('OK').click();

    (cy as any).eyesCheckWindow('is possible to sign out');
    cy.get('[placeholder=Username]').should('exist');
    cy.get('[placeholder=Password]').should('exist');
  });
});
