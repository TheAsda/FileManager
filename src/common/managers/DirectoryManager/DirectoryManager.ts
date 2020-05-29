import { injectable, inject } from 'inversify';
import { IDirectoryManager } from './IDirectoryManager';
import {
  FSWatcher,
  mkdirSync,
  writeFileSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  copyFileSync,
  readFileSync,
  watch,
  readdirSync,
  Stats,
  lstatSync,
} from 'fs';
import { FileType, FileInfo } from '@fm/common';
import { join, basename } from 'path';
import { ILogManager } from '../LogManager/ILogManager';
import { TYPES } from 'common/ioc';
import trash from 'trash';

@injectable()
class DirectoryManager implements IDirectoryManager {
  /** Watches for changes in directory */
  private watcher?: FSWatcher;

  private logger: ILogManager;

  constructor(@inject(TYPES.ILogManger) logger: ILogManager) {
    this.logger = logger;
  }

  /** @inheritdoc */
  async listDirectory(path: string): Promise<FileInfo[]> {
    let fileList;

    try {
      fileList = readdirSync(path);
    } catch {
      this.logger.error(`Cannot read folder ${path}`);
      return Promise.reject();
    }

    return await Promise.all(
      fileList.map(
        async (fileName): Promise<FileInfo> => {
          const fullPath = join(path, fileName);
          let fileStats: Stats;

          try {
            fileStats = lstatSync(fullPath);
          } catch {
            return {
              accessible: false,
              type: 'folder',
              name: fileName,
              path: fullPath,
            };
          }

          return {
            accessible: true,
            created: fileStats.ctime,
            type: fileStats.isDirectory() ? 'folder' : 'file',
            lastModified: fileStats.mtime,
            name: fileName,
            path: fullPath,
            size: !fileStats.isDirectory() ? fileStats.size : undefined,
          };
        }
      )
    );
  }

  /** @inheritdoc */
  async createItem(
    itemName: string,
    itemPath: string,
    itemType: FileType
  ): Promise<void> {
    const fullPath = join(itemPath, itemName);

    if (itemType === 'folder') {
      try {
        mkdirSync(fullPath);
      } catch {
        this.logger.error(`Cannot create folder ${fullPath}`);
      }
    } else {
      try {
        writeFileSync(fullPath, '');
      } catch {
        this.logger.error(`Cannot create file ${fullPath}`);
      }
    }
  }

  /** @inheritdoc */
  async renameItem(
    oldName: string,
    newName: string,
    itemPath: string
  ): Promise<void> {
    if (oldName === newName) {
      return;
    }

    const oldNameFull = join(itemPath, oldName);
    const newNameFull = join(itemPath, newName);

    try {
      renameSync(oldNameFull, newNameFull);
    } catch {
      this.logger.error(`Cannot rename ${oldNameFull} to ${newNameFull}`);
    }
  }

  /** @inheritdoc */
  async deleteItems(itemsToDelete: FileInfo[]): Promise<void> {
    const itemDeletions = itemsToDelete.map(
      async (item) => await this.deleteItem(item.path, item.type)
    );

    await Promise.all(itemDeletions);
  }

  /** @inheritdoc */
  async sendItemsToTrash(itemsToTrash: FileInfo[]): Promise<void> {
    const itemsSending = itemsToTrash.map(
      async (item) => await this.sendItemToTrash(item.path)
    );

    await Promise.all(itemsSending);
  }

  /** @inheritdoc */
  async copyItems(
    itemsToCopy: FileInfo[],
    destinationFolder: string
  ): Promise<void> {
    const itemsCopying = itemsToCopy.map(async (item) =>
      this.copyItem(item.path, destinationFolder)
    );

    await Promise.all(itemsCopying);
  }

  /** @inheritdoc */
  async moveItems(
    itemsToMove: FileInfo[],
    destinationFolder: string
  ): Promise<void> {
    const itemsMoving = itemsToMove.map(async (item) =>
      this.moveItem(item.path, destinationFolder, item.type)
    );

    await Promise.all(itemsMoving);
  }

  /** @inheritdoc */
  readFileSync(filePath: string): string {
    return readFileSync(filePath, { encoding: 'utf-8' });
  }

  /** @inheritdoc */
  startWatching(pathToWatch: string, listener: () => void): void {
    this.watcher = watch(pathToWatch, listener);
  }

  /** @inheritdoc */
  stopWatching(): void {
    this.watcher && this.watcher.close();
  }

  private async deleteItem(
    itemPath: string,
    itemType: FileType
  ): Promise<void> {
    if (itemType === 'folder') {
      try {
        rmdirSync(itemPath);
        return Promise.resolve();
      } catch {
        this.logger.error(`Cannot delete folder ${itemPath}`);
        return Promise.reject();
      }
    } else {
      try {
        unlinkSync(itemPath);
        return Promise.resolve();
      } catch {
        this.logger.error(`Cannot delete file ${itemPath}`);
        return Promise.reject();
      }
    }
  }

  private async sendItemToTrash(itemPath: string): Promise<void> {
    try {
      await trash(itemPath);
      return Promise.resolve();
    } catch {
      this.logger.error(`Cannot send to trash ${itemPath}`);
      return Promise.reject();
    }
  }

  private async copyItem(
    itemPath: string,
    destinationFolder: string
  ): Promise<void> {
    const fileName = basename(itemPath);
    const destinationFilePath = join(destinationFolder, fileName);

    try {
      copyFileSync(itemPath, destinationFilePath);
      return Promise.resolve();
    } catch {
      this.logger.error(`Cannot copy ${itemPath} to ${destinationFolder}`);
      return Promise.reject();
    }
  }

  private async moveItem(
    itemPath: string,
    destinationFolder: string,
    itemType: FileType
  ): Promise<void> {
    await this.copyItem(itemPath, destinationFolder).then(
      async () => await this.deleteItem(itemPath, itemType)
    );
  }
}

export { DirectoryManager };
