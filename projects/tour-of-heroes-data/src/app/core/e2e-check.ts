/** True if running under e2e testing (e.g., launch URL ends `?e2e`) */
export const isE2E = window.location.search.includes('e2e');
