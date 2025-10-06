import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../dist/cypress/projects/example-app-e2e/videos',
  screenshotsFolder: '../../dist/cypress/projects/example-app-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
    testIsolation: false,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
