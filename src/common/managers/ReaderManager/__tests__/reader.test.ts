import { Reader } from '../reader';
import { FileInfo } from '@fm/common';
jest.mock('fs');

describe('Reader', () => {
  test('Test folder should not be empty', () => {
    const result = Reader.getCurrentDir('D:/');
    const expectedResult: FileInfo[] = [
      {
        name: 'test.txt',
        path: 'D:/',
        size: 11,
        created: new Date('2020-05-25T20:21:04.262Z'),
        type: 'file',
        accessible: true,
      },
      {
        name: 'Folder',
        path: 'D:/',
        size: 0,
        created: new Date('2020-05-25T20:22:02.097Z'),
        type: 'folder',
        accessible: true,
      },
    ];

    expect(result.sort()).toEqual(expectedResult.sort());
  });
});
