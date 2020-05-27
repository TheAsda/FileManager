import React from 'react';
import { KeymapProvider, useKeymap, KeyBinding } from '../useKeymap';
import { renderHook, act } from '@testing-library/react-hooks';
import { bind } from '../__mocks__/mousetrap';

jest.mock('mousetrap');

describe('Keymap test', () => {
  const wrapper = ({ children }: { children?: any }) => (
    <KeymapProvider>{children}</KeymapProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Add one keybinding', () => {
    const { result } = renderHook(() => useKeymap(), { wrapper });
    const newAction = jest.fn();
    const newKey = 'a';
    const newKeymap: KeyBinding = { key: newKey, Action: newAction };

    act(() => {
      result.current.setKeybinding(newKeymap);
    });

    expect(result.current.keymap.length).toBe(1);
    expect(result.current.keymap).toEqual([newKeymap]);
    expect(bind).toBeCalledTimes(1);
  });

  test('Add one keybinding and remove', () => {
    const { result } = renderHook(() => useKeymap(), { wrapper });
    const newAction = jest.fn();
    const newKey = 'a';
    const newKeymap: KeyBinding = { key: newKey, Action: newAction };

    act(() => {
      result.current.setKeybinding(newKeymap);
    });

    act(() => {
      result.current.unsetKeybinding(newKey);
    });

    expect(result.current.keymap.length).toBe(0);
    expect(result.current.keymap).toEqual([]);
    expect(bind).toBeCalledTimes(1);
  });
});
