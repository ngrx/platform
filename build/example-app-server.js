const express = require('express');
const path = require('path');

const CONTEXT = `/${process.env.CONTEXT || 'platform/example-app'}`;
const PORT = process.env.PORT || 4000;
const DIST = path.join(__dirname, '../projects/example-app/dist');

const app = express();

app.use(CONTEXT, express.static(DIST));
app.use('/', express.static(DIST));
app.listen(PORT, () =>
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
);
