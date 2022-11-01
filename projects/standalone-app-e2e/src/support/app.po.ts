export const getGreeting = () => cy.get('h1');
export const loadFeature = () => cy.get('a').contains('Load Feature').click();
