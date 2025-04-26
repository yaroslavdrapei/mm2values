import path from 'path';
import fs from 'fs';

// todo: implement type check for JSON.parse(pathToFile) if it is a CommandJson ty[e

export class Commands {
  public static getCommands(pathToFile = 'commands.json'): Record<string, string> {
    try {
      const fullPath = path.resolve(pathToFile);
      const json = fs.readFileSync(fullPath, 'utf8');

      const commands: Record<string, string> = JSON.parse(json);
      return commands;
    } catch (err) {
      throw new Error(`Error parsing JSON from file ${path.resolve(pathToFile)}: ${err}`);
    }
  }
}
