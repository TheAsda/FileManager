type FileType = 'folder' | 'file';

interface FileInfo {
  /** The full path to this directory item. */
  path: string;

  /** The display name of the directory item. */
  name: string;

  /** The size (in bytes) of the file, if any. */
  size?: number;

  /** The last time the directory item was modified. */
  lastModified?: Date;

  /** The date time the directory item was created. */
  created?: Date;

  attributes: {
    hidden: boolean;

    directory: boolean;

    readonly: boolean;

    system: boolean;
  };
}

export { FileInfo, FileType };
