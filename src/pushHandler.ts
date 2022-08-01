import { EmitterWebhookEvent } from '@octokit/webhooks';
import { PushEvent } from '@octokit/webhooks-types';
import config from 'config';
import * as fs from 'fs';
import * as os from 'os';
import { simpleGit } from 'simple-git';
import { TypescriptHandler } from './typescriptHandler';

export class PushHandler {
  onEvent(event: EmitterWebhookEvent): void {
    const pushEvent = event.payload as PushEvent;
    const project = pushEvent.repository.name;
    const url = pushEvent.repository.clone_url;
    let path = config.get('app.root') + '/' + project;
    path = path.replace('~', os.homedir());

    let updatePromise: Promise<void>;

    if (!fs.existsSync(path)) {
      // Clone the repo for the first time
      console.log(`Cloning ${url} to: ${path}`);
      updatePromise = simpleGit()
        .clone(url, path)
        .then((s) => console.log(`Clone Done ${s}`))
        .catch((e) => console.log(`Clone Error ${e}`));
    } else {
      // Pull the latest code
      console.log(`Pulling latest code from ${url} to: ${path}`);
      updatePromise = simpleGit(path)
        .pull()
        .then((r) => console.log(`Pull Done ${JSON.stringify(r)}`))
        .catch((e) => console.log(`Pull Error ${e}`));
    }

    updatePromise.then(() => {
      const language = pushEvent.repository.language;
      switch (language?.toLowerCase()) {
        case 'typescript':
          new TypescriptHandler(path).buildAndDeploy();
          break;
        case 'java':
        default:
          console.log(`Unhandled language: ${language}`);
      }
    });
  }
}
