import 'reflect-metadata';
import { CacheManager, ICacheManager } from '../CacheManager';
import { mockedLogger } from '../__mocks__/LogManager.mock';
import { mockedDirectoryManager } from '../__mocks__/DirectoryManager.mock';
import { constant } from 'lodash';

jest.mock('electron', () => ({
  app: {
    getPath: constant(''),
  },
}));

describe('Cache Manager tests', () => {
  let cacheManager: ICacheManager;
  const mockedWriteFile = jest.fn();

  beforeEach(() => {
    mockedWriteFile.mockReset();
    cacheManager = new CacheManager(mockedLogger, {
      ...mockedDirectoryManager,
      writeFile: mockedWriteFile,
    });
  });

  it('Should be empty', () => {
    expect(cacheManager.cache).toEqual([]);
  });

  it('Should add to cache', () => {
    cacheManager.addToCache('test/path');

    expect(cacheManager.cache).toEqual(['test/path']);
  });

  it('Should save cache', async () => {
    await cacheManager.save();

    expect(mockedWriteFile).toBeCalledTimes(0);

    cacheManager.addToCache('test/path');
    await cacheManager.save();

    expect(mockedWriteFile).toBeCalledTimes(1);

    await cacheManager.save();

    expect(mockedWriteFile).toBeCalledTimes(1);
  });
});
