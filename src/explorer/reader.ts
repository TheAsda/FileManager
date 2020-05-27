import { readdirSync, statSync, Stats } from 'fs';
import { IFile } from './interfaces';

class Reader {
  constructor(private path: string = 'D:/') {}

  getCurrentDir(path: string = this.path): IFile[] {
    console.log('Reader -> constructor -> path', path);
    const dirs = readdirSync(path);
    console.log('Reader -> constructor -> dirs', dirs);
    const result: IFile[] = [];

    for (const item of dirs) {
      try {
        const stats = statSync(path + '/' + item);
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
