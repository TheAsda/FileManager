import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { CacheProvider, useCache, Cache } from '../useCache';
import { FileInfo } from '@fm/common';

describe('Cache test', () => {
  const wrapper = ({ children }: { children?: any }) => (
    <CacheProvider>{children}</CacheProvider>
  );
  test('Add one item to new cache', () => {
    const { result } = renderHook(() => useCache(), { wrapper });
    const newPath = 'D:/';
    const folderInfo: FileInfo[] = [
      {
        name: 'test.txt',
        created: new Date(),
        path: 'D:/',
        size: 10,
        type: 'file',
        accessible: true,
      },
    ];

    const resultData: Cache = {
      [newPath]: folderInfo,
    };

    act(() => {
      result.current.updateStorage(newPath, folderInfo);
    });

    expect(result.current.storage).toEqual(resultData);
  });

  test('Add one item and check existence', () => {
    const { result } = renderHook(() => useCache(), { wrapper });
    const newPath = 'D:/';
    const folderInfo: FileInfo[] = [
      {
        name: 'test.txt',
        created: new Date(),
        path: 'D:/',
        size: 10,
        type: 'file',
        accessible: true,
      },
    ];

    act(() => {
      result.current.updateStorage(newPath, folderInfo);
    });

    expect(result.current.getCached(newPath)).toEqual(folderInfo);
    expect(result.current.getCached('Random path')).toBe(null);
  });

  test('Add multiple items at once and check existence', () => {
    const { result } = renderHook(() => useCache(), { wrapper });
    const newPath1 = 'D:/';
    const folderInfo1: FileInfo[] = [
      {
        name: 'test.txt',
        creationDate: new Date(),
        fullPath: 'D:/test.txt',
        size: 10,
        type: 'file',
        parentName: 'D:/',
      },
      {
        name: 'Folder',
        creationDate: new Date(),
        fullPath: 'D:/Folder',
        size: 0,
        type: 'folder',
        parentName: 'D:/',
      },
    ];
    const newPath2 = 'D:/Folder';
    const folderInfo2: FileInfo[] = [
      {
        name: 'image.png',
        creationDate: new Date(),
        fullPath: 'D:/Folder/image.png',
        size: 500,
        type: 'file',
        parentName: 'D:/Folder',
      },
      {
        name: 'text.txt',
        creationDate: new Date(),
        fullPath: 'D:/Folder/text.txt',
        size: 0,
        type: 'folder',
        parentName: 'D:/Folder',
      },
    ];

    act(() => {
      result.current.updateStorage(newPath1, folderInfo1);
    });
    act(() => {
      result.current.updateStorage(newPath2, folderInfo2);
    });

    expect(Object.keys(result.current.storage)).toEqual([newPath1, newPath2]);
    expect(result.current.getCached(newPath1)).toEqual(folderInfo1);
    expect(result.current.getCached(newPath2)).toEqual(folderInfo2);
    expect(result.current.getCached('Random path')).toBe(null);
  });
});
