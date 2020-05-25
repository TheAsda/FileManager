import { Reader } from '../reader';

describe('Reader', () => {
  const reader = new Reader();

  test('Get "D:/" folders', () => {
    const result = reader.getCurrentDir('D:/');
    expect(result.length).not.toBe(0);
  });

  test('Test folder should not be empty', () => {
    const result = reader.getCurrentDir('D:/FileManagerTest/');
    const expectedResult = ['Folder1', 'Folder2', '.gitignore', 'test.txt'];

    expect(result.sort()).toEqual(expectedResult.sort());
  });
});
