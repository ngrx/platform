import { getGreeting, loadFeature } from '../support/app.po';

describe('standalone-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome ngrx-standalone-app');
    loadFeature();
    cy.contains('Feature State: { "loaded": true }');
  });
});
