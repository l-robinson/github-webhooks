import config from 'config';
import * as http from 'http';
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';
import { PushHandler } from './pushHandler';

const webhooks = new Webhooks({
  secret: config.get('webhook.secret'),
});
const hostname = config.get('listen.hostname');
const port = config.get('listen.port');
const pushHandler = new PushHandler();

webhooks.on('push', pushHandler.onEvent);

http.createServer(createNodeMiddleware(webhooks)).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});