import { Reader } from '../reader';
import { IFile } from '@fm';
jest.mock('fs');

describe('Reader', () => {
  const reader = new Reader();

  test('Test folder should not be empty', () => {
    const result = reader.getCurrentDir('D:/');
    const expectedResult: IFile[] = [
      {
        name: 'test.txt',
        fullPath: 'D:/test.txt',
        size: 11,
        creationDate: new Date('2020-05-25T20:21:04.262Z'),
        type: 'file',
      },
      {
        name: 'Folder',
        fullPath: 'D:/Folder',
        size: 0,
        creationDate: new Date('2020-05-25T20:22:02.097Z'),
        type: 'folder',
      },
    ];

    expect(result.sort()).toEqual(expectedResult.sort());
  });
});
