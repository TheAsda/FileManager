import { Reader } from '../reader';
import { FileInfo } from '@fm/explorer';
jest.mock('fs');

describe('Reader', () => {
  test('Test folder should not be empty', () => {
    const result = Reader.getCurrentDir('D:/');
    const expectedResult: FileInfo[] = [
      {
        name: 'test.txt',
        fullPath: 'D:/test.txt',
        size: 11,
        creationDate: new Date('2020-05-25T20:21:04.262Z'),
        type: 'file',
        parentName: 'D:/',
      },
      {
        name: 'Folder',
        fullPath: 'D:/Folder',
        size: 0,
        creationDate: new Date('2020-05-25T20:22:02.097Z'),
        type: 'folder',
        parentName: 'D:/',
      },
    ];

    expect(result.sort()).toEqual(expectedResult.sort());
  });
});
