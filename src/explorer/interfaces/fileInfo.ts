import { FileFilter } from 'electron';

interface FileInfo {
  name: string;
  fullPath: string;
  creationDate: Date;
  size: number;
  type: 'folder' | 'file';
  parentName?: string;
}

export { FileInfo };
