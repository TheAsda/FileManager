import { FileType, FileInfo } from '@fm/common';

interface IDirectoryManager {
  /**
   * Returns list of all files in the given folder
   *
   * @param path the path to directory
   */
  listDirectory(path: string): Promise<FileInfo[]>;

  /**
   * Creates an item with itemName of itemType at itemPath
   *
   * @param itemName the name of the item
   * @param itemPath the path of the item
   * @param itemType the type of the item
   */
  createItem(itemName: string, itemPath: string, itemType: FileType): Promise<void>;

  /**
   * Renames item with oldName to newName
   *
   * @param oldName the old name of item
   * @param newName the new name of item
   * @param itemPath the path of the item
   */
  renameItem(oldName: string, newName: string, itemPath: string): Promise<void>;

  /**
   * Deletes the itemsToDelete
   *
   * @param itemsToDelete array of items to delete
   */
  deleteItems(itemsToDelete: FileInfo[]): Promise<void>;

  /**
   * Sends itemsToTrash to trash
   *
   * @param itemsToTrash array of items to send to trash
   */
  sendItemsToTrash(itemsToTrash: FileInfo[]): Promise<void>;

  /**
   * Copies itemToCopy to given destinationFolder
   *
   * @param itemsToCopy the items to copt
   * @param destinationFolder the destination folder
   */
  copyItems(itemsToCopy: FileInfo[], destinationFolder: string): Promise<void>;

  /**
   * Moves itemsToMove to given destinationFolder
   *
   * @param itemsToMove the items to move
   * @param destinationFolder the destination folder
   */
  moveItems(itemsToMove: FileInfo[], destinationFolder: string): Promise<void>;

  /**
   * Reads the content of the given file syncronously
   *
   * @param filePath the path to the file to read
   */
  readFileSync(filePath: string): string;

  /**
   * Writes specified content to the given file
   *
   * @param filePath the path to the file to write
   * @param content the content that should be written to the file
   */
  writeFile(filePath: string, content: string): Promise<void>;

  /**
   * Starts watching pathToWatch and attaches listener to changes
   *
   * @param pathToWatch the path to begin watching
   * @param listener a callback function to invoke when pathToWatch changes
   */
  startWatching(pathToWatch: string, listener: () => void): void;

  /** Stops watching everything */
  stopWatching(): void;
}

export { IDirectoryManager };
