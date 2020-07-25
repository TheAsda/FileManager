import React, { ReactNode } from 'react';
import { act, renderHook, HookResult } from '@testing-library/react-hooks';
import { CommandsProvider, useCommands, Action } from '../useCommands';
import { Commands } from '@fm/common';
import { noop } from 'lodash';

describe('useCommands hook test', () => {
  const wrapper = ({ children }: { children?: ReactNode }) => (
    <CommandsProvider>{children}</CommandsProvider>
  );

  let result: HookResult<{
    data: Commands;
    dispatch: React.Dispatch<Action>;
  }>;

  const testCommands: Commands = {
    'Test 1': noop,
    'Test 2': noop,
  };

  beforeEach(() => {
    result = renderHook(() => useCommands(), { wrapper }).result;
  });

  it('Shoult be empty', () => {
    expect(result.current.data).toEqual({});
  });

  it('Should add commands', () => {
    act(() => {
      result.current.dispatch({
        type: 'add',
        items: testCommands,
      });
    });

    expect(result.current.data).toEqual(testCommands);
  });

  it('Should remove commands', () => {
    act(() => {
      result.current.dispatch({
        type: 'add',
        items: testCommands,
      });

      result.current.dispatch({
        type: 'remove',
        items: ['Test 1'],
      });
    });

    expect(result.current.data).toEqual({
      'Test 2': noop,
    });
  });

  it('Should empty commands', () => {
    act(() => {
      result.current.dispatch({
        type: 'add',
        items: testCommands,
      });

      result.current.dispatch({
        type: 'empty',
      });
    });

    expect(result.current.data).toEqual({});
  });
});
