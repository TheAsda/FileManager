import React, { ReactNode } from 'react';
import { HotKeysProvider, useHotKeys, HotKeysState, Action } from '../useHotKeys';
import { act, renderHook, HookResult } from '@testing-library/react-hooks';
import { KeyMap, Commands } from '@fm/common';
import { noop } from 'lodash';
import { trigger } from 'mousetrap';

describe('useHotKeys hook tests', () => {
  const wrapper = ({ children }: { children?: ReactNode }) => (
    <HotKeysProvider>{children}</HotKeysProvider>
  );

  let result: HookResult<{
    data: HotKeysState;
    dispatch: React.Dispatch<Action>;
  }>;

  beforeEach(() => {
    result = renderHook(() => useHotKeys(), { wrapper }).result;
  });

  const testKeymap: KeyMap = {
    test1: ['f1'],
    test2: ['f2', 'f3'],
  };

  it('Should be empty', () => {
    expect(result.current.data.hotKeys).toEqual([]);
    expect(result.current.data.keymap).toEqual({});
  });

  it('Should set keymap', () => {
    act(() => {
      result.current.dispatch({
        type: 'setKeyMap',
        keymap: testKeymap,
      });
    });

    expect(result.current.data.keymap).toEqual(testKeymap);
  });

  it('Should set hotkeys', () => {
    const testHotkeys: Commands = {
      test1: noop,
    };

    act(() => {
      result.current.dispatch({
        type: 'setKeyMap',
        keymap: testKeymap,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        hotkeys: testHotkeys,
      });
    });

    expect(result.current.data.hotKeys).toEqual([testHotkeys]);
  });

  it('Should bind hotkeys', () => {
    const func = jest.fn();
    const testHotkeys: Commands = {
      test2: func,
    };

    act(() => {
      result.current.dispatch({
        type: 'setKeyMap',
        keymap: testKeymap,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        hotkeys: testHotkeys,
      });
    });

    trigger('f2');

    expect(func).toBeCalledTimes(1);
  });

  it('Should push hotkeys and call latest one', () => {
    const func = jest.fn();
    const testHotkeys: Commands = {
      test2: func,
    };

    const func2 = jest.fn();
    const testHotkeys2: Commands = {
      test2: func2,
    };

    act(() => {
      result.current.dispatch({
        type: 'setKeyMap',
        keymap: testKeymap,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        hotkeys: testHotkeys,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        hotkeys: testHotkeys2,
        push: true,
      });
    });

    trigger('f2');

    expect(func).toBeCalledTimes(0);
    expect(func2).toBeCalledTimes(1);
  });

  it('Should push hotkeys, pop hotkeys and call latest one', () => {
    const func = jest.fn();
    const testHotkeys: Commands = {
      test2: func,
    };

    const func2 = jest.fn();
    const testHotkeys2: Commands = {
      test2: func2,
    };

    act(() => {
      result.current.dispatch({
        type: 'setKeyMap',
        keymap: testKeymap,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        hotkeys: testHotkeys,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        hotkeys: testHotkeys2,
        push: true,
      });

      result.current.dispatch({
        type: 'setHotKeys',
        pop: true,
      });
    });

    trigger('f2');

    expect(func2).toBeCalledTimes(0);
    expect(func).toBeCalledTimes(1);
  });
});
