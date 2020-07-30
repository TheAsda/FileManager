import { IDirectoryManager } from '../DirectoryManager';

const mockedDirectoryManager: IDirectoryManager = {
  listDirectory: jest.fn(),
  createItem: jest.fn(),
  renameItem: jest.fn(),
  deleteItems: jest.fn(),
  sendItemsToTrash: jest.fn(),
  copyItems: jest.fn(),
  moveItems: jest.fn(),
  readFileSync: jest.fn(),
  writeFile: jest.fn(),
  startWatching: jest.fn(),
  stopWatching: jest.fn(),
};

export { mockedDirectoryManager };
