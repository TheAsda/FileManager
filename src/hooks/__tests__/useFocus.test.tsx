import React, { ReactNode } from 'react';
import { FocusProvider, useFocus, FocusState, Action } from '../useFocus';
import { renderHook, act, HookResult } from '@testing-library/react-hooks';

describe('useFocus hook tests', () => {
  const wrapper = ({ children }: { children?: ReactNode }) => (
    <FocusProvider>{children}</FocusProvider>
  );

  let result: HookResult<{
    data: FocusState;
    dispatch: React.Dispatch<Action>;
  }>;

  beforeEach(() => {
    result = renderHook(() => useFocus(), { wrapper }).result;
  });

  it('Should focus panel', () => {
    act(() => {
      result.current.dispatch({
        type: 'focusPanel',
        item: 'explorer',
      });
    });

    expect(result.current.data.focusedPanel).toEqual('explorer');
    expect(result.current.data.index).toBe(0);
  });

  it('Should focus item', () => {
    act(() => {
      result.current.dispatch({
        type: 'focusItem',
        index: 0,
      });
    });

    expect(result.current.data.index).toBe(0);

    act(() => {
      result.current.dispatch({
        type: 'focusItem',
        index: 1,
      });
    });

    expect(result.current.data.index).toBe(1);
  });

  it('Should toggle item', () => {
    act(() => {
      result.current.dispatch({
        type: 'focusItem',
        index: 0,
      });

      result.current.dispatch({
        type: 'toggleItem',
      });
    });

    expect(result.current.data.index).toBe(1);
  });

  it('Should toggle panels', () => {
    act(() => {
      result.current.dispatch({
        type: 'focusPanel',
        item: 'explorer',
      });

      result.current.dispatch({
        type: 'togglePanel',
      });
    });

    expect(result.current.data.focusedPanel).toEqual('preview');
    expect(result.current.data.index).toBe(undefined);

    act(() => {
      result.current.dispatch({
        type: 'togglePanel',
      });
    });

    expect(result.current.data.focusedPanel).toEqual('terminal');
    expect(result.current.data.index).toBe(0);

    act(() => {
      result.current.dispatch({
        type: 'togglePanel',
      });
    });

    expect(result.current.data.focusedPanel).toEqual('explorer');
    expect(result.current.data.index).toBe(0);
  });
});
