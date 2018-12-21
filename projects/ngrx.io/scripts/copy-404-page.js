#!/usr/bin/env node

// Imports
const { cp } = require('shelljs');

// Constants
const CI_PREVIEW = process.env.CI_PREVIEW;
const PR_NUMBER = process.env.CIRCLE_PR_NUMBER || process.env.CIRCLE_PULL_REQUEST_NUMBER;
const SHORT_SHA = process.env.SHORT_GIT_HASH;

// Paths
const SRC = `dist/ngrx.io/${CI_PREVIEW ? `pr${PR_NUMBER}-${SHORT_SHA}/` : ''}index.html`;
const DIST = `dist/ngrx.io/${CI_PREVIEW ? `pr${PR_NUMBER}-${SHORT_SHA}/` : ''}404.html`;

// copy
cp(SRC, DIST);