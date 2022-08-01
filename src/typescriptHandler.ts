import { ProjectHandler } from './projectHandler';
import { execSync } from 'child_process';

export class TypescriptHandler implements ProjectHandler {
  constructor(private path: string) {}

  buildAndDeploy(): void {
    const result = execSync('npm run ci', { cwd: this.path });
    console.log(`Typescript run result: ${result}`);
  }
}
