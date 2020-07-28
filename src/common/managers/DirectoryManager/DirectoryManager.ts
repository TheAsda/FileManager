import { FileInfo, FileType } from '@fm/common';
import { TYPES } from '../../ioc';
import { IDirectoryManager } from './IDirectoryManager';
import { ILogManager } from '../LogManager/ILogManager';
import {
  copyFileSync,
  FSWatcher,
  mkdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  watch,
  writeFileSync,
  writeFile,
} from 'fs';
import { inject, injectable } from 'inversify';
import { basename, join } from 'path';
import { map, noop } from 'lodash';
import trash from 'trash';
import { listDir, moveFile } from 'filemancore';

@injectable()
class DirectoryManager implements IDirectoryManager {
  /** Watches for changes in directory */
  private watcher?: FSWatcher;

  private _logger: ILogManager;

  constructor(@inject(TYPES.ILogManager) logger: ILogManager) {
    this._logger = logger;
  }

  /** @inheritdoc */
  async listDirectory(path: string): Promise<FileInfo[]> {
    return listDir(path);
  }

  /** @inheritdoc */
  async createItem(itemName: string, itemPath: string, itemType: FileType): Promise<void> {
    const fullPath = join(itemPath, itemName);
    this._logger.log(`Creatin item ${itemPath}`);

    if (itemType === 'folder') {
      try {
        mkdirSync(fullPath);
      } catch {
        this._logger.error(`Cannot create folder ${fullPath}`);
      }
    } else {
      try {
        writeFileSync(fullPath, '');
      } catch {
        this._logger.error(`Cannot create file ${fullPath}`);
      }
    }
  }

  /** @inheritdoc */
  async renameItem(oldName: string, newName: string, itemPath: string): Promise<void> {
    this._logger.log(`Renaming file ${oldName} to ${newName}`);
    if (oldName === newName) {
      return;
    }

    const oldNameFull = join(itemPath, oldName);
    const newNameFull = join(itemPath, newName);

    try {
      await renameSync(oldNameFull, newNameFull);
      this._logger.log('Renamed successfully');
    } catch {
      this._logger.error(`Cannot rename ${oldNameFull} to ${newNameFull}`);
    }
  }

  /** @inheritdoc */
  async deleteItems(itemsToDelete: FileInfo[]): Promise<void> {
    this._logger.log(`Deleting ${itemsToDelete.length} items`);
    const itemDeletions = map(
      itemsToDelete,
      async (item) =>
        await this.deleteItem(item.path, item.attributes.directory ? 'folder' : 'file')
    );

    await Promise.all(itemDeletions);
    this._logger.log(`Deletion successfull`);
  }

  /** @inheritdoc */
  async sendItemsToTrash(itemsToTrash: FileInfo[]): Promise<void> {
    this._logger.log(`Moving ${itemsToTrash.length} items to trash`);
    const itemsSending = map(itemsToTrash, async (item) => await this.sendItemToTrash(item.path));

    await Promise.all(itemsSending);
    this._logger.log(`Successfully moved items`);
  }

  /** @inheritdoc */
  async copyItems(itemsToCopy: FileInfo[], destinationFolder: string): Promise<void> {
    this._logger.log(`Copying ${itemsToCopy.length} items to ${destinationFolder}`);
    const itemsCopying = map(itemsToCopy, async (item) =>
      this.copyItem(item.path + item.name, destinationFolder)
    );

    await Promise.all(itemsCopying);
    this._logger.log('Copied successfully');
  }

  /** @inheritdoc */
  async moveItems(itemsToMove: FileInfo[], destinationFolder: string): Promise<void> {
    this._logger.log(`Moving ${itemsToMove.length} items to ${destinationFolder}`);
    const itemsMoving = map(itemsToMove, async (item) =>
      this.moveItem(item.path, item.name, destinationFolder)
    );

    await Promise.all(itemsMoving);
    this._logger.log('Moved successfully');
  }

  /** @inheritdoc */
  readFileSync(filePath: string): string {
    this._logger.log(`Reading file ${filePath}`);
    return readFileSync(filePath, { encoding: 'utf-8' });
  }

  /** @inheritdoc */
  async writeFile(filePath: string, content: string): Promise<void> {
    this._logger.log(`Writing file ${filePath}`);

    writeFile(
      filePath,
      content,
      {
        encoding: 'utf8',
      },
      noop
    );
  }

  /** @inheritdoc */
  startWatching(pathToWatch: string, listener: () => void): void {
    this.watcher = watch(pathToWatch, listener);
  }

  /** @inheritdoc */
  stopWatching(): void {
    this.watcher && this.watcher.close();
  }

  private async deleteItem(itemPath: string, itemType: FileType): Promise<void> {
    if (itemType === 'folder') {
      try {
        rmdirSync(itemPath);
        return Promise.resolve();
      } catch {
        this._logger.error(`Cannot delete folder ${itemPath}`);
        return Promise.reject();
      }
    } else {
      try {
        unlinkSync(itemPath);
        return Promise.resolve();
      } catch {
        this._logger.error(`Cannot delete file ${itemPath}`);
        return Promise.reject();
      }
    }
  }

  private async sendItemToTrash(itemPath: string): Promise<void> {
    try {
      await trash(itemPath);
      return Promise.resolve();
    } catch {
      const errorMessage = `Cannot send to trash ${itemPath}`;
      this._logger.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }

  private async copyItem(itemPath: string, destinationFolder: string): Promise<void> {
    const fileName = basename(itemPath);
    const destinationFilePath = join(destinationFolder, fileName);

    try {
      copyFileSync(itemPath, destinationFilePath);
      return Promise.resolve();
    } catch {
      const errorMessage = `Cannot copy ${itemPath} to ${destinationFolder}`;
      this._logger.error(errorMessage);
      return Promise.reject(errorMessage);
    }
  }

  private async moveItem(
    itemDirectory: string,
    itemName: string,
    destinationDirectory: string
  ): Promise<void> {
    const itemPath = join(itemDirectory, itemName);
    const newItemPath = join(destinationDirectory, itemName);

    try {
      moveFile(itemPath, newItemPath);
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  }
}

export { DirectoryManager };
