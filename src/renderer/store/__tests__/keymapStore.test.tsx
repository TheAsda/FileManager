import React from 'react';
import { render } from '@testing-library/react';
import { createEvent } from 'effector';
import { keymapStore, KeymapWrapper, activateScope } from '../keymapStore';
import { get } from 'lodash';

jest.mock('../ipc');

describe('keymapStore', () => {
  const reset = createEvent();
  keymapStore.reset(reset);

  beforeEach(() => {
    reset();

    render(
      <>
        <KeymapWrapper
          handlers={{
            globalAction: jest.fn(),
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

  xit('should ', () => {});
});
