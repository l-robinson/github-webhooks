const config = require('config');
const http = require('http');
const { Webhooks, createNodeMiddleware } = require('@octokit/webhooks');
const webhooks = new Webhooks({
  secret: config.get('webhook.secret'),
});
const hostname = config.get('listen.hostname');
const port = config.get('listen.port');

webhooks.on('push', (event) => {
    console.log(`${event}`);
});

http.createServer(createNodeMiddleware(webhooks)).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});