import { createEvent, createStore, Store } from 'effector';
import {
  destroyTerminal,
  mountTerminalEvents,
  resizeTerminals,
  spawnTerminal,
  terminalsEventsStore,
  terminalsStateStore,
  terminalsStore,
  TerminalStore,
  toggleTerminals,
} from '../terminalsStore';
import { transports } from 'electron-log';
import { TerminalManager } from '@fm/common';

transports.console.level = 'error';

jest.mock('node-pty', () => ({
  spawn: jest.fn(() => ({
    pid: 1,
    write: jest.fn(),
  })),
}));

describe('Terminals store', () => {
  const reset = createEvent();
  terminalsStore.reset(reset);
  const resetEvents = createEvent();
  terminalsEventsStore.reset(resetEvents);

  beforeEach(() => {
    reset();
    resetEvents();
  });

  it('should be empty on init', () => {
    expect(terminalsStore.getState()).toEqual([]);
  });

  it('should spawn terminal on event call without given path', () => {
    spawnTerminal({});

    expect(terminalsStore.getState().length).toBe(1);
  });

  it('should spawn terminal on event call with given path', () => {
    spawnTerminal({
      path: 'path/given',
    });

    expect(terminalsStore.getState().length).toBe(1);
  });

  it('should not spawn more than two terminals', () => {
    spawnTerminal({});
    spawnTerminal({});

    expect(terminalsStore.getState().length).toBe(2);

    spawnTerminal({});

    expect(terminalsStore.getState().length).toBe(2);
  });

  it('should destroy spawned terminals', () => {
    spawnTerminal({});

    destroyTerminal(0);
    expect(terminalsStore.getState().length).toBe(0);
  });

  it('should not destroy terminal if index does not exist', () => {
    spawnTerminal({});

    destroyTerminal(1);
    expect(terminalsStore.getState().length).toBe(1);
  });

  describe('Terminal store events', () => {
    let store: Store<TerminalStore>;

    beforeEach(() => {
      store = createStore<TerminalStore>({
        height: 0,
        manager: new TerminalManager(),
      });
    });

    it('should be mounted', () => {
      const mockedOn = jest.fn();
      store.on = mockedOn;

      mountTerminalEvents(store);

      expect(mockedOn.mock.calls.length).toBe(2);
    });

    it('should should resize', () => {
      const events = mountTerminalEvents(store);

      events.resizeTerminal(10);
      expect(store.getState().height).toBe(10);

      events.resizeTerminal(777);
      expect(store.getState().height).toBe(777);
    });
  });

  describe('Terminal state store', () => {
    const reset = createEvent();
    terminalsStateStore.reset(reset);

    beforeEach(() => {
      reset();
    });

    it('should resize on event call', () => {
      resizeTerminals(123);

      expect(terminalsStateStore.getState().width).toBe(123);

      resizeTerminals(456);

      expect(terminalsStateStore.getState().width).toBe(456);
    });

    it('should toggle on event call', () => {
      const initialHidden = terminalsStateStore.getState().hidden;

      toggleTerminals();

      expect(terminalsStateStore.getState().hidden).toBe(!initialHidden);

      toggleTerminals();

      expect(terminalsStateStore.getState().hidden).toBe(initialHidden);
    });
  });
});
