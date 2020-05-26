interface IFile {
  name: string;
  fullPath: string;
  creationDate: Date;
  size: number;
  type: 'folder' | 'file';
}

export { IFile };
