import { readdirSync, statSync } from 'fs';
import { IFile } from '@fm';

class Reader {
  constructor(private path: string = 'D:/') {}

  getCurrentDir(path: string = this.path): IFile[] {
    const dirs = readdirSync(path);
    const result: IFile[] = [];

    for (const item of dirs) {
      const stats = statSync(path + item);
      result.push({
        name: item,
        fullPath: path + item,
        size: stats.size,
        creationDate: stats.birthtime,
        type: stats.isDirectory() ? 'folder' : 'file',
      });
    }

    return result;
  }
}

export { Reader };
