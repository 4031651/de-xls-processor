'use strict';

const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const sse = require('koa-sse-stream');

const api = require('./api');
const config = require('./config');

const app = new Koa();

process.stdin.resume();
function exitHandler() {
  process.exit();
}

process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);

app
  .use(
    cors({
      origin: () => '*',
      exposeHeaders: ['Authentication'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }),
  )
  .use(bodyParser())
  .use(
    sse({
      maxClients: 5000,
      pingInterval: 30000,
      matchQuery: 'sse',
    }),
  )
  .use(api.routes())
  .use(api.allowedMethods());

(async () => {
  try {
    await app.listen(config.port);
    console.log(`  >> started on ${config.port}`);
  } catch (err) {
    console.error(String(err));
  }
})();
