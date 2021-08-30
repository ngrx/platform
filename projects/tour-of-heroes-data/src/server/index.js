const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const port = process.env.PORT || 3001;
const publicweb = process.env.PUBLICWEB || './dist';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(publicweb));
app.use('/some-api', routes);
console.log(`serving ${publicweb}`);

app.get('*', (req, res) => {
  res.sendFile(`index.html`, { root: publicweb });
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
