import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = jsonServer.create();
const router = jsonServer.router(`${__dirname}/server.json`);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
