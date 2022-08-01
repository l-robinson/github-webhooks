import { ProjectHandler } from './projectHandler';
import { execSync } from 'child_process';

export class TypescriptHandler implements ProjectHandler {
  private command = 'npm run ci';
  constructor(private path: string) {}

  buildAndDeploy(): void {
    console.log(`Running command: ${this.command}`);
    const result = execSync(this.command, { cwd: this.path });
    console.log(`Typescript run result: ${result}`);
  }
}
