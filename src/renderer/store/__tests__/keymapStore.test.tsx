import React from 'react';
import { render } from '@testing-library/react';
import { createEvent } from 'effector';
import { keymapStore, KeymapWrapper, activateScope } from '../keymapStore';
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
      <>
        <KeymapWrapper
          handlers={{
            globalAction,
          }}
          scopePath="global"
        >
          <KeymapWrapper handlers={{ blocksAction: jest.fn() }} scopePath="global.blocks.0" />
          <KeymapWrapper handlers={{ blocksAction: jest.fn() }} scopePath="global.blocks.1" />
        </KeymapWrapper>
      </>
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

  it('should call handler on message from ipc main', () => {
    const mockedRegisterIpc = mocked(registerIpc);

    expect(mockedRegisterIpc).toHaveBeenCalledTimes(1);

    activateScope('global');

    const handler = mockedRegisterIpc.mock.calls[0][1];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fakeEvent: any = undefined;

    handler(fakeEvent, 'alt+1');

    expect(globalAction).toBeCalledTimes(1);
  });

  it('should call handler on message from ipc main', () => {
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
