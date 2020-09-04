import { useValidatedContext } from '../useValidatedContext';
import { renderHook } from '@testing-library/react-hooks';
import React, { createContext, PropsWithChildren } from 'react';

const Context = createContext<string | undefined>(undefined);

describe('useValidatedContext', () => {
  test('should work as original useContext', () => {
    const wrapper = ({ children }: PropsWithChildren<unknown>) => (
      <Context.Provider value={'TEST'}>{children}</Context.Provider>
    );

    const { result } = renderHook(() => useValidatedContext(Context), { wrapper });

    expect(result.current).toEqual('TEST');
  });

  test('should throw error without wrapper', () => {
    const { result } = renderHook(() => useValidatedContext(Context));

    expect(result.error).not.toBeUndefined();
  });
});
