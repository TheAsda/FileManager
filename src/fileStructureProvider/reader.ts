import { readdirSync } from 'fs';

class Reader {
  constructor(private path: string = 'D:/') {}

  getCurrentDir(path: string = this.path): string[] {
    return readdirSync(path);
  }
}

export { Reader };
