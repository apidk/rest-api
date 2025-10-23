const express = require('express');
const app = express();
const port = 3001;

const apiRoutes = require('./src/routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`REST API server listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception encountered', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection encountered', err);
  process.exit(1);
});
