import { readdirSync, statSync } from 'fs';
import { FileInfo } from './interfaces';

class Reader {
  static getCurrentDir(path: string): FileInfo[] {
    const dirs = readdirSync(path);
    const result: FileInfo[] = [];

    for (const item of dirs) {
      try {
        const stats = statSync(path + item);
        result.push({
          name: item,
          fullPath: path + item,
          size: stats.size,
          creationDate: stats.birthtime,
          type: stats.isDirectory() ? 'folder' : 'file',
          parentName: path,
        });
      } catch (e) {
        console.error(`Error while reading "${item}": ${e}`);
      }
    }

    return result;
  }
}

export { Reader };
