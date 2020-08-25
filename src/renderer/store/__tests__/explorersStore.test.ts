import { createEvent, createStore, Store } from 'effector';
import {
  destroyExplorer,
  explorersStateStore,
  explorersStore,
  ExplorerStore,
  mountExplorerEvents,
  resizeExplorers,
  spawnExplorer,
  toggleExplorers,
} from '../explorersStore';
import { transports } from 'electron-log';
import { platform } from 'os';

transports.console.level = 'error';

describe('Explorers store', () => {
  const reset = createEvent();
  explorersStore.reset(reset);
  beforeEach(() => {
    reset();
  });

  it('should be empty on init', () => {
    expect(explorersStore.getState()).toEqual([]);
  });

  it('should spawn explorers on event call without given path', () => {
    spawnExplorer({});

    expect(explorersStore.getState().length).toBe(1);
    expect(explorersStore.getState()[0].getState().path).toBe(process.cwd());
  });

  it('should spawn explorers on event call with given path', () => {
    spawnExplorer({
      path: 'path/given',
    });

    expect(explorersStore.getState().length).toBe(1);
    expect(explorersStore.getState()[0].getState().path).toBe('path/given');
  });

  it('should not spawn more than two explorers', () => {
    spawnExplorer({});
    spawnExplorer({});

    expect(explorersStore.getState().length).toBe(2);

    spawnExplorer({});

    expect(explorersStore.getState().length).toBe(2);
  });

  it('should destroy spawned explorer', () => {
    spawnExplorer({});

    destroyExplorer(0);
    expect(explorersStore.getState().length).toBe(0);
  });

  it('should not destroy explorer if index does not exist', () => {
    spawnExplorer({});

    destroyExplorer(1);
    expect(explorersStore.getState().length).toBe(1);
  });

  describe('Explorer store events', () => {
    let store: Store<ExplorerStore>;

    beforeEach(() => {
      store = createStore<ExplorerStore>({
        height: 0,
        path: '',
      });
    });

    it('should be mounted', () => {
      const mockedOn = jest.fn();
      store.on = mockedOn;

      mountExplorerEvents(store);

      expect(mockedOn.mock.calls.length).toBe(2);
    });

    it('should should resize', () => {
      const events = mountExplorerEvents(store);

      events.resizeExplorer(10);
      expect(store.getState().height).toBe(10);

      events.resizeExplorer(777);
      expect(store.getState().height).toBe(777);
    });

    it('should should change path', () => {
      const events = mountExplorerEvents(store);

      events.changePath('changed/path');
      const path = store.getState().path;
      if (platform() === 'win32') {
        expect(path).toBe('changed\\path');
      } else if (platform() === 'linux') {
        expect(path).toBe('changed/path');
      } else {
        throw new Error('OS not supported');
      }

      events.changePath('new/changed/path');

      const newPath = store.getState().path;
      if (platform() === 'win32') {
        expect(newPath).toBe('new\\changed\\path');
      } else if (platform() === 'linux') {
        expect(newPath).toBe('new/changed/path');
      } else {
        throw new Error('OS not supported');
      }
    });
  });

  describe('Explorer state store', () => {
    const reset = createEvent();
    explorersStateStore.reset(reset);

    beforeEach(() => {
      reset();
    });

    it('should resize on event call', () => {
      resizeExplorers(123);

      expect(explorersStateStore.getState().width).toBe(123);

      resizeExplorers(456);

      expect(explorersStateStore.getState().width).toBe(456);
    });

    it('should toggle on event call', () => {
      const initialHidden = explorersStateStore.getState().hidden;

      toggleExplorers();

      expect(explorersStateStore.getState().hidden).toBe(!initialHidden);

      toggleExplorers();

      expect(explorersStateStore.getState().hidden).toBe(initialHidden);
    });
  });
});
