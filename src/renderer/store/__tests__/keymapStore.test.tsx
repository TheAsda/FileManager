import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createEvent } from 'effector';
import { keymapStore, KeymapWrapper, activateScope, useActivateScope } from '../keymapStore';
import { get } from 'lodash';
import { mocked } from 'ts-jest/utils';
import { registerIpc } from '../ipc';

jest.mock('../ipc', () => ({
  registerIpc: jest.fn(),
  sendIpc: jest.fn().mockImplementation(() => {
    return {
      globalAction: ['alt+1'],
      blocksAction: ['alt+2'],
    };
  }),
}));

describe('keymapStore', () => {
  const reset = createEvent();
  keymapStore.reset(reset);
  const globalAction = jest.fn();

  beforeEach(() => {
    reset();
    globalAction.mockClear();
    render(
      <KeymapWrapper
        handlers={{
          globalAction,
        }}
        scope="global"
      >
        <KeymapWrapper scope="blocks">
          <KeymapWrapper handlers={{ blocksAction: jest.fn() }} scope="0" />
          <KeymapWrapper handlers={{ blocksAction: jest.fn() }} scope="1" />
        </KeymapWrapper>
      </KeymapWrapper>
    );
  });

  it('should have scope hierarchy when wrappers rendered', () => {
    expect(get(keymapStore.getState().handlers, 'global')).not.toBeUndefined();
    expect(get(keymapStore.getState().handlers, 'global.blocks')).not.toBeUndefined();
    expect(get(keymapStore.getState().handlers, 'global.blocks.0')).not.toBeUndefined();
    expect(get(keymapStore.getState().handlers, 'global.blocks.1')).not.toBeUndefined();
  });

  it('should set active scope', () => {
    activateScope('global');

    expect(keymapStore.getState().activeScope).toEqual('global');
  });

  it('should activate nested scope with hook', () => {
    reset();
    const wrapper = ({ children }: PropsWithChildren<unknown>) => (
      <KeymapWrapper
        handlers={{
          globalAction,
        }}
        scope="global"
      >
        <KeymapWrapper scope="blocks">{children}</KeymapWrapper>
      </KeymapWrapper>
    );

    const { result } = renderHook(() => useActivateScope(), { wrapper });

    act(() => {
      result.current.activate('inner');
    });

    expect(keymapStore.getState().activeScope).toEqual('global.blocks.inner');
  });

  it('should call handler on message from ipc main if exists', () => {
    const mockedRegisterIpc = mocked(registerIpc);

    expect(mockedRegisterIpc).toHaveBeenCalledTimes(1);

    activateScope('global');

    const handler = mockedRegisterIpc.mock.calls[0][1];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fakeEvent: any = undefined;

    handler(fakeEvent, 'alt+1');

    expect(globalAction).toBeCalledTimes(1);
  });

  it('should not call handler on message from ipc main if does not exist', () => {
    const mockedRegisterIpc = mocked(registerIpc);

    expect(mockedRegisterIpc).toHaveBeenCalledTimes(1);

    activateScope('global');

    const handler = mockedRegisterIpc.mock.calls[0][1];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fakeEvent: any = undefined;

    handler(fakeEvent, 'alt+3');

    expect(globalAction).toBeCalledTimes(0);
  });
});
