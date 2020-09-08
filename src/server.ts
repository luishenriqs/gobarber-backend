import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import './database';

const app = express();
app.use(express.json());
app.use(routes);

app.get('/', (request, response) => {
  response.json({ message: 'HELLO GO STACK' });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333');
});
